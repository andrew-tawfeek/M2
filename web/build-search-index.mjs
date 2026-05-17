import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "web", "search-index.json");
const skipDirs = new Set([".git", "_site"]);
const sourceRoots = [
  "M2/Macaulay2/bin",
  "M2/Macaulay2/c",
  "M2/Macaulay2/d",
  "M2/Macaulay2/e",
  "M2/Macaulay2/m2",
  "M2/Macaulay2/system"
];
const sourceExtensions = new Set([".c", ".cc", ".cpp", ".d", ".dd", ".h", ".hh", ".hpp", ".m2"]);

function isMarkdownPath(filePath) {
  const base = path.basename(filePath);
  return filePath.endsWith(".md") || base === "README" || base.startsWith("README.");
}

function isSourcePath(relativePath) {
  const extension = path.extname(relativePath);
  return sourceExtensions.has(extension) && sourceRoots.some((sourceRoot) => relativePath.startsWith(`${sourceRoot}/`));
}

function titleFromMarkdown(markdown, fallback) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    const atx = trimmed.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (atx) return atx[1].replace(/`/g, "");
    if (trimmed && /^(=+|-{3,})$/.test((lines[index + 1] || "").trim())) {
      return trimmed.replace(/`/g, "");
    }
  }
  return fallback;
}

function definitionKind(relativePath, line) {
  if (/\.(?:c|cc|cpp|h|hh|hpp)$/.test(relativePath)) {
    if (/\b(?:class|struct)\s+[A-Za-z_]\w*/.test(line)) return "C++ type";
    if (/\benum\s+(?:class\s+)?[A-Za-z_]\w*/.test(line)) return "C++ enum";
    if (/^\s*(?:using|typedef)\s+/.test(line)) return "C++ alias";
    return "C++ definition";
  }

  if (relativePath.endsWith(".m2")) {
    if (/\bnew\s+(?:WrapperType|Type|HeaderType|SelfInitializingType)\b/.test(line)) return "M2 type";
    if (/\bmethod\b/.test(line)) return "M2 method";
    return "M2 definition";
  }

  if (/function\s*\(/.test(line)) return "d function type";
  if (/:=\s*(?:\{\+?|\(|null or|array\s*\()/.test(line)) return "d type";
  return "d definition";
}

function captureDefinition(line, relativePath) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("--") || trimmed.startsWith("//") || trimmed.startsWith("*")) return null;

  const dFunction = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_']*)\s*\([^)]*\)\s*(?::\s*[^:=]+)?\s*:=/);
  if (dFunction && /\.(?:d|dd)$/.test(relativePath)) return dFunction[1];

  const dValue = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_']*)\s*:=\s*/);
  if (dValue && /\.(?:d|dd)$/.test(relativePath)) return dValue[1];

  const m2Type = trimmed.match(/^([A-Za-z_][A-Za-z0-9_']*)\s*=\s*new\s+(?:WrapperType|Type|HeaderType|SelfInitializingType)\b/);
  if (m2Type && relativePath.endsWith(".m2")) return m2Type[1];

  const m2Method = trimmed.match(/^([A-Za-z_][A-Za-z0-9_']*)\s*=\s*method\b/);
  if (m2Method && relativePath.endsWith(".m2")) return m2Method[1];

  const cppType = trimmed.match(/^(?:template\s*<[^>]+>\s*)?(?:class|struct)\s+([A-Za-z_]\w*)\b/);
  if (cppType && /\.(?:c|cc|cpp|h|hh|hpp)$/.test(relativePath)) return cppType[1];

  const cppEnum = trimmed.match(/^enum\s+(?:class\s+)?([A-Za-z_]\w*)\b/);
  if (cppEnum && /\.(?:c|cc|cpp|h|hh|hpp)$/.test(relativePath)) return cppEnum[1];

  const cppUsing = trimmed.match(/^using\s+([A-Za-z_]\w*)\s*=/);
  if (cppUsing && /\.(?:c|cc|cpp|h|hh|hpp)$/.test(relativePath)) return cppUsing[1];

  const cppTypedef = trimmed.match(/^typedef\s+.+?\b([A-Za-z_]\w*)\s*;/);
  if (cppTypedef && /\.(?:c|cc|cpp|h|hh|hpp)$/.test(relativePath)) return cppTypedef[1];

  return null;
}

function definitionsFromSource(text, relativePath) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line, index) => {
      const symbol = captureDefinition(line, relativePath);
      if (!symbol) return null;
      return {
        symbol,
        kind: definitionKind(relativePath, line),
        path: relativePath,
        line: index + 1,
        signature: line.trim()
      };
    })
    .filter(Boolean);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && !skipDirs.has(entry.name)) {
        files.push(...(await walk(fullPath)));
      }
    } else if (entry.isFile() && !entry.name.startsWith(".")) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = (await walk(root)).sort((a, b) => a.localeCompare(b));
const documents = [];
const definitions = [];

for (const filePath of files) {
  const relativePath = path.relative(root, filePath).split(path.sep).join("/");
  if (!isMarkdownPath(filePath) && !isSourcePath(relativePath)) continue;

  const text = await readFile(filePath, "utf8");
  if (isMarkdownPath(filePath)) {
    documents.push({
      path: relativePath,
      title: titleFromMarkdown(text, relativePath),
      text
    });
  }
  if (isSourcePath(relativePath)) {
    definitions.push(...definitionsFromSource(text, relativePath));
  }
}

await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), documents, definitions })}\n`);
console.log(
  `Indexed ${documents.length} markdown files and ${definitions.length} source definitions in ${path.relative(
    root,
    outputPath
  )}`
);

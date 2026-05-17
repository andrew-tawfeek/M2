import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "web", "search-index.json");
const skipDirs = new Set([".git", "_site"]);

function isMarkdownPath(filePath) {
  const base = path.basename(filePath);
  return filePath.endsWith(".md") || base === "README" || base.startsWith("README.");
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

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && !skipDirs.has(entry.name)) {
        files.push(...(await walk(fullPath)));
      }
    } else if (entry.isFile() && !entry.name.startsWith(".") && isMarkdownPath(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = (await walk(root)).sort((a, b) => a.localeCompare(b));
const documents = [];

for (const filePath of files) {
  const relativePath = path.relative(root, filePath).split(path.sep).join("/");
  const text = await readFile(filePath, "utf8");
  documents.push({
    path: relativePath,
    title: titleFromMarkdown(text, relativePath),
    text
  });
}

await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), documents })}\n`);
console.log(`Indexed ${documents.length} markdown files in ${path.relative(root, outputPath)}`);

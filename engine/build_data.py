#!/usr/bin/env python3
"""Build nodes/edges JSON for the engine layout visualizer.

Walks M2/Macaulay2/e (top level only) and packages
each source unit (a .cpp/.hpp/.h/.c family with the same stem) into a
single node. Pulls a short description from the corresponding
file-<stem>.md when available, and parses #include directives to
determine dependencies between top-level units. Subdirectories
(NCAlgebras/, f4/, gb-f4/, etc.) become single collapsed nodes so the
top level stays the focus. Also indexes M2/Macaulay2/d sources that
touch engine files through headers or Raw* bridge types."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
E_DIR = ROOT / "M2" / "Macaulay2" / "e"
D_DIR = ROOT / "M2" / "Macaulay2" / "d"
OUT = ROOT / "engine" / "data.json"
OUT_JS = ROOT / "engine" / "data.js"

SRC_EXTS = {".cpp", ".hpp", ".h", ".c", ".cc"}
D_SRC_EXTS = {".d", ".dd", ".c", ".h", ".cpp"}
# external/symlinked submodules — list as a single node each, but don't try to parse them
SUBMODULE_DIRS = {"mathic", "mathicgb", "memtailor"}
# real subdirs we want to surface as collapsed nodes
SUBDIRS = {
    "NCAlgebras", "NCResolutions", "bibasis", "f4", "gb-f4",
    "interface", "schreyer-resolution", "unit-tests", "doxygen-settings",
}

INCLUDE_RE = re.compile(r'#\s*include\s*[<"]([^">]+)[">]')
RAW_POINTER_RE = re.compile(
    r'\bexport\s+(?P<raw>Raw[A-Za-z0-9_]+)\s*:=\s*Pointer\s+"'
    r'(?:const\s+)?(?:struct|class)\s+(?P<class>[A-Za-z_]\w*)\s*\*"'
)
RAW_TOKEN_RE = re.compile(r'\bRaw[A-Za-z0-9_]+\b')
RAW_DERIVED_SUFFIXES = (
    "ArrayArrayOrNull",
    "ArrayArray",
    "ArrayOrNull",
    "Array",
    "PairOrNull",
    "Pair",
    "OrNull",
    "Cell",
    "AndInt",
)

INTERFACE_HEADER_ALIASES = {
    "aring": "aring",
    "freemodule": "freemod",
    "matrix": "matrix",
    "monoid": "monoid",
    "monomial-ideal": "monideal",
    "monomial-ordering": "monordering",
    "mutable-matrix": "mat",
    "NAG": "NAG",
    "ring": "ring",
    "ringelement": "ringelem",
    "ringmap": "ringmap",
}

# After comment-stripping, find each "class NAME" or "struct NAME" occurrence
# along with whether it's preceded by "friend" and what punctuation comes
# next (";" → forward decl, "{" → definition).
CLASS_HEAD_RE = re.compile(
    r'(?P<friend>\bfriend\s+)?\b(?P<kind>class|struct)\s+(?P<name>[A-Za-z_]\w*)\b'
)
BLOCK_COMMENT_RE = re.compile(r'/\*.*?\*/', re.DOTALL)
LINE_COMMENT_RE = re.compile(r'//[^\n]*')
STRING_RE = re.compile(r'"(?:\\.|[^"\\])*"')


def list_top_level_units():
    """Group top-level source files by stem."""
    units = {}
    for p in sorted(E_DIR.iterdir()):
        if not p.is_file():
            continue
        if p.suffix not in SRC_EXTS:
            continue
        stem = p.stem
        units.setdefault(stem, []).append(p.name)
    return units


def find_description_md(stem):
    """Find an associated file-<stem>.md, trying a few naming patterns."""
    candidates = [
        E_DIR / f"file-{stem}.md",
        E_DIR / f"file-{stem.lower()}.md",
        E_DIR / f"file-{stem}-cpp.md",
        E_DIR / f"file-{stem}-h.md",
        E_DIR / f"file-{stem}-hpp.md",
    ]
    # Special-case stems that the docs collapse together
    aliases = {
        "comp": "comp",
        "comp-gb": "comp-gb",
        "comp-res": "comp-res",
        "engine": "engine-cpp",
        "engine-includes": "engine-includes-hpp",
    }
    if stem in aliases:
        candidates.insert(0, E_DIR / f"file-{aliases[stem]}.md")
    for c in candidates:
        if c.exists():
            return c
    return None


HEADING_RE = re.compile(r"^#\s+")


def extract_summary(md_path):
    """Pull a 1-2 sentence summary from the markdown doc."""
    try:
        text = md_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""
    lines = text.splitlines()
    # Skip the H1 line(s)
    body = []
    seen_heading = False
    for ln in lines:
        if HEADING_RE.match(ln):
            if seen_heading:
                break
            seen_heading = True
            continue
        if not seen_heading:
            continue
        s = ln.strip()
        # skip the "Part of …" / "← …" navigation lines
        if not s:
            if body:
                break
            continue
        if s.startswith("Part of") or s.startswith("[←"):
            continue
        if s.startswith("```"):
            break
        body.append(s)
    raw = " ".join(body)
    # strip markdown link syntax: [text](href) -> text
    raw = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", raw)
    # strip inline backticks
    raw = raw.replace("`", "")
    # take up to ~2 sentences
    parts = re.split(r"(?<=[.!?])\s+", raw)
    summary = " ".join(parts[:2]).strip()
    if len(summary) > 360:
        summary = summary[:357].rstrip() + "..."
    return summary


def parse_includes(paths):
    """Return set of include targets."""
    out = set()
    for p in paths:
        try:
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                for ln in f:
                    include_start = ln.find("#")
                    if include_start == -1:
                        continue
                    before = ln[:include_start].lstrip()
                    if before.startswith("//") or before.startswith("/*") or before.startswith("*"):
                        continue
                    for m in INCLUDE_RE.finditer(ln):
                        out.add(m.group(1))
        except OSError:
            continue
    return out


def _strip_comments_and_strings(text):
    """Strip /*…*/ block comments, // line comments, and "…" string
    literals. Avoids false positives like class names appearing in
    comments or in stringified code."""
    text = BLOCK_COMMENT_RE.sub("", text)
    text = LINE_COMMENT_RE.sub("", text)
    text = STRING_RE.sub('""', text)
    return text


def _next_significant_char(text, start):
    """Return the next character in {';', '{'} after position `start`,
    skipping over balanced angle-bracketed and parenthesised regions
    (e.g. "class Foo : public Bar<int, baz()> { ... }"). Returns
    (char, position) or (None, -1) if not found."""
    i = start
    n = len(text)
    while i < n:
        c = text[i]
        if c == ';' or c == '{':
            return c, i
        if c == '<' or c == '(':
            # find matching close, accounting for nesting
            stack = [c]
            i += 1
            while i < n and stack:
                ch = text[i]
                if ch == '<' or ch == '(' or ch == '[':
                    stack.append(ch)
                elif ch == '>' or ch == ')' or ch == ']':
                    if stack:
                        stack.pop()
                i += 1
            continue
        i += 1
    return None, -1


def parse_class_defs_and_decls(paths):
    """Return (defs, decls): two sets of class/struct names.

    A class is a *definition* if its head (`class Foo : public Bar ...`)
    is followed by `{`. It is a *forward declaration* if followed by `;`
    (and not preceded by `friend`)."""
    defs = set()
    decls = set()
    for p in paths:
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        text = _strip_comments_and_strings(text)
        for m in CLASS_HEAD_RE.finditer(text):
            is_friend = bool(m.group("friend"))
            name = m.group("name")
            ch, _ = _next_significant_char(text, m.end())
            if ch == ';' and not is_friend:
                decls.add(name)
            elif ch == '{' and not is_friend:
                defs.add(name)
    return defs, decls


def parse_class_defs(paths):
    defs, _ = parse_class_defs_and_decls(paths)
    return defs


def parse_forward_decls(paths):
    _, decls = parse_class_defs_and_decls(paths)
    return decls


def list_d_sources():
    if not D_DIR.exists():
        return []
    return [
        p for p in sorted(D_DIR.iterdir())
        if p.is_file() and p.suffix in D_SRC_EXTS
    ]


def source_paths_for_node(node):
    if node["kind"] == "unit":
        return [E_DIR / f for f in node["files"]]
    if node["kind"] == "subdir" and node["subdir"]:
        sub_path = E_DIR / node["subdir"]
        if not sub_path.exists():
            return []
        try:
            return [
                p for p in sorted(sub_path.rglob("*"))
                if p.is_file() and p.suffix in SRC_EXTS
            ]
        except OSError:
            return []
    return []


def build_class_to_node_for_d_uses(nodes, class_to_node):
    out = dict(class_to_node)
    for node in nodes:
        if node["kind"] != "subdir":
            continue
        for cls in parse_class_defs(source_paths_for_node(node)):
            out.setdefault(cls, node["id"])
    return out


def build_raw_type_to_node(class_to_node):
    raw_to_node = {}
    engine_dd = D_DIR / "engine.dd"
    try:
        text = engine_dd.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return raw_to_node
    for m in RAW_POINTER_RE.finditer(text):
        node_id = class_to_node.get(m.group("class"))
        if node_id:
            raw_to_node[m.group("raw")] = node_id
    return raw_to_node


def resolve_include_nodes(inc, basename_to_node, node_ids):
    targets = set()
    if inc in basename_to_node:
        targets.add(basename_to_node[inc])
    base = Path(inc).name
    if base in basename_to_node:
        targets.add(basename_to_node[base])
    if inc.startswith("interface/"):
        stem = Path(inc).stem
        alias = INTERFACE_HEADER_ALIASES.get(stem)
        if alias in node_ids:
            targets.add(alias)
        if "dir:interface" in node_ids:
            targets.add("dir:interface")
    return {target for target in targets if target in node_ids}


def raw_token_node(token, raw_to_node, raw_roots):
    if token in raw_to_node:
        return raw_to_node[token]
    for raw in raw_roots:
        if not token.startswith(raw):
            continue
        suffix = token[len(raw):]
        if suffix in RAW_DERIVED_SUFFIXES:
            return raw_to_node[raw]
    return None


def add_d_match(matches, node_id, reason):
    matches.setdefault(node_id, set()).add(reason)


def build_d_uses(nodes, basename_to_node, class_to_node):
    node_ids = {node["id"] for node in nodes}
    class_to_d_node = build_class_to_node_for_d_uses(nodes, class_to_node)
    raw_to_node = build_raw_type_to_node(class_to_d_node)
    raw_roots = sorted(raw_to_node, key=len, reverse=True)

    d_uses = []
    d_uses_by_engine = {node_id: [] for node_id in node_ids}
    for path in list_d_sources():
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue

        matches = {}
        for inc in parse_includes([path]):
            for node_id in resolve_include_nodes(inc, basename_to_node, node_ids):
                add_d_match(matches, node_id, f"#include <{inc}>")

        for token in sorted(set(RAW_TOKEN_RE.findall(text))):
            node_id = raw_token_node(token, raw_to_node, raw_roots)
            if node_id:
                add_d_match(matches, node_id, token)

        if not matches:
            continue

        rel_path = path.relative_to(ROOT).as_posix()
        entry = {
            "file": path.name,
            "path": rel_path,
            "engineNodes": sorted(matches),
            "matches": [
                {"node": node_id, "via": sorted(via)}
                for node_id, via in sorted(matches.items())
            ],
        }
        d_uses.append(entry)
        for node_id, via in matches.items():
            d_uses_by_engine[node_id].append({
                "file": path.name,
                "path": rel_path,
                "via": sorted(via),
            })

    d_uses.sort(key=lambda item: item["file"])
    d_uses_by_engine = {
        node_id: sorted(entries, key=lambda item: item["file"])
        for node_id, entries in sorted(d_uses_by_engine.items())
        if entries
    }
    return d_uses, d_uses_by_engine


def main():
    units = list_top_level_units()  # stem -> [filenames]

    # Map every source-file basename (top-level or in known subdir) to
    # the node it belongs to. Use this for include resolution.
    basename_to_node = {}
    nodes = []

    for stem, files in units.items():
        node_id = stem
        node = {
            "id": node_id,
            "label": f"{stem}.{{{','.join(sorted({Path(f).suffix.lstrip('.') for f in files}))}}}",
            "files": sorted(files),
            "kind": "unit",
            "subdir": None,
        }
        md = find_description_md(stem)
        node["summary"] = extract_summary(md) if md else ""
        node["doc"] = md.name if md else None
        nodes.append(node)
        for f in files:
            basename_to_node[f] = node_id

    # Add subdirectory nodes (collapsed) for both real subdirs and submodule symlinks
    for sub in sorted(SUBDIRS | SUBMODULE_DIRS):
        sub_path = E_DIR / sub
        if not sub_path.exists():
            continue
        node_id = f"dir:{sub}"
        # Try a README
        readme = sub_path / "README.md"
        summary = ""
        if readme.exists():
            summary = extract_summary(readme)
        if not summary and sub in SUBMODULE_DIRS:
            summary = f"External submodule (symlink to ../../submodules/{sub}/src)."
        nodes.append({
            "id": node_id,
            "label": f"{sub}/",
            "files": [],
            "kind": "subdir",
            "subdir": sub,
            "summary": summary,
            "doc": f"{sub}/README.md" if readme.exists() else None,
        })
        # Map basenames inside this subdir to the subdir node so includes
        # like "f4/F4.hpp" or "f4/F4.h" resolve to the dir node.
        try:
            for child in sub_path.rglob("*"):
                if child.is_file() and child.suffix in SRC_EXTS:
                    # Both "F4.hpp" and "f4/F4.hpp" should resolve to dir:f4
                    rel = child.relative_to(sub_path)
                    basename_to_node[f"{sub}/{rel.as_posix()}"] = node_id
                    basename_to_node[child.name] = basename_to_node.get(child.name, node_id)
        except OSError:
            pass

    # Build a class-name -> providing-node-id index. We only look at
    # top-level unit files for class definitions because forward
    # declarations in the engine almost always refer to top-level types.
    class_to_node = {}
    unit_paths_for_node = {}
    for node in nodes:
        if node["kind"] != "unit":
            continue
        paths = source_paths_for_node(node)
        unit_paths_for_node[node["id"]] = paths
        for cls in parse_class_defs(paths):
            # First definer wins; if a class appears in multiple places
            # (rare; usually a definition + a re-declaration in a different
            # namespace) we keep the first.
            class_to_node.setdefault(cls, node["id"])

    # Build edges:
    #  - "include" edges from #include directives  (solid)
    #  - "decl"    edges from `class X;` / `struct X;` forward declarations
    #              that resolve to a known providing node, AND for which
    #              we did NOT already include that node (otherwise the
    #              forward decl is redundant noise alongside the include)
    edges = []
    seen_edges = set()
    for node in nodes:
        if node["kind"] != "unit":
            continue
        paths = unit_paths_for_node[node["id"]]
        includes = parse_includes(paths)
        include_targets = set()
        for inc in includes:
            target = None
            if inc in basename_to_node:
                target = basename_to_node[inc]
            else:
                base = Path(inc).name
                if base in basename_to_node:
                    target = basename_to_node[base]
            if not target or target == node["id"]:
                continue
            include_targets.add(target)
            key = (node["id"], target, "include")
            if key in seen_edges:
                continue
            seen_edges.add(key)
            edges.append({"source": node["id"], "target": target, "kind": "include"})
        # Forward declarations
        for cls in parse_forward_decls(paths):
            target = class_to_node.get(cls)
            if not target or target == node["id"]:
                continue
            if target in include_targets:
                # Already a direct include — the fwd decl is just internal
                # tidiness, not a separate dependency.
                continue
            key = (node["id"], target, "decl")
            if key in seen_edges:
                continue
            seen_edges.add(key)
            edges.append({"source": node["id"], "target": target, "kind": "decl"})

    d_uses, d_uses_by_engine = build_d_uses(nodes, basename_to_node, class_to_node)

    payload = {"nodes": nodes, "edges": edges, "dUses": d_uses, "dUsesByEngine": d_uses_by_engine}
    OUT.write_text(json.dumps(payload, indent=1))
    OUT_JS.write_text("window.ENGINE_DATA = " + json.dumps(payload) + ";\n")
    print(
        f"wrote {len(nodes)} nodes / {len(edges)} edges / "
        f"{len(d_uses)} d-layer users to {OUT} and {OUT_JS}"
    )


if __name__ == "__main__":
    main()

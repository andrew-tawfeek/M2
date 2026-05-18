#!/usr/bin/env python3
"""Build nodes/edges JSON for the engine layout visualizer.

Walks /home/ubuntu/M2-web/M2/Macaulay2/e (top level only) and packages
each source unit (a .cpp/.hpp/.h/.c family with the same stem) into a
single node. Pulls a short description from the corresponding
file-<stem>.md when available, and parses #include directives to
determine dependencies between top-level units. Subdirectories
(NCAlgebras/, f4/, gb-f4/, etc.) become single collapsed nodes so the
top level stays the focus."""

import json
import os
import re
from pathlib import Path

E_DIR = Path("/home/ubuntu/M2-web/M2/Macaulay2/e")
OUT = Path("/home/ubuntu/M2-web/engine/data.json")
OUT_JS = Path("/home/ubuntu/M2-web/engine/data.js")

SRC_EXTS = {".cpp", ".hpp", ".h", ".c", ".cc"}
# external/symlinked submodules — list as a single node each, but don't try to parse them
SUBMODULE_DIRS = {"mathic", "mathicgb", "memtailor"}
# real subdirs we want to surface as collapsed nodes
SUBDIRS = {
    "NCAlgebras", "NCResolutions", "bibasis", "f4", "gb-f4",
    "interface", "schreyer-resolution", "unit-tests", "doxygen-settings",
}

INCLUDE_RE = re.compile(r'^\s*#\s*include\s*[<"]([^">]+)[">]')


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
    """Return set of include targets (just the basename, no dir)."""
    out = set()
    for p in paths:
        try:
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                for ln in f:
                    m = INCLUDE_RE.match(ln)
                    if not m:
                        continue
                    out.add(m.group(1))
                    if ln.strip().startswith("//") or ln.strip().startswith("/*"):
                        continue
        except OSError:
            continue
    return out


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
            "label": f"{stem}.{{ {','.join(sorted({Path(f).suffix.lstrip('.') for f in files})) } }}",
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

    # Build edges from includes. Only count includes that resolve to a
    # node we know about.
    edges = []
    seen_edges = set()
    for node in nodes:
        if node["kind"] != "unit":
            continue
        paths = [E_DIR / f for f in node["files"]]
        includes = parse_includes(paths)
        for inc in includes:
            # Resolve include to a target node
            target = None
            # Direct match (e.g. "matrix.hpp")
            if inc in basename_to_node:
                target = basename_to_node[inc]
            else:
                # Try by stripping leading "../" pieces
                base = Path(inc).name
                if base in basename_to_node:
                    target = basename_to_node[base]
                # Subdir-qualified include like "f4/F4.hpp"
                elif inc in basename_to_node:
                    target = basename_to_node[inc]
            if not target or target == node["id"]:
                continue
            key = (node["id"], target)
            if key in seen_edges:
                continue
            seen_edges.add(key)
            edges.append({"source": node["id"], "target": target})

    payload = {"nodes": nodes, "edges": edges}
    OUT.write_text(json.dumps(payload, indent=1))
    OUT_JS.write_text("window.ENGINE_DATA = " + json.dumps(payload) + ";\n")
    print(f"wrote {len(nodes)} nodes / {len(edges)} edges to {OUT} and {OUT_JS}")


if __name__ == "__main__":
    main()

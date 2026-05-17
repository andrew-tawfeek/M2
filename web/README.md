# Macaulay2 Workspace Map

Static interactive orientation page for mathematician researchers and engineers
working on Macaulay2 internals.

Open `index.html` directly in a browser, or serve the repository root and visit:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/web/
```

## Files

- `index.html` - page shell and controls.
- `styles.css` - layout, tree styling, responsive behavior.
- `app.js` - embedded repository map data and interactions.
- `search-index.json` - generated static search index for markdown/README files.
- `build-search-index.mjs` - regenerates `search-index.json` from the repository.

The map data is summarized from the repository Markdown files, especially the
top-level `README.md`, `M2/README.md`, and the per-directory READMEs under
`M2/Macaulay2/`. The central view is organized around research workflows:
tracing mathematical operations, changing engine algorithms, documenting
subsystems, testing, and iterating through the build.

Regenerate the markdown search index from the repository root with:

```sh
node web/build-search-index.mjs
```

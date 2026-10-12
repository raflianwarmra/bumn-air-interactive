# BUMN Air · Interactive Institutional Models

An interactive explainer of the four BUMN Air business models (Holding, Bulk Services, Concession & O&M, End-to-End) and the three-channel recommendation. Bilingual (ID/EN).

**Open:** `index.html` (single self-contained file, works offline; you can email it or open it from a USB stick).

## Use
- Drag, click, or flick the slider, or press `←` `→` / `1`–`4`, to morph between models.
- `T` starts the guided tour (arrow keys / space to advance, `Esc` to exit). `L` switches language.
- **Compare** pins a model; the scorecard then shows what changed.
- Deep links: `#holding`, `#bulk`, `#konsesi`, `#e2e`.

## Edit content
All text and diagram data live in `src/data.js` (every string is `{ id, en }`). Then rebuild:

```
node build.mjs
```

`src/template.html`, `src/style.css`, `src/app.js` and the embedded font are inlined into `index.html`.

Sources: Model.md (Jun 2026), BUMN Air Concept Note Series 1–4 (Jun 2026), "Model 3 Kanal BUMN Air" (Jul 2026). Draft for discussion; not an official government position.

# Argentum Idle Online — development

Read `docs/ARQUITECTURA.md` first, then only the relevant system files. `DESARROLLO.md` is the current workflow; older release notes describe history, not the active implementation.

- Edit `src/`, not generated root `index.html`. Build with `npm run build`; commit source and generated distribution together only when gameplay sources change.
- Preserve the explicit order in `src/blocks.json` and placement in `src/template.html`. Scripts are classic globals, not independent ES modules. Includes inject catalogues in place.
- Do not append another version wrapper to solve a routine issue. Find the active implementation and its captured predecessors first. Use `npm run architecture:inventory` or search the saved inventory by symbol; do not load its entire JSON by default. A repeated function name is not evidence that its predecessors can be deleted.
- Normal logic/CSS changes need no image generation, `art:prepare`, `assets:optimize`, art inventory export, gallery regeneration, release ZIP or screenshots of every screen. Run those only for relevant asset/layout changes or an explicitly requested release. Keep all original art.
- Default search excludes the generated HTML, binary art and archived downloads via `.rgignore`. Inspect a specific excluded file explicitly or use `rg --no-ignore` when needed. Do not feed base64 images or historic source dumps into context for logic changes.
- Start with `npm run test:fast` (no browser). For capture/persistence/migration changes also run `npm run test:smoke`. Add the relevant named browser cases. Use the full current fishing suite for broad Pesca changes. Run `npm run test:full` for cross-system/final integration validation; it currently has known legacy expectation failures. Report every executed result and any limit; never describe the full suite as green because a subset passes.
- Screenshots are needed for visual changes, at desktop/mobile widths. Avoid recapturing unrelated screens. Keep verification output separate from player data. Use isolated Chromium contexts, never a player's profile.
- `npm run build:profile` measures build stages without changing output. `test:assets` requires Pillow and tests optimizer caching in temporary fixtures. Node build does not need Pillow.
- Preserve v7 unknown fields, inventory, historical IDs, claims and records. No balance, quest, fish, rod or mechanic changes without task scope. Keep the fixed bottom HUD at 118px unless explicitly authorized otherwise.
- Do not commit/push directly to `main` without explicit approval for the current task. This audit branch is for review only.

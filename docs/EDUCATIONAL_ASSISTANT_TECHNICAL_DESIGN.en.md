# Educational Assistant Technical Design

## Overview

The educational assistant is a deterministic front-end feature. It has three parts:

1. Mascot image asset in `assets/mascot-guide.png`
2. Structured tutorial content in `src/tutorial-content.js`
3. Coach panel and navigation logic in `index.html`, `src/app.js`, and `src/styles.css`

## Data Model

Each tutorial step maps to one ISP stage:

```js
{
  key: "demosaic",
  title: "Demosaic",
  plain: "Turn the single-channel Bayer mosaic into RGB pixels.",
  why: "Camera sensors capture only one color per pixel, so missing colors must be estimated.",
  watch: "Color appears, but zipper or color artifacts may remain near edges.",
  try: "Click the Demosaic card, then change Bayer pattern intentionally to see why metadata matters."
}
```

This keeps the assistant content testable and easy to translate.

## UI Behavior

- The guide panel shows the mascot, current stage title, plain-language explanation, observation tip, and one suggested action.
- Previous / Next buttons move through the ISP pipeline.
- Clicking a stage card or pipeline rail button updates the guide.
- The guide can apply a few safe beginner presets through an `Apply tip` button.
- The selected stage is also shown in the large preview.

## Offline And Open-Source Constraints

The guide does not call external APIs. All explanation text and behavior are local project files.

The mascot is a generated raster asset stored in the repository. The generated source prompt is documented in the final work summary.

## Testing Strategy

Automated checks should verify:

- Tutorial content exists for every ISP stage.
- The page contains coach panel controls.
- The front-end can initialize the guide.
- Existing ISP tests still pass.
- Documentation links remain valid.


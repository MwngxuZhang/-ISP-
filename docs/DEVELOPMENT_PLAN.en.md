# Development Plan

## Phase 1: Working Educational MVP

Status: implemented in this repository draft.

- Define project documentation and GitHub-ready structure.
- Implement pure JavaScript ISP core.
- Implement browser visualization.
- Support synthetic RAW, PGM, and plain binary RAW input.
- Add basic automated tests.

## Phase 2: Better ISP Learning Coverage

Status: mostly implemented in version `0.2.0`.

- Add histogram panels for RAW and RGB stages.
- Add bad-pixel correction with visible defect overlay.
- Add lens-shading correction with radial and calibration-map modes.
- Add denoise and sharpening stages.
- Add auto white balance and auto exposure examples.
- Add before/after split view and per-stage zoom.

Implemented now:

- Per-stage histograms
- Bad-pixel correction
- Radial lens-shading correction
- Denoise and sharpen stages
- Gray-world auto white balance
- Large final preview and per-stage metrics

Still planned:

- Defect overlay
- Calibration-map LSC
- Auto exposure
- Before/after split view
- Per-stage zoom

## Phase 3: Real RAW Ecosystem

- Add DNG/TIFF parsing.
- Add metadata extraction for black level, white level, CFA pattern, and color matrix.
- Add sample RAW datasets with permissive licenses.
- Add export to PNG and sidecar JSON pipeline presets.

Partly implemented now:

- Final PNG export
- Preset JSON export

## Phase 4: Engineering Toolchain

- Add CLI batch conversion.
- Add Python notebook examples for algorithm experiments.
- Add Web Worker processing for large frames.
- Add WASM/WebGPU acceleration path.
- Add golden-image regression testing in CI.

## Phase 5: Open-Source Polish

- Add contribution guide and issue templates.
- Add architecture diagrams.
- Add benchmark page.
- Publish GitHub Pages demo.
- Tag a `v0.1.0` release after DNG support and golden tests land.

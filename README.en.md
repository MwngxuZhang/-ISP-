# Learn ISP? This Lab Is Enough

RAW ISP RGB Lab is an open-source learning toolchain for image engineers who want to understand the complete path from sensor RAW data to display-ready RGB.

The project is intentionally small and inspectable. The current version runs as a static web app, has no runtime dependency, and exposes each ISP stage as visual output:

1. Bayer RAW mosaic
2. Black-level correction and normalization
3. Bad-pixel correction
4. Lens-shading correction
5. Bilinear demosaic
6. White balance and auto white balance
7. Color correction matrix
8. Denoise
9. Sharpen
10. Exposure, contrast, saturation, gamma, and RGB preview

## Quick Start

Open `index.html` in a browser, or run a local static server:

```bash
npm run start
```

Then open:

```text
http://127.0.0.1:4173
```

Use the `Language` selector in the header to switch the web UI between English and Chinese. The choice is saved in the browser.

Run tests:

```bash
npm test
```

## What You Can Load

- Built-in synthetic Bayer RAW sample for learning and debugging
- Small sample file at `samples/synthetic-rggb-8x8.pgm`
- Tested binary RAW sample at `samples/synthetic-rggb-16x12-12bit-little.raw`
- PGM files (`P2` and `P5`)
- Plain binary `.raw` files with user-provided width, height, bit depth, Bayer pattern, and endian setting

## Visual Learning Features

- Pipeline rail that shows RAW to RGB order at a glance
- Lightweight CSS 3D Pixel guide mascot that explains each stage inside the app
- Guide explains controls, expected result, common trap, and learning checkpoint
- Mascot floats, waves, points, thinks, walks, celebrates, shows speech bubbles, and reacts to stage clicks, demo choices, Apply Tip, I got it, and control adjustments
- Each stage includes a beginner-friendly visual analogy, so the principle is easier to remember
- Each stage includes an interactive formula panel with formula text, variable explanations, a slider, and a small canvas diagram
- Formula slider changes trigger mascot guidance, helping beginners connect math with image behavior
- Web pet moves near the active stage card or related control while explaining the principle
- English / Chinese UI language selector for controls, demo cards, guide text, and mascot speech
- Tested demo image gallery with six selectable learning images
- Previous / Next guided tour through the pipeline
- Apply Tip button for safe beginner experiments
- Multiple built-in learning cases: color chart, low light, vignette, bad pixels, grayscale ramp, high contrast
- Large final RGB preview
- Per-stage image preview
- Per-stage histogram
- Per-stage mean/range metrics
- Manual ISP controls for sensor levels, BPC, LSC, WB, CCM, denoise, sharpen, and tone
- Gray-world auto white balance button
- Final PNG export
- ISP preset JSON export

## Documentation

- [User guide](docs/USER_GUIDE.en.md)
- [Project understanding](docs/PROJECT_UNDERSTANDING.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [Development plan](docs/DEVELOPMENT_PLAN.en.md)
- [Educational assistant understanding](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.en.md)
- [Educational assistant technical design](docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.en.md)
- [Educational assistant development plan](docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.en.md)

Chinese versions are also available:

- [涓枃 README](README.zh-CN.md)
- [浣跨敤鎸囧崡](docs/USER_GUIDE.zh-CN.md)
- [椤圭洰鐞嗚В](docs/PROJECT_UNDERSTANDING.zh-CN.md)
- [鎶€鏈璁(docs/TECHNICAL_DESIGN.zh-CN.md)
- [寮€鍙戣鍒抅(docs/DEVELOPMENT_PLAN.zh-CN.md)
- [鏁欏鍔╂墜椤圭洰鐞嗚В](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.zh-CN.md)
- [鏁欏鍔╂墜鎶€鏈璁(docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.zh-CN.md)
- [鏁欏鍔╂墜寮€鍙戣鍒抅(docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.zh-CN.md)

## Repository Map

```text
docs/
  USER_GUIDE.en.md                How to use the lab
  USER_GUIDE.zh-CN.md             浣跨敤鎸囧崡
  PROJECT_UNDERSTANDING.en.md     Project goals and scope
  PROJECT_UNDERSTANDING.zh-CN.md  椤圭洰鐩爣涓庤寖鍥?  TECHNICAL_DESIGN.en.md          Architecture and pipeline details
  TECHNICAL_DESIGN.zh-CN.md       鏋舵瀯涓庢祦姘寸嚎缁嗚妭
  DEVELOPMENT_PLAN.en.md          Implementation roadmap
  DEVELOPMENT_PLAN.zh-CN.md       寮€鍙戣矾绾垮浘
src/
  isp-core.js                     Reusable ISP algorithms and parsers
  app.js                          Browser UI glue
  styles.css                      Application styling
tests/
  run-tests.mjs                   Core algorithm tests
scripts/
  static-server.mjs               Tiny local server
index.html                        Static visual application
```

## Current Status

This is a working learning lab aimed at education and rapid experimentation. It is not yet a production image-quality pipeline. The code favors clarity over sensor-specific tuning.

## Roadmap

- Add DNG/TIFF container parsing
- Add DNG/TIFF metadata parsing
- Add waveform and vectorscope panels
- Add import of ISP parameter presets
- Add Python reference scripts for batch processing
- Add WebGPU or WASM acceleration for larger RAW frames

# PixelPipe ISP Lab

Learn camera ISP from RAW to RGB, one pixel at a time.

PixelPipe ISP Lab is an open-source visual learning lab for image engineers and ISP beginners. It turns the camera pipeline into something you can touch: choose a scene, move a slider, inspect each ISP stage, read the formula, and jump into the code behind the result.

Live demo: [https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

## Why Learn With This Project?

- It makes ISP visible: RAW data, intermediate stages, histograms, metrics, formulas, and final RGB are shown together.
- It is beginner-friendly: the 3D learning assistant explains why each operation exists in a phone or camera pipeline.
- It is hands-on: real-time controls update the actual demo image, not only symbolic diagrams.
- It is readable: every major stage includes a compact source-code walkthrough.
- It is useful for imaging-system learning: bilingual docs, tested demo cases, CI, issue templates, and a roadmap are included.

## What You Can Learn

- RAW sensor structure and Bayer patterns.
- How autofocus, lens control, auto exposure, brightness/contrast, and color systems form a complete imaging-control loop.
- Black level correction and why sensors need a baseline offset.
- Bad pixel correction for sensor defects.
- Lens shading correction for optical falloff.
- Demosaic, white balance, color correction matrix, denoise, sharpen, tone mapping, and gamma.
- How tuning controls change the image, the histogram, and stage metrics.
- Tradeoffs in video codecs, denoise, restoration, enhancement, and real-time processing.
- How computational photography and AI imaging apply to HDR, multi-view measurement, stitching, dehaze, deblur, super-resolution, and AIGC enhancement.
- How a production camera pipeline can be broken into explainable modules.

## Feature Highlights

- Complete RAW -> ISP -> RGB visual pipeline.
- Stages: RAW, BLC, BPC, LSC, Demosaic, AWB, CCM, Denoise, Sharpen, Tone/Gamma.
- Tested built-in scenes: color chart, low light, vignette, bad pixels, grayscale ramp, high contrast, portrait skin, night street, backlit window.
- Upload support for PGM and plain RAW/BIN buffers with manual metadata.
- Real-time tuning controls with one-click reset.
- Stage previews, histograms, image metrics, and final RGB export.
- Interactive formulas with crisp SVG diagrams.
- Per-stage code walkthrough with source file, function name, key steps, and snippet.
- Bilingual English/Chinese UI and documentation.
- Performance Profiler for stage latency, memory estimate, bottleneck hints, and optimization suggestions.

## Quick Start

Open `index.html` directly, or run a local static server:

```bash
npm run start
```

Then open:

```text
http://127.0.0.1:4173
```

Run tests:

```bash
npm test
```

## How To Use It

1. Open the live demo or local `index.html`.
2. Choose a built-in scene such as Color Chart, Low Light, Bad Pixels, or Night Street.
3. Click any ISP stage to see its preview, formula, code explanation, and learning notes.
4. Adjust the controls. The real case image updates through the pipeline.
5. Use reset when you want to return to the default teaching setup.
6. Export the final RGB result or inspect the profiler panel.

## Repository Map

```text
docs/                         Project documentation
.github/                      CI, issue templates, and PR template
src/isp-core.js                ISP algorithms, parsers, and profiler helpers
src/app.js                     Browser UI logic
src/code-walkthrough.js        Per-stage code explanation content
src/styles.css                 Application styling
assets/demos/                  Demo thumbnails
samples/                       Small tested RAW/PGM samples
tests/                         Core and QA checks
scripts/static-server.mjs      Local static server
index.html                     Static web application
ROADMAP.md                     Release roadmap
```

## Documentation

- [User guide](docs/USER_GUIDE.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [Advanced imaging system roadmap](docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.en.md)
- [Device scenario teaching specification](docs/DEVICE_SCENARIO_TEACHING_SPEC.en.md)
- [Project understanding](docs/PROJECT_UNDERSTANDING.en.md)
- [Development plan](docs/DEVELOPMENT_PLAN.en.md)
- [Roadmap](ROADMAP.md)

Chinese documentation:

- [中文 README](README.zh-CN.md)
- [使用指南](docs/USER_GUIDE.zh-CN.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)
- [高级成像系统学习路线](docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.zh-CN.md)
- [设备场景案例地图教学规格](docs/DEVICE_SCENARIO_TEACHING_SPEC.zh-CN.md)

## Current Status

PixelPipe ISP Lab is an educational and experimental ISP reference, not a production camera firmware pipeline. The code favors clarity, inspectability, and learning value. Future work includes richer RAW/DNG metadata support, more demosaic algorithms, objective image-quality metrics, worker/WASM acceleration, and shareable performance reports.

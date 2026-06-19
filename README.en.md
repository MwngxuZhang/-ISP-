# RAW ISP RGB Lab

RAW ISP RGB Lab is an open-source visual learning and tuning platform for understanding the full path from sensor Bayer RAW to display-ready RGB.

It is designed for image engineering beginners, ISP learners, and portfolio presentation. The project runs as a static web app, includes tested demo scenes, and explains each ISP stage with previews, histograms, formulas, and guided interactions.

Online demo: [https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

## Why Star This Project?

- It is a compact ISP learning lab that runs entirely in the browser.
- It connects image-processing formulas with real visual output.
- It includes bilingual docs, tested demo cases, CI, contribution templates, and a public roadmap.
- It is evolving toward a practical reference for both image-quality intuition and pipeline fluency analysis.

## Highlights

- Complete RAW -> ISP -> RGB visual pipeline.
- Stages: RAW, BLC, BPC, LSC, Demosaic, AWB, CCM, Denoise, Sharpen, Tone/Gamma.
- Built-in tested scenes: color chart, low light, vignette, bad pixels, grayscale ramp, high contrast.
- Extra mobile-imaging scenes: portrait skin, night street, backlit window.
- Upload support for PGM and plain RAW/BIN buffers with manual metadata.
- Real-time tuning with stage previews, histograms, metrics, and final RGB export.
- Interactive formulas and crisp diagrams for each stage.
- Per-stage code walkthrough with source file, function name, key steps, and a small snippet.
- 3D mascot guide with beginner-friendly explanations.
- English/Chinese UI and documentation.
- Performance Profiler for stage latency, memory estimate, bottleneck detection, and optimization suggestions.

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

## Why This Project Is Useful

Many ISP tutorials explain formulas in isolation. This project connects formulas to visible image changes. You can load a scene, adjust one control, and immediately observe how the RAW data, intermediate stages, histogram, metrics, and final RGB output change.

The new Performance Profiler also turns the pipeline into a small fluency-analysis workload. It measures stage-level latency, estimates memory, identifies bottlenecks, and suggests practical optimization actions such as worker offloading, incremental recomputation, buffer reuse, and downsampled preview.

## Documentation

- [User guide](docs/USER_GUIDE.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [GitHub star gap analysis](docs/GITHUB_STAR_GAP_ANALYSIS.en.md)
- [Open source growth plan](docs/OPEN_SOURCE_GROWTH_PLAN.en.md)
- [Project understanding](docs/PROJECT_UNDERSTANDING.en.md)
- [Development plan](docs/DEVELOPMENT_PLAN.en.md)
- [Roadmap](ROADMAP.md)
- [Educational assistant understanding](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.en.md)
- [Educational assistant technical design](docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.en.md)
- [Educational assistant development plan](docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.en.md)

Chinese documentation:

- [中文 README](README.zh-CN.md)
- [使用指南](docs/USER_GUIDE.zh-CN.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)
- [距离高星 GitHub 项目的差距分析](docs/GITHUB_STAR_GAP_ANALYSIS.zh-CN.md)
- [开源成长计划](docs/OPEN_SOURCE_GROWTH_PLAN.zh-CN.md)

## Repository Map

```text
docs/                         Project documentation
.github/                      CI, issue templates, and PR template
src/isp-core.js                ISP algorithms, parsers, and profiler helpers
src/app.js                     Browser UI logic
src/styles.css                 Application styling
assets/demos/                  Demo thumbnails
samples/                       Small tested RAW/PGM samples
tests/                         Core and QA checks
scripts/static-server.mjs      Local static server
index.html                     Static web application
ROADMAP.md                     Release roadmap
```

## Current Status

This is an educational and experimental ISP reference, not a production camera pipeline. The code favors clarity and inspectability. Future work includes real RAW/DNG metadata support, more demosaic algorithms, quality metrics, worker/WASM acceleration, and exported performance reports.

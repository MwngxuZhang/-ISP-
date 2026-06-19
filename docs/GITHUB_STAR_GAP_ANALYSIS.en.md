# Gap Analysis Toward a High-Star GitHub Project

This project already has a clear core experience: it visualizes the full RAW Bayer to RGB ISP pipeline in a browser, with formulas, test cases, histograms, and a guided learning assistant. It is already strong enough for a portfolio project. To become a high-star open-source project, it needs stronger positioning, technical credibility, extensibility, observability, and community polish.

## Current Strengths

- **Clear topic**: RAW -> ISP -> RGB is relevant and distinctive for imaging engineers.
- **Instant demo**: users can open the page and interact with the pipeline without a heavy setup.
- **Complete learning path**: RAW, BLC, BPC, LSC, Demosaic, AWB, CCM, Denoise, Sharpen, and Tone/Gamma are all present.
- **Strong visualization**: every stage has image preview, histogram, metrics, formula explanation, and interactive controls.
- **Open-source deliverables**: README, user guide, technical design, development plan, tests, and GitHub Pages already exist.

## Main Gaps

| Dimension | Current State | What High-Star Projects Usually Need |
| --- | --- | --- |
| Positioning | Educational ISP web lab | Sharper value proposition, target audience, and real workflows |
| Technical credibility | Basic ISP pipeline and QA | Deeper algorithm notes, quality metrics, edge cases, and benchmarks |
| Extensibility | Large front-end modules | Modular architecture, plugin pipeline, replaceable algorithms |
| Observability | Limited performance data before this update | Latency, memory, bottleneck, and optimization insight |
| Use cases | Synthetic built-in scenes | More real RAW/DNG samples, comparisons, and learning tasks |
| Developer experience | Openable static web app | Clear scripts, CI, issue templates, contribution flow, roadmap |
| Community appeal | Memorable title | Better screenshots/GIFs, demo video, roadmap, and English messaging |

## What This Update Improves

This update adds a **Performance Profiler** panel and moves the project from a pure ISP learning site toward an imaging pipeline observability tool:

- Measures total RAW -> RGB pipeline latency.
- Measures actual stage-level timing and percentage.
- Estimates memory used by RAW/RGB buffers, intermediate Float32 buffers, and canvas previews.
- Detects the current top bottleneck.
- Generates optimization suggestions based on bottleneck, resolution, denoise, and sharpen parameters.

This makes the project more relevant to the OPPO Color training topic “fluency insight and technical optimization in the AI era”: the ISP pipeline becomes a real computation workload for latency, memory, and optimization analysis.

## Roadmap

### 1. Algorithm Credibility

- Add more demosaic algorithms: bilinear, edge-aware, Malvar-He-Cutler.
- Add real RAW/DNG unpacking or metadata parsing.
- Add PSNR, SSIM, Delta E, gray-card error, and clipping metrics.
- Document assumptions, input/output ranges, and failure cases for every stage.

### 2. Performance And Fluency

- Move heavy stages to Web Workers.
- Support OffscreenCanvas or tiled processing.
- Add incremental pipeline recomputation for downstream-only updates.
- Add benchmark tables across resolutions.
- Export profiler reports as Markdown/JSON.

### 3. Learning Experience

- Add task mode: fix bad pixels, correct vignette, recover white balance.
- Add before/after comparison slider.
- Add more formula-to-image linked diagrams.
- Add realistic mobile imaging cases: night, backlight, portrait skin tone, mixed indoor light.

### 4. Open-Source Engineering

- Add GitHub Actions tests.
- Add issue and PR templates.
- Add architecture diagrams, profiler screenshots, and demo GIFs.
- Define versions: 0.1 learning stable, 0.2 profiler, 0.3 real RAW support.

## Resume And Application Positioning

For imaging algorithm roles:

> RAW-to-RGB ISP Visual Learning and Tuning Platform

For the Color training topic on fluency insight and optimization:

> Fluency Insight and Optimization Tool for Mobile Imaging Pipelines

Core description:

> Built an interactive RAW-to-RGB ISP pipeline with stage previews, histograms, real-time tuning, formulas, latency profiling, memory estimation, and optimization suggestions. The project helps users understand both image-quality changes and performance bottlenecks in mobile imaging pipelines.

# Roadmap

This roadmap turns RAW ISP RGB Lab from a portfolio-quality learning tool into a stronger open-source project.

## 0.0.x Current Focus

- Keep the static web demo stable.
- Improve README, docs, issue templates, and CI.
- Add performance profiling and optimization guidance.
- Keep all built-in scenes covered by tests.

## 0.1 Learning Stable

- Add before/after comparison slider.
- Add guided tasks: fix bad pixels, correct vignette, neutralize color cast.
- Add exported learning reports for completed stages.
- Add more polished screenshots and demo GIFs.

## 0.2 Algorithm Credibility

- Add edge-aware demosaic option.
- Add image-quality metrics: clipping ratio, PSNR/SSIM for synthetic references, gray-card error.
- Add more detailed assumptions and failure cases for each ISP stage.
- Add real-world RAW sample instructions.

## 0.3 Performance And Fluency

- Add profiler report export as JSON/Markdown.
- Add resolution benchmark mode.
- Add incremental recomputation so sliders only rerun affected downstream stages.
- Explore Web Worker, WASM, SIMD, or tiled processing for heavy stages.

## 0.4 Real RAW Support

- Add DNG/TIFF metadata parsing.
- Add packed RAW10/RAW12 unpacking notes or implementation.
- Add camera-profile import experiments.

## 0.5 Imaging Control Labs

- Add Autofocus Lab with lens-position control, sharpness metrics, focus curves, and failure cases.
- Add Auto Exposure Lab with luma statistics, ROI metering, highlight protection, and video-style smoothing.
- Add Color System Lab with color temperature, tint, gray-card error, skin-tone shift, and display-target previews.

## 0.6 Video And Computational Photography

- Add video frame-sequence demos for codec artifacts, temporal denoise, restoration, and enhancement.
- Add computational photography lessons for HDR fusion, projection geometry, matching, stitching, dehaze, deblur, and super-resolution.
- Add AI imaging lessons for Transformer, GAN, diffusion, and AIGC enhancement with hallucination and trust-risk notes.

## 0.7 Device Scenario Map

- Add learning tracks for photography cameras, phone cameras, cinema cameras, VR headsets, medical imaging, and display output.
- Keep every track tied to formulas, real image changes, code walkthroughs, and testable learning tasks.

## Long-Term Direction

- Become a compact, visual, bilingual ISP learning lab for students and junior image engineers.
- Provide a trustworthy bridge between formulas, image-quality intuition, and performance engineering.
- Grow from a RAW ISP lab into a broader imaging-system learning platform.

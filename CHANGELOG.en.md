# Changelog

## 0.3.7

- Added an interactive formula panel for every RAW -> ISP -> RGB stage.
- Added formula text, variable explanations, detailed principle copy, a formula slider, and canvas diagrams.
- Expanded the mascot's teaching role so formula slider changes trigger contextual speech and movement.
- Added bilingual formula content for all 10 pipeline stages.
- Extended QA and core tests to cover formula content and formula UI structure.

## 0.3.6

- Replaced the static mascot image in the app with a lightweight CSS 3D Pixel guide.
- Added articulated mascot body language: idle float, wave, point, think, walk, and celebrate.
- Expanded every tutorial stage with a visual analogy plus richer stage-click, Apply Tip, and checkpoint speech.
- Added control-level mascot explanations when beginners adjust ISP parameters.
- Extended QA checks for the 3D mascot structure and richer tutorial speech fields.

## 0.3.5

- Added an English / Chinese language selector to the web UI.
- Localized controls, demo cards, tutorial guide labels, mascot speech bubbles, and render status text.
- Persisted the language choice in the browser.
- Added tests for localized tutorial and demo content.

## 0.3.4

- Upgraded the mascot into a floating web pet that moves near the active stage or related control.
- Added tutorial anchors so the pet can point to the relevant UI element for each ISP stage.
- Added floating pet speech bubble synchronized with stage principles and user actions.
- Added pet pointer-follow tilt interaction.
- Extended QA checks for floating pet layer, anchors, and movement behavior.

## 0.3.3

- Animated the mascot with floating, pointing, thinking, waving, and celebration reactions.
- Added speech bubbles above the mascot for short stage principles and interaction feedback.
- Added pointer-follow tilt interaction on the mascot.
- Updated tests and QA checks for speech bubbles and mascot interaction behavior.

## 0.3.2

- Expanded the mascot guide into a more active beginner coach.
- Added per-stage control guidance, expected result, common beginner trap, and checkpoint text.
- Added tutorial progress tracking.
- Added `I got it` and `Restart tour` learning controls.
- Extended tests and QA checks for the beginner coaching fields and progress behavior.

## 0.3.1

- Added a tested demo image gallery with six selectable thumbnails.
- Added deterministic demo thumbnail assets for color chart, low light, vignette, bad pixels, grayscale ramp, and high contrast.
- Connected each demo image to a matching Bayer RAW scene and full pipeline learning flow.
- Extended tests to run every demo image scene through the full RAW -> ISP -> RGB pipeline.

## 0.3.0

- Added an in-app cartoon ISP guide mascot.
- Added guided stage explanations for all 10 ISP stages.
- Added Previous / Next guided tour controls.
- Added `Apply tip` beginner actions for stage-specific experiments.
- Added educational assistant understanding, technical design, and development plan docs in English and Chinese.
- Extended QA checks to cover the mascot asset, guide panel, and tutorial content.

## 0.2.0

- Expanded the ISP pipeline from 6 stages to 10 visual stages.
- Added bad-pixel correction.
- Added lens-shading correction.
- Added denoise and sharpen stages.
- Added exposure, contrast, saturation, and gamma controls.
- Added gray-world auto white balance.
- Added per-stage histograms.
- Added per-stage statistics and final RGB readout.
- Added final PNG export.
- Added ISP preset JSON export.
- Refined the UI into a dense visual learning lab.
- Updated English and Chinese documentation.

## 0.1.0

- Added the first RAW Bayer to RGB educational MVP.
- Added PGM and plain binary RAW loading.
- Added synthetic RAW sample generation.
- Added bilinear demosaic, white balance, CCM, and gamma.
- Added core algorithm tests.

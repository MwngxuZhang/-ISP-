# Advanced Imaging System Roadmap

This document describes the next technical direction for PixelPipe ISP Lab. The goal is to extend the current RAW -> ISP -> RGB learning website into a broader visual lab for modern imaging systems: cameras, phones, cinema cameras, VR headsets, medical imaging devices, displays, video pipelines, computational photography, and AI-based image processing.

## 1. Project Positioning

PixelPipe ISP Lab already covers RAW data, Bayer patterns, black-level correction, bad-pixel correction, lens-shading correction, demosaic, white balance, color correction, denoise, sharpen, tone/gamma, histograms, formulas, code walkthroughs, and performance profiling.

The next step is to move from "single-image ISP learning" to "full imaging-system learning":

- Imaging control: autofocus, lens control, auto exposure, brightness, and contrast.
- Color system: auto white balance, color temperature, tint, color correction, and display adaptation.
- Device scenarios: photography cameras, phone cameras, cinema cameras, VR headsets, medical imaging, and display output.
- Video processing: codecs, temporal denoise, restoration, enhancement, stability, and real-time constraints.
- Computational photography and AI: multi-frame fusion, multi-view measurement, projection geometry, matching, stitching, deblur, dehaze, super-resolution, Transformer, GAN, diffusion, and AIGC-assisted enhancement.

## 2. Learning Map

```text
Scene / Device
  -> Sensor and Lens
  -> Autofocus and Lens Control
  -> Auto Exposure and Tone Intent
  -> RAW ISP
  -> Color System
  -> Video / Multi-frame Processing
  -> Computational Photography / AI Enhancement
  -> Display and Evaluation
```

Each module should provide four things:

- Why it exists in a real device.
- The core mathematical model.
- An interactive demo that updates the actual image or video.
- A readable reference implementation.

## 3. Autofocus And Lens Control

Autofocus is not just "make the image sharp." It searches for a useful focal plane across lens motion, sensor feedback, scene texture, and algorithm decisions.

Learning topics:

- How lens position changes sharpness.
- How contrast AF searches for the sharpness peak.
- Why phase detection, dual-pixel AF, and depth-assisted AF can reduce hunting.
- How VCM, OIS, and focus motors interact with phone camera algorithms.
- Why video AF needs smoothing to avoid hunting and focus breathing.

Teaching model:

```text
focusScore = variance(Laplacian(luma))
bestFocus = argmax(focusScore(position))
```

Lens control can be abstracted as:

```text
lensPosition(t + 1) = lensPosition(t) + step
```

Recommended UI:

- Add an Autofocus Lab.
- Provide near object, far object, portrait, low light, low texture, and moving subject cases.
- Let users drag the lens position and see the real image become blurred or sharp.
- Plot the sharpness curve with the current point and best focus point.
- Provide manual focus, coarse scan, fine scan, and smooth video AF modes.

## 4. Auto Exposure

Auto exposure decides not only whether the image is bright enough, but also whether highlights are preserved, shadows are usable, and noise remains acceptable.

Learning topics:

- Exposure time, analog gain, digital gain, and ISO.
- Brightness statistics, histograms, ROI metering, face-priority metering.
- Brightness and contrast control.
- Why phone HDR often needs multi-frame exposure.
- Why video exposure should change smoothly.

Basic model:

```text
error = targetLuma - measuredLuma
exposureGain = exposureGain * exp(k * error)
```

Contrast model:

```text
out = (in - 0.5) * contrast + 0.5
```

Highlight protection:

```text
if highlightClippingRatio > threshold:
    reduceExposure()
```

Recommended UI:

- Add an Exposure Lab.
- Show exposure time, gain/ISO, histogram, mean luma, highlight clipping ratio, and shadow ratio.
- Provide global, center, subject/face, and highlight-priority metering.
- Let scene brightness update the real image and histogram together.
- Add phone night mode and cinema-style highlight-preserving cases.

## 5. Color System

Color starts with white balance, but a complete system also includes sensor spectral response, color temperature, tint, color correction matrices, gamut mapping, skin-tone protection, and display adaptation.

Learning topics:

- Color temperature versus tint.
- Gray-world, white-patch, chart calibration, and learned AWB.
- How a CCM maps camera RGB into a target color space.
- Why phone cameras protect skin, sky, grass, and other memory colors.
- SDR, HDR, P3, sRGB, and display appearance.

White balance:

```text
R' = R * rGain
G' = G * gGain
B' = B * bGain
```

Color correction matrix:

```text
[R']   [m00 m01 m02] [R]
[G'] = [m10 m11 m12] [G]
[B']   [m20 m21 m22] [B]
```

Recommended UI:

- Add a Color System Lab.
- Provide tungsten, daylight, cloudy, fluorescent, mixed light, and portrait skin cases.
- Show color temperature, tint, RGB gains, gray-card error, and skin-tone shift.
- Provide display targets such as sRGB, Display P3, and HDR-style preview.

## 6. Device-Specific Learning Modules

### Photography Cameras

Focus on RAW latitude, lenses, depth of field, color styles, and post-production space.

### Phone Cameras

Focus on small sensors, multi-camera systems, HDR, night mode, multi-frame denoise, portrait blur, and real-time preview.

### Cinema Cameras

Focus on dynamic range, Log curves, LUTs, color management, frame rate, shutter angle, and stable exposure.

### VR Headsets

Focus on low latency, stereo consistency, distortion correction, chromatic aberration correction, foveated rendering, and display compensation.

### Medical Imaging

Focus on signal-to-noise ratio, structure enhancement, pseudo color mapping, contrast enhancement, interpretability, and stability. The module must clearly state that it is for algorithm education only and not for diagnosis.

### Display Output

Focus on gamma, EOTF, gamut, HDR tone mapping, brightness limits, and ambient-light adaptation.

## 7. Video Image Processing

### Video Codecs

Topics:

- Intra-frame and inter-frame compression.
- I/P/B frames, motion estimation, bitrate, GOP, and compression artifacts.
- How encoding affects detail, noise, and edges.

UI:

- Bitrate slider for blocking, detail loss, and ringing.
- GOP slider for motion stability.
- Difference view between original and encoded output.

### Video Denoise

Topics:

- Spatial versus temporal denoise.
- Why motion compensation matters.
- Why excessive denoise creates ghosting and plastic texture.

UI:

- Single-frame denoise versus multi-frame denoise.
- Motion ghosting indicator.
- Sliders for noise level, temporal weight, and motion threshold.

### Video Restoration And Enhancement

Topics:

- Deblur, compression artifact removal, super-resolution, dehaze, and low-light enhancement.
- Tradeoffs among quality, latency, power, and stability.

UI:

- Before/after slider.
- Metrics panel for sharpness, estimated noise, luma distribution, and estimated runtime.
- Notes explaining why a sharper result can still contain fake details.

## 8. Computational Photography And AI Imaging

### Multi-frame Fusion And HDR

Short exposure preserves highlights; long exposure preserves shadows. Alignment and motion handling prevent ghosting.

```text
out = sum(weight_i * alignedFrame_i) / sum(weight_i)
```

### Multi-view Measurement And Projection Geometry

Topics:

- Pinhole camera model, intrinsics, extrinsics, and distortion.
- Epipolar constraints, disparity, and depth estimation.
- Applications in phone multi-camera systems, VR stereo, and robotics.

```text
x' = K [R | t] X
depth = focalLength * baseline / disparity
```

### Matching And Stitching

Topics:

- Keypoints, descriptors, matching, RANSAC, and homography.
- Panorama stitching, video stabilization, and multi-camera alignment.

```text
x2 ~ H x1
```

### Deblur, Dehaze, And Super-resolution

Topics:

- Motion kernels and blind deconvolution.
- Atmospheric scattering and transmission maps.
- From interpolation to CNN, Transformer, and diffusion-based enhancement.

Dehaze model:

```text
I(x) = J(x) * t(x) + A * (1 - t(x))
```

### Transformer, GAN, And AIGC

AI modules should not be black-box magic buttons. The learning interface should show inputs, outputs, loss intuition, and failure cases.

Topics:

- CNN: local texture modeling.
- Transformer: long-range dependency and global context.
- GAN: generator, discriminator, realism, and artifacts.
- Diffusion / AIGC: iterative denoise, conditional guidance, and content-consistency risk.

UI:

- Compare traditional algorithms with AI enhancement.
- Mark possible hallucinated details.
- Add trust notes: is this a physical recovery or a plausible generation?

## 9. Recommended Page Structure

```text
Home
  -> RAW ISP Basics
  -> Autofocus Lab
  -> Auto Exposure Lab
  -> Color System Lab
  -> Video Processing Lab
  -> Computational Photography Lab
  -> AI Image Enhancement Lab
  -> Device Scenario Map
  -> Performance And Engineering
```

Each lab should keep the same layout:

- Left: case selection and controls.
- Center: real image or video preview.
- Right: formula, explanation, code, metrics, and failure cases.
- Bottom: guided tasks such as fixing bad pixels, exposing a face, reducing ghosting, removing haze, or comparing traditional and AI super-resolution.

## 10. Code Architecture

Recommended modules:

```text
src/
  imaging/
    autofocus.js
    auto-exposure.js
    color-system.js
    video-processing.js
    computational-photography.js
    ai-imaging-notes.js
  demos/
    focus-cases.js
    exposure-cases.js
    color-cases.js
    video-cases.js
  metrics/
    sharpness.js
    luma.js
    color-error.js
    video-quality.js
```

Principles:

- Keep teaching implementations readable.
- Start with simplified models, then document production-grade directions.
- Every slider should affect a real case image or real synthetic data.
- Every module should have unit tests.

## 11. Testing Route

Functional tests:

- Autofocus curve can find a sharpness peak.
- Auto exposure converges to target luma.
- White balance reduces gray-card error.
- Video denoise reduces estimated noise.
- Stitching can estimate a homography on controlled data.

Teaching tests:

- Every module includes why it exists.
- Every module includes formulas and code.
- Every module includes at least one failure case.
- English and Chinese documentation stay aligned.

Experience tests:

- Real images update when parameters change.
- One-click reset works.
- Mobile layout remains readable.
- Formula and diagram text remains crisp.
- The mascot reacts to the current operation.

## 12. Development Plan

### Phase A: Imaging Control

- Add autofocus docs, formula cards, sharpness metrics, and focus curves.
- Add auto exposure docs, luma statistics, ROI metering, and highlight protection.
- Add color system docs, color temperature/tint controls, gray-card error, and display targets.

### Phase B: Device Scenarios

- Add entries for photography cameras, phone cameras, cinema cameras, VR, medical imaging, and displays.
- Explain why each real device needs different tradeoffs.
- Add task cards such as phone night mode, portrait skin, and VR stereo consistency.

### Phase C: Video Processing

- Add a video frame-sequence data model.
- Add video denoise, codec artifact, restoration, and enhancement lessons.
- Add timeline, inter-frame difference, and motion-region hints.

### Phase D: Computational Photography

- Add HDR fusion, projection geometry, matching, stitching, dehaze, and super-resolution.
- Provide simplified implementations, formulas, failure cases, and engineering notes.

### Phase E: AI Imaging

- Add Transformer, GAN, diffusion, and AIGC image-enhancement lessons.
- Explain hallucination and trust risks.
- Add traditional algorithm versus AI model comparisons.

### Phase F: Engineering And Open Source

- Add module-level tests and golden cases.
- Add profiler report export.
- Add shareable learning reports.
- Complete bilingual docs, README links, and GitHub Pages presentation.

## 13. Advanced Imaging Case Specification

This stage should not only add documentation links. Each advanced topic should become a learning unit that matches the existing ISP cases: image input, draggable parameter, before/after preview, formula, code idea, failure warning, and device explanation.

### 13.1 Required Fields For Each Case

| Field | Purpose | Website Surface |
| --- | --- | --- |
| Device scenario | Explain the real phone, camera, cinema, VR, medical, or display problem | Scenario card, thumbnail, case entry |
| Input image | Use local open or reproducible assets, not unclear copyrighted photos | Before image, thumbnail, selector |
| Pipeline | Show the path from sensor/lens/multi-frame input to final display | Full pipeline walkthrough |
| Control | Start with one main slider that teaches the core tradeoff | Range control, live value, reset |
| Observation | Tell beginners where to look, not only that the picture changed | Metric card, risk tag, mascot hint |
| Failure | Explain too weak, too strong, and wrong-scene behavior | Failure card and risk text |
| Formula and code | Use a simplified formula and readable JS-style processing idea | Formula block and code idea block |
| Test requirement | Ensure the case loads, reacts, and has non-empty teaching text | Unit tests and QA checks |

### 13.2 Device Scenario Design

| Device | What the visual should show | First demo case | Control | What to observe |
| --- | --- | --- | --- | --- |
| Photography camera | Lens focus plane, depth of field, color chart, RAW latitude | Macro texture focus + color chart calibration | Lens position / macro step | Front/back texture sharpness peak and neutral gray |
| Phone photography | Small sensor, backlit portrait, HDR, skin protection | Backlit portrait HDR | Exposure EV / skin warmth | Face brightness, window highlights, skin naturalness |
| Cinema camera | Night lamps, highlight roll-off, Log/LUT look | Night street exposure | Night exposure EV | Lamp readability, shadow detail, stable contrast |
| VR headset | Left/right consistency, low latency, distortion/chromatic correction | Stereo matching and alignment | Match confidence | Stereo misalignment and ghosting |
| Medical imaging | Grayscale structure, SNR, stable edges | Low-light / grayscale structure enhancement | Temporal denoise | Noise reduction versus structure loss |
| Display output | sRGB/P3/HDR, Gamma/EOTF, ambient adaptation | Color chart / backlit display mapping | Color temperature / tone | Gray, skin, shadow, and highlight appearance |

### 13.3 Advanced Algorithm Case Design

| Topic | Input Image | Parameter | Correct Change | Wrong Change |
| --- | --- | --- | --- | --- |
| Autofocus | Portrait or macro texture with visible depth | Lens position | Subject edges sharpen and score reaches a peak | Low texture causes hunting or unstable peak |
| Auto exposure | Backlit window, night lamps, high dynamic range scene | Exposure EV | Shadows become visible while highlights retain texture | Windows or lamps clip; shadows amplify noise |
| White balance and color | Color chart, mixed light, portrait skin | Color temperature / tint / RGB gain | Neutral gray and natural memory colors | Gray is correct but skin looks wrong, or the whole image casts |
| Video denoise | Low-light sequence or simulated noise image | Temporal weight | Random noise decreases | Moving subjects ghost and texture smears |
| Codec repair | Low-bitrate blocking image | Deblock strength | Block edges weaken while real edges stay | Over-deblock creates plastic texture |
| HDR / matching | Exposure brackets, stereo pair, panorama overlap | Match confidence | Fusion is aligned and stable | Ghosts, seams, and geometric bending |
| Super-resolution | 1x low-resolution soft input | 2x/3x/4x scale | Edges and grid lines become finer | High scale hallucinates fake texture |
| Dehaze / deblur | Hazy distance or motion blur image | Recovery strength | Contrast and structure readability improve | Distant details become over-restored or unnatural |

### 13.4 Website Layout Requirement

The advanced imaging area should stay separate from the ISP area. The upper page teaches RAW -> ISP -> RGB; the lower page teaches the full imaging system. Recommended order:

1. Advanced imaging intro: autofocus, exposure, color, video, computational photography, and AI.
2. Technical case selector: AF, AE, color, video, computational photography, AI.
3. Main case panel: why, formula, code on the left; before/after, slider, metric, observation, failure, and full walkthrough on the right.
4. Device scenario map: phone, camera, cinema, VR, medical, and display cards mapping real device problems to concrete demos.
5. Mascot explanation: clicking a case or dragging a control should explain the real control variable. For example, exposure EV maps to AE target/gain; SR scale maps to AI reconstruction scale.

### 13.5 Image Asset Requirement

- Built-in images must run offline and live under `assets/demos/` or future `assets/advanced/`.
- Prefer self-made, generated, or clearly open-licensed assets.
- If an image is synthetic, it should still be scene-like: backlit window, night lamp, skin tone, grayscale structure, stereo disparity, low-resolution texture.
- Every asset should document the real device problem it represents; it should not be decorative only.

### 13.6 Acceptance Criteria

- Every device scenario card has a thumbnail, device explanation, processing pipeline, and linked lab.
- Every advanced lab has before/after, slider, metric, observation, failure, and full pipeline walkthrough.
- AI super-resolution must show the relation from 1x low-resolution input to 2x/3x/4x clearer output. It must not be represented as a brightness or generic sharpening slider.
- Medical imaging content must clearly state it is for education, not diagnosis.
- Public pages and official docs should keep the focus on technical learning, not project scoring or gap-analysis packaging.

## 14. Project Boundary

PixelPipe ISP Lab is an educational open-source project. It does not replace production camera firmware, medical diagnostic software, or commercial video SDKs. Production systems require hardware drivers, lens calibration, sensor calibration, chip ISP integration, NPU/GPU acceleration, thermal and power stability, large-scale regression data, and strict quality evaluation.

The project value is to turn a complex imaging pipeline into visible learning objects: users can see the change, understand the formula, read the code, and propose optimization ideas.

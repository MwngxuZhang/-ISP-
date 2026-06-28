# Device Scenario Teaching Specification

This document defines the teaching goals, image-asset rules, and website requirements for the PixelPipe ISP Lab device scenario map. It is not a gallery note. Its purpose is to explain why different imaging devices need different pipelines and what learners should compare through images, controls, and metrics.

## 1. Design Principles

The device scenario map must not reuse generic ISP demo thumbnails. Each image must teach a real imaging problem:

- Photography camera: lens, depth of field, RAW latitude, color-chart calibration.
- Phone photography: small sensor, backlight, high dynamic range, multi-frame HDR, subject protection.
- Cinema camera: night highlights, Log/LUT, dynamic range, stable exposure, color management.
- VR headset: stereo consistency, low latency, calibration, distortion and chromatic correction.
- Medical imaging: grayscale structure, SNR, structure enhancement, stable display. Education only, not diagnosis.
- Display output: sRGB/P3/HDR, Gamma/EOTF, tone mapping, ambient adaptation.

Every device card must answer:

1. Which real device problem does the image represent?
2. Which advanced lab does it open?
3. What should the learner observe while dragging the parameter?
4. What failure appears when the parameter is too weak or too strong?

## 2. Asset Source Strategy

The current project uses dedicated generated scene images with no brand, no readable text, and no watermark. They live in:

```text
assets/scenarios/
```

Reasons:

- Online image licensing can be unstable for open-source redistribution.
- Generated images let us control teaching elements such as color charts, backlit windows, night lamps, stereo calibration boards, grayscale structures, and display calibration patterns.
- All images work offline and GitHub Pages does not depend on external image URLs.

If future versions replace these with real photographs, each replacement must have:

- A public source page.
- A clear license such as CC0, CC BY, CC BY-SA, or another project-compatible license.
- Documented author, file page, license, and modification notes.
- No brand trademark issue, private identity, diagnostic medical data, or restricted content.

## 3. Six Device Cases

### 3.1 Photography Camera

Asset:

```text
assets/scenarios/camera-photography.png
```

Visual elements:

- Unbranded camera and lens.
- Macro texture subject.
- Color chart and neutral patches.
- Desk still-life environment.

Teaching goals:

- Explain how lens position changes the focal plane.
- Explain why macro depth of field is shallow and the focus peak is narrow.
- Explain how a color chart supports AWB and CCM calibration.
- Explain why camera RAW leaves more room for post-processing.

Website link:

- Opens the macro texture focus lab.
- Control: macro lens step.
- Observe: foreground texture, background texture, sharpness score, neutral gray.
- Failure: fast lens stepping can skip the peak; low texture can cause hunting.

### 3.2 Phone Photography

Asset:

```text
assets/scenarios/phone-photography.png
```

Visual elements:

- Unbranded phone.
- Backlit window.
- Portrait-like subject.
- Phone screen showing both bright window and dark subject.

Teaching goals:

- Explain why phone small sensors rely on HDR and multi-frame fusion.
- Explain the conflict between subject metering and highlight protection.
- Explain why real-time preview has strict latency limits.
- Explain skin/subject protection and local tone mapping.

Website link:

- Opens the backlit metering lab.
- Control: exposure EV.
- Observe: subject brightness, window highlights, histogram clipping, shadow noise.
- Failure: exposure-only brightening clips the window; highlight-only metering darkens the subject.

### 3.3 Cinema Camera

Asset:

```text
assets/scenarios/cinema-camera.png
```

Visual elements:

- Unbranded cinema camera rig.
- Night street.
- Bright lamps and deep shadows.
- Monitor with a flat Log-like preview.

Teaching goals:

- Explain why cinema cameras care about dynamic range and highlight roll-off.
- Explain how Log curves preserve grading latitude.
- Explain how LUTs map Log preview toward final appearance.
- Explain why video exposure transitions must be smooth.

Website link:

- Opens the night street exposure lab.
- Control: night exposure EV.
- Observe: lamp readability, shadow detail, contrast, noise cost.
- Failure: too much exposure clips lamps; too little loses shadow story.

### 3.4 VR Headset

Asset:

```text
assets/scenarios/vr-headset.png
```

Visual elements:

- Unbranded VR headset.
- Front stereo camera area.
- Checkerboard calibration target.
- Left/right view cards.

Teaching goals:

- Explain why VR passthrough needs exposure, color, and geometry consistency between eyes.
- Explain stereo matching, disparity, depth, and projection geometry.
- Explain why distortion correction, chromatic correction, and display compensation affect comfort.
- Explain why low latency can matter more than single-frame quality.

Website link:

- Opens the match confidence lab.
- Control: match confidence.
- Observe: stereo alignment, ghosting, match-line reliability.
- Failure: bad matches cause depth drift, geometric misalignment, and discomfort.

### 3.5 Medical Imaging

Asset:

```text
assets/scenarios/medical-imaging.png
```

Visual elements:

- Unbranded ultrasound probe.
- Grayscale imaging screen.
- Structured phantom-like pattern.
- Clinical education setup, not real diagnosis.

Teaching goals:

- Explain why medical imaging cares about SNR, structural edges, and stable grayscale display.
- Explain why denoise must not erase weak structures.
- Explain why enhancement should remain conservative, explainable, and traceable.
- Clearly state that this project is for imaging education only, not medical diagnosis.

Website link:

- Opens the low-light video / structure enhancement lab.
- Control: temporal denoise.
- Observe: noise reduction, edge preservation, grayscale stability.
- Failure: too much denoise erases structures; too much sharpening creates false edges.

### 3.6 Display Output

Asset:

```text
assets/scenarios/display-output.png
```

Visual elements:

- Unbranded monitor.
- Color patches, grayscale ramp, HDR-like bright and dark regions.
- Calibration puck-like object.
- Ambient light source.

Teaching goals:

- Explain that the pipeline does not end when RGB values are computed.
- Explain sRGB, Display P3, HDR, Gamma, EOTF, and tone mapping.
- Explain why the same RGB values can look different on different panels and under different ambient light.
- Explain why display color management affects phone photography and camera post-production.

Website link:

- Opens the color system and white balance lab.
- Control: color temperature.
- Observe: neutral gray, skin comfort, saturation, shadow/highlight display.
- Failure: overly warm or cool color temperature creates global casts; poor tone loses shadows or highlights.

## 4. Website Requirements

Each scenario card must include:

- Dedicated scene image.
- Device name.
- Real problem description.
- Linked case name.
- Processing pipeline note.
- Actionable observation note.
- Open case button.

The image must not be decorative only. Text below the image should identify the learning elements in the picture, such as window highlights, subject on the phone screen, checkerboard calibration target, grayscale structure, or display color patches.

The advanced lab before/after previews must also use these dedicated scenario assets instead of abstract-only diagrams:

- Focus cases: apply blur and a focal-plane marker on the same scene image.
- Exposure cases: apply brightness, contrast, and highlight-warning overlays to show AE tradeoffs.
- Color cases: apply hue, saturation, and color-cast overlays to show white balance and display adaptation.
- Video cases: apply noise, ghosting, and contrast layers to show denoise side effects.
- Computational photography cases: apply stereo ghosting and match-grid overlays to show alignment confidence.
- AI cases: apply low-resolution pixelation, SR grid overlays, and dehaze layers to show restoration strength and trust boundaries.

## 5. Testing Requirements

- Six images under `assets/scenarios/` must exist.
- Device scenario data must not point back to old `assets/demos/` thumbnails.
- Every scenario must include `pipeline` and `control`.
- Each scenario button must open a valid advanced lab.
- Advanced lab before/after previews must reference `assets/scenarios/` and update filters or overlays when the slider changes.
- Medical imaging docs must state education only, not diagnosis.

## 6. Future Expansion

Each device scenario can later become two layers:

1. Scenario card: what this device is and why it is hard.
2. Case group: multiple real problems under the same device. For example, phone photography can include backlit HDR, night denoise, portrait skin, and multi-camera fusion; VR can include stereo exposure consistency, distortion correction, and low-latency motion compensation.

# Technical Design

## Architecture

The project is split into two layers:

```text
src/isp-core.js
  Pure ISP functions, RAW parsers, image conversion helpers.

src/app.js
  Browser UI, file loading, parameter controls, canvas rendering.
```

This separation keeps the algorithm code testable and makes it possible to later add:

- CLI batch conversion
- Python bindings or reference notebooks
- WASM/WebGPU accelerators
- Dataset regression tests

## Data Model

RAW data is represented as:

```js
{
  width: number,
  height: number,
  data: Float32Array | Uint16Array | Uint8Array,
  bitDepth: number,
  bayerPattern: "RGGB" | "BGGR" | "GRBG" | "GBRG"
}
```

Intermediate RGB data is represented as planar pixel triplets in a `Float32Array`:

```text
[r, g, b, r, g, b, ...]
```

Values are normalized to `0..1` inside the ISP pipeline.

## Pipeline

The current visual pipeline contains ten stages:

```text
RAW Mosaic
  -> Black-level correction
  -> Bad-pixel correction
  -> Lens-shading correction
  -> Bilinear demosaic
  -> White balance / auto white balance
  -> Color correction matrix
  -> Denoise
  -> Sharpen
  -> Exposure / contrast / saturation / gamma
  -> RGB preview
```

### 1. Input Parsing

The MVP supports:

- PGM `P2` ASCII grayscale
- PGM `P5` binary grayscale
- Plain binary RAW with width, height, bit depth, and endian metadata from UI fields

PGM support gives learners a simple way to inspect generated or exported mosaics. Binary RAW support allows quick tests with sensor dumps.

### 2. Black-Level Correction

Sensor samples often include an electrical offset. The MVP subtracts a user-controlled black level and divides by `(whiteLevel - blackLevel)`.

```text
normalized = clamp((sample - blackLevel) / (whiteLevel - blackLevel), 0, 1)
```

### 3. Demosaic

Before demosaic, the pipeline can run bad-pixel correction and lens-shading correction on normalized Bayer data.

Bad-pixel correction compares each Bayer sample against neighboring samples of the same CFA color. If the difference from the local median is larger than the threshold, the sample is replaced by that median.

Lens-shading correction applies a radial gain field. It is a simple educational model that helps learners see why corners often need compensation.

The MVP uses readable bilinear interpolation. For every output pixel:

- The known Bayer channel is copied.
- Missing channels are averaged from nearby samples with the matching Bayer color.
- A small fallback radius handles edge pixels.

This is intentionally simple. It is useful for education because artifacts are easy to explain.

### 4. White Balance

White balance gains are applied independently:

```text
R *= redGain
G *= greenGain
B *= blueGain
```

The UI exposes manual gains and a gray-world auto white balance button. Future versions can add white-patch or ROI-based metering.

### 5. Color Correction Matrix

The MVP applies a 3x3 matrix after white balance:

```text
[R']   [m00 m01 m02] [R]
[G'] = [m10 m11 m12] [G]
[B']   [m20 m21 m22] [B]
```

The default matrix is identity. A small "warm camera" preset is included to demonstrate the stage.

### 6. Tone Mapping And Gamma

The MVP applies simple power-law gamma:

```text
out = pow(clamp(input, 0, 1), 1 / gamma)
```

The current tone stage also includes exposure, contrast, and saturation controls before gamma. This produces a display-friendly preview while keeping the math transparent.

### 7. Detail Stages

The current project includes simple RGB denoise and sharpen stages:

- Denoise uses a small blur blended with the current image.
- Sharpen uses an unsharp-mask style operation.

These are reference implementations for learning. Future optimized versions can use edge-aware filters or frequency-domain methods.

## Visualization

The UI renders canvases for:

- RAW mosaic view
- Normalized RAW
- Bad-pixel corrected RAW
- Lens-shading corrected RAW
- Demosaiced linear RGB
- White balanced RGB
- Color corrected RGB
- Denoised RGB
- Sharpened RGB
- Final gamma RGB

Canvas rendering uses `ImageData`, so the pipeline remains browser-native and simple.

Each stage also renders a compact histogram and a small metric line. This gives beginners immediate feedback about clipping, exposure shifts, and color balance.

## Testing Strategy

The first test layer validates:

- Bayer color-position mapping
- RAW normalization
- Demosaic output shape and finite values
- Pipeline output range
- PGM parsing
- Bad-pixel correction
- Lens-shading correction
- Auto white balance gain estimation
- Histogram generation

Future regression tests should add known RAW fixtures and compare output against stored golden images.

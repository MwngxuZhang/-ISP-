export const BAYER_PATTERNS = ["RGGB", "BGGR", "GRBG", "GBRG"];

export const CCM_PRESETS = {
  identity: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  warm: [1.16, -0.08, -0.02, -0.04, 1.05, -0.01, -0.03, -0.14, 1.28],
  cool: [0.92, 0.02, 0.08, -0.02, 1.03, -0.01, 0.1, 0.02, 0.9],
  srgbLike: [1.42, -0.32, -0.1, -0.18, 1.28, -0.1, 0.04, -0.48, 1.44]
};

export const SAMPLE_SCENES = {
  colorChart: {
    name: "Color chart",
    description: "Saturated color patches plus neutral patches for checking demosaic, white balance, and CCM."
  },
  lowLight: {
    name: "Low light",
    description: "Underexposed noisy scene for studying black level, exposure, denoise, and gamma."
  },
  vignette: {
    name: "Vignette",
    description: "Strong corner falloff for studying lens-shading correction."
  },
  badPixels: {
    name: "Bad pixels",
    description: "Injected hot and dead pixels for studying bad-pixel correction."
  },
  grayscale: {
    name: "Grayscale ramp",
    description: "Neutral grayscale steps for checking white balance and tone mapping."
  },
  highContrast: {
    name: "High contrast",
    description: "Bright and dark blocks for studying clipping, contrast, and gamma."
  }
};

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function bayerColorAt(x, y, pattern = "RGGB") {
  const evenY = (y & 1) === 0;
  const evenX = (x & 1) === 0;
  switch (pattern) {
    case "RGGB":
      return evenY ? (evenX ? "R" : "G") : (evenX ? "G" : "B");
    case "BGGR":
      return evenY ? (evenX ? "B" : "G") : (evenX ? "G" : "R");
    case "GRBG":
      return evenY ? (evenX ? "G" : "R") : (evenX ? "B" : "G");
    case "GBRG":
      return evenY ? (evenX ? "G" : "B") : (evenX ? "R" : "G");
    default:
      throw new Error(`Unsupported Bayer pattern: ${pattern}`);
  }
}

function sceneRgb(scene, nx, ny) {
  if (scene === "lowLight") {
    const base = 0.04 + 0.12 * nx + 0.06 * (1 - ny);
    const lamp = Math.max(0, 1 - Math.hypot(nx - 0.72, ny - 0.32) / 0.22);
    return [base + lamp * 0.45, base + lamp * 0.34, base + lamp * 0.18];
  }

  if (scene === "vignette") {
    const stripes = Math.floor(nx * 8) % 2 === 0 ? 0.72 : 0.48;
    return [stripes * 0.85, stripes, stripes * 0.95];
  }

  if (scene === "grayscale") {
    const step = Math.floor(nx * 8) / 7;
    return [step, step, step];
  }

  if (scene === "highContrast") {
    const checker = (Math.floor(nx * 6) + Math.floor(ny * 4)) % 2;
    const value = checker ? 0.92 : 0.08;
    const highlight = Math.hypot(nx - 0.78, ny - 0.25) < 0.12 ? 1 : value;
    return [highlight, highlight * 0.92, highlight * 0.78];
  }

  const patch = Math.floor(nx * 4) + Math.floor(ny * 3) * 4;
  const gradient = 0.2 + 0.55 * nx + 0.2 * (1 - ny);
  return [
    [1.0, 0.18, 0.12],
    [0.1, 0.8, 0.22],
    [0.12, 0.22, 1.0],
    [0.95, 0.85, 0.18],
    [0.95, 0.35, 0.9],
    [0.1, 0.85, 0.9],
    [0.92, 0.92, 0.92],
    [0.18, 0.18, 0.18],
    [0.75, 0.35, 0.15],
    [0.2, 0.5, 0.85],
    [0.55, 0.8, 0.2],
    [0.78, 0.55, 0.95]
  ][patch] || [gradient, gradient, gradient];
}

export function generateSyntheticRaw(width = 128, height = 96, bitDepth = 12, pattern = "RGGB", scene = "colorChart") {
  const whiteLevel = (1 << bitDepth) - 1;
  const blackLevel = Math.round(whiteLevel * 0.015);
  const data = new Uint16Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const nx = x / Math.max(1, width - 1);
      const ny = y / Math.max(1, height - 1);
      const colors = sceneRgb(scene, nx, ny);
      const color = bayerColorAt(x, y, pattern);
      const channel = color === "R" ? 0 : color === "G" ? 1 : 2;
      const baseVignette = 0.82 + 0.18 * Math.cos((nx - 0.5) * Math.PI) * Math.cos((ny - 0.5) * Math.PI);
      const strongVignette = 0.36 + 0.64 * Math.cos((nx - 0.5) * Math.PI) * Math.cos((ny - 0.5) * Math.PI);
      const vignette = scene === "vignette" ? strongVignette : baseVignette;
      const noise = scene === "lowLight" ? ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 0.035 : 0;
      const signal = clamp(colors[channel] * vignette + noise, 0, 1);
      data[y * width + x] = Math.round(blackLevel + signal * (whiteLevel - blackLevel));
    }
  }

  const defectPixels = scene === "badPixels"
    ? [
        [0.08, 0.16, whiteLevel],
        [0.18, 0.2, whiteLevel],
        [0.24, 0.68, 0],
        [0.32, 0.55, whiteLevel],
        [0.39, 0.33, 0],
        [0.48, 0.76, 0],
        [0.58, 0.18, whiteLevel],
        [0.64, 0.62, whiteLevel],
        [0.72, 0.38, whiteLevel],
        [0.78, 0.84, 0],
        [0.86, 0.72, 0],
        [0.92, 0.26, whiteLevel]
      ]
    : [
        [0.18, 0.2, whiteLevel],
        [0.72, 0.38, whiteLevel],
        [0.48, 0.76, whiteLevel]
      ];

  for (const [fx, fy, value] of defectPixels) {
    const px = Math.floor(width * fx);
    const py = Math.floor(height * fy);
    if (px >= 0 && py >= 0 && px < width && py < height) {
      data[py * width + px] = value;
    }
  }

  return { width, height, data, bitDepth, bayerPattern: pattern, blackLevel, whiteLevel, scene };
}

export function normalizeRaw(rawData, blackLevel, whiteLevel) {
  if (whiteLevel <= blackLevel) {
    throw new Error("White level must be greater than black level.");
  }
  const out = new Float32Array(rawData.length);
  const scale = 1 / (whiteLevel - blackLevel);
  for (let i = 0; i < rawData.length; i += 1) {
    out[i] = clamp((rawData[i] - blackLevel) * scale);
  }
  return out;
}

function sameColorNeighbors(mosaic, width, height, x, y, pattern, radius = 2) {
  const color = bayerColorAt(x, y, pattern);
  const values = [];
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const sx = x + dx;
      const sy = y + dy;
      if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
      if (bayerColorAt(sx, sy, pattern) === color) {
        values.push(mosaic[sy * width + sx]);
      }
    }
  }
  return values;
}

export function correctBadPixels(mosaic, width, height, pattern = "RGGB", threshold = 0.32) {
  const out = new Float32Array(mosaic);
  if (threshold <= 0) {
    return { data: out, count: 0 };
  }

  let count = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const neighbors = sameColorNeighbors(mosaic, width, height, x, y, pattern);
      if (neighbors.length < 2) continue;
      neighbors.sort((a, b) => a - b);
      const median = neighbors[Math.floor(neighbors.length / 2)];
      const current = mosaic[y * width + x];
      if (Math.abs(current - median) > threshold) {
        out[y * width + x] = median;
        count += 1;
      }
    }
  }

  return { data: out, count };
}

export function applyLensShadingCorrection(mosaic, width, height, strength = 0) {
  const out = new Float32Array(mosaic.length);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxRadius = Math.hypot(cx, cy) || 1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const radius = Math.hypot(x - cx, y - cy) / maxRadius;
      const gain = 1 + strength * radius * radius;
      out[y * width + x] = clamp(mosaic[y * width + x] * gain);
    }
  }
  return out;
}

export function demosaicBilinear(mosaic, width, height, pattern = "RGGB") {
  const out = new Float32Array(width * height * 3);
  const channelIndex = { R: 0, G: 1, B: 2 };
  const colorNames = ["R", "G", "B"];

  function sampleChannel(x, y, targetColor) {
    const ownColor = bayerColorAt(x, y, pattern);
    if (ownColor === targetColor) {
      return mosaic[y * width + x];
    }

    let sum = 0;
    let count = 0;
    for (let radius = 1; radius <= 2 && count === 0; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const sx = x + dx;
          const sy = y + dy;
          if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
          if (dx === 0 && dy === 0) continue;
          if (bayerColorAt(sx, sy, pattern) === targetColor) {
            sum += mosaic[sy * width + sx];
            count += 1;
          }
        }
      }
    }
    return count > 0 ? sum / count : mosaic[y * width + x];
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const outIndex = (y * width + x) * 3;
      for (const color of colorNames) {
        out[outIndex + channelIndex[color]] = sampleChannel(x, y, color);
      }
    }
  }

  return out;
}

export function applyWhiteBalance(rgb, gains) {
  const out = new Float32Array(rgb.length);
  const rGain = gains.red ?? 1;
  const gGain = gains.green ?? 1;
  const bGain = gains.blue ?? 1;
  for (let i = 0; i < rgb.length; i += 3) {
    out[i] = rgb[i] * rGain;
    out[i + 1] = rgb[i + 1] * gGain;
    out[i + 2] = rgb[i + 2] * bGain;
  }
  return out;
}

export function applyColorCorrection(rgb, matrix = CCM_PRESETS.identity) {
  const out = new Float32Array(rgb.length);
  for (let i = 0; i < rgb.length; i += 3) {
    const r = rgb[i];
    const g = rgb[i + 1];
    const b = rgb[i + 2];
    out[i] = matrix[0] * r + matrix[1] * g + matrix[2] * b;
    out[i + 1] = matrix[3] * r + matrix[4] * g + matrix[5] * b;
    out[i + 2] = matrix[6] * r + matrix[7] * g + matrix[8] * b;
  }
  return out;
}

function blurRgb(rgb, width, height) {
  const out = new Float32Array(rgb.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const outIndex = (y * width + x) * 3;
      let count = 0;
      let r = 0;
      let g = 0;
      let b = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const sx = x + dx;
          const sy = y + dy;
          if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
          const index = (sy * width + sx) * 3;
          r += rgb[index];
          g += rgb[index + 1];
          b += rgb[index + 2];
          count += 1;
        }
      }
      out[outIndex] = r / count;
      out[outIndex + 1] = g / count;
      out[outIndex + 2] = b / count;
    }
  }
  return out;
}

export function denoiseRgb(rgb, width, height, strength = 0) {
  if (strength <= 0) return new Float32Array(rgb);
  const blurred = blurRgb(rgb, width, height);
  const out = new Float32Array(rgb.length);
  const mix = clamp(strength, 0, 1);
  for (let i = 0; i < rgb.length; i += 1) {
    out[i] = rgb[i] * (1 - mix) + blurred[i] * mix;
  }
  return out;
}

export function sharpenRgb(rgb, width, height, amount = 0) {
  if (amount <= 0) return new Float32Array(rgb);
  const blurred = blurRgb(rgb, width, height);
  const out = new Float32Array(rgb.length);
  for (let i = 0; i < rgb.length; i += 1) {
    out[i] = rgb[i] + (rgb[i] - blurred[i]) * amount;
  }
  return out;
}

export function applyCreativeTone(rgb, options = {}) {
  const exposure = options.exposure ?? 0;
  const contrast = options.contrast ?? 1;
  const saturation = options.saturation ?? 1;
  const exposureGain = Math.pow(2, exposure);
  const out = new Float32Array(rgb.length);

  for (let i = 0; i < rgb.length; i += 3) {
    let r = rgb[i] * exposureGain;
    let g = rgb[i + 1] * exposureGain;
    let b = rgb[i + 2] * exposureGain;
    r = (r - 0.5) * contrast + 0.5;
    g = (g - 0.5) * contrast + 0.5;
    b = (b - 0.5) * contrast + 0.5;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    out[i] = luma + (r - luma) * saturation;
    out[i + 1] = luma + (g - luma) * saturation;
    out[i + 2] = luma + (b - luma) * saturation;
  }

  return out;
}

export function applyGamma(rgb, gamma = 2.2) {
  const out = new Float32Array(rgb.length);
  const invGamma = 1 / gamma;
  for (let i = 0; i < rgb.length; i += 1) {
    out[i] = Math.pow(clamp(rgb[i]), invGamma);
  }
  return out;
}

export function estimateGrayWorldGains(rgb) {
  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = rgb.length / 3;
  for (let i = 0; i < rgb.length; i += 3) {
    r += rgb[i];
    g += rgb[i + 1];
    b += rgb[i + 2];
  }
  const avgR = r / pixels || 1;
  const avgG = g / pixels || 1;
  const avgB = b / pixels || 1;
  return {
    red: clamp(avgG / avgR, 0.25, 4),
    green: 1,
    blue: clamp(avgG / avgB, 0.25, 4)
  };
}

export function computeStats(data, channels = 1) {
  const stats = [];
  for (let c = 0; c < channels; c += 1) {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;
    for (let i = c; i < data.length; i += channels) {
      const value = data[i];
      min = Math.min(min, value);
      max = Math.max(max, value);
      sum += value;
      count += 1;
    }
    stats.push({ min, max, mean: count ? sum / count : 0 });
  }
  return stats;
}

export function computeHistogram(data, channels = 1, bins = 64) {
  const hist = Array.from({ length: channels }, () => new Uint32Array(bins));
  for (let i = 0; i < data.length; i += channels) {
    for (let c = 0; c < channels; c += 1) {
      const bin = Math.min(bins - 1, Math.max(0, Math.floor(clamp(data[i + c]) * bins)));
      hist[c][bin] += 1;
    }
  }
  return hist;
}

export function runIspPipeline(raw, options = {}) {
  const blackLevel = options.blackLevel ?? raw.blackLevel ?? 0;
  const whiteLevel = options.whiteLevel ?? raw.whiteLevel ?? ((1 << (raw.bitDepth ?? 12)) - 1);
  const pattern = options.bayerPattern ?? raw.bayerPattern ?? "RGGB";
  const normalized = normalizeRaw(raw.data, blackLevel, whiteLevel);
  const badPixel = correctBadPixels(normalized, raw.width, raw.height, pattern, options.badPixelThreshold ?? 0);
  const lensShaded = applyLensShadingCorrection(badPixel.data, raw.width, raw.height, options.lensShadingStrength ?? 0);
  const demosaiced = demosaicBilinear(lensShaded, raw.width, raw.height, pattern);
  const whiteBalanced = applyWhiteBalance(demosaiced, options.whiteBalance ?? { red: 1, green: 1, blue: 1 });
  const colorCorrected = applyColorCorrection(whiteBalanced, options.ccm ?? CCM_PRESETS.identity);
  const denoised = denoiseRgb(colorCorrected, raw.width, raw.height, options.denoiseStrength ?? 0);
  const sharpened = sharpenRgb(denoised, raw.width, raw.height, options.sharpenAmount ?? 0);
  const toneMapped = applyCreativeTone(sharpened, {
    exposure: options.exposure ?? 0,
    contrast: options.contrast ?? 1,
    saturation: options.saturation ?? 1
  });
  const finalRgb = applyGamma(toneMapped, options.gamma ?? 2.2);
  return {
    normalized,
    badPixelCorrected: badPixel.data,
    badPixelCount: badPixel.count,
    lensShaded,
    demosaiced,
    whiteBalanced,
    colorCorrected,
    denoised,
    sharpened,
    toneMapped,
    finalRgb
  };
}

export function profileIspPipeline(raw, options = {}, now = () => performance.now()) {
  const blackLevel = options.blackLevel ?? raw.blackLevel ?? 0;
  const whiteLevel = options.whiteLevel ?? raw.whiteLevel ?? ((1 << (raw.bitDepth ?? 12)) - 1);
  const pattern = options.bayerPattern ?? raw.bayerPattern ?? "RGGB";
  const timings = [];

  function measure(key, label, fn) {
    const start = now();
    const value = fn();
    const duration = Math.max(0, now() - start);
    timings.push({ key, label, duration });
    return value;
  }

  const normalized = measure("norm", "BLC / Normalize", () => normalizeRaw(raw.data, blackLevel, whiteLevel));
  const badPixel = measure("bad", "BPC", () => correctBadPixels(normalized, raw.width, raw.height, pattern, options.badPixelThreshold ?? 0));
  const lensShaded = measure("lsc", "LSC", () => applyLensShadingCorrection(badPixel.data, raw.width, raw.height, options.lensShadingStrength ?? 0));
  const demosaiced = measure("demosaic", "Demosaic", () => demosaicBilinear(lensShaded, raw.width, raw.height, pattern));
  const whiteBalanced = measure("wb", "AWB gains", () => applyWhiteBalance(demosaiced, options.whiteBalance ?? { red: 1, green: 1, blue: 1 }));
  const colorCorrected = measure("ccm", "CCM", () => applyColorCorrection(whiteBalanced, options.ccm ?? CCM_PRESETS.identity));
  const denoised = measure("denoise", "Denoise", () => denoiseRgb(colorCorrected, raw.width, raw.height, options.denoiseStrength ?? 0));
  const sharpened = measure("sharpen", "Sharpen", () => sharpenRgb(denoised, raw.width, raw.height, options.sharpenAmount ?? 0));
  const toneMapped = measure("tone-map", "Tone map", () => applyCreativeTone(sharpened, {
    exposure: options.exposure ?? 0,
    contrast: options.contrast ?? 1,
    saturation: options.saturation ?? 1
  }));
  const finalRgb = measure("gamma", "Gamma / Output", () => applyGamma(toneMapped, options.gamma ?? 2.2));

  const rawBytes = raw.data.byteLength ?? raw.data.length * (raw.bitDepth <= 8 ? 1 : 2);
  const rawFloatBuffers = normalized.byteLength + badPixel.data.byteLength + lensShaded.byteLength;
  const rgbFloatBuffers = demosaiced.byteLength + whiteBalanced.byteLength + colorCorrected.byteLength +
    denoised.byteLength + sharpened.byteLength + toneMapped.byteLength + finalRgb.byteLength;
  const canvasBytes = raw.width * raw.height * 4 * 11;
  const memoryBytes = rawBytes + rawFloatBuffers + rgbFloatBuffers + canvasBytes;
  const totalDuration = timings.reduce((sum, item) => sum + item.duration, 0);

  return {
    result: {
      normalized,
      badPixelCorrected: badPixel.data,
      badPixelCount: badPixel.count,
      lensShaded,
      demosaiced,
      whiteBalanced,
      colorCorrected,
      denoised,
      sharpened,
      toneMapped,
      finalRgb
    },
    profile: {
      totalDuration,
      timings,
      memoryBytes,
      pixelCount: raw.width * raw.height,
      megapixels: raw.width * raw.height / 1_000_000
    }
  };
}

export function rawToImageData(mosaic, width, height, pattern = "RGGB", colorize = true) {
  const image = new ImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = Math.round(clamp(mosaic[y * width + x]) * 255);
      const offset = (y * width + x) * 4;
      if (colorize) {
        const color = bayerColorAt(x, y, pattern);
        image.data[offset] = color === "R" ? value : Math.round(value * 0.18);
        image.data[offset + 1] = color === "G" ? value : Math.round(value * 0.18);
        image.data[offset + 2] = color === "B" ? value : Math.round(value * 0.18);
      } else {
        image.data[offset] = value;
        image.data[offset + 1] = value;
        image.data[offset + 2] = value;
      }
      image.data[offset + 3] = 255;
    }
  }
  return image;
}

export function rgbToImageData(rgb, width, height) {
  const image = new ImageData(width, height);
  for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
    image.data[j] = Math.round(clamp(rgb[i]) * 255);
    image.data[j + 1] = Math.round(clamp(rgb[i + 1]) * 255);
    image.data[j + 2] = Math.round(clamp(rgb[i + 2]) * 255);
    image.data[j + 3] = 255;
  }
  return image;
}

export function parseBinaryRaw(arrayBuffer, { width, height, bitDepth = 12, littleEndian = true }) {
  const pixelCount = width * height;
  const bytesPerPixel = bitDepth <= 8 ? 1 : 2;
  if (arrayBuffer.byteLength < pixelCount * bytesPerPixel) {
    throw new Error(`RAW file is too small for ${width}x${height} ${bitDepth}-bit data.`);
  }

  if (bytesPerPixel === 1) {
    return new Uint8Array(arrayBuffer, 0, pixelCount);
  }

  const view = new DataView(arrayBuffer);
  const out = new Uint16Array(pixelCount);
  for (let i = 0; i < pixelCount; i += 1) {
    out[i] = view.getUint16(i * 2, littleEndian);
  }
  return out;
}

export function parsePgm(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let cursor = 0;

  function readToken() {
    while (cursor < bytes.length) {
      const char = String.fromCharCode(bytes[cursor]);
      if (/\s/.test(char)) {
        cursor += 1;
        continue;
      }
      if (char === "#") {
        while (cursor < bytes.length && String.fromCharCode(bytes[cursor]) !== "\n") cursor += 1;
        continue;
      }
      break;
    }
    const start = cursor;
    while (cursor < bytes.length && !/\s/.test(String.fromCharCode(bytes[cursor]))) cursor += 1;
    return new TextDecoder().decode(bytes.slice(start, cursor));
  }

  const magic = readToken();
  if (magic !== "P2" && magic !== "P5") {
    throw new Error("Only P2 and P5 PGM files are supported.");
  }
  const width = Number(readToken());
  const height = Number(readToken());
  const maxValue = Number(readToken());
  if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(maxValue)) {
    throw new Error("Invalid PGM header.");
  }

  if (magic === "P2") {
    const data = new Uint16Array(width * height);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Number(readToken());
    }
    return { width, height, data, bitDepth: Math.ceil(Math.log2(maxValue + 1)), whiteLevel: maxValue };
  }

  while (cursor < bytes.length && /\s/.test(String.fromCharCode(bytes[cursor]))) cursor += 1;
  const pixelCount = width * height;
  if (maxValue < 256) {
    return {
      width,
      height,
      data: new Uint8Array(arrayBuffer, cursor, pixelCount),
      bitDepth: Math.ceil(Math.log2(maxValue + 1)),
      whiteLevel: maxValue
    };
  }

  const out = new Uint16Array(pixelCount);
  const view = new DataView(arrayBuffer, cursor);
  for (let i = 0; i < pixelCount; i += 1) {
    out[i] = view.getUint16(i * 2, false);
  }
  return { width, height, data: out, bitDepth: Math.ceil(Math.log2(maxValue + 1)), whiteLevel: maxValue };
}

import {
  CCM_PRESETS,
  SAMPLE_SCENES,
  computeHistogram,
  computeStats,
  estimateGrayWorldGains,
  generateSyntheticRaw,
  normalizeRaw,
  parseBinaryRaw,
  parsePgm,
  rawToImageData,
  rgbToImageData,
  runIspPipeline
} from "./isp-core.js";
import { demoCaseForScene, getDemoCases } from "./demo-cases.js";
import { getFormulaContent } from "./formula-content.js";
import { getTutorialLabels, getTutorialSteps, tutorialIndexForStage } from "./tutorial-content.js";

const UI_TEXT = {
  en: {
    language: "Language",
    loadCase: "Load Case",
    autoWb: "Auto WB",
    autoEv: "Auto EV",
    reset: "Reset",
    exportPng: "Export PNG",
    presetJson: "Preset JSON",
    guide: "Guide",
    demoHeading: "Choose a tested demo image",
    demoIntro: "Pick one image, then follow the guide from RAW to RGB.",
    formulaEyebrow: "Interactive formula",
    formulaCurrent: "Current value",
    formulaDefault: "Default value",
    formulaReset: "Reset formula",
    formulaResetDone: "Back to the default formula value. Now change it again slowly and watch how the current line leaves the gray reference.",
    formulaResult: (label, value, low, high, normalized) => `${label}: ${value}. ${Number(normalized) < 0.5 ? low : high}.`,
    finalRgb: "Final RGB",
    stageSuffix: "stage",
    rendered: (width, height, pattern, count) => `Rendered ${width}x${height} ${pattern} through ${count} ISP stages.`,
    outputName: "raw-isp-rgb-output.png",
    presetName: "raw-isp-rgb-preset.json",
    labels: {
      sampleScene: "Built-in case",
      width: "Width",
      height: "Height",
      bitDepth: "Bit depth",
      endian: "Endian",
      bayer: "Bayer pattern",
      black: "Black level",
      white: "White level",
      badPixel: "Bad pixel threshold",
      lsc: "Lens shading",
      redGain: "Red gain",
      greenGain: "Green gain",
      blueGain: "Blue gain",
      ccm: "CCM preset",
      exposure: "Exposure EV",
      contrast: "Contrast",
      saturation: "Saturation",
      gamma: "Gamma",
      denoise: "Denoise",
      sharpen: "Sharpen"
    }
  },
  zh: {
    language: "语言",
    loadCase: "加载案例",
    autoWb: "自动白平衡",
    autoEv: "自动曝光",
    reset: "重置",
    exportPng: "导出 PNG",
    presetJson: "导出参数",
    guide: "指南",
    demoHeading: "选择一张已测试演示图",
    demoIntro: "点选图片，然后跟随向导从 RAW 走到 RGB。",
    formulaEyebrow: "交互公式",
    formulaCurrent: "当前值",
    formulaDefault: "默认值",
    formulaReset: "复位公式",
    formulaResetDone: "已经回到默认公式值。现在再慢慢拖动，观察彩色当前线如何离开灰色参考线。",
    formulaResult: (label, value, low, high, normalized) => `${label}：${value}。${Number(normalized) < 0.5 ? low : high}。`,
    finalRgb: "最终 RGB",
    stageSuffix: "阶段",
    rendered: (width, height, pattern, count) => `已完成 ${width}x${height} ${pattern}，共 ${count} 个 ISP 阶段。`,
    outputName: "raw-isp-rgb-output.png",
    presetName: "raw-isp-rgb-preset.json",
    labels: {
      sampleScene: "内置案例",
      width: "宽度",
      height: "高度",
      bitDepth: "位深",
      endian: "大小端",
      bayer: "Bayer 排列",
      black: "黑电平",
      white: "白电平",
      badPixel: "坏点阈值",
      lsc: "镜头阴影",
      redGain: "红色增益",
      greenGain: "绿色增益",
      blueGain: "蓝色增益",
      ccm: "颜色矩阵",
      exposure: "曝光 EV",
      contrast: "对比度",
      saturation: "饱和度",
      gamma: "Gamma",
      denoise: "降噪",
      sharpen: "锐化"
    }
  }
};

const CONTROL_HINTS = {
  sampleSceneInput: {
    mood: "wave",
    en: "New scene selected. Think of it as changing the lesson material before running the same ISP pipeline.",
    zh: "已选择新场景。可以把它理解成换了一份教材，但仍然跑同一条 ISP 流程。"
  },
  blackInput: {
    mood: "think",
    en: "Black level moves the image floor. Watch the left side of the histogram so shadows do not get crushed.",
    zh: "黑电平在移动图像地基。盯住直方图左边，别把暗部压死。"
  },
  whiteInput: {
    mood: "think",
    en: "White level sets the ceiling. If it is too low, highlights hit the roof and clip.",
    zh: "白电平在设定天花板。设得太低，高光会撞到天花板并被裁剪。"
  },
  badPixelInput: {
    mood: "point",
    en: "This threshold decides who is a broken pixel. Too strict deletes texture; too loose leaves sparks.",
    zh: "这个阈值决定谁算坏点。太严格会删纹理，太宽松会留下亮点火花。"
  },
  lscInput: {
    mood: "point",
    en: "Lens shading lifts the corners. Raise it until corners match the center, not beyond it.",
    zh: "镜头阴影在抬四角。抬到接近中心就好，不要超过中心。"
  },
  bayerInput: {
    mood: "think",
    en: "Bayer pattern is the color map. If the map is wrong, every reconstructed color gets lost.",
    zh: "Bayer 排列是颜色地图。地图错了，重建出的颜色就会迷路。"
  },
  redGainInput: {
    mood: "point",
    en: "Red gain warms or cools the neutral patches. Use gray areas as your reference.",
    zh: "红色增益会影响中性块的冷暖。请把灰阶区域当参照。"
  },
  greenGainInput: {
    mood: "point",
    en: "Green is the anchor channel in many WB workflows. Small changes can steer the whole image.",
    zh: "绿色常是白平衡里的锚点通道。小变化也会带动整张图。"
  },
  blueGainInput: {
    mood: "point",
    en: "Blue gain pushes the image cooler or warmer. Watch neutral gray before watching vivid colors.",
    zh: "蓝色增益会让图像偏冷或偏暖。先看中性灰，再看鲜艳色。"
  },
  ccmInput: {
    mood: "think",
    en: "CCM is a color dictionary. It changes hue relationships, not just color strength.",
    zh: "CCM 是颜色词典。它改变色相关系，不只是增强颜色强度。"
  },
  exposureInput: {
    mood: "point",
    en: "Exposure moves the whole brightness stack. Check both highlights and shadows.",
    zh: "曝光会整体移动亮度层级。高光和暗部都要一起看。"
  },
  contrastInput: {
    mood: "think",
    en: "Contrast stretches the distance between dark and bright tones. Too much makes the image brittle.",
    zh: "对比度会拉开明暗距离。太多会让图像变硬、变脆。"
  },
  saturationInput: {
    mood: "point",
    en: "Saturation turns up color intensity after color correction. It cannot fix a wrong CCM.",
    zh: "饱和度是在颜色校正后增强颜色强度。它修不了错误的 CCM。"
  },
  gammaInput: {
    mood: "think",
    en: "Gamma bends midtones for display. It changes how the picture feels, not the sensor capture itself.",
    zh: "Gamma 会弯曲中间调以适配显示。它改变观感，不改变传感器采集本身。"
  },
  denoiseInput: {
    mood: "think",
    en: "Denoise wipes speckles from flat areas. Stop before real texture starts melting.",
    zh: "降噪会擦掉平坦区域的噪点。真实纹理开始融化前就要停。"
  },
  sharpenInput: {
    mood: "point",
    en: "Sharpen gives edges bite. If bright outlines appear, the bite is too strong.",
    zh: "锐化给边缘一点劲儿。如果出现亮边，说明劲儿太大。"
  }
};

const stageDefs = [
  ["raw", "RAW"],
  ["norm", "BLC"],
  ["bad", "BPC"],
  ["lsc", "LSC"],
  ["demosaic", "Demosaic"],
  ["wb", "WB"],
  ["ccm", "CCM"],
  ["denoise", "Denoise"],
  ["sharpen", "Sharpen"],
  ["tone", "RGB"]
];

const MASCOT_EXPRESSIONS = [
  "expr-happy",
  "expr-curious",
  "expr-focused",
  "expr-surprised",
  "expr-proud",
  "expr-sleepy"
];

const moodExpressions = {
  wave: "expr-happy",
  walk: "expr-curious",
  point: "expr-curious",
  think: "expr-focused",
  celebrate: "expr-proud",
  surprised: "expr-surprised",
  sleepy: "expr-sleepy"
};

const els = {
  language: document.querySelector("#languageInput"),
  demoHeading: document.querySelector("#demoHeading"),
  demoIntro: document.querySelector("#demoIntro"),
  sampleButton: document.querySelector("#sampleButton"),
  autoWbButton: document.querySelector("#autoWbButton"),
  autoExposureButton: document.querySelector("#autoExposureButton"),
  resetButton: document.querySelector("#resetButton"),
  exportButton: document.querySelector("#exportButton"),
  presetButton: document.querySelector("#presetButton"),
  fileInput: document.querySelector("#fileInput"),
  sampleScene: document.querySelector("#sampleSceneInput"),
  sampleDescription: document.querySelector("#sampleDescription"),
  demoGallery: document.querySelector("#demoGallery"),
  width: document.querySelector("#widthInput"),
  height: document.querySelector("#heightInput"),
  bitDepth: document.querySelector("#bitDepthInput"),
  endian: document.querySelector("#endianInput"),
  bayer: document.querySelector("#bayerInput"),
  black: document.querySelector("#blackInput"),
  white: document.querySelector("#whiteInput"),
  badPixel: document.querySelector("#badPixelInput"),
  lsc: document.querySelector("#lscInput"),
  redGain: document.querySelector("#redGainInput"),
  greenGain: document.querySelector("#greenGainInput"),
  blueGain: document.querySelector("#blueGainInput"),
  ccm: document.querySelector("#ccmInput"),
  exposure: document.querySelector("#exposureInput"),
  contrast: document.querySelector("#contrastInput"),
  saturation: document.querySelector("#saturationInput"),
  gamma: document.querySelector("#gammaInput"),
  denoise: document.querySelector("#denoiseInput"),
  sharpen: document.querySelector("#sharpenInput"),
  status: document.querySelector("#status"),
  frameReadout: document.querySelector("#frameReadout"),
  rangeReadout: document.querySelector("#rangeReadout"),
  meanReadout: document.querySelector("#meanReadout"),
  badPixelReadout: document.querySelector("#badPixelReadout"),
  heroTitle: document.querySelector("#heroTitle"),
  heroValues: document.querySelector("#heroValues"),
  coachMascot: document.querySelector("#coachMascot"),
  coachMascotStage: document.querySelector("#coachMascotStage"),
  coachBubble: document.querySelector("#coachBubble"),
  coachHeading: document.querySelector("#coachHeading"),
  coachIntro: document.querySelector("#coachIntro"),
  coachStepNumber: document.querySelector("#coachStepNumber"),
  coachStageTitle: document.querySelector("#coachStageTitle"),
  coachPlainLabel: document.querySelector("#coachPlainLabel"),
  coachWhyLabel: document.querySelector("#coachWhyLabel"),
  coachAnalogyLabel: document.querySelector("#coachAnalogyLabel"),
  coachWatchLabel: document.querySelector("#coachWatchLabel"),
  coachTryLabel: document.querySelector("#coachTryLabel"),
  coachControlLabel: document.querySelector("#coachControlLabel"),
  coachExpectedLabel: document.querySelector("#coachExpectedLabel"),
  coachMistakeLabel: document.querySelector("#coachMistakeLabel"),
  coachCheckpointLabel: document.querySelector("#coachCheckpointLabel"),
  coachPlain: document.querySelector("#coachPlain"),
  coachWhy: document.querySelector("#coachWhy"),
  coachAnalogy: document.querySelector("#coachAnalogy"),
  coachWatch: document.querySelector("#coachWatch"),
  coachTry: document.querySelector("#coachTry"),
  coachControl: document.querySelector("#coachControl"),
  coachExpected: document.querySelector("#coachExpected"),
  coachMistake: document.querySelector("#coachMistake"),
  coachCheckpoint: document.querySelector("#coachCheckpoint"),
  formulaEyebrow: document.querySelector("#formulaEyebrow"),
  formulaTitle: document.querySelector("#formulaTitle"),
  formulaText: document.querySelector("#formulaText"),
  formulaCanvas: document.querySelector("#formulaCanvas"),
  formulaLegendCurrent: document.querySelector("#formulaLegendCurrent"),
  formulaLegendDefault: document.querySelector("#formulaLegendDefault"),
  formulaControlLabel: document.querySelector("#formulaControlLabel"),
  formulaInput: document.querySelector("#formulaInput"),
  formulaValue: document.querySelector("#formulaValue"),
  formulaScaleLow: document.querySelector("#formulaScaleLow"),
  formulaScaleHigh: document.querySelector("#formulaScaleHigh"),
  formulaResetButton: document.querySelector("#formulaResetButton"),
  formulaResult: document.querySelector("#formulaResult"),
  formulaVariables: document.querySelector("#formulaVariables"),
  formulaExplanation: document.querySelector("#formulaExplanation"),
  coachProgressBar: document.querySelector("#coachProgressBar"),
  coachProgressText: document.querySelector("#coachProgressText"),
  coachPrevButton: document.querySelector("#coachPrevButton"),
  coachNextButton: document.querySelector("#coachNextButton"),
  coachApplyButton: document.querySelector("#coachApplyButton"),
  coachGotItButton: document.querySelector("#coachGotItButton"),
  coachRestartButton: document.querySelector("#coachRestartButton"),
  floatingPet: document.querySelector("#floatingPet"),
  petAvatar: document.querySelector("#petAvatar"),
  petMascot: document.querySelector("#petMascot"),
  petBubble: document.querySelector("#petBubble"),
  pipelineRail: document.querySelector("#pipelineRail"),
  canvases: {
    raw: document.querySelector("#rawCanvas"),
    norm: document.querySelector("#normCanvas"),
    bad: document.querySelector("#badCanvas"),
    lsc: document.querySelector("#lscCanvas"),
    demosaic: document.querySelector("#demosaicCanvas"),
    wb: document.querySelector("#wbCanvas"),
    ccm: document.querySelector("#ccmCanvas"),
    denoise: document.querySelector("#denoiseCanvas"),
    sharpen: document.querySelector("#sharpenCanvas"),
    tone: document.querySelector("#toneCanvas"),
    final: document.querySelector("#finalCanvas")
  },
  histograms: {},
  metrics: {}
};

const coachCard = document.querySelector(".coach-card");

for (const [key] of stageDefs) {
  els.histograms[key] = document.querySelector(`#${key}Hist`);
  els.metrics[key] = document.querySelector(`#${key}Metric`);
}

let currentRaw = generateSyntheticRaw(160, 112, 12, "RGGB", "colorChart");
let lastFinalImageData = null;
let currentHeroStage = "raw";
let currentTutorialIndex = 0;
const completedTutorialStages = new Set();
const stageImages = {};
let currentDemoId = "color-chart";
let reactionTimer = 0;
let petTimer = 0;
let currentLanguage = loadLanguage();
let tutorialSteps = getTutorialSteps(currentLanguage);
let tutorialLabels = getTutorialLabels(currentLanguage);
let formulaRawBaseline = null;

const defaultControls = {
  badPixel: 0.32,
  lsc: 0.25,
  redGain: 2,
  greenGain: 1,
  blueGain: 1.6,
  ccm: "srgbLike",
  exposure: 0,
  contrast: 1,
  saturation: 1,
  gamma: 2.2,
  denoise: 0.12,
  sharpen: 0.35
};

function loadLanguage() {
  try {
    const saved = localStorage.getItem("rawIspRgbLanguage");
    return saved === "zh" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem("rawIspRgbLanguage", language);
  } catch {
    // File previews can run without localStorage.
  }
}

function text(key) {
  return UI_TEXT[currentLanguage]?.[key] ?? UI_TEXT.en[key];
}

function controlHintFor(input) {
  const hint = CONTROL_HINTS[input?.id];
  if (!hint) return null;
  return {
    mood: hint.mood ?? "point",
    message: hint[currentLanguage] ?? hint.en
  };
}

function setLeadingLabel(input, value) {
  const label = input?.closest?.("label");
  if (!label) return;
  for (const node of label.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) {
      node.textContent = `${value} `;
      return;
    }
  }
}

function refreshStaticText() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  els.language.value = currentLanguage;
  els.sampleButton.textContent = text("loadCase");
  els.autoWbButton.textContent = text("autoWb");
  els.autoExposureButton.textContent = text("autoEv");
  els.resetButton.textContent = text("reset");
  els.exportButton.textContent = text("exportPng");
  els.presetButton.textContent = text("presetJson");
  els.demoHeading.textContent = text("demoHeading");
  els.demoIntro.textContent = text("demoIntro");
  const languageControl = document.querySelector(".language-control");
  if (languageControl?.firstChild) {
    languageControl.firstChild.textContent = `${text("language")} `;
  }
  const labels = UI_TEXT[currentLanguage].labels;
  setLeadingLabel(els.sampleScene, labels.sampleScene);
  setLeadingLabel(els.width, labels.width);
  setLeadingLabel(els.height, labels.height);
  setLeadingLabel(els.bitDepth, labels.bitDepth);
  setLeadingLabel(els.endian, labels.endian);
  setLeadingLabel(els.bayer, labels.bayer);
  setLeadingLabel(els.black, labels.black);
  setLeadingLabel(els.white, labels.white);
  setLeadingLabel(els.badPixel, labels.badPixel);
  setLeadingLabel(els.lsc, labels.lsc);
  setLeadingLabel(els.redGain, labels.redGain);
  setLeadingLabel(els.greenGain, labels.greenGain);
  setLeadingLabel(els.blueGain, labels.blueGain);
  setLeadingLabel(els.ccm, labels.ccm);
  setLeadingLabel(els.exposure, labels.exposure);
  setLeadingLabel(els.contrast, labels.contrast);
  setLeadingLabel(els.saturation, labels.saturation);
  setLeadingLabel(els.gamma, labels.gamma);
  setLeadingLabel(els.denoise, labels.denoise);
  setLeadingLabel(els.sharpen, labels.sharpen);
}

function setLanguage(language) {
  currentLanguage = language === "zh" ? "zh" : "en";
  tutorialSteps = getTutorialSteps(currentLanguage);
  tutorialLabels = getTutorialLabels(currentLanguage);
  saveLanguage(currentLanguage);
  refreshStaticText();
  renderDemoGallery();
  syncSampleDescription();
  updateTutorial(currentHeroStage);
  render();
}

function numberValue(input) {
  return Number(input.value);
}

function setNumber(input, value) {
  input.value = Number(value).toFixed(input.step && input.step.includes(".") ? 2 : 0);
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function anchoredMap(value, min, anchor, max, outMin, outAnchor, outMax) {
  if (value <= anchor) {
    const t = (value - min) / (anchor - min || 1);
    return outMin + clampNumber(t, 0, 1) * (outAnchor - outMin);
  }
  const t = (value - anchor) / (max - anchor || 1);
  return outAnchor + clampNumber(t, 0, 1) * (outMax - outAnchor);
}

function setControlValue(input, value) {
  const min = input.min === "" ? -Infinity : Number(input.min);
  const max = input.max === "" ? Infinity : Number(input.max);
  const nextValue = clampNumber(Number(value), min, max);
  input.value = input.step && input.step.includes(".") ? nextValue.toFixed(2) : String(Math.round(nextValue));
}

function cloneRaw(raw) {
  return {
    ...raw,
    data: raw.data?.slice ? raw.data.slice() : new Float32Array(raw.data)
  };
}

function resetFormulaRawBaseline() {
  formulaRawBaseline = null;
}

function ensureFormulaRawBaseline() {
  if (!formulaRawBaseline || formulaRawBaseline.width !== currentRaw.width || formulaRawBaseline.height !== currentRaw.height) {
    formulaRawBaseline = cloneRaw(currentRaw);
  }
  return formulaRawBaseline;
}

function currentOptions() {
  return {
    blackLevel: numberValue(els.black),
    whiteLevel: numberValue(els.white),
    bayerPattern: els.bayer.value,
    badPixelThreshold: numberValue(els.badPixel),
    lensShadingStrength: numberValue(els.lsc),
    whiteBalance: {
      red: numberValue(els.redGain),
      green: numberValue(els.greenGain),
      blue: numberValue(els.blueGain)
    },
    ccm: CCM_PRESETS[els.ccm.value],
    exposure: numberValue(els.exposure),
    contrast: numberValue(els.contrast),
    saturation: numberValue(els.saturation),
    gamma: numberValue(els.gamma),
    denoiseStrength: numberValue(els.denoise),
    sharpenAmount: numberValue(els.sharpen)
  };
}

function updateReadouts() {
  const outputs = {
    badPixelValue: els.badPixel,
    lscValue: els.lsc,
    redGainValue: els.redGain,
    greenGainValue: els.greenGain,
    blueGainValue: els.blueGain,
    exposureValue: els.exposure,
    contrastValue: els.contrast,
    saturationValue: els.saturation,
    gammaValue: els.gamma,
    denoiseValue: els.denoise,
    sharpenValue: els.sharpen
  };

  for (const [id, input] of Object.entries(outputs)) {
    const output = document.querySelector(`#${id}`);
    output.value = Number(input.value).toFixed(2);
  }
}

function drawCanvas(canvas, imageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
}

function drawFormulaDiagram(stageKey, value, content) {
  const canvas = els.formulaCanvas;
  const width = 360;
  const height = 170;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  const ctx = canvas.getContext("2d");
  ctx.setTransform?.(dpr, 0, 0, dpr, 0, 0);
  const min = Number(content.interaction.min);
  const max = Number(content.interaction.max);
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const defaultValue = Number(content.interaction.value);
  const defaultT = Math.max(0, Math.min(1, (defaultValue - min) / (max - min || 1)));
  const currentColor = stageKey === "bad" || stageKey === "sharpen" ? "#e45145" : "#2374ab";

  const strokePath = (points, color, widthPx = 3, dashed = false) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (dashed) ctx.setLineDash([7, 7]);
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  };

  const toneCurve = (curveValue) => {
    const gamma = Math.max(0.65, curveValue);
    return Array.from({ length: 221 }, (_, x) => {
      const input = x / 220;
      return [48 + x, 120 - Math.pow(input, 1 / gamma) * 92];
    });
  };

  const detailCurve = (curveT, isSharpen) => Array.from({ length: 230 }, (_, x) => {
    const noise = Math.sin(x * 0.45) * (isSharpen ? 7 + curveT * 16 : (1 - curveT) * 14);
    const edge = x > 112 ? 34 : -18;
    return [45 + x, 76 + edge + noise];
  });

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7fbfc";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#d6e4ea";
  ctx.lineWidth = 1;
  for (let x = 20; x < width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x, height - 18);
    ctx.stroke();
  }
  for (let y = 22; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(14, y);
    ctx.lineTo(width - 14, y);
    ctx.stroke();
  }

  if (stageKey === "raw" || stageKey === "demosaic") {
    const colors = ["#e45145", "#38a169", "#38a169", "#3b82f6"];
    const cell = 22;
    const startX = 34;
    const startY = 24;
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 6; x += 1) {
        const index = (x % 2) + (y % 2) * 2;
        ctx.fillStyle = colors[index];
        ctx.globalAlpha = stageKey === "raw" ? 0.35 + t * 0.55 : 0.45;
        ctx.fillRect(startX + x * cell, startY + y * cell, cell - 3, cell - 3);
      }
    }
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#91a5af";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 6, startY - 6, cell * 6 + 3, cell * 4 + 3);
    ctx.restore();
    if (stageKey === "demosaic") {
      ctx.fillStyle = "rgba(145, 165, 175, .18)";
      ctx.fillRect(186, 28, 86, 74);
      ctx.fillStyle = `rgba(35, 116, 171, ${0.18 + t * 0.38})`;
      ctx.fillRect(186, 28, 86, 74);
      ctx.strokeStyle = "#2374ab";
      ctx.lineWidth = 3;
      ctx.strokeRect(186, 28, 86, 74);
    }
  } else if (stageKey === "norm") {
    const floor = 112 - t * 58;
    const defaultFloor = 112 - defaultT * 58;
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = "#91a5af";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(38, defaultFloor);
    ctx.lineTo(264, defaultFloor);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#dfe8ed";
    ctx.fillRect(38, floor, 226, 6);
    ctx.fillStyle = "#2f855a";
    for (let i = 0; i < 12; i += 1) {
      const h = 18 + ((i * 19) % 62);
      ctx.fillRect(46 + i * 17, floor - h, 9, h);
    }
    ctx.fillStyle = "#26323a";
    ctx.fillRect(38, floor + 13, 68, 2);
  } else if (stageKey === "bad") {
    ctx.fillStyle = "#9fb7c2";
    for (let i = 0; i < 36; i += 1) {
      const x = 32 + (i % 12) * 20;
      const y = 30 + Math.floor(i / 12) * 28;
      ctx.fillRect(x, y, 9, 9);
    }
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#91a5af";
    ctx.lineWidth = 2;
    ctx.strokeRect(124 + defaultT * 62, 50, 21, 21);
    ctx.restore();
    ctx.fillStyle = t < 0.45 ? "#2f855a" : "#e45145";
    ctx.fillRect(124 + t * 62 + 4, 58, 13, 13);
    ctx.strokeStyle = "#25313a";
    ctx.lineWidth = 2;
    ctx.strokeRect(124 + t * 62, 54, 21, 21);
  } else if (stageKey === "lsc") {
    const radius = 18 + t * 54;
    const defaultRadius = 18 + defaultT * 54;
    const gradient = ctx.createRadialGradient?.(160, 76, 10, 160, 76, 120);
    if (gradient) {
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, t > 0.72 ? "#ffe4a3" : "#9fc8d3");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#c9e3ea";
    }
    ctx.fillRect(50, 24, 220, 96);
    ctx.strokeStyle = "#2374ab";
    ctx.strokeRect(50, 24, 220, 96);
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = "#91a5af";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc?.(160, 76, defaultRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "#e0a826";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc?.(160, 76, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (stageKey === "wb" || stageKey === "ccm") {
    const bars = stageKey === "wb"
      ? [0.35 + t * 0.45, 0.55, 0.8 - t * 0.35]
      : [0.45 + t * 0.18, 0.58 - t * 0.08, 0.48 + t * 0.24];
    const defaultBars = stageKey === "wb"
      ? [0.35 + defaultT * 0.45, 0.55, 0.8 - defaultT * 0.35]
      : [0.45 + defaultT * 0.18, 0.58 - defaultT * 0.08, 0.48 + defaultT * 0.24];
    ["#e45145", "#38a169", "#3b82f6"].forEach((color, index) => {
      ctx.fillStyle = "rgba(145, 165, 175, .28)";
      ctx.fillRect(56 + index * 70, 118 - defaultBars[index] * 86, 52, defaultBars[index] * 86);
      ctx.fillStyle = color;
      ctx.fillRect(66 + index * 70, 118 - bars[index] * 86, 32, bars[index] * 86);
    });
  } else if (stageKey === "denoise" || stageKey === "sharpen") {
    const isSharpen = stageKey === "sharpen";
    strokePath(detailCurve(defaultT, isSharpen), "#91a5af", 2, true);
    strokePath(detailCurve(t, isSharpen), isSharpen ? "#e45145" : "#2374ab", 3, false);
  } else {
    strokePath(toneCurve(defaultValue), "#91a5af", 2, true);
    strokePath(toneCurve(value), currentColor, 3, false);
  }

  ctx.setTransform?.(1, 0, 0, 1, 0, 0);
}

function updateFormulaResult(content, value) {
  const min = Number(content.interaction.min);
  const max = Number(content.interaction.max);
  const normalized = ((value - min) / (max - min || 1)).toFixed(2);
  els.formulaValue.textContent = Number(value).toFixed(2);
  els.formulaResult.textContent = text("formulaResult")(
    content.interaction.label,
    Number(value).toFixed(2),
    content.interaction.low,
    content.interaction.high,
    normalized
  );
  drawFormulaDiagram(tutorialSteps[currentTutorialIndex]?.key ?? "raw", value, content);
}

function updateFormulaLab(step) {
  const content = getFormulaContent(step.key, currentLanguage);
  els.formulaEyebrow.textContent = text("formulaEyebrow");
  els.formulaLegendCurrent.textContent = text("formulaCurrent");
  els.formulaLegendDefault.textContent = text("formulaDefault");
  els.formulaResetButton.textContent = text("formulaReset");
  els.formulaTitle.textContent = content.title;
  els.formulaText.textContent = content.formula;
  els.formulaControlLabel.textContent = content.interaction.label;
  els.formulaScaleLow.textContent = content.interaction.low;
  els.formulaScaleHigh.textContent = content.interaction.high;
  els.formulaInput.min = content.interaction.min;
  els.formulaInput.max = content.interaction.max;
  els.formulaInput.step = content.interaction.step;
  els.formulaInput.dataset.default = content.interaction.value;
  if (els.formulaInput.dataset.stage !== step.key) {
    els.formulaInput.value = content.interaction.value;
    els.formulaInput.dataset.stage = step.key;
  }
  els.formulaVariables.innerHTML = "";
  for (const variable of content.variables) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = variable.name;
    dd.textContent = variable.text;
    row.append(dt, dd);
    els.formulaVariables.append(row);
  }
  els.formulaExplanation.textContent = content.plain;
  updateFormulaResult(content, Number(els.formulaInput.value));
}

function applyFormulaToPipeline(stageKey, value, content) {
  currentHeroStage = stageKey;
  const min = Number(content.interaction.min);
  const max = Number(content.interaction.max);
  const anchor = Number(content.interaction.value);
  const t = clampNumber((value - min) / (max - min || 1), 0, 1);
  const whiteLevel = Math.max(1, numberValue(els.white));

  if (stageKey === "raw") {
    const baseline = ensureFormulaRawBaseline();
    const factor = anchoredMap(value, min, anchor, max, 0.35, 1, 1.85);
    const data = new Float32Array(baseline.data.length);
    for (let i = 0; i < baseline.data.length; i += 1) {
      data[i] = clampNumber(baseline.data[i] * factor, 0, whiteLevel);
    }
    currentRaw = { ...baseline, data };
  } else if (stageKey === "norm") {
    const defaultBlack = currentRaw.blackLevel ?? 64;
    setControlValue(els.black, anchoredMap(value, min, anchor, max, 0, defaultBlack, whiteLevel * 0.28));
  } else if (stageKey === "bad") {
    setControlValue(els.badPixel, value);
  } else if (stageKey === "lsc") {
    setControlValue(els.lsc, value);
  } else if (stageKey === "demosaic") {
    const patterns = ["RGGB", "GRBG", "GBRG", "BGGR"];
    els.bayer.value = patterns[Math.min(patterns.length - 1, Math.floor(t * patterns.length))];
  } else if (stageKey === "wb") {
    setControlValue(els.redGain, anchoredMap(value, min, anchor, max, 1.1, defaultControls.redGain, 3.2));
    setControlValue(els.greenGain, 1);
    setControlValue(els.blueGain, anchoredMap(value, min, anchor, max, 2.35, defaultControls.blueGain, 0.75));
  } else if (stageKey === "ccm") {
    els.ccm.value = t < 0.34 ? "identity" : t < 0.68 ? "srgbLike" : "warm";
  } else if (stageKey === "denoise") {
    setControlValue(els.denoise, value);
  } else if (stageKey === "sharpen") {
    setControlValue(els.sharpen, value);
  } else if (stageKey === "tone") {
    setControlValue(els.gamma, value);
  }

  render();
}

function stageLabel(key) {
  return stageDefs.find(([stageKey]) => stageKey === key)?.[1] ?? "Stage";
}

function updateHero(key = currentHeroStage) {
  const imageData = stageImages[key] || lastFinalImageData;
  if (!imageData) return;
  currentHeroStage = key;
  drawCanvas(els.canvases.final, imageData);
  els.heroTitle.textContent = key === "tone" ? text("finalRgb") : `${stageLabel(key)} ${text("stageSuffix")}`;
}

function updateRailActive(key) {
  for (const item of els.pipelineRail.querySelectorAll("button")) {
    item.classList.toggle("active", item.dataset.target === key);
  }
}

function updateTutorial(key = currentHeroStage) {
  currentTutorialIndex = tutorialIndexForStage(key, tutorialSteps);
  const step = tutorialSteps[currentTutorialIndex];
  const completedCount = completedTutorialStages.size;
  const progressPercent = Math.round((completedCount / tutorialSteps.length) * 100);
  els.coachHeading.textContent = tutorialLabels.heading;
  els.coachIntro.textContent = tutorialLabels.intro;
  els.coachPlainLabel.textContent = tutorialLabels.plainLabel;
  els.coachWhyLabel.textContent = tutorialLabels.whyLabel;
  els.coachAnalogyLabel.textContent = tutorialLabels.analogyLabel;
  els.coachWatchLabel.textContent = tutorialLabels.watchLabel;
  els.coachTryLabel.textContent = tutorialLabels.tryLabel;
  els.coachControlLabel.textContent = tutorialLabels.controlLabel;
  els.coachExpectedLabel.textContent = tutorialLabels.expectedLabel;
  els.coachMistakeLabel.textContent = tutorialLabels.mistakeLabel;
  els.coachCheckpointLabel.textContent = tutorialLabels.checkpointLabel;
  els.coachPrevButton.textContent = tutorialLabels.previous;
  els.coachNextButton.textContent = tutorialLabels.next;
  els.coachApplyButton.textContent = tutorialLabels.applyTip;
  els.coachGotItButton.textContent = completedTutorialStages.has(step.key) ? tutorialLabels.understood : tutorialLabels.gotIt;
  els.coachRestartButton.textContent = tutorialLabels.restart;
  els.coachStepNumber.textContent = currentLanguage === "zh"
    ? `${tutorialLabels.stepPrefix} ${currentTutorialIndex + 1} / ${tutorialSteps.length} 步`
    : `${tutorialLabels.stepPrefix} ${currentTutorialIndex + 1} / ${tutorialSteps.length}`;
  els.coachStageTitle.textContent = step.title;
  els.coachPlain.textContent = step.plain;
  els.coachWhy.textContent = step.why;
  els.coachAnalogy.textContent = step.analogy;
  els.coachWatch.textContent = step.watch;
  els.coachTry.textContent = step.try;
  els.coachControl.textContent = step.control;
  els.coachExpected.textContent = step.expected;
  els.coachMistake.textContent = step.mistake;
  els.coachCheckpoint.textContent = step.checkpoint;
  els.coachBubble.textContent = step.bubble;
  updateFormulaLab(step);
  els.coachProgressBar.style.width = `${progressPercent}%`;
  els.coachProgressText.textContent = `${completedCount} / ${tutorialSteps.length} ${tutorialLabels.progressSuffix}`;
  els.coachPrevButton.disabled = currentTutorialIndex === 0;
  els.coachNextButton.disabled = currentTutorialIndex === tutorialSteps.length - 1;
  els.coachGotItButton.disabled = completedTutorialStages.has(step.key);
}

function setMascotExpression(element, expression = "expr-curious") {
  if (!element) return;
  element.classList.remove(...MASCOT_EXPRESSIONS);
  element.classList.add(expression);
}

function expressionForMood(mood) {
  return moodExpressions[mood] || "expr-curious";
}

function reactMascot(kind, message) {
  const className = `react-${kind}`;
  window.clearTimeout(reactionTimer);
  coachCard.classList.remove("react-wave", "react-point", "react-think", "react-celebrate");
  void coachCard.offsetWidth;
  coachCard.classList.add(className);
  setMascotExpression(els.coachMascot, expressionForMood(kind));
  if (message) {
    els.coachBubble.textContent = message;
    els.coachBubble.style.animation = "none";
    void els.coachBubble.offsetWidth;
    els.coachBubble.style.animation = "";
  }
  reactionTimer = window.setTimeout(() => {
    coachCard.classList.remove(className);
    setMascotExpression(els.coachMascot, "expr-curious");
  }, 900);
}

function petSay(message, mood = "point") {
  window.clearTimeout(petTimer);
  els.floatingPet.classList.remove("pet-walk", "pet-wave", "pet-point", "pet-think", "pet-celebrate", "pet-surprised");
  void els.floatingPet.offsetWidth;
  els.floatingPet.classList.add(`pet-${mood}`);
  setMascotExpression(els.petMascot, expressionForMood(mood));
  els.petBubble.textContent = message;
  els.petBubble.style.animation = "none";
  void els.petBubble.offsetWidth;
  els.petBubble.style.animation = "";
  petTimer = window.setTimeout(() => {
    els.floatingPet.classList.remove(`pet-${mood}`);
    setMascotExpression(els.petMascot, "expr-curious");
  }, 950);
}

function movePetNear(target, message, mood = "walk") {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) {
    petSay(message, mood);
    return;
  }
  const rect = element.getBoundingClientRect();
  const petWidth = els.floatingPet.offsetWidth || 210;
  const petHeight = els.floatingPet.offsetHeight || 130;
  const margin = 12;
  let left = rect.right + margin;
  let top = rect.top + rect.height / 2 - petHeight / 2;
  if (left + petWidth > window.innerWidth - margin) {
    left = rect.left - petWidth - margin;
  }
  if (left < margin) {
    left = Math.min(window.innerWidth - petWidth - margin, margin);
    top = rect.bottom + margin;
  }
  top = Math.max(margin, Math.min(window.innerHeight - petHeight - margin, top));
  els.floatingPet.style.left = `${Math.round(left)}px`;
  els.floatingPet.style.top = `${Math.round(top)}px`;
  petSay(message, mood);
}

function selectStage(key, scroll = false) {
  if (scroll) {
    document.querySelector(`[data-stage="${key}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  updateRailActive(key);
  updateHero(key);
  updateTutorial(key);
  const stepIndex = tutorialIndexForStage(key, tutorialSteps);
  const step = tutorialSteps[stepIndex];
  const message = step.tapBubble || step.bubble;
  reactMascot("point", message);
  movePetNear(scroll ? `[data-stage="${key}"]` : (step.anchor || `[data-stage="${key}"]`), message, "point");
}

function drawHistogram(canvas, hist, colors) {
  const width = 160;
  const height = 48;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#11161b";
  ctx.fillRect(0, 0, width, height);
  const maxValue = Math.max(1, ...hist.flatMap((channel) => [...channel]));
  const binWidth = width / hist[0].length;

  hist.forEach((channel, channelIndex) => {
    ctx.strokeStyle = colors[channelIndex] || "#d8dee5";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    channel.forEach((value, bin) => {
      const x = bin * binWidth;
      const y = height - (value / maxValue) * (height - 4) - 2;
      if (bin === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function metricText(data, channels) {
  const stats = computeStats(data, channels);
  if (channels === 1) {
    return `min ${stats[0].min.toFixed(2)} | mean ${stats[0].mean.toFixed(2)} | max ${stats[0].max.toFixed(2)}`;
  }
  return `R ${stats[0].mean.toFixed(2)} | G ${stats[1].mean.toFixed(2)} | B ${stats[2].mean.toFixed(2)}`;
}

function renderStage(key, data, channels, imageData, histogramColors) {
  stageImages[key] = imageData;
  drawCanvas(els.canvases[key], imageData);
  drawHistogram(els.histograms[key], computeHistogram(data, channels, 64), histogramColors);
  els.metrics[key].textContent = metricText(data, channels);
}

function syncMetadata(raw) {
  els.width.value = raw.width;
  els.height.value = raw.height;
  els.bitDepth.value = raw.bitDepth ?? 12;
  els.bayer.value = raw.bayerPattern ?? els.bayer.value;
  els.black.value = raw.blackLevel ?? 0;
  els.white.value = raw.whiteLevel ?? ((1 << Number(els.bitDepth.value)) - 1);
}

function syncSampleDescription() {
  const demo = demoCaseForScene(els.sampleScene.value, currentLanguage);
  currentDemoId = demo.id;
  els.sampleDescription.textContent = demo?.description ?? SAMPLE_SCENES[els.sampleScene.value]?.description ?? "";
  updateDemoActive();
}

function updateDemoActive() {
  if (!els.demoGallery) return;
  for (const button of els.demoGallery.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.demoId === currentDemoId);
  }
}

function loadDemoCase(demo) {
  currentDemoId = demo.id;
  els.sampleScene.value = demo.scene;
  syncSampleDescription();
  currentHeroStage = "raw";
  currentRaw = generateSyntheticRaw(
    numberValue(els.width),
    numberValue(els.height),
    numberValue(els.bitDepth),
    els.bayer.value,
    demo.scene
  );
  resetFormulaRawBaseline();
  syncMetadata(currentRaw);
  render();
  const readyMessage = currentLanguage === "zh"
    ? `${tutorialLabels.reactions.demo} 当前案例：${demo.title}。`
    : `${tutorialLabels.reactions.demo} ${demo.title} is ready.`;
  reactMascot("wave", readyMessage);
  movePetNear(`[data-demo-id="${demo.id}"]`, readyMessage, "walk");
}

function renderDemoGallery() {
  if (!els.demoGallery) return;
  els.demoGallery.innerHTML = "";
  for (const demo of getDemoCases(currentLanguage)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "demo-card";
    button.dataset.demoId = demo.id;
    button.innerHTML = `
      <img src="${demo.thumbnail}" alt="${demo.title} demo thumbnail">
      <span class="demo-title">${demo.title}</span>
      <span class="demo-focus">${demo.focus}</span>
      <span class="demo-desc">${demo.description}</span>
    `;
    button.addEventListener("click", () => loadDemoCase(demo));
    els.demoGallery.append(button);
  }
  updateDemoActive();
}

function renderRail() {
  els.pipelineRail.innerHTML = "";
  for (const [key, label] of stageDefs) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.target = key;
    button.addEventListener("click", () => {
      document.querySelector(`[data-stage="${key}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      selectStage(key);
    });
    els.pipelineRail.append(button);
  }
  els.pipelineRail.querySelector("button")?.classList.add("active");
}

function render() {
  try {
    updateReadouts();
    const pattern = els.bayer.value;
    const options = currentOptions();
    const normalizedForRawPreview = normalizeRaw(currentRaw.data, options.blackLevel, options.whiteLevel);
    const result = runIspPipeline({ ...currentRaw, bayerPattern: pattern }, options);
    const gray = ["#d7dee4"];
    const rgb = ["#e45145", "#38a169", "#3b82f6"];

    renderStage("raw", normalizedForRawPreview, 1, rawToImageData(normalizedForRawPreview, currentRaw.width, currentRaw.height, pattern, true), gray);
    renderStage("norm", result.normalized, 1, rawToImageData(result.normalized, currentRaw.width, currentRaw.height, pattern, false), gray);
    renderStage("bad", result.badPixelCorrected, 1, rawToImageData(result.badPixelCorrected, currentRaw.width, currentRaw.height, pattern, false), gray);
    renderStage("lsc", result.lensShaded, 1, rawToImageData(result.lensShaded, currentRaw.width, currentRaw.height, pattern, false), gray);
    renderStage("demosaic", result.demosaiced, 3, rgbToImageData(result.demosaiced, currentRaw.width, currentRaw.height), rgb);
    renderStage("wb", result.whiteBalanced, 3, rgbToImageData(result.whiteBalanced, currentRaw.width, currentRaw.height), rgb);
    renderStage("ccm", result.colorCorrected, 3, rgbToImageData(result.colorCorrected, currentRaw.width, currentRaw.height), rgb);
    renderStage("denoise", result.denoised, 3, rgbToImageData(result.denoised, currentRaw.width, currentRaw.height), rgb);
    renderStage("sharpen", result.sharpened, 3, rgbToImageData(result.sharpened, currentRaw.width, currentRaw.height), rgb);

    lastFinalImageData = rgbToImageData(result.finalRgb, currentRaw.width, currentRaw.height);
    renderStage("tone", result.finalRgb, 3, lastFinalImageData, rgb);
    selectStage(currentHeroStage);

    const finalStats = computeStats(result.finalRgb, 3);
    els.frameReadout.textContent = `${currentRaw.width} x ${currentRaw.height} ${pattern}`;
    els.rangeReadout.textContent = `${Math.min(...finalStats.map((s) => s.min)).toFixed(2)} .. ${Math.max(...finalStats.map((s) => s.max)).toFixed(2)}`;
    els.meanReadout.textContent = finalStats.map((s) => s.mean.toFixed(2)).join(" / ");
    els.badPixelReadout.textContent = String(result.badPixelCount);
    els.heroValues.textContent = `R ${finalStats[0].mean.toFixed(2)}  G ${finalStats[1].mean.toFixed(2)}  B ${finalStats[2].mean.toFixed(2)}`;
    els.status.textContent = text("rendered")(currentRaw.width, currentRaw.height, pattern, stageDefs.length);
  } catch (error) {
    els.status.textContent = error.message;
  }
}

async function loadFile(file) {
  const buffer = await file.arrayBuffer();
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pgm")) {
    const parsed = parsePgm(buffer);
    currentRaw = {
      ...parsed,
      bayerPattern: els.bayer.value,
      blackLevel: 0
    };
  } else {
    const width = numberValue(els.width);
    const height = numberValue(els.height);
    const bitDepth = numberValue(els.bitDepth);
    currentRaw = {
      width,
      height,
      bitDepth,
      bayerPattern: els.bayer.value,
      data: parseBinaryRaw(buffer, {
        width,
        height,
        bitDepth,
        littleEndian: els.endian.value === "little"
      }),
      blackLevel: numberValue(els.black),
      whiteLevel: numberValue(els.white)
    };
  }
  resetFormulaRawBaseline();
  syncMetadata(currentRaw);
  render();
}

function downloadUrl(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

els.sampleButton.addEventListener("click", () => {
  currentDemoId = demoCaseForScene(els.sampleScene.value, currentLanguage).id;
  currentHeroStage = "raw";
  currentRaw = generateSyntheticRaw(
    numberValue(els.width),
    numberValue(els.height),
    numberValue(els.bitDepth),
    els.bayer.value,
    els.sampleScene.value
  );
  resetFormulaRawBaseline();
  syncMetadata(currentRaw);
  updateDemoActive();
  render();
});

els.autoWbButton.addEventListener("click", () => {
  const options = { ...currentOptions(), whiteBalance: { red: 1, green: 1, blue: 1 } };
  const result = runIspPipeline({ ...currentRaw, bayerPattern: els.bayer.value }, options);
  const gains = estimateGrayWorldGains(result.demosaiced);
  els.redGain.value = gains.red.toFixed(2);
  els.greenGain.value = gains.green.toFixed(2);
  els.blueGain.value = gains.blue.toFixed(2);
  render();
});

els.autoExposureButton.addEventListener("click", () => {
  const options = { ...currentOptions(), exposure: 0 };
  const result = runIspPipeline({ ...currentRaw, bayerPattern: els.bayer.value }, options);
  const stats = computeStats(result.sharpened, 3);
  const mean = (stats[0].mean + stats[1].mean + stats[2].mean) / 3 || 0.01;
  els.exposure.value = Math.max(-2, Math.min(2, Math.log2(0.38 / mean))).toFixed(2);
  render();
});

els.resetButton.addEventListener("click", () => {
  els.badPixel.value = defaultControls.badPixel;
  els.lsc.value = defaultControls.lsc;
  els.redGain.value = defaultControls.redGain;
  els.greenGain.value = defaultControls.greenGain;
  els.blueGain.value = defaultControls.blueGain;
  els.ccm.value = defaultControls.ccm;
  els.exposure.value = defaultControls.exposure;
  els.contrast.value = defaultControls.contrast;
  els.saturation.value = defaultControls.saturation;
  els.gamma.value = defaultControls.gamma;
  els.denoise.value = defaultControls.denoise;
  els.sharpen.value = defaultControls.sharpen;
  currentHeroStage = "raw";
  render();
});

function applyTutorialTip() {
  const step = tutorialSteps[currentTutorialIndex];
  if (step.key === "raw") {
    els.sampleScene.value = "colorChart";
    syncSampleDescription();
    els.sampleButton.click();
  } else if (step.key === "norm") {
    els.black.value = currentRaw.blackLevel ?? 64;
  } else if (step.key === "bad") {
    els.sampleScene.value = "badPixels";
    syncSampleDescription();
    els.badPixel.value = 0.25;
    els.sampleButton.click();
  } else if (step.key === "lsc") {
    els.sampleScene.value = "vignette";
    syncSampleDescription();
    els.lsc.value = 0.9;
    els.sampleButton.click();
  } else if (step.key === "demosaic") {
    els.bayer.value = els.bayer.value === "RGGB" ? "BGGR" : "RGGB";
  } else if (step.key === "wb") {
    els.autoWbButton.click();
    return;
  } else if (step.key === "ccm") {
    els.sampleScene.value = "colorChart";
    syncSampleDescription();
    els.ccm.value = els.ccm.value === "srgbLike" ? "warm" : "srgbLike";
    els.sampleButton.click();
  } else if (step.key === "denoise") {
    els.sampleScene.value = "lowLight";
    syncSampleDescription();
    els.denoise.value = 0.45;
    els.sampleButton.click();
  } else if (step.key === "sharpen") {
    els.sharpen.value = Math.min(2, numberValue(els.sharpen) + 0.35).toFixed(2);
  } else if (step.key === "tone") {
    els.sampleScene.value = "highContrast";
    syncSampleDescription();
    els.sampleButton.click();
    els.autoExposureButton.click();
    return;
  }
  render();
  selectStage(step.key);
  const message = step.tipBubble || tutorialLabels.reactions.tip;
  reactMascot("think", message);
  movePetNear(step.anchor || `[data-stage="${step.key}"]`, message, "think");
}

els.exportButton.addEventListener("click", () => {
  if (!lastFinalImageData) return;
  const canvas = document.createElement("canvas");
  canvas.width = lastFinalImageData.width;
  canvas.height = lastFinalImageData.height;
  canvas.getContext("2d").putImageData(lastFinalImageData, 0, 0);
  canvas.toBlob((blob) => {
    if (blob) downloadUrl(URL.createObjectURL(blob), text("outputName"));
  });
});

els.presetButton.addEventListener("click", () => {
  const payload = JSON.stringify({
    bayerPattern: els.bayer.value,
    options: currentOptions()
  }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  downloadUrl(URL.createObjectURL(blob), text("presetName"));
});

els.language.addEventListener("change", () => {
  setLanguage(els.language.value);
});

els.fileInput.addEventListener("change", async () => {
  const [file] = els.fileInput.files;
  if (!file) return;
  try {
    await loadFile(file);
  } catch (error) {
    els.status.textContent = error.message;
  }
});

for (const input of document.querySelectorAll("input, select")) {
  if (input.type !== "file") {
    input.addEventListener("input", () => {
      if (input === els.language) return;
      if (input === els.formulaInput) return;
      if (input === els.sampleScene) syncSampleDescription();
      render();
      const hint = controlHintFor(input);
      if (hint) {
        reactMascot(hint.mood, hint.message);
        movePetNear(input, hint.message, hint.mood);
      }
    });
  }
}

els.formulaInput.addEventListener("input", () => {
  const step = tutorialSteps[currentTutorialIndex];
  const content = getFormulaContent(step.key, currentLanguage);
  const value = Number(els.formulaInput.value);
  applyFormulaToPipeline(step.key, value, content);
  updateFormulaResult(content, value);
  const message = currentLanguage === "zh"
    ? `我正在把公式里的“${content.interaction.label}”同步到真实 ISP 参数。小图和真实案例图会一起变化。`
    : `I am syncing "${content.interaction.label}" from the formula into the real ISP pipeline. The mini diagram and real case image now change together.`;
  reactMascot("think", message);
  movePetNear(els.formulaInput, message, "think");
});

els.formulaResetButton.addEventListener("click", () => {
  const step = tutorialSteps[currentTutorialIndex];
  const content = getFormulaContent(step.key, currentLanguage);
  els.formulaInput.value = els.formulaInput.dataset.default || content.interaction.value;
  const value = Number(els.formulaInput.value);
  applyFormulaToPipeline(step.key, value, content);
  updateFormulaResult(content, value);
  const message = text("formulaResetDone");
  reactMascot("wave", message);
  movePetNear(els.formulaResetButton, message, "wave");
});

for (const [key] of stageDefs) {
  document.querySelector(`[data-stage="${key}"]`)?.addEventListener("click", () => selectStage(key));
}

els.coachPrevButton.addEventListener("click", () => {
  const previous = tutorialSteps[Math.max(0, currentTutorialIndex - 1)];
  selectStage(previous.key, true);
});

els.coachNextButton.addEventListener("click", () => {
  const next = tutorialSteps[Math.min(tutorialSteps.length - 1, currentTutorialIndex + 1)];
  selectStage(next.key, true);
});

els.coachApplyButton.addEventListener("click", applyTutorialTip);

els.coachGotItButton.addEventListener("click", () => {
  const step = tutorialSteps[currentTutorialIndex];
  completedTutorialStages.add(step.key);
  const next = tutorialSteps[Math.min(tutorialSteps.length - 1, currentTutorialIndex + 1)];
  updateTutorial(step.key);
  if (next.key !== step.key) {
    selectStage(next.key, true);
  }
  const message = step.doneBubble || tutorialLabels.reactions.gotIt;
  reactMascot("celebrate", message);
  movePetNear(`[data-stage="${next.key}"]`, message, "celebrate");
});

els.coachRestartButton.addEventListener("click", () => {
  completedTutorialStages.clear();
  selectStage("raw", true);
  reactMascot("wave", tutorialLabels.reactions.restart);
  movePetNear('[data-stage="raw"]', tutorialLabels.reactions.restart, "walk");
});

els.coachMascotStage.addEventListener("pointermove", (event) => {
  const rect = els.coachMascotStage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
  els.coachMascot.style.setProperty("--tilt-x", `${x.toFixed(2)}deg`);
  els.coachMascot.style.setProperty("--tilt-y", `${y.toFixed(2)}deg`);
  setMascotExpression(els.coachMascot, "expr-curious");
});

els.coachMascotStage.addEventListener("pointerleave", () => {
  els.coachMascot.style.setProperty("--tilt-x", "0deg");
  els.coachMascot.style.setProperty("--tilt-y", "0deg");
  setMascotExpression(els.coachMascot, "expr-curious");
});

els.coachMascotStage.addEventListener("click", () => {
  setMascotExpression(els.coachMascot, "expr-surprised");
  reactMascot("wave", tutorialLabels.reactions.hover);
});

els.petAvatar.addEventListener("pointermove", (event) => {
  const rect = els.petAvatar.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
  els.petMascot.style.setProperty("--pet-tilt-x", `${x.toFixed(2)}deg`);
  els.petMascot.style.setProperty("--pet-tilt-y", `${y.toFixed(2)}deg`);
  setMascotExpression(els.petMascot, "expr-happy");
});

els.petAvatar.addEventListener("pointerleave", () => {
  els.petMascot.style.setProperty("--pet-tilt-x", "0deg");
  els.petMascot.style.setProperty("--pet-tilt-y", "0deg");
  setMascotExpression(els.petMascot, "expr-curious");
});

els.petAvatar.addEventListener("click", () => {
  const step = tutorialSteps[currentTutorialIndex];
  setMascotExpression(els.petMascot, "expr-surprised");
  movePetNear(step.anchor || `[data-stage="${step.key}"]`, step.tapBubble || step.bubble, "point");
});

refreshStaticText();
renderRail();
renderDemoGallery();
syncMetadata(currentRaw);
syncSampleDescription();
setNumber(els.width, currentRaw.width);
setNumber(els.height, currentRaw.height);
render();
movePetNear('[data-stage="raw"]', tutorialSteps[0].bubble, "walk");


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
  profileIspPipeline,
  rawToImageData,
  rgbToImageData,
  runIspPipeline
} from "./isp-core.js";
import { demoCaseForScene, getDemoCases } from "./demo-cases-rich.js";
import { getCodeWalkthrough } from "./code-walkthrough.js";
import { getFormulaContent } from "./formula-content.js";
import { getTutorialLabels, getTutorialSteps, tutorialIndexForStage } from "./tutorial-content-pipeline.js";
import { evaluateAdvancedLab, getAdvancedImagingContent } from "./advanced-imaging-content.js";

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
    codeEyebrow: "Code walkthrough",
    codeTitlePrefix: "Code path",
    codeFile: "File",
    codeFunction: "Function",
    codeTry: "Try changing",
    profilerEyebrow: "Performance Profiler",
    profilerTitle: "Pipeline latency and memory insight",
    profilerIntro: "Measure every ISP stage, find bottlenecks, and turn the result into optimization actions.",
    profilerTotal: "Total time",
    profilerMemory: "Estimated memory",
    profilerBottleneck: "Top bottleneck",
    profilerBreakdown: "Stage time breakdown",
    profilerSuggestions: "Optimization suggestions",
    profilerNoData: "Waiting for pipeline data.",
    profilerTips: {
      heavyStage: (name, percent) => `${name} takes ${percent}% of the pipeline. Move it to a worker or optimize this stage first.`,
      highMemory: "Estimated buffers are high. Reuse intermediate arrays and keep only visible preview stages when running on mobile.",
      highResolution: "Resolution is the main multiplier. Use downsampled preview for live tuning, then full resolution for export.",
      denoise: "Denoise is active. Consider a lower preview strength, tiled processing, or a faster edge-preserving approximation.",
      sharpen: "Sharpen is active. Cache the blurred image if denoise and sharpen share a blur pass.",
      incremental: "Only recompute affected downstream stages after a slider change instead of rerunning the whole pipeline."
    },
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
    codeEyebrow: "代码讲解",
    codeTitlePrefix: "代码路径",
    codeFile: "文件",
    codeFunction: "函数",
    codeTry: "可以试着修改",
    profilerEyebrow: "性能分析器",
    profilerTitle: "Pipeline 延迟与内存洞察",
    profilerIntro: "测量每个 ISP 阶段，定位瓶颈，并把结果转化为可执行优化动作。",
    profilerTotal: "总耗时",
    profilerMemory: "估算内存",
    profilerBottleneck: "最大瓶颈",
    profilerBreakdown: "阶段耗时拆解",
    profilerSuggestions: "优化建议",
    profilerNoData: "等待 pipeline 数据。",
    profilerTips: {
      heavyStage: (name, percent) => `${name} 占 pipeline ${percent}%。优先考虑 Worker 异步化或优化该阶段。`,
      highMemory: "估算 buffer 偏高。移动端可复用中间数组，并只保留当前可见预览阶段。",
      highResolution: "分辨率是主要放大器。实时调参使用降采样预览，导出时再跑全分辨率。",
      denoise: "降噪已启用。预览阶段可降低强度、分块处理，或使用更快的边缘保持近似算法。",
      sharpen: "锐化已启用。如果降噪和锐化共享模糊操作，可以缓存 blur 结果。",
      incremental: "滑块变化后只重算受影响的下游阶段，避免整条 pipeline 每次全部重跑。"
    },
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
  advancedEyebrow: document.querySelector("#advancedEyebrow"),
  advancedTitle: document.querySelector("#advancedTitle"),
  advancedIntro: document.querySelector("#advancedIntro"),
  advancedDocsLink: document.querySelector("#advancedDocsLink"),
  advancedTabs: document.querySelector("#advancedTabs"),
  advancedLab: document.querySelector("#advancedLab"),
  advancedScenarioTitle: document.querySelector("#advancedScenarioTitle"),
  advancedScenarios: document.querySelector("#advancedScenarios"),
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
  coachProductionLabel: document.querySelector("#coachProductionLabel"),
  coachWhyLabel: document.querySelector("#coachWhyLabel"),
  coachAnalogyLabel: document.querySelector("#coachAnalogyLabel"),
  coachWatchLabel: document.querySelector("#coachWatchLabel"),
  coachTryLabel: document.querySelector("#coachTryLabel"),
  coachControlLabel: document.querySelector("#coachControlLabel"),
  coachExpectedLabel: document.querySelector("#coachExpectedLabel"),
  coachMistakeLabel: document.querySelector("#coachMistakeLabel"),
  coachCheckpointLabel: document.querySelector("#coachCheckpointLabel"),
  coachPlain: document.querySelector("#coachPlain"),
  coachProduction: document.querySelector("#coachProduction"),
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
    formulaSceneCanvas: document.querySelector("#formulaSceneCanvas"),
    formulaDiagramButton: document.querySelector("#formulaDiagramButton"),
    formulaSceneButton: document.querySelector("#formulaSceneButton"),
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
  codeEyebrow: document.querySelector("#codeEyebrow"),
  codeTitle: document.querySelector("#codeTitle"),
  codePlain: document.querySelector("#codePlain"),
  codeSteps: document.querySelector("#codeSteps"),
  codeSnippet: document.querySelector("#codeSnippet"),
  codeTry: document.querySelector("#codeTry"),
  profilerEyebrow: document.querySelector("#profilerEyebrow"),
  profilerTitle: document.querySelector("#profilerTitle"),
  profilerIntro: document.querySelector("#profilerIntro"),
  profilerTotalLabel: document.querySelector("#profilerTotalLabel"),
  profilerTotalTime: document.querySelector("#profilerTotalTime"),
  profilerMemoryLabel: document.querySelector("#profilerMemoryLabel"),
  profilerMemory: document.querySelector("#profilerMemory"),
  profilerBottleneckLabel: document.querySelector("#profilerBottleneckLabel"),
  profilerBottleneck: document.querySelector("#profilerBottleneck"),
  profilerBreakdownTitle: document.querySelector("#profilerBreakdownTitle"),
  profilerBars: document.querySelector("#profilerBars"),
  profilerSuggestionTitle: document.querySelector("#profilerSuggestionTitle"),
  profilerSuggestions: document.querySelector("#profilerSuggestions"),
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
let formulaPreviewMode = "diagram";
let currentAdvancedLabId = "autofocus";
const advancedLabValues = new Map();
let advancedSliderFrame = 0;
let advancedPreviewMode = "scene";

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
  renderAdvancedImagingLabs();
  els.profilerEyebrow.textContent = text("profilerEyebrow");
  els.profilerTitle.textContent = text("profilerTitle");
  els.profilerIntro.textContent = text("profilerIntro");
  els.profilerTotalLabel.textContent = text("profilerTotal");
  els.profilerMemoryLabel.textContent = text("profilerMemory");
  els.profilerBottleneckLabel.textContent = text("profilerBottleneck");
  els.profilerBreakdownTitle.textContent = text("profilerBreakdown");
  els.profilerSuggestionTitle.textContent = text("profilerSuggestions");
  updateFormulaPreviewMode();
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
  renderAdvancedImagingLabs();
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

function drawFormulaScenePreview(stageKey) {
  const canvas = els.formulaSceneCanvas;
  const imageData = stageImages[stageKey] ?? stageImages[currentHeroStage] ?? lastFinalImageData;
  if (!canvas || !imageData) return;
  const width = 360;
  const height = 170;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  const ctx = canvas.getContext("2d");
  ctx.setTransform?.(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#11161b";
  ctx.fillRect(0, 0, width, height);

  const temp = document.createElement("canvas");
  temp.width = imageData.width;
  temp.height = imageData.height;
  temp.getContext("2d").putImageData(imageData, 0, 0);
  const scale = Math.min(width / imageData.width, height / imageData.height);
  const drawW = imageData.width * scale;
  const drawH = imageData.height * scale;
  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(temp, x, y, drawW, drawH);
  ctx.setTransform?.(1, 0, 0, 1, 0, 0);
}

function updateFormulaPreviewMode() {
  const isScene = formulaPreviewMode === "scene";
  els.formulaCanvas?.classList.toggle("active", !isScene);
  els.formulaSceneCanvas?.classList.toggle("active", isScene);
  els.formulaDiagramButton?.classList.toggle("active", !isScene);
  els.formulaSceneButton?.classList.toggle("active", isScene);
  if (els.formulaDiagramButton) els.formulaDiagramButton.textContent = currentLanguage === "zh" ? "示意" : "Diagram";
  if (els.formulaSceneButton) els.formulaSceneButton.textContent = currentLanguage === "zh" ? "真实" : "Scene";
  drawFormulaScenePreview(tutorialSteps[currentTutorialIndex]?.key ?? currentHeroStage);
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
  drawFormulaScenePreview(tutorialSteps[currentTutorialIndex]?.key ?? "raw");
  updateFormulaPreviewMode();
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

function updateCodeWalkthrough(step) {
  const content = getCodeWalkthrough(step.key, currentLanguage);
  els.codeEyebrow.textContent = text("codeEyebrow");
  els.codeTitle.textContent = `${text("codeTitlePrefix")}: ${content.title}`;
  els.codePlain.textContent = content.plain;
  els.codeSnippet.textContent = content.snippet;
  els.codeTry.textContent = `${text("codeTry")}: ${content.try}`;
  els.codeSteps.innerHTML = "";

  const metaRows = [
    [text("codeFile"), content.file],
    [text("codeFunction"), content.functionName]
  ];
  for (const [label, value] of metaRows) {
    const row = document.createElement("div");
    row.innerHTML = `<dt>${label}</dt><dd><code>${value}</code></dd>`;
    els.codeSteps.append(row);
  }

  content.steps.forEach((value, index) => {
    const row = document.createElement("div");
    row.innerHTML = `<dt>${index + 1}</dt><dd>${value}</dd>`;
    els.codeSteps.append(row);
  });
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
  els.coachProductionLabel.textContent = tutorialLabels.productionLabel;
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
  els.coachProduction.textContent = step.production;
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
  updateCodeWalkthrough(step);
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

function loadSelectedScene(announce = false) {
  const demo = demoCaseForScene(els.sampleScene.value, currentLanguage);
  currentDemoId = demo.id;
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
  syncSampleDescription();
  updateDemoActive();
  render();
  if (announce) {
    const readyMessage = currentLanguage === "zh"
      ? `${tutorialLabels.reactions.demo} 当前案例：${demo.title}。`
      : `${tutorialLabels.reactions.demo} ${demo.title} is ready.`;
    reactMascot("wave", readyMessage);
    movePetNear(els.sampleScene, readyMessage, "walk");
  }
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

function renderAdvancedImagingLabs() {
  if (!els.advancedLab || !els.advancedTabs) return;
  const content = getAdvancedImagingContent(currentLanguage);
  const activeLab = content.labs.find((lab) => lab.id === currentAdvancedLabId) ?? content.labs[0];
  currentAdvancedLabId = activeLab.id;
  const activeValue = advancedLabValues.has(activeLab.id) ? advancedLabValues.get(activeLab.id) : activeLab.value;
  const evaluation = evaluateAdvancedLab(activeLab, activeValue);

  els.advancedEyebrow.textContent = content.labels.eyebrow;
  els.advancedTitle.textContent = content.labels.title;
  els.advancedIntro.textContent = content.labels.intro;
  els.advancedDocsLink.textContent = content.labels.docs;
  els.advancedDocsLink.href = currentLanguage === "zh"
    ? "./docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.zh-CN.md"
    : "./docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.en.md";
  els.advancedScenarioTitle.textContent = content.labels.scenarios;

  els.advancedTabs.innerHTML = "";
  for (const lab of content.labs) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "advanced-tab advanced-case-card";
    button.dataset.labId = lab.id;
    button.style.setProperty("--lab-accent", lab.accent);
    button.innerHTML = `
      <span class="advanced-case-thumb">${advancedThumbSvg(lab.id)}</span>
      <span class="advanced-case-name">${lab.caseTitle}</span>
      <span class="advanced-case-topic">${lab.title}</span>
    `;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(lab.id === activeLab.id));
    button.classList.toggle("active", lab.id === activeLab.id);
    button.addEventListener("click", () => {
      currentAdvancedLabId = lab.id;
      renderAdvancedImagingLabs();
      const message = currentLanguage === "zh"
        ? `已切换到${lab.title}。这里会把公式、参数、设备场景和工程取舍放在一起看。`
        : `Switched to ${lab.title}. This lab connects formulas, controls, device scenarios, and engineering tradeoffs.`;
      reactMascot("point", message);
      movePetNear(els.advancedLab, message, "point");
    });
    els.advancedTabs.append(button);
  }

  els.advancedLab.innerHTML = advancedLabTemplate(activeLab, content.labels, activeValue, evaluation);
  const slider = els.advancedLab.querySelector("#advancedLabSlider");
  slider?.addEventListener("input", () => {
    advancedLabValues.set(activeLab.id, Number(slider.value));
    cancelAnimationFrame(advancedSliderFrame);
    advancedSliderFrame = requestAnimationFrame(() => {
      updateAdvancedLivePreview(activeLab, content.labels, Number(slider.value));
    });
    const message = currentLanguage === "zh"
      ? `我正在把“${activeLab.controlLabel}”同步到高级成像示意图。注意指标和风险提示如何变化。`
      : `I am syncing "${activeLab.controlLabel}" into the advanced imaging diagram. Watch the metric and risk note change.`;
    reactMascot("think", message);
  });
  els.advancedLab.querySelector("#advancedDiagramButton")?.addEventListener("click", () => {
    advancedPreviewMode = "diagram";
    updateAdvancedLivePreview(activeLab, content.labels, Number(slider?.value ?? activeValue));
  });
  els.advancedLab.querySelector("#advancedSceneButton")?.addEventListener("click", () => {
    advancedPreviewMode = "scene";
    updateAdvancedLivePreview(activeLab, content.labels, Number(slider?.value ?? activeValue));
  });
  els.advancedLab.querySelector("#advancedLabReset")?.addEventListener("click", () => {
    advancedLabValues.set(activeLab.id, activeLab.value);
    renderAdvancedImagingLabs();
    const message = currentLanguage === "zh" ? "高级成像模块已复位到教学默认值。" : "Advanced imaging lab reset to the teaching default.";
    reactMascot("wave", message);
    movePetNear(els.advancedLab, message, "wave");
  });

  els.advancedScenarios.innerHTML = "";
  for (const scenario of content.scenarios) {
    const article = document.createElement("article");
    article.className = "scenario-card";
    article.innerHTML = `
      <img src="${scenario.thumbnail}" alt="" loading="lazy">
      <strong>${scenario.title}</strong>
      <span>${scenario.focus}</span>
      <em>${scenario.demo}</em>
      <p>${scenario.pipeline}</p>
      <small>${scenario.control}</small>
      <button type="button">${content.labels.openScenario}</button>
    `;
    article.querySelector("button")?.addEventListener("click", () => {
      currentAdvancedLabId = scenario.labId;
      renderAdvancedImagingLabs();
      els.advancedLab.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const message = currentLanguage === "zh"
        ? `已打开${scenario.title}对应的演示案例：${scenario.demo}。`
        : `Opened the ${scenario.title} demo case: ${scenario.demo}.`;
      reactMascot("point", message);
      movePetNear(els.advancedLab, message, "point");
    });
    els.advancedScenarios.append(article);
  }
}

function advancedLabTemplate(lab, labels, value, evaluation) {
  const valueLabel = `${Number(value).toFixed(lab.max > 100 ? 0 : 2)}${lab.unit ? ` ${lab.unit}` : ""}`;
  const tasks = lab.tasks.map((task) => `<li>${task}</li>`).join("");
  const beforeEval = { ...evaluation, score: Math.max(0.08, evaluation.score * 0.34), normalized: 0.18 };

  return `
    <article class="advanced-card" style="--lab-accent:${lab.accent}">
      <div class="advanced-copy">
        <p class="advanced-kicker">${labels.caseHeading}</p>
        <h3>${lab.caseTitle}</h3>
        <p class="advanced-device">${lab.device}</p>
        <dl>
          <div><dt>${labels.why}</dt><dd>${lab.why}</dd></div>
          <div><dt>${labels.formula}</dt><dd><code>${lab.formula}</code></dd></div>
          <div><dt>${labels.code}</dt><dd>${lab.code}</dd></div>
        </dl>
      </div>
      <div class="advanced-visual">
        <div class="advanced-robot-note">
          <span class="advanced-robot-avatar" aria-hidden="true">P</span>
          <p>${lab.robot}</p>
        </div>
        <div class="advanced-preview-grid">
          <figure>
            <figcaption>${labels.before}</figcaption>
            <div id="advancedBeforePreview">${advancedPreviewSvg(lab, beforeEval, "before")}</div>
          </figure>
          <figure>
            <figcaption>${labels.after}</figcaption>
            <div id="advancedAfterPreview">${advancedPreviewSvg(lab, evaluation, "after")}</div>
          </figure>
        </div>
        <label class="advanced-slider-label">${lab.controlLabel}
          <span class="view-toggle advanced-view-toggle" aria-label="Advanced preview mode">
            <button id="advancedDiagramButton" type="button" class="${advancedPreviewMode === "diagram" ? "active" : ""}">${currentLanguage === "zh" ? "示意" : "Diagram"}</button>
            <button id="advancedSceneButton" type="button" class="${advancedPreviewMode === "scene" ? "active" : ""}">${currentLanguage === "zh" ? "真实" : "Scene"}</button>
          </span>
          <input id="advancedLabSlider" type="range" min="${lab.min}" max="${lab.max}" step="${lab.max > 100 ? 50 : 0.01}" value="${value}">
          <output id="advancedLabValue">${valueLabel}</output>
        </label>
        <div class="advanced-metric">
          <span>${labels.metric}: ${lab.metricLabel}</span>
          <strong id="advancedMetricValue">${evaluation.percent}%</strong>
          <em id="advancedRiskValue">${evaluation.risk}</em>
        </div>
        <div class="advanced-insight-grid">
          <section>
            <strong>${labels.observe}</strong>
            <p>${advancedObservationText(lab, "observe")}</p>
          </section>
          <section>
            <strong>${labels.failure}</strong>
            <p>${advancedObservationText(lab, "failure")}</p>
          </section>
        </div>
        <p class="advanced-explanation">${lab.explanation}</p>
        <div class="advanced-deep-note">
          <strong>${currentLanguage === "zh" ? "完整成像链路说明" : "Full pipeline walkthrough"}</strong>
          <ol>
            ${advancedPipelineWalkthrough(lab).map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </div>
        <div class="advanced-task-row">
          <div>
            <strong>${labels.tasks}</strong>
            <ul>${tasks}</ul>
          </div>
          <button id="advancedLabReset" type="button">${labels.reset}</button>
        </div>
      </div>
    </article>
  `;
}

function advancedObservationText(lab, type) {
  const zh = currentLanguage === "zh";
  const map = {
    autofocus: {
      observe: zh ? "看主体边缘是否从发软变清晰，同时看清晰度评分是否上升到峰值。" : "Watch subject edges move from soft to crisp while the sharpness score rises toward the peak.",
      failure: zh ? "低纹理或滑动过快时，算法可能找不到稳定峰值，表现为来回拉焦。" : "With low texture or fast motion, the score peak becomes unstable and the lens may hunt."
    },
    exposure: {
      observe: zh ? "看暗部是否被抬起、高光是否还保留层次，直方图不要全部挤到右边。" : "Watch shadows lift while highlights still keep texture; the histogram should not collapse into the right edge.",
      failure: zh ? "曝光过高会让窗外、灯牌或皮肤高光变成纯白；过低会让暗部噪声变重。" : "Too much exposure clips windows, lamps, or skin highlights; too little exposure leaves noisy shadows."
    },
    color: {
      observe: zh ? "先看灰色是否中性，再看肤色、天空、草地等记忆色是否自然。" : "Check neutral grays first, then skin, sky, grass, and other memory colors.",
      failure: zh ? "只追求灰卡准确可能让肤色不舒服；只追求好看又可能造成整体偏色。" : "Pure chart accuracy can make skin unpleasant; pure preference can create a global color cast."
    },
    video: {
      observe: zh ? "看噪点是否减少，同时观察运动主体后面有没有拖影或块状伪影。" : "Watch noise reduce while checking whether moving subjects leave ghost trails or block artifacts.",
      failure: zh ? "时域融合太强会拖影，去块太强会把真实纹理抹平。" : "Too much temporal fusion creates ghosting; too much deblocking washes away real texture."
    },
    computational: {
      observe: zh ? "看匹配线是否对齐同一个结构，融合后边缘和拼缝是否稳定。" : "Check whether match lines connect the same structure and whether fused edges/seams stay stable.",
      failure: zh ? "错误匹配会造成鬼影、拼缝、错位和几何扭曲。" : "Bad matches create ghosting, seams, misalignment, and geometric bending."
    },
    ai: {
      observe: zh ? "超分时看原始低分辨率块状边缘是否变细，去雾时看远处结构是否更清楚。" : "For SR, watch blocky low-res edges become finer; for dehaze, watch distant structure become clearer.",
      failure: zh ? "AI 可能生成看似清晰但并不存在的纹理，高倍率和强去雾尤其要注意。" : "AI can invent plausible texture that was never measured, especially at high scale or strong dehaze."
    }
  };
  return map[lab.family ?? lab.id]?.[type] ?? "";
}

function advancedPipelineWalkthrough(lab) {
  const zh = currentLanguage === "zh";
  const family = lab.family ?? lab.id;
  if (family === "autofocus") {
    return zh
      ? [
          "输入是一张有前后景深差异的真实拍摄场景：人脸、微距纹理、产品边缘或显微结构。",
          "算法先把画面转成亮度图，在选定 ROI 内计算边缘能量或 Laplacian 方差，把它当作清晰度评分。",
          "镜头马达从粗扫到细扫移动，评分峰值对应主体焦平面；视频模式还要限制速度，避免拉风箱和突兀跳焦。",
          "工程上要额外处理低纹理、低光、运动主体、OIS 抖动和镜头行程限制，所以页面会同时显示成功指标和失败风险。"
        ]
      : [
          "The input is a real depth scene: a face, macro texture, product edge, or microscopic structure.",
          "The algorithm converts the preview to luma and computes edge energy or Laplacian variance inside the chosen ROI.",
          "The lens motor scans from coarse to fine; the score peak corresponds to the subject plane. Video mode also limits speed to avoid hunting.",
          "Production AF must handle low texture, low light, subject motion, OIS movement, and motor limits, so the lab shows both score and failure risk."
        ];
  }
  if (family === "exposure") {
    return zh
      ? [
          "输入是逆光、人像、夜景街灯或高动态范围场景，核心矛盾是暗部想变亮，高光又不能被裁成纯白。",
          "AE 先统计亮度直方图、主体 ROI 和高光比例，再决定曝光时间、模拟增益或数字增益的变化方向。",
          "拖动曝光参数时，页面会同步改变图像、指标和风险提示；高 EV 会抬亮暗部，但也会增加高光裁剪和噪声放大风险。",
          "手机夜景和 HDR 往往不是单帧解决，而是用多帧曝光、对齐和融合，把动态范围、噪声和运动模糊一起权衡。"
        ]
      : [
          "The input is a backlit, portrait, night-street, or high-dynamic-range scene where shadows need light but highlights must not clip.",
          "AE reads the luma histogram, subject ROI, and clipping ratio, then updates exposure time, analog gain, or digital gain.",
          "Dragging EV updates the image, metric, and risk note together; higher EV lifts shadows but increases clipping and amplified noise.",
          "Phone night mode and HDR usually solve this with multi-frame exposure, alignment, and fusion instead of one perfect frame."
        ];
  }
  if (family === "color") {
    return zh
      ? [
          "输入是色卡、人像、混合光或屏幕显示目标，核心问题是把光源颜色和物体真实颜色分开。",
          "AWB 先估计照明色，再用 RGB gain 把中性灰拉回灰色；CCM 再把相机 RGB 映射到 sRGB、P3 或 HDR 目标空间。",
          "拖动色温时，灰阶、肤色和背景会一起变化；灰卡准确不一定代表人脸好看，所以要同时看记忆色。",
          "真实手机会加入人脸检测、场景识别、肤色保护、色域映射和显示端补偿，避免一张图在不同屏幕上观感漂移。"
        ]
      : [
          "The input is a color chart, portrait, mixed-light scene, or display target; the goal is separating illuminant color from object color.",
          "AWB estimates illumination and applies RGB gains to neutralize gray; CCM maps camera RGB toward sRGB, P3, or HDR targets.",
          "Dragging color temperature changes gray, skin, and background together; chart accuracy alone does not guarantee pleasing faces.",
          "Real phones add face detection, scene priors, skin protection, gamut mapping, and display compensation to keep appearance stable."
        ];
  }
  if (family === "video") {
    return zh
      ? [
          "输入是连续帧，而不是单张照片；噪声、压缩块、运动拖影和延迟会同时影响观感。",
          "时域降噪会对齐相邻帧，把可信的历史信息融合到当前帧；编解码修复则要识别块效应、振铃和纹理丢失。",
          "拖动降噪或去块参数时，噪点会下降，但运动边缘和细纹理可能被抹平，所以需要观察 before/after 的副作用。",
          "生产视频 pipeline 必须把画质、码率、功耗、热量和实时性放在一起评估，不能只追求单帧看起来干净。"
        ]
      : [
          "The input is a sequence, not a still image; noise, blocks, motion ghosts, and latency all affect perception.",
          "Temporal denoise aligns neighboring frames and fuses reliable history; codec repair detects blocking, ringing, and lost texture.",
          "Dragging denoise or deblock lowers noise but may smear moving edges and fine texture, so the before/after side effects matter.",
          "A production video pipeline must balance quality, bitrate, power, thermals, and latency instead of optimizing one still frame."
        ];
  }
  if (family === "computational") {
    return zh
      ? [
          "输入来自多帧或多摄：HDR 曝光序列、双目左右图、全景重叠图或多摄同步图。",
          "算法先找特征点和匹配关系，再用 RANSAC、单应矩阵、视差或深度模型剔除错误匹配。",
          "只有可信像素才允许融合；匹配置信度低时，HDR 会重影，全景会有拼缝，VR 左右眼会出现错位。",
          "这类模块连接了投影几何、匹配、拼接、多目测量和多帧融合，是现代手机、VR 和计算摄影的核心能力。"
        ]
      : [
          "The input comes from multiple frames or cameras: HDR brackets, stereo pairs, panorama overlaps, or synchronized modules.",
          "The algorithm finds keypoints and matches, then uses RANSAC, homography, disparity, or depth models to reject outliers.",
          "Only trusted pixels should be fused; low confidence creates HDR ghosts, panorama seams, or stereo misalignment.",
          "This module connects projective geometry, matching, stitching, multi-view measurement, and multi-frame fusion."
        ];
  }
  return zh
    ? [
        "输入是低分辨率、雾化、模糊、压缩或噪声图像，AI 模型负责恢复更清楚、更可读的输出。",
        "超分案例应该从 1x 模糊输入出发，逐步观察 2x、3x、4x 后边缘和纹理如何被重建；不是简单把图片调亮。",
        "Transformer、GAN、Diffusion 或 AIGC 模型可以提升感知清晰度，但也可能生成传感器没有采到的假纹理。",
        "学习时要同时看清晰度提升和可信边界：真实结构更清楚是好结果，远处纹理突然过度丰富就要警惕。"
      ]
    : [
        "The input is a low-resolution, hazy, blurred, compressed, or noisy image; AI predicts a clearer and more readable output.",
        "The SR case starts from a 1x soft input and compares 2x, 3x, and 4x reconstructed edges and textures, not a simple brightness boost.",
        "Transformer, GAN, Diffusion, or AIGC models can improve perceptual clarity but may hallucinate details never measured by the sensor.",
        "Learning must track both clarity and trust boundaries: clearer real structure is good, suddenly rich distant texture needs caution."
      ];
}

function updateAdvancedLivePreview(lab, labels, value) {
  const evaluation = evaluateAdvancedLab(lab, value);
  const beforeEval = { ...evaluation, score: Math.max(0.08, evaluation.score * 0.34), normalized: 0.18 };
  const valueLabel = `${Number(value).toFixed(lab.max > 100 ? 0 : 2)}${lab.unit ? ` ${lab.unit}` : ""}`;
  const before = els.advancedLab.querySelector("#advancedBeforePreview");
  const after = els.advancedLab.querySelector("#advancedAfterPreview");
  const output = els.advancedLab.querySelector("#advancedLabValue");
  const metric = els.advancedLab.querySelector("#advancedMetricValue");
  const risk = els.advancedLab.querySelector("#advancedRiskValue");
  const diagramButton = els.advancedLab.querySelector("#advancedDiagramButton");
  const sceneButton = els.advancedLab.querySelector("#advancedSceneButton");
  if (before) before.innerHTML = advancedPreviewSvg(lab, beforeEval, "before");
  if (after) after.innerHTML = advancedPreviewSvg(lab, evaluation, "after");
  if (output) output.value = valueLabel;
  if (metric) metric.textContent = `${evaluation.percent}%`;
  if (risk) risk.textContent = evaluation.risk;
  diagramButton?.classList.toggle("active", advancedPreviewMode === "diagram");
  sceneButton?.classList.toggle("active", advancedPreviewMode === "scene");
}

function advancedThumbSvg(id) {
  const thumbnail = {
    autofocus: "./assets/scenarios/phone-photography.png",
    autofocusMacro: "./assets/scenarios/camera-photography.png",
    exposure: "./assets/scenarios/phone-photography.png",
    exposureNight: "./assets/scenarios/cinema-camera.png",
    color: "./assets/scenarios/display-output.png",
    colorSkin: "./assets/scenarios/phone-photography.png",
    video: "./assets/scenarios/medical-imaging.png",
    videoCodec: "./assets/scenarios/display-output.png",
    computational: "./assets/scenarios/vr-headset.png",
    computationalPano: "./assets/scenarios/vr-headset.png",
    ai: "./assets/scenarios/display-output.png",
    aiDehaze: "./assets/scenarios/cinema-camera.png"
  }[id] ?? "./assets/scenarios/camera-photography.png";
  return `<img src="${thumbnail}" alt="" loading="lazy">`;
}

function advancedSceneAsset(lab) {
  return {
    autofocus: "./assets/scenarios/phone-photography.png",
    autofocusMacro: "./assets/scenarios/camera-photography.png",
    exposure: "./assets/scenarios/phone-photography.png",
    exposureNight: "./assets/scenarios/cinema-camera.png",
    color: "./assets/scenarios/display-output.png",
    colorSkin: "./assets/scenarios/phone-photography.png",
    video: "./assets/scenarios/medical-imaging.png",
    videoCodec: "./assets/scenarios/display-output.png",
    computational: "./assets/scenarios/vr-headset.png",
    computationalPano: "./assets/scenarios/vr-headset.png",
    ai: "./assets/scenarios/display-output.png",
    aiDehaze: "./assets/scenarios/cinema-camera.png"
  }[lab.id] ?? "./assets/scenarios/camera-photography.png";
}

function advancedScenePreview(lab, evaluation, mode) {
  const family = lab.family ?? lab.id;
  const score = clampNumber(evaluation.score, 0, 1);
  const t = clampNumber(evaluation.normalized, 0, 1);
  const before = mode === "before";
  const img = advancedSceneAsset(lab);
  const zh = currentLanguage === "zh";
  const stateLabel = before ? (zh ? "调整前" : "before") : (zh ? "实时输出" : "live output");
  let filter = "none";
  let classes = ["advanced-photo-preview", `advanced-photo-${family}`];
  let overlay = "";
  let badge = `${stateLabel} · ${evaluation.percent}%`;

  if (family === "autofocus") {
    const blur = before ? 5.5 : Math.max(0.2, 5.5 - score * 5.2);
    filter = `blur(${blur.toFixed(2)}px) contrast(${(0.88 + score * 0.2).toFixed(2)})`;
    overlay = `<span class="focus-plane" style="left:${(18 + score * 64).toFixed(1)}%"></span>`;
    badge = before ? (zh ? "镜头未合焦" : "off focus") : (zh ? `焦点评分 ${evaluation.percent}%` : `focus score ${evaluation.percent}%`);
  } else if (family === "exposure") {
    const brightness = before ? 0.62 : 0.58 + score * 0.72;
    const contrast = before ? 0.88 : 0.78 + score * 0.34;
    filter = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${(0.86 + score * 0.2).toFixed(2)})`;
    overlay = `<span class="highlight-warning" style="opacity:${Math.max(0, t - 0.68).toFixed(2)}"></span>`;
    badge = before ? (zh ? "主体偏暗 / 高光强" : "dark subject / strong highlights") : (zh ? `曝光平衡 ${evaluation.percent}%` : `exposure balance ${evaluation.percent}%`);
  } else if (family === "color") {
    const hue = before ? -10 : (t - 0.5) * 34;
    const warmth = before ? 0.9 : 0.78 + (1 - Math.abs(t - 0.5)) * 0.28;
    filter = `hue-rotate(${hue.toFixed(1)}deg) saturate(${warmth.toFixed(2)}) contrast(1.04)`;
    overlay = `<span class="color-cast" style="background:${t < 0.42 ? "rgba(255,166,77,.22)" : "rgba(80,150,255,.18)"}"></span>`;
    badge = before ? (zh ? "白点未校准" : "uncalibrated white") : (zh ? `中性/肤色 ${evaluation.percent}%` : `neutral color ${evaluation.percent}%`);
  } else if (family === "video") {
    const noise = before ? 0.45 : Math.max(0.08, 0.45 - score * 0.34);
    const smooth = before ? 0 : t;
    filter = `contrast(${(1.05 - smooth * 0.15).toFixed(2)}) brightness(${(0.86 + score * 0.16).toFixed(2)})`;
    overlay = `<span class="noise-layer" style="opacity:${noise.toFixed(2)}"></span><span class="motion-ghost" style="opacity:${Math.max(0, t - 0.58).toFixed(2)}"></span>`;
    badge = before ? (zh ? "噪声/结构混在一起" : "noise and structure mixed") : (zh ? `降噪权衡 ${evaluation.percent}%` : `denoise tradeoff ${evaluation.percent}%`);
  } else if (family === "computational") {
    const shift = before ? 14 : Math.max(0, 14 - score * 13);
    filter = `contrast(${(0.92 + score * 0.18).toFixed(2)}) saturate(${(0.88 + score * 0.18).toFixed(2)})`;
    overlay = `<img class="stereo-ghost" src="${img}" alt="" style="--shift:${shift.toFixed(1)}px; opacity:${(0.38 - score * 0.25).toFixed(2)}"><span class="match-grid" style="opacity:${(0.18 + score * 0.55).toFixed(2)}"></span>`;
    badge = before ? (zh ? "左右眼未稳定对齐" : "stereo not aligned") : (zh ? `匹配置信 ${evaluation.percent}%` : `match confidence ${evaluation.percent}%`);
  } else if (lab.id === "aiDehaze") {
    const haze = before ? 0.58 : Math.max(0.06, 0.58 - score * 0.48);
    filter = `contrast(${(0.78 + score * 0.42).toFixed(2)}) saturate(${(0.78 + score * 0.24).toFixed(2)})`;
    overlay = `<span class="haze-layer" style="opacity:${haze.toFixed(2)}"></span>`;
    badge = before ? (zh ? "雾化低对比输入" : "hazy low-contrast input") : (zh ? `恢复可信 ${evaluation.percent}%` : `recovery trust ${evaluation.percent}%`);
  } else {
    const scale = before ? 1 : lab.min + (lab.max - lab.min) * t;
    const pixel = before ? 1 : Math.max(0, 1 - score);
    classes.push(before ? "is-lowres" : "is-superres");
    filter = `contrast(${(0.9 + score * 0.25).toFixed(2)}) saturate(${(0.9 + score * 0.18).toFixed(2)})`;
    overlay = `<span class="sr-grid" style="opacity:${(0.42 + pixel * 0.28).toFixed(2)}; --cell:${Math.max(5, 18 - score * 12).toFixed(1)}px"></span>`;
    badge = before ? (zh ? "1x 低清输入" : "1x low-res input") : `${scale.toFixed(1)}x SR · ${evaluation.percent}%`;
  }

  return `
    <div class="${classes.join(" ")}" role="img" aria-label="${lab.caseTitle}">
      <img class="advanced-scene-img" src="${img}" alt="" loading="lazy" style="filter:${filter}">
      ${overlay}
      <span class="advanced-photo-badge">${badge}</span>
    </div>
  `;
}

function advancedPreviewSvg(lab, evaluation, mode) {
  if (advancedPreviewMode === "scene") return advancedScenePreview(lab, evaluation, mode);

  const family = lab.family ?? lab.id;
  const score = clampNumber(evaluation.score, 0, 1);
  const t = clampNumber(evaluation.normalized, 0, 1);
  const blur = mode === "before" ? 4 : Math.max(0, 5 - score * 5);
  const brightness = family === "exposure" ? 0.25 + score * 0.95 : 0.72;
  const warm = family === "color" ? 1 - t : 0.38;
  const cool = family === "color" ? t : 0.44;
  const ghost = family === "video" ? t : 0.22;
  const detail = family === "ai" ? score : 0.55;
  const match = family === "computational" ? score : 0.62;
  const focus = family === "autofocus" ? score : 0.72;

  if (family === "autofocus") {
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <defs><filter id="afBlur${mode}"><feGaussianBlur stdDeviation="${blur.toFixed(2)}"/></filter></defs>
        <rect width="320" height="190" rx="10" fill="#dbe9ee"/>
        <rect y="118" width="320" height="72" fill="#90b8aa"/>
        <g filter="url(#afBlur${mode})">
          <circle cx="160" cy="70" r="32" fill="#f0b28f"/>
          <path d="M118 150 C128 112 192 112 202 150 Z" fill="#176b87"/>
          <rect x="48" y="88" width="46" height="46" rx="8" fill="#ffffff" opacity=".85"/>
          <rect x="230" y="62" width="46" height="66" rx="8" fill="#ffffff" opacity=".68"/>
        </g>
        <path d="M38 22 H282" stroke="#176b87" stroke-width="5" stroke-linecap="round" opacity=".25"/>
        <circle cx="${(38 + focus * 244).toFixed(1)}" cy="22" r="8" fill="#176b87"/>
      </svg>`;
  }
  if (family === "exposure") {
    const sky = Math.round(130 + brightness * 90);
    const room = Math.round(34 + brightness * 62);
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <rect width="320" height="190" rx="10" fill="rgb(${room},${room + 12},${room + 18})"/>
        <rect x="178" y="30" width="92" height="122" rx="6" fill="rgb(${sky},${sky + 8},255)"/>
        <path d="M60 154 C72 112 118 112 130 154 Z" fill="#324b5a"/>
        <circle cx="95" cy="83" r="27" fill="#d89a78"/>
        <rect x="190" y="42" width="68" height="98" fill="#fff4c9" opacity="${Math.min(0.85, 0.2 + brightness * 0.85).toFixed(2)}"/>
        <path d="M34 164 H286" stroke="#ffffff" opacity=".35"/>
      </svg>`;
  }
  if (family === "color") {
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <rect width="320" height="190" rx="10" fill="rgb(${Math.round(235 - cool * 50)},${Math.round(228)},${Math.round(218 + cool * 30)})"/>
        <rect x="30" y="36" width="260" height="118" rx="8" fill="#f8fafb"/>
        <g opacity=".95">
          <rect x="48" y="54" width="44" height="34" fill="rgb(${Math.round(220 + warm * 35)},${Math.round(80 + cool * 25)},${Math.round(82 + cool * 60)})"/>
          <rect x="100" y="54" width="44" height="34" fill="rgb(${Math.round(68 + warm * 30)},${Math.round(150)},${Math.round(82 + cool * 35)})"/>
          <rect x="152" y="54" width="44" height="34" fill="rgb(${Math.round(82)},${Math.round(110 + cool * 28)},${Math.round(210 + cool * 40)})"/>
          <rect x="204" y="54" width="44" height="34" fill="rgb(${Math.round(210 + warm * 32)},${Math.round(186 + warm * 12)},${Math.round(72 + cool * 32)})"/>
          <rect x="74" y="104" width="44" height="34" fill="rgb(${Math.round(150 + warm * 30)},${Math.round(150)},${Math.round(150 + cool * 35)})"/>
          <rect x="126" y="104" width="44" height="34" fill="rgb(${Math.round(100 + warm * 25)},${Math.round(100)},${Math.round(100 + cool * 30)})"/>
          <rect x="178" y="104" width="44" height="34" fill="rgb(${Math.round(56 + warm * 18)},${Math.round(56)},${Math.round(56 + cool * 22)})"/>
        </g>
      </svg>`;
  }
  if (family === "video") {
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <rect width="320" height="190" rx="10" fill="#18212a"/>
        <g opacity="${(0.18 + ghost * 0.42).toFixed(2)}">
          <circle cx="${(106 + ghost * 34).toFixed(1)}" cy="94" r="28" fill="#8bd3ff"/>
          <rect x="${(86 + ghost * 34).toFixed(1)}" y="122" width="58" height="22" rx="8" fill="#8bd3ff"/>
        </g>
        <circle cx="150" cy="94" r="28" fill="#f8fafb"/>
        <rect x="130" y="122" width="58" height="22" rx="8" fill="#f8fafb"/>
        ${Array.from({ length: 34 }, (_, i) => `<circle cx="${(20 + (i * 37) % 280)}" cy="${(20 + (i * 53) % 148)}" r="1.6" fill="#ffffff" opacity="${(0.42 - score * 0.32).toFixed(2)}"/>`).join("")}
      </svg>`;
  }
  if (family === "computational") {
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <rect width="320" height="190" rx="10" fill="#edf8f5"/>
        <rect x="28" y="36" width="112" height="108" rx="8" fill="#ffffff" stroke="#0f766e"/>
        <rect x="180" y="36" width="112" height="108" rx="8" fill="#ffffff" stroke="#0f766e"/>
        <path d="M48 124 L82 74 L116 124 Z" fill="#8bd3a7"/>
        <path d="M200 124 L234 74 L268 124 Z" fill="#8bd3a7"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const y = 55 + i * 10;
          const x1 = 62 + (i % 3) * 20;
          const x2 = 214 + (i % 3) * 20 + (1 - match) * (i % 2 ? 18 : -14);
          return `<line x1="${x1}" y1="${y}" x2="${x2.toFixed(1)}" y2="${(y + (1 - match) * 18).toFixed(1)}" stroke="#0f766e" opacity="${(0.25 + match * 0.65).toFixed(2)}"/><circle cx="${x1}" cy="${y}" r="3" fill="#0f766e"/><circle cx="${x2.toFixed(1)}" cy="${(y + (1 - match) * 18).toFixed(1)}" r="3" fill="#0f766e"/>`;
        }).join("")}
      </svg>`;
  }
  if (lab.id === "aiDehaze") {
    const haze = mode === "before" ? 0.72 : Math.max(0.08, 0.72 - detail * 0.62);
    const contrast = mode === "before" ? 0.35 : 0.35 + detail * 0.65;
    return `
      <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
        <rect width="320" height="190" rx="10" fill="#dcecf3"/>
        <path d="M0 128 L62 78 L112 126 L166 68 L238 132 L320 84 L320 190 L0 190 Z" fill="#54756d" opacity="${contrast.toFixed(2)}"/>
        <path d="M0 150 C68 132 110 156 166 138 S252 118 320 140 L320 190 L0 190 Z" fill="#2f855a" opacity="${(0.28 + contrast * 0.45).toFixed(2)}"/>
        <rect width="320" height="190" rx="10" fill="#ffffff" opacity="${haze.toFixed(2)}"/>
        ${Array.from({ length: 18 }, (_, i) => `<path d="M${28 + i * 15} ${126 - (i % 5) * 7} l8 ${-10 - detail * 8} l8 ${10 + detail * 8}" stroke="#24463f" opacity="${(detail * 0.55).toFixed(2)}" fill="none"/>`).join("")}
        <text x="18" y="28">${mode === "before" ? "hazy input" : `${Math.round(detail * 100)}% recovered`}</text>
      </svg>`;
  }
  const cell = mode === "before" ? 14 : Math.max(4, 14 - detail * 9);
  const srLabel = mode === "before" ? "1x low-res" : `${Number(lab.min + (lab.max - lab.min) * t).toFixed(1)}x SR`;
  return `
    <svg class="advanced-image-svg" viewBox="0 0 320 190" role="img" aria-label="${lab.caseTitle}">
      <rect width="320" height="190" rx="10" fill="#fbedf4"/>
      <rect x="34" y="34" width="104" height="112" rx="8" fill="#ffffff" stroke="#be185d"/>
      <rect x="182" y="34" width="104" height="112" rx="8" fill="#ffffff" stroke="#be185d"/>
      ${Array.from({ length: 7 }, (_, y) => Array.from({ length: 7 }, (_, x) => `<rect x="${48 + x * 12}" y="${50 + y * 12}" width="10" height="10" fill="${(x + y) % 2 ? "#c994b0" : "#f1d8e5"}"/>`).join("")).join("")}
      ${Array.from({ length: 11 }, (_, i) => `<line x1="${196 + i * 7}" y1="50" x2="${196 + i * 7}" y2="132" stroke="#be185d" opacity="${(0.15 + detail * 0.5).toFixed(2)}"/><line x1="196" y1="${50 + i * 7}" x2="272" y2="${50 + i * 7}" stroke="#be185d" opacity="${(0.15 + detail * 0.5).toFixed(2)}"/>`).join("")}
      ${Array.from({ length: Math.round(28 + detail * 38) }, (_, i) => {
        const x = 198 + (i * 17) % 70;
        const y = 52 + (i * 29) % 78;
        const r = Math.max(1.1, cell / 7);
        return `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${i % 3 ? "#be185d" : "#f59ac2"}" opacity="${(0.25 + detail * 0.62).toFixed(2)}"/>`;
      }).join("")}
      <path d="M151 91 H169" stroke="#be185d" stroke-width="5" stroke-linecap="round"/>
      <text x="44" y="164">low-res crop</text>
      <text x="196" y="164">${srLabel}</text>
    </svg>`;
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

function formatDuration(ms) {
  if (!Number.isFinite(ms)) return "-";
  return `${ms.toFixed(ms < 10 ? 2 : 1)} ms`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function profilerSuggestions(profile, options, bottleneck) {
  const tips = text("profilerTips");
  const suggestions = [];
  const total = profile.totalDuration || 1;
  const bottleneckPercent = Math.round((bottleneck.duration / total) * 100);
  suggestions.push(tips.heavyStage(bottleneck.label, bottleneckPercent));
  if (profile.memoryBytes > 24 * 1024 * 1024) suggestions.push(tips.highMemory);
  if (profile.megapixels > 0.02) suggestions.push(tips.highResolution);
  if (options.denoiseStrength > 0.3) suggestions.push(tips.denoise);
  if (options.sharpenAmount > 0.8) suggestions.push(tips.sharpen);
  suggestions.push(tips.incremental);
  return suggestions.slice(0, 4);
}

function updateProfiler(profile, options) {
  if (!profile?.timings?.length) {
    els.profilerBars.textContent = text("profilerNoData");
    return;
  }
  const timings = [...profile.timings].sort((a, b) => b.duration - a.duration);
  const bottleneck = timings[0];
  const total = Math.max(0.001, profile.totalDuration);
  els.profilerTotalTime.textContent = formatDuration(profile.totalDuration);
  els.profilerMemory.textContent = formatBytes(profile.memoryBytes);
  els.profilerBottleneck.textContent = `${bottleneck.label} (${Math.round((bottleneck.duration / total) * 100)}%)`;
  els.profilerBars.innerHTML = "";

  for (const item of profile.timings) {
    const percent = Math.max(1, Math.round((item.duration / total) * 100));
    const row = document.createElement("div");
    row.className = "profiler-bar-row";
    row.innerHTML = `
      <span class="profiler-stage">${item.label}</span>
      <span class="profiler-track"><i style="width:${percent}%"></i></span>
      <span class="profiler-time">${formatDuration(item.duration)}</span>
    `;
    els.profilerBars.append(row);
  }

  els.profilerSuggestions.innerHTML = "";
  for (const suggestion of profilerSuggestions(profile, options, bottleneck)) {
    const item = document.createElement("li");
    item.textContent = suggestion;
    els.profilerSuggestions.append(item);
  }
}

function render() {
  try {
    updateReadouts();
    const pattern = els.bayer.value;
    const options = currentOptions();
    const normalizedForRawPreview = normalizeRaw(currentRaw.data, options.blackLevel, options.whiteLevel);
    const { result, profile } = profileIspPipeline({ ...currentRaw, bayerPattern: pattern }, options);
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
    drawFormulaScenePreview(tutorialSteps[currentTutorialIndex]?.key ?? currentHeroStage);
    updateFormulaPreviewMode();

    const finalStats = computeStats(result.finalRgb, 3);
    els.frameReadout.textContent = `${currentRaw.width} x ${currentRaw.height} ${pattern}`;
    els.rangeReadout.textContent = `${Math.min(...finalStats.map((s) => s.min)).toFixed(2)} .. ${Math.max(...finalStats.map((s) => s.max)).toFixed(2)}`;
    els.meanReadout.textContent = finalStats.map((s) => s.mean.toFixed(2)).join(" / ");
    els.badPixelReadout.textContent = String(result.badPixelCount);
    els.heroValues.textContent = `R ${finalStats[0].mean.toFixed(2)}  G ${finalStats[1].mean.toFixed(2)}  B ${finalStats[2].mean.toFixed(2)}`;
    updateProfiler(profile, options);
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
  loadSelectedScene(true);
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

els.formulaDiagramButton?.addEventListener("click", () => {
  formulaPreviewMode = "diagram";
  updateFormulaPreviewMode();
});

els.formulaSceneButton?.addEventListener("click", () => {
  formulaPreviewMode = "scene";
  updateFormulaPreviewMode();
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
      if (input === els.sampleScene) {
        loadSelectedScene(true);
        return;
      }
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


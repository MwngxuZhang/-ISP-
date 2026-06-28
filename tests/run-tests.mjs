import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { DEMO_CASES, getDemoCases } from "../src/demo-cases.js";
import { evaluateAdvancedLab, getAdvancedImagingContent } from "../src/advanced-imaging-content.js";
import { FORMULA_STAGE_KEYS, getFormulaContent } from "../src/formula-content.js";
import {
  applyLensShadingCorrection,
  bayerColorAt,
  computeHistogram,
  correctBadPixels,
  demosaicBilinear,
  estimateGrayWorldGains,
  generateSyntheticRaw,
  normalizeRaw,
  parseBinaryRaw,
  parsePgm,
  profileIspPipeline,
  runIspPipeline,
  SAMPLE_SCENES
} from "../src/isp-core.js";
import { getTutorialLabels, getTutorialSteps, TUTORIAL_STEPS } from "../src/tutorial-content.js";

globalThis.ImageData = class ImageData {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
};

assert.equal(bayerColorAt(0, 0, "RGGB"), "R");
assert.equal(bayerColorAt(1, 0, "RGGB"), "G");
assert.equal(bayerColorAt(0, 1, "RGGB"), "G");
assert.equal(bayerColorAt(1, 1, "RGGB"), "B");
assert.equal(bayerColorAt(0, 0, "BGGR"), "B");

const normalized = normalizeRaw(Uint16Array.from([64, 2080, 4095]), 64, 4095);
assert.equal(normalized[0], 0);
assert.ok(normalized[1] > 0.49 && normalized[1] < 0.51);
assert.equal(normalized[2], 1);

const tinyMosaic = Float32Array.from([
  1, 0.5,
  0.5, 0.2
]);
const demosaiced = demosaicBilinear(tinyMosaic, 2, 2, "RGGB");
assert.equal(demosaiced.length, 12);
for (const value of demosaiced) {
  assert.ok(Number.isFinite(value));
}

const raw = generateSyntheticRaw(32, 24, 12, "RGGB");
const pipeline = runIspPipeline(raw, {
  blackLevel: raw.blackLevel,
  whiteLevel: raw.whiteLevel,
  bayerPattern: "RGGB",
  badPixelThreshold: 0.32,
  lensShadingStrength: 0.2,
  whiteBalance: { red: 2, green: 1, blue: 1.5 },
  denoiseStrength: 0.1,
  sharpenAmount: 0.25,
  exposure: 0.1,
  contrast: 1.05,
  saturation: 1.1,
  gamma: 2.2
});
assert.equal(pipeline.finalRgb.length, 32 * 24 * 3);
for (const value of pipeline.finalRgb) {
  assert.ok(value >= 0 && value <= 1);
}
assert.equal(pipeline.badPixelCorrected.length, 32 * 24);
assert.equal(pipeline.lensShaded.length, 32 * 24);
assert.equal(pipeline.denoised.length, 32 * 24 * 3);
assert.equal(pipeline.sharpened.length, 32 * 24 * 3);

let fakeNow = 0;
const profiled = profileIspPipeline(raw, {
  blackLevel: raw.blackLevel,
  whiteLevel: raw.whiteLevel,
  bayerPattern: "RGGB",
  badPixelThreshold: 0.32,
  lensShadingStrength: 0.2,
  whiteBalance: { red: 2, green: 1, blue: 1.5 },
  denoiseStrength: 0.1,
  sharpenAmount: 0.25,
  gamma: 2.2
}, () => {
  fakeNow += 1.5;
  return fakeNow;
});
assert.equal(profiled.result.finalRgb.length, 32 * 24 * 3);
assert.ok(profiled.profile.totalDuration > 0);
assert.equal(profiled.profile.timings.length, 10);
assert.ok(profiled.profile.memoryBytes > 0);
assert.ok(profiled.profile.timings.some((item) => item.key === "demosaic"));

const expectedTutorialStages = ["raw", "norm", "bad", "lsc", "demosaic", "wb", "ccm", "denoise", "sharpen", "tone"];
assert.deepEqual(FORMULA_STAGE_KEYS, expectedTutorialStages);
assert.deepEqual(TUTORIAL_STEPS.map((step) => step.key), expectedTutorialStages);
for (const step of TUTORIAL_STEPS) {
  assert.ok(step.title.length > 3);
  assert.ok(step.plain.length > 20);
  assert.ok(step.why.length > 20);
  assert.ok(step.analogy.length > 20);
  assert.ok(step.watch.length > 20);
  assert.ok(step.try.length > 20);
  assert.ok(step.control.length > 3);
  assert.ok(step.expected.length > 20);
  assert.ok(step.mistake.length > 20);
  assert.ok(step.checkpoint.length > 20);
  assert.ok(step.bubble.length > 20);
  assert.ok(step.tapBubble.length > 20);
  assert.ok(step.tipBubble.length > 20);
  assert.ok(step.doneBubble.length > 20);
  assert.ok(step.anchor.length > 2);
}

const zhTutorialSteps = getTutorialSteps("zh");
const zhTutorialLabels = getTutorialLabels("zh");
assert.deepEqual(zhTutorialSteps.map((step) => step.key), expectedTutorialStages);
assert.equal(zhTutorialLabels.next, "下一步");
assert.equal(zhTutorialLabels.previous, "上一步");
assert.equal(zhTutorialLabels.analogyLabel, "形象理解");
assert.ok(zhTutorialSteps[0].title.includes("RAW"));
assert.ok(zhTutorialSteps[0].plain.includes("传感器"));
assert.ok(zhTutorialSteps[0].analogy.includes("拼图"));
assert.ok(zhTutorialSteps.at(-1).bubble.includes("可显示 RGB"));

for (const stage of expectedTutorialStages) {
  const formula = getFormulaContent(stage, "en");
  const zhFormula = getFormulaContent(stage, "zh");
  assert.ok(formula.title.length > 4);
  assert.ok(formula.formula.length > 5);
  assert.ok(formula.plain.length > 60);
  assert.ok(formula.variables.length >= 3);
  assert.ok(formula.interaction.label.length > 3);
  assert.ok(Number(formula.interaction.max) > Number(formula.interaction.min));
  assert.ok(zhFormula.plain.length > 20);
  assert.ok(zhFormula.variables.every((item) => item.text.length > 2));
}
assert.ok(getFormulaContent("norm", "zh").formula.includes("RAW - B"));
assert.ok(getFormulaContent("ccm", "en").formula.includes("M"));

assert.equal(DEMO_CASES.length, 9);
for (const demo of DEMO_CASES) {
  assert.ok(demo.id.length > 2);
  assert.ok(demo.title.length > 2);
  assert.ok(demo.thumbnail.endsWith(".png") || demo.thumbnail.endsWith(".svg"));
  assert.ok(Object.keys(SAMPLE_SCENES).includes(demo.scene));
}

const zhDemoCases = getDemoCases("zh");
assert.equal(zhDemoCases.length, 9);
assert.equal(zhDemoCases[0].title, "色卡");
assert.ok(zhDemoCases[0].description.includes("白平衡"));
assert.ok(zhDemoCases.some((demo) => demo.focus.includes("降噪")));
assert.ok(zhDemoCases.some((demo) => demo.scene === "portraitSkin"));

const advancedEn = getAdvancedImagingContent("en");
const advancedZh = getAdvancedImagingContent("zh");
assert.equal(advancedEn.labs.length, 12);
assert.equal(advancedZh.labs.length, 12);
assert.equal(advancedZh.scenarios.length, 6);
assert.ok(advancedZh.labels.title.includes("完整相机成像链路"));
assert.ok(advancedZh.labels.openScenario.includes("打开"));
for (const lab of advancedZh.labs) {
  assert.ok(lab.title.length >= 4);
  assert.ok(lab.why.length > 30);
  assert.ok(lab.formula.length > 10);
  assert.ok(lab.code.length > 20);
  assert.ok(lab.tasks.length >= 3);
  assert.ok(lab.robot.length > 20);
  const evaluation = evaluateAdvancedLab(lab, lab.value);
  assert.ok(evaluation.percent >= 0 && evaluation.percent <= 100);
  assert.ok(evaluation.risk.length > 2);
}
assert.ok(advancedZh.labs.some((lab) => lab.title.includes("自动对焦")));
assert.ok(advancedZh.labs.some((lab) => lab.title.includes("视频")));
assert.ok(advancedZh.labs.some((lab) => lab.title.includes("AI")));
const srLab = advancedZh.labs.find((lab) => lab.id === "ai");
assert.equal(srLab.controlLabel, "超分倍率");
assert.equal(srLab.unit, "x");
assert.equal(srLab.min, 1);
assert.equal(srLab.max, 4);
assert.ok(evaluateAdvancedLab(srLab, 4).percent > evaluateAdvancedLab(srLab, 1).percent);
assert.ok(advancedZh.scenarios.some((scenario) => scenario.title.includes("医疗")));
for (const scenario of advancedZh.scenarios) {
  assert.ok(scenario.demo.length > 4);
  assert.ok(scenario.pipeline.length > 20);
  assert.ok(scenario.control.length > 15);
  assert.ok(scenario.labId.length > 2);
  assert.ok(scenario.thumbnail.includes("assets/scenarios"));
  assert.ok(advancedZh.labs.some((lab) => lab.id === scenario.labId));
}

for (const scene of Object.keys(SAMPLE_SCENES)) {
  const sceneRaw = generateSyntheticRaw(32, 24, 12, "RGGB", scene);
  assert.equal(sceneRaw.data.length, 32 * 24);
  assert.equal(sceneRaw.scene, scene);
  const scenePipeline = runIspPipeline(sceneRaw, {
    blackLevel: sceneRaw.blackLevel,
    whiteLevel: sceneRaw.whiteLevel,
    bayerPattern: sceneRaw.bayerPattern,
    badPixelThreshold: 0.32,
    lensShadingStrength: scene === "vignette" ? 0.8 : 0.2,
    whiteBalance: { red: 1.8, green: 1, blue: 1.5 },
    denoiseStrength: scene === "lowLight" ? 0.3 : 0.05,
    sharpenAmount: 0.2,
    gamma: 2.2
  });
  assert.equal(scenePipeline.finalRgb.length, 32 * 24 * 3);
  for (const value of scenePipeline.finalRgb) {
    assert.ok(value >= 0 && value <= 1);
  }
}

for (const demo of DEMO_CASES) {
  const demoRaw = generateSyntheticRaw(40, 28, 12, "RGGB", demo.scene);
  const demoPipeline = runIspPipeline(demoRaw, {
    blackLevel: demoRaw.blackLevel,
    whiteLevel: demoRaw.whiteLevel,
    bayerPattern: demoRaw.bayerPattern,
    badPixelThreshold: 0.32,
    lensShadingStrength: demo.scene === "vignette" ? 0.8 : 0.2,
    whiteBalance: { red: 1.8, green: 1, blue: 1.5 },
    denoiseStrength: demo.scene === "lowLight" ? 0.3 : 0.05,
    sharpenAmount: 0.2,
    gamma: 2.2
  });
  assert.equal(demoPipeline.finalRgb.length, 40 * 28 * 3);
}

const defective = Float32Array.from([
  0.2, 0.2, 0.2, 0.2,
  0.2, 1.0, 0.2, 0.2,
  0.2, 0.2, 0.2, 0.2,
  0.2, 0.2, 0.2, 0.2
]);
const corrected = correctBadPixels(defective, 4, 4, "RGGB", 0.3);
assert.ok(corrected.count >= 1);
assert.ok(corrected.data[5] < 0.5);

const shaded = applyLensShadingCorrection(Float32Array.from([0.5, 0.5, 0.5, 0.5]), 2, 2, 0.5);
assert.ok(shaded.every((value) => value >= 0.5));

const gains = estimateGrayWorldGains(Float32Array.from([0.25, 0.5, 0.25, 0.25, 0.5, 0.25]));
assert.ok(gains.red > 1);
assert.equal(gains.green, 1);
assert.ok(gains.blue > 1);

const hist = computeHistogram(Float32Array.from([0, 0.5, 1]), 1, 4);
assert.equal(hist[0][0], 1);
assert.equal(hist[0][2], 1);
assert.equal(hist[0][3], 1);

const pgmText = new TextEncoder().encode("P2\n2 2\n15\n0 5 10 15\n").buffer;
const pgm = parsePgm(pgmText);
assert.equal(pgm.width, 2);
assert.equal(pgm.height, 2);
assert.deepEqual([...pgm.data], [0, 5, 10, 15]);

const rawBytes = new Uint8Array([1, 0, 2, 0, 3, 0, 4, 0]).buffer;
const parsedRaw = parseBinaryRaw(rawBytes, { width: 2, height: 2, bitDepth: 12, littleEndian: true });
assert.deepEqual([...parsedRaw], [1, 2, 3, 4]);

const sampleBytes = readFileSync(new URL("../samples/synthetic-rggb-16x12-12bit-little.raw", import.meta.url));
const sampleMeta = JSON.parse(readFileSync(new URL("../samples/synthetic-rggb-16x12-12bit-little.json", import.meta.url), "utf8"));
const sampleBuffer = sampleBytes.buffer.slice(sampleBytes.byteOffset, sampleBytes.byteOffset + sampleBytes.byteLength);
const sampleRawData = parseBinaryRaw(sampleBuffer, {
  width: sampleMeta.width,
  height: sampleMeta.height,
  bitDepth: sampleMeta.bitDepth,
  littleEndian: sampleMeta.endian === "little"
});
const samplePipeline = runIspPipeline({
  width: sampleMeta.width,
  height: sampleMeta.height,
  data: sampleRawData,
  bitDepth: sampleMeta.bitDepth,
  bayerPattern: sampleMeta.bayerPattern,
  blackLevel: sampleMeta.blackLevel,
  whiteLevel: sampleMeta.whiteLevel
});
assert.equal(samplePipeline.finalRgb.length, sampleMeta.width * sampleMeta.height * 3);

console.log("All ISP core tests passed.");

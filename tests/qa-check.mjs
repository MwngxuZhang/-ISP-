import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "README.md",
  "README.en.md",
  "README.zh-CN.md",
  "CONTRIBUTING.md",
  "CONTRIBUTING.en.md",
  "CONTRIBUTING.zh-CN.md",
  "ROADMAP.md",
  ".github/workflows/ci.yml",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/feature_request.md",
  ".github/pull_request_template.md",
  "index.html",
  "package.json",
  "LICENSE",
  "src/isp-core.js",
  "src/app.js",
  "src/app-production-pipeline.js",
  "src/code-walkthrough.js",
  "src/demo-cases.js",
  "src/demo-cases-rich.js",
  "src/formula-content.js",
  "src/tutorial-content.js",
  "src/tutorial-content-pipeline.js",
  "src/styles.css",
  "assets/mascot-guide.png",
  "assets/demos/color-chart.png",
  "assets/demos/low-light.png",
  "assets/demos/vignette.png",
  "assets/demos/bad-pixels.png",
  "assets/demos/grayscale-ramp.png",
  "assets/demos/high-contrast.png",
  "assets/demos/portrait-skin.svg",
  "assets/demos/night-street.svg",
  "assets/demos/backlit-window.svg",
  "tests/run-tests.mjs",
  "scripts/static-server.mjs",
  "docs/USER_GUIDE.md",
  "docs/USER_GUIDE.en.md",
  "docs/USER_GUIDE.zh-CN.md",
  "docs/TECHNICAL_DESIGN.en.md",
  "docs/TECHNICAL_DESIGN.zh-CN.md",
  "docs/GITHUB_STAR_GAP_ANALYSIS.md",
  "docs/GITHUB_STAR_GAP_ANALYSIS.en.md",
  "docs/GITHUB_STAR_GAP_ANALYSIS.zh-CN.md",
  "docs/OPEN_SOURCE_GROWTH_PLAN.md",
  "docs/OPEN_SOURCE_GROWTH_PLAN.en.md",
  "docs/OPEN_SOURCE_GROWTH_PLAN.zh-CN.md",
  "docs/DEVELOPMENT_PLAN.en.md",
  "docs/DEVELOPMENT_PLAN.zh-CN.md",
  "docs/PROJECT_UNDERSTANDING.en.md",
  "docs/PROJECT_UNDERSTANDING.zh-CN.md",
  "docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.en.md",
  "docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.zh-CN.md",
  "docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.en.md",
  "docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.zh-CN.md",
  "docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.en.md",
  "docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.zh-CN.md",
  "samples/synthetic-rggb-8x8.pgm",
  "samples/synthetic-rggb-16x12-12bit-little.raw",
  "samples/synthetic-rggb-16x12-12bit-little.json"
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing required file: ${file}`);
}

async function markdownFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await markdownFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith(".md")) out.push(fullPath);
  }
  return out;
}

const missingLinks = [];
for (const filePath of await markdownFiles(root)) {
  const text = readFileSync(filePath, "utf8");
  assert.ok(text.trim().length > 80, `Markdown file is too small: ${relative(root, filePath)}`);

  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (target.includes("://") || target.startsWith("#")) continue;
    const clean = target.split("#", 1)[0];
    if (!clean) continue;
    const resolved = normalize(resolve(dirname(filePath), clean));
    if (!existsSync(resolved)) {
      missingLinks.push(`${relative(root, filePath)} -> ${target}`);
    }
  }
}
assert.deepEqual(missingLinks, []);

const index = readFileSync(join(root, "index.html"), "utf8");
const app = readFileSync(join(root, "src/app.js"), "utf8");
const core = readFileSync(join(root, "src/isp-core.js"), "utf8");
const formulas = readFileSync(join(root, "src/formula-content.js"), "utf8");
const tutorial = readFileSync(join(root, "src/tutorial-content.js"), "utf8");
const demoCases = readFileSync(join(root, "src/demo-cases.js"), "utf8");

for (const id of [
  "languageInput",
  "demoHeading",
  "demoIntro",
  "sampleSceneInput",
  "demoGallery",
  "maturityTitle",
  "maturityGapLink",
  "maturityGrowthLink",
  "maturityRoadmapLink",
  "autoWbButton",
  "autoExposureButton",
  "exportButton",
  "presetButton",
  "coachMascot",
  "coachMascotStage",
  "coachBubble",
  "coachPrevButton",
  "coachNextButton",
  "coachApplyButton",
  "coachGotItButton",
  "coachRestartButton",
  "coachProgressBar",
  "coachProductionLabel",
  "coachProduction",
  "coachAnalogyLabel",
  "coachAnalogy",
  "coachControl",
  "coachExpected",
  "coachMistake",
  "coachCheckpoint",
  "formulaEyebrow",
  "formulaTitle",
  "formulaText",
  "formulaCanvas",
  "formulaLegendCurrent",
  "formulaLegendDefault",
  "formulaInput",
  "formulaScaleLow",
  "formulaScaleHigh",
  "formulaResetButton",
  "formulaVariables",
  "formulaExplanation",
  "codeEyebrow",
  "codeTitle",
  "codeSteps",
  "codeSnippet",
  "codeTry",
  "profilerEyebrow",
  "profilerTitle",
  "profilerTotalTime",
  "profilerMemory",
  "profilerBottleneck",
  "profilerBars",
  "profilerSuggestions",
  "floatingPet",
  "petAvatar",
  "petBubble",
  "rawCanvas",
  "normCanvas",
  "badCanvas",
  "lscCanvas",
  "demosaicCanvas",
  "wbCanvas",
  "ccmCanvas",
  "denoiseCanvas",
  "sharpenCanvas",
  "toneCanvas"
]) {
  assert.ok(index.includes(id), `index.html missing UI id: ${id}`);
}

for (const scene of ["colorChart", "lowLight", "vignette", "badPixels", "grayscale", "highContrast", "portraitSkin", "nightStreet", "backlitWindow"]) {
  assert.ok(core.includes(scene), `Missing sample scene: ${scene}`);
  assert.ok(demoCases.includes(scene), `Missing demo scene mapping: ${scene}`);
}

for (const thumbnail of ["color-chart.png", "low-light.png", "vignette.png", "bad-pixels.png", "grayscale-ramp.png", "high-contrast.png", "portrait-skin.svg", "night-street.svg", "backlit-window.svg"]) {
  assert.ok(demoCases.includes(thumbnail), `Missing demo thumbnail mapping: ${thumbnail}`);
}

for (const symbol of ["runIspPipeline", "profileIspPipeline", "correctBadPixels", "applyLensShadingCorrection", "denoiseRgb", "sharpenRgb", "computeHistogram"]) {
  assert.ok(core.includes(symbol), `Missing ISP symbol: ${symbol}`);
}

for (const symbol of ["renderStage", "drawHistogram", "autoWbButton", "autoExposureButton", "toBlob"]) {
  assert.ok(app.includes(symbol), `Missing app behavior: ${symbol}`);
}

for (const stage of ["raw", "norm", "bad", "lsc", "demosaic", "wb", "ccm", "denoise", "sharpen", "tone"]) {
  assert.ok(tutorial.includes(`key: "${stage}"`), `Missing tutorial stage: ${stage}`);
}

assert.ok(app.includes("getTutorialSteps"), "App does not load localized tutorial steps");
assert.ok(app.includes("getTutorialLabels"), "App does not load localized tutorial labels");
assert.ok(app.includes("getDemoCases"), "App does not load localized demo cases");
assert.ok(app.includes("setLanguage"), "App missing language switch behavior");
assert.ok(app.includes("rawIspRgbLanguage"), "App missing persisted language preference");
assert.ok(app.includes("renderDemoGallery"), "App missing demo gallery rendering");
assert.ok(app.includes("loadSelectedScene"), "Built-in case selector should load scenes directly");
assert.ok(app.includes("applyTutorialTip"), "App missing tutorial tip behavior");
assert.ok(app.includes("completedTutorialStages"), "App missing tutorial progress tracking");
assert.ok(app.includes("coachGotItButton"), "App missing got-it behavior");
assert.ok(app.includes("reactMascot"), "App missing mascot reaction behavior");
assert.ok(app.includes("movePetNear"), "App missing floating pet movement behavior");
assert.ok(app.includes("petAvatar"), "App missing floating pet avatar behavior");
assert.ok(app.includes("pointermove"), "App missing mascot pointer interaction");
assert.ok(app.includes("CONTROL_HINTS"), "App missing control-level mascot explanations");
assert.ok(app.includes("getFormulaContent"), "App missing formula content loading");
assert.ok(app.includes("getCodeWalkthrough"), "App missing per-stage code walkthrough loading");
assert.ok(app.includes("updateCodeWalkthrough"), "App missing code walkthrough renderer");
assert.ok(app.includes("profileIspPipeline"), "App missing pipeline performance profiler");
assert.ok(app.includes("updateProfiler"), "App missing profiler UI rendering");
assert.ok(app.includes("profilerSuggestions"), "App missing profiler optimization suggestions");
assert.ok(app.includes("drawFormulaDiagram"), "App missing interactive formula diagram rendering");
assert.ok(app.includes("formulaInput"), "App missing formula slider interaction");
assert.ok(app.includes("formulaResetButton"), "App missing formula reset interaction");
assert.ok(app.includes("applyFormulaToPipeline"), "Formula slider must drive the real ISP pipeline");
assert.ok(app.includes("ensureFormulaRawBaseline"), "RAW formula brightness must use a stable RAW baseline");
assert.ok(app.includes("setControlValue(els.black"), "Black-level formula must update the real black-level control");
assert.ok(app.includes("setControlValue(els.denoise"), "Denoise formula must update the real denoise control");
assert.ok(app.includes("devicePixelRatio"), "Formula canvas missing high-DPI rendering");
assert.ok(app.includes("setMascotExpression"), "App missing mascot expression controller");
assert.ok(app.includes("expr-surprised"), "App missing expressive mascot states");
assert.ok(!app.includes("fillText"), "Formula diagrams should keep text in HTML for crisp rendering");
assert.ok(tutorial.includes("controlLabel"), "Tutorial labels missing control guidance");
assert.ok(tutorial.includes("productionLabel"), "Tutorial labels missing production pipeline label");
assert.ok(tutorial.includes("productionNotes"), "Tutorial content missing phone/camera module mapping");
assert.ok(tutorial.includes("analogyLabel"), "Tutorial labels missing visual analogy guidance");
assert.ok(tutorial.includes("mistakeLabel"), "Tutorial labels missing beginner trap guidance");
assert.ok(tutorial.includes("bubble"), "Tutorial content missing speech bubbles");
assert.ok(tutorial.includes("tapBubble"), "Tutorial content missing stage-click speech bubbles");
assert.ok(tutorial.includes("tipBubble"), "Tutorial content missing Apply Tip speech bubbles");
assert.ok(tutorial.includes("doneBubble"), "Tutorial content missing checkpoint speech bubbles");
assert.ok(tutorial.includes("anchor"), "Tutorial content missing pet movement anchors");
assert.ok(tutorial.includes("zhLabels"), "Tutorial content missing Chinese labels");
assert.ok(tutorial.includes("getTutorialSteps"), "Tutorial content missing localized step getter");
assert.ok(demoCases.includes("getDemoCases"), "Demo cases missing localized getter");
assert.ok(demoCases.includes("色卡"), "Demo cases missing Chinese demo text");
assert.ok(index.includes("pixel-3d"), "index.html missing 3D mascot structure");
assert.ok(index.includes("pixel-arm"), "index.html missing articulated mascot limbs");
assert.ok(index.includes("pixel-cheek"), "index.html missing cute mascot cheeks");
assert.ok(index.includes("pixel-sparkle"), "index.html missing mascot sparkle expression");
assert.ok(index.includes("formula-lab"), "index.html missing interactive formula panel");
assert.ok(index.includes("code-lab"), "index.html missing code walkthrough panel");
assert.ok(index.includes("formula-legend"), "index.html missing current/default formula legend");
assert.ok(index.includes("profiler-section"), "index.html missing performance profiler panel");
assert.ok(index.includes("maturity-section"), "index.html missing open-source maturity section");
assert.ok(index.includes("src/app-production-pipeline.js"), "index.html should load the cache-busted production app entry");
assert.ok(app.includes("tapBubble || step.bubble"), "App missing richer stage-click mascot language");
assert.ok(readFileSync(join(root, "docs/GITHUB_STAR_GAP_ANALYSIS.en.md"), "utf8").includes("Performance Profiler"), "Gap analysis should mention profiler upgrade");
assert.ok(readFileSync(join(root, "docs/GITHUB_STAR_GAP_ANALYSIS.zh-CN.md"), "utf8").includes("高星"), "Chinese gap analysis should explain high-star gap");
assert.ok(readFileSync(join(root, "docs/OPEN_SOURCE_GROWTH_PLAN.en.md"), "utf8").includes("High-star projects"), "Growth plan should explain high-star qualities");
assert.ok(readFileSync(join(root, "ROADMAP.md"), "utf8").includes("0.1 Learning Stable"), "Roadmap missing 0.1 milestone");
assert.ok(readFileSync(join(root, ".github/workflows/ci.yml"), "utf8").includes("npm test"), "CI should run npm test");
assert.ok(readFileSync(join(root, "src/code-walkthrough.js"), "utf8").includes("generateSyntheticRaw"), "Code walkthrough should explain RAW code path");
assert.ok(readFileSync(join(root, "docs/USER_GUIDE.zh-CN.md"), "utf8").includes("代码讲解"), "Chinese user guide should explain code walkthrough");

for (const stage of ["raw", "norm", "bad", "lsc", "demosaic", "wb", "ccm", "denoise", "sharpen", "tone"]) {
  assert.ok(formulas.includes(`${stage}: {`), `Formula content missing stage: ${stage}`);
}
assert.ok(formulas.includes("getFormulaContent"), "Formula module missing getter");
assert.ok(formulas.includes("variables"), "Formula module missing variable explanations");
assert.ok(formulas.includes("interaction"), "Formula module missing interactive controls");
assert.ok(formulas.includes("黑电平"), "Formula module missing Chinese formula explanation");

console.log("QA structure checks passed.");

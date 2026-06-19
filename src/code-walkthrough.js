const codeContent = {
  raw: {
    title: { en: "Synthetic Bayer RAW generation", zh: "合成 Bayer RAW 生成" },
    file: "src/isp-core.js",
    functionName: "generateSyntheticRaw",
    plain: {
      en: "This stage creates or loads the sensor-like Bayer mosaic. Each pixel stores only one color sample according to the CFA pattern.",
      zh: "这一阶段生成或加载类似传感器输出的 Bayer mosaic。每个像素只根据 CFA 排列记录一个颜色采样。"
    },
    steps: [
      { en: "Choose scene RGB intensity.", zh: "先得到场景的 RGB 强度。" },
      { en: "Pick R/G/B by Bayer position.", zh: "根据 Bayer 位置只保留 R/G/B 中的一个通道。" },
      { en: "Apply vignette, noise, black level, and white level.", zh: "叠加暗角、噪声、黑电平和白电平。" }
    ],
    snippet: `const color = bayerColorAt(x, y, pattern);
const channel = color === "R" ? 0 : color === "G" ? 1 : 2;
data[y * width + x] = blackLevel + signal * (whiteLevel - blackLevel);`,
    try: { en: "Try adding a new scene in sceneRgb() and map it to a demo card.", zh: "可以尝试在 sceneRgb() 里增加一个新场景，并映射到演示卡片。" }
  },
  norm: {
    title: { en: "Black-level correction and normalization", zh: "黑电平校正与归一化" },
    file: "src/isp-core.js",
    functionName: "normalizeRaw",
    plain: {
      en: "The raw digital value is shifted and scaled so black becomes 0 and sensor saturation becomes 1.",
      zh: "把 RAW 数值平移和缩放，让黑场接近 0，让饱和白点接近 1。"
    },
    steps: [
      { en: "Subtract black level.", zh: "减去黑电平。" },
      { en: "Divide by white minus black.", zh: "除以白电平与黑电平的差。" },
      { en: "Clamp to the displayable 0..1 range.", zh: "裁剪到 0..1 范围。" }
    ],
    snippet: `const scale = 1 / (whiteLevel - blackLevel);
out[i] = clamp((rawData[i] - blackLevel) * scale);`,
    try: { en: "Change black level and watch the left side of the histogram.", zh: "调整黑电平，观察直方图左侧是否被压死。" }
  },
  bad: {
    title: { en: "Bad-pixel correction", zh: "坏点校正" },
    file: "src/isp-core.js",
    functionName: "correctBadPixels",
    plain: {
      en: "The algorithm compares a pixel with same-color neighbors and replaces outliers with the local median.",
      zh: "算法把当前像素和同色邻居比较，发现离群值后用局部中值替换。"
    },
    steps: [
      { en: "Collect same-color Bayer neighbors.", zh: "收集同色 Bayer 邻居。" },
      { en: "Compute the median value.", zh: "计算邻域中值。" },
      { en: "Replace values whose difference is above threshold.", zh: "把差异超过阈值的像素替换掉。" }
    ],
    snippet: `const median = neighbors[Math.floor(neighbors.length / 2)];
if (Math.abs(current - median) > threshold) {
  out[y * width + x] = median;
}`,
    try: { en: "Lower the threshold to catch more defects, then check whether texture is damaged.", zh: "降低阈值能抓到更多坏点，但要检查是否误伤纹理。" }
  },
  lsc: {
    title: { en: "Lens-shading correction", zh: "镜头阴影校正" },
    file: "src/isp-core.js",
    functionName: "applyLensShadingCorrection",
    plain: {
      en: "A radial gain lifts darker corners to compensate for lens falloff.",
      zh: "用径向增益抬高四角亮度，用来补偿镜头暗角。"
    },
    steps: [
      { en: "Measure distance from image center.", zh: "计算像素到画面中心的距离。" },
      { en: "Convert radius into gain.", zh: "把半径转换为增益。" },
      { en: "Multiply the RAW mosaic by that gain.", zh: "用增益乘到 RAW mosaic 上。" }
    ],
    snippet: `const radius = Math.hypot(x - cx, y - cy) / maxRadius;
const gain = 1 + strength * radius * radius;
out[y * width + x] = clamp(mosaic[y * width + x] * gain);`,
    try: { en: "Try a mesh-based correction later for more realistic phone modules.", zh: "后续可以尝试网格 LSC，更接近真实手机模组标定。" }
  },
  demosaic: {
    title: { en: "Bilinear demosaic", zh: "双线性 Demosaic" },
    file: "src/isp-core.js",
    functionName: "demosaicBilinear",
    plain: {
      en: "Missing RGB channels are reconstructed by averaging nearby samples of the target color.",
      zh: "每个像素缺失的 RGB 通道，通过附近同目标颜色采样的平均值补出来。"
    },
    steps: [
      { en: "Keep the channel that exists at this Bayer location.", zh: "保留当前位置真实采到的通道。" },
      { en: "Search neighbors for missing colors.", zh: "从邻域里寻找缺失颜色。" },
      { en: "Average neighbor samples into RGB.", zh: "把邻居平均成完整 RGB。" }
    ],
    snippet: `if (ownColor === targetColor) return mosaic[y * width + x];
if (bayerColorAt(sx, sy, pattern) === targetColor) {
  sum += mosaic[sy * width + sx];
}`,
    try: { en: "Replace this with edge-aware demosaic to reduce zipper artifacts.", zh: "可以把这里替换成边缘感知 demosaic，减少拉链伪影。" }
  },
  wb: {
    title: { en: "White-balance gains", zh: "白平衡增益" },
    file: "src/isp-core.js",
    functionName: "applyWhiteBalance",
    plain: {
      en: "Each RGB channel is multiplied by a gain so neutral objects become less tinted.",
      zh: "每个 RGB 通道乘以一个增益，让中性物体减少偏色。"
    },
    steps: [
      { en: "Read red, green, and blue gains.", zh: "读取红绿蓝增益。" },
      { en: "Multiply each channel independently.", zh: "分别乘到每个通道上。" },
      { en: "Use gray-world estimation when Auto WB is clicked.", zh: "点击 Auto WB 时使用灰世界估计。" }
    ],
    snippet: `out[i] = rgb[i] * rGain;
out[i + 1] = rgb[i + 1] * gGain;
out[i + 2] = rgb[i + 2] * bGain;`,
    try: { en: "Use the grayscale scene to verify neutral patches.", zh: "用灰阶场景验证中性区域是否仍然中性。" }
  },
  ccm: {
    title: { en: "Color correction matrix", zh: "颜色校正矩阵" },
    file: "src/isp-core.js",
    functionName: "applyColorCorrection",
    plain: {
      en: "A 3x3 matrix maps sensor-like RGB into a target rendering color space.",
      zh: "3x3 矩阵把类似传感器的 RGB 映射到目标色彩呈现空间。"
    },
    steps: [
      { en: "Read one RGB pixel.", zh: "读取一个 RGB 像素。" },
      { en: "Multiply it by the 3x3 matrix.", zh: "乘以 3x3 矩阵。" },
      { en: "Write corrected RGB.", zh: "写回校正后的 RGB。" }
    ],
    snippet: `out[i] = matrix[0] * r + matrix[1] * g + matrix[2] * b;
out[i + 1] = matrix[3] * r + matrix[4] * g + matrix[5] * b;`,
    try: { en: "Add a portrait-oriented matrix and compare skin tones.", zh: "可以增加一个人像风格矩阵，再比较肤色变化。" }
  },
  denoise: {
    title: { en: "Spatial denoise", zh: "空间降噪" },
    file: "src/isp-core.js",
    functionName: "denoiseRgb",
    plain: {
      en: "The current implementation blends the image with a local blur to reduce small variations.",
      zh: "当前实现把原图和局部模糊结果混合，用来减少小尺度波动。"
    },
    steps: [
      { en: "Create a 3x3 blurred image.", zh: "生成 3x3 模糊图。" },
      { en: "Use strength as blend weight.", zh: "用强度作为混合权重。" },
      { en: "Trade noise reduction against texture loss.", zh: "在降噪和纹理损失之间取舍。" }
    ],
    snippet: `const blurred = blurRgb(rgb, width, height);
out[i] = rgb[i] * (1 - mix) + blurred[i] * mix;`,
    try: { en: "Try stronger denoise in the night scene, then look for texture melting.", zh: "在夜景场景提高降噪，再观察纹理是否被抹掉。" }
  },
  sharpen: {
    title: { en: "Unsharp-mask sharpen", zh: "反差蒙版锐化" },
    file: "src/isp-core.js",
    functionName: "sharpenRgb",
    plain: {
      en: "Edges are enhanced by adding the difference between the original image and its blurred version.",
      zh: "通过把原图和模糊图的差值加回去增强边缘。"
    },
    steps: [
      { en: "Blur the image.", zh: "先模糊图像。" },
      { en: "Compute high-frequency detail.", zh: "计算高频细节。" },
      { en: "Add detail back with an amount.", zh: "按强度把细节加回去。" }
    ],
    snippet: `const blurred = blurRgb(rgb, width, height);
out[i] = rgb[i] + (rgb[i] - blurred[i]) * amount;`,
    try: { en: "Raise sharpen until halos appear, then step back.", zh: "提高锐化直到出现光晕，然后往回退一点。" }
  },
  tone: {
    title: { en: "Tone, gamma, and RGB output", zh: "色调、Gamma 与 RGB 输出" },
    file: "src/isp-core.js",
    functionName: "applyCreativeTone + applyGamma",
    plain: {
      en: "Exposure, contrast, saturation, and gamma convert processed linear data into display-friendly RGB.",
      zh: "曝光、对比度、饱和度和 Gamma 把处理后的线性数据变成适合显示的 RGB。"
    },
    steps: [
      { en: "Apply exposure gain.", zh: "应用曝光增益。" },
      { en: "Adjust contrast and saturation.", zh: "调整对比度和饱和度。" },
      { en: "Apply gamma for display.", zh: "应用 Gamma 以适配显示。" }
    ],
    snippet: `const exposureGain = Math.pow(2, exposure);
r = (r * exposureGain - 0.5) * contrast + 0.5;
out[i] = Math.pow(clamp(rgb[i]), 1 / gamma);`,
    try: { en: "Use the backlit scene to learn highlight clipping and shadow readability.", zh: "用逆光场景学习高光裁剪和暗部可读性的取舍。" }
  }
};

function localize(value, language) {
  if (value && typeof value === "object") return value[language] ?? value.en ?? "";
  return value ?? "";
}

export function getCodeWalkthrough(stageKey, language = "en") {
  const item = codeContent[stageKey] ?? codeContent.raw;
  return {
    title: localize(item.title, language),
    file: item.file,
    functionName: item.functionName,
    plain: localize(item.plain, language),
    steps: item.steps.map((step) => localize(step, language)),
    snippet: item.snippet,
    try: localize(item.try, language)
  };
}

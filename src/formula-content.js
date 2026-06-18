const formulaContent = {
  raw: {
    title: { en: "Bayer sampling model", zh: "Bayer 采样模型" },
    formula: "RAW(x,y) = C(x,y) * E(x,y) + n(x,y)",
    plain: {
      en: "At each sensor coordinate, the color filter C(x,y) lets only red, green, or blue light reach that photosite. E(x,y) is the incoming light energy, and n(x,y) is noise. The important point is that RAW is not three channels yet: it is one measured value plus a hidden color-filter pattern.",
      zh: "在传感器每个坐标上，彩色滤光片 C(x,y) 只允许红、绿、蓝其中一种光到达感光点。E(x,y) 是入射光能量，n(x,y) 是噪声。重点是 RAW 还不是三通道图像：它是一个测量值，再加上一张隐藏的颜色滤光片地图。"
    },
    variables: [
      { name: "C(x,y)", en: "color filter at this pixel", zh: "该像素位置的彩色滤光片" },
      { name: "E(x,y)", en: "scene light reaching the sensor", zh: "到达传感器的场景光能量" },
      { name: "n(x,y)", en: "sensor noise", zh: "传感器噪声" }
    ],
    interaction: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.35,
      label: { en: "Scene brightness", zh: "场景亮度" },
      low: { en: "Dim RAW samples", zh: "RAW 采样较暗" },
      high: { en: "Bright RAW samples", zh: "RAW 采样较亮" }
    }
  },
  norm: {
    title: { en: "Black-level correction and normalization", zh: "黑电平校正与归一化" },
    formula: "I = clamp((RAW - B) / (W - B), 0, 1)",
    plain: {
      en: "B is the black level, the value the sensor reports even when there is no light. W is the white level, the usable saturation point. Subtracting B gives the image a clean zero; dividing by W-B converts sensor codes into a normalized 0 to 1 working signal.",
      zh: "B 是黑电平，也就是没有光时传感器仍然会输出的值。W 是白电平，也就是可用饱和点。减去 B 可以得到干净的 0 点；再除以 W-B，就把传感器码值变成 0 到 1 的工作信号。"
    },
    variables: [
      { name: "RAW", en: "original sensor code", zh: "原始传感器码值" },
      { name: "B", en: "black level / dark offset", zh: "黑电平 / 暗电流偏置" },
      { name: "W", en: "white level / saturation code", zh: "白电平 / 饱和码值" }
    ],
    interaction: {
      min: 0,
      max: 0.35,
      step: 0.01,
      value: 0.08,
      label: { en: "Black offset", zh: "黑电平偏置" },
      low: { en: "Shadows keep gray fog", zh: "暗部保留灰雾" },
      high: { en: "Shadows risk clipping", zh: "暗部有裁剪风险" }
    }
  },
  bad: {
    title: { en: "Bad-pixel replacement", zh: "坏点替换" },
    formula: "if |p - median(N)| > T then p := median(N)",
    plain: {
      en: "A bad pixel is usually a lonely outlier. We compare pixel p with the median of its same-color neighbors N. If the difference is larger than threshold T, the pixel is treated as broken and replaced by the local median.",
      zh: "坏点通常是孤立的异常值。我们把像素 p 和同颜色邻域 N 的中位数比较。如果差值大于阈值 T，就把它当成坏点，并用局部中位数替换。"
    },
    variables: [
      { name: "p", en: "candidate pixel value", zh: "待检查像素值" },
      { name: "median(N)", en: "robust neighbor estimate", zh: "稳健的邻域估计" },
      { name: "T", en: "bad-pixel threshold", zh: "坏点判断阈值" }
    ],
    interaction: {
      min: 0.05,
      max: 0.7,
      step: 0.01,
      value: 0.32,
      label: { en: "Detection threshold", zh: "检测阈值" },
      low: { en: "Aggressive cleanup", zh: "清理更激进" },
      high: { en: "Leaves more suspects", zh: "留下更多可疑点" }
    }
  },
  lsc: {
    title: { en: "Lens-shading gain field", zh: "镜头阴影增益场" },
    formula: "I'(x,y) = I(x,y) * G(r),  G(r)=1+k*r^2",
    plain: {
      en: "r is the distance from the image center. Corners have larger r, so they receive a larger gain. The strength k controls how much we lift corner brightness. A good lens-shading correction makes the frame even without making corners glow.",
      zh: "r 是像素到画面中心的距离。四角的 r 更大，所以会得到更大的增益。强度 k 控制四角被抬亮多少。好的镜头阴影校正会让画面均匀，而不是让四角发光。"
    },
    variables: [
      { name: "r", en: "normalized distance from center", zh: "到中心的归一化距离" },
      { name: "k", en: "lens-shading strength", zh: "镜头阴影补偿强度" },
      { name: "G(r)", en: "corner lift gain", zh: "四角补偿增益" }
    ],
    interaction: {
      min: 0,
      max: 1.2,
      step: 0.01,
      value: 0.25,
      label: { en: "Corner lift", zh: "四角抬升" },
      low: { en: "Corners stay dim", zh: "四角仍偏暗" },
      high: { en: "Corners may glow", zh: "四角可能过亮" }
    }
  },
  demosaic: {
    title: { en: "Missing-color interpolation", zh: "缺失颜色插值" },
    formula: "RGB(x,y) = [R_hat(x,y), G_hat(x,y), B_hat(x,y)]",
    plain: {
      en: "The hats mean estimated values. At a red pixel, red is measured but green and blue are estimated from neighbors. At a green pixel, green is measured and the other two channels are estimated. Demosaic is the moment where a one-channel mosaic becomes a three-channel image.",
      zh: "帽子符号表示估计值。在红色像素上，红色是真实测量，绿色和蓝色要从邻域估计；在绿色像素上，绿色是真实测量，另外两个通道要估计。去马赛克就是单通道马赛克变成三通道图像的时刻。"
    },
    variables: [
      { name: "R̂, Ĝ, B̂", en: "estimated full RGB channels", zh: "估计出的完整 RGB 通道" },
      { name: "CFA", en: "color filter array pattern", zh: "彩色滤光阵列排列" },
      { name: "neighbors", en: "nearby same/other-color samples", zh: "附近同色或异色采样" }
    ],
    interaction: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
      label: { en: "Interpolation blend", zh: "插值混合程度" },
      low: { en: "Blocky mosaic feeling", zh: "马赛克感更强" },
      high: { en: "Smoother RGB estimate", zh: "RGB 估计更平滑" }
    }
  },
  wb: {
    title: { en: "White-balance channel gains", zh: "白平衡通道增益" },
    formula: "R'=gR*R,  G'=G,  B'=gB*B",
    plain: {
      en: "White balance scales channels so a neutral surface has similar R, G, and B values. Green is often kept as the anchor because there are many green samples in Bayer and it is close to luminance perception.",
      zh: "白平衡会缩放各通道，让中性物体的 R、G、B 数值更接近。绿色常作为锚点，因为 Bayer 中绿色采样最多，也更接近亮度感知。"
    },
    variables: [
      { name: "gR", en: "red gain", zh: "红色增益" },
      { name: "gB", en: "blue gain", zh: "蓝色增益" },
      { name: "neutral", en: "gray/white reference area", zh: "灰色或白色参考区域" }
    ],
    interaction: {
      min: 0.5,
      max: 3,
      step: 0.01,
      value: 1.6,
      label: { en: "Red/blue gain spread", zh: "红蓝增益差" },
      low: { en: "Cooler or under-corrected", zh: "偏冷或校正不足" },
      high: { en: "Warmer or over-corrected", zh: "偏暖或校正过度" }
    }
  },
  ccm: {
    title: { en: "3x3 color correction matrix", zh: "3x3 颜色校正矩阵" },
    formula: "[R' G' B']^T = M * [R G B]^T",
    plain: {
      en: "A CCM mixes the three camera channels into display-oriented channels. Unlike saturation, a matrix can move hues relative to one another. It is the color dictionary between camera RGB and a target color space.",
      zh: "CCM 会把相机的三个通道混合成面向显示的三个通道。和饱和度不同，矩阵可以改变颜色之间的色相关系。它是相机 RGB 和目标色彩空间之间的颜色词典。"
    },
    variables: [
      { name: "M", en: "3x3 color transform matrix", zh: "3x3 颜色变换矩阵" },
      { name: "RGB", en: "camera RGB before correction", zh: "校正前的相机 RGB" },
      { name: "R'G'B'", en: "corrected display-oriented RGB", zh: "校正后的显示 RGB" }
    ],
    interaction: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.45,
      label: { en: "Channel mixing", zh: "通道混合强度" },
      low: { en: "Camera-like color", zh: "更接近相机原色" },
      high: { en: "Stronger color translation", zh: "颜色翻译更强" }
    }
  },
  denoise: {
    title: { en: "Weighted smoothing", zh: "加权平滑" },
    formula: "I' = (1-alpha)*I + alpha*blur(I)",
    plain: {
      en: "This simplified formula shows the tradeoff. α decides how much blurred information is mixed back into the image. More α reduces random speckles, but it also risks flattening real texture and small edges.",
      zh: "这个简化公式展示了取舍。α 决定把多少模糊后的信息混回图像。α 越大，随机噪点越少，但真实纹理和细小边缘也更容易被抹平。"
    },
    variables: [
      { name: "α", en: "denoise strength", zh: "降噪强度" },
      { name: "I", en: "current RGB image", zh: "当前 RGB 图像" },
      { name: "blur(I)", en: "local smoothed estimate", zh: "局部平滑估计" }
    ],
    interaction: {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.28,
      label: { en: "Smoothing amount", zh: "平滑量" },
      low: { en: "More noise remains", zh: "保留更多噪声" },
      high: { en: "Texture may melt", zh: "纹理可能融化" }
    }
  },
  sharpen: {
    title: { en: "Unsharp mask", zh: "反遮罩锐化" },
    formula: "I' = I + s*(I - blur(I))",
    plain: {
      en: "I - blur(I) extracts local edge detail. The sharpen amount s adds that detail back. Moderate s makes edges crisp; too much s boosts noise and creates halos around high-contrast boundaries.",
      zh: "I - blur(I) 会提取局部边缘细节。锐化强度 s 会把这些细节加回图像。适量 s 让边缘清晰；过量 s 会增强噪声，并在高对比边界周围产生光晕。"
    },
    variables: [
      { name: "s", en: "sharpen amount", zh: "锐化强度" },
      { name: "I - blur(I)", en: "high-frequency edge detail", zh: "高频边缘细节" },
      { name: "halo", en: "bright/dark outline artifact", zh: "亮边或暗边伪影" }
    ],
    interaction: {
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.35,
      label: { en: "Edge boost", zh: "边缘增强" },
      low: { en: "Soft edges", zh: "边缘偏软" },
      high: { en: "Halo risk", zh: "有光晕风险" }
    }
  },
  tone: {
    title: { en: "Tone and gamma mapping", zh: "色调与 Gamma 映射" },
    formula: "RGBout = clamp((EV*RGB)^contrast)^(1/gamma)",
    plain: {
      en: "This simplified display formula combines exposure, contrast, and gamma. Exposure moves brightness, contrast stretches tonal distance, and gamma bends linear sensor-like values into a display-friendly curve.",
      zh: "这个简化显示公式把曝光、对比度和 Gamma 放在一起理解。曝光移动整体亮度，对比度拉开明暗距离，Gamma 把接近线性的传感器值弯曲成适合显示的曲线。"
    },
    variables: [
      { name: "EV", en: "exposure multiplier", zh: "曝光倍率" },
      { name: "contrast", en: "tone stretch", zh: "影调拉伸" },
      { name: "γ", en: "gamma curve", zh: "Gamma 曲线" }
    ],
    interaction: {
      min: 1,
      max: 3,
      step: 0.01,
      value: 2.2,
      label: { en: "Gamma", zh: "Gamma" },
      low: { en: "Flatter display curve", zh: "显示曲线更平" },
      high: { en: "Lifted midtones", zh: "中间调被抬起" }
    }
  }
};

function localize(value, language) {
  if (value && typeof value === "object") {
    return value[language] ?? value.en ?? "";
  }
  return value ?? "";
}

export function getFormulaContent(stageKey, language = "en") {
  const entry = formulaContent[stageKey] ?? formulaContent.raw;
  return {
    ...entry,
    title: localize(entry.title, language),
    plain: localize(entry.plain, language),
    variables: entry.variables.map((item) => ({
      name: item.name,
      text: localize(item, language)
    })),
    interaction: {
      ...entry.interaction,
      label: localize(entry.interaction.label, language),
      low: localize(entry.interaction.low, language),
      high: localize(entry.interaction.high, language)
    }
  };
}

export const FORMULA_STAGE_KEYS = Object.keys(formulaContent);

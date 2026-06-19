const rawDemoCases = [
  {
    id: "color-chart",
    scene: "colorChart",
    title: { en: "Color chart", zh: "色卡" },
    focus: { en: "WB + CCM", zh: "白平衡 + 颜色矩阵" },
    thumbnail: "./assets/demos/color-chart.png",
    description: {
      en: "Use this to learn demosaic, white balance, color matrix, and saturation.",
      zh: "用于学习 Demosaic、白平衡、颜色矩阵和饱和度。"
    }
  },
  {
    id: "low-light",
    scene: "lowLight",
    title: { en: "Low light", zh: "低光" },
    focus: { en: "BLC + Denoise", zh: "黑电平 + 降噪" },
    thumbnail: "./assets/demos/low-light.png",
    description: {
      en: "Use this to learn black level, exposure, denoise, and gamma.",
      zh: "用于学习黑电平、曝光、降噪和 Gamma。"
    }
  },
  {
    id: "vignette",
    scene: "vignette",
    title: { en: "Vignette", zh: "暗角" },
    focus: { en: "LSC", zh: "镜头阴影校正" },
    thumbnail: "./assets/demos/vignette.png",
    description: {
      en: "Use this to learn lens-shading correction and corner brightness.",
      zh: "用于学习镜头阴影校正和四角亮度补偿。"
    }
  },
  {
    id: "bad-pixels",
    scene: "badPixels",
    title: { en: "Bad pixels", zh: "坏点" },
    focus: { en: "BPC", zh: "坏点校正" },
    thumbnail: "./assets/demos/bad-pixels.png",
    description: {
      en: "Use this to learn hot-pixel and dead-pixel cleanup.",
      zh: "用于学习热像素和死点清理。"
    }
  },
  {
    id: "grayscale-ramp",
    scene: "grayscale",
    title: { en: "Grayscale ramp", zh: "灰阶" },
    focus: { en: "Tone", zh: "色调" },
    thumbnail: "./assets/demos/grayscale-ramp.png",
    description: {
      en: "Use this to learn neutrality, gamma, clipping, and tonal steps.",
      zh: "用于学习中性灰、Gamma、裁剪和影调层次。"
    }
  },
  {
    id: "high-contrast",
    scene: "highContrast",
    title: { en: "High contrast", zh: "高对比" },
    focus: { en: "Exposure", zh: "曝光" },
    thumbnail: "./assets/demos/high-contrast.png",
    description: {
      en: "Use this to learn highlight clipping, contrast, and display mapping.",
      zh: "用于学习高光裁剪、对比度和显示映射。"
    }
  },
  {
    id: "portrait-skin",
    scene: "portraitSkin",
    title: { en: "Portrait skin", zh: "人像肤色" },
    focus: { en: "Skin tone", zh: "肤色" },
    thumbnail: "./assets/demos/portrait-skin.svg",
    description: {
      en: "Use this to learn WB, CCM, saturation, and skin-tone rendering.",
      zh: "用于学习白平衡、颜色矩阵、饱和度和肤色呈现。"
    }
  },
  {
    id: "night-street",
    scene: "nightStreet",
    title: { en: "Night street", zh: "夜景街灯" },
    focus: { en: "Night IQ", zh: "夜景画质" },
    thumbnail: "./assets/demos/night-street.svg",
    description: {
      en: "Use this to learn low-light exposure, denoise, color cast, and tone mapping.",
      zh: "用于学习暗光曝光、降噪、偏色和色调映射。"
    }
  },
  {
    id: "backlit-window",
    scene: "backlitWindow",
    title: { en: "Backlit window", zh: "逆光窗户" },
    focus: { en: "Dynamic range", zh: "动态范围" },
    thumbnail: "./assets/demos/backlit-window.svg",
    description: {
      en: "Use this to learn clipping, shadow readability, and contrast tradeoffs.",
      zh: "用于学习高光裁剪、暗部可读性和对比度取舍。"
    }
  }
];

function localize(value, language) {
  if (value && typeof value === "object") {
    return value[language] ?? value.en ?? "";
  }
  return value ?? "";
}

export function getDemoCases(language = "en") {
  return rawDemoCases.map((demo) => ({
    ...demo,
    title: localize(demo.title, language),
    focus: localize(demo.focus, language),
    description: localize(demo.description, language)
  }));
}

export const DEMO_CASES = getDemoCases("en");

export function demoCaseForScene(scene, language = "en") {
  return getDemoCases(language).find((demo) => demo.scene === scene) ?? getDemoCases(language)[0];
}

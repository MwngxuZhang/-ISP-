const labs = [
  {
    id: "autofocus",
    family: "autofocus",
    accent: "#176b87",
    title: {
      en: "Autofocus And Lens Control",
      zh: "自动对焦与镜头控制"
    },
    caseTitle: {
      en: "Portrait focus pull",
      zh: "人像拉焦案例"
    },
    device: {
      en: "Phone camera, mirrorless camera, cinema lens, microscope",
      zh: "手机摄像头、微单相机、电影镜头、显微成像"
    },
    why: {
      en: "The lens must move to the focal plane where useful subject detail is sharp. Low texture, low light, motion, and video smoothness make autofocus a control problem, not only an image filter.",
      zh: "镜头必须移动到主体细节最清晰的焦平面。低纹理、低光、运动目标和视频平滑性会让自动对焦变成控制问题，而不只是图像滤波。"
    },
    formula: "focusScore = Var(Laplacian(Y)); bestFocus = argmax(score(position))",
    code: "for each lensPosition: blur image by defocus model -> compute Laplacian variance -> choose the peak -> smooth lens motion",
    controlLabel: { en: "Lens position", zh: "镜头位置" },
    min: 0,
    max: 100,
    value: 58,
    unit: "%",
    lowLabel: { en: "front focus", zh: "前焦" },
    highLabel: { en: "back focus", zh: "后焦" },
    metricLabel: { en: "Sharpness score", zh: "清晰度评分" },
    explanation: {
      en: "The score rises when edges become crisp and falls when the lens moves away from the subject. A production camera adds phase detection, face/eye priority, motor limits, and anti-hunting smoothing.",
      zh: "当边缘变清晰时评分上升，镜头离开主体焦平面时评分下降。生产级相机会继续加入相位检测、人眼/人脸优先、马达限制和防拉风箱平滑。"
    },
    tasks: {
      en: ["Find the score peak", "Compare low-texture failure", "Smooth focus for video"],
      zh: ["找到清晰度峰值", "比较低纹理失败案例", "为视频加入平滑对焦"]
    },
    robot: {
      en: "Pixel tip: drag the lens position slowly. When the face edges and focus score peak together, the lens has found the subject plane.",
      zh: "Pixel 提示：慢慢拖动镜头位置。当人脸边缘和清晰度评分一起到达峰值时，镜头就找到了主体焦平面。"
    }
  },
  {
    id: "autofocusMacro",
    family: "autofocus",
    accent: "#176b87",
    title: {
      en: "Autofocus And Lens Control",
      zh: "自动对焦与镜头控制"
    },
    caseTitle: {
      en: "Macro texture focus",
      zh: "微距纹理对焦案例"
    },
    device: {
      en: "Macro phone camera, product photography, microscope preview",
      zh: "手机微距、产品拍摄、显微成像预览"
    },
    why: {
      en: "Macro scenes have very shallow depth of field. A tiny lens movement can move the sharp plane from the front texture to the back texture.",
      zh: "微距场景景深很浅。镜头轻微移动，就可能让清晰平面从前景纹理跳到后景纹理。"
    },
    formula: "focusScore = edgeEnergy(ROI); lensStep = coarseScan -> fineScan",
    code: "select texture ROI -> scan lens positions -> compare edge energy -> slow down near the peak",
    controlLabel: { en: "Macro lens step", zh: "微距镜头步进" },
    min: 0,
    max: 100,
    value: 62,
    unit: "%",
    lowLabel: { en: "front texture", zh: "前景纹理" },
    highLabel: { en: "back texture", zh: "后景纹理" },
    metricLabel: { en: "Texture clarity", zh: "纹理清晰度" },
    explanation: {
      en: "Macro autofocus needs small steps and stable ROI selection because the focus peak is narrow. This is why phones often slow down near close-focus distance.",
      zh: "微距对焦需要更小步进和稳定 ROI，因为清晰峰很窄。这也是手机在近距离对焦时常常会放慢搜索的原因。"
    },
    tasks: {
      en: ["Find the narrow focus peak", "Compare front and back texture", "Reduce hunting"],
      zh: ["找到窄清晰峰", "比较前后纹理", "减少拉风箱"]
    },
    robot: {
      en: "Pixel tip: macro focus is picky. If the slider moves too fast, the sharpest texture is easy to skip.",
      zh: "Pixel 提示：微距对焦很挑剔。滑得太快，很容易越过最清晰的纹理位置。"
    }
  },
  {
    id: "exposure",
    family: "exposure",
    accent: "#b8442f",
    title: {
      en: "Auto Exposure, Brightness, And Contrast",
      zh: "自动曝光、亮度与对比度"
    },
    caseTitle: {
      en: "Backlit window metering",
      zh: "逆光窗口测光案例"
    },
    device: {
      en: "Phone preview, HDR capture, cinema exposure, endoscope lighting",
      zh: "手机取景器、HDR 拍照、电影曝光、内窥镜照明"
    },
    why: {
      en: "Exposure balances brightness, highlight retention, shadow visibility, noise, and motion blur. A good AE system does not only chase average gray; it protects the important parts of the image.",
      zh: "曝光需要同时平衡亮度、高光保留、暗部可见、噪声和运动模糊。好的 AE 系统不是只追平均灰，而是保护画面中重要区域。"
    },
    formula: "gain(t+1) = gain(t) * exp(k * (targetLuma - measuredLuma))",
    code: "measure luma histogram -> detect clipping and shadows -> update exposure gain -> apply tone and contrast curve",
    controlLabel: { en: "Scene brightness", zh: "场景亮度" },
    min: -2,
    max: 2,
    value: 0.15,
    unit: "EV",
    lowLabel: { en: "darker", zh: "更暗" },
    highLabel: { en: "brighter", zh: "更亮" },
    metricLabel: { en: "Highlight safety", zh: "高光安全度" },
    explanation: {
      en: "The histogram should move toward a usable target while clipping stays under control. Phone HDR often solves this with multiple frames instead of a single exposure.",
      zh: "直方图应该向可用目标亮度移动，同时控制高光裁剪。手机 HDR 常用多帧曝光解决这个问题，而不是依赖单帧。"
    },
    tasks: {
      en: ["Protect highlights", "Expose a face region", "Avoid video flicker"],
      zh: ["保护高光", "按人脸区域测光", "避免视频曝光闪烁"]
    },
    robot: {
      en: "Pixel tip: the window wants to clip, while the face wants more light. AE is choosing which part of the story matters most.",
      zh: "Pixel 提示：窗外想过曝，人脸想要更多光。AE 其实是在判断画面故事里谁最重要。"
    }
  },
  {
    id: "exposureNight",
    family: "exposure",
    accent: "#b8442f",
    title: {
      en: "Auto Exposure, Brightness, And Contrast",
      zh: "自动曝光、亮度与对比度"
    },
    caseTitle: {
      en: "Night street exposure",
      zh: "夜景街灯曝光案例"
    },
    device: {
      en: "Phone night mode, action camera night video, surveillance camera",
      zh: "手机夜景、运动相机夜间视频、安防摄像头"
    },
    why: {
      en: "Night scenes force AE to trade shadow visibility against lamp clipping, noise, and motion blur.",
      zh: "夜景会迫使 AE 在暗部可见、灯牌过曝、噪声和运动模糊之间取舍。"
    },
    formula: "target = weightedLuma(shadowROI, highlightROI); gain <= antiBlurLimit",
    code: "measure dark regions and lamps -> cap exposure by motion blur -> lift shadows through tone curve",
    controlLabel: { en: "Night exposure EV", zh: "夜景曝光 EV" },
    min: -2,
    max: 2,
    value: 0.45,
    unit: "EV",
    lowLabel: { en: "dark shadows", zh: "暗部很黑" },
    highLabel: { en: "lamp clipping", zh: "灯牌过曝" },
    metricLabel: { en: "Night balance", zh: "夜景平衡度" },
    explanation: {
      en: "A single frame cannot brighten everything for free. Production night mode often uses multi-frame fusion to reduce noise while preserving highlights.",
      zh: "单帧不能无代价地照亮所有区域。生产级夜景通常用多帧融合来降噪，同时保留高光。"
    },
    tasks: {
      en: ["Keep lamps readable", "Lift shadows", "Explain ISO noise"],
      zh: ["让灯牌可读", "抬起暗部", "解释 ISO 噪声"]
    },
    robot: {
      en: "Pixel tip: if you only increase exposure, lamps turn white. Night mode needs exposure plus multi-frame noise control.",
      zh: "Pixel 提示：如果只加曝光，灯牌会变白。夜景需要曝光和多帧降噪一起工作。"
    }
  },
  {
    id: "color",
    family: "color",
    accent: "#2f855a",
    title: {
      en: "Color System And White Balance",
      zh: "颜色系统与白平衡"
    },
    caseTitle: {
      en: "Mixed light color cast",
      zh: "混合光偏色案例"
    },
    device: {
      en: "AWB, color science, skin tone tuning, display color management",
      zh: "AWB、色彩科学、肤色调校、显示色彩管理"
    },
    why: {
      en: "A camera must separate illuminant color from object color. White balance, tint, CCM, gamut mapping, and memory-color protection decide whether the image feels natural.",
      zh: "相机必须把光源颜色和物体颜色分开。白平衡、Tint、CCM、色域映射和记忆色保护共同决定图像是否自然。"
    },
    formula: "[R' G' B'] = CCM * [R*rGain, G*gGain, B*bGain]",
    code: "estimate illuminant -> apply RGB gains -> multiply CCM -> map to sRGB/P3/HDR target -> protect skin and neutrals",
    controlLabel: { en: "Color temperature", zh: "色温" },
    min: 2500,
    max: 8000,
    value: 5200,
    unit: "K",
    lowLabel: { en: "warm light", zh: "暖光" },
    highLabel: { en: "cool light", zh: "冷光" },
    metricLabel: { en: "Neutral error", zh: "中性灰误差" },
    explanation: {
      en: "Neutral patches should move toward gray, but skin, sky, grass, and product colors may need scene-aware protection. A production system often combines statistics, faces, and learned priors.",
      zh: "中性块应该回到灰色，但肤色、天空、草地和商品色可能需要场景化保护。生产系统通常结合统计、人脸和学习型先验。"
    },
    tasks: {
      en: ["Neutralize gray card", "Protect skin tone", "Compare sRGB and P3"],
      zh: ["校正灰卡", "保护肤色", "比较 sRGB 和 P3"]
    },
    robot: {
      en: "Pixel tip: use the gray patches first. If gray is neutral but skin looks odd, the next problem is color rendering, not only AWB.",
      zh: "Pixel 提示：先看灰阶块。灰色中性但肤色奇怪时，问题就不只是 AWB，而是色彩还原。"
    }
  },
  {
    id: "colorSkin",
    family: "color",
    accent: "#2f855a",
    title: {
      en: "Color System And White Balance",
      zh: "颜色系统与白平衡"
    },
    caseTitle: {
      en: "Portrait skin color",
      zh: "人像肤色案例"
    },
    device: {
      en: "Phone portrait mode, beauty camera, video call camera",
      zh: "手机人像模式、美颜相机、视频通话摄像头"
    },
    why: {
      en: "Skin color is a memory color. A technically neutral white balance can still look unpleasant if skin hue is not protected.",
      zh: "肤色是记忆色。即使白平衡技术上中性，如果肤色色相没有保护，观感也可能不好。"
    },
    formula: "skinOut = mix(CCM(rgb), protectedSkinHue, skinMask)",
    code: "detect skin-like region -> apply WB and CCM -> constrain hue shift -> preserve natural saturation",
    controlLabel: { en: "Skin warmth", zh: "肤色暖度" },
    min: 2500,
    max: 8000,
    value: 4700,
    unit: "K",
    lowLabel: { en: "too warm", zh: "偏暖" },
    highLabel: { en: "too cool", zh: "偏冷" },
    metricLabel: { en: "Skin comfort", zh: "肤色舒适度" },
    explanation: {
      en: "Phone color tuning often treats faces differently from charts. The goal is not only numerical accuracy, but a stable and pleasant portrait color.",
      zh: "手机色彩调校经常会把人脸和色卡区别对待。目标不只是数值准确，还要让人像颜色稳定、舒服。"
    },
    tasks: {
      en: ["Keep gray neutral", "Warm skin gently", "Avoid orange faces"],
      zh: ["保持灰色中性", "轻微提暖肤色", "避免橙脸"]
    },
    robot: {
      en: "Pixel tip: portrait color is delicate. A little warmth helps, but too much turns skin into a mask.",
      zh: "Pixel 提示：人像色彩很细。轻微暖一点会舒服，过头就会变成假面感。"
    }
  },
  {
    id: "video",
    family: "video",
    accent: "#6b46c1",
    title: {
      en: "Video Codec, Denoise, Restoration, And Enhancement",
      zh: "视频编解码、去噪、恢复与增强"
    },
    caseTitle: {
      en: "Low-light moving video",
      zh: "低光运动视频案例"
    },
    device: {
      en: "Phone video, action camera, VR passthrough, streaming pipeline",
      zh: "手机视频、运动相机、VR 透视、流媒体链路"
    },
    why: {
      en: "Video quality depends on time. Codecs remove redundancy, temporal denoise borrows neighboring frames, and restoration must avoid ghosting, delay, and power spikes.",
      zh: "视频画质和时间强相关。编码器会压缩冗余，时域降噪会借用相邻帧，恢复算法还必须避免拖影、延迟和功耗尖峰。"
    },
    formula: "frameOut = mix(current, motionAligned(history), temporalWeight)",
    code: "estimate motion -> align previous frame -> fuse if motion is reliable -> encode preview -> inspect artifacts",
    controlLabel: { en: "Temporal denoise", zh: "时域降噪" },
    min: 0,
    max: 1,
    value: 0.42,
    unit: "",
    lowLabel: { en: "noisy", zh: "噪声多" },
    highLabel: { en: "ghosting risk", zh: "拖影风险" },
    metricLabel: { en: "Noise / ghosting tradeoff", zh: "噪声/拖影权衡" },
    explanation: {
      en: "More temporal weight reduces random noise, but motion regions need protection. Codec bitrate, GOP, and denoise strength interact strongly in real video products.",
      zh: "更高时域权重能减少随机噪声，但运动区域需要保护。真实视频产品里，码率、GOP 和降噪强度会强烈耦合。"
    },
    tasks: {
      en: ["Reduce low-light noise", "Spot ghosting", "Compare codec artifacts"],
      zh: ["降低低光噪声", "识别拖影", "比较编码伪影"]
    },
    robot: {
      en: "Pixel tip: temporal denoise borrows from nearby frames. It is powerful until the subject moves too much.",
      zh: "Pixel 提示：时域降噪会向邻近帧借信息。它很强，但主体运动太大时就会拖影。"
    }
  },
  {
    id: "videoCodec",
    family: "video",
    accent: "#6b46c1",
    title: {
      en: "Video Codec, Denoise, Restoration, And Enhancement",
      zh: "视频编解码、去噪、恢复与增强"
    },
    caseTitle: {
      en: "Codec artifact repair",
      zh: "压缩伪影修复案例"
    },
    device: {
      en: "Short video app, streaming, phone recording, cloud playback",
      zh: "短视频、直播流、手机录像、云端回放"
    },
    why: {
      en: "Low bitrate can create blocking, ringing, and texture loss. Enhancement must repair artifacts without inventing unstable detail.",
      zh: "低码率会带来块效应、振铃和纹理损失。增强算法要修复伪影，又不能生成不稳定假细节。"
    },
    formula: "clean = deblock(encoded) + detailRestore(residual)",
    code: "detect block boundaries -> smooth block edges -> restore high-frequency detail carefully",
    controlLabel: { en: "Deblock strength", zh: "去块强度" },
    min: 0,
    max: 1,
    value: 0.5,
    unit: "",
    lowLabel: { en: "blocks remain", zh: "块效应残留" },
    highLabel: { en: "detail washed", zh: "细节被抹掉" },
    metricLabel: { en: "Artifact repair", zh: "伪影修复度" },
    explanation: {
      en: "Deblocking is a balance: too weak leaves compression artifacts, too strong removes real edges and textures.",
      zh: "去块是平衡：太弱会留下压缩伪影，太强会抹掉真实边缘和纹理。"
    },
    tasks: {
      en: ["Find block edges", "Remove ringing", "Preserve texture"],
      zh: ["找到块边界", "减少振铃", "保留纹理"]
    },
    robot: {
      en: "Pixel tip: codec repair is like ironing a wrinkled photo. Press too hard and the real texture disappears.",
      zh: "Pixel 提示：压缩修复像熨照片褶皱。用力太猛，真实纹理也会被熨没。"
    }
  },
  {
    id: "computational",
    family: "computational",
    accent: "#0f766e",
    title: {
      en: "Computational Photography",
      zh: "计算摄影"
    },
    caseTitle: {
      en: "HDR and matching",
      zh: "HDR 与匹配案例"
    },
    device: {
      en: "Night mode, HDR, panorama, stereo depth, multi-camera fusion",
      zh: "夜景、HDR、全景、双目深度、多摄融合"
    },
    why: {
      en: "Modern cameras use multiple frames, multiple cameras, and geometry. The image is no longer only captured; it is aligned, measured, fused, and reconstructed.",
      zh: "现代相机会使用多帧、多摄和几何关系。图像不只是被拍下来，还会被对齐、测量、融合和重建。"
    },
    formula: "depth = f * baseline / disparity; HDR = sum(w_i * alignedFrame_i) / sum(w_i)",
    code: "detect features -> match points -> estimate homography/depth -> reject outliers -> fuse aligned images",
    controlLabel: { en: "Match confidence", zh: "匹配置信度" },
    min: 0,
    max: 1,
    value: 0.7,
    unit: "",
    lowLabel: { en: "many outliers", zh: "离群点多" },
    highLabel: { en: "stable alignment", zh: "对齐稳定" },
    metricLabel: { en: "Alignment reliability", zh: "对齐可靠性" },
    explanation: {
      en: "HDR, stitching, multi-view measurement, dehaze, deblur, and super-resolution all depend on knowing which pixels can be trusted and aligned.",
      zh: "HDR、拼接、多目测量、去雾、去模糊和超分都依赖一个问题：哪些像素可信，哪些像素能对齐。"
    },
    tasks: {
      en: ["Fuse HDR frames", "Reject wrong matches", "Estimate depth from disparity"],
      zh: ["融合 HDR 帧", "剔除错误匹配", "由视差估计深度"]
    },
    robot: {
      en: "Pixel tip: matching confidence decides which pixels are allowed to merge. Bad matches become ghosting.",
      zh: "Pixel 提示：匹配置信度决定哪些像素能融合。错误匹配会变成重影。"
    }
  },
  {
    id: "computationalPano",
    family: "computational",
    accent: "#0f766e",
    title: {
      en: "Computational Photography",
      zh: "计算摄影"
    },
    caseTitle: {
      en: "Panorama stitching",
      zh: "全景拼接案例"
    },
    device: {
      en: "Panorama mode, document scan, multi-camera alignment",
      zh: "全景模式、文档扫描、多摄对齐"
    },
    why: {
      en: "Stitching needs reliable feature matches and a geometric transform. Wrong matches bend straight lines and create seams.",
      zh: "拼接需要可靠特征匹配和几何变换。错误匹配会让直线弯曲，并产生拼接缝。"
    },
    formula: "x2 ~ H x1; H = RANSAC(matches)",
    code: "find keypoints -> match descriptors -> estimate homography -> blend overlap",
    controlLabel: { en: "RANSAC confidence", zh: "RANSAC 置信度" },
    min: 0,
    max: 1,
    value: 0.76,
    unit: "",
    lowLabel: { en: "bad seam", zh: "拼缝明显" },
    highLabel: { en: "stable stitch", zh: "拼接稳定" },
    metricLabel: { en: "Stitch quality", zh: "拼接质量" },
    explanation: {
      en: "RANSAC rejects outliers before estimating the transform. The better the inlier set, the more stable the panorama.",
      zh: "RANSAC 会在估计变换前剔除离群点。内点集合越可靠，全景越稳定。"
    },
    tasks: {
      en: ["Reject outliers", "Align overlap", "Hide seam"],
      zh: ["剔除离群点", "对齐重叠区域", "隐藏拼接缝"]
    },
    robot: {
      en: "Pixel tip: panorama is geometry first, beauty second. If geometry is wrong, blending cannot save it.",
      zh: "Pixel 提示：全景先看几何，再看美化。几何错了，融合也救不回来。"
    }
  },
  {
    id: "ai",
    family: "ai",
    accent: "#be185d",
    title: {
      en: "AI Imaging: Transformer, GAN, Diffusion, And AIGC",
      zh: "AI 图像：Transformer、GAN、Diffusion 与 AIGC"
    },
    caseTitle: {
      en: "AI super-resolution detail",
      zh: "AI 超分细节案例"
    },
    device: {
      en: "AI enhancement, super-resolution, deblur, dehaze, restoration, creative imaging",
      zh: "AI 增强、超分、去模糊、去雾、恢复、创意成像"
    },
    why: {
      en: "AI models can recover details and improve perception, but they may also hallucinate plausible texture. A learning tool should show both the power and the trust boundary.",
      zh: "AI 模型能恢复细节并改善观感，但也可能生成看似合理的假纹理。学习工具应该同时展示能力和可信边界。"
    },
    formula: "output = model(noisyOrLowResImage, condition); loss = L1 + perceptual + adversarial",
    code: "take a low-resolution crop -> upscale by 2x/3x/4x -> reconstruct edges and texture -> compare true detail with hallucinated detail",
    controlLabel: { en: "Super-resolution scale", zh: "超分倍率" },
    min: 1,
    max: 4,
    value: 3,
    unit: "x",
    lowLabel: { en: "1x blurry input", zh: "1x 模糊输入" },
    highLabel: { en: "4x reconstructed", zh: "4x 重建输出" },
    metricLabel: { en: "Reconstructed clarity", zh: "重建清晰度" },
    explanation: {
      en: "Super-resolution takes a small blurry input and predicts a larger, sharper output. Larger scale usually looks clearer, but at high scale the model may invent texture that was not measured by the sensor.",
      zh: "超分辨率会把一张小而模糊的输入图重建成更大、更清晰的输出。倍率越大通常越清晰，但高倍率也更容易生成传感器没有真正测到的纹理。"
    },
    tasks: {
      en: ["Compare traditional SR and AI SR", "Mark fake detail", "Explain model failure"],
      zh: ["比较传统超分和 AI 超分", "标出假细节", "解释模型失败"]
    },
    robot: {
      en: "Pixel tip: 2x and 4x SR should visibly sharpen the grid and edges. Clearer does not always mean more truthful, so watch the fake-detail warning.",
      zh: "Pixel 提示：2x 和 4x 超分应该明显让网格和边缘变清楚。但更清楚不一定更真实，要留意假细节风险。"
    }
  },
  {
    id: "aiDehaze",
    family: "ai",
    accent: "#be185d",
    title: {
      en: "AI Imaging: Transformer, GAN, Diffusion, And AIGC",
      zh: "AI 图像：Transformer、GAN、Diffusion 与 AIGC"
    },
    caseTitle: {
      en: "AI dehaze and recovery",
      zh: "AI 去雾恢复案例"
    },
    device: {
      en: "Outdoor phone camera, dash camera, drone camera, surveillance",
      zh: "户外手机相机、行车记录仪、无人机相机、安防"
    },
    why: {
      en: "Haze reduces contrast and color saturation. AI can estimate structure, but it may also over-restore distant regions.",
      zh: "雾会降低对比度和饱和度。AI 能估计结构，但也可能对远处区域过度恢复。"
    },
    formula: "I(x)=J(x)t(x)+A(1-t(x)); AI estimates J and t",
    code: "estimate haze density -> recover contrast -> constrain color shift -> mark uncertain distant detail",
    controlLabel: { en: "Dehaze strength", zh: "去雾强度" },
    min: 0,
    max: 1,
    value: 0.48,
    unit: "",
    lowLabel: { en: "hazy", zh: "雾感明显" },
    highLabel: { en: "over-restored", zh: "过度恢复" },
    metricLabel: { en: "Recovery trust", zh: "恢复可信度" },
    explanation: {
      en: "Dehaze should improve contrast while respecting uncertainty. Distant textures are especially easy for AI to hallucinate.",
      zh: "去雾应该提升对比度，同时尊重不确定性。远处纹理尤其容易被 AI 生成出假细节。"
    },
    tasks: {
      en: ["Recover contrast", "Avoid color shift", "Flag uncertain detail"],
      zh: ["恢复对比度", "避免偏色", "标记不确定细节"]
    },
    robot: {
      en: "Pixel tip: a clean mountain is not always a true mountain. Dehaze needs a trust boundary.",
      zh: "Pixel 提示：干净的远山不一定是真实远山。去雾需要可信边界。"
    }
  }
];

const scenarios = [
  {
    id: "camera",
    title: { en: "Photography Camera", zh: "相机摄影" },
    focus: { en: "RAW latitude, lens optics, depth of field, manual exposure, post-production color.", zh: "RAW 宽容度、镜头光学、景深、手动曝光、后期色彩空间。" },
    demo: { en: "Macro focus + color chart calibration", zh: "微距对焦 + 色卡校准" },
    pipeline: { en: "Lens focus scan -> RAW capture -> BLC/LSC -> demosaic -> AWB/CCM -> tone and export.", zh: "镜头对焦扫描 -> RAW 采集 -> 黑电平/暗角校正 -> Demosaic -> 白平衡/CCM -> Tone 输出。" },
    control: { en: "Drag macro lens step and compare front texture, back texture, and color chart neutrality.", zh: "拖动微距镜头步进，比较前景纹理、后景纹理和色卡中性灰。" },
    labId: "autofocusMacro",
    thumbnail: "./assets/scenarios/camera-photography.png"
  },
  {
    id: "phone",
    title: { en: "Phone Photography", zh: "手机摄影" },
    focus: { en: "Small sensors, multi-camera fusion, HDR, night mode, portrait blur, real-time preview.", zh: "小传感器、多摄融合、HDR、夜景、人像虚化、实时取景。" },
    demo: { en: "Backlit portrait HDR and skin color", zh: "逆光人像 HDR 与肤色" },
    pipeline: { en: "Preview metering -> face/subject priority -> multi-frame HDR -> AWB/skin protection -> local tone.", zh: "取景测光 -> 人脸/主体优先 -> 多帧 HDR -> 白平衡/肤色保护 -> 局部 Tone。" },
    control: { en: "Adjust exposure EV and watch the face, window highlights, histogram, and clipping warning together.", zh: "调节曝光 EV，同时观察人脸、窗外高光、直方图和过曝风险。" },
    labId: "exposure",
    thumbnail: "./assets/scenarios/phone-photography.png"
  },
  {
    id: "cinema",
    title: { en: "Cinema Camera", zh: "电影机" },
    focus: { en: "Dynamic range, Log curve, LUT, shutter angle, color management, stable exposure.", zh: "动态范围、Log 曲线、LUT、快门角、色彩管理、稳定曝光。" },
    demo: { en: "Highlight-preserving exposure and color tone", zh: "保高光曝光与色彩风格" },
    pipeline: { en: "Manual/assisted exposure -> highlight protection -> Log-like tone -> LUT/color decision -> display check.", zh: "手动/辅助曝光 -> 高光保护 -> 类 Log 曲线 -> LUT/色彩决策 -> 显示检查。" },
    control: { en: "Move night exposure and compare readable lamps, shadow detail, and cinema-style contrast.", zh: "拖动夜景曝光，比较灯牌可读性、暗部细节和电影感对比。" },
    labId: "exposureNight",
    thumbnail: "./assets/scenarios/cinema-camera.png"
  },
  {
    id: "vr",
    title: { en: "VR Headset", zh: "VR 眼镜" },
    focus: { en: "Low latency, stereo consistency, distortion correction, chromatic correction, display compensation.", zh: "低延迟、双目一致性、畸变校正、色差校正、显示补偿。" },
    demo: { en: "Stereo matching and alignment reliability", zh: "双目匹配与对齐可靠性" },
    pipeline: { en: "Left/right capture -> exposure/color sync -> feature matching -> geometry warp -> display compensation.", zh: "左右眼采集 -> 曝光/颜色同步 -> 特征匹配 -> 几何变换 -> 显示补偿。" },
    control: { en: "Adjust match confidence and inspect whether left/right structures align without ghosting.", zh: "调节匹配置信度，检查左右眼结构是否对齐、有无重影。" },
    labId: "computational",
    thumbnail: "./assets/scenarios/vr-headset.png"
  },
  {
    id: "medical",
    title: { en: "Medical Imaging", zh: "医疗成像设备" },
    focus: { en: "SNR, structure enhancement, pseudo color, contrast, stability. Education only, not diagnosis.", zh: "信噪比、结构增强、伪彩、对比度、稳定性。仅用于学习，不用于诊断。" },
    demo: { en: "Structure enhancement and denoise caution", zh: "结构增强与谨慎降噪" },
    pipeline: { en: "Sensor signal -> gain/noise control -> structure enhancement -> pseudo color or grayscale display -> quality flag.", zh: "传感器信号 -> 增益/噪声控制 -> 结构增强 -> 伪彩或灰阶显示 -> 质量标记。" },
    control: { en: "Move temporal denoise and observe SNR improvement versus texture/edge loss.", zh: "拖动时域降噪，观察信噪比提升与纹理/边缘损失。" },
    labId: "video",
    thumbnail: "./assets/scenarios/medical-imaging.png"
  },
  {
    id: "display",
    title: { en: "Display Output", zh: "屏幕显示效果" },
    focus: { en: "Gamma, EOTF, gamut, HDR tone mapping, brightness limits, ambient adaptation.", zh: "Gamma、EOTF、色域、HDR tone mapping、亮度限制、环境光适配。" },
    demo: { en: "sRGB/P3 color and tone appearance", zh: "sRGB/P3 色彩与 Tone 观感" },
    pipeline: { en: "Scene-referred RGB -> tone mapping -> gamut mapping -> gamma/EOTF -> panel and ambient adaptation.", zh: "场景线性 RGB -> Tone Mapping -> 色域映射 -> Gamma/EOTF -> 屏幕与环境光适配。" },
    control: { en: "Move color temperature and compare gray neutrality, skin comfort, and display color cast.", zh: "拖动色温，比较灰阶中性、肤色舒适度和屏幕偏色。" },
    labId: "color",
    thumbnail: "./assets/scenarios/display-output.png"
  }
];

const labels = {
  en: {
    eyebrow: "Advanced imaging system",
    title: "Beyond RAW ISP: learn the whole camera pipeline",
    intro: "These labs extend the current ISP demo into autofocus, exposure, color, video, computational photography, AI imaging, and device-specific imaging tradeoffs.",
    caseHeading: "Choose an advanced imaging case",
    before: "Input / before",
    after: "Adjusted / after",
    observe: "What to observe",
    failure: "Common failure",
    why: "Why it exists",
    device: "Where it appears",
    formula: "Core formula",
    code: "Code idea",
    metric: "Live metric",
    tasks: "Guided tasks",
    reset: "Reset lab",
    docs: "Read technical route",
    scenarios: "Device scenario case map",
    openScenario: "Open case"
  },
  zh: {
    eyebrow: "高级成像系统",
    title: "不止 RAW ISP：学习完整相机成像链路",
    intro: "这些实验室把当前 ISP Demo 扩展到自动对焦、自动曝光、颜色系统、视频处理、计算摄影、AI 图像和不同设备的成像取舍。",
    caseHeading: "选择一个高级成像案例",
    before: "输入 / 调整前",
    after: "调整后 / 输出",
    observe: "观察什么",
    failure: "常见失败",
    why: "为什么需要",
    device: "出现在哪些设备",
    formula: "核心公式",
    code: "代码思路",
    metric: "实时指标",
    tasks: "引导任务",
    reset: "复位模块",
    docs: "阅读技术路线",
    scenarios: "设备场景案例地图",
    openScenario: "打开案例"
  }
};

export function getAdvancedImagingContent(language = "en") {
  const key = language === "zh" ? "zh" : "en";
  return {
    labels: labels[key],
    labs: labs.map((lab) => localizeLab(lab, key)),
    scenarios: scenarios.map((scenario) => ({
      id: scenario.id,
      title: scenario.title[key],
      focus: scenario.focus[key],
      demo: scenario.demo[key],
      pipeline: scenario.pipeline[key],
      control: scenario.control[key],
      labId: scenario.labId,
      thumbnail: scenario.thumbnail
    }))
  };
}

function localizeLab(lab, language) {
  return {
    ...lab,
    title: lab.title[language],
    caseTitle: lab.caseTitle[language],
    device: lab.device[language],
    why: lab.why[language],
    controlLabel: lab.controlLabel[language],
    lowLabel: lab.lowLabel[language],
    highLabel: lab.highLabel[language],
    metricLabel: lab.metricLabel[language],
    explanation: lab.explanation[language],
    tasks: lab.tasks[language],
    robot: lab.robot[language]
  };
}

export function evaluateAdvancedLab(lab, rawValue = lab.value) {
  const family = lab.family ?? lab.id;
  const span = lab.max - lab.min || 1;
  const normalized = Math.max(0, Math.min(1, (Number(rawValue) - lab.min) / span));
  const focusCurve = 1 - Math.min(1, Math.abs(normalized - 0.58) / 0.58);
  const values = {
    autofocus: Math.max(0.05, Math.pow(focusCurve, 1.8)),
    exposure: Math.max(0, 1 - Math.abs(normalized - 0.55) * 1.7),
    color: Math.max(0, 1 - Math.abs(normalized - 0.48) * 1.45),
    video: Math.max(0, 1 - Math.abs(normalized - 0.44) * 1.2),
    computational: Math.max(0.08, normalized),
    ai: Math.max(0.12, normalized)
  };
  const score = values[family] ?? normalized;
  const risk = riskForLab(family, normalized);
  return {
    normalized,
    score,
    risk,
    percent: Math.round(score * 100)
  };
}

function riskForLab(id, normalized) {
  if (id === "autofocus") return Math.abs(normalized - 0.58) > 0.28 ? "focus miss" : "stable focus";
  if (id === "exposure") return normalized > 0.78 ? "highlight clipping" : normalized < 0.2 ? "shadow noise" : "balanced";
  if (id === "color") return normalized < 0.28 ? "warm cast" : normalized > 0.78 ? "cool cast" : "neutral";
  if (id === "video") return normalized > 0.68 ? "ghosting risk" : normalized < 0.18 ? "noise remains" : "balanced";
  if (id === "computational") return normalized < 0.35 ? "outlier risk" : "alignment stable";
  if (id === "ai") return normalized > 0.72 ? "clear but check fake detail" : normalized < 0.25 ? "low scale / still soft" : "clearer reconstruction";
  return "balanced";
}

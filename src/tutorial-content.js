const enLabels = {
  heading: "Pixel, your ISP guide",
  intro: "Follow the stages from RAW to RGB. Click a stage, tune one control, and I will point at what changed.",
  previous: "Previous",
  next: "Next",
  applyTip: "Apply tip",
  plainLabel: "What it does",
  whyLabel: "Why it exists",
  analogyLabel: "Picture it",
  watchLabel: "Watch for",
  tryLabel: "Try this",
  controlLabel: "Control to touch",
  expectedLabel: "Expected result",
  mistakeLabel: "Common beginner trap",
  checkpointLabel: "Checkpoint",
  gotIt: "I got it",
  understood: "Understood",
  restart: "Restart tour",
  progressSuffix: "checkpoints",
  stepPrefix: "Step",
  reactions: {
    stage: "I am leaning toward this stage now. Watch the preview first, then the histogram.",
    demo: "Good pick. I loaded a tested RAW scene, so we can run the whole sensor-to-RGB trip safely.",
    tip: "I changed one beginner-safe setting. Treat it like a small lab experiment and compare before versus after.",
    gotIt: "Checkpoint saved. That idea now belongs to you.",
    restart: "Tour reset. We are back at the sensor data, square one.",
    hover: "Tap a stage or a control. I will move there and explain the image-engineering reason."
  }
};

const zhLabels = {
  heading: "Pixel，你的 ISP 向导",
  intro: "跟着我从 RAW 走到 RGB。点阶段、调一个控件，我会指出图像哪里变了。",
  previous: "上一步",
  next: "下一步",
  applyTip: "应用建议",
  plainLabel: "它在做什么",
  whyLabel: "为什么需要它",
  analogyLabel: "形象理解",
  watchLabel: "观察重点",
  tryLabel: "试一试",
  controlLabel: "该调哪个控件",
  expectedLabel: "预期结果",
  mistakeLabel: "新手常见坑",
  checkpointLabel: "学习检查点",
  gotIt: "我懂了",
  understood: "已理解",
  restart: "重新开始",
  progressSuffix: "个检查点",
  stepPrefix: "第",
  reactions: {
    stage: "我已经转向这个阶段了。先看预览，再看直方图。",
    demo: "选得好。这是一张已测试 RAW 场景，可以安全跑完整传感器到 RGB 的流程。",
    tip: "我只改了一个适合新手的参数。把它当成小实验，对比改前和改后。",
    gotIt: "检查点已保存。这个概念现在归你了。",
    restart: "学习流程已重置。我们回到最开始的传感器数据。",
    hover: "点一个阶段或控件，我会移动过去并解释背后的图像工程原因。"
  }
};

const rawSteps = [
  {
    key: "raw",
    title: { en: "01 RAW Mosaic", zh: "01 RAW 马赛克" },
    plain: { en: "This is the sensor's original Bayer mosaic. Every photosite records only one color sample, so the picture is still a coded sensor pattern.", zh: "这是传感器原始 Bayer 马赛克。每个感光点只记录一个颜色采样，所以它还只是被编码过的传感器图案。" },
    why: { en: "A camera sensor needs a color filter array to measure color, but that means the first image is incomplete RGB.", zh: "相机传感器靠彩色滤光阵列测颜色，因此最开始得到的图像并不是完整 RGB。" },
    analogy: { en: "Think of RAW as a box of colored puzzle tiles. The photo exists inside it, but the puzzle has not been assembled yet.", zh: "把 RAW 想成一盒彩色拼图。照片已经藏在里面，但拼图还没有拼起来。" },
    watch: { en: "Look for the red, green, and blue checker pattern before color reconstruction.", zh: "观察颜色重建前红、绿、蓝交错排列的采样纹理。" },
    try: { en: "Load Color chart, click RAW, and compare it with Demosaic.", zh: "加载色卡，点击 RAW，再和 Demosaic 阶段对比。" },
    control: { en: "Demo image gallery or Built-in case", zh: "演示图库或内置案例" },
    expected: { en: "You should see a colored checker-like sensor mosaic, not a clean photo yet.", zh: "你会看到类似彩色棋盘的传感器采样，而不是干净照片。" },
    mistake: { en: "Do not judge image quality from RAW appearance alone. RAW is material, not the finished image.", zh: "不要只凭 RAW 外观判断画质。RAW 是原材料，不是最终图像。" },
    checkpoint: { en: "I can explain why Bayer RAW is not full RGB.", zh: "我能解释为什么 Bayer RAW 不是完整 RGB。" },
    bubble: { en: "RAW is the sensor's color puzzle. I will help assemble it into a photo.", zh: "RAW 是传感器留下的颜色拼图。我会带你把它拼成照片。" },
    tapBubble: { en: "See the checker texture? That is the sensor saying: one pixel, one color sample.", zh: "看到棋盘纹理了吗？这是传感器在说：一个像素先只有一种颜色采样。" },
    tipBubble: { en: "I loaded the color chart so the color puzzle is easy to inspect from start to finish.", zh: "我加载了色卡，这样从原始拼图到最终颜色都更容易观察。" },
    doneBubble: { en: "Great. You now know why RAW needs an ISP instead of going straight to display.", zh: "很好。你已经知道 RAW 为什么不能直接显示，而是需要 ISP。" },
    anchor: '[data-stage="raw"]'
  },
  {
    key: "norm",
    title: { en: "02 Black Level", zh: "02 黑电平" },
    plain: { en: "Black-level correction subtracts the sensor's electrical offset and normalizes values into a useful working range.", zh: "黑电平校正会减去传感器的电路偏置，并把数值归一化到可处理范围。" },
    why: { en: "Real sensors do not output perfect zero in darkness. If the floor is wrong, every later stage builds on a tilted base.", zh: "真实传感器在全黑时也不会输出完美 0。地基错了，后面每一步都会跟着歪。" },
    analogy: { en: "It is like setting the ruler's zero mark before measuring. A wrong zero makes every measurement misleading.", zh: "它像是在测量前先校准尺子的 0 刻度。0 点错了，后面的读数都会误导你。" },
    watch: { en: "The histogram should move toward a cleaner zero without crushing shadow texture.", zh: "直方图应靠近干净的 0 点，但暗部纹理不能被压死。" },
    try: { en: "Change Black level slowly and watch dark patches plus the histogram start point.", zh: "慢慢调整黑电平，同时观察暗部和直方图起点。" },
    control: { en: "Black level", zh: "黑电平" },
    expected: { en: "Gray haze drops, shadows look cleaner, and useful dark detail remains.", zh: "灰雾减少，暗部更干净，同时保留有用暗部细节。" },
    mistake: { en: "Too much subtraction clips shadow detail and makes the image look artificially harsh.", zh: "减太多会裁掉暗部细节，让图像变得生硬。" },
    checkpoint: { en: "I can read the histogram shift caused by black-level correction.", zh: "我能读懂黑电平校正造成的直方图移动。" },
    bubble: { en: "First I sweep the sensor's dark offset off the floor. Now the image has a true starting line.", zh: "我先把传感器的暗电流偏置扫掉，让图像有真正的起跑线。" },
    tapBubble: { en: "Watch the left edge of the histogram. That is where black-level mistakes reveal themselves.", zh: "盯住直方图左边缘。黑电平错误通常会在那里露馅。" },
    tipBubble: { en: "I nudged black level toward the sample metadata. The shadows should look less foggy.", zh: "我把黑电平拉向样例元数据。暗部应该少一点灰雾。" },
    doneBubble: { en: "Nice. You calibrated the image floor before touching color.", zh: "不错。你已经在处理颜色前校准了图像地基。" },
    anchor: "#blackInput"
  },
  {
    key: "bad",
    title: { en: "03 Bad Pixel Correction", zh: "03 坏点校正" },
    plain: { en: "Bad-pixel correction detects abnormal sensor points and replaces them with nearby evidence.", zh: "坏点校正会检测异常感光点，并用周围像素的信息替换它们。" },
    why: { en: "A single hot pixel can become a colored spark after demosaic, sharpening, and tone mapping.", zh: "一个热像素经过去马赛克、锐化和色调映射后，可能会变成显眼的彩色火花。" },
    analogy: { en: "It is like removing one wrong bead from a necklace before copying the pattern to the whole row.", zh: "它像是在复制整排图案前，先把项链里那颗错珠子拿掉。" },
    watch: { en: "Use the Bad pixels demo and compare isolated speckles before and after BPC.", zh: "使用坏点案例，对比 BPC 前后的孤立亮点和黑点。" },
    try: { en: "Raise and lower Bad pixel threshold; watch when texture starts being mistaken for defects.", zh: "调高或调低坏点阈值，观察真实纹理什么时候被误判为缺陷。" },
    control: { en: "Bad pixel threshold", zh: "坏点阈值" },
    expected: { en: "Speckles disappear while real edges and texture remain intact.", zh: "孤立噪点减少，同时真实边缘和纹理仍然保留。" },
    mistake: { en: "A threshold that is too aggressive cleans the image by deleting real texture.", zh: "阈值过激会用删除真实纹理的方式把图像变干净。" },
    checkpoint: { en: "I can tell the difference between a bad pixel and image texture.", zh: "我能区分坏点和真实图像纹理。" },
    bubble: { en: "Tiny broken pixels are easier to fix before demosaic spreads them into little color sparks.", zh: "坏点最好在去马赛克扩散成彩色火花前处理。" },
    tapBubble: { en: "Those lonely dots are suspects. Real detail usually has neighbors that agree with it.", zh: "那些孤零零的点很可疑。真实细节通常会有邻居和它一起出现。" },
    tipBubble: { en: "I loaded the bad-pixel scene and set a visible threshold so the cleanup is obvious.", zh: "我加载了坏点场景，并设置了容易观察的阈值。" },
    doneBubble: { en: "Good eye. You caught defects before they could travel through the pipeline.", zh: "眼力不错。你在缺陷进入后续流程前抓住了它。" },
    anchor: "#badPixelInput"
  },
  {
    key: "lsc",
    title: { en: "04 Lens Shading", zh: "04 镜头阴影校正" },
    plain: { en: "Lens-shading correction brightens darker corners and balances the frame from center to edge.", zh: "镜头阴影校正会补偿较暗的四角，让画面从中心到边缘更均匀。" },
    why: { en: "Lenses often pass less light to corners. Without correction, the ISP may mistake optics for scene lighting.", zh: "镜头常常让四角进光更少。不校正的话，ISP 可能把镜头问题误当成场景光照。" },
    analogy: { en: "Imagine a desk lamp that is bright in the middle but dim at the corners. LSC evens out the light on the desk.", zh: "想象一盏台灯中间亮、四角暗。LSC 就是在把桌面照明补均匀。" },
    watch: { en: "The Vignette demo makes corner falloff easy to see. Watch corners and noise together.", zh: "暗角案例能明显看到四角衰减。观察四角亮度，也要观察噪声。" },
    try: { en: "Move Lens shading from low to high and stop before corners look brighter than the center.", zh: "把镜头阴影从低调到高，在四角比中心更亮之前停下。" },
    control: { en: "Lens shading", zh: "镜头阴影" },
    expected: { en: "Corners lift toward center brightness without noisy over-correction.", zh: "四角亮度接近中心，但不要出现补偿过头或噪声放大。" },
    mistake: { en: "Over-correction creates glowing corners and amplifies edge noise.", zh: "过度校正会让四角发亮，并放大边缘噪声。" },
    checkpoint: { en: "I can spot lens falloff and tune a correction strength.", zh: "我能识别暗角并调整补偿强度。" },
    bubble: { en: "I am lifting the dim corners, like evening out a spotlight across the whole frame.", zh: "我在抬起偏暗的四角，就像把聚光灯摊平到整张画面。" },
    tapBubble: { en: "Look at the four corners. If they rise too far, the cure becomes a new artifact.", zh: "看四个角。如果抬得太多，修正本身就会变成新伪影。" },
    tipBubble: { en: "I switched to a vignette scene and raised LSC so the corner correction is easy to see.", zh: "我切到暗角场景并提高 LSC，这样四角补偿更明显。" },
    doneBubble: { en: "Great. You can now separate lens falloff from the scene itself.", zh: "很好。你现在能把镜头暗角和场景本身区分开。" },
    anchor: "#lscInput"
  },
  {
    key: "demosaic",
    title: { en: "05 Demosaic", zh: "05 去马赛克" },
    plain: { en: "Demosaic reconstructs full RGB pixels by estimating missing color channels around each Bayer sample.", zh: "去马赛克会根据周围 Bayer 采样，估计每个像素缺失的颜色通道。" },
    why: { en: "Displays need RGB at every pixel, but the sensor only captured one color at each location.", zh: "显示设备需要每个像素都有 RGB，但传感器在每个位置只采到一种颜色。" },
    analogy: { en: "It is like filling missing words in a sentence by reading the surrounding words carefully.", zh: "它像是根据上下文补全一句话里缺失的词。" },
    watch: { en: "Wrong Bayer pattern creates swapped colors, zipper edges, or strange color grids.", zh: "Bayer 排列选错会导致颜色互换、边缘拉链或奇怪的彩色网格。" },
    try: { en: "Switch Bayer pattern intentionally and watch color artifacts appear.", zh: "故意切换 Bayer 排列，观察颜色伪影。" },
    control: { en: "Bayer pattern", zh: "Bayer 排列" },
    expected: { en: "The image becomes a normal RGB preview with fewer checker artifacts.", zh: "图像变成正常 RGB 预览，棋盘采样感明显减少。" },
    mistake: { en: "Wrong CFA metadata can look like a color-science failure even when the algorithm is fine.", zh: "CFA 元数据错了，看起来像色彩科学失败，但算法本身可能没问题。" },
    checkpoint: { en: "I can explain how one-channel sensor samples become RGB pixels.", zh: "我能解释单通道采样如何变成 RGB 像素。" },
    bubble: { en: "Now I assemble the color puzzle: every pixel gets the RGB pieces it was missing.", zh: "现在我开始拼颜色拼图：每个像素都会补齐缺失的 RGB。" },
    tapBubble: { en: "If colors look wildly swapped, suspect Bayer pattern before blaming white balance.", zh: "如果颜色大面积错位，先怀疑 Bayer 排列，再怀疑白平衡。" },
    tipBubble: { en: "I toggled the CFA pattern so you can see how metadata breaks color instantly.", zh: "我切换了 CFA 排列，让你看到元数据如何瞬间破坏颜色。" },
    doneBubble: { en: "Good. You have seen the exact bridge from mosaic data to RGB data.", zh: "很好。你已经看到了马赛克数据通向 RGB 数据的桥。" },
    anchor: "#bayerInput"
  },
  {
    key: "wb",
    title: { en: "06 White Balance", zh: "06 白平衡" },
    plain: { en: "White balance scales color channels so neutral objects look neutral under the current light.", zh: "白平衡会缩放颜色通道，让中性物体在当前光源下仍然保持中性。" },
    why: { en: "Light sources tint the whole image. The ISP needs to learn what should have been gray or white.", zh: "光源会给整张图染色。ISP 需要知道什么本来应该是灰色或白色。" },
    analogy: { en: "It is like telling the camera which sheet of paper is white before judging all other colors.", zh: "它像是先告诉相机哪张纸是白的，再判断其他颜色。" },
    watch: { en: "Gray patches should lose their tint, and RGB means should move closer.", zh: "灰阶块应减少偏色，RGB 均值应更接近。" },
    try: { en: "Use Auto WB, then fine-tune red and blue gains.", zh: "先用自动白平衡，再微调红、蓝增益。" },
    control: { en: "Auto WB and RGB gains", zh: "自动白平衡与 RGB 增益" },
    expected: { en: "Neutrals become neutral without making saturated colors look strange.", zh: "中性色恢复中性，同时饱和色不应变得奇怪。" },
    mistake: { en: "Do not judge white balance only from saturated colors; use neutral areas first.", zh: "不要只看饱和色判断白平衡；先看中性区域。" },
    checkpoint: { en: "I can use neutral areas to judge color cast.", zh: "我能用中性区域判断偏色。" },
    bubble: { en: "White balance asks one simple question: what should be gray in this light?", zh: "白平衡只问一个问题：在这束光下，什么应该是灰色？" },
    tapBubble: { en: "Watch the gray patches. They are the compass for red, green, and blue gains.", zh: "看灰阶块。它们是红绿蓝增益的指南针。" },
    tipBubble: { en: "I ran gray-world WB. If gray patches improve, the estimate is useful.", zh: "我运行了灰世界白平衡。如果灰阶改善，这个估计就是有用的。" },
    doneBubble: { en: "Nice. You can now separate light color from object color.", zh: "不错。你已经能把光源颜色和物体颜色分开看。" },
    anchor: "#autoWbButton"
  },
  {
    key: "ccm",
    title: { en: "07 Color Matrix", zh: "07 颜色矩阵" },
    plain: { en: "The color correction matrix translates camera RGB into display-oriented RGB.", zh: "颜色校正矩阵会把相机 RGB 翻译成面向显示的 RGB。" },
    why: { en: "Camera filters do not match human vision or sRGB primaries exactly, so color needs a mapping step.", zh: "相机滤光片并不完全等同于人眼视觉或 sRGB 三原色，因此颜色需要一次映射。" },
    analogy: { en: "Think of CCM as a dictionary between the camera's color language and the display's color language.", zh: "把 CCM 想成相机颜色语言和显示颜色语言之间的词典。" },
    watch: { en: "On the color chart, hue relationships move together in a structured way.", zh: "在色卡上，不同色块的色相关系会按矩阵结构一起变化。" },
    try: { en: "Switch between CCM presets and compare hue changes with saturation changes.", zh: "切换 CCM 预设，并和饱和度变化对比。" },
    control: { en: "CCM preset", zh: "颜色矩阵预设" },
    expected: { en: "Colors shift as a coordinated transform, not like a simple intensity boost.", zh: "颜色会按协调的变换移动，而不是简单增强强度。" },
    mistake: { en: "Do not use CCM to fix exposure or white-balance mistakes.", zh: "不要用 CCM 去修曝光或白平衡错误。" },
    checkpoint: { en: "I can separate white balance, CCM, and saturation in my mind.", zh: "我能区分白平衡、CCM 和饱和度的作用。" },
    bubble: { en: "The matrix is my color translator: camera color in, display color out.", zh: "矩阵就是我的颜色翻译器：输入相机颜色，输出显示颜色。" },
    tapBubble: { en: "Watch hue relationships, not just whether the image looks more colorful.", zh: "看色相关系，不要只看图像是不是更鲜艳。" },
    tipBubble: { en: "I changed the CCM preset. Notice how hues move differently from saturation.", zh: "我切换了 CCM 预设。注意色相变化和饱和度变化并不一样。" },
    doneBubble: { en: "Excellent. You now know why color science needs a matrix step.", zh: "很好。你现在知道色彩科学为什么需要矩阵这一步。" },
    anchor: "#ccmInput"
  },
  {
    key: "denoise",
    title: { en: "08 Denoise", zh: "08 降噪" },
    plain: { en: "Denoise smooths random variation while trying to keep real edges and texture.", zh: "降噪会平滑随机波动，同时尽量保留真实边缘和纹理。" },
    why: { en: "Low light and high gain make noise visible, and later sharpening can make it worse.", zh: "低照度和高增益会让噪声明显，后面的锐化还可能把它放大。" },
    analogy: { en: "It is like wiping dust from glass without wiping away the printed picture behind it.", zh: "它像是擦掉玻璃上的灰尘，但不能把后面的图案也擦掉。" },
    watch: { en: "Use Low light and look at flat dark areas plus fine edges.", zh: "使用暗光案例，观察平坦暗部和细边缘。" },
    try: { en: "Increase Denoise, then check if edges become soft or waxy.", zh: "提高降噪，再检查边缘是否变软或发蜡。" },
    control: { en: "Denoise", zh: "降噪" },
    expected: { en: "Noise drops in flat areas while important edges remain readable.", zh: "平坦区域噪声降低，重要边缘仍可辨认。" },
    mistake: { en: "Strong denoise can make a clean image by destroying useful texture.", zh: "强降噪能让图像干净，但代价可能是破坏有用纹理。" },
    checkpoint: { en: "I can trade off noise reduction and detail retention.", zh: "我能权衡降噪和细节保留。" },
    bubble: { en: "Denoise is a careful bargain: less sparkle, but keep the real detail alive.", zh: "降噪是一笔谨慎交易：少一点噪点，也要留住真实细节。" },
    tapBubble: { en: "Look at flat dark regions first, then check whether edges survived.", zh: "先看平坦暗部，再检查边缘是否还在。" },
    tipBubble: { en: "I loaded low light and raised denoise so the smoothness/detail tradeoff is visible.", zh: "我加载暗光并提高降噪，让平滑和细节的取舍更明显。" },
    doneBubble: { en: "Good. You can now tune noise without blindly erasing texture.", zh: "很好。你现在能调降噪，而不是盲目抹掉纹理。" },
    anchor: "#denoiseInput"
  },
  {
    key: "sharpen",
    title: { en: "09 Sharpen", zh: "09 锐化" },
    plain: { en: "Sharpen boosts local contrast around edges so detail looks crisper.", zh: "锐化会增强边缘附近的局部对比，让细节看起来更清晰。" },
    why: { en: "Demosaic, denoise, and lenses can soften detail, so the ISP often restores edge contrast near the end.", zh: "去马赛克、降噪和镜头都会让细节变软，所以 ISP 常在后段恢复边缘对比。" },
    analogy: { en: "It is like tracing a pencil sketch with a fine pen. Helpful lines get clearer; too much creates outlines.", zh: "它像是用细笔描铅笔稿。适量会让线条清楚，过量会出现描边。" },
    watch: { en: "Look for crisp edges, but stop when halos or noisy texture become obvious.", zh: "观察边缘是否清晰，但出现光晕或噪声纹理时就要停。" },
    try: { en: "Raise Sharpen gradually and compare edges against flat areas.", zh: "逐步提高锐化，并对比边缘和平坦区域。" },
    control: { en: "Sharpen", zh: "锐化" },
    expected: { en: "Edges become clearer without bright outlines or rough noise.", zh: "边缘更清楚，但不应出现亮边或粗糙噪声。" },
    mistake: { en: "Sharpening noise makes the image look harsh and fake.", zh: "锐化噪声会让图像显得粗糙、不真实。" },
    checkpoint: { en: "I can recognize over-sharpening halos.", zh: "我能识别过度锐化造成的光晕。" },
    bubble: { en: "Sharpen gives edges a little bite. Too much bite leaves halos.", zh: "锐化给边缘一点劲儿；劲儿太大就会留下光晕。" },
    tapBubble: { en: "Check bright outlines around edges. That is the warning sign.", zh: "检查边缘旁边的亮边，那就是警告信号。" },
    tipBubble: { en: "I increased sharpen slightly. Look for clearer edges, not harsher noise.", zh: "我稍微提高了锐化。看边缘是否更清楚，而不是噪声更刺眼。" },
    doneBubble: { en: "Nice. You can now make detail crisp without making it brittle.", zh: "不错。你现在能让细节清晰，而不是变脆变假。" },
    anchor: "#sharpenInput"
  },
  {
    key: "tone",
    title: { en: "10 Tone + RGB Output", zh: "10 色调与 RGB 输出" },
    plain: { en: "Tone mapping, exposure, contrast, saturation, and gamma prepare the processed image for display and export.", zh: "色调映射、曝光、对比度、饱和度和 Gamma 会把处理后的图像准备成可显示、可导出的 RGB。" },
    why: { en: "Linear sensor values are not what a display expects. The final stage chooses how the image should feel to human eyes.", zh: "线性传感器值并不是显示器期待的样子。最后一步决定图像给人眼的观感。" },
    analogy: { en: "It is like developing a negative into a print: the data becomes a picture people can actually read.", zh: "它像是把底片冲印成照片：数据变成了人真正能读懂的画面。" },
    watch: { en: "Use the final RGB preview and histogram to judge clipping, contrast, and colorfulness.", zh: "使用最终 RGB 预览和直方图判断裁剪、对比度和颜色鲜艳程度。" },
    try: { en: "Use Auto EV, then adjust contrast, saturation, and gamma one at a time.", zh: "先用自动曝光，再逐个调整对比度、饱和度和 Gamma。" },
    control: { en: "Exposure EV, Contrast, Saturation, Gamma", zh: "曝光 EV、对比度、饱和度、Gamma" },
    expected: { en: "The final image looks natural, readable, and ready to export as PNG.", zh: "最终图像应自然、可读，并能导出 PNG。" },
    mistake: { en: "A pleasant preview can still hide clipped highlights or crushed shadows.", zh: "看起来舒服的预览，也可能隐藏高光裁剪或暗部压死。" },
    checkpoint: { en: "I can explain how the ISP result becomes display-ready RGB.", zh: "我能解释 ISP 结果如何变成可显示 RGB。" },
    bubble: { en: "This is the finish line: sensor data becomes a display-ready RGB image.", zh: "这就是终点：传感器数据变成可显示 RGB 图像。" },
    tapBubble: { en: "Do not only trust your eyes. Check the histogram for clipped ends.", zh: "不要只相信眼睛，也要看直方图两端有没有被裁掉。" },
    tipBubble: { en: "I used a high-contrast scene and Auto EV so clipping becomes easier to judge.", zh: "我用了高对比场景和自动曝光，让裁剪更容易判断。" },
    doneBubble: { en: "Excellent. You walked the whole RAW to ISP to RGB pipeline.", zh: "非常好。你已经走完整条 RAW 到 ISP 到 RGB 的流程。" },
    anchor: '[data-stage="tone"]'
  }
];

function localize(value, language) {
  if (value && typeof value === "object") {
    return value[language] ?? value.en ?? "";
  }
  return value ?? "";
}

function localizeStep(step, language) {
  return Object.fromEntries(
    Object.entries(step).map(([key, value]) => [key, localize(value, language)])
  );
}

export function getTutorialSteps(language = "en") {
  return rawSteps.map((step) => localizeStep(step, language));
}

export function getTutorialLabels(language = "en") {
  return language === "zh" ? zhLabels : enLabels;
}

export const TUTORIAL_STEPS = getTutorialSteps("en");
export const TUTORIAL_LABELS = getTutorialLabels("en");

export function tutorialIndexForStage(stageKey, steps = TUTORIAL_STEPS) {
  return Math.max(0, steps.findIndex((step) => step.key === stageKey));
}

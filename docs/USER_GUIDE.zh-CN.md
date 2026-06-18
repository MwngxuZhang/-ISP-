# 使用指南

这份指南说明 RAW ISP RGB Lab 的功能，以及初学者应该如何用它学习 ISP。

## 这个项目能做什么

RAW ISP RGB Lab 可以把 Bayer RAW 数据通过一条可视化相机 pipeline 转成 RGB 图像。它适合学习、调试和讨论 ISP 算法。

你可以用它理解这些问题：

- Bayer RAW 在颜色重建之前长什么样？
- 为什么 black level 和 white level 很重要？
- 坏点校正会怎样改变 RAW 数据？
- 镜头阴影校正为什么能补偿暗角？
- Demosaic 如何从单通道马赛克恢复 RGB？
- 白平衡、颜色矩阵、tone、降噪、锐化分别如何影响图像？

## 界面区域

应用主要分成三个区域：

- 左侧控制面板：加载数据、调整 ISP 参数。
- 演示图片图库：选择一张已测试图片，开始完整学习流程。
- Pipeline 轨道：展示 RAW 到 RGB 的处理顺序。
- 主预览区域：一个大预览、卡通讲解员面板，以及每个 ISP 阶段的阶段卡片。

页面顶部的 `Language / 语言` 选择器可以在英文和中文界面之间切换。切换后，控件、演示卡片、向导文案、吉祥物气泡和状态文字都会立即更新。

每个阶段卡片都包含：

- 图像预览
- 直方图
- 均值 / 范围指标

对初学者来说，最有效的使用方式是一次只调整一个参数，然后同时观察图像和直方图的变化。

3D Pixel 向导会用白话解释当前阶段。你可以用 `Previous` 和 `Next` 沿着 pipeline 学习；当你不知道该调什么时，可以点击 `Apply tip`，让应用为当前阶段设置一个安全的入门实验。

讲解员还会告诉你：

- 当前阶段应该触碰哪个控件
- 一个帮助记忆原理的形象类比
- 当前阶段背后的关键公式
- 公式里每个变量的含义
- 一个可以先动手试的小型交互图示
- 调整后预期会发生什么
- 初学者最容易踩的坑
- 学会这一阶段后应该能说清楚的一句话

点击 `I got it` 会记录当前阶段已理解，并自动带你进入下一步。`Restart tour` 可以重新开始学习流程。

吉祥物不是静态图片。它是一个轻量 CSS 3D 小助手，有头部、眼睛、身体、手臂和脚步动作。它会轻微浮动，鼠标移动到它附近时会跟随视线；当你点击阶段、选择演示图片、调整控件、应用建议或完成检查点时，它会切换动作并在头顶气泡里给出短提示。

网页宠物还会移动到当前相关位置附近。例如学习黑电平时，它会靠近 `Black level` 控件；学习坏点校正时，它会靠近 `Bad pixel threshold`；学习某个阶段卡片时，它会移动到该卡片旁边。这让用户不用在页面上到处找“下一步该看哪里”。

公式面板的目标是让数学不再抽象。建议先拖动公式滑条，看小图如何变化；再去调整真实 ISP 控件，对比图像预览和直方图。这样可以形成一个学习闭环：公式概念 -> 可视化小图 -> 真实图像变化。

## 快速使用流程

1. 打开 `index.html`。
2. 如果需要，先用 `Language / 语言` 选择英文或中文界面。
3. 在演示图库中点击一张已测试图片。
4. 或者选择一个内置测试案例，再点击 `Load Case` 加载案例。
5. 从左到右观察 pipeline 轨道。
6. 点击任意阶段卡片，把该阶段放到大预览中查看。
7. 阅读卡通讲解员对当前阶段的说明。
8. 点击 `Apply tip`，让应用给出一个引导实验。
9. 调整一个滑条，然后比较它前后阶段的变化。
10. 点击 `Auto WB`，观察 gray-world 自动白平衡的结果。
11. 点击 `Auto EV`，估计一个较合适的曝光。
12. 点击 `Export PNG`，导出最终 RGB 预览图。
13. 点击 `Preset JSON`，导出当前 ISP 参数。

## 内置学习案例

建议先用内置案例学习，再上传自己的数据。内置案例尺寸小、结果可预期，更容易理解每个 ISP 阶段在做什么。

页面顶部的演示图片图库是最傻瓜的入口。每张卡片都有缩略图，点击后会加载对应的 Bayer RAW 场景；这些场景都已经被自动化测试覆盖，会完整跑过 RAW -> ISP -> RGB。

| 案例 | 适合观察 | 建议操作 |
| --- | --- | --- |
| Color chart | Demosaic、白平衡、CCM、饱和度 | 点击 `Auto WB`，切换 CCM preset |
| Low light | 黑电平、曝光、降噪、Gamma | 点击 `Auto EV`，提高 denoise |
| Vignette | 镜头阴影校正 | 把 `Lens shading` 从 `0` 拉到 `1.2` |
| Bad pixels | 坏点校正 | 调整 `Bad pixel threshold`，观察孤立点 |
| Grayscale ramp | 中性灰、tone、clipping | 白平衡设为 `1 / 1 / 1`，调整 gamma |
| High contrast | 高光 clipping 和对比度 | 降低 exposure，调整 contrast |

这些案例都是生成 Bayer RAW mosaic 后再进入 pipeline，因此仍然会完整跑过 RAW -> ISP -> RGB 链路。

## 加载自己的数据

可以上传自己的 RAW，但这里有一个重要区别：当前应用支持的是“裸 Bayer 类 RAW buffer”，不是相机厂商 RAW 容器。

当前支持：

- 把 `.pgm` 灰度图当作 Bayer mosaic 输入
- `.raw` / `.bin` 普通二进制 buffer
- 8-bit unpacked 数据
- 10/12/14/16-bit 数值存放在 16-bit word 中的数据
- little-endian 或 big-endian uint16 word

当前还不支持：

- `.CR2`、`.CR3`、`.NEF`、`.ARW`、`.RAF`、`.ORF`
- DNG/TIFF 元数据解析
- Packed MIPI RAW10 / RAW12 bitstream 解包
- 自动识别宽高、位深、Bayer pattern 等元数据

对于普通 RAW，文件本身通常没有宽高和 CFA 信息，所以加载前必须手动填写元数据。

### PGM

如果你想用最简单的类 RAW 输入，可以使用 `.pgm` 文件。应用支持：

- `P2`：ASCII 灰度 PGM
- `P5`：二进制灰度 PGM

加载 PGM 后，需要选择正确的 Bayer pattern。

### 普通二进制 RAW

对于 `.raw` 或 `.bin` 文件，加载前需要填写：

- 宽度
- 高度
- 位深
- 大小端
- Bayer pattern
- Black level
- White level

普通 RAW 文件通常不带元数据，所以宽高或大小端填错时，图像会明显错乱。

仓库里包含一个已经测试过的二进制 RAW 样例：

- 数据：`samples/synthetic-rggb-16x12-12bit-little.raw`
- 元数据：`samples/synthetic-rggb-16x12-12bit-little.json`

加载它时使用这些设置：

```text
Width: 16
Height: 12
Bit depth: 12
Endian: Little
Bayer pattern: RGGB
Black level: 64
White level: 4095
```

预期效果是一张小尺寸彩色渐变图。它不是为了像真实照片，而是用来确认 RAW 解析和完整 ISP 链路都能跑通。

## 每个阶段是什么意思

| 阶段 | 含义 | 重点观察 |
| --- | --- | --- |
| RAW | 原始 Bayer 采样 | 马赛克颜色排列和曝光水平 |
| BLC | 黑电平校正 | 暗部是否回到接近 0 |
| BPC | 坏点校正 | 孤立亮点或暗点是否消失 |
| LSC | 镜头阴影校正 | 四角亮度是否更均匀 |
| Demosaic | 重建 RGB | 图像出现颜色，同时可能有伪影 |
| WB | 白平衡 | 中性色区域是否减少偏色 |
| CCM | 颜色校正矩阵 | 整体色彩渲染如何变化 |
| Denoise | 降噪 | 噪声降低，但细节可能变软 |
| Sharpen | 锐化 | 边缘更清晰，但过强会有 halo |
| Tone | 曝光、对比度、饱和度、Gamma | 最终可显示 RGB |

## 推荐学习练习

1. 加载 `Color chart`，把白平衡增益设为 `1 / 1 / 1`，然后点击 `Auto WB`。
2. 加载 `Vignette`，把 lens shading 从 `0` 拉到 `1.2`，观察四角亮度变化。
3. 加载 `Low light`，同时提高 denoise 和 sharpen，观察“更干净”和“更多伪影”的取舍。
4. 加载 `High contrast`，分别调整 exposure 和 gamma，理解线性亮度调整与显示映射的区别。
5. 加载任意案例，故意选择错误的 Bayer pattern，观察 CFA 元数据错误如何破坏颜色。

## 常见问题

- 图像错乱：宽度、高度、大小端或位深可能填错。
- 颜色互换或严重偏色：Bayer pattern 可能选错。
- 图像太暗：black level、white level 或 exposure 可能不合适。
- 高光死白：降低 exposure 或检查 white level。
- 图像太糊：降低 denoise。
- 边缘有光晕：降低 sharpen。

## 当前限制

这个项目是教育型 ISP 参考实现，不是生产级相机 pipeline。它目前还没有 DNG 元数据解析、校准传感器 profile、边缘感知 demosaic、高级降噪和完整色彩管理。

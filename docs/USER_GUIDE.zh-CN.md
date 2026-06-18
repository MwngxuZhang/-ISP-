# 使用指南

这个项目是一个面向初学者的 RAW -> ISP -> RGB 可视化实验室。你可以选择内置测试图，也可以上传简单 RAW/PGM 数据，然后观察每一个 ISP 阶段如何改变真实案例图像。

## 项目能做什么

RAW ISP RGB Lab 会把 Bayer RAW 数据按相机 pipeline 逐步处理成 RGB 图像。页面会同时显示：

- 每个阶段的图像预览
- 每个阶段的直方图和统计值
- 可交互公式和示意图
- 吉祥物讲解、提示和操作建议
- 当前阶段在手机/相机里的生产模块位置

适合用来学习这些问题：

- RAW Bayer 马赛克为什么不是普通照片？
- 黑电平、白电平为什么要先校正？
- 坏点校正如何消除 hot pixel / dead pixel？
- Lens Shading Correction 为什么能补偿暗角？
- Demosaic 如何从单通道 CFA 重建 RGB？
- AWB、CCM、降噪、锐化、tone mapping 如何影响最终观感？

## 推荐使用流程

1. 打开 `index.html` 或 GitHub Pages 网页。
2. 用右上角 `Language / 语言` 选择中文或英文。
3. 在演示图库中点击一张测试图，或从 `内置案例` 下拉框选择案例。
4. 沿着页面中的 pipeline 轨道，从 RAW 一步一步看到 RGB。
5. 点击任意阶段卡片，把该阶段放到大预览中观察。
6. 阅读吉祥物解释：它会告诉你这一步做什么、为什么做、对应手机/相机中的什么模块。
7. 拖动一个参数滑块，观察真实案例图、直方图、统计值同步变化。
8. 点 `Apply tip` 让网页自动设置一个适合新手的实验。
9. 点 `I got it` 标记当前阶段已理解，并进入下一步。
10. 用 `Export PNG` 导出最终 RGB，用 `Preset JSON` 导出当前 ISP 参数。

## 内置测试案例

这些案例都能完整跑通 RAW -> ISP -> RGB，不是单纯的示意图片。

| 案例 | 适合学习 | 建议操作 |
| --- | --- | --- |
| Color chart | Demosaic、白平衡、CCM、饱和度 | 点 `Auto WB`，切换 CCM preset |
| Low light | 黑电平、曝光、降噪、Gamma | 点 `Auto EV`，提高 denoise |
| Vignette | 镜头阴影校正 | 把 `Lens shading` 从 0 拉到 1.2 |
| Bad pixels | 坏点校正 | 调整 `Bad pixel threshold`，观察孤立亮点/暗点 |
| Grayscale ramp | 中性灰、tone、clipping | 把 WB 设为 1/1/1，再调 gamma |
| High contrast | 高光裁剪、对比度 | 降低 exposure，再调 contrast |

如果你觉得“坏点案例没有加载”，可以检查三处：下拉框是否显示 `Bad pixels`，演示卡片是否高亮 `Bad pixels`，右侧 `Bad pixels` 读数是否变化。当前版本选择下拉框后会立即加载案例，不需要再额外点击按钮。

## 生产级相机 Pipeline 对照

网页仍然是教学实现，不是厂商闭源 ISP，但每一步都对应真实手机/相机 pipeline 中的典型模块：

| 教学阶段 | 生产级对应模块 | 为什么要做 |
| --- | --- | --- |
| RAW | Sensor + MIPI RAW 输入 | 传感器输出的是 Bayer RAW，还不是可显示 RGB |
| BLC | Sensor front-end / black clamp / linearization | 去掉暗电流和模拟链路偏置，让 0 接近真实黑 |
| BPC | Defect Pixel Correction | 使用工厂 defect map 和运行时检测修掉坏点 |
| LSC | Lens Shading Correction mesh | 补偿镜头、CRA、模组装配导致的暗角和偏色 |
| Demosaic | CFA interpolation / RAW-to-RGB | 从单色采样重建每个像素的 RGB |
| WB | 3A 系统中的 AWB 增益 | 让中性物体在不同光源下接近中性灰 |
| CCM | Color calibration / color science | 把传感器颜色空间映射到目标显示/审美颜色 |
| Denoise | RAW/RGB/YUV 降噪 | 控制暗光噪声，同时尽量保留纹理 |
| Sharpen | Detail enhancement | 恢复镜头、demosaic、降噪带来的细节损失 |
| Tone | AE、tone mapping、gamma、输出转换 | 把线性传感器数据变成适合人眼和屏幕的 RGB |

## 如何观察真实变化

页面中的公式滑块和左侧 ISP 参数会驱动真实 pipeline。建议这样练习：

- 调黑电平：看暗部是否被压死，直方图左侧是否贴边。
- 调坏点阈值：看 `Bad pixels` 读数是否变化，孤立点是否消失。
- 调 Lens shading：看四角亮度是否逐渐接近中心。
- 调 WB 增益：先看灰块是否中性，再看彩色块是否自然。
- 调 CCM：看色相关系变化，而不是只看饱和度。
- 调 denoise/sharpen：观察“干净”和“细节”的取舍。
- 调 exposure/gamma：区分线性亮度调整和显示映射。

## 上传自己的 RAW

可以上传，但当前支持的是“裸 Bayer-like RAW buffer”，不是相机厂商 RAW 容器。

支持：

- `.pgm` 灰度图作为 Bayer mosaic
- `.raw` / `.bin` 普通二进制 buffer
- 8-bit unpacked 数据
- 10/12/14/16-bit 数值存放在 16-bit word 中的数据
- little-endian 或 big-endian uint16

暂不支持：

- `.CR2`、`.CR3`、`.NEF`、`.ARW`、`.RAF`、`.ORF`
- DNG/TIFF 元数据解析
- Packed MIPI RAW10 / RAW12 解包
- 自动识别宽高、位深、Bayer pattern

上传普通 `.raw` 或 `.bin` 前，请先手动填写宽度、高度、位深、大小端、Bayer pattern、黑电平和白电平。否则图像会错位、偏色或完全不可读。

## 常见问题

- 图像错乱：宽高、大小端、位深可能填错。
- 颜色互换：Bayer pattern 可能选错。
- 图像太暗：black level、white level 或 exposure 可能不合适。
- 高光死白：降低 exposure 或检查 white level。
- 图像太糊：降低 denoise。
- 边缘有亮边：降低 sharpen。

## 当前限制

这是教学型 ISP reference，不是量产手机 ISP。它还没有完整 DNG 元数据解析、传感器标定 profile、边缘感知 demosaic、多帧降噪、AI ISP、局部 tone mapping 和完整色彩管理。但它已经足够帮助初学者理解 RAW 到 RGB 的核心链路。

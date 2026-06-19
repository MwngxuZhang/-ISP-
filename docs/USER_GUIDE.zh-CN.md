# 使用指南

RAW ISP RGB Lab 是一个面向初学者的 RAW -> ISP -> RGB 可视化学习实验室。你可以选择内置测试图，也可以上传简单 RAW/PGM 数据，然后观察每一个 ISP 阶段如何改变真实案例图像。

## 项目能做什么

页面会同时展示：

- 每个阶段的图像预览
- 每个阶段的直方图和统计值
- 交互公式和示意图
- 每个阶段对应的源码函数、关键步骤和代码片段
- 吉祥物讲解、提示和操作建议
- 当前阶段在手机/相机里的生产模块位置
- Pipeline 性能分析，包括阶段耗时、内存估算、瓶颈和优化建议

它适合学习：

- RAW Bayer 马赛克为什么不是普通照片
- 黑电平、白电平为什么要先校正
- 坏点校正如何消除 hot pixel / dead pixel
- Lens Shading Correction 如何补偿暗角
- Demosaic 如何从单通道 CFA 重建 RGB
- AWB、CCM、降噪、锐化、Tone Mapping 如何影响最终观感

## 推荐使用流程

1. 打开 `index.html` 或 GitHub Pages。
2. 用右上角 `Language / 语言` 选择中文或英文。
3. 点击一张演示图，或从 `内置案例` 下拉框选择案例。
4. 沿着 pipeline 轨道从 RAW 一步一步看到 RGB。
5. 点击任意阶段卡片，把该阶段放到大预览中观察。
6. 阅读吉祥物解释：它会告诉你这一步做什么、为什么做、对应手机/相机中的什么模块。
7. 查看公式面板，理解该阶段的数学关系。
8. 查看代码讲解面板，知道这一阶段对应 `src/isp-core.js` 中哪一个函数。
9. 拖动一个参数滑块，观察真实案例图、直方图、统计值和性能面板同步变化。
10. 点击 `Apply tip` 让网页自动设置一个适合新手的实验。
11. 用 `Export PNG` 导出最终 RGB，用 `Preset JSON` 导出当前 ISP 参数。

## 内置测试案例

这些案例都能完整跑通 RAW -> ISP -> RGB，不是单纯示意图。

| 案例 | 适合学习 | 建议操作 |
| --- | --- | --- |
| Color chart | Demosaic、白平衡、CCM、饱和度 | 点 `Auto WB`，切换 CCM preset |
| Low light | 黑电平、曝光、降噪、Gamma | 点 `Auto EV`，提高 denoise |
| Vignette | 镜头阴影校正 | 把 `Lens shading` 从 0 拉到 1.2 |
| Bad pixels | 坏点校正 | 调整 `Bad pixel threshold`，观察孤立亮点/暗点 |
| Grayscale ramp | 中性灰、tone、clipping | 把 WB 设为 1/1/1，再调 gamma |
| High contrast | 高光裁剪、对比度 | 降低 exposure，再调 contrast |
| Portrait skin | 肤色、白平衡、CCM、饱和度 | 先比较 WB 和 CCM，再调整 saturation |
| Night street | 暗光曝光、降噪、偏色 | 逐步提高 denoise，同时观察灯光颜色 |
| Backlit window | 动态范围、高光裁剪、暗部可读性 | 降低 exposure，再比较 gamma 和 contrast |

## 如何读每一步代码

每个教程阶段下面都有 `Code walkthrough` 面板：

- `File` 告诉你源码文件位置。
- `Function` 告诉你核心函数名。
- 编号步骤解释代码逻辑。
- 代码片段展示这一阶段最关键的几行。
- `可以试着修改` 给出一个适合新手的小实验。

建议学习方式：

1. 先看图像变化。
2. 再看公式。
3. 最后看代码片段。
4. 回到左侧参数试着改一个值。

这样可以形成“图像现象 -> 数学公式 -> 代码实现 -> 参数实验”的闭环。

## 生产级相机 Pipeline 对照

网页是教学实现，不是厂商闭源 ISP，但每一步都对应真实手机/相机 pipeline 中的典型模块：

| 教学阶段 | 生产级对应模块 | 为什么要做 |
| --- | --- | --- |
| RAW | Sensor + MIPI RAW 输入 | 传感器输出 Bayer RAW，还不是可显示 RGB |
| BLC | Sensor front-end / black clamp / linearization | 去掉暗电流和模拟链路偏置，让黑场接近 0 |
| BPC | Defect Pixel Correction | 使用工厂 defect map 和运行时检测修掉坏点 |
| LSC | Lens Shading Correction mesh | 补偿镜头、CRA、模组装配导致的暗角和偏色 |
| Demosaic | CFA interpolation / RAW-to-RGB | 从单色采样重建每个像素的 RGB |
| WB | 3A 系统中的 AWB 增益 | 让中性物体在不同光源下接近中性灰 |
| CCM | Color calibration / color science | 把传感器颜色空间映射到目标显示/审美颜色 |
| Denoise | RAW/RGB/YUV 降噪 | 控制暗光噪声，同时尽量保留纹理 |
| Sharpen | Detail enhancement | 恢复镜头、demosaic、降噪带来的细节损失 |
| Tone | AE、tone mapping、gamma、输出转换 | 把线性传感器数据变成适合屏幕显示的 RGB |

## 上传自己的 RAW

当前支持的是“裸 Bayer-like RAW buffer”，不是相机厂商 RAW 容器。

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

上传普通 `.raw` 或 `.bin` 前，请先手动填写宽度、高度、位深、大小端、Bayer pattern、黑电平和白电平。

## 常见问题

- 图像错乱：宽高、大小端、位深可能填错。
- 颜色互换：Bayer pattern 可能选错。
- 图像太暗：black level、white level 或 exposure 可能不合适。
- 高光死白：降低 exposure 或检查 white level。
- 图像太糊：降低 denoise。
- 边缘有亮边：降低 sharpen。

## 当前限制

这是教学型和实验型 ISP reference，不是生产级手机 ISP。它还没有完整 DNG 元数据解析、传感器标定 profile、边缘感知 demosaic、多帧降噪、AI ISP、局部 tone mapping 和完整色彩管理。它的目标是把 RAW 到 RGB 的核心链路讲清楚，并让初学者能一边看图、一边看公式、一边读代码。

# 技术设计

## 架构

项目分成两层：

```text
src/isp-core.js
  纯 ISP 函数、RAW 解析器、图像转换辅助函数。

src/app.js
  浏览器界面、文件加载、参数控制、canvas 渲染。
```

这样的分层可以让算法代码保持可测试，也方便后续增加：

- CLI 批量转换
- Python 绑定或参考 notebook
- WASM / WebGPU 加速器
- 数据集回归测试

## 数据模型

RAW 数据表示为：

```js
{
  width: number,
  height: number,
  data: Float32Array | Uint16Array | Uint8Array,
  bitDepth: number,
  bayerPattern: "RGGB" | "BGGR" | "GRBG" | "GBRG"
}
```

中间 RGB 数据用 `Float32Array` 中的像素三元组表示：

```text
[r, g, b, r, g, b, ...]
```

ISP pipeline 内部的数值会归一化到 `0..1`。

## Pipeline

当前可视化 pipeline 包含十个阶段：

```text
RAW Mosaic
  -> Black-level correction
  -> Bad-pixel correction
  -> Lens-shading correction
  -> Bilinear demosaic
  -> White balance / auto white balance
  -> Color correction matrix
  -> Denoise
  -> Sharpen
  -> Exposure / contrast / saturation / gamma
  -> RGB preview
```

### 1. 输入解析

MVP 支持：

- PGM `P2` ASCII 灰度格式
- PGM `P5` 二进制灰度格式
- 普通二进制 RAW，宽度、高度、位深和大小端由界面字段提供

PGM 支持让学习者可以很容易检查生成或导出的马赛克数据。普通二进制 RAW 支持则适合快速测试传感器 dump。

### 2. 黑电平校正

传感器采样通常包含电路偏置。MVP 会减去用户控制的黑电平，并除以 `(whiteLevel - blackLevel)`。

```text
normalized = clamp((sample - blackLevel) / (whiteLevel - blackLevel), 0, 1)
```

### 3. 去马赛克

在去马赛克之前，pipeline 可以在归一化 Bayer 数据上运行坏点校正和镜头阴影校正。

坏点校正会把当前 Bayer 采样与附近相同 CFA 颜色的采样进行比较。如果当前值与局部 median 的差异超过阈值，就用该 median 替换当前采样。

镜头阴影校正会应用一个径向增益场。这是一个教育型简化模型，用来帮助学习者直观看到为什么图像角落通常需要补偿。

MVP 使用可读性强的双线性插值。对每个输出像素：

- 已知的 Bayer 通道会直接复制。
- 缺失通道会从附近相同 Bayer 颜色的采样点求平均。
- 边缘像素会使用一个小的 fallback 半径。

这个实现有意保持简单。它适合教学，因为产生的伪影也容易解释。

### 4. 白平衡

白平衡增益按通道独立应用：

```text
R *= redGain
G *= greenGain
B *= blueGain
```

界面暴露手动增益，并提供 gray-world 自动白平衡按钮。未来版本可以继续增加 white-patch 或 ROI 测光。

### 5. 颜色校正矩阵

MVP 在白平衡之后应用 3x3 矩阵：

```text
[R']   [m00 m01 m02] [R]
[G'] = [m10 m11 m12] [G]
[B']   [m20 m21 m22] [B]
```

默认矩阵是 identity。项目中也包含一个小的 "warm camera" preset，用来演示这个阶段的作用。

### 6. Tone Mapping 与 Gamma

MVP 使用简单的幂律 gamma：

```text
out = pow(clamp(input, 0, 1), 1 / gamma)
```

当前 tone 阶段还在 gamma 之前加入曝光、对比度和饱和度控制。这可以生成适合显示的预览，同时保持数学过程透明。

### 7. 细节阶段

当前项目包含简单的 RGB 降噪和锐化阶段：

- 降噪使用小范围 blur 与当前图像混合。
- 锐化使用类似 unsharp mask 的操作。

这些是面向学习的参考实现。未来优化版本可以使用边缘感知滤波或频域方法。

## 可视化

界面会为以下阶段渲染 canvas：

- RAW mosaic view
- Normalized RAW
- Bad-pixel corrected RAW
- Lens-shading corrected RAW
- Demosaiced linear RGB
- White balanced RGB
- Color corrected RGB
- Denoised RGB
- Sharpened RGB
- Final gamma RGB

Canvas 渲染使用 `ImageData`，因此 pipeline 保持浏览器原生且简单。

每个阶段还会渲染紧凑直方图和一行指标，让初学者能立即看到 clipping、曝光变化和色彩平衡的变化。

## 测试策略

第一层测试验证：

- Bayer 颜色位置映射
- RAW 归一化
- 去马赛克输出尺寸和有限数值
- Pipeline 输出范围
- PGM 解析
- 坏点校正
- 镜头阴影校正
- 自动白平衡增益估计
- 直方图生成

未来的回归测试应该加入已知 RAW fixture，并把输出与保存的 golden image 对比。

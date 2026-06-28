# PixelPipe ISP Lab

学习 ISP？PixelPipe 就够啦。

PixelPipe ISP Lab 是一个开源的 RAW -> ISP -> RGB 可视化学习实验室，面向图像算法工程师和 ISP 初学者。它把手机相机里的成像 pipeline 做成可以直接操作的网页：选择一个案例，拖动一个参数，观察每个 ISP 阶段、公式、直方图、代码片段和最终 RGB 图像如何一起变化。

在线体验：[https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

## 为什么值得学习？

- 它把 ISP 变得可见：RAW 数据、中间阶段、直方图、指标、公式和最终 RGB 会一起展示。
- 它对新手友好：3D 学习助手会解释每一步为什么存在，对应相机或手机里的什么问题。
- 它可以动手调：黑电平、白平衡、去噪、锐化、Tone/Gamma 等参数会实时作用到真实演示图像。
- 它能看代码：每个主要阶段都附带简短的源码讲解，方便从“看效果”走到“看实现”。
- 它适合作为图像工程学习项目：项目包含中英文文档、测试案例、CI、Issue 模板和 Roadmap。

## 你可以学到什么？

- RAW 传感器数据和 Bayer 排列。
- 自动对焦、镜头控制、自动曝光、亮度/对比度和颜色系统如何组成完整成像控制链路。
- 黑电平校正为什么要减掉传感器基线偏置。
- 坏点校正如何处理传感器缺陷。
- 镜头阴影校正如何补偿边缘暗角。
- Demosaic、白平衡、颜色校正矩阵、去噪、锐化、Tone Mapping、Gamma 的作用。
- 调参如何影响图像、直方图和阶段指标。
- 视频编解码、视频去噪、恢复、增强和实时性之间的取舍。
- 计算摄影与 AI 图像算法在 HDR、多目测量、拼接、去雾、去模糊、超分和 AIGC 增强中的作用。
- 生产级相机 pipeline 如何拆成可以解释、可以测试、可以优化的模块。

## 功能亮点

- 完整 RAW -> ISP -> RGB 可视化流程。
- 覆盖 RAW、BLC、BPC、LSC、Demosaic、AWB、CCM、Denoise、Sharpen、Tone/Gamma。
- 内置已测试案例：色卡、低光、暗角、坏点、灰阶、高对比、人像肤色、夜景街灯、逆光窗口。
- 支持上传 PGM 和普通 RAW/BIN buffer，并手动填写元数据。
- 支持实时调参和一键复位。
- 提供阶段预览、直方图、图像指标和最终 RGB 导出。
- 每个阶段都有交互公式和清晰 SVG 示意图。
- 每个阶段都有代码讲解：源文件、函数名、关键步骤和代码片段。
- 支持中英文界面与中英文文档。
- Performance Profiler 可展示阶段耗时、内存估计、瓶颈提示和优化建议。

## 快速开始

可以直接打开 `index.html`，也可以启动本地静态服务：

```bash
npm run start
```

然后访问：

```text
http://127.0.0.1:4173
```

运行测试：

```bash
npm test
```

## 如何使用

1. 打开在线 Demo 或本地 `index.html`。
2. 选择一个内置案例，例如色卡、低光、坏点或夜景街灯。
3. 点击任意 ISP 阶段，查看该阶段的预览、公式、代码讲解和学习说明。
4. 拖动参数控件，真实案例图像会跟随 pipeline 实时变化。
5. 想回到教学默认状态时，点击复位。
6. 可以导出最终 RGB，也可以查看性能分析面板。

## 仓库结构

```text
docs/                         项目文档
.github/                      CI、Issue 模板和 PR 模板
src/isp-core.js                ISP 算法、解析器和 profiler helper
src/app.js                     浏览器 UI 逻辑
src/code-walkthrough.js        每个阶段的代码讲解内容
src/styles.css                 页面样式
assets/demos/                  演示图缩略图
samples/                       已测试 RAW/PGM 样例
tests/                         核心测试和 QA 检查
scripts/static-server.mjs      本地静态服务
index.html                     静态网页应用
ROADMAP.md                     版本路线图
```

## 文档

- [使用指南](docs/USER_GUIDE.zh-CN.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)
- [高级成像系统学习路线](docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.zh-CN.md)
- [设备场景案例地图教学规格](docs/DEVICE_SCENARIO_TEACHING_SPEC.zh-CN.md)
- [项目理解](docs/PROJECT_UNDERSTANDING.zh-CN.md)
- [开发计划](docs/DEVELOPMENT_PLAN.zh-CN.md)
- [Roadmap](ROADMAP.md)

英文文档：

- [English README](README.en.md)
- [User guide](docs/USER_GUIDE.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [Advanced imaging system roadmap](docs/ADVANCED_IMAGING_SYSTEM_ROADMAP.en.md)
- [Device scenario teaching specification](docs/DEVICE_SCENARIO_TEACHING_SPEC.en.md)

## 当前状态

PixelPipe ISP Lab 是一个教学型和实验型 ISP reference，不是生产级相机固件 pipeline。代码优先追求清晰、可读、可观察和便于学习。后续路线包括更完整的 RAW/DNG 元数据支持、更多 demosaic 算法、客观图像质量指标、Worker/WASM 加速和可分享的性能报告。

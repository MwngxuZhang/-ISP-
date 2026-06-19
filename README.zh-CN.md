# RAW ISP RGB Lab

RAW ISP RGB Lab 是一个开源的 RAW -> ISP -> RGB 可视化学习与调参平台，用来帮助图像工程初学者理解手机相机从 Bayer RAW 到最终 RGB 的完整处理链路。

项目以静态网页形式运行，包含多组已测试演示场景，并用阶段预览、直方图、统计指标、交互公式和吉祥物讲解，把抽象 ISP 原理变成可观察、可操作的学习体验。

在线体验：[https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

## 核心亮点

- 完整 RAW -> ISP -> RGB 可视化 pipeline。
- 覆盖 RAW、BLC、BPC、LSC、Demosaic、AWB、CCM、Denoise、Sharpen、Tone/Gamma。
- 内置测试场景：色卡、低光、暗角、坏点、灰阶、高对比。
- 支持上传 PGM 和普通 RAW/BIN buffer，并手动填写元数据。
- 支持实时调参、阶段预览、直方图、统计指标和最终 RGB 导出。
- 每个阶段都有交互公式和清晰示意图。
- 3D 吉祥物提供新手友好的讲解和操作引导。
- 支持中英文界面与中英文文档。
- 新增 Performance Profiler：展示阶段耗时、内存估算、瓶颈识别和优化建议。

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

## 项目价值

很多 ISP 教程只讲公式，不容易看到图像实际变化。本项目把公式、参数、图像预览和直方图连接起来：你可以选择一个场景，只调一个参数，然后观察 RAW、中间阶段和最终 RGB 如何同步变化。

新增的 Performance Profiler 还把 pipeline 变成一个小型流畅性分析负载：它会测量各阶段延迟、估算内存、识别瓶颈，并给出 Worker 异步化、增量重算、buffer 复用、降采样预览等优化建议。

## 文档

- [使用指南](docs/USER_GUIDE.zh-CN.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)
- [距离高星 GitHub 项目的差距分析](docs/GITHUB_STAR_GAP_ANALYSIS.zh-CN.md)
- [项目理解](docs/PROJECT_UNDERSTANDING.zh-CN.md)
- [开发计划](docs/DEVELOPMENT_PLAN.zh-CN.md)
- [教学助手项目理解](docs/EDUCATIONAL_ASSISTANT_UNDERSTANDING.zh-CN.md)
- [教学助手技术设计](docs/EDUCATIONAL_ASSISTANT_TECHNICAL_DESIGN.zh-CN.md)
- [教学助手开发计划](docs/EDUCATIONAL_ASSISTANT_DEVELOPMENT_PLAN.zh-CN.md)

英文文档：

- [English README](README.en.md)
- [User guide](docs/USER_GUIDE.en.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)
- [GitHub star gap analysis](docs/GITHUB_STAR_GAP_ANALYSIS.en.md)

## 仓库结构

```text
docs/                         项目文档
src/isp-core.js                ISP 算法、解析器和 profiler helper
src/app.js                     浏览器 UI 逻辑
src/styles.css                 页面样式
assets/demos/                  演示图缩略图
samples/                       已测试 RAW/PGM 样例
tests/                         核心测试和 QA 检查
scripts/static-server.mjs      本地静态服务
index.html                     静态网页应用
```

## 当前状态

这是一个教学型和实验型 ISP reference，不是生产级相机 pipeline。代码优先追求清晰、可读和便于学习。后续路线包括真实 RAW/DNG 元数据支持、更多 demosaic 算法、图像质量指标、Worker/WASM 加速和性能报告导出。

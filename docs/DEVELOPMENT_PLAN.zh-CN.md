# 开发计划

## 阶段 1：可运行的教育型 MVP

状态：已在当前仓库草稿中实现。

- 定义项目文档和 GitHub-ready 仓库结构。
- 实现纯 JavaScript ISP 核心。
- 实现浏览器可视化界面。
- 支持合成 RAW、PGM 和普通二进制 RAW 输入。
- 增加基础自动化测试。

## 阶段 2：补全 ISP 学习覆盖面

状态：已在 `0.2.0` 版本中完成大部分。

- 增加 RAW 和 RGB 各阶段 histogram 面板。
- 增加坏点校正，并提供可见 defect overlay。
- 增加镜头阴影校正，支持径向模型和校准 map 模式。
- 增加降噪和锐化阶段。
- 增加自动白平衡和自动曝光示例。
- 增加 before/after 分屏和按阶段缩放查看。

当前已实现：

- 每阶段直方图
- 坏点校正
- 径向镜头阴影校正
- 降噪和锐化阶段
- gray-world 自动白平衡
- 大尺寸最终预览和每阶段指标

仍计划实现：

- defect overlay
- 校准 map LSC
- 自动曝光
- before/after 分屏
- 每阶段缩放查看

## 阶段 3：接入真实 RAW 生态

- 增加 DNG/TIFF 解析。
- 提取 black level、white level、CFA pattern 和 color matrix 等元数据。
- 增加许可证友好的样例 RAW 数据集。
- 增加 PNG 导出和 sidecar JSON pipeline preset。

当前已部分实现：

- 最终 PNG 导出
- Preset JSON 导出

## 阶段 4：工程化工具链

- 增加 CLI 批量转换。
- 增加用于算法实验的 Python notebook 示例。
- 增加 Web Worker 处理路径，支持更大图像。
- 增加 WASM / WebGPU 加速路径。
- 在 CI 中增加 golden image 回归测试。

## 阶段 5：开源项目完善

- 增加贡献指南和 issue templates。
- 增加架构图。
- 增加 benchmark 页面。
- 发布 GitHub Pages demo。
- 在 DNG 支持和 golden tests 落地后打 `v0.1.0` tag。

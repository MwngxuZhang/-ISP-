# QA 测试报告

测试日期：2026-06-17

## 测试范围

- 项目文件完整性
- 中英文 Markdown 文档内容
- Markdown 本地链接
- 核心 ISP 算法
- 多个内置 RAW 学习案例
- 二进制 RAW 样例解析
- 静态资源 HTTP 加载
- 前端初始化、渲染状态和 pipeline 按钮生成
- 教学助手图片、教学内容和按钮状态
- 新手控件提示、预期结果、常见坑和学习进度
- 吉祥物气泡、动画状态和鼠标交互
- 浮动网页宠物位置、教学锚点和阶段同步气泡
- 6 张演示图片缩略图与对应 RAW 场景映射
- 英文 / 中文界面选择器，以及本地化教程和演示内容
- 3D Pixel 吉祥物结构、肢体动作 CSS、更丰富的阶段气泡，以及控件级解释
- 交互公式面板、变量解释、canvas 图示，以及公式滑条触发的吉祥物讲解

## 结果摘要

| 项目 | 结果 |
| --- | --- |
| 必需文件检查 | 通过 |
| Markdown 内容检查 | 通过 |
| Markdown 本地链接检查 | 通过 |
| 核心 ISP 测试 | 通过 |
| 内置案例 pipeline 测试 | 通过 |
| 二进制 RAW 样例测试 | 通过 |
| 静态 HTTP 资源加载 | 通过 |
| 前端启动模拟 | 通过 |
| 教学助手启动与 Next/Apply Tip 检查 | 通过 |
| 新手教练进度与 I got it 检查 | 通过 |
| 吉祥物气泡与鼠标倾斜交互检查 | 通过 |
| 浮动宠物移动与阶段气泡同步检查 | 通过 |
| 演示图片图库资源与映射检查 | 通过 |
| 双语界面切换模拟 | 通过 |
| 本地化教程 / 演示数据检查 | 通过 |
| 3D 吉祥物 DOM 结构检查 | 通过 |
| 形象类比和丰富气泡内容检查 | 通过 |
| 控件级吉祥物解释模拟 | 通过 |
| 公式内容覆盖检查 | 通过 |
| 交互公式 UI 模拟 | 通过 |
| 公式滑条吉祥物讲解检查 | 通过 |
| in-app browser 真实 file:// 点击测试 | 受环境策略限制，未执行 |

## 已验证功能

- 6 个内置学习案例存在：`Color chart`、`Low light`、`Vignette`、`Bad pixels`、`Grayscale ramp`、`High contrast`
- 6 张演示缩略图存在，并且每张都映射到一个可跑完整 pipeline 的 RAW 场景
- 10 个 ISP 阶段入口存在：RAW、BLC、BPC、LSC、Demosaic、WB、CCM、Denoise、Sharpen、Tone/Gamma
- 核心 pipeline 能从 RAW Bayer 数据输出 RGB
- PGM 解析通过测试
- 二进制 `.raw` 样例解析通过测试
- Bad pixel correction、lens shading correction、denoise、sharpen、auto white balance、histogram 均有测试覆盖
- 首页包含案例选择、Auto WB、Auto EV、Export PNG、Preset JSON 等关键控件
- 首页包含卡通讲解员、Previous / Next、Apply Tip 和每阶段教学内容
- 语言选择器可以把界面从英文切换到中文，并同步更新演示卡片、向导文案、吉祥物气泡和状态文字
- 吉祥物使用轻量 3D DOM/CSS 结构，包含头部、身体、手臂、脚步和多种动作状态
- 每个 ISP 阶段包含形象类比，以及更丰富的阶段点击、Apply Tip 和检查点气泡
- 调整 ISP 控件时，会触发对应的吉祥物解释，并移动到相关控件附近
- 每个 ISP 阶段都包含公式、变量解释、详细双语原理说明和交互小图
- 拖动公式滑条会更新小图并触发吉祥物讲解，不会重新跑完整 ISP pipeline
- 中文和英文文档均有实际内容，不是空壳文档

## 环境说明

当前 Codex Browser Use 环境拒绝自动访问 `file://` 本地页面，因此没有执行真实浏览器点击测试。替代验证包括：

- 通过本地临时 HTTP server 请求 `index.html`、`app.js`、`isp-core.js`、`styles.css`、文档和 RAW 样例
- 使用模拟 DOM 和 canvas 导入真实 `src/app.js`，确认前端能初始化并渲染状态
- 使用模拟交互验证更丰富的向导体验：阶段形象类比、语言切换和黑电平控件解释
- 使用模拟交互验证公式体验：公式初始化、canvas 绘制、阶段公式切换、公式滑条反馈和中文本地化

## 建议人工复测

1. 打开 `index.html` 或使用 `npm run start` 后访问本地服务。
2. 分别选择 6 个内置案例并点击 `Load Case`。
3. 在 `Language / 语言` 中切换英文和中文，确认控件、演示卡片、向导文字和状态文字都会更新。
4. 点击每个 pipeline 阶段卡片，确认大预览会切换。
5. 点击 `Auto WB` 和 `Auto EV`，观察最终图像和直方图变化。
6. 调整 `Lens shading`、`Bad pixel threshold`、`Denoise`、`Sharpen`。
7. 点击 `Export PNG` 和 `Preset JSON`，确认浏览器下载文件。

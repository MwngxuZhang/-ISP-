# 学习 ISP？有我就够啦

**英文标题：** Learning ISP? Me Is All You Need  
**项目：** RAW-to-RGB ISP Lab  
**版本：** `0.0.0`

这是一个开源、可视化、适合初学者的 ISP 学习网页。它把完整相机图像流程拆成可以直接观察和调参的步骤：

`RAW Bayer -> 黑电平 -> 坏点校正 -> 镜头阴影校正 -> 去马赛克 -> 白平衡 -> CCM -> 降噪 -> 锐化 -> RGB`

## 在线体验

如果 GitHub Pages 已启用，可以直接打开：

[https://mwngxuzhang.github.io/-ISP-/](https://mwngxuzhang.github.io/-ISP-/)

如果页面暂时打不开，请在 GitHub 仓库进入 **Settings -> Pages**，选择：

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/root`

保存后等待 1-2 分钟，再打开上面的链接。

## 下载使用

### 方法 1：直接下载 ZIP

1. 打开仓库页面：[https://github.com/MwngxuZhang/-ISP-](https://github.com/MwngxuZhang/-ISP-)
2. 点击绿色 **Code** 按钮
3. 点击 **Download ZIP**
4. 解压后双击打开 `index.html`

### 方法 2：Git 克隆

```bash
git clone https://github.com/MwngxuZhang/-ISP-.git
cd -ISP-
```

然后直接打开：

```text
index.html
```

也可以启动本地静态服务器：

```bash
npm run start
```

再访问：

```text
http://127.0.0.1:4173
```

## 可以学习什么

- 选择 6 张已测试演示图，完整跑 RAW -> ISP -> RGB
- 上传小尺寸 `.pgm` / `.raw` 文件学习真实 RAW 输入
- 实时调节黑电平、白电平、坏点阈值、LSC、白平衡、CCM、曝光、Gamma、降噪、锐化
- 每一步都有可视化预览、直方图、指标和交互公式
- 吉祥物会跟随步骤解释原理，适合初学者边看边学
- 支持中英文界面切换
- 可导出最终 PNG 和 ISP 参数 JSON

## 文档

- [English README](README.en.md)
- [中文使用指南](docs/USER_GUIDE.zh-CN.md)
- [English user guide](docs/USER_GUIDE.en.md)
- [技术设计](docs/TECHNICAL_DESIGN.zh-CN.md)
- [Technical design](docs/TECHNICAL_DESIGN.en.md)

## 测试

```bash
npm test
```

当前版本已经通过核心 ISP 算法测试和结构 QA 检查。

# 贡献指南

感谢你帮助改进 RAW ISP RGB Lab。

## 适合第一次贡献的任务

- 增加一个小尺寸 RAW 或 PGM fixture，并写清楚元数据。
- 改进某个 ISP 阶段的说明文档。
- 为算法边界情况增加一个聚焦测试。
- 增加一个新的颜色校正 preset。

## 开发规则

- 除非项目架构有意调整，否则保持 `src/isp-core.js` 兼容浏览器且无依赖。
- 修改解析器或算法时增加测试。
- 在优化版本之前，优先提供可读的参考实现。
- 样例数据应保持小尺寸，并确保许可证友好。

## Commit 风格

使用简短、直接的 commit message：

```text
add pgm parser test
fix bayer pattern mapping
document white balance stage
```


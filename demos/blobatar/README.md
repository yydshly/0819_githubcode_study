# Blobatar 程序化身份研究台

这是 [Alain00/blobatar](https://github.com/Alain00/blobatar) 的静态交互研究演示。它直接运行固定上游提交构建出的代码，用于说明确定性 SVG 头像的能力、原理、产品场景、能力边界和扩展路线。

核心定义：**头像外观回答“谁”，表情与动效提示“状态”，文字标签提供准确语义。** 主场景是社区默认身份与多 Agent 角色归因；仓库标识和测试夹具是次级场景。

## 本地运行

在研究主库根目录执行：

```powershell
python -m http.server 4180 --directory demos/blobatar
```

打开 <http://127.0.0.1:4180/>。

页面不需要后端、数据库、密钥或公共 Blobatar HTTP 服务；`blobatar-vendor.js` 和 `blobatar-motion.css` 已随演示保存。

## 演示内容

- 在 Identity Protocol Lab 切换“社区身份 / 多 Agent”，观察同一套视觉身份逻辑如何进入两类产品。
- 在多 Agent 模式切换待命、分析、执行、复核、完成五个阶段，验证身份保持稳定、状态随任务变化。
- 修改 seed，验证同一字符串输出字节一致的 SVG。
- 开关名称规范化，观察大小写、空格和 Unicode 处理。
- 锁定轮廓、背景、色相和色调，体验“品牌约束 + 个体差异”。
- 切换上游 14 种表情以及呼吸、漂浮、眨眼和扫视动画。
- 下载当前静态 SVG。
- 在 Agent、社区用户、代码仓库三类群组中批量生成身份。
- 阅读 keyed traits、约束几何、可访问配色和版本稳定性原理。
- 对照产品使用场景、不适用边界与六条可扩展路线。

页面中的 Agent 阶段映射属于本研究演示新增的产品适配层，不是 Blobatar 上游自带的任务编排能力。

## 上游代码如何进入演示

研究锁定提交见 [`studies/blobatar/upstream-lock.json`](../../studies/blobatar/upstream-lock.json)。`upstream-entry.ts` 只重新导出上游 API，静态 bundle 使用以下命令生成：

```powershell
npx --yes esbuild@0.25.9 demos/blobatar/upstream-entry.ts `
  --bundle --format=esm --platform=browser --minify `
  --outfile=demos/blobatar/blobatar-vendor.js

npx --yes esbuild@0.25.9 vendor-projects/blobatar/packages/blobatar/src/motion.css `
  --minify --outfile=demos/blobatar/blobatar-motion.css
```

演示自己的 `app.js` 负责控件、数据标签和场景编排，不重写 Blobatar 的哈希、几何、颜色或表情算法。

## 边界

- 这是确定性程序化头像，不是 AI 图像模型。
- 32 位内部状态不适合安全认证或绝对无碰撞身份。
- 公共 HTTP URL 不应直接包含邮箱等个人信息。
- “Agent 状态适配器、HMAC 身份、多语言 parity、感知辨识实验”等位于扩展路线，不属于当前上游能力。

## 文档

- [完整研究记录](../../studies/blobatar/README.md)
- [设计契约](../../studies/blobatar/design-contract.md)
- [浏览器验收](docs/validation.md)
- [交接说明](docs/handoff.md)
- [上游许可证](UPSTREAM-LICENSE.md)

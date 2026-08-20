# Blobatar 浏览器验收

## 环境

- 时间：2026-08-20 21:08 +08:00
- Canonical URL：`http://127.0.0.1:4180/`
- 启动：`python -m http.server 4180 --directory demos/blobatar`
- 浏览器：Playwright Chromium headless
- 说明：本机没有可调用的 `agent-browser` CLI，因此按同一浏览器验证流程使用工作区内置 Playwright，保留最终截图和结构化结果。

## 自动化结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 页面加载与错误覆盖层 | PASS | 标题正确、正文 3629 字、无 overlay、无 console/page error |
| 身份模型描述 | PASS | “头像＝谁、表情动效＝状态、文字＝准确语义”公式与边界说明可见 |
| 社区身份扩展 | PASS | 默认显示 6 个由不透明 user ID 派生的稳定头像 |
| 多 Agent 扩展 | PASS | 4 个角色；待命 / 分析 / 执行 / 复核 / 完成五阶段可切换 |
| Agent 状态同步 | PASS | 执行阶段为 2 已完成 + 1 执行中 + 1 待命；完成阶段 4 个均完成 |
| 上游渲染 | PASS | 主头像 SVG 存在；版本 2.2.0；固定 seed 输出字节一致 |
| 表情 | PASS | 14 个上游 expression 均可选择 |
| 配置 | PASS | `Agent.Test@Lab` + shape 0.99 得到 triangle；色相锁定为 28° |
| 动画开关 | PASS | 关闭后 `mo-root` 不再存在 |
| 群组切换 | PASS | Agent → 社区后首个身份为 Lin，保持 8 个头像 |
| SVG 下载 | PASS | 下载名 `blobatar-Agent-Test-Lab.svg` |
| 键盘 | PASS | Tab 焦点 outline 为 solid；场景 tabs 支持左右方向键并同步 `aria-selected` |
| 1440 桌面 | PASS | 工作台、群组、原理、场景和路线完整可见 |
| 1024 平板 | PASS | 横向溢出 0 px |
| 390 手机 | PASS | 横向溢出 0 px；主头像 292 px；24 个控件可用 |
| reduced-motion | PASS | media query 命中，非必要动画时长降为 `1e-05s` |

## 交互路径

```text
打开页面
→ 阅读身份模型
→ 社区身份切换到多 Agent
→ 分析 → 执行 → 完成
→ 修改 seed
→ 固定 Triangle
→ 切换 Happy
→ 关闭动画
→ 锁定 hue=28°
→ 切换社区群组
→ 下载 SVG
→ 键盘继续导航
```

上述路径在真实浏览器中完成，无运行时错误。Agent 阶段切换后角色 seed 与外观保持稳定，状态文字、表情和指示点同步变化。

## 最终视觉证据

- [桌面全页](evidence-desktop.png)
- [390px 手机全页](evidence-mobile.png)

视觉检查后收紧了多 Agent 阶段按钮高度；最终证据由修复后的页面重新生成。桌面证据展示多 Agent 完成态，手机证据展示社区默认身份态。

## 工程证据

- `node --check demos/blobatar/app.js`：通过。
- Identity Protocol Lab：社区 6 身份、多 Agent 4 角色 × 5 阶段、键盘 tabs 自动化通过。
- `node --check demos/blobatar/blobatar-vendor.js`：通过。
- Bundle import：`VERSION=2.2.0`、稳定输出为 true、expression 导出存在。
- 固定检出：`9946e7cce69aaa54666b2f1ad1aa6ce02801653d`，与 `upstream-lock.json` 一致。
- GitHub Pages workflow 已包含 demo、study 复制和部署内链接改写。

## 延期与阻塞

无。语音口型、HMAC 服务、跨语言 parity、形状插件和感知辨识实验属于明确的后续研究范围，不是本次交付延期项。

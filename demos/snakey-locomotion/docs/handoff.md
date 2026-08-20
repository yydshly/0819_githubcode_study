# Snakey Locomotion 交接说明

## 1. 项目与当前阶段

这是 0819 GitHub Code Study 的第四个研究子项目：一个以 Snakey Locomotion 为样本的 Three.js 程序化长体角色与环境交互 Web 研究台。第一阶段“能力复现与可解释展示”以及 Revision 1“源码直开入口修复”已经关闭；项目于 2026-08-20 归档为按需复用参考，当前没有待执行的本地交付项。

## 2. 已完成内容

- 四种实时实验：地面蜿蜒、曲面攀爬、交互场和结构解剖。
- 波幅、波长、速度、体型参数以及轨迹、局部标架、交互纹理开关。
- 独立 `PathHistory`、动态蛇身、交互场和环境源码模块。
- 桌面固定研究面板、平板覆盖层、手机底部 sheet 与触控方向键。
- reduced-motion、WebGL 失败与 noscript 回退。
- 上游版本锁、MIT 许可证说明、完整研究记录和能力边界。
- 研究总入口第四张卡片、根 README 索引和 Pages 构建步骤。

## 3. 剩余或延期内容

- 未发布远端 GitHub Pages；发布、提交、推送需要用户另行授权。
- 未实现 M2–M4：TypedArray 环形缓冲、独立 npm 包、任意曲面、WebGPU、自碰撞和物理模型。这些是后续研究范围，不是本阶段缺陷。
- JavaScript 完全禁用路径保留了 `noscript` 内容，但本轮没有单独启动禁用脚本的浏览器截图；WebGL 能力回退已通过真实浏览器验证。

### 归档边界

- 保持 Pages 演示、源代码和文档可访问，但不安排主动迭代。
- 不把当前研究台发布为通用 npm 库；现有抽象仍需要第二种对象验证。
- 恢复研究必须由具体需求触发，入口和验收条件见 [`studies/snakey-locomotion/ARCHIVE.md`](../../../studies/snakey-locomotion/ARCHIVE.md)。

## 4. 证据与验证

- `npm run build`：TypeScript 和 Vite 生产构建通过。
- Playwright Chromium：桌面、平板、390px 手机、四种模式、参数、暂停、研究 tabs、抽屉、Escape、焦点返回和 reduced-motion 通过。
- 禁用 WebGL：回退说明和全部研究内容可读。
- Pages 临时组装：根卡片、SVG 预览、真实点击、子路径 CSS/JS/Canvas 和两种响应式入口通过。
- 源码 `index.html` 不可作为 standalone 文件运行；直接使用 `file://` 时会显示启动说明，正式体验入口必须是 Vite 或 Pages 的 HTTP URL。
- 详细记录见 [validation.md](validation.md)，最终截图位于忽略目录 `.tmp/snakey-browser-evidence/`。

## 5. 下一阶段首先做什么

如果继续 M2，第一步应把 `PathHistory` 改为可测试的 TypedArray 环形缓冲，并新增第二个外观完全不同的长体对象（建议触手或动态电缆）。只有第二个对象无需复制蛇类业务代码即可接入，才能证明当前抽象真正可复用。

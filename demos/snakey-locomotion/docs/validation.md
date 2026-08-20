# Snakey Locomotion 浏览器验收

## 运行环境

```text
Start command: npm run dev -- --host 127.0.0.1 --port 4198
Canonical local URL: http://127.0.0.1:4198/
Pages assembly URL: http://127.0.0.1:4199/snakey-locomotion/
Browser: bundled Playwright Chromium Headless
Date: 2026-08-20
Theme boundary: dark only
```

生产构建通过：`tsc && vite build`。最终产物包含相对路径 HTML、CSS、Three.js 应用 bundle 与 sourcemap，可由 GitHub Pages 子路径直接加载。

## 首轮运行时缺陷与修复

构建没有发现地形 `MeshStandardMaterial.onBeforeCompile` 中的 GLSL 错误。首次真实浏览器检查捕获到片元着色器引用未声明的 `vUv`，地形程序无法链接。

修复方式：在顶点阶段显式传递 `vTerrainWorld`，片元噪声改为使用世界坐标 `vTerrainWorld.xz`。修复后重新执行完整矩阵，所有正常 WebGL 页面均无控制台或页面错误。

## Revision 1：源码直开入口

用户从 `file:///.../index.html` 打开源码时，Vite 没有参与 TypeScript、CSS 与模块资源处理，因此看到的是残缺页面，而不是 WebGL 展厅。该地址不属于应用的运行时入口。

修复结果：`file://` 现在只显示自包含的运行说明、PowerShell 启动命令和 canonical HTTP 链接，不再加载 Three.js；HTTP 开发入口继续显示 Canvas、默认“地面蜿蜒”状态和完整 UI。两种入口均无控制台或页面错误，生产构建再次通过。

Revision 1 证据：

- `.tmp/snakey-browser-evidence/http-entry-revision-1.png`
- `.tmp/snakey-browser-evidence/file-entry-guidance.png`

## Revision 2：归档与部署准备

- 根 README、研究总入口、演示 README、研究记录和交接文档统一标记为“已归档 / 按需复用”。
- `studies/snakey-locomotion/ARCHIVE.md` 保存停止原因、保留资产、重新启用条件、推荐扩展顺序和恢复验收清单。
- 归档不移除 Pages 路径；`/snakey-locomotion/` 继续作为可运行技术备份发布。
- 发布前重新执行 `npm ci`、TypeScript 检查和 Vite 生产构建；依赖审计为 0 个漏洞。

## 远端发布证据

| 项目 | 结果 |
| --- | --- |
| 实现与归档提交 | `f027a41c347051028347c1434175fd9a98e614af` |
| GitHub Actions | `32358286573`，`completed / success` |
| 生产地址 | <https://yydshly.github.io/0819_githubcode_study/snakey-locomotion/> |
| 总入口 | 显示“已归档 / 按需复用”，四张项目卡片 |
| WebGL | Canvas 创建成功，默认模式可见，成功切换到“交互场” |
| 移动端 | 390 × 844，无横向溢出 |
| 归档文档 | `/studies/snakey-locomotion/ARCHIVE.md` 返回 HTTP 200 |
| 控制台 / 页面错误 | 0 / 0 |

生产截图保存在忽略目录 `.tmp/snakey-browser-evidence/production-archive-desktop.png` 与 `production-archive-mobile.png`。

## 主体验矩阵

| 表面 / 状态 | 操作 | 可见结果 | 结论 |
| --- | --- | --- | --- |
| 桌面默认 1440×1000 | 打开页面并等待实时场景 | Canvas、蛇、地形、草地、参数面板、研究面板和 FPS 可见 | pass |
| 地面蜿蜒 | 默认运行 | 头部移动，身体沿历史路径重建 | pass |
| 曲面攀爬 | 点击“曲面攀爬” | 模式标题更新，蛇身沿树干圆柱曲面螺旋移动 | pass |
| 交互场 | 点击“交互场” | 交互纹理自动开启，蛇身痕迹和植被反馈可见 | pass |
| 结构解剖 | 点击“结构解剖” | 轨迹与局部标架开关选中，场景出现路径和三轴标记 | pass |
| 参数实验 | 波幅调整为 0.55 | output 更新为 `0.55`，运动参数写入模拟 | pass |
| 暂停 / 恢复 | 点击顶部按钮两次 | `aria-pressed`、正文状态类与运行标签同步 | pass |
| 研究标签 | 点击并用左右方向键切换 | tab 与 tabpanel 同步，键盘导航可用 | pass |

桌面代表性无头场景记录约 20 FPS。该环境可能使用软件或虚拟 GPU，只作为持续渲染与计数器工作的烟雾证据，不作为真实设备性能结论。

## 跨表面与前景层

| 视口 | 场景与主控件 | 研究层 | 溢出 | 结论 |
| --- | --- | --- | --- | --- |
| 1440×1000 | 左侧实验台、右侧研究面板持续可见 | 固定前景面板 | 无 | pass |
| 900×900 | 场景持续可见，研究按钮可达 | 覆盖层；Escape 关闭并把焦点返回按钮 | 无 | pass |
| 390×844 | 四模式、参数、触控方向键可达 | 底部 sheet；关闭按钮可用 | 无 | pass |

移动 sheet 打开时保留场景上下文并有 backdrop；关闭、Escape、焦点返回和 Tab 环路均由交互脚本覆盖。单一深色主题是明确支持边界，不提供主题切换。

## 动效与能力回退

| 条件 | 验收结果 | 结论 |
| --- | --- | --- |
| `prefers-reduced-motion: reduce` | 页面首次进入为暂停状态；非必要 CSS 过渡被移除；研究内容可操作 | pass |
| Chromium 禁用 WebGL | 显示语义化回退说明，不显示空白页 | pass |
| WebGL 回退中点击“打开研究笔记” | 四个研究 section 全部可阅读 | pass |
| JavaScript 关闭 | `noscript` 提供研究范围和文档入口 | 源码确认；浏览器禁用脚本路径未单独截图 |

## Pages 组装与总入口

按工作流结构将研究总入口、Snakey `dist` 和研究记录组装到临时站点：

- 根路径返回 200；Snakey 卡片和本地 SVG 预览加载成功。
- 真实点击到达 `/snakey-locomotion/`，构建后的 CSS、JS 与 WebGL Canvas 加载成功。
- 总入口 900px 与 390px 均显示 4 张项目卡片，无横向溢出。
- Snakey 页面自身没有 404、控制台错误或页面错误。

临时组装没有复制另外三个大型 Demo，因此根页面中它们的既有预览图片返回 404；正式工作流仍保留原有三个复制步骤。这一临时边界不属于 Snakey 路由缺陷。

## 证据文件

最终截图保存在仓库忽略目录 `.tmp/snakey-browser-evidence/`：

- `desktop-default.png`
- `desktop-climb.png`
- `desktop-anatomy.png`
- `mobile-research-sheet.png`
- `mobile-field.png`
- `webgl-fallback-notes.png`
- `hub-tablet.png`
- `hub-mobile.png`

这些图片用于本地验收，不作为产品资源提交。

## 结论

本地 Web 研究台、生产构建、四种实验、跨视口前景层、键盘路径、reduced-motion、WebGL 回退以及 Pages 子路径均通过约定验收。远端 GitHub Pages 尚未在本次任务中发布或验证。

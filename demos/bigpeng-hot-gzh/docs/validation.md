# 浏览器验收

2026-08-20 已在本机 Chromium 完成实际运行验收。

## 规范运行环境

- 启动命令：`python -m http.server 4178 --directory demos/bigpeng-hot-gzh`
- 规范 URL：<http://127.0.0.1:4178/>
- 主题：浅色、深色
- 视口：1440×900、768×1024、390×844
- 主要旅程：路径 A 生成、路径 B 生成、自定义字段、复制 Agent 指令、主题切换

## 验收记录

| 时间 | 环境 | 表面 / 状态 | 结果 | 证据 |
| --- | --- | --- | --- | --- |
| 2026-08-20 | Chromium headless，1440×900，浅色 | 路径 A 默认预设 | pass | 6 条候选、1 条首选、无水平溢出；[`desktop-light.png`](evidence/desktop-light.png) |
| 2026-08-20 | Chromium headless，1440×900 | 路径 B 与自定义对象 | pass | 4 个方向，每个方向 3 条标题；自定义 `Claude Code 办公自动化` 出现在输出 |
| 2026-08-20 | Chromium headless，768×1024 | 平板布局 | pass | 生成表单可见，无水平溢出 |
| 2026-08-20 | Chromium headless，390×844，深色 | 移动布局和路径 B | pass | 两个路径控件、表单和输出可见，无水平溢出；[`mobile-dark.png`](evidence/mobile-dark.png) |
| 2026-08-20 | Chromium headless | 复制指令和反馈 | pass | Clipboard 中包含 `用 bigpeng-hot-gzh`，按钮与 toast 进入“已复制”状态 |
| 2026-08-20 | Chromium headless | 错误、键盘、焦点与 reduced-motion | pass | 空必填输入显示错误；左/右方向键切换 tab；主操作有可见 outline；减少动效时 `scroll-behavior: auto` |
| 2026-08-20 | 本地 Pages 局部组装，4179 | 新增总入口路由 | pass | 仅验证本次新增项：计数为 08，BigPeng 卡片唯一，可跳转到 `/bigpeng-hot-gzh/` |

## 交互回归结果

```json
{
  "pathA": { "candidates": 6, "winner": true },
  "pathB": { "directions": 4, "titlesPerDirection": [3, 3, 3, 3] },
  "customInput": true,
  "inputError": true,
  "clipboard": true,
  "themeToggleBothDirections": true,
  "keyboardTabs": true,
  "visibleFocus": true,
  "reducedMotion": true,
  "horizontalOverflow": false,
  "pageErrors": [],
  "consoleErrors": []
}
```

## 验收中发现并修复

首轮键盘验收发现：方向键根据“当前选中路径”而不是“焦点所在 tab”计算下一项，在焦点与选中状态不一致时会切换错误。现已改为以焦点 tab 为基准，完整回归通过。

## 不适用项

- 无弹窗、菜单或覆盖层，因此无 Escape / 焦点返回验收项。
- 无远程 API、图片、视频或高成本渲染，不需要额外性能降级路径。
- 页面只支持中文演示；本次不宣称其他 locale 已验证。

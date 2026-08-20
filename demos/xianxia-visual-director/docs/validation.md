# 浏览器验收

## 运行环境

| 字段 | 内容 |
| --- | --- |
| 命令 | `python -m http.server 4175 --directory demos/xianxia-visual-director` |
| 规范 URL | `http://127.0.0.1:4175/` |
| 验收时间 | 2026-08-20（Asia/Shanghai） |
| 浏览器路径 | 工作区内置 Playwright + Chromium Headless |
| 支持主题 | 单一编辑型主题；页面内深色原理段是内容区域，不是可切换主题 |

预期的 `agent-browser` CLI 在当前环境没有可执行入口，因此改用工作区自带的真实 Chromium 完成同等检查。截图保存在根目录已忽略的 `.tmp/xianxia-browser-evidence/`，不作为产品文件提交。

## 视口结果

| 视口 | HTTP | 页面内容 | 三种场景键盘切换 | 图片 | 横向溢出 | 控制台 / 页面错误 |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 × 1000 | 200 | pass | pass | 3/3 加载 | 无 | 0 / 0 |
| 900 × 900 | 200 | pass | pass | 3/3 加载 | 无 | 0 / 0 |
| 390 × 844 | 200 | pass | pass | 3/3 加载 | 无 | 0 / 0 |

每个场景都验证了 `aria-selected=true`、对应图片路径、标题内容和键盘焦点。单体仙境、神域聚居地、苍穹巨构三种状态均能用 Enter 触发。

## 交互与可访问性

- 提示词复制：剪贴板内容与当前提示词摘要完全相同。
- 键盘焦点：场景按钮为 `3px solid` 可见轮廓；链接和复制按钮使用同一焦点语义。
- 图片替代文本：三张场景图片均有独立中文 `alt`。
- Reduced motion：390px 测试在 `prefers-reduced-motion: reduce` 下得到 `transition-duration: 0s`。
- 语义：场景按钮使用 `role=tab`、`aria-selected` 和原生 `button`。

## 视觉观察

- 桌面端首屏先呈现项目定位，场景实验保持“图像主视觉 + 规则说明”双栏结构。
- 平板端转换为单列，不遮挡场景标签和 Prompt 摘要。
- 390px 手机端标题、按钮、三种场景标签、图片、详情和原理链路均按阅读顺序排列。
- 页面文本即使图片加载失败仍能说明项目定位、场景目标和原理，不依赖图片完成核心理解。

## 不适用项

- 无暗色 / 亮色主题切换。
- 无弹窗、表单、登录、加载态、空状态和错误恢复状态。
- 无 WebGL、视频、远程 API 或后端能力。
- 页面只支持中文研究语境，不声明多语言适配。

## 工程检查

- 三张生成图、HTML、CSS、JavaScript、研究 README 和生成记录均存在。
- GitHub Pages 工作流已加入 `demos/xianxia-visual-director/**` 与 `studies/xianxia-visual-director/**` 路径，并组装到 `/xianxia-visual-director/`。
- 当前 Python 环境没有 PyYAML，因此未增加额外 YAML 解析依赖；工作流改动按现有相邻项目的结构和缩进扩展。

结论：约定范围内的展示页浏览器验收通过，无 `continue`、`defer` 或 `blocked` 项。

# 浏览器验收记录

规范运行地址：`http://127.0.0.1:4173/`。

## Runtime

- Start command：`python -m http.server 4173 --bind 127.0.0.1 --directory demos/outfit-director`
- Browser automation：`agent-browser 0.27.0`，Chromium 无头模式
- Timestamp：2026-08-20（Asia/Shanghai）

## Evidence

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440×1000 / dark / K default | pass | 首屏、三列工作台、5 造型母图和参数输出可见；无错误覆盖 |
| Desktop | 1440×1000 / dark / pet D | pass | 7 套宠物造型、M13、6 个时间点和参数输出同步 |
| Desktop | 1440×1000 / light / final state | pass | 深浅主题切换后层级、边界和文字保持清晰 |
| Tablet | 1024×900 | pass | 输出面板转换为整行详情区；`scrollWidth <= clientWidth` |
| Mobile | 390×844 / dark | pass | 单列任务流、控件、舞台、标签和正文无横向溢出 |
| Pointer | Generate journey | pass | 滚入视口后点击生成，输出切换为女性 / K / 东方叙事 |
| Keyboard | Primary journey | pass | 聚焦生成按钮并按 Enter；标签、复制和主题操作均可用 |
| State | K playback | pass | 4 个侧边造型永久清空，中央为最终造型，读数 `09.0 / 09.0s` |
| State | Tabs and copy | pass | 切到精简视频提示词；反馈为“已复制：精简视频提示词” |
| Motion | Reduced motion | pass | 媒体查询为 true；播放立即完成并显示可读完成提示 |
| Runtime | Errors and resources | pass | 页面错误为空；HTML、CSS、JS、SVG 四个本地请求均为 200 |
| Performance | Local static server | pass | TTFB 0.7ms；FCP/LCP 48ms；CLS 0 |

## Final visual evidence

- Desktop dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787155635728.png`
- Desktop light：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156092737.png`
- Tablet light：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156122724.png`
- Mobile dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156149014.png`

截图保存在浏览器工具的临时证据目录，不进入产品提交。

## Applicable boundaries

- 单一中文界面，不提供语言切换；已检查中文长标签在 390px 下的换行和控制宽度。
- 不使用模态框、抽屉、外部 API、媒体资源、Canvas 或 WebGL，因此加载、错误恢复、前景关闭和增强渲染回退不适用。
- 页面模拟规则输出，不验证真实图像/视频模型的生成质量。

## Terminal audit

- continue：无
- defer：无
- blocked：无

所有契约内交付项均为 `pass`，本地网页演示范围关闭。公开 GitHub Pages 发布属于后续远端操作。

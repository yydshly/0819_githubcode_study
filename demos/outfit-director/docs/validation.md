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
- 不使用模态框、抽屉、外部 API、Canvas 或 WebGL。Revision 2 新增一张延迟载入的本地写实图片，并提供色块与文字降级状态。
- 页面模拟规则输出和预生成视觉切换，不验证真实图像/视频模型的生成质量或真实虚拟试衣准确度。

## Revision 2 · 双实验验收

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440px / A default | pass | A/B 导航、模型选择、人物/衣服素材和原三列工作台完整可见 |
| A interaction | 身份优先图像 + 动作优先 I2V | pass | 首帧输出出现模型适配、Image 1 与素材边界；视频输出出现目标模型与首帧输入规则 |
| A upload | 本地人物 + 单个衣服文件 | pass | 参数输出同步为 `Image 1「fictional-model-five-looks.png」` 与 `Image 2`；无网络上传 |
| Desktop | 1440px / B / look 01 | pass | 写实虚构人物全身、五套衣橱、证明面板和 2D 边界可见 |
| B interaction | look 05 | pass | 舞台切至黑色礼服；衣橱、造型名称和证明面板同步 |
| B autoplay | 从 look 05 重新开始 | pass | 自动回到第 1 套并依序运行，结束停留第 5 套且按钮恢复“自动换装” |
| Tablet | 1024×900 / B | pass | `scrollWidth = clientWidth = 1009`，无横向溢出 |
| Mobile | 390×844 / B | pass | 衣橱两列、写实舞台、证明面板与能力区按任务顺序单列展示 |
| Theme | Tablet / light | pass | `data-theme=light`，正文计算颜色 `rgb(21, 32, 27)` |
| Motion | B / reduced-motion | pass | 自动换装立即到达 `LOOK 05 · 黑色礼服`，结果可读 |
| Runtime | Errors | pass | 浏览器页面错误为空；JavaScript 语法检查通过 |
| Performance | Local static server | pass | 预生成素材 1,748,951 bytes，仅进入 B 时加载；FCP 84ms，DCL 52.4ms |

### Revision 2 visual evidence

- Desktop A：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157589431.png`
- Desktop B / look 01：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157617145.png`
- Desktop B / look 05：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157707477.png`
- Mobile B / look 05：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157880046.png`

Revision 2 截图同样只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 3 · 提示词优先与网页效果优化

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440px / A / T2V default | pass | SIMPLE / T2V 为默认路线；I2V 专用首帧和素材字段隐藏；视频标签默认激活 |
| A interaction | T2V submit | pass | 提交后仍停留视频标签；输出以“纯文本生成视频 T2V”开头，包含画幅、主体、造型顺序、时间点与硬性限制 |
| A interaction | Copy | pass | 复制反馈为“已复制：直接视频提示词” |
| A interaction | I2V selected | pass | 首帧模型、人物与衣服字段按需出现；输出明确要求把确认后的首帧作为唯一视频输入 |
| A state | I2V → T2V | pass | 路线切换后输出立即同步，不保留上一条路线的旧提示词 |
| Desktop | 1440px / B / veil | pass | 布料扫光触发 `is-changing`，舞台、衣橱和证明面板同步到第 4 套 |
| B interaction | Beat / manual | pass | 卡点闪切触发 `data-effect=beat`，结果同步到第 5 套 |
| B interaction | Autoplay | pass | 自动播放结束为 `LOOK 05`，按钮恢复“自动换装”，过渡类清理 |
| Mobile | 390×844 / A and B | pass | 两路线单列可读，效果选择器占完整一行；`scrollWidth = clientWidth = 375` |
| Tablet | 1024×900 / light | pass | 浅色主题正常，`scrollWidth = clientWidth = 1009` |
| Keyboard | Experiment navigation | pass | 焦点位于 A 标签时按 Enter 可切换；工作台显示、`aria-selected=true`、焦点 outline 为 solid |
| Motion | B / reduced-motion | pass | 重置后自动换装立即到达 `LOOK 05`，舞台无 `is-changing` 类 |
| Runtime | Errors and overlay | pass | 浏览器错误为空；正文非空；无框架错误覆盖；JavaScript 语法检查通过 |
| Performance | Static runtime | pass | 未新增图片或运行时依赖；首次绘制 64ms |

### Revision 3 visual evidence

- Desktop A / T2V：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787190761232.png`
- Desktop B / veil：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787190957022.png`
- Mobile A：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787191110919.png`
- Mobile B：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787191200437.png`

Revision 3 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Terminal audit

- continue：无
- defer：无
- blocked：无

所有契约内交付项均为 `pass`，本地网页演示范围关闭。公开 GitHub Pages 发布属于后续远端操作。

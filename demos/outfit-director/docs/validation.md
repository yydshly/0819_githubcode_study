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

## Revision 4 · 技术路线与能力接入展示

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Repository | 总体规划 | pass | `docs/virtual-tryon-technology-roadmap.md` 包含五目标、M0–M7 阶段、能力矩阵、项目拆分、评估与决策门槛 |
| Root index | 路线入口 | pass | 根 README 提供路线链接、五目标状态和近期 E001 动作 |
| Desktop | 1440×1000 / dark / goal 01 | pass | 五目标导航、当前研究位置、目标一详情和 M0–M7 里程碑完整可见 |
| Roadmap | goal 02 | pass | 详情同步为“基于全身照的 2D AI 虚拟试衣”，状态为“下一阶段”，输入 / 能力 / 输出 / 完成标准同步更新 |
| Roadmap CTA | goal 01 → A | pass | CTA 后 `experiment=prompt`，A 显示、B 隐藏 |
| Roadmap CTA | goal 02 → B | pass | CTA 后 `experiment=visual`，B 显示、A 隐藏，并滚动至视觉原型 |
| Keyboard | goal 02 + ArrowRight | pass | 选中与焦点同步到 goal 03，详情标题为“3D 参数化虚拟试衣间” |
| Tablet | 1024×900 / light / goal 03 | pass | 左侧目标、右侧详情保持可读；`scrollWidth 1009 < innerWidth 1024` |
| Mobile | 390×844 / light / goal 02 | pass | 目标列表、详情、流程和三类能力按单列展开；`scrollWidth 375 < innerWidth 390` |
| Runtime | Errors and syntax | pass | 浏览器错误与控制台为空；`node --check` 与 `git diff --check` 通过 |
| Assets | Static runtime | pass | 路线展示仅新增 HTML / CSS / JS / Markdown，不新增图片、模型或运行时依赖 |

### Revision 4 visual evidence

- Desktop dark / goal 01：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194809125.png`
- Tablet light / goal 03：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194956407.png`
- Mobile light / goal list：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194992138.png`
- Mobile light / goal 02 detail：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787195010047.png`

Revision 4 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 5 · Female Outfit Director 规则接入

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Source | female variant pin | pass | 上游固定为 `2d30d40d09368aab333d054c035289061c9fcf47`；MIT、来源和适配边界已写入仓库 |
| Static data | profiles / mechanisms / presets | pass | 女性 profile、M1–M13 与四类预设分离；页面加载三个数据文件且回退数据仍可用 |
| Desktop A | 1440px / dark / female / M12 | pass | 女性专项字段展开；视频输出包含女性身份锚点、妆容/配饰/衣料和 M12 衣纹执行规则 |
| A route guard | female → male | pass | 自动切回 `general`，专项字段隐藏，K 机制由 12 个回到 4 个网页可预览项 |
| Desktop B | M1 / M2 / M8 / M10 | pass | 四种选择分别产生 `effect-person-fly`、`effect-veil`、`effect-sticker-flip`、`effect-beat`，造型名称与结果同步 |
| Capability boundary | A and B notices | pass | 页面明确 4 个网页模拟、8 个外部提示词专用；未声称真实服装迁移 |
| Keyboard | female profile | pass | 聚焦女性专项单选并按 Space 后保持焦点、选中状态与字段可见状态同步 |
| Tablet | 1024×900 / light / female | pass | `scrollWidth 1009 < innerWidth 1024`，新增配置和状态母图保持双栏可读 |
| Mobile A | 390×844 / dark / female | pass | 完整单列流程可读；`scrollWidth 375 < innerWidth 390` |
| Mobile B | 390×844 / dark | pass | 衣橱、写实舞台和效果说明按任务顺序单列，无横向溢出 |
| Motion | B / reduced-motion | pass | 媒体查询为 true；自动换装直接到“黑色礼服 · 夜间造型”，无 `is-changing`，按钮保持“自动换装” |
| Runtime | errors / console / syntax | pass | 页面错误和控制台为空；JavaScript 语法与 Git 空白检查通过 |

### Revision 5 visual evidence

- Desktop A / 女性专项 M12：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196349708.png`
- Desktop B / M1：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196280881.png`
- Tablet light / 女性专项：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196433422.png`
- Mobile A / 女性专项：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196590887.png`
- Mobile B：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196650034.png`

Revision 5 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 6 · E001 MiniMax H3 真实视频回填

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Asset | MP4 provenance | pass | 项目文件 1,819,595 bytes；SHA-256 `54EC7D3F50483CC786C3A505FC2D310B6DE7EE20819FD3DC885DE2008505A952` 与用户源文件一致 |
| Media | ffprobe | pass | 15.083333s；1344×768；H.264；24fps；AAC 32kHz 双声道；音轨平均约 -9.3dB |
| Baseline | eight planned samples | pass | 七套造型、单一全身女性和固定摄影棚可见；身份与服装精确度记为 partial；实际横版记为 fail |
| Timing | six change windows | pass | scene-change 近似点为 1.958 / 3.833 / 6.000 / 8.125 / 10.458 / 12.375 秒；平均绝对偏差约 0.325 秒 |
| Rule regression | T2V / D / M13 | pass | 选项与输出为“舞蹈峰值原地换装”；包含单一主体执行规则；不再输出“侧边激活” |
| Desktop | 1440×1000 / dark / E001 | pass | 播放器与基线观察形成双栏；媒体事实、状态、直接链接和提示词入口可见 |
| Playback | native controls | pass | 无 autoplay；`controls=true`、`preload=metadata`、duration 15.083333；点击播放后时间推进并可暂停 |
| Keyboard | prompt details | pass | `summary` 获得焦点后按 Enter，`details.open=true` 且焦点保留 |
| Tablet | 1024×900 / light | pass | 视频与观察区改为纵向层级；`scrollWidth 1009 < innerWidth 1024` |
| Mobile | 390×844 / dark | pass | 播放器、操作链接和评估卡单列；`scrollWidth 375 < innerWidth 390` |
| Fallback | static media | pass | MP4 返回 200 `video/mp4`；poster 返回 200 `image/jpeg`；播放器内含文字回退和直接 MP4 链接 |
| Performance | no autoplay / metadata | pass | 独立未播放会话观察到 poster 32,617B、MP4 metadata 响应 300B；视频不作为首屏交互依赖 |
| Runtime | errors / console / syntax | pass | 浏览器错误和控制台为空；`node --check` 与 `git diff --check` 通过 |

### Revision 6 visual evidence

- Desktop dark / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197567514.png`
- Tablet light / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197758311.png`
- Mobile dark / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197793977.png`
- Keyframe contact sheet：`E:\0819_codex_project\.tmp\e001-frames\contact-sheet.png`
- First-transition contact sheet：`E:\0819_codex_project\.tmp\e001-transition-01\contact-sheet.png`

浏览器截图和关键帧接触表属于临时验证证据，不进入产品提交；可复现结论保存在 E001 实验档案中。

## Terminal audit

- continue：无
- defer：无
- blocked：无

所有契约内交付项均为 `pass`，本地网页演示范围关闭。公开 GitHub Pages 发布属于后续远端操作。

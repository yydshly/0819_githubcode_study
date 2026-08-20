# Outfit Director 能力实验室｜设计契约

## Contract

- Entry mode：Revision-led implementation
- Request revision：2
- Target user and context：访问研究主库的 AIGC 创作者、提示词设计者和开发者；现在既要生成可交给外部模型的提示词，也要在网页中看见写实人物的换装演示。
- Desired first impression：专业、清晰、有导演台的节奏感；进入首屏即可知道这是“换装编排能力演示”，而不是虚拟试衣商城。
- Visual ambition：Editorial
- Experience architecture：Hybrid Workspace
- Visual constraints：保留深色导演工作台与浅色主题；加入项目内置的虚构写实人物五造型素材；不依赖外部字体、Canvas、WebGL 或运行时网络资源。
- Information constraints：明确区分“提示词导演”和“网页换装实验”；前者输出给外部模型，后者使用预生成素材做视觉模拟，均不伪装成浏览器内实时生成。
- Operation constraints：纯前端、无登录、无后端、无真实 API；支持鼠标、触摸和键盘；相对路径资源可部署到 GitHub Pages 子路径。
- State constraints：保留原有女性、男性、宠物与 K/D 编排；新增 A/B 实验切换、目标图像/视频模型、人物与衣服素材、提示词导出、写实衣橱、单套换装与自动轮播。
- Environment constraints：现代 Chromium、Firefox、Safari；桌面、平板和 390px 手机；支持 `prefers-reduced-motion`。
- Primary journey A：选择人物/服装来源和目标生成模型 → 生成首帧与视频提示词 → 复制给外部模型。
- Primary journey B：选择内置写实人物的服装 → 网页立即切换完整造型 → 播放五套造型演示 → 返回选择状态。
- User-defined phases：A 提示词导演测试、B 网页换装测试、跨设备验收、素材与边界说明。
- Required artifacts：可运行双实验页面、虚构写实五造型素材、项目 README、设计契约、浏览器验收记录、交接说明。
- Autonomy authorization：用户于 2026-08-19 明确要求“请先继续，如果有需要请和我交互”，授权在既定范围内直接实施和验证。
- User-decision boundary：接入真实图像/视频 API、处理用户敏感照片、购买服务、创建独立远端仓库、修改公开部署权限或改变品牌方向时再询问。
- Observable completion criteria：A 实验能选择模型与衣服并输出模型感知的首帧/视频提示词；B 实验能用写实五造型素材完成点击换装和自动演示；两者明确能力边界；素材失败时仍有可读回退；桌面/平板/390px、深浅主题、键盘和 reduced-motion 可用；浏览器无错误覆盖。

## Hybrid workspace architecture

- Scene base：A 实验保留语义化 DOM + CSS + SVG 结构预览；B 实验使用项目内置写实联系人表图像，通过 CSS 裁切为五个造型画面。
- Scene persistence：桌面和平板配置时持续可见；进入输出详情不替换舞台。手机端按“配置 → 舞台 → 输出”形成单列任务流，允许舞台随页面滚动，但不隐藏或折叠。
- Scene actions：A 实验的生成、播放/暂停、重置和时间点选择；B 实验的衣橱选择、自动换装和重置属于舞台操作。
- Detail actions：模型配置、素材来源、提示词全文、负面约束、复制和实验边界属于文档详情流。
- Foreground control model：左侧配置面板、中央舞台工具条、右侧标签式输出检查器；轻量状态提示不抢占焦点。
- State-to-scene mapping：A 实验保留结构状态机；B 实验中衣橱选中态、人物写实图像和当前服装名称同步，自动播放按衣橱顺序切换，完成后停留在最终造型。
- Mobile transformation：三列转换为单列任务流，主要操作保持在对应区域顶部，不引入抽屉或模态框。
- Fallback：写实素材加载失败时显示可读色块、服装文字和错误状态；关闭动画时造型立即切换，意义不依赖淡入淡出。

## Design direction

| Layer | Decision | Observable consequence |
| --- | --- | --- |
| Composition | 三段式工作台：配置、视觉舞台、输出检查器 | 桌面首屏完成主要闭环；窄屏按任务顺序堆叠 |
| Focal hierarchy | 首帧舞台是主视觉，生成按钮是主操作 | 不使用与主操作竞争的大型营销 CTA |
| Typography | 系统无衬线正文，窄体大写标签承担导演台元数据 | 无网络字体时仍保持角色区分 |
| Palette | 默认深墨色，荧光薄荷表示激活，珊瑚色表示换装点 | 状态含义不只依赖颜色，配合文字和形状 |
| Material | 低透明面板、细边框、轻网格 | 保持技术感，不使用高成本模糊或图片纹理 |
| Depth | 舞台高于配置和输出面板，浮层仅用于轻量提示 | 不引入模态框，不阻塞主要操作 |
| Density | 控制项分组；输出使用标签页渐进披露 | 手机端不展示三列并排密集内容 |
| Motion | 仅用来解释“激活 → 消费 → 中央换装” | reduced-motion 下立即切换状态并保留文字反馈 |

## Coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 配置 | 可运行初始页面 | Desktop / dark / default | Browser screenshot + DOM observation | Stage 1 | pass | 页面加载且核心区域可识别 |
| 首帧预览 | 主视觉层级清楚 | Desktop / K default | Browser screenshot | Stage 2 | pass | 舞台为工作台主视觉，配置与输出权重清楚 |
| 配置 | 信息顺序与三列布局 | Desktop / tablet / mobile | Viewport screenshots | Stage 3 | pass | 1440/1024/390px 无横向溢出或遮挡 |
| 配置 | 所有控件可发现且有状态 | Pointer + keyboard | Snapshot + focus observation | Stage 4 | pass | 标签、语义控件、指针点击、Enter 和焦点环通过 |
| 时间轴演示 | K 与 D 主流程可完成 | K and D / play and reset | Recorded DOM state transitions | Stage 5 | pass | 5/7 造型、模式输出、清空状态和最终读数通过 |
| 输出阅读 | 标签切换、复制和反馈正确 | Tabs / copy success | Browser interaction observation | Stage 6 | pass | 视频标签与复制状态反馈通过 |
| 跨设备验收 | 主题、视口和键盘可用 | 1440 / 1024 / 390, dark/light | Screenshots + keyboard path | Stage 7 | pass | 深浅主题和三视口均通过 |
| 跨设备验收 | reduced-motion 保留信息 | Reduced motion | Browser media emulation or CSS evidence | Stage 7 | pass | 直接到达最终状态并保留文字反馈 |
| 工程 | 无高成本资产且首屏响应及时 | Default runtime | Resource/performance observation | Stage 8 | pass | 四个本地资源，LCP 48ms，CLS 0 |
| 交付 | README、验收和交接完整 | Repository | File + build/runtime evidence | Stage 9 | pass | 必要文件与终审记录齐全 |

## Revision 2 direction

| Decision | Preserved | Revised requirement | Acceptance criterion |
| --- | --- | --- | --- |
| Composition | 原有导演工作台视觉语言 | 在工作台前增加 A/B 实验导航；两条主流程一次只展示一条 | 用户能在首屏区分“输出提示词”和“网页换装” |
| Visual anchor | 原有 SVG 状态母图 | B 实验以虚构写实五造型人物为主视觉 | 写实素材完整全身、身份尽量一致且无第三方权利风险 |
| Controls | 语义表单、标签和复制反馈 | 新增生成模型、素材来源、衣橱和自动换装控件 | 指针、触摸和键盘均可完成两条流程 |
| State feedback | 激活、清空、完成与 toast | 新增衣服选中、图像切换、自动播放和素材边界状态 | 视觉和文字同时表达当前造型 |
| Responsive | 1440/1024/390px | 新增素材和衣橱区域不能产生横向溢出 | 两实验在三个视口均完成主流程 |
| Motion | reduced-motion 立即完成 | 写实换装淡入淡出同样受 reduced-motion 约束 | 减少动态效果时点击与自动演示仍保留结果 |

## Revision 2 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| A 提示词导演测试 | 目标图像/视频模型和素材配置 | Desktop / A default | Browser screenshot + DOM | Stage 3 | pass | 两类模型选择与本地文件字段可用 |
| A 提示词导演测试 | 输出随模型、服装和模式更新 | K/D / built-in and uploaded assets | Browser interaction + output text | Stage 5 | pass | 身份优先图像与动作优先视频策略实测通过 |
| A 提示词导演测试 | 可复制给外部模型的结果 | Image/video/negative tabs | Copy feedback + text evidence | Stage 6 | pass | 原复制流程保留，新增输出为纯文本可复制结构 |
| B 网页换装测试 | 写实五造型素材加载 | Default + asset fallback | Screenshot + resource observation | Stage 2 | pass | 1774×887 本地素材按需载入且可读降级 |
| B 网页换装测试 | 点击衣橱切换完整造型 | Five wardrobe items | Browser interaction | Stage 5 | pass | 第 1/5 套视觉、名称、证明面板同步通过 |
| B 网页换装测试 | 自动换装与重置 | Play / complete / reset | DOM state transition | Stage 6 | pass | 自动停留第 5 套，重置回第 1 套 |
| 素材与边界说明 | 区分预生成模拟与真实模型 | A/B visible notices | Browser text observation | Stage 3 | pass | 首屏、B 标题区和证明面板均有边界说明 |
| 跨设备验收 | 两实验在深浅主题和三视口可用 | 1440/1024/390 | Screenshots + overflow check | Stage 7 | pass | 桌面与手机截图通过；1024px `scrollWidth = clientWidth` |
| 跨设备验收 | 键盘与 reduced-motion | A/B primary controls | Keyboard + media emulation | Stage 7 | pass | 语义按钮/标签可聚焦；B 无动画路径直接到第 5 套 |
| 工程 | 素材大小和加载性能可接受 | Static runtime | Resource + vitals observation | Stage 8 | pass | 素材 1.75 MB 延迟到 B；FCP 84ms，页面错误为空 |
| 交付 | README、验收、交接和素材说明更新 | Repository | File + terminal audit | Stage 9 | pass | 文档与素材来源说明完成 |

## Revision 3 direction

- Entry mode：Revision-led refinement。
- Request revision：3。
- User phases：第一，使用提示词直接交给外部视频模型；第二，保留并优化网页写实换装演示。
- Preserved：A/B 双实验、原 K/D 编排规则、素材本地读取、写实五造型资产、静态 GitHub Pages 兼容、无真实模型 API。
- Revised primary journey：默认进入 A → 选择“纯文本生成视频 T2V”或“首帧图生视频 I2V” → 生成后直接落到视频提示词 → 复制到外部模型；随后进入 B → 选择换装效果 → 手动或自动演示五套造型。
- Visual calibration：A 的生成路线与最终视频提示词成为第一视觉任务，参数和首帧退为可检查详情；B 的人物仍为主视觉，过渡光效只解释状态变化，不遮挡衣服和人物。
- Operation constraints：外部模型生成仍由用户执行；页面不声称已经生成视频，不引入后端、密钥或付费 API。
- State constraints：T2V 不要求首帧输入；I2V 明确先生成首帧再生成视频；B 提供柔和溶解、布料扫光和卡点闪切，并支持 reduced-motion 即时完成。
- Observable completion：A 默认能在一次提交后展示可复制视频提示词，并正确区分 T2V/I2V 输入说明；B 三种效果能改变可观察过渡且最终造型、衣橱选中态和证明面板一致；桌面、1024px、390px、深浅主题和键盘保持可用。
- Autonomy authorization：用户于 2026-08-20 明确要求两个方向都进行尝试并规定顺序，授权继续实现与验收。
- User-decision boundary：实际调用外部模型、上传真实人物照片、产生费用或持久化用户素材时再请求授权。

## Revision 3 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：提示词生成视频 | T2V / I2V 路线可选择且说明清楚 | A / default | Screenshot + DOM | Stage 3 | pass | T2V 默认，I2V 按需展开专用字段 |
| 第一：提示词生成视频 | 生成后默认落到视频提示词 | A / submit | Browser interaction + output text | Stage 5 | pass | 视频标签默认激活，提交后保持并刷新结果 |
| 第一：提示词生成视频 | T2V 不依赖首帧、I2V 明确首帧输入 | A / both routes | Prompt text observation | Stage 6 | pass | 两路线输入说明和提示词分支实测通过 |
| 第一：提示词生成视频 | 一键复制结果给外部模型 | A / video result | Copy feedback | Stage 6 | pass | 复制反馈显示“直接视频提示词” |
| 第二：网页效果优化 | 三种换装效果可选择 | B / manual | Screenshot + interaction | Stage 4 | pass | 柔和溶解、布料扫光、卡点闪切可选择 |
| 第二：网页效果优化 | 手动和自动换装结果一致 | B / look 01–05 | DOM + visual state | Stage 5 | pass | 手动结果同步；自动结束第 5 套并清理过渡类 |
| 第二：网页效果优化 | reduced-motion 保留结果 | B / reduced-motion | Media emulation | Stage 7 | pass | 即时到达第 5 套且不播放效果层 |
| 跨设备 | 双实验保持桌面、平板、手机可用 | 1440/1024/390 | Screenshots + overflow | Stage 7 | pass | 桌面/手机截图、平板无溢出与浅色主题通过 |
| 工程 | 动画不增加高成本运行时资产 | Static runtime | Resource/performance observation | Stage 8 | pass | 纯 CSS 效果；无新增媒体；FCP 64ms，错误为空 |
| 交付 | README、验收与交接同步 | Repository | File + terminal audit | Stage 9 | pass | 文档、语法、空白和状态审计完成 |

## Revision 4 direction

- Entry mode：Revision-led。
- Request revision：4。
- Target user：希望理解整个虚拟试衣研究版图、当前阶段和能力接入顺序的项目维护者与研究访客。
- Desired first impression：先看到一条可执行的技术路线，再进入当前已经可操作的提示词与网页实验。
- Visual ambition：Editorial。
- Experience architecture：Hybrid Workspace；现有 A/B 实验仍是操作区，新增路线展示是项目级导航与能力说明区。
- User phases：第一，规划文档正式落地；第二，Web 按目标、步骤和依赖展示能力接入路线。
- Information constraints：区分“已经演示”“下一步接入”“长期研究”，不把概念规划伪装成现成功能；五条目标分别为提示词视频、2D AI 试衣、3D 参数化试衣、实时 AR、尺码与穿搭智能。
- Operation constraints：路线卡片可选择并同步展示输入、核心能力、输出、接入步骤、完成标准和当前状态；不新增后端、模型接口或真实推理。
- Environment constraints：保持纯静态 GitHub Pages、深浅主题、桌面/1024px/390px、鼠标/触摸/键盘和 reduced-motion。
- Required artifacts：`docs/virtual-tryon-technology-roadmap.md`、根 README 路线入口、Web 技术路线区、更新后的演示 README、验收和交接记录。
- Autonomy authorization：用户于 2026-08-20 明确要求规划文档落地并在 Web 中整理展示，授权直接实施和验证。
- User-decision boundary：实际接入虚拟试衣模型、3D 资产、GPU 服务、摄像头权限、用户身体数据存储或外部付费服务时再确认。
- Observable completion：规划文档包含目标、阶段、能力依赖、验收门槛、项目拆分和近期动作；Web 可在五个目标之间切换，状态与详情同步，当前目标一突出且能返回 A/B 实验；三个视口、主题和键盘可用；浏览器错误为空。

## Revision 4 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：规划文档落地 | 总体技术路线文档 | Repository | File inspection | Stage 0 | pass | 五目标、M0–M7、依赖、验收、项目拆分与近期动作已落地 |
| 第一：规划文档落地 | 主索引可发现路线文档 | Root README | Link inspection | Stage 3 | pass | 已增加总体路线入口、状态表与 E001 近期动作 |
| 第二：Web 整理展示 | 五个目标与成熟度状态清楚 | Desktop / roadmap default | Screenshot + DOM | Stage 3 | pass | 五目标导航和当前研究位置清楚可见 |
| 第二：Web 整理展示 | 选择目标后详情与步骤同步 | Roadmap / five states | Browser interaction | Stage 5 | pass | 输入、能力、输出、步骤、验收与依赖同步渲染 |
| 第二：Web 整理展示 | 当前目标一与 A/B 实验有明确入口 | Roadmap / goal 01–02 | Browser interaction | Stage 4 | pass | 目标一进入 A；目标二进入 B 视觉原型 |
| 跨设备 | 路线区在深浅主题和三视口可用 | 1440/1024/390 | Screenshots + overflow | Stage 7 | pass | 三视口和深浅主题无横向溢出 |
| 无障碍 | 目标选择可键盘操作且状态语义正确 | Keyboard | Focus + ARIA evidence | Stage 7 | pass | tablist、tabpanel、ARIA 状态与方向键焦点同步通过 |
| 工程 | 静态运行无错误、无新增高成本资产 | Runtime | Syntax + browser + performance | Stage 8 | pass | 浏览器错误为空；语法与空白检查通过；无新增媒体 |
| 交付 | README、验收与交接同步 | Repository | File + terminal audit | Stage 9 | pass | 主索引、演示说明、验证与交接已同步 |

## Revision 5 direction

- Entry mode：Revision-led implementation。
- Request revision：5。
- Target user：希望把 `female-outfit-director` 的女性造型和转场规则真正接入当前研究原型的维护者与研究访客。
- Desired first impression：A 能明确选择“女性专项导演”并看到其输入改变提示词；B 能选择与上游机制编号一致的网页模拟效果。
- Visual ambition：Editorial。
- Experience architecture：Hybrid Workspace；A 的参数与输出、B 的人物舞台继续承担两条操作路径，规则来源和能力边界进入详情流。
- User phases：建立女性专项规则数据层；接入 A 的女性参数与 M1–M12；接入 B 的 M1/M2/M8/M10 网页模拟；形成机制对照实验记录。
- Visual constraints：沿用现有导演台体系；女性专项字段按需展开；机制支持状态使用文字和徽标，不仅依赖颜色；不新增图片、Canvas、WebGL 或网络运行时。
- Information constraints：明确“女性专项提示词已接入”“四种网页视觉机制已模拟”“其余八种只输出给外部模型”；不得把 CSS 转场称为真实服装迁移。
- Operation constraints：女性专项只适用于女性主体；选择男性或宠物时自动回到通用导演；A 的机制选项、提示词和参数同步；B 的效果编号与上游转场库一致。
- State constraints：保留 T2V/I2V、K/D、A/B、深浅主题和 reduced-motion；女性专项默认 K 模式并允许 M1–M12；D 模式仍使用通用 M13。
- Environment constraints：纯静态 GitHub Pages；规范地址 `http://127.0.0.1:4173/`；1440/1024/390px、鼠标/触摸/键盘。
- Source boundary：规则适配自 `liyue-aigc/female-outfit-director` commit `2d30d40d09368aab333d054c035289061c9fcf47`，MIT；保留来源和许可证说明，不复制第三方模型或服务。
- Primary journey：A 选择女性专项 → 配置妆容/配饰/衣料 → 选择 M1–M12 → 生成女性专项参数和视频提示词；B 选择 M1/M2/M8/M10 → 切换造型 → 观察与机制一致的网页状态变化。
- Required artifacts：结构化规则数据、女性专项 Web 控件与输出、四种 B 效果、变体研究文档、实验矩阵、来源说明、README、验收与交接更新。
- Autonomy authorization：用户于 2026-08-20 在接入方案后明确“继续”，授权在既定静态原型范围内直接实现和验证。
- User-decision boundary：调用真实生成 API、上传并分析真实人物图片、保存身体数据、产生费用或创建新的远端仓库时再确认。
- Observable completion：女性专项状态可选择且强制女性主体；12 种机制可发现并改变输出；B 四种机制产生可观察且可降级的视觉变化；来源/边界可发现；三视口、两主题、键盘、reduced-motion 和浏览器错误检查通过。

## Revision 5 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 规则接入 | 上游来源、版本、许可与差异可追溯 | Repository | Source + file inspection | Stage 0 | pass | commit、MIT、差异和衍生边界已记录 |
| 规则接入 | 女性 profile、12 机制和预设结构化 | Static data | Syntax + file inspection | Stage 3 | pass | 三个独立数据文件已接入并通过语法检查 |
| A 女性专项 | 专项选择与字段按需展开 | A / female profile | Browser interaction + screenshot | Stage 4 | pass | 专项 profile、三类字段和来源入口可见 |
| A 女性专项 | M1–M12 可选并改变提示词 | A / K / female | Browser output observation | Stage 5 | pass | 12 选项可发现，M12 输出含衣纹执行规则和女性锚点 |
| A 路由保护 | 男性或宠物自动返回通用导演 | A / subject change | Browser state observation | Stage 6 | pass | 男性实测切回 general、字段隐藏、K 机制缩为 4 个 |
| B 特效模拟 | M1/M2/M8/M10 可选择且视觉不同 | B / four effects | Browser screenshots + DOM | Stage 5 | pass | 四个 data-effect 类和造型状态同步实测通过 |
| 能力边界 | 4 个网页已模拟、8 个提示词专用清楚可见 | A/B notices | Browser text observation | Stage 3 | pass | A 支持说明、B 标题和证明面板均明确边界 |
| 跨设备 | 新字段和效果在两主题三视口可用 | 1440/1024/390 | Screenshots + overflow | Stage 7 | pass | 桌面深色、平板浅色、手机深色无横向溢出 |
| 无障碍与动态 | 键盘和 reduced-motion 保留结果 | Keyboard / reduced motion | Interaction + state evidence | Stage 7 | pass | Space 选择 profile；B reduced-motion 直接到终场且无 changing 类 |
| 工程与交付 | 语法、错误、README、验收和交接同步 | Repository/runtime | Terminal + browser audit | Stage 9 | pass | 文档、静态检查与浏览器终审完成 |

## Revision 6 direction

- Entry mode：Revision-led implementation。
- Request revision：6。
- Target user：希望把外部模型生成的第一条真实换装视频作为 E001 基线纳入研究闭环的维护者与研究访客。
- Desired first impression：目标一不再只是“等待外部生成”，而是可以直接播放真实 MP4，并同时看到模型、提示词、媒体参数和诚实的基线观察。
- Visual ambition：Editorial；播放器是研究证据，不替代 A/B 两个实验。
- Experience architecture：Hybrid Workspace；在 A/B 操作区与长期路线之间增加 E001 结果区，保持“编排 → 外部生成 → 回填 → 评估”的连续阅读路径。
- User phases：保存用户提供的 MP4；记录 MiniMax H3 与完整 T2V 提示词；抽取关键帧进行基线观察；在 Web 中提供原生视频回放、元数据和评估入口；同步研究文档。
- Visual constraints：沿用现有面板、编号和信息层级；竖版视频保持 9:16，不自动播放，不循环，不用视频承载唯一文本信息；窄屏改为单列。
- Information constraints：区分“媒体事实”“关键帧观察”“尚需人工观看确认”；不从离散关键帧虚构精确换装或音画卡点结论。
- Operation constraints：原生 `video controls` 可播放、暂停、拖动和全屏；提供 MP4 下载/新窗口入口；播放器失败时保留文字与直接链接。
- State constraints：首屏不加载自动播放声音；浏览器支持 reduced-motion 时不改变用户主动控制的视频，只禁用装饰动画。
- Environment constraints：纯静态 GitHub Pages；规范地址 `http://127.0.0.1:4173/`；桌面、1024px、390px、深浅主题和键盘。
- Source boundary：视频由用户提供，原文件 `C:\Users\yun68\Downloads\video_1787194785064.mp4`；模型标记为用户报告的 `MiniMax H3`；不得将结果表述为上游仓库官方产出。
- Required artifacts：规范命名 MP4、本地 E001 实验记录、Web 结果区、路线状态更新、README、验收和交接更新。
- Autonomy authorization：用户于 2026-08-20 主动提供视频文件、模型和完整参数，授权在当前研究项目内回填第一条结果。
- User-decision boundary：公开发布视频、向第三方上传、调用模型 API、产生费用或收集额外人物数据时再确认；本轮只进行本地项目接入和检查。
- Observable completion：MP4 可追溯且媒体参数记录完整；关键帧观察有证据和限制；网页能播放并显示 E001 状态；目标一从“待回填”更新为“首条基线已回填”；三个视口、主题、键盘、媒体加载和错误检查通过。

## Revision 6 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 视频回填 | 保存规范命名 MP4 并记录来源 | Repository | File hash + metadata | Stage 1 | pass | MP4 与封面已保存；ffprobe 和 SHA-256 已归档 |
| 基线观察 | 关键时间点可检查且结论不越界 | E001 frames | Contact sheet + observation | Stage 3 | pass | 八个主采样点、首个转场加密采样和六个变化点已记录 |
| 规则回归 | T2V M13 不再同时要求侧边激活与禁止侧边人物 | A / T2V / D | Generated prompt observation | Stage 5 | pass | 选项与输出改为单主体舞蹈峰值原地换装；无“侧边激活” |
| Web 结果区 | 原生播放器、模型和参数可发现 | Desktop / E001 | Screenshot + DOM + media state | Stage 4 | pass | 播放器、事实、五项基线观察和完整提示词均可见 |
| Web 状态 | 目标一标记首条真实基线已回填 | Roadmap / goal 01 | Browser text observation | Stage 6 | pass | 顶栏、路线摘要、目标一和完成标准同步为 E001 |
| 无障碍与回退 | 键盘可操作、无自动播放、直接链接可用 | Video controls / fallback | DOM + keyboard + HTTP | Stage 7 | pass | 原生控件语义可见；summary Enter 可开；MP4/JPG 为 200；直接链接存在 |
| 跨设备 | 播放器和记录在两主题三视口可用 | 1440/1024/390 | Screenshots + overflow | Stage 7 | pass | 桌面深色、平板浅色、手机深色无横向溢出 |
| 性能 | 1.8 MB 视频不阻塞首屏 | Static runtime | Resource/loading observation | Stage 8 | pass | 无自动播放；metadata preload 首次观察仅 300B 响应，封面 32KB |
| 工程与交付 | 研究记录、README、验收、交接和提交同步 | Repository/runtime | Terminal + browser audit | Stage 9 | pass | 文档、浏览器、媒体、语法和 Git 空白终审完成 |

## Revision 7 direction

- Entry mode：Revision-led implementation。
- Request revision：7。
- Target user：希望把第二条首帧 I2V 视频纳入研究，并与 E001 比较画幅、身份、造型、M13 和换装点表现的维护者与研究访客。
- Desired first impression：真实结果区从单条回放升级为 E001/E002 可切换的对照实验室；每条结果保持自身媒体事实与诚实结论。
- Visual ambition：Editorial；比较控件优先于同时播放两个视频，避免横竖画幅互相挤压和双音轨冲突。
- Experience architecture：Hybrid Workspace；A/B 操作区保持不变，结果区增加语义 tablist，单次只展示一条原生播放器和对应证据。
- User phases：保存 E002 MP4 与提示词；提取媒体参数、关键帧和换装点；形成 E001/E002 比较；接入 Web 切换；同步路线与研究档案。
- Experiment boundary：E002 同时改变模型（MiniMax H3 → Seedance 2.0 VIP）、路线（T2V → 首帧 I2V）、画幅和提示词，因此是多变量比较，不能把任何改善单独归因于首帧或模型。
- Visual constraints：保持 E001 原貌；E002 竖版视频使用 contain 完整展示，不裁切；两个播放器不自动播放，切换时暂停隐藏视频；窄屏单列。
- Information constraints：模型名称和“VIP”来自用户记录；没有独立首帧文件时，只评估最终视频中可观察的继承表现，不声称验证首帧图本身。
- Operation constraints：E001/E002 可点击和键盘方向键切换；切换同步 tab、tabpanel、标题、证据和视频；隐藏视频必须暂停。
- Environment constraints：纯静态 GitHub Pages；规范地址 `http://127.0.0.1:4173/`；桌面、1024px、390px、深浅主题、键盘和 reduced-motion。
- Source boundary：E002 源文件按用户提供名称从 `C:\Users\yun68\Downloads\video_1787198181868.mp4` 读取；不得向第三方上传或公开发布。
- Required artifacts：规范命名 MP4 与封面、E002 实验档案、E001/E002 对照结论、Web 结果 tabs、路线/README/验收/交接更新。
- Autonomy authorization：用户于 2026-08-20 主动提供第二条文件名、模型、I2V 路线、9:16 设置和完整提示词，授权在当前研究项目内继续回填与比较。
- User-decision boundary：独立评估首帧图像需要用户另行提供首帧文件；本轮不因缺少它阻塞视频结果评估。
- Observable completion：E002 媒体和观察可追溯；比较结论明确多变量限制；Web 能切换两条视频且隐藏项暂停；三视口、主题、键盘、媒体和错误检查通过。

## Revision 7 coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 视频回填 | 保存 E002 MP4、封面、hash 和媒体事实 | Repository | File + ffprobe + SHA-256 | Stage 1 | pass | MP4 11,550,887B 与源 hash 一致；封面和 ffprobe 事实已保存 |
| E002 观察 | 七套造型、身份、画幅、M13 和换装点可检查 | Keyframes / scene windows | Contact sheets + observation | Stage 3 | pass | 三组接触表覆盖计划点、转场窗口和密集时序；结果写入 E002 档案 |
| 对照结论 | E001/E002 比较且不混淆多变量归因 | Experiment record | Matrix + limitation | Stage 3 | pass | 对照矩阵明确模型、路线、画幅和提示词同时变化 |
| Web 比较 | E001/E002 tabs 与对应播放器/证据同步 | Desktop / results lab | Screenshot + DOM | Stage 4 | pass | 1440×1000 截图及 DOM 检查通过 |
| 交互状态 | 切换时隐藏视频暂停、ARIA 与焦点正确 | Tabs / playback | Browser interaction | Stage 5 | pass | 播放 E001 后切换 E002，E001 paused=true；ArrowLeft 焦点和面板同步 |
| 跨设备 | 双结果在两主题三视口可用 | 1440/1024/390 | Screenshots + overflow | Stage 7 | pass | 三视口均实测；1024 宽无溢出，390 宽标签单列且 9:16 视频不裁切 |
| 性能与回退 | 11.6 MB E002 不自动播放且媒体入口可用 | Static media | Resource + HTTP | Stage 8 | pass | metadata preload、poster、文字回退、直接链接和正确 MIME 均成立 |
| 工程与交付 | 路线、README、验收、交接和本地提交同步 | Repository/runtime | Terminal + browser audit | Stage 9 | pass | 路线、README、验收、交接同步；语法、HTTP 与 Git 审计通过 |

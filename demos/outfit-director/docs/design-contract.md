# Outfit Director 能力实验室｜设计契约

## Contract

- Entry mode：Brief-led greenfield implementation
- Request revision：1
- Target user and context：访问研究主库的 AIGC 创作者、提示词设计者和开发者，希望在不安装 Skill、不调用真实模型的情况下理解其输入、编排过程与输出。
- Desired first impression：专业、清晰、有导演台的节奏感；进入首屏即可知道这是“换装编排能力演示”，而不是虚拟试衣商城。
- Visual ambition：Editorial
- Experience architecture：Hybrid Workspace
- Visual constraints：深色导演工作台为默认主题，提供浅色主题；高对比文字；不依赖外部图片、字体、Canvas、WebGL 或网络资源。
- Information constraints：必须明确这是本地规则模拟，不调用图像或视频模型；能力、状态和输出均来源于已研究的上游 Skill 规则。
- Operation constraints：纯前端、无登录、无后端、无真实 API；支持鼠标、触摸和键盘；相对路径资源可部署到 GitHub Pages 子路径。
- State constraints：支持女性、男性、宠物；K 卡点与 D 舞蹈；造型风格、转场机制、创意补充；播放、重置、输出标签、复制反馈、主题切换。
- Environment constraints：现代 Chromium、Firefox、Safari；桌面、平板和 390px 手机；支持 `prefers-reduced-motion`。
- Primary journey：选择主体与模式 → 调整风格和机制 → 生成编排 → 查看 5/7 造型首帧 → 播放换装状态机 → 检查参数、时间轴和提示词 → 复制输出。
- User-defined phases：配置、首帧预览、时间轴演示、输出阅读、跨设备验收。
- Required artifacts：可运行页面、项目 README、设计契约、浏览器验收记录、交接说明。
- Autonomy authorization：用户于 2026-08-19 明确要求“请先继续，如果有需要请和我交互”，授权在既定范围内直接实施和验证。
- User-decision boundary：接入真实图像/视频模型、购买服务、创建独立远端仓库、修改公开部署权限或改变品牌方向时再询问。
- Observable completion criteria：页面可由文档命令启动；默认内容完整；配置会同步改变造型数、布局、时间点和输出；播放会依次消费侧边造型；复制和主题状态有反馈；桌面/平板/390px 无遮挡；键盘焦点可见；reduced-motion 不隐藏信息；浏览器无错误覆盖。

## Hybrid workspace architecture

- Scene base：语义化 DOM + CSS 布局 + 内联 SVG 人物/宠物轮廓。
- Scene persistence：桌面和平板配置时持续可见；进入输出详情不替换舞台。手机端按“配置 → 舞台 → 输出”形成单列任务流，允许舞台随页面滚动，但不隐藏或折叠。
- Scene actions：生成、播放/暂停、重置和时间点选择属于舞台操作。
- Detail actions：参数锁定、时间轴全文、首帧提示词、视频提示词、负面约束和复制属于文档详情流。
- Foreground control model：左侧配置面板、中央舞台工具条、右侧标签式输出检查器；轻量状态提示不抢占焦点。
- State-to-scene mapping：默认展示当前全部造型；播放时侧边造型依次高亮并永久清空，中央服装同步变化；完成态显示最终造型和全部完成点；重置恢复初始造型。
- Mobile transformation：三列转换为单列任务流，主要操作保持在对应区域顶部，不引入抽屉或模态框。
- Fallback：SVG 只负责人物轮廓；每个造型仍有可读名称、位置、状态和时间文本。关闭动画时状态立即更新，意义不依赖动画。

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

# Outfit Director 能力实验室

这是 `outfit-director` 研究子项目的三路线实验室：A 验证导演提示词，B 验证预生成网页视觉换装，C 默认展示人物图、服装图和预生成试衣结果，并为真实 2D VTON 保留自定义输入与本机模型连接。女性专项规则适配自 [`female-outfit-director`](https://github.com/liyue-aigc/female-outfit-director)，在通用导演之上增加妆容、配饰、衣料约束与 M1–M12 转场机制。

默认静态页面不会调用真实图像或视频模型。A 只读取文件名并生成提示词；B 只切换项目素材；C 会在用户主动连接并点击推理时，把两张图片发送给页面明确显示的 localhost 适配器。真实视频区播放的是用户通过 MiniMax H3、Seedance 2.0 VIP 和 Seedance 2.5 外部生成后主动回填的 E001–E003 项目本地 MP4。

页面同时提供“从展示换装到真实虚拟试衣”的五目标路线面板。路线面板是研究索引，不会把尚未接入的模型、3D 或 AR 能力标成已实现；完整拆解见 [虚拟试衣技术研究路线](../../docs/virtual-tryon-technology-roadmap.md)。

## 本地运行

在研究主库根目录执行：

```powershell
python -m http.server 4173 --directory demos/outfit-director
```

打开：<http://127.0.0.1:4173/>

这是项目验收使用的规范运行地址。页面不需要安装依赖或执行构建。

## 三个实验

### A · 提示词导演

- 默认使用“纯文本生成视频 T2V”：不需要首帧，生成后直接复制视频提示词给外部模型。
- 可切换“首帧图生视频 I2V”：先生成首帧，再把首帧作为唯一视觉输入生成视频。
- 切换女性、男性和宠物主体路线。
- 可选择“女性专项导演”，配置妆容、配饰和衣料重点，并使用 M1–M12；男性或宠物会自动回到通用导演。
- 切换 9 秒五造型卡点模式与 15 秒七造型舞蹈模式。
- 选择首帧图像模型策略与目标图生视频模型策略。
- 选择本地人物和衣服参考；结果按 `Image 1`、`Image 2–N` 组织素材。
- 选择造型方向和兼容的换装机制。
- 查看中央主体与四个或六个侧边造型组成的首帧状态母图。
- 加速播放侧边造型“激活 → 清空 → 中央换装”的状态变化。
- 查看并复制参数锁定、完整时间轴、首帧提示词、视频提示词和负面约束。

生成结果用于复制到外部图像/视频模型。T2V 路线只使用文字；I2V 路线才显示人物与衣服参考字段。页面不识别上传图片的视觉内容，因此衣服文件名最好包含可读造型名称。

### B · 网页换装实验

- 在五套写实造型之间手动切换。
- 在 M1 人物飞入、M2 袖摆遮镜、M8 贴纸翻页和 M10 动作卡点四种网页近似效果之间选择。
- 播放完整的五套自动换装序列并重置。
- 同步查看当前造型名称、测试结论和实现边界。
- 在桌面、平板与手机尺寸下切换深浅主题。

这里显示的是同一虚构成年人物的五张预生成完整造型，通过 CSS 裁切与 JavaScript 状态切换实现。四种效果用于解释转场机制，不是 3D、视频文件、浏览器实时生成或真实服装 SKU 迁移。M3–M7、M9、M11、M12 只进入 A 的外部模型提示词，不在 B 中伪装成已实现网页特效。

### C · 真实 2D 试衣验证台

- 默认加载一组虚构人物、独立服装和预生成试衣结果，并持续标注 `PRE-GENERATED DEMO · 非模型推理`。
- 上传任一自定义图片后立即清除预生成结果；“恢复内置演示”不会发起网络请求。
- 选择人物全身照与单件服装图并显示真实本地预览。
- 检查格式、10MB 文件上限、分辨率和人物图比例建议。
- 选择上装、下装或连衣裙类别。
- 只允许 `localhost` / `127.0.0.1` 适配器；模型离线时严格禁用推理。
- 服务在线且双输入存在时，按 [本地 VTON 接口契约](../../integrations/vton-adapter/README.md) 提交真实任务。
- 只接受适配器返回的 `image/*` 结果；失败时保留诚实空状态，不补模拟图。

首个候选是 [CatVTON](https://github.com/Zheng-Chong/CatVTON)，因为官方给出的 `bf16`、1024×768 推理门槛约为 8GB，接近本机 RTX 4070 Laptop 的 8188 MiB。IDM-VTON 保留为质量对照。两者均使用 CC BY-NC-SA 4.0，本阶段只做非商业研究。用户已决定暂不下载模型，TEST C 当前以内置三图演示、自定义输入和接口扩展位作为完成结果。

## E001–E003 · 真实视频基线对照

- 模型记录：MiniMax H3；纯文本 T2V；D 模式；15 秒；七套造型；M13。
- 项目保存原始 MP4、32 KB 封面、完整提示词、SHA-256、媒体元数据和基线观察。
- 页面使用原生视频控件，不自动播放，默认只预载媒体元数据，并提供直接 MP4 链接。
- 已观察到七套造型、单一全身主体和稳定摄影棚；身份细节与服装精确度为部分满足。
- 实际媒体为 1344×768 横版，不是目标 9:16；六个换装变化点整体略早。
- E001 暴露了“M13 侧边激活”与“禁止侧边人物”的冲突，新的纯 T2V 输出已改为“舞蹈峰值原地换装”。

完整记录见 [E001 实验档案](../../studies/outfit-director/experiments/e001-minimax-h3-m13.md)。

E002 使用 Seedance 2.0 VIP 首帧 I2V，实际媒体为 720×1280、15.104 秒。中央人物继承了首帧身份与布局，六个侧边造型按左上 → 右上 → 左中 → 右中 → 左下 → 右下依次激活并永久清空，M13 状态机在视觉采样中成立。六次换装均发生，粗粒度完成点平均绝对偏差约 0.25 秒；第五次约提前 0.8 秒。

E002 同时改变模型、生成路线、画幅设置和提示词，因此只能证明这套整体方案优于 E001，不能单独证明首帧或 Seedance 的因果贡献。完整记录见 [E002 实验档案](../../studies/outfit-director/experiments/e002-seedance-2-vip-i2v-m13.md)。

E002 原视频中的侧边人物存在边界裁切。E002.1 已保存一张新的 720×1280 安全区首帧：六个侧边人物缩小并完整进入画布，网页提供预览与下载。该首帧已经用于 E003，但严格 E002.1 仍需用 Seedance 2.0 VIP 同参数复现。实验契约见 [E002.1 首帧安全区优化](../../studies/outfit-director/experiments/e002-1-first-frame-safe-layout.md)。

E003 使用这张安全区首帧和 Seedance 2.5。六个侧边人物完整进入画布并按序清空；平台没有 9:16 选项，实际视频 560×750 接近 3:4，不属于用户设置错误。持续推近仍导致中央人物后半程腿脚和手臂越界；M13 库存状态成立，可见空间激活特效弱于 E002。因为模型与首帧同时变化，E003 不是严格 E002.1。完整记录见 [E003 实验档案](../../studies/outfit-director/experiments/e003-seedance-2-5-i2v-m13-safe-layout.md)。

## 技术路线面板

页面下方按顺序展示并可切换五个研究目标：提示词换装视频、2D AI 虚拟试衣、3D 参数化试衣间、实时 AR 试衣镜、尺码与穿搭智能。每个目标都明确列出：

- 输入素材；
- 需要接入的模型或工程能力；
- 阶段输出；
- 实施步骤、完成标准与外部依赖。

目标一可直接进入提示词实验；目标二进入 TEST C 即可先看默认对照，换成自定义素材后进入真实输入与本机服务准备，也可返回 TEST B 查看视觉原型边界；其余目标在依赖确定前只提供规划入口。

## 文件结构

```text
demos/outfit-director/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── README.md
├── data/
│   ├── director-profiles.js
│   ├── transition-mechanisms.js
│   └── outfit-presets.js
├── assets/
│   ├── fictional-model-five-looks.png
│   ├── e001-minimax-h3-m13.mp4
│   ├── e001-minimax-h3-m13-poster.jpg
│   ├── e002-seedance-2-vip-i2v-m13.mp4
│   ├── e002-seedance-2-vip-i2v-m13-poster.jpg
│   ├── e002-1-first-frame-safe-layout.png
│   ├── e002-1-first-frame-safe-layout-720x1280.png
│   ├── e003-seedance-2-5-i2v-m13-safe-layout.mp4
│   ├── e003-seedance-2-5-i2v-m13-safe-layout-poster.jpg
│   ├── vton-demo-person.png
│   ├── vton-demo-garment.png
│   └── vton-demo-result.png
└── docs/
    ├── design-contract.md
    ├── validation.md
    ├── handoff.md
    └── upstream-attribution.md
```

## GitHub Pages

所有资源均使用相对路径，由主库工作流把本目录直接发布为 GitHub Pages 站点：

```text
https://yydshly.github.io/0819_githubcode_study/
```

对应研究主库为 [`yydshly/0819_githubcode_study`](https://github.com/yydshly/0819_githubcode_study)，上游能力来源与研究边界仍以本 README 和研究档案为准。

## 能力边界

A 实验中的舞台人物和宠物仍是用于表达身份锁定与造型变化的 SVG 示意轮廓。B 实验和 C 的三张默认素材均由 OpenAI 内置图像生成工具创建，人物为虚构成年人，服装无品牌标识，仅用于研究演示。C 的结果图是图像编辑得到的预生成对照，不是 CatVTON 或其他 VTON 模型输出。E001–E003 是用户提供的外部模型实际输出，不代表上游仓库或本页面具有视频生成能力。所有提示词由浏览器中的确定性规则生成，三条结果也不能证明下游模型一定可以稳定完成多主体、真实虚拟试衣、长时序或精确卡点任务。

C 的页面和接口已经可用；CatVTON 按当前决定不部署。Revision 10 浏览器验收中的成功响应来自本机接口桩，只证明前端契约，不是 E004；Revision 12 的默认三图演示同样不计为模型结果。只有自定义输入、实际模型与可追溯参数共同产生的结果才进入 E004。

上游版本、MIT 许可与衍生边界见 [来源与许可说明](docs/upstream-attribution.md)；女性专项差异分析与逐机制实验计划见 [变体研究](../../studies/outfit-director/variants/female-outfit-director.md) 和 [F001–F012 实验矩阵](../../studies/outfit-director/experiments/female-transition-matrix.md)。

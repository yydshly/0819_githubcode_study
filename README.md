# 0819 GitHub Code Study

这是一个面向开源项目研究的长期主索引库，用来集中记录值得阅读、复现和改造的项目，并关联研究记录与在线演示。

本仓库不替代上游项目：这里维护入口、研究结论和演示；需要独立开发、部署或保留完整历史的内容，会放在单独仓库中。

## 入口导航

- [README 项目索引](#项目索引)：在当前页面查看全部子项目及研究状态
- [在线研究门户](https://yydshly.github.io/0819_githubcode_study/index.html)：进入 GitHub Pages 图形化总入口
- [门户源码与运行说明](demos/research-hub/README.md)：查看本地启动、页面职责和部署路径
- [GitHub 主库](https://github.com/yydshly/0819_githubcode_study)

## 项目索引

| 项目 | 原项目 | 演示 | 状态 | 研究重点 |
| --- | --- | --- | --- | --- |
| [Outfit Director](studies/outfit-director/README.md) | [liyue-aigc/outfit-director](https://github.com/liyue-aigc/outfit-director) + [female 变体](https://github.com/liyue-aigc/female-outfit-director) | [在线演示](https://yydshly.github.io/0819_githubcode_study/outfit-director/) · [说明](demos/outfit-director/README.md) | 研究中 | M1–M13、换装视频基线、2D VTON 接入 |
| [Punk Skill](studies/punk-skill/README.md) | [adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill) | [在线演示](https://yydshly.github.io/0819_githubcode_study/punk-skill/) · [说明](demos/punk-skill/README.md) | 已复现 | 视觉 Prompt 编译、完整发布包、可靠文字层与 ZIP 导出 |
| [Xianxia Visual Director](studies/xianxia-visual-director/README.md) | [liyue-aigc/xianxia-visual-director](https://github.com/liyue-aigc/xianxia-visual-director) | [在线演示](https://yydshly.github.io/0819_githubcode_study/xianxia-visual-director/) · [说明](demos/xianxia-visual-director/README.md) | 研究中 | 仙侠场景路由、结构化提示词与目标效果 |
| [Snakey Locomotion](studies/snakey-locomotion/README.md) | [muratkamci/snakey-locomotion](https://github.com/muratkamci/snakey-locomotion) | [在线演示](https://yydshly.github.io/0819_githubcode_study/snakey-locomotion/) · [说明](demos/snakey-locomotion/README.md) | 已归档 | Three.js 草地环境、长体运动与环境反馈参考 |
| [BigPeng Hot GZH](studies/bigpeng-hot-gzh/README.md) | [BigPengSays/bigpeng-hot-gzh](https://github.com/BigPengSays/bigpeng-hot-gzh) | [在线演示](https://yydshly.github.io/0819_githubcode_study/bigpeng-hot-gzh/) · [说明](demos/bigpeng-hot-gzh/README.md) | 已复现 | 模糊想法明确化、规则驱动的选题与标题沉淀 |
| [SRT Whiteboard Animation](studies/srt-whiteboard-animation/README.md) | [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation) | [在线演示](https://yydshly.github.io/0819_githubcode_study/srt-whiteboard-animation/) · [复现说明](demos/srt-whiteboard-animation/README.md) | 已复现 | OpenCV 墨迹坐标、落笔排序、累计遮罩、黑白落墨与彩色刷回 |

状态建议统一使用：`规划中`、`研究中`、`已复现`、`持续维护`、`已归档`。

## 子项目说明

### Outfit Director：换装任务导演与虚拟试衣

**作用**

把人物、服装、视频模式和镜头要求编排为可检查的拼贴首帧、换装时间轴、视频提示词与负面约束，再交给外部图像、视频或 VTON 模型执行。它是任务导演，不是换装生成模型。

**研究内容**

- 女性、男性、宠物及混合主体的规则路由和参数优先级。
- K 卡点换装、D 换装舞蹈、M1–M13 机制与连续时间轴。
- MiniMax、Seedance 等真实 T2V / I2V 视频基线和单变量实验边界。
- TEST A 提示词导演、TEST B 预生成展示、TEST C 2D VTON 双输入验证台。

**使用场景**

- 时尚创作者规划多套造型换装短视频。
- 电商团队验证虚拟试衣交互和素材生产流程。
- 研究人员比较视频模型对身份、服装、镜头和时间轴的服从度。
- Skill 工程研究者拆解领域规则如何成为 Agent 工作流。

**后期可扩展**

- 补齐严格视频对照实验和女性专项 F001–F012 评测矩阵。
- 接入 CatVTON / IDM-VTON，记录真实参数、成本、时延和输出。
- 继续扩展 3D 参数化人体、服装资产、动作驱动、实时 AR 与尺码推荐。

**网页与文档**

- [在线能力实验室](https://yydshly.github.io/0819_githubcode_study/outfit-director/)
- [完整研究记录](studies/outfit-director/README.md) · [演示使用说明](demos/outfit-director/README.md)
- [虚拟试衣总体技术路线](docs/virtual-tryon-technology-roadmap.md)
- 上游：[outfit-director](https://github.com/liyue-aigc/outfit-director) · [female-outfit-director](https://github.com/liyue-aigc/female-outfit-director)

### Punk Skill：视觉 Prompt 编译与完整发布包

**作用**

上游 `$punk-cover` / `$punk-avatar` 把文章、主题或主体描述编译为单一风格的视觉任务；本研究新增 `$punk-publish`，将图片与标题、正文、CTA、标签、Alt 文本和 manifest 组织成可检查的完整发布包。Skill 负责编排，外部图像模型负责生成。

**研究内容**

- `任务 Skill × 输出 Blueprint × STYLE 视觉原子` 的三层编译架构。
- 24 个封面/海报风格和 5 个头像风格的路由与适用场景。
- 无字底图与确定性文字层分离，降低生成式标题乱码风险。
- 多平台文案、真实图片文件、依赖状态、哈希 manifest 与 ZIP 导出。
- 上游 commit / Git tree 锁定和可重复 bootstrap 复用机制。

**使用场景**

- 将文章、研究结论和产品观点转换成社媒封面与配套文案。
- 为播客、专栏、活动或品牌内容生成系列视觉资产。
- 将人物、宠物或物品素材转换成头像、肖像或纪念卡任务。
- 研究 Prompt 资产化、Skill 依赖发现和跨模型表现差异。

**后期可扩展**

- 增加品牌令牌、参考图检索和历史产物索引。
- 建立多模型路由、失败回退、成本、时延和生成参数记录。
- 接入 CMS / RSS、内容审核和发布队列；真实发布仍需显式授权。
- 对比自由 Prompt、模板拼接与结构化编译的 OCR、语义和风格指标。

**网页与文档**

- [在线能力实验室](https://yydshly.github.io/0819_githubcode_study/punk-skill/)
- [完整研究记录](studies/punk-skill/README.md) · [演示使用说明](demos/punk-skill/README.md)
- [上游版本锁](studies/punk-skill/upstream-lock.json) · [`$punk-publish` Skill](studies/punk-skill/extensions/punk-publish/SKILL.md)
- 上游：[adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill)

> 上游当前未声明许可证。本库记录来源、固定版本和独立研究实现，不复制其完整 Skill、STYLE 或截图资产。

### Xianxia Visual Director：仙侠场景提示词导演

**作用**

把简短的仙侠场景构想扩展为包含画幅、场景路由、镜头、尺度、空间层次、建筑、色彩、光线和负面约束的图片提示词，再交给外部图片模型生成。它是垂直领域提示词导演，不是图像模型。

**研究内容**

- 单体仙境、神域聚居地和东方苍穹巨构三类代表场景。
- 尺度证据、五层空间、呼吸空间和东方建筑结构规则。
- 参数锁定、场景路由、视觉规则注入和正负提示词输出链路。
- 三张独立生成的目标效果示意图，以及 Skill 与底层模型的能力边界。

**使用场景**

- 仙侠小说、游戏世界观、影视概念设计和场景气氛图。
- 天宫、仙城、天门、观星台等东方幻想建筑概念探索。
- 比较图片模型对巨物尺度、空间层次和建筑约束的服从度。
- 研究垂直领域知识如何组织为按场景路由的 Prompt Skill。

**后期可扩展**

- 增加秘境、宗门、洞府、战场、法阵和角色群像等场景路由。
- 将镜头、天气、时间、文明密度和叙事事件改造成结构化参数。
- 对比不同图片模型的比例、空间层次、材质和负面约束执行效果。
- 上游许可证明确后，再评估版本锁、安装脚本和合法衍生方式。

**网页与文档**

- [在线场景展示](https://yydshly.github.io/0819_githubcode_study/xianxia-visual-director/)
- [完整研究记录](studies/xianxia-visual-director/README.md) · [演示使用说明](demos/xianxia-visual-director/README.md)
- [展示图生成记录](demos/xianxia-visual-director/docs/image-generation.md)
- 上游：[liyue-aigc/xianxia-visual-director](https://github.com/liyue-aigc/xianxia-visual-director)

> 上游当前未声明许可证。本子项目保持展示型研究范围，不在本库再分发其完整源码。

### Snakey Locomotion：Three.js 程序化长体角色与交互场景

> **归档状态（2026-08-20）**：当前结论已经足够支撑技术选型，暂不继续专项研究。WebGL 演示、源码、版本锁和扩展路线继续保留并随 Pages 部署；出现长体角色、交互植被或曲面运动需求时按需恢复。

**作用**

上游以一条可操控的程序化蛇为核心，演示无骨骼、无烘焙动画、无物理引擎的长体运动，并组合地形贴合、胶囊曲面攀爬、实例化草地和反馈纹理。本研究将这些机制改造成可操作、可拆解的 WebGL 研究台。

**研究内容**

- 距离驱动相位、固定距离路径历史和按弧长查询。
- 从切线与表面法线建立局部标架，每帧重建扫掠网格。
- 地面高度与圆柱曲面两种表面运动参考实现。
- 可衰减交互纹理、草叶强度/梯度反馈和实例化植被。
- `PathHistory`、`DynamicSweep`、`SurfaceAdapter`、`InteractionField` 四类复用方向。

**使用场景**

- Three.js / WebGL 程序化动画和动态 `BufferGeometry` 学习。
- 蛇、龙、沙虫、触手、藤蔓、管线和电缆等长体对象。
- 草地倒伏、雪地脚印、泥地车辙和局部危险场。
- 受约束表面生物、管道机器人和曲面移动原型。

**按需恢复与扩展**

- 长体角色或动态电缆需求：从 `PathHistory` 和 `DynamicSweep` 开始抽离。
- 草地、雪地、泥地等可变环境需求：复用 `InteractionField` 的衰减状态场。
- 贴地、爬墙或管道运动需求：扩展 `SurfaceAdapter` 到 SDF 或三角网格。
- 只有进入机器人或生物力学课题时，才补充摩擦、受力、自碰撞和动力学模型。

**网页与文档**

- [在线 WebGL 研究台](https://yydshly.github.io/0819_githubcode_study/snakey-locomotion/)
- [完整研究记录](studies/snakey-locomotion/README.md) · [演示使用说明](demos/snakey-locomotion/README.md)
- [归档与恢复说明](studies/snakey-locomotion/ARCHIVE.md)
- [上游版本锁](studies/snakey-locomotion/upstream-lock.json) · [MIT 许可证说明](demos/snakey-locomotion/UPSTREAM-LICENSE.md)
- 上游：[muratkamci/snakey-locomotion](https://github.com/muratkamci/snakey-locomotion)

### BigPeng Hot GZH：模糊想法到可发布主题

**作用**

帮助用户把模糊想法沉淀为可进入写作与发布流程的明确选题和候选标题。这里的“可发布主题”是清楚的写作任务，不等于已经生成正文、配图或公众号草稿。

**实现原理**

这是规则驱动的 Skill：用户先提供模糊想法，宿主大模型理解意图并明确对象、读者、数字、结果和证据等关键槽位；Skill 再依据 8 种选题模板、7 种标题公式、任务路由、禁用项和兑现要求生成、检查与推荐候选；最终选择仍由用户完成。

```text
模糊想法 → 大模型明确意图与槽位 → Skill 按规则生成和质检 → 用户确认 → 选题、标题与正文兑现要求
```

**关键边界**

- Skill 沉淀的是个人/团队的内容运营经验和检查标准，不是训练后的预测模型。
- 它不爬取公众号、不自动获得实时热点，也没有证据证明能够预测点击率或“爆款”。
- 浏览器 Demo 是可重复的规则复现；理解任意自然语言的能力来自宿主大模型，热点数据来自外部搜索或数据源。
- 上游采用 MIT 许可证；本研究锁定提交 `8967879bbd59bfacfeb2d66214f095dc92b6f6bc`。

**网页与文档**

- [在线规则实验台](https://yydshly.github.io/0819_githubcode_study/bigpeng-hot-gzh/)
- [完整研究记录](studies/bigpeng-hot-gzh/README.md) · [演示使用说明](demos/bigpeng-hot-gzh/README.md)
- [浏览器验收](demos/bigpeng-hot-gzh/docs/validation.md) · [部署说明](demos/bigpeng-hot-gzh/docs/deployment.md)
- 上游：[BigPengSays/bigpeng-hot-gzh](https://github.com/BigPengSays/bigpeng-hot-gzh)

### SRT Whiteboard Animation：可控白板手绘视频

**作用**

将静态彩色插画转换为可控的白板手绘视频。它不是大模型直接生成视频，而是使用传统图像处理和确定性逐帧渲染，让故事插画、教学图解、流程说明和物理原理按照指定时间顺序逐步出现。

**实现原理**

OpenCV 先从彩色图片中识别墨迹像素，通过骨架化和连通路径追踪得到墨迹坐标；程序再根据 `annotation.json` 中的区域、开始时间和持续时间，以及端点优先、交叉点尽量直行、从上到下和从左到右等规则确定落笔顺序。每一帧按照当前坐标更新累计遮罩：第一阶段只显露黑白墨迹，第二阶段再把原图彩色像素刷回；透明画手 PNG 跟随当前坐标移动，最后由 OpenCV 和 FFmpeg 将所有帧编码为 H.264 MP4。

```text
彩色插画 → OpenCV 提取墨迹与坐标 → 落笔排序 → 逐帧累计遮罩
         → 黑白线稿显露 → 彩色原图刷回 → 画手跟随 → MP4
```

**关键边界**

- 自动落笔顺序是几何启发式结果，不等于人类真实笔顺。
- 源图生成、语义区域标注、旁白、字幕烧录和音频混流不属于内置确定性渲染能力。
- 适合轮廓清楚、可拆成静态插画区域的内容；不适合写实照片、复杂交叉线稿和要求严格书写顺序的文字公式。
- 当前研究提供故事、知识、流程和牛顿第三定律四个真实渲染案例。

**网页与文档**

- [在线交互研究页](https://yydshly.github.io/0819_githubcode_study/srt-whiteboard-animation/) · [复现与运行说明](demos/srt-whiteboard-animation/README.md)
- [完整研究记录](studies/srt-whiteboard-animation/README.md) · [浏览器验收](demos/srt-whiteboard-animation/docs/validation.md)
- [上游版本锁](studies/srt-whiteboard-animation/upstream-lock.json) · [MIT 许可证说明](demos/srt-whiteboard-animation/UPSTREAM-LICENSE.md)
- 上游：[geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation)

## 研究方式

每个项目尽量保留完整研究链路：

1. 记录上游来源、许可证、版本或提交号，确保对象可追溯。
2. 说明选择原因、研究问题和重点代码路径。
3. 记录运行环境、复现步骤、关键设计和问题。
4. 将演示地址与阶段结论回填到索引。
5. 区分上游内容、研究笔记和衍生实现，并遵守上游许可证。

新增研究项时，可以复制 [研究记录模板](docs/research-template.md)，并参考 [贡献与维护约定](CONTRIBUTING.md)。

## 部署结构

`.github/workflows/deploy-outfit-director-pages.yml` 统一组装 GitHub Pages：

```text
/
├── index.html                    # 研究总入口
├── outfit-director/              # Outfit Director 演示
├── punk-skill/                   # Punk Skill 演示
├── xianxia-visual-director/      # 仙侠场景与目标效果
├── snakey-locomotion/            # Three.js 程序化场景研究台
├── bigpeng-hot-gzh/              # 公众号选题与标题规则实验台
├── srt-whiteboard-animation/     # OpenCV 白板动画交互研究页
└── studies/                      # 对应研究记录
```

## 仓库结构

```text
.
├── README.md                     # 所有研究项目的总入口
├── CONTRIBUTING.md               # 新增和维护约定
├── docs/                         # 通用研究模板与技术路线
├── demos/
│   ├── research-hub/             # GitHub Pages 总入口
│   ├── outfit-director/
│   ├── punk-skill/
│   ├── xianxia-visual-director/
│   ├── snakey-locomotion/
│   ├── srt-whiteboard-animation/
│   └── bigpeng-hot-gzh/
└── studies/
    ├── outfit-director/
    ├── punk-skill/
    ├── xianxia-visual-director/
    ├── snakey-locomotion/
    ├── srt-whiteboard-animation/
    └── bigpeng-hot-gzh/
```

## 近期计划

- [x] 建立研究主库、研究模板和维护约定
- [x] 建立 Outfit Director 研究与交互演示
- [x] 落地虚拟试衣总体技术路线、真实视频基线与 TEST C 验证台
- [x] 获取 Punk Skill 上游版本并建立场景化能力实验室
- [x] 登记 Xianxia Visual Director，展示仙侠场景提示词与目标效果
- [x] 建立总体入口，引导五个子项目演示
- [x] 建立 Snakey Locomotion WebGL 研究台，拆解轨迹、曲面与交互场
- [x] 归档 Snakey Locomotion，保留在线演示、复用地图与恢复条件
- [x] 复现 BigPeng Hot GZH，明确“大模型理解 + Skill 规则选择 + 用户决策”的能力边界
- [x] 复现 SRT Whiteboard Animation，验证墨迹坐标、累计遮罩和黑白/彩色两阶段渲染
- [ ] 在出现真实需求时继续 CatVTON、严格视频对照或图片模型服从度实验

## 许可证说明

本仓库暂未指定统一开源许可证。引用或研究的第三方项目仍受各自许可证约束；上游未明确授权时，仅保留研究结论和独立生成资产，不再分发其源码。

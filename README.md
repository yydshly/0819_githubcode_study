# 0819 GitHub Code Study

这是一个面向开源项目研究的长期主索引库，用来集中记录值得深入阅读、复现和改造的项目，并关联后续拆分出的研究仓库与在线演示。

本仓库不直接替代各子项目仓库：这里负责维护入口、研究结论和关联关系；需要独立开发、部署或保留完整历史的内容，会放在单独的 GitHub 仓库中。

## 项目索引

| 项目 | 原项目 | 研究仓库 | 演示 | 状态 | 研究重点 |
| --- | --- | --- | --- | --- | --- |
| [Outfit Director](studies/outfit-director/README.md) | [liyue-aigc/outfit-director](https://github.com/liyue-aigc/outfit-director) + [female 变体](https://github.com/liyue-aigc/female-outfit-director) | [0819_githubcode_study](https://github.com/yydshly/0819_githubcode_study) | [在线演示](https://yydshly.github.io/0819_githubcode_study/) · [使用说明](demos/outfit-director/README.md) | 研究中 | M1–M13、换装视频基线、2D VTON 接入 |
| [Punk Skill](studies/punk-skill/README.md) | [adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill) | 本主库研究实现 | [在线能力实验室](https://yydshly.github.io/0819_githubcode_study/punk-skill/) · [使用说明](demos/punk-skill/README.md) | 已复现 / 可复用研究扩展 | 视觉 Prompt 编译、完整发布包、可靠文字层与 ZIP 导出 |

状态建议统一使用：`规划中`、`研究中`、`已复现`、`持续维护`、`已归档`。

## 在线入口与关联关系

- 研究主库：[yydshly/0819_githubcode_study](https://github.com/yydshly/0819_githubcode_study)
- 第一个研究对象：[liyue-aigc/outfit-director](https://github.com/liyue-aigc/outfit-director)
- 女性换装机制变体：[liyue-aigc/female-outfit-director](https://github.com/liyue-aigc/female-outfit-director)
- GitHub Pages 演示：[Outfit Director 能力实验室](https://yydshly.github.io/0819_githubcode_study/)
- 本库研究记录：[能力、原理、差异与实验结论](studies/outfit-director/README.md)
- 第二个研究对象：[Punk Skill 视觉 Prompt 编译能力](studies/punk-skill/README.md)
- Punk Skill 在线演示：[完整发布包能力实验室](https://yydshly.github.io/0819_githubcode_study/punk-skill/)
- Punk Skill 运行说明：[能力、边界与本地启动](demos/punk-skill/README.md)

在线演示由 `.github/workflows/deploy-outfit-director-pages.yml` 统一组装并发布：Outfit Director 保持在 Pages 根路径，Punk Skill 位于 `/punk-skill/`，对应研究文档位于 `/studies/punk-skill/`。Outfit 页面中的 TEST A、TEST B、TEST C 分别对应提示词导演、预生成网页换装和可扩展的 2D VTON 验证台。

## 虚拟试衣总体技术路线

[查看完整规划文档](docs/virtual-tryon-technology-roadmap.md)

当前研究由一个低成本生成式展示实验开始，逐步扩展为五个可独立验收的技术目标：

| 目标 | 当前状态 | 核心闭环 |
| --- | --- | --- |
| 1. 提示词换装视频 | E001–E003 三基线 | Outfit Director 编排 → T2V / I2V 外部模型 → 真实 MP4 对照评估 |
| 2. 2D AI 虚拟试衣 | 默认演示 | TEST C 内置人物/服装/预生成结果；自定义输入与 CatVTON 接口按需接入 |
| 3. 3D 参数化试衣间 | 规划中 | 人体参数 / 图片估计 → 参数化人体 + 3D 服装 + 动作 |
| 4. 实时 AR 试衣镜 | 长期研究 | 摄像头跟踪 → 实时遮挡与服装渲染 |
| 5. 尺码与穿搭智能 | 长期研究 | 人体、商品与反馈数据 → 可解释尺码和搭配建议 |

静态切换、概念动画或提示词本身不等于真实能力已经接入。每一阶段必须保留输入、依赖、真实输出、参数和验收记录。

## 研究方式

每个项目尽量保留完整的研究链路：

1. 记录原项目、许可证、版本或提交号，确保研究对象可追溯。
2. 说明选择它的原因、希望回答的问题和重点代码路径。
3. 记录运行环境、复现步骤、关键设计与遇到的问题。
4. 将改造版仓库、演示地址和阶段结论回填到上方索引。
5. 明确区分原项目内容、个人研究笔记和衍生实现，并遵守原项目许可证。

新增研究项时，可以复制 [研究记录模板](docs/research-template.md)，并参考 [贡献与维护约定](CONTRIBUTING.md)。

## 仓库结构

```text
.
├── README.md                    # 所有研究项目的总入口
├── CONTRIBUTING.md             # 新增和维护研究项目的约定
├── docs/
│   ├── research-template.md                 # 单个项目的研究记录模板
│   └── virtual-tryon-technology-roadmap.md  # 虚拟试衣长期技术路线
└── studies/
    ├── README.md               # 本仓库内研究笔记的组织说明
    ├── outfit-director/        # 换装导演与虚拟试衣研究
    └── punk-skill/             # 视觉 Prompt Skill 研究
```

## 近期计划

- [x] 登记第一个研究项目：Outfit Director
- [x] 建立对应的研究记录
- [x] 建立第一个本地交互能力演示
- [x] 落地虚拟试衣总体技术路线并接入 Web 展示
- [x] 接入女性专项导演规则、M1–M12 和四种网页机制模拟
- [x] 完成 E001：回填 MiniMax H3 / T2V / M13 首个真实视频基线
- [x] 完成 E002：回填 Seedance 2.0 VIP / 首帧 I2V / 9:16 / M13 真实视频
- [x] 完成 E003：回填 Seedance 2.5 / I2V / M13 / 安全区首帧视频并记录多变量边界
- [ ] 完成严格 E002.1：使用 Seedance 2.0 VIP 与 E002 参数，只替换安全区首帧
- [ ] 完成 E003.1：保持 Seedance 2.5 和平台可用画幅，只修正禁止推近与全身安全区约束
- [ ] 按 F001–F012 矩阵比较女性专项转场的外部模型服从度
- [x] 完成目标二首轮选型：CatVTON 为 8GB 本机第一候选，IDM-VTON 为质量对照
- [x] 建立 TEST C 双输入验证台与本机 VTON 适配器接口契约
- [x] 接入 TEST C 默认三图演示；上传自定义素材后自动退出预生成结果
- [ ] 后续出现真实试衣需求时再部署 CatVTON，并回填 E004
- [ ] 关联第一个独立研究仓库
- [x] 配置第一个 GitHub Pages 在线演示与 README 关联入口
- [x] 获取并固定 Punk-Skill 上游研究版本
- [x] 建立 Punk-Skill 场景化能力实验室
- [x] 展示品牌令牌、可靠文字层、多平台变体与模型适配扩展

## 许可证说明

本仓库暂未指定统一的开源许可证。引用或研究的第三方项目仍分别受其原始许可证约束；后续发布衍生代码时，应在对应子项目中单独确认许可证与署名要求。

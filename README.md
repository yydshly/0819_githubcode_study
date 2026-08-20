# 0819 GitHub Code Study

这是一个面向开源项目研究的长期主索引库，用来集中记录值得阅读、复现和改造的项目，并关联研究记录与在线演示。

本仓库不替代上游项目：这里维护入口、研究结论和演示；需要独立开发、部署或保留完整历史的内容，会放在单独仓库中。

## 在线总入口

- [研究总入口](https://yydshly.github.io/0819_githubcode_study/)：统一浏览全部子项目
- [GitHub 主库](https://github.com/yydshly/0819_githubcode_study)

## 项目索引

| 项目 | 原项目 | 演示 | 状态 | 研究重点 |
| --- | --- | --- | --- | --- |
| [Outfit Director](studies/outfit-director/README.md) | [liyue-aigc/outfit-director](https://github.com/liyue-aigc/outfit-director) + [female 变体](https://github.com/liyue-aigc/female-outfit-director) | [在线演示](https://yydshly.github.io/0819_githubcode_study/outfit-director/) · [说明](demos/outfit-director/README.md) | 研究中 | M1–M13、换装视频基线、2D VTON 接入 |
| [Punk Skill](studies/punk-skill/README.md) | [adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill) | [在线演示](https://yydshly.github.io/0819_githubcode_study/punk-skill/) · [说明](demos/punk-skill/README.md) | 已复现 / 可复用研究扩展 | 视觉 Prompt 编译、完整发布包、可靠文字层与 ZIP 导出 |
| [Xianxia Visual Director](studies/xianxia-visual-director/README.md) | [liyue-aigc/xianxia-visual-director](https://github.com/liyue-aigc/xianxia-visual-director) | [在线演示](https://yydshly.github.io/0819_githubcode_study/xianxia-visual-director/) · [说明](demos/xianxia-visual-director/README.md) | 展示型研究 | 仙侠场景路由、结构化提示词与目标效果 |

状态建议统一使用：`规划中`、`研究中`、`已复现`、`持续维护`、`已归档`。

## 子项目定位

### Outfit Director

研究提示词换装导演、真实 T2V / I2V 视频基线及 2D 虚拟试衣接入。静态切换、概念动画或提示词本身不等于真实模型能力；每个阶段保留输入、依赖、真实输出、参数和验收记录。

[查看完整虚拟试衣技术路线](docs/virtual-tryon-technology-roadmap.md)

### Punk Skill

研究视觉 Prompt 的结构化编译与发布：从视觉风格选择、品牌约束和可靠文字层，到多平台变体及完整发布包导出。

### Xianxia Visual Director

轻量展示垂直领域 Prompt Skill：把仙侠场景构想扩展为包含空间、尺度、镜头、色彩、光线和负面约束的提示词，再交给外部图片模型生成。当前阶段只展示代表场景与目标效果，不深入研究图像模型训练。

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
│   └── xianxia-visual-director/
└── studies/
    ├── outfit-director/
    ├── punk-skill/
    └── xianxia-visual-director/
```

## 近期计划

- [x] 建立研究主库、研究模板和维护约定
- [x] 建立 Outfit Director 研究与交互演示
- [x] 落地虚拟试衣总体技术路线、真实视频基线与 TEST C 验证台
- [x] 获取 Punk Skill 上游版本并建立场景化能力实验室
- [x] 登记 Xianxia Visual Director，展示仙侠场景提示词与目标效果
- [x] 建立总体入口，引导三个子项目演示
- [ ] 在出现真实需求时继续 CatVTON、严格视频对照或图片模型服从度实验

## 许可证说明

本仓库暂未指定统一开源许可证。引用或研究的第三方项目仍受各自许可证约束；上游未明确授权时，仅保留研究结论和独立生成资产，不再分发其源码。

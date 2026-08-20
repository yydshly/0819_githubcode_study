# Xianxia Visual Director

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [liyue-aigc/xianxia-visual-director](https://github.com/liyue-aigc/xianxia-visual-director) |
| 原作者/组织 | liyue-aigc |
| 许可证 | 未声明；上游 README 明确提示公开可见不等于授权复制、修改或再分发 |
| 研究版本 | `bd886174f4d84659f2381c4f5baa610003c5bdda`（2026-08-08 初始发布） |
| 研究检出 | `vendor-projects/xianxia-visual-director/`，由根目录 `.gitignore` 排除，不再分发上游源码 |
| 交互演示 | [场景与目标效果展示](../../demos/xianxia-visual-director/README.md) |
| 当前状态 | 展示型研究 / 已登记 |
| 最后更新 | 2026-08-20 |

## 为什么研究它

该项目适合作为“垂直领域 Prompt Skill”的轻量案例：它不训练图像模型，而是把简短的仙侠场景构想扩展成结构化图片提示词，再交给宿主图像生成工具完成图片。

本子项目不做深入算法研究，只回答三个问题：

1. 它面向哪些仙侠场景；
2. 它希望图片呈现什么目标效果；
3. 它如何从场景描述生成相应提示词。

## 一句话原理

```text
仙侠场景构想 → 锁定画幅 / 路由 / 镜头 / 色彩 → 注入仙侠视觉规则 → 生成正向提示词与负面约束 → 外部图片模型生成
```

Skill 本身是提示词导演，不是图像模型、绘图引擎或训练框架。真正的最终画质仍由外部图像模型决定。

## 场景与目标效果

| 场景 | 路由 | 目标效果 |
| --- | --- | --- |
| 悬空藏经阁、天门、观星台等单一地标 | 单体仙境 + 华彩通透仙侠 | 主体明确、雨后通透、材质清晰、人物仅作尺度参照 |
| 天宫、仙城、九重天、云上帝都 | 神域聚居地 + 华彩通透仙侠 | 城区连续、近中远层次丰富、可见交通与生活空间、画面繁华但不拥堵 |
| 巨型天门、压顶神殿、不可抵达的天宫 | 单体或聚居地 + 东方苍穹巨构 | 低机位、建筑出画、人物极小、形成神圣且压迫的巨物尺度 |

三类场景共同追求：可见尺度证据、五层空间、有内容的呼吸空间、可信东方建筑结构、统一光线与通透色彩。

## 本地获取

上游源码作为本地研究检出保存，不进入本仓库版本控制：

```powershell
git clone --depth 1 https://github.com/liyue-aigc/xianxia-visual-director.git vendor-projects/xianxia-visual-director
```

当前检出包含 12 个文件，主体是 `SKILL.md`、8 份视觉参考文档和一个界面元数据文件；没有模型权重、训练代码、推理服务或自动化测试。

## 代码地图

| 路径 | 职责 |
| --- | --- |
| `vendor-projects/xianxia-visual-director/` | 本地忽略的上游研究检出 |
| `xianxia-visual-director/SKILL.md` | 参数锁定、任务模式、路由、输出格式与审计流程 |
| `references/xianxia-master-rules.md` | 尺度、五层空间、呼吸空间、建筑和人物总则 |
| `references/composition-color-light.md` | 构图、焦段、色彩、光线与材质规则 |
| `references/*route*.md` | 神域聚居地等场景路由 |
| `references/eastern-sky-megastructure-style.md` | 东方苍穹巨构风格路由 |
| `demos/xianxia-visual-director/` | 本研究的场景—提示词—目标效果展示页 |

## 阶段结论

- 已确认其核心产物是仙侠场景图片提示词，而不是图片模型。
- 已确认它通过规则路由补全空间层次、尺度、镜头、色彩、光线和负面约束。
- 已选取三种代表场景制作目标效果示意图，足以完成本阶段展示。
- 不继续投入模型原理、训练复现或复杂评测；若未来需要验证效果，再单独比较不同图片模型的提示词服从度。

## 使用边界

- 展示图由本研究根据上游描述使用外部图像工具生成，不是上游仓库自带结果。
- 精确比例、五层空间和负面约束不保证被所有图片模型严格执行。
- 上游未声明开源许可证，因此本仓库只保留研究结论与独立生成的展示资产，不提交其完整源码。

## 关联资源

- [上游 README](https://github.com/liyue-aigc/xianxia-visual-director/blob/main/README.md)
- [上游 Skill](https://github.com/liyue-aigc/xianxia-visual-director/blob/main/xianxia-visual-director/SKILL.md)
- [场景展示说明](../../demos/xianxia-visual-director/README.md)
- [展示图生成记录](../../demos/xianxia-visual-director/docs/image-generation.md)

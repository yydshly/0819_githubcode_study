# Female Outfit Director 变体研究

## 研究定位

`female-outfit-director` 不是第二套虚拟试衣模型，而是 `outfit-director` 研究中的女性专项规则变体。它聚焦同一成年女性、五套穿搭拼贴首帧和卡点换装视频，把妆容、配饰、汉服/现代时装、衣料物理与 12 种换装机制编成图像和视频提示词。

## 上游基线

- 仓库：[liyue-aigc/female-outfit-director](https://github.com/liyue-aigc/female-outfit-director)
- 基线提交：[`2d30d40`](https://github.com/liyue-aigc/female-outfit-director/commit/2d30d40d09368aab333d054c035289061c9fcf47)
- 提交日期：2026-08-03
- 许可证：MIT
- 读取范围：`skill/SKILL.md`、`skill/references/transition-library.md`、`skill/references/parameter-presets.md`

## 与通用版的差异

| 维度 | 女性专项版 | 通用 Outfit Director |
| --- | --- | --- |
| 主体 | 成年女性 | 女性、男性、宠物、混合合集 |
| 默认任务 | 8 秒、五套造型 | K：8–10 秒五套；D：15 秒七套 |
| 专项参数 | 妆容、发簪、耳饰、披帛、裙摆、流苏 | 主体路由与通用造型锚点 |
| 转场库 | M1–M12 | M1–M13，增加舞蹈峰值换装 |
| 运行时 | 无，只输出提示词 | 无，只输出提示词 |

从公开文件看，通用版覆盖面更广，女性版的研究价值主要在女性造型参数、古风/时装预设和转场细节。因此本仓库把它作为 profile 适配到现有演示，不建立重复的独立主项目。

## 当前接入方式

1. `data/director-profiles.js`：声明通用与女性专项导演、来源和身份/衣料规则。
2. `data/transition-mechanisms.js`：结构化 M1–M12，并保留通用 D 模式的 M13。
3. `data/outfit-presets.js`：把上游五套方案归纳到现有四个造型方向。
4. A 提示词导演：选择女性专项后锁定女性主体，加入妆容、配饰、衣料和机制执行规则。
5. B 网页实验：近似模拟 M1、M2、M8、M10；其余机制明确标记为外部模型提示词专用。

## 能力边界

- 本接入没有复制或调用图像/视频模型。
- 网页效果由预生成图片、CSS 和 JavaScript 完成，不是服装分割、服装迁移或虚拟试衣。
- 页面选择本地图片时仍只读取文件名，不执行视觉参数提取。
- 上游机制描述的是预期生成行为；真实视频是否服从需要通过外部模型实验验证。

## 后续验证

机制实验记录见 [女性换装机制矩阵](../experiments/female-transition-matrix.md)。

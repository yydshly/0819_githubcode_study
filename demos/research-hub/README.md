# 研究总入口

GitHub Pages 根页面，用于统一引导四个研究子项目：

- [Outfit Director](../outfit-director/README.md)
- [Punk Skill](../punk-skill/README.md)
- [Xianxia Visual Director](../xianxia-visual-director/README.md)
- [Snakey Locomotion](../snakey-locomotion/README.md)

Snakey Locomotion 当前为“已归档 / 按需复用”：演示继续在线部署，专项研究暂停；恢复条件和扩展入口见 [`studies/snakey-locomotion/ARCHIVE.md`](../../studies/snakey-locomotion/ARCHIVE.md)。

## 本地验收

总入口依赖四个相邻演示目录中的图片和页面，因此应先按部署工作流组装临时站点，再启动静态服务器；浏览器验收过程记录在 [`docs/validation.md`](docs/validation.md)。

远端地址：<https://yydshly.github.io/0819_githubcode_study/>

## 部署路径

| 路径 | 内容 |
| --- | --- |
| `/` | 研究总入口 |
| `/outfit-director/` | Outfit Director 能力实验室 |
| `/punk-skill/` | Punk Skill 能力实验室 |
| `/xianxia-visual-director/` | Xianxia Visual Director 场景展示 |
| `/snakey-locomotion/` | Snakey Locomotion Three.js 研究展厅 |
| `/studies/` | 各项目研究记录 |

入口页无后端、无实时 API、无构建依赖。项目图片直接复用各研究演示内已经注明来源的资产。

## 文档

- [设计契约](docs/design-contract.md)
- [浏览器验收](docs/validation.md)
- [部署与交接](docs/handoff.md)

# Xianxia Visual Director 场景展示

这是研究主库的第三个轻量子项目，用三种代表场景说明上游 `xianxia-visual-director` 的定位：把仙侠构想编排成结构化提示词，再由外部图片模型生成目标画面。

## 本地运行

在研究主库根目录执行：

```powershell
python -m http.server 4175 --directory demos/xianxia-visual-director
```

打开：<http://127.0.0.1:4175/>

部署后入口：<https://yydshly.github.io/0819_githubcode_study/xianxia-visual-director/>

页面为无依赖静态站点，没有后端、实时大模型或图片生成 API。场景切换只展示本研究预设的输入、路由、提示词摘要和预生成示意图。

## 展示内容

- 单体仙境：雨后悬空藏经阁，强调通透材质与单一地标。
- 神域聚居地：连续运行的云上仙城，强调城区层级和文明尺度。
- 东方苍穹巨构：裁切出画的巨型天门，强调低机位与巨物压迫。
- 原理链路：构想 → 参数锁定 → 视觉规则 → 完整提示词 → 外部模型。
- 能力边界：Skill 只负责提示词组织，不保证底层模型严格执行全部空间和比例要求。

## 图片来源

`assets/` 下三张图片由本研究使用 OpenAI 内置图像生成工具制作，是对上游目标效果的研究示意，不是上游仓库自带样例：

- `single-realm-pavilion.png`
- `inhabited-celestial-city.png`
- `eastern-sky-megastructure.png`

完整提示词与来源边界见 [`docs/image-generation.md`](docs/image-generation.md)。

## 关联资料

- [研究记录](../../studies/xianxia-visual-director/README.md)
- [设计契约](docs/design-contract.md)
- [浏览器验收](docs/validation.md)
- [交接说明](docs/handoff.md)
- [上游仓库](https://github.com/liyue-aigc/xianxia-visual-director)

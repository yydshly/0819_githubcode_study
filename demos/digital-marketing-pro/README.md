# Digital Marketing Pro 能力研究台

一个纯静态中文网页，用五种真实营销任务解释 Digital Marketing Pro 的能力、处理链、人工决策点和真实边界。

## 本地运行

在仓库根目录执行：

```powershell
python -m http.server 4173 --directory .
```

打开：<http://127.0.0.1:4173/demos/digital-marketing-pro/>

GitHub Pages 会由部署工作流把页面组装到 `/digital-marketing-pro/`；浏览器验收使用了同构的临时 Pages 目录，所以研究记录链接与线上路径也已验证。

页面没有后端、登录、模型调用或真实营销 API。任务输入只在当前浏览器页面中显示，不会发送或保存。

## 交互内容

- 五种任务场景：新品牌全案、内容上线、SEO/AEO、广告投放、经营复盘。
- 每个场景展示 Skill、宿主模型、Python、人工审批与连接器的责任分工。
- 12 个代表能力卡片和五类工作域筛选。
- Agent 工程 / 营销效果两种研究视角。
- 深浅主题、响应式布局、键盘焦点和 reduced-motion 支持。

## 事实来源

研究基于本地锁定的上游 `v3.31.1`：

- [完整研究记录](../../studies/digital-marketing-pro/README.md)
- [上游版本锁](../../studies/digital-marketing-pro/upstream-lock.json)
- 本地上游检出：`../../vendor-projects/digital-marketing-pro`（被根 `.gitignore` 忽略）

## 文档

- [设计契约](docs/design-contract.md)
- [浏览器验收](docs/validation.md)
- [部署与交接](docs/handoff.md)

# 研究总入口设计契约

```text
Entry mode: revision-led
Request revision: 3
Target user and context: 从 GitHub Pages 进入研究主库、希望快速选择一个子项目查看的中文读者
Desired first impression: 这是一个有清晰边界和真实演示入口的开源项目研究索引
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 延续研究实验室的深色技术气质；四个项目必须拥有独立视觉识别；图片只作证据和入口，不掩盖文字说明
Information constraints: 首屏说明主库定位；第二屏直接提供全部已发布演示入口；每个卡片明确“研究什么、看什么、状态是什么”
Operation constraints: 无后端、无登录；所有演示入口均为普通链接；键盘可达且有可见焦点
State constraints: 当前六个项目固定展示；Snakey Locomotion 标记为“已归档 / 按需复用”；无加载态和动态筛选
Environment constraints: 无依赖静态页面；GitHub Pages；桌面、平板、390px 手机
Primary journey: 打开总入口 → 找到 SRT Whiteboard Animation → 进入远端在线演示 → 可返回总入口或查看研究记录
User-defined phases: 将 SRT 演示部署到 GitHub Pages；修正根 README 在线链接；在主入口增加 SRT 卡片；完成远端浏览器验证
Required artifacts: SRT Pages 组装路径、总入口 SRT 卡片、根 README 正确在线链接、研究入口文档、桌面/手机浏览器验收、提交与部署证据
Autonomy authorization: 用户明确要求部署到远端 GitHub、修正 README 并关联主入口
User-decision boundary: 创建 PR、修改不属于本次范围的其他子项目实现；用户已明确授权本次直接提交并推送 main
Observable completion criteria: 根 URL 呈现包含 SRT 的六项目总入口；`/srt-whiteboard-animation/` 返回 200 并可播放案例媒体；根 README 在线演示指向 Pages；桌面/手机无横向溢出；SRT 卡片键盘可达；远端 Pages 工作流成功
```

## 设计方向

| 决策 | 方向 | 验收标准 |
| --- | --- | --- |
| 首屏层级 | 主库名称、用途、四个项目计数 | 初次扫描能区分“主索引”与单个子项目 |
| 项目导航 | 四张大卡片，每张只有一个主演示入口 | 项目名称、研究重点、状态、演示路径同时可见 |
| 视觉语言 | 墨黑底、暖白字、各项目独立强调色 | 不依赖图片文字；图片失败时卡片仍完整可读 |
| 响应式 | 三列 → 两列 → 单列 | 390px 不裁切标题、按钮和项目元数据 |
| 动效 | 仅悬停/焦点位移 | reduced-motion 下取消非必要过渡 |

## 覆盖记录

| 用户阶段 | 要求 | 表面 / 状态 | 证据 | 状态 |
| --- | --- | --- | --- | --- |
| 总结 | 总入口说明主库和四项目 | 根页面 | 浏览器截图与文本观察 | pass |
| 引导 | Outfit Director 演示入口 | `/outfit-director/` | HTTP 200、正确标题、真实点击导航 | pass |
| 引导 | Punk Skill 演示入口 | `/punk-skill/` | HTTP 200、正确标题、真实点击导航 | pass |
| 引导 | Xianxia Visual Director 演示入口 | `/xianxia-visual-director/` | HTTP 200、正确标题、真实点击导航 | pass |
| 引导 | Snakey Locomotion 演示入口 | `/snakey-locomotion/` | HTTP 200、WebGL Canvas、真实点击导航 | pass |
| 归档 | Snakey 状态、保留能力和恢复条件 | 总入口 / `ARCHIVE.md` | 状态可见、归档文档 HTTP 200 | pass |
| 适配 | 桌面 / 平板 / 手机 | 1440 / 900 / 390px | 无横向溢出、可见焦点、截图观察 | pass |
| 提交 | 只暂存本次范围文件 | `main` | staged diff 与提交 `f027a41` | pass |
| 部署 | Pages 构建和远端 URL | GitHub Actions | 运行 `32358286573` 成功，在线浏览器复验 | pass |
| SRT 部署 | Pages 组装并发布演示与研究记录 | `/srt-whiteboard-animation/`、`/studies/srt-whiteboard-animation/` | 本地组装、Actions、生产 HTTP 与媒体 Range | continue |
| SRT 导航 | 根 README 使用真实在线 URL | GitHub 根 README | 远端 Markdown 链接与真实点击 | continue |
| SRT 主入口 | 新增第六张 SRT 项目卡片 | 总入口桌面 / 手机 / 键盘 | DOM、截图、真实点击、无溢出 | continue |
| 交付 | 更新研究门户 README、验收与交接记录 | docs | 文件检查、提交与远端哈希 | continue |

# Lineworld：Three.js 程序化线稿世界与叙事交互

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [muratkamci/Lineworld](https://github.com/muratkamci/Lineworld) |
| 原作者 | Murat Kamci |
| 许可证 | MIT |
| 研究版本 | [`2c0334295c2330e725087c0b21e19d7997a91e08`](https://github.com/muratkamci/Lineworld/commit/2c0334295c2330e725087c0b21e19d7997a91e08) |
| 研究对象 | Three.js / TypeScript 程序化线稿世界与轻叙事游戏 Demo |
| 本地源码 | `vendor-projects/Lineworld`（被根目录 `.gitignore` 排除，保留独立 Git 历史） |
| 演示记录 | [`demos/lineworld`](../../demos/lineworld/README.md) |
| 在线体验 | [线境：月夜追迹](https://yydshly.github.io/0819_githubcode_study/lineworld-night-hunt/) |
| 可玩衍生 | [`线境：月夜追迹 v0.3.1`](../../demos/lineworld-night-hunt/README.md) |
| 当前状态 | 已获取 / 已验证 / 研究中 |
| 最后更新 | 2026-08-20 |

## 为什么研究它

Lineworld 不是通用引擎，而是一份小而完整的 Three.js 互动作品。它在约 11 个 TypeScript 模块中，把线段绘制、程序化几何、角色步态、分块世界、Shader、粒子、合成音频和记忆叙事组织成统一体验，且不依赖外部模型、纹理或音频样本。

它最有价值的地方不是某个孤立 API，而是把图形技术转译为玩法语义：灯笼半径决定世界能否被看见，移动触发物体逐笔绘制，嗅闻显示气味路径，吠叫推开雾并唤醒记忆，挖掘改变能量与世界色调。它适合参考“技术效果如何成为可理解的交互系统”。

## 已确认的现有能力

| 能力 | 上游实现 | 可参考价值 |
| --- | --- | --- |
| 线稿渐显 | `LineSegments.geometry.setDrawRange()` 驱动物体从隐藏、绘制、显示到淡出 | 可抽成通用 `LineReveal`，用于建筑生成、扫描、路径绘制和信息可视化 |
| 确定性分块世界 | 26 单位 Chunk、固定种子、玩家周围 7×7 Chunk 加载，越界销毁 | 可用于轻量开放场景、无服务器世界复现和可重复关卡生成 |
| 程序化场景资产 | 树、灌木、岩石、池塘、木屋、栅栏、路牌、蘑菇等全部由线段生成器产生 | 可参考“资产语法”而非手工模型堆叠 |
| 程序化角色 | loft 几何、`WireframeGeometry`、关节层级构成狗和幽灵 | 适合低多边形角色原型、无 DCC 资产验证和风格化角色 |
| 步态与动作 | 站立相与摆动相 duty-cycle；步行、奔跑、跳跃、坐下、嗅闻、挖掘、吠叫混合 | 可复用为轻量角色运动与动作反馈参考 |
| Shader 草地 | 每 Chunk 约 2.4 万根草合并为一个 `LineSegments`，顶点 Shader 负责摆动与灯笼范围亮度 | 展示“批量几何 + 共享材质 + 少 draw call”的植被路线 |
| 气味导航 | Catmull-Rom 路径、Points 几何、Shader 脉冲和距离衰减 | 可迁移到任务导航、魔法轨迹、数据流和无障碍辅助线索 |
| 感知型世界反馈 | 能量控制灯笼半径，雾控制可视边界，吠叫暂时扩大视野并唤醒地标 | 可参考“感知范围即玩法状态”的设计 |
| 环境生物 | 鸟、兔、狐狸使用轻量状态机，在靠近或吠叫时逃离 | 可作为非战斗氛围 AI 的简单起点 |
| 记忆叙事 | 地标、挖掘点、幽灵靠近/抚摸/消散、短文本、全局色相变化 | 展示如何用空间事件承载情绪叙事 |
| 程序化音频 | Web Audio 合成风、蟋蟀、猫头鹰、吠叫、铃声、奖励音和卷积混响 | 不加载音频文件也能完成可响应的声音原型 |
| 相机与输入 | 相机相对 WASD、Shift、Space、Q/E/F、拖动环绕和滚轮缩放 | 适合桌面探索 Demo 的基础控制模板 |

## 代码地图

| 路径 | 职责 | 关注点 |
| --- | --- | --- |
| `src/main.ts` | Renderer、Scene、Fog、输入、游戏状态、相机、HUD 和主循环 | 当前是中心化编排器，也是后续解耦重点 |
| `src/world.ts` | Chunk 生命周期、线稿显隐、地标、挖掘点、火花和资源释放 | 分块世界、确定性生成、状态持有与性能边界 |
| `src/gen.ts` | 树木、岩石、池塘、木屋、道具等线段生成器 | 可抽为数据驱动资产语法 |
| `src/character.ts` | 狗的 loft 几何、关节树、步态、跳跃、坐下、嗅闻与挖掘姿态 | 无骨骼资源的程序化角色原型 |
| `src/ghost.ts` | 人形线框、绘制、走近、抚摸、消散和记忆文本 | 有阶段的叙事角色时间线 |
| `src/grass.ts` | 草叶批量几何与顶点/片元 Shader | GPU 摆动、灯笼光池和雾衰减 |
| `src/scent.ts` | 气味路径 Points、流动脉冲 Shader 和挖掘标记 | 路径型粒子引导 |
| `src/critters.ts` | 鸟、兔、狐狸及惊吓响应 | 轻量环境 AI 与对象池候选 |
| `src/fx.ts` | 星星、萤火虫、尘埃、吠叫波纹和挖掘土粒 | 低成本视觉反馈组件 |
| `src/vignette.ts` | 记忆线稿短景的绘制、停留与淡出 | 可复用的世界空间插图播放器 |
| `src/audio.ts` | Web Audio 合成器、环境层、混响和事件音 | 程序化声音设计与参数化音频 |

## 关键设计判断

### 1. 真正可复用的是“显隐协议”，不是森林素材

`RevealObj` 把每个物体统一成 `hidden → drawing → shown → fading`。距离、灯笼半径与吠叫只改变状态；具体几何只需要提供有顺序的线段顶点。这种协议可以应用到城市线框、CAD 扫描、地图生长、魔法绘制和数据可视化。

### 2. 程序化资产需要有“绘制顺序”

线段数组不只表示形状，也表示叙事顺序。例如树应先出现树干再出现树冠。若扩展资产生成器，应把 stroke group、优先级和 reveal duration 作为一等数据，而不是只输出无序顶点。

### 3. 感官动作同时影响画面、声音、世界和 AI

吠叫会触发角色姿态、合成音、同心波纹、雾范围、地标、幽灵与动物惊吓。嗅闻同时影响角色姿态、路径 Shader 和挖掘标记。这个“一次输入，多系统响应”的结构，是该项目最值得参考的体验编排能力。

### 4. 分块生成保证了世界可继续延伸

Chunk 由坐标哈希得到固定随机种子；离开后可销毁，回来时能再次生成相同布局。当前收集、挖掘和地标状态只保存在内存 Set 中，刷新页面会丢失，因此它是可流式探索的世界原型，还不是完整存档系统。

### 5. 风格化让昂贵资产管线变成可选项

该项目没有灯光、阴影、PBR、glTF 或贴图，却通过线宽、雾、加色混合、色相、绘制时序和音频获得完整风格。对于概念验证，这种路线能显著降低资产准备成本；但若目标是写实产品展示，它不是直接替代品。

## 本地复现与浏览器验证

已在 Windows、Node.js、Chromium/WebGL2 环境完成：

- `npm install` 成功，审计结果为 0 个漏洞。
- `npm run build` 成功；产物 JS 约 612.39 kB，gzip 约 161.01 kB；Vite 报单 Chunk 超过 500 kB 的优化提醒。
- Vite 开发服务器成功运行于 `http://127.0.0.1:5173/`。
- 浏览器确认页面标题为 `Lineworld`，存在 1 个 1258×622 WebGL2 Canvas，HUD 可读，Shader 错误提示隐藏，无 Vite 错误覆盖层。
- 浏览器页面错误为空；控制台只有 `THREE.Clock` 已弃用、建议迁移到 `THREE.Timer` 的警告。
- 自动执行 Q 嗅闻 + W 前移约 1.8 秒 + F 吠叫成功；交互截图可见吠叫同心波纹和已展开场景。

![Lineworld 初始运行截图](../../demos/lineworld/lineworld-demo.png)

![Lineworld 交互后截图](../../demos/lineworld/lineworld-interaction.png)

## 当前工程边界与风险

- `main.ts` 集中持有输入、状态、动作、相机、HUD 和主循环；继续增加玩法会迅速变成大文件。
- 没有碰撞、寻路、物理、任务系统、存档、测试、调试 GUI、录制或发布流程。
- 移动依赖键盘；指针只用于相机，手机没有虚拟摇杆或动作按钮。
- 7×7 Chunk 可同时存在，每个普通草地 Chunk 约 2.4 万根草；低端移动 GPU 需要实测和密度/视距降级。
- 所有草共享全局 Shader uniforms，效率高，但不便同时渲染多个独立光池或多玩家视角。
- `LineSegments2` / `LineMaterial` 的粗线支持已写入 `world.ts`，但当前资产调用没有启用 `thick=true`，不能把它当成已展示能力。
- `THREE.Clock` 已在 Three.js r185 弃用；升级依赖前应迁移。
- 生产包仍是单一大 Chunk，适合短 Demo，不适合把所有扩展一次性塞入首屏。

## 可扩展能力路线

### 优先级 A：先抽出真正可复用的模块

1. `LineRevealController`：显隐状态机、绘制速度、距离策略、flash 策略与资源释放。
2. `ProceduralLineAsset`：统一返回线段、stroke 分组、绘制顺序、碰撞代理和 perch 元数据。
3. `ChunkProvider`：把生成、加载、销毁、状态恢复和 LOD 从 `World` 分离。
4. `ActionEventBus`：让 bark/sniff/dig 通过事件连接音频、FX、AI、叙事和 HUD。
5. `ProceduralAudioKit`：环境层、卷积 IR、formant bark、bell 和奖励音参数化。

### 优先级 B：把 Demo 变成可持续探索的游戏骨架

- 用 localStorage/IndexedDB 保存收集、挖掘、地标、世界色相和玩家位置。
- 加入目标、线索、章节、地图标记、可配置记忆文本和多结局。
- 加入碰撞代理、地形高度、河流/桥梁、可交互物和简单 NavMesh。
- 将动物改为可配置状态机，增加听觉半径、视野、栖息地和昼夜行为。
- 为幽灵和 vignette 增加数据驱动时间线、字幕、本地化与内容包。

### 优先级 C：性能与生产化

- 按距离降低草密度、粒子数量和 Chunk 视距；建立桌面/集显/手机性能矩阵。
- 将 Chunk 生成迁移到 Worker，避免进入新区块时主线程抖动。
- 合并小型线稿对象、复用材质与对象池，减少对象数量和垃圾回收。
- 对 Three.js 主包、音频和可选叙事内容做动态加载；迁移 `THREE.Timer`。
- 加入 WebGL 失败回退、加载状态、错误边界、`prefers-reduced-motion` 与质量档位。
- 增加触屏摇杆、动作按钮、键位设置、色觉/字幕/音量辅助和暂停界面。

### 优先级 D：视觉与内容扩展

- 保留线稿主风格时，可增加多层线宽、局部 Bloom、体积雾或受控色彩分区；先验证不会破坏黑暗留白。
- 支持 glTF 作为“生成线框/轮廓线”的输入源，让程序化世界容纳品牌物体或真实角色资产。
- 增加天气、昼夜、季节、风场、河面、雪地脚印和可变环境状态。
- 建立导演模式：自动路线、关键事件、镜头段落、字幕和 WebM/MP4 导出，便于做可发布演示片。

## 阶段结论

Lineworld 最适合作为 **Three.js 风格化程序世界、程序化角色、感知型交互和轻叙事编排的完整案例**。它不应直接被当成通用游戏引擎或高性能开放世界框架。短期最值得抽取的是 `LineRevealController`、程序化线稿资产协议、ChunkProvider、感官动作事件总线和程序化音频工具；只有当第二种世界或第二个角色能复用这些模块时，才算完成从“作品源码”到“可复用能力”的转化。

2026-08-20新增并迭代到 [线境：月夜追迹 v0.3.1](../../demos/lineworld-night-hunt/README.md)：目标兔子拥有显式AI状态、动态气味、洞穴意图和终止状态，狗能在真实追逐中扑击；关卡数据把视觉、碰撞代理和导航锚点分离并验证路线，玩家则不受任务矩形硬边界限制。捕获、选择、结果和跨局引路由中文任务图驱动，首次教学和阶段目标让玩法可以独立理解。

## 关联资源

- 上游仓库：<https://github.com/muratkamci/Lineworld>
- 上游在线演示：<https://lineworld.murat.works>
- 本地演示与截图：[演示说明](../../demos/lineworld/README.md)
- 可玩衍生：[线境：月夜追迹 v0.3.1](../../demos/lineworld-night-hunt/README.md)
- 技术原理：[程序化线稿角色、动物与世界](technical-principles.md)
- 部署说明：[GitHub Pages发布流程](../../demos/lineworld-night-hunt/docs/deployment.md)
- 研究版本锁：[upstream-lock.json](upstream-lock.json)
- 本地源码：`vendor-projects/Lineworld`

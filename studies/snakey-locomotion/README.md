# Snakey Locomotion：Three.js 程序化长体角色与环境交互

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [muratkamci/snakey-locomotion](https://github.com/muratkamci/snakey-locomotion) |
| 原作者 | Murat Kamci |
| 许可证 | MIT |
| 研究版本 | [`81c0073fd2e03354440ffdb36fb1849804fd66c2`](https://github.com/muratkamci/snakey-locomotion/commit/81c0073fd2e03354440ffdb36fb1849804fd66c2) |
| 研究对象 | Three.js / TypeScript 程序化运动与场景交互 Demo |
| Web 演示 | [`demos/snakey-locomotion`](../../demos/snakey-locomotion/README.md) |
| 当前状态 | 已归档 / 按需复用 |
| 归档日期 | 2026-08-20 |
| 最后更新 | 2026-08-20 |

## 为什么研究它

上游在约 1900 行 TypeScript 中组合了轨迹驱动身体、每帧动态网格、程序化地形、胶囊曲面攀爬、40 万根实例化草和反馈纹理。单项技术并非全新算法，但组合完整、依赖很少，适合作为 Three.js 高级实战案例。

本研究不把它当成成熟库，而把它作为以下问题的参考实现：

- 无骨骼和烘焙动画时，如何表示与控制长条形生物？
- 如何把运动历史转换成稳定的动态管状网格？
- 如何在不引入完整物理引擎的情况下贴合地面和解析曲面？
- 如何让大规模实例化环境响应角色并保留短期记忆？
- 哪些思路能从“一条蛇”抽离为其他项目可复用的模块？

## 归档决定

当前研究已经回答“它是什么、核心实现是什么、什么情况下值得复用”，继续细化蛇与草地本身的边际价值较低，因此暂停专项投入。归档只表示停止主动研究，不表示删除或弃用：Web 演示继续部署，源码、上游 commit、许可证、浏览器证据和 M2–M4 路线全部保留。

出现长体角色、动态管线、交互植被、地表痕迹或任意曲面运动需求时再恢复。具体触发条件、扩展映射和恢复清单见 [ARCHIVE.md](ARCHIVE.md)。

## 上游能力与本研究复现

| 能力 | 上游实现 | 当前 Web 研究台 | 判断 |
| --- | --- | --- | --- |
| 长体运动 | 每 6cm 记录头部三维轨迹，118 个截面重建蛇身 | 固定距离 `PathHistory`，88 个截面动态扫掠 | 核心表示已复现 |
| 地面贴合 | CPU 高度函数、道具解析表面、三点最高采样 | 共享高度函数和接地法线 | 原理复现，碰撞简化 |
| 爬树 | 多胶囊树干/树枝、切平面转向、脱离和接取 | 圆柱表面螺旋路径与径向法线 | 可视化复现，非完整玩法 |
| 草地交互 | 512² 半浮点 ping-pong RenderTarget、约 40 万根草 | 256² CanvasTexture 衰减场、约 2.6 万根实例草 | 数据流复现，性能实现不同 |
| 程序化材质 | Shader 蛇鳞、腹板、凹凸法线 | 代码生成蛇鳞 CanvasTexture | 轻量替代 |
| 研究可解释性 | README 与源码注释 | 四实验模式、轨迹/标架开关、研究抽屉 | 本研究新增 |

## 代码地图

### 上游重点

| 路径 | 职责 | 研究关注点 |
| --- | --- | --- |
| `src/snake.ts` | 运动状态、轨迹、动态网格、蛇皮 | 弧长采样、距离相位、局部标架 |
| `src/climbtree.ts` | 胶囊表面和攀爬树 | 最近点、表面法线、切平面运动 |
| `src/trailmap.ts` | 蛇身反馈纹理 | ping-pong、衰减与加法印记 |
| `src/grass.ts` | 40 万根实例化草 | 循环瓦片、纹理梯度和顶点弯曲 |
| `src/terrain.ts` | 高度函数和 GPU 高度纹理 | CPU/GPU 世界数据一致性 |

### 研究台模块

| 路径 | 可复用职责 | 后续抽象目标 |
| --- | --- | --- |
| `src/path-history.ts` | 按距离记录和查询路径 | TypedArray 真正环形缓冲、插值策略可配置 |
| `src/procedural-snake.ts` | 动态长体网格参考角色 | `DynamicSweepMesh`、半径曲线与材质解耦 |
| `src/interaction-field.ts` | 环境记忆参考实现 | WebGL/WebGPU 后端、移动窗口与多通道场 |
| `src/environment.ts` | 地形、植被和曲面实验环境 | `SurfaceAdapter`、循环瓦片与 LOD |

## 值得沉淀的设计

### 1. 轨迹是状态，身体是视图

只控制头部，并把历史轨迹作为唯一连续状态；身体、相机、草地印记和调试线都从同一轨迹派生。这个分层可以降低长体角色的控制复杂度。

### 2. 空间用弧长索引

身体位置按“距离头部多少米”查询，而不是按帧数或数组下标查询。这样速度变化不会直接改变身体长度，运动停止时距离相位也停止。

### 3. 表面查询先于通用物理

在明确受约束的场景中，高度函数、胶囊或 SDF 可以提供比完整刚体物理更直接的表面点与法线。适用边界必须明确：它无法自动解决任意网格、摩擦、缠绕和自碰撞。

### 4. 环境反馈是一张状态场

草地倒伏可以抽象成：

```text
state(t+1) = state(t) × decay + body stamps
```

渲染对象读取强度和梯度后决定颜色、弯曲或消失。相同机制可以支持雪地脚印、泥地车辙、烧灼、湿润、气味和 AI 危险场。

### 5. CPU 与 GPU 必须共享世界定义

上游使用同一噪声逻辑生成 CPU 高度查询和 GPU 高度纹理。研究台使用同构的 CPU/GLSL 高度函数。两端若不一致，最先出现的问题通常是角色悬浮、植被穿插和镜头碰撞错误。

## 浏览器实验结论

第一阶段研究台通过真实 Chromium 验收：

- 桌面 1440×1000：四种模式、四个参数、暂停/恢复和研究标签通过；代表性无头 WebGL 场景约 20 FPS。该数字只作为软件渲染烟雾检查，不代表真实显卡性能。
- 平板 900×900：研究面板作为覆盖层打开，Escape 关闭并把焦点返回触发按钮。
- 手机 390×844：无横向溢出，触控方向键、模式切换和底部研究 sheet 可用。
- `prefers-reduced-motion: reduce`：首次进入保持暂停，信息和控制不依赖连续动画。
- 禁用 WebGL：显示可读回退说明，并可继续阅读全部学习与扩展内容。
- 最终运行未观察到页面错误或 Shader 编译错误。

浏览器证据和复现环境记录在 [`demos/snakey-locomotion/docs/validation.md`](../../demos/snakey-locomotion/docs/validation.md)。

## 已留档的后期复用方向

### M2：工程化

- 将路径存储替换为 TypedArray 环形缓冲，避免数组移动和对象分配。
- 把半径曲线、截面、材质、路径与表面查询拆为独立接口。
- 增加路径采样、长度保持、局部标架连续性和模式切换测试。
- 建立桌面 GPU、移动 GPU、多蛇数量和不同植被密度的性能矩阵。

### M3：图形学扩展

- 使用平行移动标架降低急弯处的截面翻转。
- 把动态网格生成迁移到 WebGPU compute 或顶点纹理方案。
- 增加多级 LOD、远距离带状网格和皮肤材质预设。
- 将固定世界交互场升级为跟随角色的移动窗口和多通道纹理。

### M4：表面与运动研究

- 定义 `SurfaceAdapter.closestPoint()`，依次接入高度场、胶囊、SDF 和三角网格。
- 加入最大曲率、长度约束、自碰撞和接触区域。
- 对比轨迹跟随、骨骼 IK、Position Based Dynamics 与 Cosserat rod。
- 若研究蛇形机器人，再加入摩擦各向异性、重量分配、关节限制和驱动力；当前 Demo 不能直接承担该任务。

## 阶段结论

Snakey Locomotion 最适合作为 **Three.js 程序化长体角色与交互环境的高级案例**。第一阶段已经把“最终视觉效果”转换成可操作、可解释的 Web 研究台；项目现已归档。未来恢复时的第一项验收不是继续美化蛇，而是验证 `PathHistory`、`DynamicSweep`、`SurfaceAdapter` 和 `InteractionField` 能否在第二种角色与第二种环境中复用。

## 关联资源

- 上游仓库：<https://github.com/muratkamci/snakey-locomotion>
- 上游 README：<https://github.com/muratkamci/snakey-locomotion#readme>
- 研究版本锁：[upstream-lock.json](upstream-lock.json)
- 归档与恢复：[ARCHIVE.md](ARCHIVE.md)
- Web 研究台：[演示说明](../../demos/snakey-locomotion/README.md)
- 上游许可证：[MIT notice](../../demos/snakey-locomotion/UPSTREAM-LICENSE.md)

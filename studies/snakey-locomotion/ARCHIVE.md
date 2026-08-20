# Snakey Locomotion 归档与恢复说明

## 归档记录

| 字段 | 内容 |
| --- | --- |
| 状态 | 已归档 / 按需复用 |
| 归档日期 | 2026-08-20 |
| 归档原因 | 已完成能力识别和可视化复现；当前没有长体角色或交互植被的直接项目需求，继续优化同一场景的边际价值较低 |
| 保留方式 | 源码、研究文档、上游版本锁和 GitHub Pages 演示全部保留 |
| 在线演示 | <https://yydshly.github.io/0819_githubcode_study/snakey-locomotion/> |
| 上游锁定 | `81c0073fd2e03354440ffdb36fb1849804fd66c2` |

归档不是废弃。这个项目继续作为 Three.js 程序化草地、长体运动、曲面约束和环境反馈的可运行参考，但不进入主动研究队列。

## 保留资产

- 四模式 WebGL 演示：地面蜿蜒、曲面攀爬、交互场、结构解剖。
- `PathHistory`：按空间距离记录并按弧长查询运动历史。
- 动态扫掠蛇身：沿局部标架实时更新 `BufferGeometry`。
- `InteractionField`：带衰减的环境状态场参考实现。
- 程序化地形、实例化草地、树木和 WebGL 回退。
- 上游 commit、MIT notice、设计契约、浏览器验收和交接记录。

## 重新启用条件

满足下列任一真实需求时可以恢复；仅希望继续美化当前蛇和草地，不构成恢复条件。

| 触发需求 | 优先提取能力 | 第一个验证对象 |
| --- | --- | --- |
| 龙、触手、沙虫、藤蔓或尾巴 | `PathHistory`、动态扫掠和稳定局部标架 | 一条材质与截面完全不同的触手 |
| 动态电缆、软管、道路或隧道 | 路径采样、半径曲线和管状网格 | 可编辑控制点的动态电缆 |
| 草地倒伏、雪地脚印、泥地车辙 | `InteractionField` 和实例化读取 | 角色脚印或车辆车辙 |
| 爬墙、贴地或管道机器人 | `SurfaceAdapter` | 高度场之外的 SDF 或三角网格 |
| 多角色、大地图或移动端项目 | 环形缓冲、LOD、GPU 状态场 | 两个角色与三档植被密度基准 |
| 机器人或生物力学课题 | 接触、摩擦、长度约束和动力学 | 与运动学基线的定量对照 |

## 推荐扩展顺序

1. 复制最小演示，增加一个非蛇对象，确认现有表示能够复用。
2. 将 `PathHistory` 改成 TypedArray 环形缓冲，并补充路径采样测试。
3. 抽离 `DynamicSweepMesh`，让截面、半径、材质和路径来源可替换。
4. 定义 `SurfaceAdapter`，先接入高度场和圆柱，再考虑 SDF 或三角网格。
5. 为 `InteractionField` 增加 GPU 后端、移动窗口和多通道状态。
6. 最后才评估自碰撞、PBD、Cosserat rod 或 WebGPU compute。

## 恢复验收条件

重新进入研究状态前，应同时满足：

- 有一个明确产品或研究需求，而不是仅复刻原 Demo。
- 至少有一个非蛇对象复用核心模块，没有复制 `procedural-snake.ts` 的角色业务逻辑。
- 桌面和目标移动设备有真实性能基线，记录对象数量、植被密度、帧率和显存边界。
- 新增表面或交互场实现具有可重复测试或可视化调试证据。
- README、研究状态、演示说明与 Pages 路径同步更新。

## 恢复操作清单

```text
1. 将总索引状态从“已归档”改为“研究中”
2. 从 main 创建独立研究分支
3. 运行 npm ci && npm run build
4. 复核当前 Three.js、Vite 和浏览器兼容性
5. 新增非蛇复用样例和性能基线
6. 更新 validation.md 与 handoff.md
7. 通过 Pages 预览验证后再合并
```

## 回滚与追溯

- 实现与归档基线：`f027a41c347051028347c1434175fd9a98e614af`。
- 上游来源和许可证分别记录在 [upstream-lock.json](upstream-lock.json) 与 [`UPSTREAM-LICENSE.md`](../../demos/snakey-locomotion/UPSTREAM-LICENSE.md)。
- 演示构建入口为 [`demos/snakey-locomotion`](../../demos/snakey-locomotion/README.md)，Pages 由仓库统一工作流组装。

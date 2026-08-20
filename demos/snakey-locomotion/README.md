# Snakey Locomotion Web 研究展厅

这是对 [muratkamci/snakey-locomotion](https://github.com/muratkamci/snakey-locomotion) 核心思路进行独立拆解和 Web 可视化的研究 Demo。页面不是上游逐像素复制，也不是可直接安装的通用蛇类库；它把值得学习的机制转化为四个可切换实验，并展示后续模块化方向。

> **项目状态：已归档 / 按需复用（2026-08-20）**。当前不继续专项研究，演示仍随 GitHub Pages 发布，作为 Three.js 草地环境、长体运动和环境反馈的技术备份。重新启用的条件与扩展入口见[归档说明](../../studies/snakey-locomotion/ARCHIVE.md)。

## 本地运行

> 不要直接双击 `index.html`。这是 Vite + TypeScript 应用，必须通过 HTTP 开发服务器或生产预览运行。

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4198
```

然后打开 <http://127.0.0.1:4198/>。

生产构建：

```bash
npm run build
npm run preview
```

## 四种实验

| 模式 | 展示内容 | 对应可复用机制 |
| --- | --- | --- |
| 地面蜿蜒 | 距离驱动相位、等弧长轨迹、动态蛇身 | `PathHistory`、`DynamicSweep` |
| 曲面攀爬 | 圆柱表面法线和三维历史路径 | `SurfaceAdapter` |
| 交互场 | 衰减纹理、草叶强度与梯度反馈 | `InteractionField` |
| 结构解剖 | 轨迹、采样截面和局部标架 | 调试与算法可解释性 |

## 操作

- `W` / `↑`：提高前进速度。
- `A` / `D` 或左右方向键：转向。
- 拖动场景：旋转相机。
- 滚轮：调整观察距离。
- 空格或顶部按钮：暂停/运行。
- 手机：使用屏幕底部方向键和研究笔记抽屉。

## 源码模块

| 文件 | 职责 |
| --- | --- |
| `src/path-history.ts` | 固定距离采样的有界历史路径与按弧长查询 |
| `src/procedural-snake.ts` | 运动状态、动态扫掠网格、轨迹和局部标架调试 |
| `src/interaction-field.ts` | 可衰减的二维环境记忆参考实现 |
| `src/environment.ts` | 程序化地形、实例化草地、树木与交互场可视化 |
| `src/main.ts` | 场景生命周期、相机、输入、模式、参数和响应式研究抽屉 |

## 研究边界

- 本演示只复现上游最值得学习的表示方法，植被数量和细节为浏览器研究台重新取舍。
- 曲面攀爬使用圆柱参考表面，不等同于上游由多胶囊组成的完整树枝场景。
- 交互场采用 CPU CanvasTexture 参考实现；上游使用 GPU ping-pong RenderTarget。
- 不包含真实摩擦、肌肉、受力、自碰撞或机器人控制。

完整结论见 [`studies/snakey-locomotion/README.md`](../../studies/snakey-locomotion/README.md)。

## 后期复用入口

| 后续需求 | 首选模块 | 建议扩展 |
| --- | --- | --- |
| 龙、触手、藤蔓、动态电缆 | `PathHistory` + 动态扫掠网格 | 独立半径曲线、材质和截面接口 |
| 草地倒伏、雪地脚印、车辙 | `InteractionField` | GPU 后端、移动窗口和多通道状态 |
| 贴地、爬墙、管道运动 | 表面查询与局部标架 | SDF、三角网格、曲率和接触约束 |
| 大规模环境场景 | 实例化草地与 Shader | LOD、密度分层和移动端性能基准 |

恢复研究前先增加一个非蛇对象，验证模块能在不复制蛇业务代码的情况下复用；否则继续把它视为效果参考，而不是通用库。

## 文档

- [设计契约](docs/design-contract.md)
- [浏览器验收](docs/validation.md)
- [交接说明](docs/handoff.md)
- [上游 MIT 许可证](UPSTREAM-LICENSE.md)
- [归档与恢复说明](../../studies/snakey-locomotion/ARCHIVE.md)

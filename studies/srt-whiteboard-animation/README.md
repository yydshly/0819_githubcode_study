# SRT Whiteboard Animation

> 将静态彩色插画转换为可控白板手绘视频：OpenCV 从图片中提取墨迹像素和路径坐标，程序按照区域时间与落笔规则逐帧移动画笔、累计更新遮罩，先显露黑白线稿，再恢复彩色原图，最后编码为 MP4。

它不是大模型直接生成视频，而是“图像处理 + 时间编排 + 确定性逐帧渲染”。大模型或人工可以负责准备插画、字幕和语义区域，最终视频由 OpenCV 与 FFmpeg 生成。

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation) |
| 原作者/组织 | geeklee / 江哥是老登啊 |
| 许可证 | MIT |
| 研究版本 | `696a7243c0e6ffb6827676e539c2ca5ebae2bf6b` |
| 本地检出 | `vendor-projects/srt-whiteboard-animation`（被主仓库忽略） |
| 演示 | [本地复现证据](../../demos/srt-whiteboard-animation/README.md) |
| 当前状态 | 已复现 |
| 最后更新 | 2026-08-20 |

## 为什么研究它

该项目提供了一个清晰的“Agent 语义编排 + 传统图像处理确定性渲染”样本。研究重点不是生成式视频模型，而是 SRT 时间轴、人工确认、声明式区域标注、遮罩不变量和像素级笔迹如何组成可控内容流水线。

## 研究问题

- SRT 如何通过场景时长与 `annotation.json` 驱动画面叙事？
- 矩形遮罩、网格路径和骨架路径分别提供了什么控制力与视觉质量？
- 从研究原型走向可批量生产，还缺少哪些自动化与质量保障？

## 快速运行

已在 Windows、Python 3.10.11、FFmpeg 6.1.3 环境复现。上游脚本在项目内创建 `.venv`，安装 `opencv-python`、`numpy`、`av` 和 `Pillow`。

```powershell
cd vendor-projects\srt-whiteboard-animation
python scripts\prepare_env.py
.\.venv\Scripts\python.exe scripts\render_stream_whiteboard.py examples\scene-01-monkey-mountain-banana.png examples\scene-01-monkey-mountain-banana.annotation.json ..\..\demos\srt-whiteboard-animation\monkey-banana-reproduced.mp4 assets\drawing-hand.png --ink-path grid --color-fill contour-wipe
```

## 代码地图

| 路径或模块 | 职责 | 关注点 |
| --- | --- | --- |
| `SKILL.md` | Agent 工作流与确认关卡 | 生图与语义标注依赖外部 Agent 能力 |
| `scripts/parse_srt.py` | SRT 解析与时长分组 | 仅按时间切分，不做语义断句 |
| `assets/preview.html` | 本地区域与时间编辑器 | File System Access API、矩形代理 |
| `scripts/render_stream_whiteboard.py` | 分区遮罩编排 | 当前按 `startMs` 顺序串行渲染 |
| `scripts/stream_render.py` | 网格/骨架笔迹与上色 | OpenCV 启发式算法、输入图敏感性 |
| `scripts/merge_scenes.py` | MP4 拼接 | FFmpeg copy 优先、PyAV 回退 |

## 关键设计

1. SRT 先形成字幕条和建议场景，每幕获得 `sceneDurationMs`。
2. Agent 或人工将画面主体标成矩形区域，并关联字幕、叙事角色和开始时间。
3. 当前区域的允许掩码等于自身矩形减去所有后续矩形及保护区，防止后续对象提前露出。
4. 墨迹通过自适应阈值提取；`grid` 使用墨迹网格、连通域和贪心路径，`skeleton` 使用 Zhang-Suen 细化与八邻域追踪。
5. 渲染先揭示线稿，再通过 `contour-wipe` 或圆形笔刷恢复原图颜色，最后转码为 H.264。

## 详细实现原理

### 1. 一张彩色原图，两份内部像素数据

输入通常只有一张彩色插画。程序保留原始彩图 `color_img`，同时通过灰度化和自适应阈值生成黑白墨迹图 `ink_paint` 与墨迹布尔矩阵 `ink_pixels`。因此“先黑白、后彩色”不是准备两张素材，而是对同一张源图使用两种内部表示。

### 2. OpenCV 将墨迹变成坐标路径

`skeleton` 模式使用 Zhang-Suen 细化把粗墨线压成接近一个像素宽的骨架，再通过八邻域追踪得到多条有序坐标序列。区域内部的自动顺序采用端点优先、交叉点尽量直行、短碎片过滤、从上到下和从左到右排序；这是几何启发式笔顺，不等于人类真实笔顺。

### 3. 区域时间决定“什么时候可以画”

`annotation.json` 为每个元素提供 `region`、`startMs` 和 `durationMs`。渲染器按照开始时间处理区域，并构造“当前矩形减去后续区域和保护区”的允许遮罩，防止尚未开始的主体提前露出。

### 4. 路径坐标驱动累计遮罩

路径坐标被均匀映射到目标视频帧。每一帧都在上一个坐标与当前坐标之间生成一小段粗线遮罩，并计算：

```text
本帧可见墨迹 = 原图墨迹 ∩ 画笔经过范围 ∩ 当前允许区域
```

命中的像素被写入持久画布；以前已经显露的像素不会消失。单帧遮罩只是小圆或粗线段，但所有帧累计后会形成沿原始线稿生长的复杂不规则边界。

### 5. 黑白落墨和彩色刷回是两个阶段

第一阶段只把 `ink_paint` 中的黑白像素写入画布。第二阶段使用柔边圆形笔刷或轮廓扫描，把 `color_img` 中的彩色像素复制回来：

```text
黑白阶段：drawn[revealed] = ink_paint[revealed]
彩色阶段：drawn = drawn × (1 - brushMask) + color_img × brushMask
```

因此颜色不是后续生成的，而是源图本来就有；程序只是控制何时显露黑白墨迹、何时恢复原图颜色。

### 6. 画手只是同步覆盖层

透明画手 PNG 的笔尖锚点跟随当前路径坐标。墨迹和颜色写入持久画布，画手只叠加到当前视频帧，因此不会永久留在画面上。真正驱动画面显露的是“坐标 + 遮罩”，画手负责让这个确定性过程看起来像人在绘制。

### 7. 逐帧编码视频

每次遮罩更新和画手叠加后，OpenCV `VideoWriter` 写入一帧；全部帧完成后由 FFmpeg 转码为 H.264/yuv420p MP4。

```text
彩色插画 + SRT + annotation.json
  → 墨迹提取
  → 骨架坐标与落笔排序
  → 区域时间编排
  → 黑白累计揭示
  → 彩色原图刷回
  → 透明画手覆盖
  → 逐帧写入
  → H.264 MP4
```

## 复现与实验

本轮使用上游“猴子山抢香蕉”源图和三段区域标注重新渲染。结果为 H.264、1080×600、60 FPS、8.6 秒、516 帧；输出 SHA-256 为 `F036854207DF6A7536A674B0AC655D74CD1F09814B62757F0B97E18074772CBA`。

本机输出与上游参考 MP4 的逐帧 PSNR 为 `average:inf / min:inf / max:inf`，说明全部解码帧像素一致；仅视频容器元数据因 FFmpeg 版本不同而产生 14 bytes 文件大小差异。

抽帧确认：

- 0.1 秒为干净米黄背景，没有提前露线。
- 3.2 秒左侧场景已完成，中间主体正在绘制，右侧仍隐藏。
- 6.0 秒左、中区域已出现，右侧开始进入时序。
- 8.5 秒完整恢复源图。

这证明确定性渲染链路可复现；并不证明“纯 SRT 自动生成完整视频”，因为源图和语义标注仍来自上游样例或外部 Agent/人工步骤。

## 阶段结论

项目适合作为可控白板动画和 Agent Skill 研究基线。它的工程组合有借鉴价值，但当前只有一个上游提交，未见测试、CI、版本化发布和依赖锁定。下一阶段优先研究自动对象分割、SRT 语义对齐、矢量笔顺和音视频合流，不直接把当前实现当成生产底座。

## 关联资源

- [上游版本锁](upstream-lock.json)
- [复现视频与抽帧](../../demos/srt-whiteboard-animation/README.md)
- [原项目文档](https://github.com/geeklee/srt-whiteboard-animation/blob/main/README.md)

const scenes = {
  landmark: {
    image: "assets/single-realm-pavilion.png",
    alt: "雨后云海之上的悬空藏经阁仙侠场景",
    caption: "雨后悬空藏经阁",
    route: "单体仙境 × 华彩通透仙侠",
    name: "一处地标，撑起完整仙境",
    summary: "围绕唯一主体建立近景框架、人物承载面、主建筑、从属空间和极远天际，让画面明亮、通透且具有可信尺度。",
    input: "雨后初晴的悬空藏经阁，植物鲜绿，不要灰蒙蒙。",
    effect: "单一地标清楚；湿润材质可见；小人物证明尺度；天空和云隙保留通透呼吸感。",
    prompt: "16:9，低机位人眼高度，雨后悬空藏经阁；五层纵深、微小背影人物、统一侧逆光、湿润玉石与漆木、透明蓝灰阴影、无栏杆开放边缘。"
  },
  city: {
    image: "assets/inhabited-celestial-city.png",
    alt: "云海与浮空大陆之间连续展开的仙界城市",
    caption: "云上九重天宫城",
    route: "神域聚居地 × 华彩通透仙侠",
    name: "不是一座宫殿，而是一种文明",
    summary: "用主城区、从属城区、桥梁、庭院、云港和极远聚落组成可居住的神域，让繁华来自连续空间而不是建筑堆满画面。",
    input: "建造在浮空大陆上的九重天宫城，神仙长期居住，繁华但通透。",
    effect: "宫城连续且层级分明；交通与生活空间可读；城区之间保留云隙、桥下深空和庭院空气。",
    prompt: "16:9，远距离低机位，轻度长焦压缩；主宫阙统领连续浮空城区，桥梁与瀑布连接近中远层，极小人物承担文明尺度，深景深、通透侧光。"
  },
  mega: {
    image: "assets/eastern-sky-megastructure.png",
    alt: "从巨大东方天门下方仰望远方仙城的苍穹巨构场景",
    caption: "压住苍穹的巨型天门",
    route: "神域聚居地 × 东方苍穹巨构",
    name: "让建筑超出画面，观者站在其下",
    summary: "以低机位、门槛窥视、结构裁切和尺度断裂制造神圣压迫；主巨构不完整展示，远方仙城只用于证明它的不可思议体量。",
    input: "一座无法看见完整边界的白玉天门，悬压在仙城上方，人物极小。",
    effect: "巨构越过画面边缘；人物处于从属位置；高明度白玉与冷色阴影保持肃穆、安静和不可抵达感。",
    prompt: "16:9，远距离低机位，平视略仰，长焦压缩；白玉巨型天门裁切出画并压住远方宫城，孤独背影人物约占2%，克制象牙侧逆光、无俯拍。"
  }
};

const fields = {
  image: document.querySelector("#scene-image"),
  caption: document.querySelector("#scene-caption"),
  route: document.querySelector("#scene-route"),
  name: document.querySelector("#scene-name"),
  summary: document.querySelector("#scene-summary"),
  input: document.querySelector("#scene-input"),
  effect: document.querySelector("#scene-effect"),
  prompt: document.querySelector("#scene-prompt")
};

const visual = document.querySelector(".scene-visual");
const copyButton = document.querySelector("#copy-prompt");

function selectScene(key) {
  const scene = scenes[key];
  if (!scene) return;

  document.querySelectorAll(".scene-tab").forEach((button) => {
    const active = button.dataset.scene === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  visual.classList.add("is-changing");
  window.setTimeout(() => {
    fields.image.src = scene.image;
    fields.image.alt = scene.alt;
    fields.caption.textContent = scene.caption;
    fields.route.textContent = scene.route;
    fields.name.textContent = scene.name;
    fields.summary.textContent = scene.summary;
    fields.input.textContent = scene.input;
    fields.effect.textContent = scene.effect;
    fields.prompt.textContent = scene.prompt;
    visual.classList.remove("is-changing");
  }, 150);
}

document.querySelectorAll(".scene-tab").forEach((button) => {
  button.addEventListener("click", () => selectScene(button.dataset.scene));
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(fields.prompt.textContent);
    copyButton.textContent = "已复制";
    window.setTimeout(() => { copyButton.textContent = "复制"; }, 1400);
  } catch {
    copyButton.textContent = "复制失败";
  }
});

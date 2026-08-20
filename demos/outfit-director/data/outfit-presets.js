(function registerFemalePresets(global) {
  const data = global.OutfitDirectorData = global.OutfitDirectorData || {};

  data.femalePresets = {
    urban: {
      label: "节奏爽感女性穿搭",
      palette: "黑白灰与单一强调色",
      direction: "自信、明亮、灵动，强调现实场景穿搭差异",
      recommended: ["M10", "M1"],
    },
    oriental: {
      label: "清冷汉服贵女",
      palette: "月白、浅蓝、银灰",
      direction: "清冷、温婉、克制，长袖和裙摆保持完整",
      recommended: ["M1", "M2", "M5"],
    },
    lookbook: {
      label: "拼贴 Lookbook 女性造型",
      palette: "白、灰、雾蓝、黑",
      direction: "轻快、干净、具有平面贴纸与社交媒体视觉感",
      recommended: ["M1", "M8"],
    },
    stage: {
      label: "东方幻想女性舞台",
      palette: "月白、浅金、雾青、流光蓝",
      direction: "飘逸、仪式化，强化披帛、刺绣和流苏表现",
      recommended: ["M4", "M6", "M12"],
    },
  };
})(window);

(function registerDirectorProfiles(global) {
  const data = global.OutfitDirectorData = global.OutfitDirectorData || {};

  data.profiles = {
    general: {
      id: "general",
      label: "通用换装导演",
      description: "覆盖女性、男性、宠物，以及 K 卡点和 D 舞蹈路线。",
    },
    female: {
      id: "female",
      label: "女性专项导演",
      description: "强化成年女性身份、妆容、发饰、衣料和女性时装转场规则。",
      allowedSubjects: ["woman"],
      source: {
        repository: "liyue-aigc/female-outfit-director",
        commit: "2d30d40d09368aab333d054c035289061c9fcf47",
        license: "MIT",
      },
      identityRule: "保持同一张脸、同一成年年龄感、同一肤色、发型、发色、身材比例与整体气质，只改变穿搭和编排姿势",
      physicalRule: "长裙、长袖、披帛和流苏遵循自然重力、惯性延迟与逐渐回落，换装瞬间不中断衣料物理",
      compositionRule: "女性五套造型使用中央完整主体与四个侧边完整轮廓，面部、头饰和耳饰保持一致",
    },
  };
})(window);

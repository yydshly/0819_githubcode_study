(function () {
  "use strict";

  const repository = "https://github.com/adrianpunk/Punk-Skill";
  const rawRoot = "https://raw.githubusercontent.com/adrianpunk/Punk-Skill/main/screenshots";

  const styles = [
    { id: "black-white-minimal-concept", name: "黑白极简概念", type: "cover", ext: "png", description: "以巨型标题、克制留白和单一视觉隐喻组织抽象观点。", useCases: "战略观点、哲学议题、批判性长文", visual: "黑白灰、编辑网格、语义隐喻" },
    { id: "semantic-minimal-translation", name: "语义转译极简", type: "cover", ext: "png", description: "把一个词或短句转译成最少元素的概念画面。", useCases: "词语解释、口号、短观点、概念海报", visual: "极简、符号化、语义转换" },
    { id: "retro-torn-collage", name: "复古手撕拼贴", type: "cover", ext: "png", description: "用纸张断面、旧照片和胶带制造有冲突感的叙事拼贴。", useCases: "社媒传播、文化观察、街头与复古主题", visual: "撕纸、旧印刷、红色强调" },
    { id: "block-world", name: "方块世界", type: "cover", ext: "jpg", description: "把任务、系统或教程重构为可探索的方块化微缩世界。", useCases: "工具教程、系统搭建、升级路径、游戏化内容", visual: "体素、关卡、模块化空间" },
    { id: "giant-perspective-chinese-title", name: "巨型透视中文标题", type: "cover", ext: "png", description: "让中文标题成为具有纵深和冲击力的画面主体。", useCases: "中文社媒封面、活动主题、强传播标题", visual: "巨字、透视、强冲击" },
    { id: "brick-world", name: "积木世界", type: "cover", ext: "png", description: "用积木搭建人物、团队和流程，强调从零构造的过程。", useCases: "团队协作、规划、教育、亲子与系统隐喻", visual: "积木、搭建、明快模块" },
    { id: "consulting-report-visual", name: "咨询报告视觉", type: "cover", ext: "jpg", description: "以清晰结构、数据感和专业秩序呈现复杂商业判断。", useCases: "战略报告、方法论、产品分析、组织变革", visual: "理性结构、商务配色、图表感" },
    { id: "research-journal-concept", name: "科研期刊概念", type: "cover", ext: "jpg", description: "用期刊封面语言表现机制、实验对象与研究关系。", useCases: "科研解读、医疗科普、材料与生物机制", visual: "微观结构、标注线、期刊质感" },
    { id: "retro-diffuse-gradient", name: "复古弥散渐变", type: "cover", ext: "jpg", description: "用柔和色域、颗粒和弥散光形成情绪化编辑封面。", useCases: "艺术设计、品牌故事、情绪文章、文化杂志", visual: "弥散色彩、胶片颗粒、柔光" },
    { id: "minimal-public-space-photography", name: "极简公共空间摄影", type: "cover", ext: "jpg", description: "以建筑尺度、留白和孤立人物表达秩序与处境。", useCases: "长观点、文化观察、空间与个体议题", visual: "公共空间、尺度感、摄影留白" },
    { id: "business-magazine-front-page", name: "商业杂志头版", type: "cover", ext: "jpg", description: "用主视觉、封面线和新闻感建立高信息密度的商业叙事。", useCases: "AI、创业、投资、趋势与商业科技", visual: "杂志头版、主角化、新闻冲击" },
    { id: "black-white-gray-avant-geometry", name: "黑白灰先锋几何", type: "cover", ext: "jpg", description: "用高对比几何、切割和现代主义构图传达实验气质。", useCases: "实验设计、现代主义、几何与先锋文化", visual: "几何切割、高反差、现代主义" },
    { id: "black-red-silhouette", name: "黑红剪影", type: "cover", ext: "png", description: "用黑红对撞和动作剪影快速建立危险、速度或决断感。", useCases: "工具教程、AI 工作流、金融、电影化议题", visual: "黑红、剪影、速度感" },
    { id: "avant-retro-architecture-poster", name: "先锋复古建筑海报", type: "cover", ext: "png", description: "将地标建筑重组为具有时代纹理的文化海报。", useCases: "城市、旅行、建筑、展览与空间文化", visual: "建筑透视、复古色、丝网印刷" },
    { id: "retro-ink-dot-matrix-metaphor", name: "复古油墨点阵隐喻", type: "cover", ext: "png", description: "以油墨、点阵和技术档案感承载抽象系统隐喻。", useCases: "AI、技术系统、研究与抽象观点", visual: "点阵、油墨、档案感" },
    { id: "black-midcentury-modernist-cover", name: "黑色复古现代主义封面", type: "cover", ext: "png", description: "在深色底上融合中世纪现代主义与高端编辑秩序。", useCases: "高端服务、产品、人物、建筑与概念主题", visual: "黑底、复古现代、克制奢华" },
    { id: "silver-foil-blue-minimal", name: "银色锡纸蓝字", type: "cover", ext: "png", description: "以银色褶皱材质和蓝色信息层制造冷静的科技质感。", useCases: "增长路径、商业系统、方法论、AI 工具", visual: "银箔、蓝色、冷感材质" },
    { id: "color-neo-constructivist-megastructure-poster", name: "彩色新构成主义巨构海报", type: "cover", ext: "png", description: "用巨构、强色块和构成主义动势放大公共事件的能量。", useCases: "热点事件、体育、产品发布、城市传播", visual: "强色块、巨构、构成主义" },
    { id: "retro-japanese-sci-fi-anime-cover", name: "复古日本科幻动画", type: "cover", ext: "png", description: "用复古动画分镜和科幻冲突表现复杂系统与心理张力。", useCases: "AI、代码、心理、社会冲突与方法论", visual: "赛璐璐、科幻分镜、戏剧冲突" },
    { id: "french-minimal-ink-poster", name: "法式极简墨线海报", type: "cover", ext: "png", description: "以手绘墨线、纸面留白和微妙关系构成诗性观点海报。", useCases: "关系、制度、选择、AI 与抽象观点", visual: "墨线、留白、法式编辑" },
    { id: "brand-collaboration-connection", name: "品牌协同连接", type: "cover", ext: "png", description: "把两个品牌或工具表现为结构清楚、可理解的连接关系。", useCases: "品牌联名、工具集成、自动化与企业产品发布", visual: "双模块、连接桥、品牌色" },
    { id: "anthropic-research-style", name: "Anthropic Research 风格", type: "cover", ext: "png", description: "以研究博客式插画表达知识、模型和系统之间的关系。", useCases: "AI 研究、知识系统、设计与机制说明", visual: "研究插画、柔和纸感、系统关系" },
    { id: "kimi-stlye", name: "Kimi 风格", type: "cover", ext: "png", description: "用俯视档案桌与材料集合呈现研究过程和项目线索。", useCases: "AI 研究、产品档案、材料与创意项目", visual: "俯视桌面、档案材料、整理感" },
    { id: "minimal-visual-metaphor", name: "极简视觉隐喻", type: "cover", ext: "png", description: "用一个准确主体和一个结构变化说明复杂的系统转折。", useCases: "AI、商业科技、产品、组织与系统变化", visual: "单一主体、结构隐喻、克制留白" },
    { id: "pixel-avatar", name: "像素头像", type: "avatar", ext: "png", description: "提取 3–5 个高识别特征，重构为纯色背景的 8-bit 头像。", useCases: "人物或宠物社交头像、像素 IP、符号化形象", visual: "8-bit、强轮廓、纯色背景" },
    { id: "grotesque-soul-sketch", name: "怪诞灵魂手绘", type: "avatar", ext: "jpg", description: "以夸张线条和不完美手感捕捉人物或宠物的性格。", useCases: "趣味头像、情绪表达、个性化手绘肖像", visual: "怪诞线稿、夸张、手绘情绪" },
    { id: "messy-crayon-pet-portrait", name: "凌乱蜡笔宠物肖像", type: "avatar", ext: "jpg", description: "用凌乱蜡笔与儿童画质感保留宠物最亲切的特征。", useCases: "宠物头像、手绘宠物肖像、纪念礼物", visual: "蜡笔、稚拙、温暖底色" },
    { id: "fashion-sketch-observation", name: "时尚速写观察页", type: "avatar", ext: "jpg", description: "把人物转化为带姿态、服装笔记和观察痕迹的速写页。", useCases: "人物肖像、街拍、旅行观察与穿搭记录", visual: "时装速写、观察笔记、轻线条" },
    { id: "polaroid-keepsake", name: "拍立得纪念卡", type: "avatar", ext: "jpg", description: "将宠物主体组织成带留白和收藏感的拍立得衍生卡。", useCases: "宠物纪念、收藏卡、节日礼物与社交分享", visual: "拍立得、柔光、纪念卡" },
  ];

  window.PUNK_SKILL_UPSTREAM_STYLES = styles.map((style) => {
    const folder = style.type === "cover" ? "punk-cover-styles" : "punk-avatar-styles";
    const file = `${style.id}.${style.ext}`;
    return {
      ...style,
      image: `${rawRoot}/${folder}/${file}`,
      sourceUrl: `${repository}/blob/main/screenshots/${folder}/${file}`,
    };
  });
})();

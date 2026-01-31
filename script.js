// 三角洲配装助手 - 主逻辑文件

// 全局变量
let currentBudget = 500000;
let currentPlayerType = "鼠鼠";
let currentMap = "zero_dam";
let currentMode = "常规";

// 地图模式限制数据
const mapModeRequirements = {
    "zero_dam": {
        "常规": { min: 100000, max: 5000000 },
        "机密": { min: 112500, max: 5000000 }
        // 无绝密模式
    },
    "longbow_valley": {
        "常规": { min: 100000, max: 5000000 },
        "机密": { min: 112500, max: 5000000 }
        // 无绝密模式
    },
    "bukshi": {
        "机密": { min: 187500, max: 5000000 },
        "绝密": { min: 550000, max: 5000000 }
        // 无常规模式
    },
    "aerospace_base": {
        "机密": { min: 187500, max: 5000000 },
        "绝密": { min: 600000, max: 5000000 }
        // 无常规模式
    },
    "tidal_prison": {
        "绝密": { min: 780000, max: 5000000 }
        // 只有绝密模式
    }
};

// 模拟数据（避免fetch跨域问题）
const localWeaponsData = [
    {
        "id": "M14-S - 满改 - CT 后托常规增高架",
        "name": "M14（S7 新改法 - 满改 - CT 后托常规增高架）",
        "type": "精确射手步枪",
        "code": "6I7VKV40EU90O684D8QL5",
        "price": 850000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "大口径输出，727 射速，游戏内爆发最高武器之一",
        "cons": "后坐力大，操控和据枪表现不佳",
        "suitable_for": ["中近距离突击", "爆发输出"],
        "tags": ["高爆发", "大口径", "高射速", "S 级强度"]
      },
      {
        "id": "无枪",
        "name": "无枪",
        "type": "无",
        "code": null,
        "price": 0,
        "strength": "c",
        "mod_level": "无",
        "pros": "最低成本进图",
        "cons": "以小博大，通过战局寻找资源",
        "suitable_for": ["资金极度匮乏", "破产"],
        "tags": ["无"]
      },
      {
        "id": "M14-S - 满改 - CT 后托据枪增高架",
        "name": "M14（S7 新改法 - 满改 - CT 后托据枪增高架）",
        "type": "精确射手步枪",
        "code": "6I7VL600EU90O684D8QL5",
        "price": 850000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "大口径输出，爆发能力极强",
        "cons": "后坐力大，操控和据枪表现不佳",
        "suitable_for": ["中近距离突击", "爆发输出"],
        "tags": ["高爆发", "大口径", "S 级强度"]
      },
      {
        "id": "M14 - 中低改 - 38 万",
        "name": "M14（性价比改法 - 中低改）",
        "type": "精确射手步枪",
        "code": "6IE1USS0CBLUR0ITR0OK6",
        "price": 380000,
        "strength": null,
        "mod_level": "中低改",
        "pros": "保留爆发输出，满改级稳定性",
        "cons": "缺点较多，操控速度一般，当前版本多数情况下不如 ASVAL",
        "suitable_for": ["中距离作战", "性价比玩法"],
        "tags": ["性价比", "爆发输出", "稳定"]
      },
      {
        "id": "M14 - 中改 - 43 万",
        "name": "M14（性价比改法 - 中改）",
        "type": "精确射手步枪",
        "code": "6IE1UFS0CBLUR0ITR0OK6",
        "price": 430000,
        "strength": null,
        "mod_level": "中改",
        "pros": "保留爆发输出，稳定性良好",
        "cons": "缺点较多，操控速度一般，当前版本多数情况下不如 ASVAL",
        "suitable_for": ["中距离作战", "性价比玩法"],
        "tags": ["性价比", "爆发输出", "稳定"]
      },
      {
        "id": "M14 - 高改 - 50 万",
        "name": "M14（性价比改法 - 高改）",
        "type": "精确射手步枪",
        "code": "6IE1UKO0CBLUR0ITR0OK6",
        "price": 500000,
        "strength": null,
        "mod_level": "高改",
        "pros": "爆发输出强劲，稳定性优秀",
        "cons": "缺点较多，操控速度一般，当前版本多数情况下不如 ASVAL",
        "suitable_for": ["中距离作战", "高强度对抗"],
        "tags": ["高输出", "稳定", "高改"]
      },
      {
        "id": "M14 - 高改 - 60 万",
        "name": "M14（性价比改法 - 高改）",
        "type": "精确射手步枪",
        "code": "6IE1V5S0CBLUR0ITR0OK6",
        "price": 600000,
        "strength": null,
        "mod_level": "高改",
        "pros": "爆发输出强劲，稳定性优秀",
        "cons": "缺点较多，操控速度一般，当前版本多数情况下不如 ASVAL",
        "suitable_for": ["中距离作战", "高强度对抗"],
        "tags": ["高输出", "稳定", "高改"]
      },
      {
        "id": "M14-S - 满改 - 常规 EBR 托",
        "name": "M14（满改 - 常规 EBR 托）",
        "type": "精确射手步枪",
        "code": "6HO0MGC0B0GKDDOTE9T6Q",
        "price": 850000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "全距离作战，高输出，大口径，游戏内最顶尖输出，满改无明显乏力点",
        "cons": "前 5 发控枪难度高，操控和据枪只能二选一",
        "suitable_for": ["全距离作战", "高强度对抗"],
        "tags": ["全距离", "高输出", "大口径", "S 级强度"]
      },
      {
        "id": "腾龙 - S - 满改 - 经典兵峰双水平",
        "name": "腾龙突击步枪（S7 改法 - 满改 - 经典兵峰双水平）",
        "type": "突击步枪",
        "code": "6IBF95S0BAC7RIM3B0293",
        "price": 900000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "全距离作战，高输出，大口径，高稳定，高双伤，大口径爆头倍率",
        "cons": "机动性和续航能力较为普通",
        "suitable_for": ["全距离作战", "爆头输出"],
        "tags": ["全距离", "高稳定", "大口径", "高爆头收益", "S 级强度"]
      },
      {
        "id": "MK47 余烬 - S - 满改 - 影袭标准版",
        "name": "MK47 余烬（满改 - 影袭标准版）",
        "type": "突击步枪",
        "code": "6IF8B0O0BAC7RIM3B0293",
        "price": 880000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "单发威力强劲，多数情况 4BTK 以内，爆头伤害 85，对 4 级听力头杀伤力足",
        "cons": "后坐力大，弹道特殊，吃熟练度和控枪能力，据枪值和操控只能二选一",
        "suitable_for": ["中近距离精准打击", "爆头作战"],
        "tags": ["高单发伤害", "爆头强势", "S 级强度"]
      },
      {
        "id": "PKM-S - 满改 - 长枪管骨架",
        "name": "PKM（满改 - 长枪管骨架）",
        "type": "轻机枪",
        "code": "6H1TQA00BAC7RIM3B0293",
        "price": 820000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "全距离作战，高输出，大口径，高续航，基础属性高，持续射击后坐力低，高弹容续航足",
        "cons": "机枪特性，轻微散射 + 扳机延迟",
        "suitable_for": ["火力压制", "全距离续航作战"],
        "tags": ["高续航", "火力压制", "大口径", "S 级强度"]
      },
      {
        "id": "ASVAL-S - 半改 - 30 万",
        "name": "ASVAL（半改 - 30 万）",
        "type": "突击步枪",
        "code": "6IEE0IK049H3TLFDHMKHO",
        "price": 300000,
        "strength": "S",
        "mod_level": "半改",
        "pros": "中近距离高输出，超高破甲，射速快，洗甲快，子弹越级击杀能力强",
        "cons": "亚音速子弹，移动靶预判需求高",
        "suitable_for": ["中近距离突击", "破甲作战"],
        "tags": ["高破甲", "高射速", "中近距离", "S 级强度"]
      },
      {
        "id": "M250-A+- 低改",
        "name": "M250（低改）",
        "type": "轻机枪",
        "code": "6H3EPMK0BAC7RIM3B0293",
        "price": 200000,
        "strength": "A+",
        "mod_level": "低改",
        "pros": "全距离高输出，大口径，高续航，续航能力强，躯干部位 TTK 极短",
        "cons": "0.1 秒扳机延迟，手感笨重，吃熟练度",
        "suitable_for": ["火力压制", "全距离作战"],
        "tags": ["高续航", "火力压制", "A + 级强度"]
      },
      {
        "id": "K416-A+- 性价比 - 25 万",
        "name": "K416（超性价比 - 25 万）",
        "type": "突击步枪",
        "code": "6IF2LTG0B0GKDDOTE9T6Q",
        "price": 250000,
        "strength": "A+",
        "mod_level": "性价比",
        "pros": "中近距离高输出，弹道稳定，高射速高破甲高秒伤，相同价位中顶尖输出，近距离作战属性优秀",
        "cons": "首段射程较低",
        "suitable_for": ["中近距离作战", "性价比玩法"],
        "tags": ["性价比", "高射速", "高破甲", "A + 级强度"]
      },
      {
        "id": "ASH12-S - 半改 - 玻璃大炮 26 万",
        "name": "ASh-12 战斗步枪（半改 - 玻璃大炮 26 万）",
        "type": "战斗步枪",
        "code": "6HC4OHG0EU90O684D8QL5",
        "price": 260000,
        "strength": "S",
        "mod_level": "半改",
        "pros": "全距离超高输出，越级 2 枪躯干 3 枪最高 4 枪，高精度点射拥有连狙杀伤力",
        "cons": "低射速，高控枪和定位需求，腰射值为 0",
        "suitable_for": ["全距离精准打击", "连狙式作战"],
        "tags": ["超高输出", "精准点射", "S 级强度"]
      },
      {
        "id": "M7-S - 满改 - 平民高操控版",
        "name": "M7 长管满改（平民满改高操控版）",
        "type": "战斗步枪",
        "code": "6ICEUUG049H3TLFDHMKHO",
        "price": 700000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "优秀 BTK，80~90% 的 BTK 与满改一致，4 枪稳定击杀，后坐力轻微超过满改",
        "cons": "原版秒伤和破甲较低，仅为 A + 水准",
        "suitable_for": ["全距离作战", "稳定击杀"],
        "tags": ["稳定", "高操控", "S 级强度"]
      },
      {
        "id": "K437-S - 满改 - 稳定钛金板 34 万",
        "name": "K437（性价比满改 - 稳定钛金板 34 万）",
        "type": "突击步枪",
        "code": "6IGECSC0CLQJOP03H83EG",
        "price": 340000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "输出尚可，稳定性高，射程良好，无明显缺点，适用于任何战斗情况",
        "cons": "30 发弹匣续航不足，扩充弹匣需牺牲操控或稳定性",
        "suitable_for": ["全距离作战", "全能对抗"],
        "tags": ["稳定", "射程优秀", "无明显缺点", "S 级强度"]
      },
      {
        "id": "AKM-A+- 满改 - 自动压枪斜握 DTK 版",
        "name": "AKM（满改 - 自动压枪斜握 DTK 版）",
        "type": "突击步枪",
        "code": "6I7E7FK0CBLUR0ITR0OK6",
        "price": 650000,
        "strength": "A+",
        "mod_level": "满改",
        "pros": "性价比超高，精调数据保证前 2~3 发弹道密集，全距离高输出，大口径",
        "cons": "熟练度低会打出下压枪",
        "suitable_for": ["全距离作战", "性价比高强度对抗"],
        "tags": ["高性价比", "大口径", "A + 级强度"]
      },
      {
        "id": "QJB201-A+- 低改 - 15 万",
        "name": "QJB201（低改 - 15 万）",
        "type": "轻机枪",
        "code": "6HJCNB00F23GDE3MVB138",
        "price": 150000,
        "strength": "A+",
        "mod_level": "低改",
        "pros": "中近距离高稳定，中口径，2 枪带走听力头，低改稳定性高，不缺属性",
        "cons": "散射导致中远程难以使用",
        "suitable_for": ["中近距离作战", "低改性价比玩法"],
        "tags": ["高稳定", "性价比", "A + 级强度"]
      },
      {
        "id": "马林杠杆 - A+- 高改 - 双修长管 22 万",
        "name": "马林杠杆步枪（S7 黑科技改法 - 高改 - 双修长管 22 万）",
        "type": "狙击步枪",
        "code": "6I85FI00CBLUR0ITR0OK6",
        "price": 220000,
        "strength": "A+",
        "mod_level": "高改",
        "pros": "射程内秒杀 4 级头，对 4 甲 5 甲 2 枪躯干带走，压制力和伤害夸张",
        "cons": "需要一定节奏感，把控不好连射节奏影响后坐力和射速",
        "suitable_for": ["中近距离秒杀", "高伤害对抗"],
        "tags": ["高伤害", "秒杀能力", "A + 级强度"]
      },
      {
        "id": "维克托 - A+-S - 满改 - 极限射程版",
        "name": "维克托（满改 - 极限射程版）",
        "type": "冲锋枪",
        "code": "6IC4NIO0CBLUR0ITR0OK6",
        "price": 520000,
        "strength": "A+-S",
        "mod_level": "满改",
        "pros": "极高输出和甲伤，子弹消耗量高但价格低",
        "cons": "腰射稳定性一般，手感不好，子弹限购",
        "suitable_for": ["近距离突击", "高输出作战"],
        "tags": ["高输出", "高甲伤", "近距离强势"]
      },
      {
        "id": "SR3M-S - 满改 - 回声极限射程",
        "name": "SR-3M（满改 - 回声极限射程）",
        "type": "冲锋枪",
        "code": "6I757T4049H3TLFDHMKHO",
        "price": 780000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "极高的双修属性，高稳定高腰射，满足近战任何姿态射击",
        "cons": "447 肉伤和 747 射速在混战跳杀时可能差一枪，基础射程过低",
        "suitable_for": ["近距离作战", "近战灵活射击"],
        "tags": ["高稳定", "高腰射", "S 级强度"]
      },
      {
        "id": "P90-S - 满改 - 均衡满改",
        "name": "P90（满改 - 均衡满改）",
        "type": "冲锋枪",
        "code": "6HPL8F8049H3TLFDHMKHO",
        "price": 680000,
        "strength": "S",
        "mod_level": "满改",
        "pros": "近距离高输出，小口径，高性价比，自带 50 发大弹容，续航充足，开镜呼吸晃动小",
        "cons": "水平后坐较差，出射程后伤害较低",
        "suitable_for": ["近距离作战", "续航输出"],
        "tags": ["高续航", "高性价比", "S 级强度"]
      },
      {
        "id": "MP7 (月影)-S - 中改 - 性价比 27 万",
        "name": "MP7 (月影)（中改 - 性价比 27 万）",
        "type": "冲锋枪",
        "code": "6I8FC1S049H3TLFDHMKHO",
        "price": 270000,
        "strength": "S",
        "mod_level": "中改",
        "pros": "近距离高肉伤，小口径，高腰射，拉满腰射近战无阻身法优势，游戏排名第二的输出",
        "cons": "削弱后射程更低，需要辅助武器",
        "suitable_for": ["近距离突击", "身法作战"],
        "tags": ["高腰射", "高输出", "身法优势", "S 级强度"]
      },
      {
        "id": "AUG-A - 半改 - 集成三倍性价比版",
        "name": "AUG（半改 - 集成三倍性价比版）",
        "type": "突击步枪",
        "code": "6H5E7LS0EU90O684D8QL5",
        "price": 320000,
        "strength": "A",
        "mod_level": "半改",
        "pros": "中远距离高稳定，小口径，高性价比，超低衰减，控枪难度低，躯干致死效率不错，适合藏宝图室外交战",
        "cons": "四肢伤害略差，近距离较为疲软",
        "suitable_for": ["中远距离作战", "藏宝图活动"],
        "tags": ["高稳定", "低衰减", "性价比", "A 级强度"]
      },
      {
        "id": "SVD - 低改 - 13 万超性价比",
        "name": "SVD（低改 - 13 万超性价比）",
        "type": "精确射手步枪",
        "code": "6IHDTD80CBLUR0ITR0OK6",
        "price": 130000,
        "strength": null,
        "mod_level": "低改",
        "pros": "对 4 级头威胁大，射程内压制力和威胁性不错，改装价格低，子弹损耗低，性价比高",
        "cons": "手感较差，射程和初速不佳，对交战距离要求高，40 米内对不过步枪，100 米外威胁性大幅降低",
        "suitable_for": ["中远距离狙击", "性价比狙击玩法"],
        "tags": ["狙击", "高性价比", "威胁性强"]
      }
];

const localGearData = {
  "helmets": [
    
    {
        "id": "gn_heavy_nvg",
        "name": "GN重型夜视头",
        "type": "头盔",
        "level": 5,
        "price": 600000,
        "strength": "S",
        "pros": "无遮挡视野，夜视功能，防护等级高",
        "cons": "价格昂贵，重量较大",
        "suitable_for": ["夜间作战", "高价值任务"],
        "tags": ["夜视", "高级头盔", "高防护"]
      },
      {
        "id": "level4_hearing",
        "name": "4级听力头",
        "type": "头盔",
        "level": 4,
        "price": 200000,
        "strength": "A",
        "pros": "提供20%听力加成，防护等级中等",
        "cons": "价格较高，赛季中可能涨价",
        "suitable_for": ["侦察", "单人作战"],
        "tags": ["听力增强", "四级头", "侦察"]
      },
      {
        "id": "dich_training",
        "name": "DICH训练头盔",
        "type": "头盔",
        "level": "未知",
        "price": 135000,
        "strength": "B",
        "pros": "性价比高，战备贡献突出",
        "cons": "防护能力可能不如高级头盔",
        "suitable_for": ["新手过渡", "经济配置"],
        "tags": ["性价比", "新手友好", "过渡装"]
      },
      {
        "id": "mc201_helmet",
        "name": "MC201防弹头盔",
        "type": "头盔",
        "level": 3,
        "price": 40000,
        "strength": "B",
        "pros": "提供20%听力buff，价格适中",
        "cons": "防护等级较低",
        "suitable_for": ["经济配置", "低风险任务"],
        "tags": ["三级头", "听力增强", "经济型"]
      }
  ],
  "armors": [
    
    {
        "id": "tgh_armor",
        "name": "TGH防弹衣",
        "type": "护甲",
        "level": 3,
        "price": 63000,
        "strength": "A",
        "pros": "无瞄准速度惩罚，轻微移速影响，新手首选",
        "cons": "防护等级较低",
        "suitable_for": ["新手入门", "快速移动"],
        "tags": ["三级甲", "无瞄准惩罚", "新手推荐"]
      },
      {
        "id": "mk2_vest",
        "name": "MK-2战术背心",
        "type": "护甲",
        "level": 4,
        "price": 195000,
        "strength": "A",
        "pros": "满耐久110点，维修损失9%上限，均衡首选",
        "cons": "价格较高",
        "suitable_for": ["均衡作战", "中高端对局"],
        "tags": ["四级甲", "均衡型", "满耐久高"]
      },
      {
        "id": "ha2_heavy_armor",
        "name": "HA-2重型防弹衣",
        "type": "护甲",
        "level": 6,
        "price": 3500000,
        "strength": "S",
        "pros": "仅降低3%移速、1%瞄准速度，手感接近四级甲",
        "cons": "价格极其昂贵",
        "suitable_for": ["高端对局", "高价值任务"],
        "tags": ["六级甲", "顶级防护", "高性价比手感"]
      }
  ],
  "chest_rigs": [
    {
        "id": "无",
        "name": "无",
        "type": "无",
        "code": null,
        "price": 0,
        "strength": "c",
        "mod_level": "无",
        "pros": "最低成本进图",
        "cons": "以小博大，通过战局寻找资源",
        "suitable_for": ["资金极度匮乏", "破产"],
        "tags": ["无"]
      },
    {
        "id": "assault_tactical_vest",
        "name": "强袭战术背心",
        "type": "胸挂",
        "slots": 14,
        "price": 20210,
        "strength": "A",
        "pros": "最多格数，适合高负载攻坚",
        "cons": "瞄准速度-1%",
        "suitable_for": ["高负载作战", "攻坚任务"],
        "tags": ["高容量", "攻坚专用", "可兑换"]
      },
      {
        "id": "gir_field_vest",
        "name": "GIR野战胸挂",
        "type": "胸挂",
        "slots": 16,
        "price": 120000,
        "strength": "S",
        "pros": "市场最优解，配备多个战术插袋",
        "cons": "价格较高",
        "suitable_for": ["综合任务", "战斗流"],
        "tags": ["高容量", "多插袋", "市场最优"]
      },
      {
        "id": "universal_tactical_vest",
        "name": "通用战术胸挂",
        "type": "胸挂",
        "slots": 9,
        "price": 4510,
        "strength": "B",
        "pros": "新手入门、跑刀速刷，极致性价比",
        "cons": "容量较小",
        "suitable_for": ["新手入门", "跑刀速刷"],
        "tags": ["新手友好", "性价比", "可兑换"]
      }
  ],
  "backpacks": [
    {
        "id": "无",
        "name": "无",
        "type": "无",
        "code": null,
        "price": 0,
        "strength": "c",
        "mod_level": "无",
        "pros": "最低成本进图",
        "cons": "以小博大，通过战局寻找资源",
        "suitable_for": ["资金极度匮乏", "破产"],
        "tags": ["无"]
      },
    {
        "id": "ga_field_pack",
        "name": "GA野战背包",
        "type": "背包",
        "slots": 20,
        "price": 20000,
        "strength": "A",
        "pros": "无移速负面效果，性价比高",
        "cons": "容量中等",
        "suitable_for": ["日常刷图", "快速移动"],
        "tags": ["无移速惩罚", "蓝色品质", "性价比高"]
      },
      {
        "id": "d3_tactical_climbing_pack",
        "name": "D3战术登山包",
        "type": "背包",
        "slots": 28,
        "price": 95000,
        "strength": "S",
        "pros": "移速仅-1%，性价比最高的金色背包",
        "cons": "金色品质价格较高",
        "suitable_for": ["高价值任务", "长时间作战"],
        "tags": ["金色品质", "高性价比", "大容量"]
      }
  ]
};

const localOperatorsData = [
    {
        "id": "red_wolf",
        "name": "红狼（凯·席尔瓦）",
        "type": "突击",
        "skills": {
          "main": "动力外骨骼：超载模式提升移速、射速，击倒敌人后回血并延长持续时间。",
          "second": "三联装手炮：发射三颗榴弹，主要用于逼身位和补刀。",
          "throwable": "战术烟雾弹：短时烟雾遮蔽视野。",
          "passive": "战术滑铲：能进行快速滑铲。"
        },
        "background": "GTI北美分部突击干员，首个单兵动力外骨骼使用者，以速度和体力见长。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "B",
            "reason": "技能组偏向进攻与机动，对避战搜刮的直接帮助有限。",
            "strategy": "可利用滑铲和加速快速穿越危险区域，抢先进入次级资源点。烟雾弹用于紧急遮蔽撤退。",
            "core_advantage": "高机动性用于快速转点与规避。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "S",
            "reason": "极强的单兵机动性与收割能力，完美契合偷袭、追击、夺舍后撤离的完整链条。",
            "strategy": "利用超载加速埋伏或发起偷袭；击杀后回血并延长加速，便于舔包后快速脱离战场。手炮可用于补刀或逼出掩体后的敌人。",
            "core_advantage": "击杀刷新加速与回血，是夺舍流的绝对核心发动机。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "reason": "正面提升团队突破速度与持续作战能力，是突击箭头之一。",
            "strategy": "开启超载带头冲锋，利用高射速和移速优势撕开防线。烟雾弹掩护团队推进或封锁敌方视野。",
            "core_advantage": "团队突击与持续作战的强力增益。"
          }
        }
      },
      {
        "id": "wei_long",
        "name": "威龙（王宇昊）",
        "type": "突击",
        "skills": {
          "main": "虎蹲炮：发射压缩空气弹击倒敌人，创造控制机会。",
          "second": "动力推进：快速朝指定方向推进10米，击倒敌人减少冷却。",
          "throwable": "磁吸炸弹：投掷后吸附在硬表面，对敌人和载具造成高伤害。",
          "passive": "动能辅助系统：使用技能或高处坠落后4秒内减伤并加速。"
        },
        "background": "原舰载机飞行员，高机动突击干员，擅长撕开防线、反载具。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "A",
            "reason": "强大的瞬间位移能力，能抢先抵达资源点或快速脱离危险。",
            "strategy": "落地使用推进抢先搜刮；遭遇敌人时用推进迅速拉开距离逃跑。",
            "core_advantage": "无与伦比的跑图与逃生能力。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "reason": "灵活的位移和强力控制技能，适合在复杂地形发起突袭。",
            "strategy": "利用推进快速占据有利埋伏点或发起偷袭；虎蹲炮击倒后轻松收割；磁吸炸弹封锁撤离点或车辆。",
            "core_advantage": "高机动突袭与控制。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "reason": "版本强势突击手，集位移、控制、爆发于一体，室内战与复杂地形战王者。",
            "strategy": "推进切入战场或规避火力；虎蹲炮控制关键敌人；磁吸炸弹攻坚或反载具。被动提供不错的生存容错。",
            "core_advantage": "全方位立体突击能力，猛攻队核心。"
          }
        }
      },
      {
        "id": "wuming",
        "name": "无名（埃利·德·蒙贝尔）",
        "type": "突击",
        "skills": {
          "main": "旋刃飞行器：自动追踪敌人造成伤害。",
          "second": "突破型闪光弹：致盲敌人。",
          "throwable": "静默潜袭：激活后缩小自身声音传播范围，并延长敌人用药和被救援时间。",
          "passive": "重伤延滞：使被自己击倒的敌人治疗和救援时间延长。"
        },
        "background": "原哈夫克杀手，摆脱控制后加入GTI，擅长隐蔽突袭与信息干扰。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "C",
            "reason": "技能组进攻性较强，静默潜袭对安静移动有帮助但非核心生存技能。",
            "strategy": "开启静默潜袭可以更安静地移动，避免惊动敌人。遭遇战时用闪光弹致盲逃跑。",
            "core_advantage": "移动声音减小，略微提升隐蔽性。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "reason": "完美的“老六”干员，静音、致盲、追踪、延缓救援，一套完整的偷袭与削弱组合。",
            "strategy": "开启静默潜袭埋伏，用飞行器自动索敌或补刀，闪光弹致盲后偷袭。被动让被击倒的敌人更难被救起。",
            "core_advantage": "静音偷袭与战斗减益。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "B",
            "reason": "在正面交战中作用有限，更偏向单人偷袭而非团队推进。",
            "strategy": "利用飞行器压制拐角敌人，闪光弹辅助突破。静默潜袭在特定战术迂回中有奇效。",
            "core_advantage": "侧面骚扰与单体控制。"
          }
        }
      },
      {
        "id": "ji_feng",
        "name": "疾风（克莱尔·安·拜尔斯）",
        "type": "突击",
        "skills": {
          "main": "背部辅助脊椎：实现8方向快速翻滚，躲避子弹。",
          "second": "钻墙电刺：发射可穿透薄掩体的电击，麻痹敌人并击飞其武器。",
          "throwable": "紧急回避装置：放置一个锚点，再次激活可瞬间拉回至锚点位置并回复部分生命值。",
          "passive": "灵活身法：翻滚后短时间内提升移动速度。"
        },
        "background": "S5赛季登场的高机动干员，适合突入和灵活拉扯。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "B",
            "reason": "极强的生存和脱战能力，但操作要求较高。",
            "strategy": "利用翻滚和回避装置从各种围剿中逃脱。电刺可短暂阻止追击的敌人。",
            "core_advantage": "顶尖的生存与逃脱能力。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "B",
            "reason": "灵活有余但爆发和控制不足，不如专精偷袭的干员直接。",
            "strategy": "利用高机动性在复杂地形周旋，电刺隔墙偷袭。",
            "core_advantage": "高机动性创造偷袭机会。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A+",
            "reason": "版本强势突击手，极高的操作上限，在高手手中是难以捉摸的战场幽灵。",
            "strategy": "利用翻滚无敌帧规避关键伤害，切入敌阵扰乱阵型。电刺克制掩体后的敌人。回避装置提供二次进场或紧急回复能力。",
            "core_advantage": "高操作上限的机动战神。"
          }
        }
      },
      {
        "id": "feng_yi",
        "name": "蜂医（罗伊·斯米）",
        "type": "支援",
        "skills": {
          "main": "激素枪：远程治疗多名队友或自我恢复，开镜可扣除敌人血量。",
          "second": "烟幕无人机：喷射15米烟雾长廊，分割战场或提供掩护。",
          "throwable": "蜂巢科技烟雾弹：投掷后形成烟雾，激素枪射击可转为绿色治疗烟雾。",
          "passive": "高效救援：1.4秒快速救起倒地队友，并移除血量上限削减效果。"
        },
        "background": "战地医生，早期唯一支援角色，团队生存保障核心。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "S",
            "reason": "跑刀之王。自我治疗减少药品消耗，超长烟雾提供绝对安全的撤离路径。",
            "strategy": "不追求战斗，专注搜刮。被盯上或需要撤离时，铺设烟雾长廊直接跑路。激素枪自疗维持状态。",
            "core_advantage": "自我续航与无敌烟雾撤离。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "B",
            "reason": "治疗和烟雾对蹲守偷袭帮助有限，缺乏先手优势。",
            "strategy": "烟雾可以遮蔽自己埋伏的位置，或用于夺舍后遮挡视线逃跑。激素枪保证埋伏时的状态。",
            "core_advantage": "提供战术烟雾掩护。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "reason": "团队作战的核心辅助，强大的治疗、救援和战场分割能力。",
            "strategy": "在后方提供持续治疗，快速拉起倒地的核心队友。用烟雾阻断敌方火力线或掩护团队转移。",
            "core_advantage": "团队持续作战与战术控场能力。"
          }
        }
      },
      {
        "id": "gu",
        "name": "蛊（佐娅·庞琴科娃）",
        "type": "支援",
        "skills": {
          "main": "致盲毒雾：投掷后生成一片干扰敌人视野的毒雾。",
          "second": "肾上腺素激活：为队友提升枪械控制能力（后坐力降低）。",
          "throwable": "“流荧”集群系统：释放无人机群，降低范围内敌人的听觉、视觉并削弱其生命值上限。",
          "passive": "快速治疗：缩短治疗队友所需的时间。"
        },
        "background": "支援型干员，擅长通过神经化学与无人机技术削弱敌人、支援团队。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "C",
            "reason": "技能更偏向团队辅助和进攻削弱，对个人生存跑路帮助不大。",
            "strategy": "“流荧”可以丢在身后阻碍追兵，毒雾干扰视野方便逃跑。",
            "core_advantage": "有限的逃跑阻碍能力。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "reason": "出色的削弱与控制能力，能极大增加偷袭成功率和降低目标反抗能力。",
            "strategy": "在埋伏点提前布置“流荧”，大幅削弱进入区域的敌人。毒雾致盲后出击。肾上腺素在夺舍后对枪时提供增益。",
            "core_advantage": "强大的区域削弱与控场。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "reason": "顶级团队辅助，集软控、硬削弱、团队增益于一体，能显著提升团队交战胜率。",
            "strategy": "交战前用“流荧”削弱一片区域，配合团队压上。毒雾封锁关键路口或房间。肾上腺素关键时刻提升团队枪法。",
            "core_advantage": "团队进攻的“力量倍增器”。"
          }
        }
      },
      {
        "id": "die",
        "name": "蝶（莉娜·范德梅尔）",
        "type": "支援",
        "skills": {
          "main": "“蝶式”救援无人机：释放无人机群，自动寻找并治疗周围倒地友军，随后需靠近激活完成救援。释放期间获得伤害吸收护盾。",
          "second": "纳米粉尘医疗：投掷锁定队友的无人机，播撒粉尘治疗区域中的友军。",
          "throwable": "遥控烟雾：通过手势引导投掷方向，形成大型烟雾。",
          "passive": "体征检测：延长小队成员的倒地计时；使用纳米医疗时能看到队友健康状态。"
        },
        "background": "前哈夫克研究员，叛逃后成为医疗干员，主打远程救援、持续治疗与战术控场。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "B",
            "reason": "强大的自我和团队治疗能力，遥控烟雾提供出色撤离掩护。",
            "strategy": "用纳米粉尘自我维持状态。遥控烟雾实现超远距离精准封烟，规划安全路线。",
            "core_advantage": "超远程精准烟雾与自我治疗。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "C",
            "reason": "技能组偏向后手救援和治疗，与先手偷袭的玩法不匹配。",
            "strategy": "遥控烟雾可用于遮蔽或干扰，但效果不如蜂医直接。",
            "core_advantage": "战术烟雾应用。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A+",
            "reason": "顶级的战地医护兵，提供远程、安全且高效的救援和治疗，极大提升团队容错率。",
            "strategy": "在安全位置远程救援倒地的突击手，避免救人者暴毙。纳米粉尘维持前线血线。遥控烟雾进行战术分割。",
            "core_advantage": "安全高效的远程支援与救援。"
          }
        }
      },
      {
        "id": "lu_na",
        "name": "露娜（金卢娜）",
        "type": "侦察",
        "skills": {
          "main": "探测箭矢：发射后侦查沿途未被掩体遮挡的敌人，向空中发射可触发特殊扫描。",
          "second": "电击箭矢：命中区域后持续释放电流造成伤害和干扰。",
          "throwable": "破片手雷：双模式杀伤，穿透护甲。",
          "passive": "敌情分析：攻击敌方后短暂标记其位置。"
        },
        "background": "前情报官与职业运动员，侦察干员，擅长信息分析与箭术。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "A",
            "reason": "顶尖的信息获取能力，能提前预知危险，完美规避战斗。",
            "strategy": "向行进路线或资源点发射探测箭，确认安全后再前进。电击箭可封锁身后通道拖延追兵。",
            "core_advantage": "全游戏最强的单人预警能力。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "S",
            "reason": "信息就是一切。探测箭掌握区域动态，电击箭控制出口，被动标记便于追击。",
            "strategy": "在埋伏点用探测箭监视大片区域，掌握猎物动向。电击箭放在敌人必经之路上制造伤害和混乱。",
            "core_advantage": "埋伏区域的绝对信息掌控。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "reason": "优秀的团队信息位，能为队伍提供关键敌方位置，辅助攻坚。",
            "strategy": "开战前用探测箭摸清敌人布防。电击箭压制掩体后的敌人。被动标记帮助团队集火。",
            "core_advantage": "团队进攻的信息先锋。"
          }
        }
      },
      {
        "id": "hai_zhua",
        "name": "骇爪（麦晓雯）",
        "type": "侦察",
        "skills": {
          "main": "信号破译器：扫描敌方电子信号，显示最多6名敌人实时位置及轨迹。",
          "second": "闪光巡飞器：沿轨迹飞行的无人机，触敌后致盲。",
          "throwable": "数据飞刀：投掷电子飞镖，造成伤害或禁用电子设备（如敌方无人机）。",
          "passive": "隐匿消声：提升移动隐蔽性，降低被探测概率。"
        },
        "background": "顶尖电子攻防专家，侦察干员，擅长电子战与信息压制。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "A",
            "reason": "全图透视“级信息能力，被动静步，是“信息鼠”的顶级选择。",
            "strategy": "开局或进入新区城前开大，掌握全图玩家动态，完美规划安全路径。静步移动更不易被发现。",
            "core_advantage": "全图雷达“与增强隐蔽性。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A+",
            "reason": "大招能揭示所有敌人动向，便于选择最肥的猎物或避开多人队伍。",
            "strategy": "在关键时段开启大招，选择落单或携带高级装备的玩家作为目标。闪光巡飞器用于先手致盲。",
            "core_advantage": "猎人“的终极瞄准镜。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "reason": "战略级信息干员，大招能彻底改变战局，让团队掌握绝对主动权。",
            "strategy": "团战前或突击前开启大招，实现战术透明化。闪光巡飞器辅助突破，数据飞刀针对敌方工程设备。",
            "core_advantage": "战争迷雾“驱散者，团队信息核心。"
          }
        }
      },
      {
        "id": "yin_yi",
        "name": "银翼（兰登·哈里森）",
        "type": "侦察",
        "skills": {
          "main": "猎鹰仿生无人机：召唤无人机标记其视野内所有敌人位置。",
          "second": "蜂鸟间谍摄像头：投掷后可黏附在敌人头盔上，获取其团队视野和踪迹。",
          "throwable": "脉冲手雷：投掷后瘫痪范围内敌方电子设备。",
          "passive": "足迹追踪：能探查敌人留下的脚印，获取其装备和位置信息。"
        },
        "background": "S6赛季上线的侦察干员，擅长电子信息设备与情报获取。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "B",
            "reason": "信息能力较强，但不如露娜和骇爪直接高效。被动追踪有一定预警作用。",
            "strategy": "用猎鹰无人机侦察前方区域。通过脚印判断是否有玩家刚经过，决定前进或绕路。",
            "core_advantage": "区域侦察与痕迹追踪。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "reason": "蜂鸟摄像头“是神技，标记一个等于标记一队，实现精准狩猎。",
            "strategy": "将蜂鸟摄像头投掷到可能经过的敌人身上，长期监视其整队动向。猎鹰无人机辅助掌控埋伏点周边情况。",
            "core_advantage": "附骨之疽“式的长期监视能力。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "reason": "提供灵活持续的信息支持，蜂鸟摄像头能打乱敌方部署。",
            "strategy": "开战前投放猎鹰无人机。尝试将蜂鸟贴到敌方关键干员（如奶妈）身上。脉冲手雷克制敌方工程和侦察设备。",
            "core_advantage": "持续的情报骚扰与压制。"
          }
        }
      },
      {
        "id": "mu_yang_ren",
        "name": "牧羊人（泰瑞·缪萨）",
        "type": "工程",
        "skills": {
          "main": "声波陷阱：部署于物体表面，触发后造成穿透伤害并减速敌人。",
          "second": "声波震慑：周期性压制范围内敌人的战斗能力（降低操控、开镜速度等）。",
          "throwable": "增强型破片手雷",
          "passive": "减震防御：降低受到的爆炸伤害。"
        },
        "background": "工程兵干员，定位于防守与反载具作战，擅长部署陷阱与区域控制。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "C",
            "reason": "技能偏向固定区域防御，与移动搜刮的玩法相悖。",
            "strategy": "可在计划撤离的点位或藏身房门口布置声波陷阱作为警报和最后防线。",
            "core_advantage": "有限的固定点位预警。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "reason": "完美的区域封锁大师，能让埋伏点变成死亡禁区。",
            "strategy": "在撤离点或通道布满声波陷阱作为警报和第一道杀伤。开启声波震慑领域，削弱进入区域的敌人后再出手收割。",
            "core_advantage": "请君入瓮“的陷阱大师。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "B",
            "reason": "在进攻中作用有限，更擅长阵地防御和推进中的临时固守。",
            "strategy": "占领关键房间或资源点后，布设陷阱防止被偷屁股。声波震慑在防守狭窄路口时效果显著。",
            "core_advantage": "占领区的巩固与防守。"
          }
        }
      },
      {
        "id": "wu_lu_lu",
        "name": "乌鲁鲁（大卫·费莱尔）",
        "type": "工程",
        "skills": {
          "main": "巡飞弹：呼叫一架可遥控的巡飞弹进行远程精确打击。",
          "second": "速凝掩体：快速部署一个可穿透射击的临时掩体。",
          "throwable": "复合型燃烧弹：投掷后产生大范围持续燃烧区域。",
          "passive": "坚韧：对骨折和装备造成的减速效果有强抗性。"
        },
        "background": "工程干员，兼具防御与进攻能力，适合阵地战和远距离打击。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "D",
            "reason": "技能笨重且偏向主动交战，与避战思路完全不符。",
            "strategy": "几乎无适用场景。",
            "core_advantage": "无"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "B",
            "reason": "巡飞弹可用于超视距打击或补刀，燃烧弹封锁路径，但整体不如其他干员直接。",
            "strategy": "用巡飞弹攻击试图逃跑或躲藏的敌人。在敌人可能的逃跑路线上投掷燃烧弹。",
            "core_advantage": "远程消耗与路径封锁。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "reason": "强力的战术攻坚手，提供远程火力、即时掩体和区域封锁。",
            "strategy": "用巡飞弹精准打击敌方掩体后的高价值目标（如狙击手、支援）。速凝掩体在开阔地提供紧急掩护。燃烧弹压制房间或通道。",
            "core_advantage": "多功能战术攻坚与支援。"
          }
        }
      },
      {
        "id": "shen_lan",
        "name": "深蓝（阿列克谢·彼得罗夫）",
        "type": "工程",
        "skills": {
          "main": "重型防爆套装/全身盾：展开一面大盾吸引火力，盾牌可击倒近身敌人或反弹投掷物。",
          "second": "多功能钩爪枪：发射钩爪，可拉回敌人、队友或装备箱。",
          "throwable": "刀片刺网手雷：生成一片造成伤害和减速的刺网。",
          "passive": "后方防护：盾牌未使用时挂在背后，可抵挡来自后方的子弹。"
        },
        "background": "工程干员，代号“深蓝”，能为队友提供火力保护，是团队推进时的防护屏障。",
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "D",
            "reason": "技能组完全为团队正面推进设计，极度笨重，不适合单人行动。",
            "strategy": "几乎无适用场景。",
            "core_advantage": "无"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "C",
            "reason": "盾牌在蹲守时可能暴露位置，钩爪有奇效但操作难度高。",
            "strategy": "在狭窄通道用盾牌硬堵。尝试用钩爪将路过的敌人拉过来秒杀。",
            "core_advantage": "特定地形的绝对控制（风险高）。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "reason": "顶级团队盾牌，攻坚战和推进战的核心，能强行创造安全空间。",
            "strategy": "举盾为团队开辟道路，吸收火力。钩爪将关键敌人拉出掩体集火，或救援倒地的队友。刺网封锁侧翼。",
            "core_advantage": "人形装甲车，团队推进的绝对核心。"
          }
        }
      }
];

// 地图数据
const localMapsData = [
    {
        "id": "zero_dam",
        "name": "零号大坝",
        "available_modes": ["普通", "机密", "绝密"],
        "map_features": {
          "description": "地图结构对称，资源点集中。核心区域（如行政辖区）资源极其丰富但交战激烈，两侧资源点（军营、水泥厂、变电站、游客中心）相对温和。撤离机制多样。",
          "extraction_points": {
            "total": 8,
            "details": [
              "常规撤离点：固定开放。",
              "条件撤离点：需满足特定条件（如限重、丢包）。",
              "概率撤离点：随机开放。",
              "付费撤离点：支付本局获得的哈夫币。",
              "电梯撤离点：需拉闸开启。"
            ]
          },
          "preparation_restrictions": "机密/绝密模式有战备值要求。"
        },
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "A",
            "strategy": "降落在两侧资源点，快速搜刮服务器、电脑等次级容器，利用蜂医（风衣）干员的烟雾弹规避战斗，选择常规或条件撤离点撤离。",
            "note": "绝对避免进入中心的行政辖区。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "S",
            "strategy": "熟悉撤离点位置和时间，利用复杂地形（如撤离点周围）埋伏。可用高级子弹武器（玻璃大炮）埋伏在机密/绝密模式资源点外，偷袭高装备玩家。",
            "note": "电梯撤离点是经典的埋伏位置，需提前布局。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "strategy": "直接降落在行政辖区等核心区，凭借高等级装备和满改武器清剿区域，控制主要保险箱。适合团队作战，追求最高物资收益。",
            "note": "投资最高，风险最高，收益上限也最高。"
          }
        }
      },
      {
        "id": "aerospace_base",
        "name": "航天基地",
        "available_modes": ["机密", "绝密"],
        "map_features": {
          "description": "地形开阔，建筑分散，视野良好。存在“堵桥流”等经典战术点位。资源点分散于各大厂房和设施内。",
          "extraction_points": {
            "total": "约5-6个（参考）",
            "details": [
              "包含常规、条件及概率撤离点。",
              "桥梁等关键通道是撤离必经之路，易发生伏击。"
            ]
          },
          "preparation_restrictions": "较高战备值要求。"
        },
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "B",
            "strategy": "利用开阔地形远距离观察，避开主干道和桥梁，搜寻边缘建筑的物资。撤离时格外小心通道伏击。",
            "note": "移动路径暴露风险大，对路线规划要求高。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "strategy": "“航天堵桥流”代表图。在桥梁、通道隘口等关键位置架狙或埋伏，拦截携带物资撤离的玩家。",
            "note": "极其依赖对撤离点刷新机制和时间的掌握。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "A",
            "strategy": "凭借高倍镜武器和高级甲，在开阔地形成火力优势，正面压制并清剿资源点内的敌人。",
            "note": "需注意来自多个方向的远距离狙击。"
          }
        }
      },
      {
        "id": "tidal_prison",
        "name": "潮汐监狱",
        "available_modes": ["绝密"],
        "map_features": {
          "description": "室内复杂结构为主，多层空间，通道狭窄，近距离交战频繁。资源集中但环境压抑。",
          "extraction_points": {
            "total": "有限（通常3-4个）",
            "details": [
              "撤离点较少且可能位于危险区域。",
              "部分为条件撤离点，在绝密模式下争夺激烈。"
            ]
          },
          "preparation_restrictions": "高战备值要求，仅限高级玩家。"
        },
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "D",
            "strategy": "不推荐。地图狭小，遭遇战不可避免，撤离困难，生存率低。",
            "note": "该地图设计不适合纯避战玩法。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "B",
            "strategy": "可在牢房转角、楼梯口等视野盲区阴人，利用投掷物创造机会。但因空间封闭，自身也容易被锁死。",
            "note": "适合熟悉室内CQB的玩家，风险与机遇并存。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "S",
            "strategy": "主场地图。配备高射速冲锋枪（如AS Val）、霰弹枪及手雷，在室内近战中拥有绝对统治力，清图效率高。",
            "note": "必须擅长室内近距离战斗，装备损耗也快。"
          }
        }
      },
      {
        "id": "longbow_valley",
        "name": "长弓溪谷",
        "available_modes": ["普通", "机密"],
        "map_features": {
          "description": "山地、森林地形，植被覆盖多，高低差显著。资源点较为分散，适合远程交战与隐蔽移动。",
          "extraction_points": {
            "total": "约6-7个（参考）",
            "details": [
              "分布在地图边缘山谷或林间。",
              "部分撤离点周围地形复杂，易守难攻。"
            ]
          },
          "preparation_restrictions": "机密模式有战备要求。"
        },
        "suitable_for_players": {
          "鼠鼠 (避战/捡漏)": {
            "suitability": "A",
            "strategy": "利用植被和地形隐蔽移动，搜索散布的木屋、哨所等资源点。远离制高点和主干道。",
            "note": "地形复杂，需要良好的方向感。"
          },
          "堵撤离点/夺舍流 (蹲守/掠夺)": {
            "suitability": "A",
            "strategy": "在制高点（如“坝顶狙”）或撤离路径旁的树林中架设狙击枪，远程打击毫无戒备的玩家。",
            "note": "是狙击手和“老六”的乐园。"
          },
          "猛攻流 (正面作战)": {
            "suitability": "B",
            "strategy": "需要配备中远距离精确步枪，控制山头或重要路口。但在复杂地形中快速清剿敌人的效率不如室内图。",
            "note": "更侧重于区域控制和远程压制。"
          }
        }
      },
      {
        "id": "bukshi",
        "name": "巴克什",
        "available_modes": ["机密", "绝密"],
        "map_features": {
          "description": "城镇巷战与部分开阔地结合。建筑密集，巷子错综复杂，同时也有广场等交火区。",
          "extraction_points": {
            "total": "约5-6个（参考）",
            "details": [
              "撤离点可能位于街道尽头或建筑内部。",
              "需警惕从窗口和巷口发起的袭击。"
            ]
          },
          "preparation_restrictions": "中高战备值要求。"
        }       
      }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log("三角洲配装助手初始化...");
    
    // 初始化事件监听器
    initEventListeners();
    
    // 初始化地图模式
    updateMapModes();
    
    // 加载干员信息
    loadOperators();
    
    // 预加载数据
    preloadData();
});

// 初始化所有事件监听器
function initEventListeners() {
    // 预算滑块
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    
    budgetSlider.addEventListener('input', function() {
        currentBudget = parseInt(this.value);
        budgetValue.textContent = formatPrice(currentBudget);
    });
    
    // 玩家类型按钮 - 增强反馈
    document.querySelectorAll('.player-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.player-type-btn').forEach(b => {
                b.classList.remove('active');
                b.querySelector('i').classList.remove('fa-bounce');
            });
            
            // 给当前按钮添加active类
            this.classList.add('active');
            currentPlayerType = this.dataset.type;
            
            // 添加动画效果
            const icon = this.querySelector('i');
            icon.classList.add('fa-bounce');
            setTimeout(() => icon.classList.remove('fa-bounce'), 1000);
            
            // 显示选择反馈
            showFeedback(`已选择: ${currentPlayerType}玩法`);
        });
    });
    
    // 地图选择
    document.getElementById('mapSelect').addEventListener('change', function() {
        currentMap = this.value;
        updateMapModes();
        showFeedback(`已选择地图: ${getMapName(currentMap)}`);
    });
    
    // 地图模式按钮
    document.querySelectorAll('.map-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // 移除所有按钮的active类
            document.querySelectorAll('.map-mode-btn').forEach(b => b.classList.remove('active'));
            
            // 给当前按钮添加active类
            this.classList.add('active');
            currentMode = this.dataset.mode;
            
            // 更新预算限制
            updateBudgetLimits();
            
            // 显示选择反馈
            showFeedback(`已选择模式: ${currentMode}`);
        });
    });
    
    // 生成按钮
    document.getElementById('generateBtn').addEventListener('click', generateLoadout);
    
    // 问答助手
    document.getElementById('askBtn').addEventListener('click', handleQuestion);
    document.getElementById('questionInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleQuestion();
    });
    
    // 快速问题按钮
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            document.getElementById('questionInput').value = question;
            handleQuestion();
        });
    });
    
    // 干员筛选按钮
    document.querySelectorAll('.operator-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.operator-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterOperators(this.dataset.type);
        });
    });
    
    // 导航链接
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 滚动到对应部分
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 显示反馈消息
function showFeedback(message) {
    // 创建或获取反馈元素
    let feedback = document.getElementById('feedbackMessage');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'feedbackMessage';
        feedback.className = 'fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        document.body.appendChild(feedback);
    }
    
    feedback.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 3秒后自动消失
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s';
        setTimeout(() => feedback.remove(), 500);
    }, 3000);
}

// 更新地图模式选择
function updateMapModes() {
    const modes = mapModeRequirements[currentMap];
    const modeButtons = {
        "常规": document.getElementById('modeNormal'),
        "机密": document.getElementById('modeConfidential'),
        "绝密": document.getElementById('modeTopSecret')
    };
    
    // 重置所有按钮
    Object.values(modeButtons).forEach(btn => {
        btn.classList.remove('active');
        btn.disabled = true;
    });
    
    // 启用可用的模式
    if (modes) {
        Object.keys(modes).forEach(mode => {
            if (modeButtons[mode]) {
                modeButtons[mode].disabled = false;
            }
        });
        
        // 默认选择第一个可用模式
        const availableModes = Object.keys(modes);
        if (availableModes.length > 0) {
            const defaultMode = availableModes[0];
            modeButtons[defaultMode].classList.add('active');
            currentMode = defaultMode;
            
            // 更新模式信息
            updateModeInfo();
            
            // 更新预算限制
            updateBudgetLimits();
        }
    }
}

// 更新模式信息
function updateModeInfo() {
    const modeInfo = document.getElementById('modeInfo');
    const mapName = getMapName(currentMap);
    
    let infoText = "";
    switch(currentMode) {
        case "常规":
            infoText = `${mapName} - 常规模式：无成本限制，适合新手`;
            break;
        case "机密":
            if (currentMap === "zero_dam" || currentMap === "longbow_valley") {
                infoText = `${mapName} - 机密模式：最低成本112,500`;
            } else {
                infoText = `${mapName} - 机密模式：最低成本187,500`;
            }
            break;
        case "绝密":
            if (currentMap === "bukshi") {
                infoText = `${mapName} - 绝密模式：最低成本550,000`;
            } else if (currentMap === "aerospace_base") {
                infoText = `${mapName} - 绝密模式：最低成本600,000`;
            } else if (currentMap === "tidal_prison") {
                infoText = `${mapName} - 绝密模式：最低成本780,000`;
            }
            break;
    }
    
    modeInfo.textContent = infoText;
}

// 更新预算限制
function updateBudgetLimits() {
    const requirements = mapModeRequirements[currentMap][currentMode];
    const slider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const minBudget = document.getElementById('minBudget');
    const maxBudget = document.getElementById('maxBudget');
    const budgetRequirement = document.getElementById('budgetRequirement');
    
    if (requirements) {
        // 更新滑块范围
        slider.min = requirements.min;
        slider.max = requirements.max;
        
        // 如果当前预算低于最小值，调整到最小值
        if (currentBudget < requirements.min) {
            currentBudget = requirements.min;
        }
        
        // 如果当前预算高于最大值，调整到最大值
        if (currentBudget > requirements.max) {
            currentBudget = requirements.max;
        }
        
        // 更新滑块值
        slider.value = currentBudget;
        
        // 更新显示
        budgetValue.textContent = formatPrice(currentBudget);
        minBudget.textContent = formatPrice(requirements.min);
        maxBudget.textContent = formatPrice(requirements.max);
        
        // 显示要求
        if (requirements.min > 0) {
            budgetRequirement.innerHTML = `<span class="text-yellow-300">地图要求：最低${formatPrice(requirements.min)}</span>`;
        } else {
            budgetRequirement.textContent = "地图要求：无限制";
        }
    }
}

// 预加载游戏数据
async function preloadData() {
    try {
        console.log("正在加载游戏数据...");
        
        // 显示加载状态
        const loadoutResult = document.getElementById('loadoutResult');
        loadoutResult.innerHTML = `
            <div class="text-center py-10">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-400">正在加载游戏数据...</p>
            </div>
        `;
        
        // 使用本地数据
        gameData = {
            weapons: localWeaponsData || [],
            gear: {
                helmets: localGearData?.helmets || [],
                armors: localGearData?.armors || [],
                chest_rigs: localGearData?.chest_rigs || [],
                backpacks: localGearData?.backpacks || []
            },
            operators: localOperatorsData || [],
            maps: localMapsData || []
        };
        
        console.log("游戏数据加载完成！", gameData);
        
        // 更新UI显示数据已加载
        loadoutResult.innerHTML = `
            <div class="text-center py-6">
                <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">数据加载完成</h3>
                <p class="text-gray-400 mb-6">已加载 ${gameData.weapons.length} 把武器, ${gameData.operators.length} 名干员</p>
                <p class="text-gray-500">请设置参数后点击"生成配装方案"</p>
            </div>
        `;
        
        // 重新加载干员信息
        loadOperators();
        
    } catch (error) {
        console.error("数据加载失败:", error);
        
        // 显示错误信息
        const loadoutResult = document.getElementById('loadoutResult');
        loadoutResult.innerHTML = `
            <div class="text-center py-10">
                <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">数据加载失败</h3>
                <p class="text-gray-400 mb-4">${error.message || "未知错误"}</p>
                <button onclick="preloadData()" class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                    重新加载
                </button>
            </div>
        `;
    }
}

// 加载干员信息
function loadOperators() {
    if (!localOperatorsData || localOperatorsData.length === 0) {
        console.log("干员数据为空");
        return;
    }
    
    const operatorList = document.getElementById('operatorList');
    if (!operatorList) {
        console.log("找不到干员列表容器");
        return;
    }
    
    let html = '';
    
    localOperatorsData.forEach((op, index) => {
        // 获取对鼠鼠玩法的适配度作为示例
        const suitability = op.suitable_for_players && op.suitable_for_players["鼠鼠"] ? 
                          op.suitable_for_players["鼠鼠"].suitability : "未知";
        
        // 获取技能描述的前50个字符
        const skillDesc = op.skills?.main ? 
            (op.skills.main.length > 50 ? op.skills.main.substring(0, 50) + "..." : op.skills.main) : 
            "暂无技能描述";
        
        html += `
            <div class="operator-card bg-gray-800 rounded-xl p-5" data-type="${op.type}">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-lg">${op.name}</h3>
                        <p class="text-gray-400">${op.type}干员</p>
                    </div>
                    <span class="px-3 py-1 ${getSuitabilityClass(suitability)} rounded-full text-sm">
                        ${suitability}
                    </span>
                </div>
                
                <p class="text-gray-300 mb-4 text-sm">${op.background || '暂无简介'}</p>
                
                <div class="mb-4">
                    <p class="font-bold mb-2 text-sm">主要技能</p>
                    <p class="text-sm text-gray-400">${skillDesc}</p>
                </div>
                
                <div class="flex justify-between items-center text-sm">
                    <div class="text-gray-500">
                        <i class="fas fa-tag mr-2"></i>
                        <span>${op.type}</span>
                    </div>
                    <button onclick="showOperatorDetail(${index})" class="text-blue-400 hover:text-blue-300 text-sm">
                        查看详情 <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    operatorList.innerHTML = html;
    
    // 如果没有干员数据，显示提示
    if (localOperatorsData.length === 0) {
        operatorList.innerHTML = `
            <div class="col-span-full text-center py-10">
                <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-users text-2xl text-gray-500"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">暂无干员数据</h3>
                <p class="text-gray-400">干员数据加载失败或为空</p>
            </div>
        `;
    }
}

// 显示干员详情
function showOperatorDetail(index) {
    const op = localOperatorsData[index];
    if (!op) return;
    
    const modalHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-2xl font-bold">${op.name}</h2>
                        <p class="text-gray-400">${op.type}干员</p>
                    </div>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">背景介绍</h3>
                    <p class="text-gray-300">${op.background || '暂无背景信息'}</p>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">技能信息</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${op.skills ? Object.entries(op.skills).map(([key, value]) => `
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="font-bold text-blue-300 mb-2">${getSkillName(key)}</p>
                                <p class="text-sm">${value}</p>
                            </div>
                        `).join('') : '<p class="text-gray-400">暂无技能信息</p>'}
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-3">玩法适配度</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${op.suitable_for_players ? Object.entries(op.suitable_for_players).map(([type, data]) => `
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <p class="font-bold">${type}</p>
                                    <span class="px-3 py-1 ${getSuitabilityClass(data.suitability)} rounded-full text-sm">
                                        ${data.suitability}级
                                    </span>
                                </div>
                                <p class="text-sm text-gray-300">${data.reason}</p>
                            </div>
                        `).join('') : '<p class="text-gray-400">暂无适配度信息</p>'}
                    </div>
                </div>
                
                <div class="text-center mt-6">
                    <button onclick="closeModal()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                        关闭详情
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.id = 'operatorModal';
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('operatorModal');
    if (modal) {
        modal.remove();
    }
}

// 获取技能名称
function getSkillName(key) {
    const skillNames = {
        "main": "主要技能",
        "second": "次要技能",
        "throwable": "投掷物",
        "passive": "被动技能"
    };
    return skillNames[key] || key;
}

// 筛选干员
function filterOperators(type) {
    const operatorCards = document.querySelectorAll('.operator-card');
    
    operatorCards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 生成配装方案（简化版，只保留核心逻辑）
// 在generateLoadout函数中，添加预算优化
// 在generateLoadout函数中，添加预算验证步骤
async function generateLoadout() {
    console.log(`生成配装: ${currentPlayerType}, 预算: ${currentBudget}, 地图: ${currentMap}, 模式: ${currentMode}`);
    
    // 检查预算是否满足地图要求
    const requirements = mapModeRequirements[currentMap][currentMode];
    
    if (currentBudget < requirements.min) {
        alert(`预算不足！${getMapName(currentMap)}的${currentMode}模式要求最低${formatPrice(requirements.min)}`);
        return;
    }
    
    // 显示加载状态
    const loadoutResult = document.getElementById('loadoutResult');
    loadoutResult.innerHTML = `
        <div class="text-center py-10">
            <div class="loading-spinner mb-4"></div>
            <p class="text-gray-400">正在生成${currentPlayerType}配装方案...</p>
            <p class="text-sm text-gray-500 mt-2">预算: ${formatPrice(currentBudget)}</p>
        </div>
    `;
    
    // 模拟加载时间
    setTimeout(() => {
        try {
            // 1. 分配预算
            const budgetAllocation = allocateBudget(currentPlayerType, currentBudget);
            console.log('预算分配:', budgetAllocation);
            
            // 2. 选择武器（带预算预留）
            const selectedWeapon = selectWeapon(localWeaponsData, currentPlayerType, budgetAllocation.weapon, currentMap);
            console.log('选择的武器:', selectedWeapon, '价格:', selectedWeapon.price);
            
            // 3. 重新计算剩余预算用于装备
            const weaponCost = selectedWeapon.price;
            const remainingBudgetForGear = currentBudget - weaponCost - budgetAllocation.medical - budgetAllocation.ammo;
            
            // 4. 调整装备预算分配，确保不超总预算
            const adjustedGearBudget = {
                helmet: Math.min(budgetAllocation.helmet, remainingBudgetForGear * 0.2),
                armor: Math.min(budgetAllocation.armor, remainingBudgetForGear * 0.5),
                chest_rig: Math.min(budgetAllocation.chest_rig, remainingBudgetForGear * 0.1),
                backpack: Math.min(budgetAllocation.backpack, remainingBudgetForGear * 0.2)
            };
            
            // 5. 选择防具
            const selectedGear = selectGear(localGearData, currentPlayerType, adjustedGearBudget);
            console.log('选择的防具:', selectedGear);
            
            // 6. 计算当前总成本
            const gearCost = Object.values(selectedGear).reduce((sum, item) => sum + (item ? item.price : 0), 0);
            const currentTotalCost = weaponCost + gearCost + budgetAllocation.medical + budgetAllocation.ammo;
            
            // 7. 如果猛攻流且预算利用率低，进行安全升级
            let finalGear = selectedGear;
            if (currentPlayerType === "猛攻流" && currentTotalCost < currentBudget * 0.8) {
                finalGear = upgradeGearForMaxBudget(
                    selectedGear, 
                    localGearData, 
                    budgetAllocation, 
                    currentBudget,
                    weaponCost
                );
            }
            
            // 8. 选择干员
            const selectedOperators = selectOperators(localOperatorsData, currentPlayerType);
            
            // 9. 最终预算验证
            const finalGearCost = Object.values(finalGear).reduce((sum, item) => sum + (item ? item.price : 0), 0);
            const finalTotalCost = weaponCost + finalGearCost + budgetAllocation.medical + budgetAllocation.ammo;
            
            console.log('最终总成本:', finalTotalCost, '预算:', currentBudget);
            
            if (finalTotalCost > currentBudget) {
                console.warn('⚠️ 总成本超出预算，进行调整...');
                // 如果有超出，按比例削减药品和弹药
                const overBudget = finalTotalCost - currentBudget;
                const adjustedMedicalAmmo = Math.max(0, budgetAllocation.medical + budgetAllocation.ammo - overBudget);
                budgetAllocation.medical = Math.floor(adjustedMedicalAmmo * 0.5);
                budgetAllocation.ammo = Math.floor(adjustedMedicalAmmo * 0.5);
            }
            
            // 10. 显示结果
            displayLoadout(selectedWeapon, finalGear, selectedOperators, budgetAllocation);
            
        } catch (error) {
            console.error("生成配装时出错:", error);
            // ... 错误处理代码
        }
    }, 800);
}
// 添加一个预算监控和调整函数
function monitorAndAdjustBudget(weaponCost, gear, budgetAllocation, totalBudget) {
    const gearCost = Object.values(gear).reduce((sum, item) => sum + (item ? item.price : 0), 0);
    const currentCost = weaponCost + gearCost + budgetAllocation.medical + budgetAllocation.ammo;
    
    if (currentCost <= totalBudget) {
        return { gear, budgetAllocation };
    }
    
    // 如果超出预算，按优先级削减
    const overBudget = currentCost - totalBudget;
    console.warn(`超出预算${formatPrice(overBudget)}，正在调整...`);
    
    // 优先削减药品和弹药
    let remainingOverBudget = overBudget;
    const medicalAmmoReduction = Math.min(budgetAllocation.medical + budgetAllocation.ammo, remainingOverBudget);
    budgetAllocation.medical = Math.max(10000, budgetAllocation.medical - medicalAmmoReduction * 0.5);
    budgetAllocation.ammo = Math.max(10000, budgetAllocation.ammo - medicalAmmoReduction * 0.5);
    remainingOverBudget -= medicalAmmoReduction;
    
    // 如果还不够，尝试降低装备等级
    if (remainingOverBudget > 0) {
        const sortedGear = Object.entries(gear)
            .filter(([key, item]) => item && item.price > 0)
            .sort((a, b) => b[1].price - a[1].price); // 从最贵的开始
        
        for (const [key, item] of sortedGear) {
            if (remainingOverBudget <= 0) break;
            
            // 找更便宜的替代品
            const categoryData = localGearData[`${key}s`];
            if (!categoryData) continue;
            
            const cheaperItems = categoryData
                .filter(g => g.price < item.price && g.price >= item.price - remainingOverBudget)
                .sort((a, b) => b.price - a.price); // 选能省最多钱的
            
            if (cheaperItems.length > 0) {
                gear[key] = cheaperItems[0];
                const saved = item.price - cheaperItems[0].price;
                remainingOverBudget -= saved;
                console.log(`削减${key}: 节省${formatPrice(saved)}`);
            }
        }
    }
    
    return { gear, budgetAllocation };
}
// 新增：为猛攻流升级装备以最大化预算使用
function upgradeGearForMaxBudget(currentGear, gearData, budgetAllocation, totalBudget, weaponCost) {
    const result = { ...currentGear };
    
    // 计算当前总成本
    const currentGearCost = Object.values(result).reduce((sum, item) => sum + (item ? item.price : 0), 0);
    const currentTotalCost = weaponCost + currentGearCost;
    const medicalAmmoCost = budgetAllocation.medical + budgetAllocation.ammo;
    const maxAllowableCost = totalBudget - medicalAmmoCost; // 最大允许的武器+装备成本
    
    // 如果当前总成本已经接近或超过最大允许成本，不升级
    if (currentTotalCost >= maxAllowableCost * 0.95) {
        console.log(`当前成本${currentTotalCost}已达上限${maxAllowableCost}，不进行升级`);
        return result;
    }
    
    const remainingBudget = maxAllowableCost - currentTotalCost;
    
    // 如果剩余预算很少，不升级
    if (remainingBudget < 50000) {
        return result;
    }
    
    // 按优先级升级装备（护甲 > 头盔 > 背包 > 胸挂）
    const upgradeOrder = [
        { key: 'armor', ratio: 0.4, name: '护甲' },
        { key: 'helmet', ratio: 0.3, name: '头盔' },
        { key: 'backpack', ratio: 0.2, name: '背包' },
        { key: 'chest_rig', ratio: 0.1, name: '胸挂' }
    ];
    
    upgradeOrder.forEach(({ key, ratio, name }) => {
        if (!result[key] || !gearData[`${key}s`]) return;
        
        const currentItem = result[key];
        const upgradeBudget = remainingBudget * ratio;
        const categoryData = gearData[`${key}s`];
        
        // 找出更好的装备（不超过当前成本+升级预算，且比当前好）
        const betterItems = categoryData.filter(item => 
            item.price > currentItem.price && 
            item.price <= currentItem.price + upgradeBudget
        );
        
        if (betterItems.length > 0) {
            // 根据升级类型选择策略
            let selectedItem;
            if (key === 'armor' || key === 'helmet') {
                // 防具：优先高级别，再考虑价格
                selectedItem = betterItems.sort((a, b) => {
                    const levelA = parseInt(a.level) || 0;
                    const levelB = parseInt(b.level) || 0;
                    if (levelB !== levelA) return levelB - levelA;
                    return (b.price || 0) - (a.price || 0);
                })[0];
            } else {
                // 其他：选性价比最高的（容量/价格）
                selectedItem = betterItems.sort((a, b) => {
                    const valueA = (a.slots || 1) / a.price;
                    const valueB = (b.slots || 1) / b.price;
                    return valueB - valueA;
                })[0];
            }
            
            // 检查升级后是否超出总预算
            const newGearCost = Object.values(result).reduce((sum, item) => {
                const cost = item === currentItem ? selectedItem.price : (item ? item.price : 0);
                return sum + cost;
            }, 0);
            
            const newTotalCost = weaponCost + newGearCost;
            
            if (newTotalCost <= maxAllowableCost) {
                console.log(`升级${name}: ${currentItem.name} -> ${selectedItem.name}`);
                result[key] = selectedItem;
            }
        }
    });
    
    return result;
}


// 分配预算
function allocateBudget(playerType, totalBudget) {
    // 预算分配比例 - 猛攻流要更激进
    const allocations = {
        "鼠鼠": {
            weapon: 0.10,    // 10% - 最便宜的武器
            helmet: 0.02,    // 2% - 最便宜的头盔
            armor: 0.05,     // 5% - 最便宜的护甲
            chest_rig: 0.10, // 10% - 容量最大的胸挂
            backpack: 0.30,  // 30% - 容量最大的背包
            medical: 0.08,   // 8% - 基础药品
            ammo: 0.05,      // 5% - 基础弹药
            reserve: 0.30    // 30% - 备用
        },
        "堵点夺舍": {
            weapon: 0.35,    // 35% - 性价比武器
            helmet: 0.15,    // 15% - 4级听力头
            armor: 0.20,     // 20% - 4级甲
            chest_rig: 0.03, // 3% - 基础胸挂
            backpack: 0.05,  // 5% - 基础背包
            medical: 0.07,   // 7% - 中级药品
            ammo: 0.10,      // 10% - 中级弹药
            reserve: 0.05    // 5% - 备用
        },
        "猛攻流": {
            weapon: 0.50,    // 50% - 最贵的S级武器
            helmet: 0.20,    // 20% - 最高级头盔
            armor: 0.25,     // 25% - 最高级护甲
            chest_rig: 0.02, // 2% - 基础胸挂（不重要）
            backpack: 0.01,  // 1% - 基础背包（不重要）
            medical: 0.01,   // 1% - 少量高级药品
            ammo: 0.01,      // 1% - 少量高级弹药
            reserve: 0.00    // 0% - 不留备用，全花光！
        }
    };
    
    const allocation = allocations[playerType] || allocations["鼠鼠"];
    const result = {};
    
    for (const [category, ratio] of Object.entries(allocation)) {
        result[category] = Math.floor(totalBudget * ratio);
    }
    
    return result;
}
// 在计算总成本前添加
function estimateConsumablesCost(playerType, budgetAllocation) {
    let ammoCost = 0;
    let medicalCost = 0;
    
    // 弹药成本估算
    if (playerType === "鼠鼠") {
        ammoCost = Math.min(budgetAllocation.ammo, 50000); // 最多5万
    } else if (playerType === "堵点夺舍") {
        ammoCost = Math.min(budgetAllocation.ammo, 150000); // 最多15万
    } else {
        ammoCost = Math.min(budgetAllocation.ammo, 300000); // 最多30万
    }
    
    // 药品成本估算
    if (playerType === "鼠鼠") {
        medicalCost = Math.min(budgetAllocation.medical, 30000); // 最多3万
    } else if (playerType === "堵点夺舍") {
        medicalCost = Math.min(budgetAllocation.medical, 80000); // 最多8万
    } else {
        medicalCost = Math.min(budgetAllocation.medical, 150000); // 最多15万
    }
    
    return { ammoCost, medicalCost };
}

// 然后在displayLoadout中使用
const consumableEstimate = estimateConsumablesCost(currentPlayerType, budgetAllocation);
const consumableCost = consumableEstimate.ammoCost + consumableEstimate.medicalCost;
// 选择武器
// 修改selectWeapon函数，添加对后续装备的预算预留
function selectWeapon(weapons, playerType, weaponBudget, mapId) {
    if (!weapons || weapons.length === 0) {
        throw new Error("没有可用的武器数据");
    }
    
    // 根据玩家类型预留后续装备的最低预算
    let minGearBudget = 0;
    switch(playerType) {
        case "鼠鼠":
            minGearBudget = 50000; // 头盔+护甲+背包最低预算
            break;
        case "堵点夺舍":
            minGearBudget = 150000;
            break;
        case "猛攻流":
            minGearBudget = 300000; // 高级装备需要更多预算
            break;
    }
    
    // 实际可用武器预算 = 武器预算 - 预留装备预算
    const availableWeaponBudget = Math.max(10000, weaponBudget - minGearBudget);
    
    // 筛选在可用预算内的武器
    let suitableWeapons = weapons.filter(weapon => weapon.price <= availableWeaponBudget);
    
    if (suitableWeapons.length === 0) {
        // 如果预算不够，选择最便宜的武器
        suitableWeapons = [...weapons].sort((a, b) => a.price - b.price).slice(0, 3);
    }
    
    // 按照玩家类型的不同策略选择
    if (playerType === "猛攻流") {
        // 猛攻流：在预算内选择强度最高的
        suitableWeapons.sort((a, b) => {
            const strengthOrder = { "S": 5, "A+-S": 4.5, "A+": 4, "A": 3, "B": 2, "C": 1 };
            const strengthA = strengthOrder[a.strength] || 0;
            const strengthB = strengthOrder[b.strength] || 0;
            
            if (strengthB !== strengthA) return strengthB - strengthA;
            // 强度相同，选更接近预算的
            const diffA = Math.abs(a.price - availableWeaponBudget);
            const diffB = Math.abs(b.price - availableWeaponBudget);
            return diffA - diffB;
        });
    } 
    else if (playerType === "堵点夺舍") {
        // 堵点夺舍：选择性价比高的爆发武器
        suitableWeapons.forEach(weapon => {
            weapon.score = 0;
            const strengthOrder = { "S": 10, "A+-S": 8, "A+": 6, "A": 4, "B": 2, "C": 1 };
            weapon.score += strengthOrder[weapon.strength] || 0;
            
            // 性价比评分 = 强度 / 价格 * 10000
            weapon.score += Math.round((strengthOrder[weapon.strength] || 1) / weapon.price * 10000);
            
            // 标签加分
            if (weapon.tags) {
                if (weapon.tags.some(tag => tag.includes("高爆发"))) weapon.score += 5;
                if (weapon.tags.some(tag => tag.includes("近距离"))) weapon.score += 3;
            }
        });
        
        suitableWeapons.sort((a, b) => b.score - a.score);
    }
    else {
        // 鼠鼠：选最便宜的
        suitableWeapons.sort((a, b) => a.price - b.price);
    }
    
    return suitableWeapons[0] || weapons[0];
}
// 计算武器评分
function calculateWeaponScore(weapon, playerType, mapId) {
    let score = 0;
    const price = weapon.price || 0;
    
    // 基础评分：越便宜分越高
    if (price < 100000) score += 5;
    else if (price < 300000) score += 3;
    else if (price < 500000) score += 1;
    
    // 根据玩家类型加分
    switch(playerType) {
        case "鼠鼠":
            if (price < 50000) score += 10;
            if (weapon.tags && weapon.tags.some(tag => 
                ["性价比", "低成本", "新手友好"].some(keyword => tag.includes(keyword))
            )) score += 5;
            break;
            
        case "堵点夺舍":
            if (weapon.strength && weapon.strength.includes("S")) score += 8;
            if (weapon.strength && weapon.strength.includes("A+")) score += 5;
            if (weapon.type === "冲锋枪" || weapon.type === "霰弹枪") score += 3;
            if (weapon.tags && weapon.tags.some(tag => 
                ["高爆发", "近距离", "高输出"].some(keyword => tag.includes(keyword))
            )) score += 5;
            break;
            
        case "猛攻流":
            if (weapon.strength && weapon.strength.includes("S")) score += 10;
            if (weapon.strength && weapon.strength.includes("A+")) score += 7;
            if (weapon.type === "精确射手步枪" || 
                weapon.type === "突击步枪" || 
                weapon.type === "战斗步枪") score += 3;
            if (weapon.tags && weapon.tags.some(tag => 
                ["高输出", "全距离", "稳定", "大口径"].some(keyword => tag.includes(keyword))
            )) score += 5;
            break;
    }
    
    // 根据地图调整
    if (mapId === "tidal_prison") {
        if (weapon.type === "冲锋枪" || weapon.type === "霰弹枪") score += 5;
    } else if (mapId === "aerospace_base") {
        if (weapon.type === "狙击步枪" || weapon.type === "精确射手步枪") score += 3;
    } else if (mapId === "longbow_valley") {
        if (weapon.type === "狙击步枪" || weapon.type === "精确射手步枪") score += 4;
    }
    
    return score;
}

// 选择防具
function selectGear(gear, playerType, budgetAllocation) {
    const result = {};
    
    // 猛攻流专用选择器 - 选最贵最好的
    if (playerType === "猛攻流") {
        // 头盔：选最高级的
        if (gear.helmets && gear.helmets.length > 0) {
            // 按等级降序，价格降序
            let helmets = [...gear.helmets].sort((a, b) => {
                const levelA = parseInt(a.level) || 0;
                const levelB = parseInt(b.level) || 0;
                if (levelB !== levelA) return levelB - levelA;
                return (b.price || 0) - (a.price || 0);
            });
            
            // 选第一个不超过预算的，如果没有就选最贵的
            let selectedHelmet = helmets.find(h => h.price <= budgetAllocation.helmet);
            if (!selectedHelmet && helmets.length > 0) {
                // 如果预算不够买最贵的，也要选能买到的最好的
                selectedHelmet = helmets.reduce((best, current) => {
                    if (current.price <= budgetAllocation.helmet && current.price > (best?.price || 0)) {
                        return current;
                    }
                    return best;
                }, null) || helmets[0];
            }
            result.helmet = selectedHelmet;
        }
        
        // 护甲：选最高级的
        if (gear.armors && gear.armors.length > 0) {
            let armors = [...gear.armors].sort((a, b) => {
                const levelA = parseInt(a.level) || 0;
                const levelB = parseInt(b.level) || 0;
                if (levelB !== levelA) return levelB - levelA;
                return (b.price || 0) - (a.price || 0);
            });
            
            let selectedArmor = armors.find(a => a.price <= budgetAllocation.armor);
            if (!selectedArmor && armors.length > 0) {
                selectedArmor = armors.reduce((best, current) => {
                    if (current.price <= budgetAllocation.armor && current.price > (best?.price || 0)) {
                        return current;
                    }
                    return best;
                }, null) || armors[0];
            }
            result.armor = selectedArmor;
        }
        
        // 胸挂：选最贵最好的
        if (gear.chest_rigs && gear.chest_rigs.length > 0) {
            let chestRigs = [...gear.chest_rigs].sort((a, b) => (b.price || 0) - (a.price || 0));
            
            let selectedChestRig = chestRigs.find(c => c.price <= budgetAllocation.chest_rig);
            if (!selectedChestRig && chestRigs.length > 0) {
                selectedChestRig = chestRigs.reduce((best, current) => {
                    if (current.price <= budgetAllocation.chest_rig && current.price > (best?.price || 0)) {
                        return current;
                    }
                    return best;
                }, null) || chestRigs[0];
            }
            result.chest_rig = selectedChestRig;
        }
        
        // 背包：选最贵最好的
        if (gear.backpacks && gear.backpacks.length > 0) {
            let backpacks = [...gear.backpacks].sort((a, b) => (b.price || 0) - (a.price || 0));
            
            let selectedBackpack = backpacks.find(b => b.price <= budgetAllocation.backpack);
            if (!selectedBackpack && backpacks.length > 0) {
                selectedBackpack = backpacks.reduce((best, current) => {
                    if (current.price <= budgetAllocation.backpack && current.price > (best?.price || 0)) {
                        return current;
                    }
                    return best;
                }, null) || backpacks[0];
            }
            result.backpack = selectedBackpack;
        }
    }
    // 堵点夺舍玩家 - 选性价比最高的
    else if (playerType === "堵点夺舍") {
        // 头盔：选4级头为主
        if (gear.helmets && gear.helmets.length > 0) {
            let helmets = gear.helmets.filter(h => h.price <= budgetAllocation.helmet);
            
            // 优先4级头
            let level4Helmets = helmets.filter(h => parseInt(h.level) === 4);
            if (level4Helmets.length > 0) {
                // 选最便宜的4级头
                level4Helmets.sort((a, b) => (a.price || 0) - (b.price || 0));
                result.helmet = level4Helmets[0];
            } else {
                // 没有4级头就选最便宜的
                helmets.sort((a, b) => (a.price || 0) - (b.price || 0));
                result.helmet = helmets[0];
            }
        }
        
        // 护甲：选4级甲
        if (gear.armors && gear.armors.length > 0) {
            let armors = gear.armors.filter(a => a.price <= budgetAllocation.armor);
            
            // 优先4级甲
            let level4Armors = armors.filter(a => parseInt(a.level) === 4);
            if (level4Armors.length > 0) {
                level4Armors.sort((a, b) => (a.price || 0) - (b.price || 0));
                result.armor = level4Armors[0];
            } else {
                armors.sort((a, b) => (a.price || 0) - (b.price || 0));
                result.armor = armors[0];
            }
        }
        
        // 胸挂：选便宜的，但有基本容量
        if (gear.chest_rigs && gear.chest_rigs.length > 0) {
            let chestRigs = gear.chest_rigs.filter(c => c.price <= budgetAllocation.chest_rig);
            chestRigs.sort((a, b) => (a.price || 0) - (b.price || 0));
            result.chest_rig = chestRigs[0];
        }
        
        // 背包：选便宜的
        if (gear.backpacks && gear.backpacks.length > 0) {
            let backpacks = gear.backpacks.filter(b => b.price <= budgetAllocation.backpack);
            backpacks.sort((a, b) => (a.price || 0) - (b.price || 0));
            result.backpack = backpacks[0];
        }
    }
    // 鼠鼠玩家 - 选最便宜的
    else {
        // 头盔：选最便宜的
        if (gear.helmets && gear.helmets.length > 0) {
            let helmets = gear.helmets.filter(h => h.price <= budgetAllocation.helmet);
            helmets.sort((a, b) => (a.price || 0) - (b.price || 0));
            result.helmet = helmets[0];
        }
        
        // 护甲：选最便宜的
        if (gear.armors && gear.armors.length > 0) {
            let armors = gear.armors.filter(a => a.price <= budgetAllocation.armor);
            armors.sort((a, b) => (a.price || 0) - (b.price || 0));
            result.armor = armors[0];
        }
        
        // 胸挂：选容量最大的（因为要装东西）
        if (gear.chest_rigs && gear.chest_rigs.length > 0) {
            let chestRigs = gear.chest_rigs.filter(c => c.price <= budgetAllocation.chest_rig);
            chestRigs.sort((a, b) => (b.slots || 0) - (a.slots || 0));
            result.chest_rig = chestRigs[0];
        }
        
        // 背包：选容量最大的
        if (gear.backpacks && gear.backpacks.length > 0) {
            let backpacks = gear.backpacks.filter(b => b.price <= budgetAllocation.backpack);
            backpacks.sort((a, b) => (b.slots || 0) - (a.slots || 0));
            result.backpack = backpacks[0];
        }
    }
    
    return result;
}
// 选择干员
function selectOperators(operators, playerType) {
    if (!operators || operators.length === 0) return [];
    
    // 创建玩家类型到干员数据键的映射
    const playerTypeMapping = {
        "鼠鼠": "鼠鼠 (避战/捡漏)",
        "堵点夺舍": "堵撤离点/夺舍流 (蹲守/掠夺)", 
        "猛攻流": "猛攻流 (正面作战)"
    };
    
    // 获取对应的键名
    const operatorTypeKey = playerTypeMapping[playerType] || playerType;
    
    console.log(`搜索玩家类型: ${playerType}, 对应干员键: ${operatorTypeKey}`);
    
    // 筛选适合当前玩家类型的干员
    const suitableOperators = operators.filter(op => {
        if (!op.suitable_for_players) {
            console.log(`干员 ${op.name} 没有suitable_for_players属性`);
            return false;
        }
        
        const suitability = op.suitable_for_players[operatorTypeKey];
        const hasSuitability = suitability && suitability.suitability;
        
        if (!hasSuitability) {
            console.log(`干员 ${op.name} 没有 ${operatorTypeKey} 的适配度信息`);
        }
        
        return hasSuitability;
    });
    
    console.log(`找到 ${suitableOperators.length} 个适配干员`);
    
    if (suitableOperators.length === 0) {
        console.log('没有找到适配干员，返回所有干员');
        return operators.slice(0, 3);
    }
    
    // 按适配度排序
    const sortedOperators = [...suitableOperators].sort((a, b) => {
        const suitabilityA = a.suitable_for_players[operatorTypeKey].suitability;
        const suitabilityB = b.suitable_for_players[operatorTypeKey].suitability;
        
        // 适配度优先级
        const priority = { 
            "S": 5, 
            "A+": 4, 
            "A": 3, 
            "B": 2, 
            "C": 1, 
            "D": 0 
        };
        
        const scoreA = priority[suitabilityA] || 0;
        const scoreB = priority[suitabilityB] || 0;
        
        // 主要按适配度排序
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }
        
        // 适配度相同，按干员类型排序（突击 > 侦察 > 支援 > 工程）
        const typeOrder = { 
            "突击": 4, 
            "侦察": 3, 
            "支援": 2, 
            "工程": 1 
        };
        
        const typeScoreA = typeOrder[a.type] || 0;
        const typeScoreB = typeOrder[b.type] || 0;
        
        return typeScoreB - typeScoreA;
    });
    
    // 返回前3个，确保每个都有id
    return sortedOperators.slice(0, 3).map(op => {
        // 如果干员没有id，给一个基于名称的id
        if (!op.id) {
            const nameId = op.name.replace(/[^\w]/g, '_').toLowerCase();
            return { ...op, id: nameId };
        }
        return op;
    });
}
// 移动到 displayLoadout 函数外部
function getOverallStrength(weapon, gear) {
    const strengthOrder = { "S": 5, "A+": 4.5, "A": 4, "B": 3, "C": 2, "D": 1 };
    
    let totalStrength = 0;
    let count = 0;
    
    if (weapon && weapon.strength) {
        totalStrength += strengthOrder[weapon.strength] || 3;
        count++;
    }
    
    Object.values(gear).forEach(item => {
        if (item && item.strength) {
            totalStrength += strengthOrder[item.strength] || 3;
            count++;
        }
    });
    
    if (count === 0) return "未知";
    
    const avgStrength = totalStrength / count;
    
    if (avgStrength >= 4.5) return "S级";
    if (avgStrength >= 4) return "A+级";
    if (avgStrength >= 3.5) return "A级";
    if (avgStrength >= 2.5) return "B级";
    if (avgStrength >= 1.5) return "C级";
    return "D级";
}
// 显示配装结果（简化版）
function displayLoadout(weapon, gear, operators, budgetAllocation) {
    const container = document.getElementById('loadoutResult');
    
    // 计算总成本
    const weaponCost = weapon ? (weapon.price || 0) : 0;
    const gearCost = Object.values(gear).reduce((sum, item) => sum + (item ? (item.price || 0) : 0), 0);
    const consumableCost = budgetAllocation.medical + budgetAllocation.ammo;
    const totalCost = weaponCost + gearCost + consumableCost;
    const remainingBudget = currentBudget - totalCost;
    const budgetUtilization = (totalCost / currentBudget) * 100;
    // 在displayLoadout函数中，在预算统计部分添加警告
if (totalCost > currentBudget) {
    html += `
        <div class="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <div class="flex items-center mb-2">
                <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
                <p class="font-bold text-red-300">⚠️ 警告：配装超出预算！</p>
            </div>
            <p class="text-sm">总成本${formatPrice(totalCost)}超过预算${formatPrice(currentBudget)}，超出${formatPrice(totalCost - currentBudget)}</p>
            <p class="text-sm mt-2">建议：</p>
            <ul class="text-sm text-gray-300 mt-1 list-disc pl-5">
                <li>降低武器或防具等级</li>
                <li>减少药品和弹药携带量</li>
                <li>点击"重新生成"尝试其他方案</li>
            </ul>
        </div>
    `;
}
    // 添加装备强度函数（如果未定义）
    if (typeof getOverallStrength !== 'function') {
        function getOverallStrength(weapon, gear) {
            // 简单的装备强度计算逻辑
            let strength = 0;
            if (weapon) {
                const weaponStrengthMap = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
                strength += weaponStrengthMap[weapon.strength] || 0;
            }
            
            // 防具强度
            Object.values(gear).forEach(item => {
                if (item && item.level) {
                    strength += parseInt(item.level) || 0;
                }
            });
            
            return strength > 0 ? strength + '级' : '未计算';
        }
    }
    
    // 预算使用建议
    let budgetAdvice = "";
    if (budgetUtilization < 50) {
        budgetAdvice = `<div class="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p class="font-bold text-yellow-300 mb-2">💡 预算使用建议</p>
            <p class="text-sm">当前预算仅使用了${Math.round(budgetUtilization)}%，建议：</p>
            <ul class="text-sm text-gray-300 mt-2 list-disc pl-5">
                ${currentPlayerType === "鼠鼠" ? 
                  `<li>升级背包容量，携带更多战利品</li>
                   <li>购买更多医疗物资，提高生存率</li>
                   <li>考虑携带一把更可靠的副武器</li>` :
                currentPlayerType === "堵点夺舍" ?
                  `<li>升级武器配件，提高爆发力</li>
                   <li>购买更高级的弹药，提升穿甲能力</li>
                   <li>携带更多投掷物，增加战术选择</li>` :
                  `<li>升级防具等级，提高生存能力</li>
                   <li>购买满改武器，获得最大性能</li>
                   <li>携带高级弹药，确保击杀效率</li>`
                }
            </ul>
        </div>`;
    }
    
    // 获取地图名称
    const mapName = getMapName(currentMap);
    
    let html = `
        <div class="fade-in">
            <!-- 头部信息 -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h3 class="text-2xl font-bold mb-2">🎮 ${currentPlayerType}配装方案</h3>
                        <div class="flex items-center">
                            <span class="px-3 py-1 ${getMapTagClass(currentMap)} rounded-full text-sm mr-3">${mapName} - ${currentMode}</span>
                            <span class="text-gray-400">预算: ${formatPrice(currentBudget)}</span>
                        </div>
                    </div>
                    <div class="mt-4 md:mt-0">
                        <button onclick="saveLoadout()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all mr-2">
                            <i class="fas fa-save mr-2"></i>保存
                        </button>
                        <button onclick="shareLoadout()" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all">
                            <i class="fas fa-share mr-2"></i>分享
                        </button>
                    </div>
                </div>
                
                <!-- 预算统计 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <p class="text-sm text-gray-400 mb-1">配装成本</p>
                        <p class="text-2xl font-bold text-green-400">${formatPrice(totalCost)}</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <p class="text-sm text-gray-400 mb-1">剩余预算</p>
                        <p class="text-2xl font-bold ${remainingBudget >= 0 ? 'text-blue-400' : 'text-red-400'}">${formatPrice(remainingBudget)}</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <p class="text-sm text-gray-400 mb-1">预算利用率</p>
                        <p class="text-2xl font-bold ${budgetUtilization > 80 ? 'text-green-400' : budgetUtilization > 60 ? 'text-yellow-400' : 'text-red-400'}">${Math.round(budgetUtilization)}%</p>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <p class="text-sm text-gray-400 mb-1">装备强度</p>
                        <p class="text-2xl font-bold text-purple-400">${getOverallStrength(weapon, gear)}</p>
                    </div>
                </div>
                
                <!-- 预算使用进度条 -->
                <div class="mt-4">
                    <div class="flex justify-between text-sm mb-1">
                        <span>预算使用进度</span>
                        <span>${Math.round(budgetUtilization)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(budgetUtilization, 100)}%"></div>
                    </div>
                </div>
                
                ${budgetUtilization < 50 ? budgetAdvice : ''}
            </div>
            
            <!-- 猛攻流特别说明 -->
            ${currentPlayerType === "猛攻流" ? `
            <div class="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-4 mb-6 border border-red-700/50">
                <div class="flex items-center mb-2">
                    <i class="fas fa-crown text-yellow-400 text-xl mr-3"></i>
                    <h5 class="text-lg font-bold text-white">👑 猛攻流核心思路</h5>
                </div>
                <p class="text-sm">
                    <strong>宗旨：</strong>用最好的装备碾压对手！<br>
                    <strong>武器：</strong>必须S级满改，不惜成本<br>
                    <strong>防具：</strong>最高等级，正面硬刚<br>
                    <strong>战术：</strong>主动进攻资源点，清剿全场<br>
                    <strong>预算使用目标：</strong>尽量接近100%，不留余钱！
                </p>
            </div>
            ` : ''}
            
            <!-- 武器推荐 -->
            <div class="bg-gray-800 rounded-xl p-6 mb-6">
                <h4 class="text-xl font-bold mb-4 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-gun"></i>
                    </div>
                    🎯 主武器推荐
                </h4>
                
                ${weapon ? `
                <div class="flex flex-col lg:flex-row gap-6">
                    <div class="lg:w-2/3">
                        <div class="flex flex-wrap items-center gap-2 mb-4">
                            <span class="px-3 py-1 ${getStrengthClass(weapon.strength)} rounded-full">${weapon.strength || '未知'}级强度</span>
                            <span class="px-3 py-1 bg-gray-700 rounded-full">${weapon.type || '未知类型'}</span>
                            <span class="px-3 py-1 bg-gray-700 rounded-full">${formatPrice(weapon.price)}</span>
                        </div>
                        
                        <h5 class="text-xl font-bold mb-3 gradient-text">${weapon.name}</h5>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="font-bold text-green-400 mb-2">优点</p>
                                <p>${weapon.pros || '暂无信息'}</p>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <p class="font-bold text-red-400 mb-2">缺点</p>
                                <p>${weapon.cons || '暂无信息'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${weapon.code ? `
                    <div class="lg:w-1/3">
                        <div class="bg-gray-900 p-5 rounded-xl border border-gray-700">
                            <p class="font-bold mb-3">📋 改枪码</p>
                            <div class="bg-gray-800 p-4 rounded-lg mb-4 break-all">
                                <code class="text-sm">${weapon.code}</code>
                            </div>
                            <button onclick="copyCode('${weapon.code}')" class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 py-3 rounded-lg transition-all">
                                <i class="fas fa-copy mr-2"></i>复制改枪码
                            </button>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : '<p class="text-gray-400 text-center py-6">未找到合适的武器</p>'}
            </div>
            
            <!-- 防具推荐 -->
            <div class="bg-gray-800 rounded-xl p-6 mb-6">
                <h4 class="text-xl font-bold mb-4 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-shield-alt"></i>   
                    </div>
                    🛡️ 防护装备
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    `;
    
    // 防具项目
    Object.entries(gear).forEach(([type, item]) => {
        if (item) {
            const typeName = getGearTypeName(type);
            
            html += `
                <div class="bg-gray-700 p-5 rounded-lg gear-card">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                                <i class="fas fa-${getGearIcon(type)}"></i>
                            </div>
                            <div>
                                <p class="font-bold">${typeName}</p>
                                <p class="text-sm text-gray-400">${item.name}</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-gray-800 rounded-full font-bold">${formatPrice(item.price)}</span>
                    </div>
                    
                    ${item.level ? `<p class="mb-2"><span class="font-bold">等级:</span> ${item.level}级</p>` : ''}
                    ${item.strength ? `<p class="mb-2"><span class="font-bold">强度:</span> ${item.strength}</p>` : ''}
                    ${item.slots ? `<p class="mb-2"><span class="font-bold">容量:</span> ${item.slots}格</p>` : ''}
                    ${item.pros ? `<p class="text-green-400 text-sm">${item.pros}</p>` : ''}
                </div>
            `;
        }
    });
    
    html += `
                </div>
            </div>
            
            <!-- 干员推荐 -->
            <div class="bg-gray-800 rounded-xl p-6 mb-6">
                <h4 class="text-xl font-bold mb-4 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-users"></i>
                    </div>
                    👥 干员推荐
                </h4>
                
                ${operators && operators.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${operators.map(op => {
                        // 关键修复：找到干员在localOperatorsData中的索引
                        const operatorIndex = localOperatorsData.findIndex(o => o.id === op.id);
                        
                        // 如果找不到索引，尝试通过名称查找
                        let finalIndex = operatorIndex;
                        if (finalIndex === -1) {
                            finalIndex = localOperatorsData.findIndex(o => o.name === op.name);
                        }
                        
                        // 如果还是找不到，使用第一个干员作为后备
                        if (finalIndex === -1) {
                            finalIndex = 0;
                        }
                        
                        // 玩家类型到干员数据中键名的映射
                        const playerTypeMapping = {
                            "鼠鼠": "鼠鼠 (避战/捡漏)",
                            "堵点夺舍": "堵撤离点/夺舍流 (蹲守/掠夺)", 
                            "猛攻流": "猛攻流 (正面作战)"
                        };
                        const operatorTypeKey = playerTypeMapping[currentPlayerType] || currentPlayerType;
                        const suitability = op.suitable_for_players && op.suitable_for_players[operatorTypeKey];
                        
                        return `
                        <div class="bg-gray-700 p-5 rounded-lg operator-card">
                            <div class="flex justify-between items-start mb-3">
                                <p class="font-bold text-lg">${op.name}</p>
                                ${suitability ? `
                                <span class="px-3 py-1 ${getSuitabilityClass(suitability.suitability)} rounded-full text-sm">
                                    ${suitability.suitability}级适配
                                </span>
                                ` : ''}
                            </div>
                            
                            <p class="text-gray-400 mb-4">${op.type}干员</p>
                            
                            ${suitability ? `
                            <div class="mb-4">
                                <p class="font-bold mb-2">核心优势</p>
                                <p class="text-sm">${suitability.reason || '暂无信息'}</p>
                            </div>
                            ` : ''}
                            
                            <button onclick="showOperatorDetail(${finalIndex})" class="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                                查看详情
                            </button>
                        </div>
                        `;
                    }).join('')}
                </div>
                ` : '<p class="text-gray-400 text-center py-6">未找到推荐的干员</p>'}
            </div>
            
            <!-- 地图战术建议 -->
            <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/30">
                <h4 class="text-xl font-bold mb-4 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    🗺️ ${mapName}战术建议
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p class="font-bold mb-2">${currentPlayerType}玩法建议</p>
                        <p class="text-gray-300">
                            ${currentPlayerType === '鼠鼠' ? 
                              '作为鼠鼠玩家，你的目标是避战搜刮。选择人少的资源点，快速搜刮后立即撤离。不要贪心，保住装备就是胜利。' :
                              currentPlayerType === '堵点夺舍' ?
                              '作为堵点夺舍玩家，选择敌人必经之路埋伏。耐心等待，一击必杀，夺取敌人装备后快速撤离。' :
                              '作为猛攻流玩家，直接进攻高价值区域。凭借装备优势正面作战，清剿敌人控制资源点。'}
                        </p>
                    </div>
                    <div>
                        <p class="font-bold mb-2">模式要求</p>
                        <p class="text-yellow-300">
                            ${currentMode}模式要求最低${formatPrice(mapModeRequirements[currentMap][currentMode].min)}预算
                            ${currentMode === '常规' ? '，无额外限制' : 
                              currentMode === '机密' ? '，适合有一定装备基础的玩家' : 
                              '，适合装备成型的玩家'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;          
    
    container.innerHTML = html;
    
    // 滚动到结果区域
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 保存配装方案
function saveLoadout() {
    const loadout = {
        playerType: currentPlayerType,
        budget: currentBudget,
        map: currentMap,
        mode: currentMode,
        timestamp: new Date().toLocaleString('zh-CN')
    };
    
    // 获取已保存的配装
    let savedLoadouts = JSON.parse(localStorage.getItem('deltaSavedLoadouts') || '[]');
    
    // 添加到数组开头
    savedLoadouts.unshift(loadout);
    
    // 只保留最近10个
    if (savedLoadouts.length > 10) {
        savedLoadouts = savedLoadouts.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('deltaSavedLoadouts', JSON.stringify(savedLoadouts));
    
    // 显示提示
    showFeedback(`配装方案已保存！`);
}

// 分享配装
function shareLoadout() {
    const shareText = `我的三角洲配装：${currentPlayerType}玩法，预算${formatPrice(currentBudget)}，地图${getMapName(currentMap)}，模式${currentMode}`;
    
    if (navigator.share) {
        navigator.share({
            title: '三角洲配装方案',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            showFeedback('配装方案已复制到剪贴板！');
        });
    }
}

// 问答助手
function handleQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    
    if (!question) return;
    
    // 添加用户消息
    addMessageToChat(question, 'user');
    
    // 获取回答
    const answer = getAnswer(question);
    
    // 模拟AI思考时间
    setTimeout(() => {
        addMessageToChat(answer, 'ai');
    }, 800);
    
    // 清空输入框
    input.value = '';
}

// 添加消息到聊天
function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender} mb-4 fade-in`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex justify-end">
                <div class="max-w-xs">
                    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg rounded-tr-none">
                        ${message}
                    </div>
                    <p class="text-xs text-gray-500 text-right mt-1">您</p>
                </div>
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center ml-3">
                    <i class="fas fa-user text-sm"></i>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-robot text-sm"></i>
                </div>
                <div class="max-w-xs">
                    <p class="text-sm text-gray-400 mb-1">三角洲配装助手</p>
                    <div class="bg-gray-700 p-3 rounded-lg rounded-tl-none">
                        ${message}
                    </div>
                </div>
            </div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    
    // 滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 获取回答
function getAnswer(question) {
    const q = question.toLowerCase();
    
    // 扩展问答库
    const qaMap = {
        '鼠鼠': '鼠鼠玩法核心是低成本避战，推荐使用UZI、勇士等便宜武器，优先扩大背包容量捡垃圾。干员选择蜂医最佳，可以利用烟雾弹安全撤离。预算分配建议：武器15%，防具15%，背包30%，剩余40%用于药品和备用。',
        '堵桥': '航天基地堵桥需要高射速武器，如MP7、Vector，选择红狼干员利用烟雾弹和加速转点。建议预算30-50万，武器占40%，防具占35%，注重高爆发和偷袭能力。',
        '猛攻': '猛攻流需要满改M14、腾龙等S级武器，搭配5-6级防具，主动进攻资源密集区。预算建议70万以上，武器占50%，防具占40%，干员选择威龙或红狼。',
        'm14': 'M14是游戏内爆发最高武器之一，满改价格85万左右，适合猛攻流玩家。优点：大口径高输出，全距离作战；缺点：后坐力大，需要熟练控枪。',
        '零号大坝': '零号大坝适合新手，行政楼资源丰富但危险，鼠鼠可以在外围搜刮，猛攻流直接进攻行政楼。地图有8个撤离点，包括常规、条件、概率、付费和电梯撤离。',
        '预算': '预算分配建议：鼠鼠武器15%、防具15%、背包30%、药品5%、子弹5%、备用30%；猛攻流武器50%、防具40%、其他10%；堵点夺舍武器40%、防具35%、其他25%。',
        '干员': '红狼适合突击，蜂医适合鼠鼠，露娜适合侦察，威龙适合机动突击。根据玩法选择：鼠鼠选蜂医，堵点选红狼，猛攻选威龙。',
        '头盔': 'GN重型夜视头价格60万，适合猛攻流；DICH训练头盔13.5万，适合鼠鼠；4级听力头20万，适合堵点玩家。头盔选择根据预算和玩法决定。',
        '护甲': 'HA-2重型防弹衣350万，顶级防护；TGH防弹衣6.3万，适合新手；MK-2战术背心19.5万，均衡选择。鼠鼠用低级甲，猛攻用高级甲。',
        '地图': '零号大坝适合新手，航天基地适合堵桥，潮汐监狱适合猛攻，长弓溪谷适合狙击，巴克什适合巷战。不同地图需要不同配装策略。',
        '武器': '鼠鼠推荐UZI、勇士；堵点推荐MP7、Vector；猛攻推荐M14、腾龙、MK47。根据预算和玩法选择合适武器。'
    };
    
    // 关键词匹配
    for (const [keyword, answer] of Object.entries(qaMap)) {
        if (q.includes(keyword)) {
            return answer;
        }
    }
    
    // 如果没有匹配，基于当前设置给出建议
    return `根据你当前的设置（${currentPlayerType}玩法，预算${formatPrice(currentBudget)}，地图${getMapName(currentMap)}，模式${currentMode}），建议：${
        currentPlayerType === '鼠鼠' ? '选择便宜武器(10-30万)，优先背包容量，使用蜂医干员安全撤离。' :
        currentPlayerType === '堵点夺舍' ? '选择高爆发武器(30-60万)，注重偷袭，使用红狼或露娜干员。' :
        '选择顶级装备(70万+)，正面作战，使用威龙或蛊干员。'
    }`;
}

// ========== 工具函数 ==========

// 格式化价格
function formatPrice(price) {
    if (!price && price !== 0) return '未知';
    
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + 'M';
    } else if (price >= 100000) {
        return (price / 10000).toFixed(0) + '万';
    } else if (price >= 10000) {
        return (price / 10000).toFixed(1) + '万';
    }
    return price.toString();
}

// 获取强度颜色类
function getStrengthClass(strength) {
    if (!strength) return 'bg-gray-700';
    
    if (strength.includes('S')) return 'strength-S';
    if (strength.includes('A')) return 'strength-A';
    if (strength.includes('B')) return 'strength-B';
    if (strength.includes('C')) return 'strength-C';
    
    return 'bg-gray-700';
}

// 获取适配度颜色类
function getSuitabilityClass(suitability) {
    if (!suitability) return 'bg-gray-700';
    
    if (suitability === 'S') return 'bg-gradient-to-r from-purple-600 to-pink-600';
    if (suitability === 'A') return 'bg-gradient-to-r from-red-600 to-orange-600';
    if (suitability === 'B') return 'bg-gradient-to-r from-yellow-600 to-amber-600';
    if (suitability === 'C') return 'bg-gradient-to-r from-green-600 to-emerald-600';
    if (suitability === 'D') return 'bg-gray-700';
    
    return 'bg-gray-700';
}

// 获取地图名称
function getMapName(mapId) {
    const mapNames = {
        "zero_dam": "零号大坝",
        "aerospace_base": "航天基地",
        "tidal_prison": "潮汐监狱",
        "longbow_valley": "长弓溪谷",
        "bukshi": "巴克什"
    };
    return mapNames[mapId] || mapId;
}

// 获取地图标签类
function getMapTagClass(mapId) {
    return `map-tag-${mapId}`;
}

// 获取装备类型名称
function getGearTypeName(type) {
    const names = {
        "helmet": "头盔",
        "armor": "护甲",
        "chest_rig": "胸挂",
        "backpack": "背包"
    };
    return names[type] || type;
}

// 获取装备图标
function getGearIcon(type) {
    const icons = {
        "helmet": "helmet-safety",
        "armor": "vest",
        "chest_rig": "vest-patches",
        "backpack": "backpack"
    };
    return icons[type] || "box";
}

// 复制改枪码
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showFeedback('改枪码已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择并复制代码');
    });
}

// 初始化完成
console.log("三角洲配装助手代码加载完成！");
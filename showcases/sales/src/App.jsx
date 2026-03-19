import { useState, useRef } from "react";

// ============================================================
// === DATA START ===
// ============================================================

const SITE = {
  skillName: "sales-playbook",
  title: "销售知识库 Skill",
  subtitle: "销售方法论",
  slogan: "让 AI 开口就是销售顾问",
  description: "6 本销售必读经典提炼 · 可执行框架",
  installCmd: "clawhub install sales-playbook",
  accentColor: "#e74c3c",
  personas: [
    { title: "销售人冷启动龙虾", desc: "一键安装，龙虾秒懂销售", color: "#e74c3c" },
    { title: "销售人日常使用", desc: "拜访、提案、谈判、获客…随时调取方法论", color: "#e67e22" },
    { title: "想学习销售经典理论", desc: "通过实战 prompt 掌握 6 本经典", color: "#ea580c" },
  ],
  usageSteps: [
    { step: 1, title: "让 Agent 学习", examples: ["你去学一下销售方法论"], result: "升级龙虾大脑", color: "#e74c3c" },
    { step: 2, title: "在相关任务中自动调用", examples: ["帮我准备一次客户拜访", "帮我谈个好价格", "怎么写开发邮件"], result: "Agent 自动匹配框架", color: "#e67e22" },
    { step: 3, title: "指定具体框架进行分析", examples: ["用 SPIN 帮我设计提问", "用 Voss 的方法帮我准备谈判"], result: "精确调用某一框架", color: "#ea580c" },
  ],
};

// 金字塔：找客户(4) | 理解需求(0,3) | 说服成交(1,2) | 影响力(5)
const PYRAMID = [
  { pillar: "找客户", desc: "管道永远充满，系统化获客", color: "#e74c3c", ids: [4] },
  { pillar: "理解需求", desc: "挖出真正的痛点与期望", color: "#e67e22", ids: [0, 3] },
  { pillar: "说服成交", desc: "教育客户、谈判成交", color: "#ea580c", ids: [1, 2] },
  { pillar: "影响力", desc: "调频、浮力、清晰", color: "#dc2626", ids: [5] },
];

const FW = [
  { id: 0, name: "SPIN 提问法", en: "SPIN Selling", emoji: "❓", book: "SPIN Selling", author: "Neil Rackham", year: 1988, color: "#e74c3c", coverId: 55114,
    one: "用四类问题引导客户自己说出需求", tags: ["B2B销售", "顾问式销售"],
    idea: "顶级销售不是说服客户，而是用问题引导客户自己得出结论。S→P→I→N 把隐性需求转化为显性需求。",
    steps: [
      { n: "情境问题 (S)", d: "了解客户现状和背景。能提前查到的就提前查，S 问题越少越好" },
      { n: "问题问题 (P)", d: "让客户说出困难和不满。问的不是泛泛的困难，而是指向产品能解决的具体痛点" },
      { n: "暗示问题 (I)", d: "放大问题的严重性和后果。把'有点慢'变成'每月损失多少'——I 问题是 SPIN 的灵魂" },
      { n: "需求-效益问题 (N)", d: "让客户自己说出理想方案的价值。客户亲口说的比你说一百遍管用" },
    ],
    traps: ["把 SPIN 当固定脚本念", "情境问题问太多", "跳过暗示问题直接推方案", "自己回答了 N 问题", "在小单上用 SPIN"],
    combos: [
      { with: "挑战者销售", how: "挑战者重构认知，SPIN 把新认知转化为明确需求。先教后问" },
      { with: "差距销售", how: "P 挖现状痛点，I 放大差距，N 描绘期望状态。天然互补" },
      { with: "狂热开发", how: "Prospecting 约客户，SPIN 约到之后怎么谈" },
    ],
    q: "SPIN 中哪类问题最关键？", opts: [
      { t: "情境问题，了解背景最重要", c: false, e: "S 问题能少则少，提前做功课" },
      { t: "暗示问题，把痛苦放大到必须解决", c: true, e: "没有 I 问题客户觉得可以忍" },
      { t: "需求-效益问题，直接问需要什么", c: false, e: "N 是让客户自己说价值，不是问需要" },
      { t: "问题问题，挖出痛点就够了", c: false, e: "只知道痛点不够，要放大到影响层" },
    ] },
  { id: 1, name: "挑战者模型", en: "Challenger Sale", emoji: "🎯", book: "The Challenger Sale", author: "Dixon & Adamson", year: 2011, color: "#e67e22", coverId: 8090985,
    one: "教育客户、挑战认知、推动行动", tags: ["复杂销售", "价值销售"],
    idea: "最好的销售不是建立关系、满足需求，而是主动教育客户、挑战客户的现有认知。前 5 步都在教学，最后才提产品。",
    steps: [
      { n: "暖场 The Warmer", d: "说出客户正在面临的挑战，让客户觉得你懂我" },
      { n: "重构 The Reframe", d: "告诉客户你以为的问题不是真问题，或真正的问题你没看到" },
      { n: "理性淹没", d: "用行业数据、案例、趋势证明不改变的代价有多大" },
      { n: "情感冲击", d: "用故事或场景让客户感受到如果不行动会怎样" },
      { n: "新出路", d: "展示新的思路/方法——注意还没提产品" },
      { n: "你的方案", d: "最后才说我们的产品恰好能支撑这个新方法" },
    ],
    traps: ["把挑战理解为对抗", "没有真正洞察就强行教学", "以为关系不重要", "六步流程太早提产品", "定制只是换了开头一页 PPT"],
    combos: [
      { with: "SPIN", how: "挑战者教学重构认知，SPIN 把新认知转化为需求" },
      { with: "差距销售", how: "挑战者重构帮客户看到更糟的现状，差距销售量化差距" },
      { with: "狂热开发", how: "Prospecting 约客户，挑战者方法在会面中建立权威" },
    ],
    q: "商业教学演示中，产品应该在第几步提？", opts: [
      { t: "暖场之后立刻提，建立信任", c: false, e: "太早提，客户还没感受痛苦" },
      { t: "六步流程的最后一步", c: true, e: "前 5 步都在教学，最后自然引出" },
      { t: "理性淹没时提，用数据支撑", c: false, e: "理性淹没是放大痛苦，不是推产品" },
      { t: "随时可以提，灵活应对", c: false, e: "产品后置是挑战者法的核心原则" },
    ] },
  { id: 2, name: "Voss 谈判术", en: "Never Split the Difference", emoji: "🤝", book: "Never Split the Difference", author: "Chris Voss", year: 2016, color: "#ea580c", coverId: 8365942,
    one: "用战术同理心而非逻辑赢得谈判", tags: ["商务谈判", "议价"],
    idea: "谈判不是说服对方接受你的逻辑，而是让对方感觉被理解。镜像、标注、校准问题——用同理心赢得谈判。",
    steps: [
      { n: "镜像 Mirroring", d: "重复对方最后几个关键词，让对方继续说下去" },
      { n: "标注 Labeling", d: "说出对方的情绪/感受。'听起来你对这个时间表感到压力很大'" },
      { n: "沉默", d: "说完标注或镜像后闭嘴至少 4 秒，给对方空间" },
      { n: "校准问题", d: "用'怎么''什么'开头，把问题重量转移给对方。永远不要问为什么" },
      { n: "获取'没错'", d: "目标让对方说 That's right——感觉被完全理解" },
      { n: "Ackerman 议价", d: "65%→85%→95%→100%，递减让步，最后用精确数字" },
    ],
    traps: ["把同理心理解为同意", "在情绪问题上讲逻辑", "折中看起来公平实际双输", "怕沉默自己说太多", "准备不够就上场"],
    combos: [
      { with: "SPIN", how: "SPIN 解决客户为什么买，Voss 解决以什么条件买" },
      { with: "挑战者销售", how: "挑战者的控制环节可借用校准问题和锚定策略" },
      { with: "全新销售", how: "Pink 的调频和 Voss 的战术同理心理念一致，Voss 有更具体工具" },
    ],
    q: "对方说'预算有限'，最好的回应是？", opts: [
      { t: "我们也可以提供分期方案", c: false, e: "太快给方案，没先理解" },
      { t: "预算有限？", c: true, e: "镜像——重复关键词让对方展开" },
      { t: "为什么预算有限？", c: false, e: "'为什么'让人防御" },
      { t: "理解，那您能出多少？", c: false, e: "没先标注情绪就谈钱" },
    ] },
  { id: 3, name: "差距模型", en: "Gap Selling", emoji: "📏", book: "Gap Selling", author: "Keenan", year: 2019, color: "#dc2626", coverId: 9670355,
    one: "帮客户看清现状与理想之间的差距", tags: ["需求诊断", "销售提案"],
    idea: "没有差距就没有销售。客户买的不是产品，是从现状到期望状态的桥。先诊断再开方。",
    steps: [
      { n: "现状挖掘", d: "环境层→问题层→影响层。必须挖到影响层——问题造成了多大损失" },
      { n: "期望状态", d: "客户想要的理想情况是什么？必须是客户自己表达的" },
      { n: "差距量化", d: "现状和期望之间的距离——金额、时间、效率。差距越大紧迫感越强" },
      { n: "方案对应", d: "每个产品功能对应一个具体差距，不是列功能清单" },
    ],
    traps: ["一上来就展示产品功能", "只挖到问题层就停", "帮客户编造期望状态", "差距不大也硬卖", "混淆客户差距和产品差距"],
    combos: [
      { with: "SPIN", how: "S 挖环境，P 挖问题，I 挖影响，N 描绘期望。完美配合" },
      { with: "挑战者销售", how: "挑战者重构可帮客户重新定义差距" },
      { with: "全新销售", how: "Pink 的清晰度和差距销售核心理念一致" },
    ],
    q: "差距销售中，必须挖到哪一层才有紧迫感？", opts: [
      { t: "环境层，了解客户背景", c: false, e: "环境层只是背景" },
      { t: "问题层，知道有什么困难", c: false, e: "'流程慢'是问题，但不够" },
      { t: "影响层，问题造成了多大损失", c: true, e: "每月损失 50 万才是差距证据" },
      { t: "期望层，客户想要什么", c: false, e: "期望是目标，影响层是痛苦的量化" },
    ] },
  { id: 4, name: "狂热开发", en: "Fanatical Prospecting", emoji: "📞", book: "Fanatical Prospecting", author: "Jeb Blount", year: 2015, color: "#e74c3c", coverId: 12685538,
    one: "用纪律和系统保持管道永远充满", tags: ["客户开发", "销售管道"],
    idea: "你今天做的开发决定 30-90 天后的业绩。管道空了再开发就晚了。黄金时间只联系客户，开发是第一优先级。",
    steps: [
      { n: "30 天管道法则", d: "今天停止开发，30 天后管道就干涸。每天固定时间开发，无论多忙" },
      { n: "替代法则", d: "新流入速度必须大于流出速度。算管道数学：目标÷成交率=需要机会数" },
      { n: "黄金时间法则", d: "黄金时段只联系客户。不开会、不写方案、不回内部邮件" },
      { n: "多渠道开发", d: "电话+邮件+LinkedIn 组合。先预热再邮件再电话" },
      { n: "开发区块", d: "高强度区块不可打断。每天至少一个" },
    ],
    traps: ["等线索自己来", "忙的时候停开发", "一次被拒就放弃", "只用一种渠道", "花太多时间在准备上"],
    combos: [
      { with: "SPIN", how: "Prospecting 约客户，SPIN 约到之后怎么谈" },
      { with: "挑战者销售", how: "开发信可用教学思维，让信息本身有价值" },
      { with: "差距销售", how: "用差距思维筛选优先开发的目标" },
    ],
    q: "销售管道经常断流的根本原因是？", opts: [
      { t: "成交技巧不够", c: false, e: "没有足够客户再好的技巧也没用" },
      { t: "开发活动不持续", c: true, e: "忙的时候不开发，空了才慌，开发一阵又停了" },
      { t: "产品竞争力弱", c: false, e: "管道问题是流入不足" },
      { t: "价格太高", c: false, e: "管道数学是活动量问题" },
    ] },
  { id: 5, name: "全新销售", en: "To Sell Is Human", emoji: "💡", book: "To Sell Is Human", author: "Daniel Pink", year: 2012, color: "#e67e22", coverId: 10297418,
    one: "调频、浮力、清晰——每个人都在卖", tags: ["影响力", "内部说服"],
    idea: "每个人都在卖想法、卖提案、卖自己。ABC 新框架：调频理解对方、浮力面对拒绝、清晰帮人发现问题。",
    steps: [
      { n: "调频 Attunement", d: "理解对方视角。降低权力感、认知换位、策略性模仿" },
      { n: "浮力 Buoyancy", d: "在拒绝中保持前进。事前质询式自我对话、事中 3:1 正负比、事后乐观解释风格" },
      { n: "清晰 Clarity", d: "帮对方看清问题而非只解决问题。发现问题比解决问题更有价值" },
      { n: "六种推介", d: "一词式、提问式、Pixar 式、主题行、Twitter、韵律" },
    ],
    traps: ["以为调频就是讨好", "把清晰理解为说清楚自己的方案", "只有正面心态", "忽略非销售的销售", "推介方式太复杂"],
    combos: [
      { with: "SPIN", how: "调频是 SPIN 的前提，不理解对方就问不出好问题" },
      { with: "挑战者销售", how: "清晰和教学高度一致，Pink 偏哲学挑战者偏方法论" },
      { with: "Voss 谈判术", how: "调频和战术同理心本质相同，Voss 给了具体工具" },
    ],
    q: "Pink 的'清晰'指的是？", opts: [
      { t: "把自己的方案说清楚", c: false, e: "清晰不是关于你" },
      { t: "帮对方发现他们没看到的问题", c: true, e: "发现问题比解决问题更有价值" },
      { t: "用数据证明价值", c: false, e: "清晰是认知层面" },
      { t: "简单直接的表达", c: false, e: "那是表达方式不是清晰本质" },
    ] },
];

// 场景 → 方法论映射。pillar: 0找客户 1理解需求 2说服成交 3影响力
const SCENES = [
  { t: "帮我准备一次客户拜访", p: 0, s: 3, l: "客户拜访", pillar: 1, w: "SPIN 四类提问帮你设计拜访策略，差距销售提供诊断框架。先问出需求再推方案。", prompts: ["用 SPIN 帮我设计这次拜访的提问清单", "帮我准备和 XX 客户的沟通问题", "客户可能存在的痛点有哪些，怎么问？"] },
  { t: "客户说不需要 / 没预算 / 以后再说", p: 3, s: 0, l: "重新激活", pillar: 1, w: "差距销售帮你诊断——通常因为客户没感受到差距够大。回到影响层，量化等待成本。", prompts: ["客户说暂时不需要，怎么设计重新激活话术？", "帮我把'不行动的成本'量化给客户看", "客户想等等，怎么温和地挑战？"] },
  { t: "怎么做一个有说服力的销售演示", p: 1, s: 3, l: "销售演示", pillar: 2, w: "挑战者六步商业教学：暖场→重构→数据→情感→新路→方案。前 5 步不提产品。", prompts: ["帮我设计一次商业教学式的销售演示", "客户对这个问题有什么常见误解？重构点在哪？", "我的演示大纲怎么改进？"] },
  { t: "帮我谈个好价格 / 怎么砍价议价", p: 2, s: null, l: "商务议价", pillar: 2, w: "Voss 的 Ackerman 议价 + 校准问题。标注情绪、用'怎么'化解不合理要求、递减让步。", prompts: ["帮我准备这场价格谈判", "对方压价时怎么用校准问题回应？", "设计 Ackerman 议价阶梯"] },
  { t: "薪资怎么谈 / 怎么要求加薪", p: 2, s: 5, l: "薪资谈判", pillar: 2, w: "Voss 的标注和锚定，Pink 的调频帮你理解对方。先建立同理心再谈数字。", prompts: ["帮我准备加薪谈判", "怎么用标注化解对方的顾虑？", "市场行情是多少，怎么锚定？"] },
  { t: "客户不够多 / 管道空了", p: 4, s: null, l: "管道建设", pillar: 0, w: "狂热开发的 30 天法则：管道数学、黄金时间、多渠道、开发区块。开发是每天的事。", prompts: ["帮我算管道数学，每天需要多少开发动作？", "设计我的每日开发作战计划", "管道空了怎么快速补充？"] },
  { t: "怎么写开发邮件 / 冷邮件", p: 4, s: 1, l: "开发邮件", pillar: 0, w: "狂热开发的多渠道节奏，挑战者的教学式开发信——不是推销，是分享对客户有价值的内容。", prompts: ["帮我写一封开发邮件", "设计 7 次触达的跟进节奏", "开发信怎么写出价值感？"] },
  { t: "帮我写销售提案 / 方案", p: 3, s: 1, l: "销售提案", pillar: 1, w: "差距销售提供提案框架：现状→差距→期望→方案→投资回报。挑战者增加重构和教学。", prompts: ["帮我写一份销售提案框架", "客户的差距怎么量化呈现？", "方案书的结构怎么设计？"] },
  { t: "怎么说服老板 / 推动内部决策", p: 5, s: 2, l: "内部说服", pillar: 3, w: "Pink 的 ABC：调频理解对方关心什么，清晰帮其发现问题。Voss 的校准问题化解阻力。", prompts: ["帮我准备向老板的提案", "怎么让老板看到他没注意到的问题？", "对方推脱时用什么问题回应？"] },
  { t: "销售团队能力怎么提升", p: 1, s: 0, l: "团队培训", pillar: 2, w: "挑战者销售帮团队从关系型转向挑战者型。SPIN 作为具体提问工具。", prompts: ["怎么让销售团队学会挑战者方法？", "设计 SPIN 话术培训", "团队转型计划"] },
  { t: "客户犹豫不决不推进", p: 0, s: 3, l: "推动决策", pillar: 1, w: "SPIN 的 I 问题放大紧迫感，差距销售量化等待成本。让客户看到不行动的代价。", prompts: ["客户一直不拍板，怎么推进？", "帮我把拖延的成本算给客户看", "设计放大紧迫感的提问"] },
  { t: "跟进客户但总没下文", p: 4, s: 2, l: "跟进策略", pillar: 0, w: "狂热开发的跟进节奏（7 次触达），Voss 的标注和校准问题重启对话。", prompts: ["客户不回复，设计跟进节奏", "怎么用标注重启沉默的客户？", "多次触达的话术模板"] },
  { t: "怎么处理客户投诉 / 冲突", p: 2, s: 5, l: "冲突调解", pillar: 2, w: "Voss 的标注先化解情绪，Pink 的调频理解对方。先让对方说'没错'再谈方案。", prompts: ["客户投诉了，怎么沟通？", "设计冲突调解的对话策略", "对方很生气怎么应对？"] },
  { t: "怎么做好产品介绍 / pitch", p: 5, s: 1, l: "产品推介", pillar: 3, w: "Pink 的六种推介方式，挑战者的商业教学。先让客户看到问题再介绍方案。", prompts: ["帮我优化这段产品介绍", "用 Pixar 式帮我重写 pitch", "60 秒电梯演讲怎么写？"] },
  { t: "客户总是压价怎么办", p: 2, s: 1, l: "应对压价", pillar: 2, w: "Voss 的 Ackerman 和校准问题，挑战者的价值重构。不是降价是重塑价值认知。", prompts: ["客户一直压价怎么应对？", "设计'我怎么才能做到'的回应", "怎么重构客户对价值的理解？"] },
];

// ============================================================
// === DATA END ===
// ============================================================

export default function App() {
  const [view, setView] = useState("home");
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const [scene, setScene] = useState(null);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [qa, setQa] = useState(null);
  const [done, setDone] = useState(false);
  const [modalAns, setModalAns] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [wrongFwIds, setWrongFwIds] = useState([]);
  const order = useRef(null);
  const pillarRefs = useRef([null, null, null, null]);
  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(text);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };
  const INSTALL_CMD = SITE.installCmd;
  if (!order.current) order.current = [...Array(FW.length).keys()].sort(() => Math.random() - 0.5);

  const filtered = search ? FW.filter(f => (f.name + f.en + f.one + f.tags.join("")).toLowerCase().includes(search.toLowerCase())) : FW;
  const ACCENT = SITE.accentColor || "#e74c3c";
  const T = { bg: "#faf8f5", card: "#fff", border: "#e7e5e4", borderHover: "#d6d3d1", text: "#1c1917", textMuted: "#57534e", textDim: "#78716c", textFaint: "#a8a29e", codeBg: "#f5f5f4", accent: ACCENT, modalOverlay: "rgba(0,0,0,0.4)" };
  const s = { card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", cursor: "pointer", transition: "all .15s", marginBottom: 8 }, tag: { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, background: T.codeBg, color: T.textDim, marginRight: 5 } };

  // 动态渐变：按 PYRAMID 颜色分布
  const diagnoseGradient = PYRAMID.map((p, i) => p.color + " " + (i / (PYRAMID.length - 1) * 100) + "%").join(", ");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif", fontSize: 14 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div onClick={() => { setView("home"); setScene(null); }} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 19, fontWeight: 400, color: T.text }}>Books to Skill</span>
              <span style={{ ...s.tag, background: ACCENT + "18", color: ACCENT, border: `1px solid ${ACCENT}40` }}>{SITE.subtitle}</span>
            </div>
            <div style={{ fontSize: 12, color: T.textDim }}>{FW.length} 个经典框架 · {FW.length} 本畅销书 · 让 AI 拥有顾问级能力</div>
          </div>
          <a href="/" style={{ fontSize: 12, color: ACCENT, textDecoration: "none", marginTop: 6, display: "inline-block", fontWeight: 500 }}>← 返回门户</a>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
          {[["首页", "home"], ["浏览", "browse"], ["诊断", "diagnose"], ["测试", "quiz"]].map(([lb, v]) => (
            <div key={v} onClick={() => { setView(v); setScene(null); setQi(0); setScore(0); setQa(null); setDone(false); setWrongFwIds([]); order.current = [...Array(FW.length).keys()].sort(() => Math.random() - 0.5); }}
              style={{
                padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: view === v ? 700 : 500, color: view === v ? T.text : T.textDim,
                borderBottom: view === v ? `2px solid ${ACCENT}` : "2px solid transparent",
                marginBottom: -1, transition: "all .15s"
              }}
              onMouseEnter={e => { if (view !== v) e.currentTarget.style.color = T.textMuted; }}
              onMouseLeave={e => { if (view !== v) e.currentTarget.style.color = T.textDim; }}>
              {lb}
            </div>
          ))}
        </div>

        {/* HOME */}
        {view === "home" && <>
          <div style={{ textAlign: "center", padding: "32px 0 36px", marginBottom: 8 }}>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "-0.02em", marginBottom: 14 }}>{SITE.title}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: ACCENT, marginBottom: 6, letterSpacing: "0.02em" }}>{SITE.slogan}</div>
            <div style={{ fontSize: 13, color: T.textDim }}>{SITE.description}</div>
          </div>

          <div style={{ background: ACCENT + "12", borderRadius: 16, padding: "24px 20px", border: `1px solid ${ACCENT}30`, marginBottom: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>让你的龙虾一键安装</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>把下面这行发给你的 Agent，让它执行</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <code style={{ flex: 1, minWidth: 200, padding: "14px 18px", background: T.codeBg, borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: "ui-monospace,monospace", color: ACCENT }}>{INSTALL_CMD}</code>
              <button onClick={() => copyPrompt(INSTALL_CMD)} style={{ padding: "12px 20px", background: copiedIdx === INSTALL_CMD ? "#ea580c" : ACCENT, color: "#000", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0 }}>{copiedIdx === INSTALL_CMD ? "已复制" : "复制"}</button>
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 10 }}>（还未发布仅供演示）</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>本 Skill 包含</div>
          <div style={{ background: T.card, borderRadius: 12, padding: "18px 20px", border: `1px solid ${T.border}`, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>{FW.length} 本必读经典提炼</span> — 可执行框架</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>{PYRAMID.length} 支柱全链路</span> — {PYRAMID.map(p => p.pillar).join("→")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>说任务即匹配</span> — {SCENES.length} 个场景全覆盖</div>
              </div>
            </div>
            <div onClick={() => setView("browse")} style={{ fontSize: 12, color: ACCENT, cursor: "pointer", marginTop: 14, fontWeight: 600 }}>去浏览查看详情 →</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>使用场景</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 24 }}>
            {SITE.personas.map((p, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 14px", background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, borderLeft: `4px solid ${p.color}`, transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "60"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>使用方法</div>
          <div style={{ position: "relative", paddingLeft: 0 }}>
            <div style={{ position: "absolute", left: 27, top: 28, bottom: 28, width: 2, background: `linear-gradient(180deg,${SITE.usageSteps.map((m,i)=>m.color+" "+(i/(SITE.usageSteps.length-1)*100)+"%").join(", ")})`, borderRadius: 1 }} />
            {SITE.usageSteps.map((m, i) => (
              <div key={i} style={{ position: "relative", display: "flex", gap: 14, padding: "16px 18px 16px 56px", marginBottom: i < 2 ? 12 : 0, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, borderLeft: `4px solid ${m.color}`, transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: m.color, border: `3px solid ${T.bg}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", zIndex: 1 }}>{(m.step != null) ? m.step : i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>{m.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    {m.examples.map((ex, j) => (
                      <code key={j} style={{ padding: "4px 10px", background: T.codeBg, borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 11, fontFamily: "ui-monospace,monospace", color: ACCENT }}>「{ex}」</code>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.textDim }}><span style={{ color: m.color }}>→</span> {m.result}</div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* BROWSE */}
        {view === "browse" && <>
          <input placeholder="搜索方法论、作者、关键词..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "11px 16px", borderRadius: 10, background: T.card, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, outline: "none", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {PYRAMID.map((p, pi) => {
              const hasMatch = p.ids.some(id => filtered.some(f => f.id === id));
              if (!hasMatch) return null;
              return (
                <div key={pi} onClick={() => document.getElementById("browse-pillar-" + pi)?.scrollIntoView({ behavior: "smooth" })}
                  style={{ padding: "8px 14px", borderRadius: 8, background: p.color + "18", border: `1px solid ${p.color}40`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: p.color, transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = p.color + "25"; e.currentTarget.style.borderColor = p.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.color + "18"; e.currentTarget.style.borderColor = p.color + "40"; }}>
                  {pi + 1}. {p.pillar}
                </div>
              );
            })}
          </div>
          {PYRAMID.map((p, pi) => {
            const ids = p.ids.filter(id => filtered.some(f => f.id === id));
            if (!ids.length) return null;
            return (
              <div key={pi} id={"browse-pillar-" + pi} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, borderLeft: `4px solid ${p.color}`, paddingLeft: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: p.color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{pi + 1}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.pillar}</div>
                    <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ids.map(id => {
                    const fw = FW.find(f => f.id === id) || FW[id];
                    return (
                      <div key={fw.id} onClick={() => { setSel(fw); setModalAns(null); }} style={{ ...s.card, borderLeft: `4px solid ${p.color}` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "60"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "space-between" }}>
                          <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{fw.name} <span style={{ fontWeight: 400, fontSize: 12, color: T.textDim }}>{fw.en}</span></div>
                            <div style={{ fontSize: 11, color: T.textDim, marginBottom: 6 }}>《{fw.book}》{fw.author} · {fw.year}</div>
                            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>{fw.one}</div>
                            <div>{fw.tags.map(t => <span key={t} style={{ ...s.tag, background: p.color + "18", color: p.color, border: `1px solid ${p.color}40` }}>{t}</span>)}</div>
                          </div>
                          {fw.coverId && <img src={`https://covers.openlibrary.org/b/id/${fw.coverId}-M.jpg`} alt="" style={{ width: 64, height: 96, objectFit: "cover", borderRadius: 8, flexShrink: 0, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!filtered.length && <div style={{ textAlign: "center", padding: 30, color: T.textDim }}>没有匹配结果</div>}
        </>}

        {/* DIAGNOSE */}
        {view === "diagnose" && !scene && <>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4, color: T.text }}>你现在面临什么问题？</div>
          <div style={{ color: T.textDim, fontSize: 12, marginBottom: 14 }}>按金字塔 {PYRAMID.length} 大支柱选择，快速找到对应方法论</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {PYRAMID.map((p, pi) => {
              const group = SCENES.filter(sc => sc.pillar === pi);
              if (!group.length) return null;
              return (
                <div key={pi} onClick={() => pillarRefs.current[pi]?.scrollIntoView({ behavior: "smooth" })}
                  style={{ padding: "8px 14px", borderRadius: 8, background: p.color + "20", border: `1px solid ${p.color}50`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: p.color, transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = p.color + "30"; e.currentTarget.style.borderColor = p.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.color + "20"; e.currentTarget.style.borderColor = p.color + "50"; }}>
                  {pi + 1}. {p.pillar}
                </div>
              );
            })}
          </div>
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div style={{ position: "absolute", left: 11, top: 16, bottom: 16, width: 3, background: `linear-gradient(180deg,${diagnoseGradient})`, borderRadius: 2 }} />
            {PYRAMID.map((p, pi) => {
              const group = SCENES.filter(sc => sc.pillar === pi);
              if (!group.length) return null;
              return (
                <div key={pi} ref={el => pillarRefs.current[pi] = el} style={{ position: "relative", marginBottom: 28, minHeight: 48 }}>
                  <div style={{ position: "absolute", left: 4, top: 12, width: 16, height: 16, borderRadius: "50%", background: p.color, border: `3px solid ${T.bg}`, boxSizing: "border-box", zIndex: 1 }} />
                  <div onClick={() => pillarRefs.current[pi]?.scrollIntoView({ behavior: "smooth" })}
                    style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer", transition: "all .15s", padding: "2px 0" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                    <span style={{ position: "relative", zIndex: 1, width: 36, height: 36, borderRadius: 10, background: p.color, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${T.bg}`, flexShrink: 0 }}>{pi + 1}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.pillar}</div>
                      <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    {pi < PYRAMID.length - 1 && <span style={{ marginLeft: "auto", fontSize: 18, color: p.color + "80", flexShrink: 0 }}>↓</span>}
                  </div>
                  <div style={{ marginLeft: 48 }}>
                    {group.map((sc, i) => (
                      <div key={i} onClick={() => setScene(sc)} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${p.color}` }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderLeftColor = p.color; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderLeftColor = p.color + "60"; }}>
                        <div><div style={{ fontWeight: 600, marginBottom: 3, color: T.text }}>{sc.t}</div><span style={{ ...s.tag, background: p.color + "18", color: p.color, border: "1px solid " + p.color + "40" }}>{sc.l}</span></div>
                        <span style={{ color: T.textFaint, fontSize: 14 }}>→</span>
                      </div>
                    ))}
                  </div>
                  {pi < PYRAMID.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: -12 }}>
                      <span style={{ fontSize: 20, color: T.textFaint }}>↓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>}
        {view === "diagnose" && scene && <>
          <div onClick={() => setScene(null)} style={{ color: T.textDim, cursor: "pointer", fontSize: 12, marginBottom: 14 }}>← 重新选择</div>
          <div style={{ background: T.card, borderRadius: 12, padding: "16px 18px", border: `1px solid ${T.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4 }}>你的问题</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>「{scene.t}」</div>
          </div>
          <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginBottom: 6 }}>首选方法论</div>
          <div onClick={() => { setSel(FW.find(f => f.id === scene.p) || FW[scene.p]); setModalAns(null); }} style={{ ...s.card, borderLeft: `4px solid ${FW.find(f => f.id === scene.p).color}` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = FW.find(f => f.id === scene.p).color + "60"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", gap: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: FW.find(f => f.id === scene.p).color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 700, color: T.text }}>{FW.find(f => f.id === scene.p).name}</div><div style={{ fontSize: 12, color: T.textMuted }}>{FW.find(f => f.id === scene.p).one}</div></div></div>
          </div>
          {scene.s !== null && <>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, marginBottom: 6, marginTop: 10 }}>补充配合</div>
            <div onClick={() => { setSel(FW.find(f => f.id === scene.s)); setModalAns(null); }} style={{ ...s.card, padding: "14px 18px", borderLeft: `4px solid ${FW.find(f => f.id === scene.s).color}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = FW.find(f => f.id === scene.s).color + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ display: "flex", gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: FW.find(f => f.id === scene.s).color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{FW.find(f => f.id === scene.s).name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{FW.find(f => f.id === scene.s).one}</div></div></div>
            </div>
          </>}
          <div style={{ marginTop: 16, padding: "14px 16px", background: ACCENT + "12", borderRadius: 10, border: `1px solid ${ACCENT}30` }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginBottom: 3 }}>为什么推荐？</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>{scene.w}</div>
          </div>
          {scene.prompts && <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, marginBottom: 8 }}>试试对你的 AI 说（prompt建议）</div>
            {scene.prompts.map((pr, i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "10px 14px", background: T.card, borderRadius: 8, marginBottom: 5, border: `1px solid ${T.border}`, lineHeight: 1.5, cursor: "default" }}>
              <span style={{ color: T.textDim, marginRight: 6 }}>▸</span>{pr}
            </div>)}
          </div>}
        </>}

        {/* QUIZ */}
        {view === "quiz" && !done && (() => {
          const fw = FW[order.current[qi]];
          return <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div><div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>{SITE.subtitle}测试</div><div style={{ fontSize: 11, color: T.textDim }}>{FW.length}道题 · 选完可看解析</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{score}<span style={{ fontSize: 12, color: T.textDim }}>/{FW.length}</span></div><div style={{ fontSize: 11, color: T.textDim }}>当前得分</div></div>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
              {order.current.map((fwId, i) => {
                const isCurrent = i === qi, isPast = i < qi;
                const wasWrong = isPast && wrongFwIds.includes(fwId);
                let dotBg = T.border, dotColor = T.textDim;
                if (isCurrent) { dotBg = fw.color + "30"; dotColor = fw.color; }
                else if (isPast) { dotBg = wasWrong ? "#ef444420" : "#e74c3c20"; dotColor = wasWrong ? "#ef4444" : "#e74c3c"; }
                return <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: dotBg, color: dotColor, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>;
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "12px 14px", background: T.card, borderRadius: 10, border: `1px solid ${fw.color}40` }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: fw.color, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{PYRAMID.findIndex(p => p.ids.includes(fw.id)) + 1 || 0}</span>
              <div><div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{fw.name}</div><div style={{ fontSize: 11, color: T.textDim }}>{fw.en}</div></div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, lineHeight: 1.5, color: T.text }}>{fw.q}</div>
            {fw.opts.map((o, i) => {
              const picked = qa === i, show = qa !== null;
              let bg = T.card, bd = T.border;
              if (show && picked) { bg = o.c ? "#e74c3c12" : "#ef444412"; bd = o.c ? "#e74c3c50" : "#ef444450"; }
              else if (show && o.c) { bg = "#e74c3c10"; bd = "#e74c3c40"; }
              return <div key={i} style={{ marginBottom: 5 }}>
                <div onClick={() => { if (qa === null) { setQa(i); if (o.c) setScore(s => s + 1); } }}
                  style={{ padding: "11px 14px", borderRadius: 10, cursor: show ? "default" : "pointer", background: bg, border: `1px solid ${bd}`, fontSize: 13, transition: "all .15s", color: T.text }}>
                  {o.t}{show && o.c ? " ✓" : ""}{show && picked && !o.c ? " ✗" : ""}
                </div>
                {show && (picked || o.c) && <div style={{ fontSize: 11, color: T.textMuted, padding: "6px 14px 0" }}>{o.e}</div>}
                {show && picked && !o.c && <div onClick={() => setSel(fw)} style={{ fontSize: 11, color: fw.color, cursor: "pointer", padding: "6px 14px 0", fontWeight: 600 }}>→ 查看该方法论详情</div>}
              </div>;
            })}
            {qa !== null && <button onClick={() => {
              const pickedCorrect = fw.opts[qa].c;
              if (!pickedCorrect) setWrongFwIds(prev => [...prev, fw.id]);
              if (qi < FW.length - 1) { setQi(q => q + 1); setQa(null); } else setDone(true);
            }}
              style={{ marginTop: 16, padding: "11px 0", borderRadius: 10, background: ACCENT, color: "#000", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", width: "100%" }}>{qi < FW.length - 1 ? "下一题 →" : "查看结果"}</button>}
          </>;
        })()}

        {view === "quiz" && done && <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", color: T.text, marginBottom: 6 }}>{score >= FW.length - 1 ? SITE.subtitle + "大师" : score >= Math.ceil(FW.length * 0.67) ? "进阶玩家" : score >= Math.ceil(FW.length * 0.44) ? "学徒" : "新手"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: T.text }}>{score}<span style={{ fontSize: 16, color: T.textDim }}>/{FW.length}</span></div>
          <div style={{ fontSize: 15, fontWeight: 700, margin: "6px 0", color: score >= FW.length - 1 ? ACCENT : score >= Math.ceil(FW.length * 0.67) ? ACCENT : "#e67e22" }}>{score >= FW.length - 1 ? "已掌握精髓" : score >= Math.ceil(FW.length * 0.67) ? "基础扎实" : score >= Math.ceil(FW.length * 0.44) ? "继续加油" : "建议多浏览"}</div>
          <div style={{ color: T.textDim, fontSize: 12, marginBottom: 20 }}>{score >= FW.length - 1 ? "下一步实战运用。" : score >= Math.ceil(FW.length * 0.67) ? "复习答错的理论。" : "建议从浏览模式开始了解。"}</div>
          {wrongFwIds.length > 0 && <div style={{ textAlign: "left", marginBottom: 20, padding: "14px 18px", background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>建议复习以下方法论</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[...new Set(wrongFwIds)].map(id => {
                const f = FW.find(x => x.id === id) || FW[id];
                return <div key={id} onClick={() => setSel(f)} style={{ padding: "8px 14px", borderRadius: 8, background: f.color + "18", border: `1px solid ${f.color}40`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: f.color }}
                  onMouseEnter={e => { e.currentTarget.style.background = f.color + "25"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = f.color + "18"; }}>{f.name}</div>;
              })}
            </div>
          </div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setQi(0); setScore(0); setQa(null); setDone(false); setWrongFwIds([]); order.current = [...Array(FW.length).keys()].sort(() => Math.random() - 0.5); }}
              style={{ padding: "10px 24px", borderRadius: 10, background: T.card, color: T.text, fontSize: 13, fontWeight: 600, border: `1px solid ${T.border}`, cursor: "pointer" }}>再测一次</button>
            <button onClick={() => setView("browse")} style={{ padding: "10px 24px", borderRadius: 10, background: ACCENT, color: "#000", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>去学习</button>
          </div>
        </div>}
      </div>

      {/* MODAL */}
      {sel && <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: T.modalOverlay, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99, padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, maxWidth: 600, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "28px 24px", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {sel.coverId ? (
                <img src={`https://covers.openlibrary.org/b/id/${sel.coverId}-M.jpg`} alt="" style={{ width: 72, height: 108, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }} />
              ) : null}
              <span style={{ width: 72, height: 108, display: sel.coverId ? "none" : "flex", alignItems: "center", justifyContent: "center", background: T.codeBg, borderRadius: 8, fontSize: 32, flexShrink: 0, border: `1px solid ${T.border}` }}>{sel.emoji || sel.name?.[0] || "?"}</span>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{sel.name}</div><div style={{ color: T.textDim, fontSize: 12 }}>《{sel.book}》{sel.author} · {sel.year}</div></div>
            </div>
            <span onClick={() => setSel(null)} style={{ cursor: "pointer", color: T.textDim, fontSize: 18, padding: "4px 8px" }}>✕</span>
          </div>
          <div style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.8, padding: 14, background: T.codeBg, borderRadius: 10, borderLeft: `4px solid ${sel.color}`, marginBottom: 20 }}>{sel.idea}</div>

          <div style={{ fontWeight: 700, marginBottom: 10, color: T.text }}>核心框架</div>
          {sel.steps.map((st, i) => <div key={i} style={{ display: "flex", gap: 10, padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 5 }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: sel.color + "22", color: sel.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: T.text }}>{st.n}</div><div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>{st.d}</div></div>
          </div>)}

          <div style={{ fontWeight: 700, margin: "18px 0 8px", color: T.text }}>常见误区</div>
          {sel.traps.map((t, i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "7px 12px", background: "#fef2f2", borderRadius: 6, borderLeft: "2px solid #ef4444", marginBottom: 4 }}>{t}</div>)}

          {sel.combos && (
            <>
              <div style={{ fontWeight: 700, margin: "18px 0 8px", color: T.text }}>组合使用</div>
              {sel.combos.map((c, i) => (
                <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "10px 14px", background: T.codeBg, borderRadius: 8, marginBottom: 5, lineHeight: 1.6, border: `1px solid ${T.border}` }}>
                  <span style={{ fontWeight: 600, color: sel.color }}>{sel.name} + {c.with}</span>
                  <span style={{ color: T.textDim }}> — {c.how}</span>
                </div>
              ))}
            </>
          )}

          <div style={{ background: T.codeBg, borderRadius: 12, padding: 18, marginTop: 18, border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: T.text }}>小测试</div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: T.text }}>{sel.q}</div>
            {sel.opts.map((o, i) => {
              const picked = modalAns === i, show = modalAns !== null;
              let bg = T.card, bd = T.border;
              if (show && picked) { bg = o.c ? "#e74c3c12" : "#ef444412"; bd = o.c ? "#e74c3c50" : "#ef444450"; }
              else if (show && o.c) { bg = "#e74c3c10"; bd = "#e74c3c40"; }
              return <div key={i} style={{ marginBottom: 5 }}>
                <div onClick={() => { if (modalAns === null) setModalAns(i); }}
                  style={{ padding: "10px 14px", borderRadius: 8, cursor: show ? "default" : "pointer", background: bg, border: `1px solid ${bd}`, fontSize: 13, transition: "all .15s", color: T.text }}>
                  {o.t}{show && o.c ? " ✓" : ""}{show && picked && !o.c ? " ✗" : ""}
                </div>
                {show && (picked || o.c) && <div style={{ fontSize: 11, color: T.textMuted, padding: "3px 14px" }}>{o.e}</div>}
              </div>;
            })}
          </div>
        </div>
      </div>}
    </div>
  );
}

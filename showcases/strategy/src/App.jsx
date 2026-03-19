import { useState, useRef } from "react";

// 战略金字塔：看清局势 → 找到方向 → 制定战略
const PYRAMID = [
  { pillar: "看清局势", desc: "行业赚不赚？竞争多惨？会被颠覆吗？", color: "#3498db", emoji: "🔍", ids: [0, 3] },   // 五力、颠覆式创新
  { pillar: "找到方向", desc: "差异化在哪？新市场在哪？护城河在哪？", color: "#2ecc71", emoji: "🎯", ids: [1, 4] },  // 蓝海、从0到1
  { pillar: "制定战略", desc: "战略怎么写？怎么选？怎么对齐？", color: "#9b59b6", emoji: "📋", ids: [2, 5] },   // 好战略、战略选择级联
];

const FW = [
  { id: 0, name: "五力模型 + 三大通用战略", en: "Competitive Strategy", emoji: "⚔️", book: "Competitive Strategy", author: "Michael Porter", year: 1980, color: "#3498db", coverId: 19091, // Open Library ✓
    one: "看清行业赚不赚钱，选一个能赢的竞争姿势", tags: ["行业分析", "竞争格局"],
    idea: "分析行业不只是看现有对手，而是五股力量的综合博弈。看清后选一个姿势：成本领先、差异化或聚焦。不要卡在中间。",
    steps: [
      { n: "五力分析", d: "逐一分析：现有竞争强度、新进入者威胁、替代品威胁、买方议价、供方议价。找出决定行业命运的1-2股关键力量。" },
      { n: "综合判断", d: "五力越强，行业利润越薄。判断行业吸引力：进不进？如果进，从哪个角度切入？" },
      { n: "三大战略选择", d: "成本领先（规模大、价格敏感）、差异化（独特价值、溢价能力）、聚焦（细分市场、集中兵力）。选一个意味着放弃另外两个。" },
      { n: "避免卡在中间", d: "既不是最便宜也不是最独特，最危险。检查是否'既要又要'。" },
    ],
    traps: ["把五力当清单填空不分析", "以为差异化就是品质好", "忽视替代品这一力", "分析完不做选择"],
    combos: [
      { with: "蓝海战略", how: "五力看清红海格局，如果五力都很强，用蓝海四步动作跳出去" },
      { with: "好战略坏战略", how: "五力分析对应Rumelt的'诊断'环节，为战略内核提供输入" },
      { with: "战略选择级联", how: "Porter回答行业长什么样，Playing to Win回答具体怎么选" },
    ],
    q: "五力模型分析完后，最关键的一步是？",
    opts: [
      { t: "把五力逐条填完即可", c: false, e: "填完不分析等于没做" },
      { t: "找出最关键的1-2股力量并做出战略选择", c: true, e: "分析是手段，选择是目的" },
      { t: "关注现有竞争对手就够了", c: false, e: "替代品、新进入者同样重要" },
      { t: "选成本领先和差异化一起做", c: false, e: "卡在中间最危险" },
    ],
  },
  { id: 1, name: "蓝海战略", en: "Blue Ocean Strategy", emoji: "🌊", book: "Blue Ocean Strategy", author: "W. Chan Kim & Renée Mauborgne", year: 2005, color: "#2ecc71", coverId: 15103376,
    one: "跳出红海竞争，创造没人争的新市场空间", tags: ["差异化突破", "新市场开拓"],
    idea: "不在现有维度上做得比别人好一点，而是重新定义竞争维度。四步动作：消除、减少、增加、创造。消除和减少同样重要。",
    steps: [
      { n: "战略画布", d: "列出行业竞争的6-8个关键要素，画出你和对手的价值曲线。大家曲线相似=红海。" },
      { n: "四步动作 ERRC", d: "消除（哪些要素可去掉）、减少（可降到标准以下）、增加（提到标准以上）、创造（全新要素）。消除+减少降成本，增加+创造提价值。" },
      { n: "非客户视角", d: "蓝海机会在非客户身上。第一层边缘用户、第二层拒绝型、第三层未探索。不抢现有客户，扩大市场。" },
      { n: "价值创新", d: "同时为买方创造更高价值+降低企业成本。不是花更多钱做差异化。" },
    ],
    traps: ["只做加法不做减法", "盯着现有客户找蓝海", "把蓝海等于技术创新", "战略画布画了但不用"],
    combos: [
      { with: "竞争战略", how: "先用五力看清红海有多惨，再用蓝海四步动作跳出去" },
      { with: "从0到1", how: "蓝海提供工具（战略画布、ERRC），Zero to One提供思维（垄断、逆向思考）" },
      { with: "颠覆式创新", how: "颠覆选进入点（低端/新市场），蓝海重新定义价值组合" },
    ],
    q: "真正的蓝海战略必须同时包含？",
    opts: [
      { t: "增加和创造——更多更好的功能", c: false, e: "只有加法会成本飙升" },
      { t: "消除、减少、增加、创造——四步动作齐全", c: true, e: "消除和减少降成本，才能支撑增加和创造" },
      { t: "比竞争对手更好的产品", c: false, e: "这是红海思维" },
      { t: "技术创新或发明专利", c: false, e: "蓝海是价值组合创新，不一定是技术" },
    ],
  },
  { id: 2, name: "战略内核", en: "Good Strategy Bad Strategy", emoji: "🧠", book: "Good Strategy Bad Strategy", author: "Richard Rumelt", year: 2011, color: "#9b59b6", coverId: 6954850,
    one: "分辨真伪战略，用最简结构写出好战略", tags: ["战略制定", "战略评估"],
    idea: "好战略只有三部分：诊断（核心挑战是什么）、指导方针（总体怎么应对）、连贯行动（具体做哪几件互配的事）。坏战略有四标志：空话、回避挑战、目标当战略、目标矛盾。",
    steps: [
      { n: "诊断 Diagnosis", d: "把复杂局面简化为一个清晰的问题定义。不是列出所有问题，而是找到解开后其他迎刃而解的那个关键问题。" },
      { n: "指导方针 Guiding Policy", d: "总体应对方法，有取舍。明确'做什么'的同时暗示'不做什么'，起到聚焦作用。" },
      { n: "连贯行动 Coherent Actions", d: "3-5个具体行动，互相配合增强。不是零散To-do，关键词是'连贯'。" },
      { n: "坏战略检查", d: "空话连篇？回避挑战？把目标当战略？目标太多互相矛盾？" },
    ],
    traps: ["把愿景当战略", "不做诊断就开药方", "行动互相矛盾", "战略重点太多等于没有重点"],
    combos: [
      { with: "竞争战略", how: "五力分析为诊断提供工具，战略内核把洞察转化为行动" },
      { with: "战略选择级联", how: "Rumelt判断好不好，Lafley结构化怎么选" },
      { with: "从0到1", how: "Thiel的逆向问题可成为诊断起点" },
    ],
    q: "以下哪个是战略而非目标？",
    opts: [
      { t: "我们的战略是成为行业第一", c: false, e: "这是目标，没说怎么去" },
      { t: "核心挑战是供应链不稳，应对方法是建区域仓+双供应商，具体行动是Q2前签约2家、Q3启用华东仓", c: true, e: "诊断-方针-行动完整" },
      { t: "我们致力于以客户为中心的协同创新", c: false, e: "空话连篇" },
      { t: "今年要完成15个战略重点", c: false, e: "重点太多等于没有重点" },
    ],
  },
  { id: 3, name: "颠覆式创新", en: "Disruptive Innovation", emoji: "⚡", book: "The Innovator's Dilemma", author: "Clayton Christensen", year: 1997, color: "#e74c3c", coverId: 9274687,
    one: "理解大公司为何被小公司打败，设计进攻/防守策略", tags: ["创新战略", "威胁评估"],
    idea: "大公司被颠覆不是管理差，恰恰是管理太好。价值网络决定了'什么有价值'的判断，颠覆性产品初期看起来没价值。两条路径：低端颠覆、新市场颠覆。",
    steps: [
      { n: "区分两种创新", d: "延续性（更快更好更贵，大公司擅长）vs 颠覆式（更简单更便宜更方便，小公司武器）。新产品一上来就更好更贵=延续性。" },
      { n: "识别过度服务", d: "产品性能是否已超过大部分用户需求？过度服务是颠覆的温床。" },
      { n: "找颠覆路径", d: "低端颠覆：服务被过度服务的人；新市场颠覆：服务非消费者（用不起/不会用）。" },
      { n: "价值网络理解", d: "在位者的客户、供应商、投资者决定了什么'值得做'。颠覆性产品在他们眼里没价值，所以理性地不反应。" },
    ],
    traps: ["把所有创新都叫颠覆", "只看技术不看价值网络", "低估在位者组织惯性", "以为小公司就是颠覆者"],
    combos: [
      { with: "竞争战略", how: "五力是静态快照，颠覆理论是动态预测" },
      { with: "蓝海战略", how: "非客户分析和非消费者高度对应" },
      { with: "从0到1", how: "都强调从边缘/小市场切入" },
    ],
    q: "大公司为什么经常'看不到'颠覆威胁？",
    opts: [
      { t: "管理者能力不足", c: false, e: "恰恰因为管理太好、听客户的话" },
      { t: "颠覆性产品在价值网络里看起来没价值——市场小、利润低、客户不要", c: true, e: "理性决策让他们忽略" },
      { t: "技术壁垒太高", c: false, e: "很多大公司有技术能力，是价值网络不允许" },
      { t: "颠覆是突然发生的", c: false, e: "颠覆是缓慢过程，早期完全有时间反应" },
    ],
  },
  { id: 4, name: "从0到1", en: "Zero to One", emoji: "🚀", book: "Zero to One", author: "Peter Thiel", year: 2014, color: "#f39c12", coverId: 9002334,
    one: "创造全新事物，建立垄断级壁垒", tags: ["创业评估", "护城河设计"],
    idea: "竞争是失败者的事，垄断才是目标。逆向问题：什么是你相信但别人不同意的重要真相？垄断四特征：专有技术、网络效应、规模经济、品牌。先垄断小市场再扩展。",
    steps: [
      { n: "逆向思考", d: "什么是你相信但别人不同意的重要真相？如果所有人都同意就没有超额机会。" },
      { n: "10x 标准", d: "在某个关键维度比第二名好10倍（不是10%）。量级差距才够。" },
      { n: "垄断四特征", d: "专有技术、网络效应、规模经济、品牌。至少要有一个可建立的路径。" },
      { n: "小市场垄断", d: "先垄断一个小市场，再向相邻市场扩展。不要一上来就进大市场。" },
    ],
    traps: ["把逆向理解为唱反调", "执着于大市场", "10%改进伪装成10x", "混淆先发优势和垄断"],
    combos: [
      { with: "颠覆式创新", how: "都强调从小市场/边缘切入" },
      { with: "好战略坏战略", how: "逆向问题可成为诊断起点" },
      { with: "蓝海战略", how: "都关注创造新市场" },
    ],
    q: "Thiel 说的「10x」意味着？",
    opts: [
      { t: "产品比竞品好10%", c: false, e: "10%的好用户没动力切换" },
      { t: "在某个关键维度有量级优势——价格低10倍、速度快10倍等", c: true, e: "量级差距才够" },
      { t: "市场份额达到10%", c: false, e: "与10x概念无关" },
      { t: "先进入市场就有优势", c: false, e: "先发≠垄断" },
    ],
  },
  { id: 5, name: "战略选择级联", en: "Playing to Win", emoji: "📋", book: "Playing to Win", author: "Lafley & Martin", year: 2013, color: "#8e44ad", coverId: 14507238,
    one: "五层问题把战略从口号变成可执行计划", tags: ["战略规划", "战略对齐"],
    idea: "战略是一组选择不是一份计划。五个问题环环相扣：赢的愿望、在哪里竞争、如何赢、核心能力、管理系统。Where to Play 和 How to Win 决定80%质量。",
    steps: [
      { n: "赢的愿望", d: "不是空泛使命，是'在什么维度上赢'。赢的定义要具体。" },
      { n: "在哪里竞争 Where to Play", d: "客户、产品、地理、渠道、价值链环节。要能说出'谁不是我们的客户'。" },
      { n: "如何赢 How to Win", d: "成本领先还是差异化？具体竞争优势是什么？别人为什么做不到？" },
      { n: "核心能力", d: "必须拥有的3-5个关键能力。没有这些就赢不了。" },
      { n: "管理系统", d: "流程、组织、工具支撑能力建设。能力不会凭空产生。" },
    ],
    traps: ["赢的愿望=使命声明", "Where to Play太宽", "How to Win没有门槛", "忽略第4-5层"],
    combos: [
      { with: "竞争战略", how: "Porter帮你做更好的Where to Play和How to Win决策" },
      { with: "好战略坏战略", how: "级联做出选择，Rumelt检验质量" },
      { with: "从0到1", how: "逆向思考帮你找到非共识的Where to Play" },
    ],
    q: "战略选择级联中最核心的两层是？",
    opts: [
      { t: "赢的愿望和管理系统", c: false, e: "首尾重要但非核心" },
      { t: "在哪里竞争和如何赢", c: true, e: "决定80%战略质量" },
      { t: "核心能力和赢的愿望", c: false, e: "能力支撑打法，愿景是起点" },
      { t: "管理系统和核心能力", c: false, e: "是执行层不是选择层" },
    ],
  },
];

const SCENES = [
  // 看清局势
  { t: "帮我分析XX行业 / 这个赛道怎么样？", p: 0, s: 3, l: "行业分析", pillar: 0, w: "五力分析帮你看清行业赚不赚钱、竞争多惨烈。颠覆理论帮你判断动态威胁——有没有人在从低端或边缘杀进来。", prompts: ["帮我分析新能源汽车行业的竞争格局", "这个赛道值不值得进？用五力帮我看看", "XX行业有没有颠覆风险？"] },
  { t: "竞争对手在干什么 / 竞品分析", p: 0, s: 1, l: "竞品分析", pillar: 0, w: "五力分析对手所在环境，判断对手的战略类型。蓝海的战略画布可以对比你和竞品的价值曲线。", prompts: ["用五力帮我分析XX竞品的战略", "竞品有ABC，我们怎么做出区隔？", "画出我们和主要竞品的战略画布"] },
  { t: "行业在被颠覆怎么办？新技术会替代我们吗？", p: 3, s: 1, l: "颠覆威胁", pillar: 0, w: "颠覆理论帮你判断威胁来自低端还是新市场，价值网络是否锁定了你的反应能力。蓝海帮你在颠覆中寻找新空间。", prompts: ["我们行业有没有颠覆式创新在发生？", "新技术XX会不会颠覆我们？帮我评估", "大公司如何应对颠覆威胁？"] },
  // 找到方向
  { t: "竞争太激烈了怎么办？价格战打不起", p: 1, s: 0, l: "竞争突围", pillar: 1, w: "红海里死磕没意义。蓝海四步动作帮你跳出——消除减少行业标配，增加创造新价值，重新定义竞争。", prompts: ["XX行业红海了，帮我找蓝海机会", "用ERRC框架重新设计我们的产品", "价格战打不起，怎么差异化？"] },
  { t: "想做差异化但不知道怎么做", p: 1, s: 4, l: "差异化", pillar: 1, w: "蓝海ERRC提供方法论，从0到1的逆向思考帮你找非共识方向。先画战略画布看行业在比什么，再问'什么是别人不信你信的'。", prompts: ["用蓝海战略帮我找差异化方向", "帮我做价值曲线分析", "什么是我们相信但别人不信的？"] },
  { t: "这个创业方向靠谱吗？要不要做这个项目？", p: 4, s: 3, l: "创业评估", pillar: 1, w: "从0到1的逆向问题、10x标准、垄断特征帮你评估。颠覆理论帮你判断进入路径——低端还是新市场。", prompts: ["帮我用Zero to One评估这个创业想法", "这个方向有护城河吗？", "怎么判断是不是从0到1？"] },
  { t: "怎么建护城河？竞争壁垒不够强", p: 4, s: 0, l: "护城河", pillar: 1, w: "Thiel的垄断四特征：专有技术、网络效应、规模经济、品牌。五力分析现有竞争格局，找准要防的威胁。", prompts: ["帮我评估公司的护城河强度", "怎么建立垄断级壁垒？", "我们最薄弱的竞争环节在哪？"] },
  { t: "公司增长放缓，需要新方向", p: 1, s: 3, l: "增长新曲线", pillar: 1, w: "蓝海找新市场空间，颠覆+从0到1找进入路径。先看清现有业务是否被颠覆，再找蓝海或新市场机会。", prompts: ["增长放缓了，帮我找新方向", "现有业务还有没有蓝海空间？", "新业务该怎么切入？"] },
  // 制定战略
  { t: "我们公司该怎么定战略？战略规划", p: 5, s: 2, l: "战略规划", pillar: 2, w: "战略选择级联把战略变成五层可执行选择。好战略坏战略帮你检验质量——诊断、方针、行动是否完整。", prompts: ["帮我们做战略选择级联", "年度战略规划该怎么做？", "用五层问题帮我们理清战略"] },
  { t: "这个战略好不好？帮我看看我们的战略", p: 2, s: 5, l: "战略评估", pillar: 2, w: "好战略坏战略的四标志帮你诊断——空话？回避挑战？目标当战略？级联帮你检查五层是否完整连贯。", prompts: ["帮我诊断这份战略文档的质量", "我们的战略有什么问题？", "战略内核完整吗？"] },
  { t: "战略方向模糊，想理清思路", p: 2, s: 5, l: "战略澄清", pillar: 2, w: "Rumelt帮你区分愿景和战略，诊断-方针-行动三步把模糊变清晰。级联的五层问题结构化你的选择。", prompts: ["我有个大方向但说不清战略，帮我澄清", "把我们的愿景变成可执行战略", "战略和目标的区别是什么？"] },
  { t: "团队对战略理解不一致", p: 5, s: 2, l: "战略对齐", pillar: 2, w: "级联是绝佳的对齐工具——让每人独立回答五层问题，对比分歧点，从上到下逐层达成共识。", prompts: ["团队对战略理解不一致，怎么对齐？", "用级联框架做战略共识工作坊", "我们Where to Play的分歧在哪？"] },
  { t: "新业务/新产品该怎么定位？", p: 1, s: 4, l: "新业务定位", pillar: 2, w: "蓝海+从0到1组合。蓝海找价值创新，从0到1找垄断路径和小市场切入点。五力做行业分析补充。", prompts: ["新业务该怎么定位？", "新产品进入XX市场用什么战略？", "帮新业务做战略选择级联"] },
  { t: "想进入一个被大公司垄断的市场", p: 3, s: 1, l: "市场进入", pillar: 2, w: "颠覆理论告诉你从低端或新市场切入，在位者'理性地'不会反应。蓝海帮你设计价值组合。", prompts: ["大公司垄断的XX市场，小公司怎么进？", "用颠覆理论设计进攻方案", "找过度服务的缝隙"] },
];

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
  const pillarRefs = useRef([null, null, null]);
  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(text);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };
  const INSTALL_CMD = "clawhub install strategy-playbook";
  if (!order.current) order.current = [...Array(6).keys()].sort(() => Math.random() - 0.5);

  const ACCENT = "#4a90d9";
  const filtered = search ? FW.filter(f => (f.name + f.en + f.one + f.tags.join("")).toLowerCase().includes(search.toLowerCase())) : FW;
  const T = { bg: "#faf8f5", card: "#fff", border: "#e7e5e4", borderHover: "#d6d3d1", text: "#1c1917", textMuted: "#57534e", textDim: "#78716c", textFaint: "#a8a29e", codeBg: "#f5f5f4", accent: ACCENT, modalOverlay: "rgba(0,0,0,0.4)" };
  const s = { card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", cursor: "pointer", transition: "all .15s", marginBottom: 8 }, tag: { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, background: T.codeBg, color: T.textDim, marginRight: 5 } };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif", fontSize: 14 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div onClick={() => { setView("home"); setScene(null); }} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 19, fontWeight: 400, color: T.text }}>Books to Skill</span>
              <span style={{ ...s.tag, background: ACCENT + "18", color: ACCENT, border: "1px solid " + ACCENT + "40" }}>战略方法论</span>
            </div>
            <div style={{ fontSize: 12, color: T.textDim }}>6 个经典框架 · 6 本战略必读 · 让 AI 拥有顾问级战略能力</div>
          </div>
          <a href="/" style={{ fontSize: 12, color: ACCENT, textDecoration: "none", marginTop: 6, display: "inline-block", fontWeight: 500 }}>← 返回门户</a>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
          {[["首页", "home"], ["浏览", "browse"], ["诊断", "diagnose"], ["测试", "quiz"]].map(([lb, v]) => (
            <div key={v} onClick={() => { setView(v); setScene(null); setQi(0); setScore(0); setQa(null); setDone(false); setWrongFwIds([]); order.current = [...Array(6).keys()].sort(() => Math.random() - 0.5); }}
              style={{
                padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: view === v ? 700 : 500, color: view === v ? T.text : T.textDim,
                borderBottom: view === v ? "2px solid " + ACCENT : "2px solid transparent",
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
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, fontWeight: 400, color: T.text, letterSpacing: "-0.02em", marginBottom: 14 }}>战略咨询方法论 Skill</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: ACCENT, marginBottom: 6, letterSpacing: "0.02em" }}>让 AI 开口就是战略顾问</div>
            <div style={{ fontSize: 13, color: T.textDim }}>6 本战略必读经典提炼 · 可执行框架</div>
          </div>

          <div style={{ background: ACCENT + "12", borderRadius: 16, padding: "24px 20px", border: "1px solid " + ACCENT + "30", marginBottom: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>让你的龙虾一键安装</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>把下面这行发给你的 Agent，让它执行</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <code style={{ flex: 1, minWidth: 200, padding: "14px 18px", background: T.codeBg, borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: "ui-monospace,monospace", color: ACCENT }}>{INSTALL_CMD}</code>
              <button onClick={() => copyPrompt(INSTALL_CMD)} style={{ padding: "12px 20px", background: copiedIdx === INSTALL_CMD ? "#22c55e" : ACCENT, color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0 }}>{copiedIdx === INSTALL_CMD ? "已复制" : "复制"}</button>
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 10 }}>（还未发布仅供演示）</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>本 Skill 包含</div>
          <div style={{ background: T.card, borderRadius: 12, padding: "18px 20px", border: `1px solid ${T.border}`, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>6 本战略必读经典提炼</span> — 可执行框架</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>3 支柱全链路</span> — 看清局势→找到方向→制定战略</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 6 }} />
                <div><span style={{ fontWeight: 600, color: T.text }}>说任务即匹配</span> — 行业分析、战略规划、差异化、护城河全覆盖</div>
              </div>
            </div>
            <div onClick={() => setView("browse")} style={{ fontSize: 12, color: ACCENT, cursor: "pointer", marginTop: 14, fontWeight: 600 }}>去浏览查看详情 →</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>使用场景</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 24 }}>
            {[
              { title: "战略人冷启动龙虾", desc: "一键安装，龙虾秒懂战略", color: "#3498db" },
              { title: "战略人日常使用", desc: "行业分析、战略规划、护城河…随时调取方法论", color: "#2ecc71" },
              { title: "想学习战略经典理论", desc: "通过实战 prompt 掌握 6 本经典", color: "#9b59b6" },
            ].map((p, i) => (
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
            <div style={{ position: "absolute", left: 27, top: 28, bottom: 28, width: 2, background: `linear-gradient(180deg,${ACCENT} 0%,#2ecc71 50%,#9b59b6 100%)`, borderRadius: 1 }} />
            {[
              { step: 1, title: "让 Agent 学习", examples: ["你去学一下战略方法论"], result: "升级龙虾大脑", color: ACCENT },
              { step: 2, title: "在相关任务中自动调用", examples: ["帮我分析这个行业", "帮我定战略", "怎么建护城河"], result: "Agent 自动匹配框架", color: "#2ecc71" },
              { step: 3, title: "指定具体框架进行分析", examples: ["用五力模型帮我分析"], result: "精确调用某一框架", color: "#9b59b6" },
            ].map((m, i) => (
              <div key={i} style={{ position: "relative", display: "flex", gap: 14, padding: "16px 18px 16px 56px", marginBottom: i < 2 ? 12 : 0, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, borderLeft: `4px solid ${m.color}`, transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: m.color, border: `3px solid ${T.bg}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", zIndex: 1 }}>{m.step}</span>
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
                    const fw = FW[id];
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
          <div style={{ color: T.textDim, fontSize: 12, marginBottom: 14 }}>按 3 大支柱选择，快速找到对应方法论</div>
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
            <div style={{ position: "absolute", left: 11, top: 16, bottom: 16, width: 3, background: "linear-gradient(180deg,#3498db 0%,#2ecc71 50%,#9b59b6 100%)", borderRadius: 2 }} />
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
          <div onClick={() => { setSel(FW[scene.p]); setModalAns(null); }} style={{ ...s.card, borderLeft: `4px solid ${FW[scene.p].color}` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = FW[scene.p].color + "60"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", gap: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: FW[scene.p].color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 700, color: T.text }}>{FW[scene.p].name}</div><div style={{ fontSize: 12, color: T.textMuted }}>{FW[scene.p].one}</div></div></div>
          </div>
          {scene.s !== null && <>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, marginBottom: 6, marginTop: 10 }}>补充配合</div>
            <div onClick={() => { setSel(FW[scene.s]); setModalAns(null); }} style={{ ...s.card, padding: "14px 18px", borderLeft: `4px solid ${FW[scene.s].color}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = FW[scene.s].color + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ display: "flex", gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: FW[scene.s].color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{FW[scene.s].name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{FW[scene.s].one}</div></div></div>
            </div>
          </>}
          <div style={{ marginTop: 16, padding: "14px 16px", background: ACCENT + "12", borderRadius: 10, border: "1px solid " + ACCENT + "30" }}>
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
              <div><div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>战略方法论测试</div><div style={{ fontSize: 11, color: T.textDim }}>6道题 · 选完可看解析</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{score}<span style={{ fontSize: 12, color: T.textDim }}>/6</span></div><div style={{ fontSize: 11, color: T.textDim }}>当前得分</div></div>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
              {order.current.map((fwId, i) => {
                const isCurrent = i === qi, isPast = i < qi;
                const wasWrong = isPast && wrongFwIds.includes(fwId);
                let dotBg = T.border, dotColor = T.textDim;
                if (isCurrent) { dotBg = fw.color + "30"; dotColor = fw.color; }
                else if (isPast) { dotBg = wasWrong ? "#ef444420" : "#22c55e20"; dotColor = wasWrong ? "#ef4444" : "#22c55e"; }
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
              if (show && picked) { bg = o.c ? "#22c55e12" : "#ef444412"; bd = o.c ? "#22c55e50" : "#ef444450"; }
              else if (show && o.c) { bg = "#22c55e10"; bd = "#22c55e40"; }
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
              if (qi < 5) { setQi(q => q + 1); setQa(null); } else setDone(true);
            }}
              style={{ marginTop: 16, padding: "11px 0", borderRadius: 10, background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", width: "100%" }}>{qi < 5 ? "下一题 →" : "查看结果"}</button>}
          </>;
        })()}

        {view === "quiz" && done && <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", color: T.text, marginBottom: 6 }}>{score >= 6 ? "战略方法论大师" : score >= 4 ? "进阶战略人" : score >= 3 ? "战略学徒" : "方法论新手"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: T.text }}>{score}<span style={{ fontSize: 16, color: T.textDim }}>/6</span></div>
          <div style={{ fontSize: 15, fontWeight: 700, margin: "6px 0", color: score >= 6 ? "#22c55e" : score >= 4 ? ACCENT : "#e67e22" }}>{score >= 6 ? "已掌握精髓" : score >= 4 ? "基础扎实" : score >= 3 ? "继续加油" : "建议多浏览"}</div>
          <div style={{ color: T.textDim, fontSize: 12, marginBottom: 20 }}>{score >= 6 ? "下一步实战运用。" : score >= 4 ? "复习答错的理论。" : "建议从浏览模式开始了解。"}</div>
          {wrongFwIds.length > 0 && <div style={{ textAlign: "left", marginBottom: 20, padding: "14px 18px", background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>建议复习以下方法论</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[...new Set(wrongFwIds)].map(id => {
                const f = FW[id];
                return <div key={id} onClick={() => setSel(f)} style={{ padding: "8px 14px", borderRadius: 8, background: f.color + "18", border: `1px solid ${f.color}40`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: f.color }}
                  onMouseEnter={e => { e.currentTarget.style.background = f.color + "25"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = f.color + "18"; }}>{f.name}</div>;
              })}
            </div>
          </div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setQi(0); setScore(0); setQa(null); setDone(false); setWrongFwIds([]); order.current = [...Array(6).keys()].sort(() => Math.random() - 0.5); }}
              style={{ padding: "10px 24px", borderRadius: 10, background: T.card, color: T.text, fontSize: 13, fontWeight: 600, border: `1px solid ${T.border}`, cursor: "pointer" }}>再测一次</button>
            <button onClick={() => setView("browse")} style={{ padding: "10px 24px", borderRadius: 10, background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>去学习</button>
          </div>
        </div>}
      </div>

      {/* MODAL */}
      {sel && <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: T.modalOverlay, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99, padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, maxWidth: 600, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "28px 24px", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {sel.coverId ? (
                <img src={`https://covers.openlibrary.org/b/id/${sel.coverId}-M.jpg`} alt="" style={{ width: 72, height: 108, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
              ) : null}
              <span style={{ width: 72, height: 108, display: sel.coverId ? "none" : "flex", alignItems: "center", justifyContent: "center", background: T.codeBg, borderRadius: 8, fontSize: 32, flexShrink: 0, border: `1px solid ${T.border}` }}>{sel.emoji}</span>
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

          {sel.combos && <><div style={{ fontWeight: 700, margin: "18px 0 8px", color: T.text }}>组合使用</div>
            {sel.combos.map((c, i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "10px 14px", background: T.codeBg, borderRadius: 8, marginBottom: 5, lineHeight: 1.6, border: `1px solid ${T.border}` }}>
              <span style={{ fontWeight: 600, color: sel.color }}>{sel.name} + {c.with}</span>
              <span style={{ color: T.textDim }}> — {c.how}</span>
            </div>)}</>}

          <div style={{ background: T.codeBg, borderRadius: 12, padding: 18, marginTop: 18, border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: T.text }}>小测试</div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: T.text }}>{sel.q}</div>
            {sel.opts.map((o, i) => {
              const picked = modalAns === i, show = modalAns !== null;
              let bg = T.card, bd = T.border;
              if (show && picked) { bg = o.c ? "#22c55e12" : "#ef444412"; bd = o.c ? "#22c55e50" : "#ef444450"; }
              else if (show && o.c) { bg = "#22c55e10"; bd = "#22c55e40"; }
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

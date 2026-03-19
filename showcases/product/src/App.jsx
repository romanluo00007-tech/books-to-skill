import { useState, useRef } from "react";

// ============================================================
// === DATA START ===
// ============================================================

const SITE = {
  skillName: "product-playbook",
  title: "产品知识库 Skill",
  subtitle: "产品方法论",
  slogan: "让 AI 开口就是产品顾问",
  description: "6 本产品必读经典提炼 · 可执行框架",
  installCmd: "clawhub install product-playbook",
  accentColor: "#06b6d4",
  personas: [
    { title: "产品人冷启动龙虾", desc: "一键安装，龙虾秒懂产品", color: "#06b6d4" },
    { title: "产品人日常使用", desc: "验证、调研、决策、扩展…随时调取方法论", color: "#0891b2" },
    { title: "想学习产品经典理论", desc: "通过实战 prompt 掌握 6 本经典", color: "#0e7490" },
  ],
  usageSteps: [
    { step: 1, title: "让 Agent 学习", examples: ["你去学一下产品方法论"], result: "升级龙虾大脑", color: "#06b6d4" },
    { step: 2, title: "在相关任务中自动调用", examples: ["这个想法值不值得做", "怎么做用户调研", "增长遇到瓶颈"], result: "Agent 自动匹配框架", color: "#0891b2" },
    { step: 3, title: "指定具体框架进行分析", examples: ["用精益方法帮我验证", "用 JTBD 帮我分析需求"], result: "精确调用某一框架", color: "#0e7490" },
  ],
};

// 金字塔：发现需求(3,5) | 验证方案(0,2) | 产品决策(1) | 市场扩展(4)
const PYRAMID = [
  { pillar: "发现需求", desc: "用户要完成什么任务？", color: "#06b6d4", ids: [3, 5] },
  { pillar: "验证方案", desc: "MVP、原型、快速试错", color: "#0891b2", ids: [0, 2] },
  { pillar: "产品决策", desc: "做什么、值不值得做", color: "#0e7490", ids: [1] },
  { pillar: "市场扩展", desc: "从早期到主流的跨越", color: "#155e75", ids: [4] },
];

const FW = [
  { id: 0, name: "精益创业", en: "Lean Startup", emoji: "🔄", book: "The Lean Startup", author: "Eric Ries", year: 2011, color: "#06b6d4", coverId: 7104760,
    one: "用最小实验快速验证假设，别闷头做一年", tags: ["新产品验证", "快速试错"],
    idea: "构建-测量-学习循环要尽可能快。MVP 是验证假设的最小实验，不是缩水版产品。转型不是失败，是发现了更好的方向。",
    steps: [
      { n: "构建 Build", d: "把假设变成 MVP。视频MVP、手动MVP、着陆页、单功能——能验证核心假设的最小实验" },
      { n: "测量 Measure", d: "用可行动指标非虚荣指标。留存率、转化率、单位经济 > 总注册、下载量" },
      { n: "学习 Learn", d: "基于数据决定坚持还是转型。成功标准必须提前定" },
      { n: "转型 Pivot", d: "客户群、需求、渠道、技术、商业模式——系统性改变策略" },
    ],
    traps: ["MVP 做成缩水版产品", "没定义成功标准就开始测", "只看虚荣指标", "不敢转型", "无限循环不决策"],
    combos: [
      { with: "妈妈测试", how: "精益需要用户数据，妈妈测试教你怎么获取真实信息" },
      { with: "设计冲刺", how: "Sprint 可作为构建阶段的加速器，5 天走完一次循环" },
      { with: "跨越鸿沟", how: "精益帮你找到 PMF，跨越鸿沟帮你扩展到主流市场" },
    ],
    q: "MVP 的本质是？", opts: [
      { t: "功能最少的产品", c: false, e: "MVP 是验证假设的最小实验" },
      { t: "能验证核心假设的最小实验", c: true, e: "一个着陆页也可以是 MVP" },
      { t: "产品的第一版", c: false, e: "第一版可能做太多" },
      { t: "给早期用户用的版本", c: false, e: "MVP 的目的是验证不是交付" },
    ] },
  { id: 1, name: "启示录", en: "Inspired", emoji: "📋", book: "Inspired", author: "Marty Cagan", year: 2018, color: "#0891b2", coverId: 9700654,
    one: "先搞清楚值不值得做，再去做", tags: ["产品管理", "产品发现"],
    idea: "大部分团队 90% 时间在交付、10% 在发现。真正的浪费是做了不该做的东西。问题先于方案。",
    steps: [
      { n: "产品发现 vs 交付", d: "发现：做什么？值不值得？发现用原型和用户测试；交付用敏捷" },
      { n: "四种风险", d: "价值、可用性、可行性、商业可行性。每个决策都要评估" },
      { n: "赋能型团队", d: "产品经理+设计师+技术领导。收到的是问题不是功能清单，拥有解决方案自主权" },
      { n: "产品发现技术", d: "用户访谈、客户拜访、原型测试、A/B、参考客户计划" },
    ],
    traps: ["把路线图当承诺", "产品经理=项目经理", "只做用户说的", "跳过发现直接开发", "三个角色缺一个"],
    combos: [
      { with: "精益创业", how: "Cagan 提供发现系统方法，精益提供快速循环执行理念" },
      { with: "设计冲刺", how: "Sprint 可作为产品发现的高效方法" },
      { with: "JTBD", how: "JTBD 理解用户 Job，启示录框架转化为产品决策" },
    ],
    q: "产品路线图应该是？", opts: [
      { t: "Q3 做功能 A，Q4 做功能 B", c: false, e: "功能可以变，问题是稳定的" },
      { t: "Q3 解决问题 X，Q4 探索机会 Y", c: true, e: "问题导向的路线图" },
      { t: "按优先级排的需求清单", c: false, e: "路线图是战略不是 backlog" },
      { t: "老板拍板的功能列表", c: false, e: "应该基于验证而非 HiPPO" },
    ] },
  { id: 2, name: "设计冲刺", en: "Sprint", emoji: "🏃", book: "Sprint", author: "Jake Knapp", year: 2016, color: "#0e7490", coverId: 7431269,
    one: "5 天从模糊问题到用户验证的原型", tags: ["快速验证", "产品决策"],
    idea: "不要讨论，要画出来。独立思考优先。5 个用户就能发现 85% 的可用性问题。",
    steps: [
      { n: "Day1 理解", d: "定义长期目标、关键问题、用户旅程、选择聚焦点" },
      { n: "Day2 草案", d: "参考案例、个人草图、疯狂八格。独立想方案不是头脑风暴" },
      { n: "Day3 决定", d: "沉默投票、超级投票、决策者拍板、画故事板" },
      { n: "Day4 原型", d: "分工制作，刚好够真实——不需要真的能用" },
      { n: "Day5 测试", d: "5 个真实用户一对一测试，团队观察" },
    ],
    traps: ["解决的问题太小", "没有决策者参与", "Day2 变成头脑风暴", "原型太简陋", "觉得 5 个用户太少"],
    combos: [
      { with: "精益创业", how: "Sprint 是精益循环中构建阶段的加速器" },
      { with: "启示录", how: "四种风险高时跑 Sprint 验证" },
      { with: "妈妈测试", how: "Day5 用户测试借鉴妈妈测试原则" },
    ],
    q: "Sprint 的 Day2 应该？", opts: [
      { t: "团队头脑风暴讨论方案", c: false, e: "讨论会让声音大的人主导" },
      { t: "每个人独立画方案草图", c: true, e: "独立思考避免从众" },
      { t: "决策者提出方向大家补充", c: false, e: "先各自想再一起看" },
      { t: "研究竞品找灵感", c: false, e: "参考案例是输入，输出是独立方案" },
    ] },
  { id: 3, name: "JTBD", en: "Jobs to Be Done", emoji: "🎯", book: "Competing Against Luck", author: "Christensen", year: 2016, color: "#06b6d4", coverId: 8138391,
    one: "用户不是买产品，是雇佣产品完成任务", tags: ["需求洞察", "产品定位"],
    idea: "Job 是用户在特定情境下想要的进展。竞争不是同类产品，是完成同一 Job 的所有方案。推力+拉力 > 惯性+焦虑 才会雇佣新产品。",
    steps: [
      { n: "Job 语句", d: "当我[情境]时，我想要[进展]，这样我就能[结果]。有具体情境才有洞察" },
      { n: "三个维度", d: "功能维度（实际任务）、情感维度（想要感受）、社交维度（别人怎么看）" },
      { n: "四种力量", d: "推力（不满）、拉力（吸引）、惯性（习惯）、焦虑（顾虑）。很多产品只关注拉力" },
      { n: "真正的竞争", d: "完成同一 Job 的所有方案——包括非产品方案" },
    ],
    traps: ["把 Job 写成功能需求", "忽略情感和社交维度", "把人口统计当用户理解", "只看拉力不看惯性", "Job 太宽泛"],
    combos: [
      { with: "精益创业", how: "JTBD 找值得解决的 Job，精益验证方案能否完成" },
      { with: "妈妈测试", how: "JTBD 说要研究什么，妈妈测试说怎么正确研究" },
      { with: "跨越鸿沟", how: "不同阶段用户可能有不同 Job，跨鸿沟时重新审视" },
    ],
    q: "Podcast 应用的真正竞争对手是？", opts: [
      { t: "其他 Podcast 应用", c: false, e: "竞争是完成同一 Job 的所有方案" },
      { t: "音乐、有声书、短视频、发呆", c: true, e: "都在竞争通勤时间怎么花" },
      { t: "播客内容平台", c: false, e: "还是同类思维" },
      { t: "没有直接竞争对手", c: false, e: "JTBD 帮你看到更广的竞争" },
    ] },
  { id: 4, name: "跨越鸿沟", en: "Crossing the Chasm", emoji: "🌉", book: "Crossing the Chasm", author: "Geoffrey Moore", year: 1991, color: "#155e75", coverId: 684159,
    one: "从极客市场到主流市场之间有一条致命的鸿沟", tags: ["市场扩展", "增长阶段"],
    idea: "早期采用者买愿景，早期多数买解决方案。选一个滩头阵地集中拿下，建立参考案例再扩展。整体产品不是核心产品。",
    steps: [
      { n: "选滩头阵地", d: "足够小、有紧迫需求、能 100% 拿下。不是中国中小企业，是深圳 50-200 人跨境电商" },
      { n: "打造整体产品", d: "核心+期望+增值+潜在。早期多数要完整解决方案" },
      { n: "定位切换", d: "从革命性技术变成[细分市场]的标准解决方案" },
      { n: "渠道与定价", d: "用目标客户信任的渠道，基于价值定价非渗透定价" },
    ],
    traps: ["以为早期成功可自然延续", "滩头阵地选太大", "忽略整体产品", "定位语言没切换", "用低价冲量"],
    combos: [
      { with: "精益创业", how: "精益找 PMF，跨越鸿沟带入主流" },
      { with: "启示录", how: "整体产品设计需要产品发现" },
      { with: "JTBD", how: "主流用户的 Job 可能和早期用户不同" },
    ],
    q: "跨越鸿沟时定位应该？", opts: [
      { t: "强调我们的技术很颠覆", c: false, e: "早期多数要可靠不是酷" },
      { t: "变成 XX 行业的可靠解决方案", c: true, e: "语言从创新变可靠" },
      { t: "突出我们比竞品便宜", c: false, e: "低价暗示不成熟" },
      { t: "讲我们的融资和团队", c: false, e: "早期多数关心解决具体问题" },
    ] },
  { id: 5, name: "妈妈测试", en: "The Mom Test", emoji: "👩", book: "The Mom Test", author: "Rob Fitzpatrick", year: 2013, color: "#06b6d4", coverId: 10660557,
    one: "怎么从用户嘴里获取真相而不是礼貌的谎言", tags: ["用户调研", "需求验证"],
    idea: "聊他们的生活不是你的想法。问过去的事实不是未来的假设。少说多听。恭维不等于验证，承诺才是。",
    steps: [
      { n: "聊生活不聊想法", d: "你现在怎么处理 XX 问题？不问你觉得我这个产品怎么样" },
      { n: "问过去不问未来", d: "上次遇到这个问题你怎么做的？不问如果有这功能你会用吗" },
      { n: "少说多听", d: "对方说 80% 你说 20%。不滔滔不绝然后问你觉得呢" },
      { n: "承诺验证", d: "时间/声誉/金钱承诺才是真信号。好主意不是验证" },
    ],
    traps: ["带着方案去问", "问未来意向", "问太广的问题", "把恭维当验证", "只访谈不记录"],
    combos: [
      { with: "精益创业", how: "妈妈测试是构建-测量-学习中测量的核心方法" },
      { with: "JTBD", how: "JTBD 说研究什么，妈妈测试说怎么正确研究" },
      { with: "设计冲刺", how: "Day5 用户测试借鉴妈妈测试原则" },
    ],
    q: "用户说这个主意真好，说明？", opts: [
      { t: "验证通过，可以开发了", c: false, e: "恭维不等于验证" },
      { t: "需要看是否有承诺（时间/介绍/付费）", c: true, e: "承诺才是真信号" },
      { t: "用户很有兴趣，可以继续问功能", c: false, e: "问过去行为不是未来意向" },
      { t: "至少说明方向对了", c: false, e: "礼貌的谎言没有信息价值" },
    ] },
];

// 场景 → 方法论映射。pillar: 0发现需求 1验证方案 2产品决策 3市场扩展
const SCENES = [
  { t: "这个想法值不值得做 / 要不要做这个功能", p: 0, s: 1, l: "假设验证", pillar: 1, w: "精益创业设计验证计划，启示录四种风险评估。先搞清楚值不值得再做。", prompts: ["帮我设计这个想法的验证计划", "这个功能有哪几种风险？怎么验证？", "MVP 应该怎么做？"] },
  { t: "怎么做 MVP / 怎么快速验证", p: 0, s: 2, l: "快速验证", pillar: 1, w: "精益的 MVP 设计，有团队可用设计冲刺 5 天走完全流程。", prompts: ["帮我设计 MVP 验证这个假设", "我们有 5 天，怎么跑一次 Sprint？", "成功标准应该提前定什么？"] },
  { t: "下一步做什么功能 / 功能优先级", p: 1, s: 3, l: "功能决策", pillar: 2, w: "启示录的产品发现和四种风险，JTBD 理解需求优先级。", prompts: ["帮我做产品发现计划", "下一步应该解决什么问题？", "四种风险哪个最高？"] },
  { t: "怎么做用户调研 / 怎么访谈用户", p: 5, s: 3, l: "用户调研", pillar: 0, w: "妈妈测试教你怎么问出真相，JTBD 指明访谈方向。", prompts: ["帮我设计用户访谈指南", "这些问题会不会得到假信息？", "访谈中应该问什么？"] },
  { t: "用户到底需要什么 / 需求不清楚", p: 3, s: 5, l: "需求洞察", pillar: 0, w: "JTBD 帮你理解用户的 Job 和情境，妈妈测试确保调研方法正确。", prompts: ["用 JTBD 帮我分析用户需求", "用户的 Job 是什么？", "怎么从访谈中提取真实需求？"] },
  { t: "产品做了没人用 / 数据不好", p: 0, s: 3, l: "坚持或转型", pillar: 1, w: "精益创业判断是优化还是转型，JTBD 重新理解需求。", prompts: ["数据不好，应该坚持还是转型？", "用 JTBD 重新理解用户需要什么", "核心假设哪个错了？"] },
  { t: "增长遇到瓶颈 / 用户不增长了", p: 4, s: 0, l: "增长瓶颈", pillar: 3, w: "跨越鸿沟判断产品阶段，精益帮助转型判断。", prompts: ["增长停了，是鸿沟问题吗？", "怎么设计跨越鸿沟策略？", "滩头阵地应该选哪？"] },
  { t: "怎么从早期用户扩展到大市场", p: 4, s: 1, l: "市场扩展", pillar: 3, w: "跨越鸿沟的滩头阵地、整体产品、定位切换。启示录的整体产品思维。", prompts: ["帮我设计从早期到主流的扩展战略", "整体产品还缺什么？", "定位怎么从创新变可靠？"] },
  { t: "团队效率低 / 做了很多但效果差", p: 1, s: 2, l: "团队优化", pillar: 2, w: "启示录诊断发现/交付比例和团队结构，Sprint 加速决策。", prompts: ["团队发现和交付时间比合理吗？", "怎么让团队收到问题而不是功能清单？", "有个大问题需要 5 天给方案"] },
  { t: "有个大问题需要快速给方案", p: 2, s: null, l: "快速决策", pillar: 1, w: "设计冲刺 5 天从问题到用户验证。决策者必须参与。", prompts: ["策划一次设计冲刺", "5 天议程怎么安排？", "怎么招募 5 个测试用户？"] },
  { t: "产品怎么定位 / 差异化", p: 3, s: 4, l: "产品定位", pillar: 0, w: "JTBD 的 Job 视角定位，跨越鸿沟的阶段定位。", prompts: ["用 JTBD 帮我们做产品定位", "用户的 Job 和竞品有什么不同？", "主流市场定位应该怎么变？"] },
  { t: "竞品都差不多，怎么做出不一样的", p: 3, s: 0, l: "差异化", pillar: 0, w: "JTBD 重新定义竞争和 Job 维度，精益验证差异化假设。", prompts: ["用 JTBD 重新定义我们的竞争", "哪个 Job 维度被忽略了？", "差异化方向怎么验证？"] },
  { t: "客户说好但不付费 / 反馈正面但没人买", p: 5, s: 0, l: "假阳性", pillar: 0, w: "妈妈测试识别恭维和空洞假设，精益的承诺验证。", prompts: ["用户访谈得到的是真信息吗？", "怎么区分恭维和真实兴趣？", "承诺验证应该设计什么？"] },
  { t: "产品路线图怎么做", p: 1, s: 3, l: "路线图", pillar: 2, w: "启示录的问题导向路线图，JTBD 和精益支撑优先级。", prompts: ["路线图应该是问题导向还是功能导向？", "下一季度应该解决什么问题？", "怎么用 JTBD 指导路线图？"] },
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
  const ACCENT = SITE.accentColor || "#06b6d4";
  const T = { bg: "#faf8f5", card: "#fff", border: "#e7e5e4", borderHover: "#d6d3d1", text: "#1c1917", textMuted: "#57534e", textDim: "#78716c", textFaint: "#a8a29e", codeBg: "#f5f5f4", accent: ACCENT, modalOverlay: "rgba(0,0,0,0.4)" };
  const s = { card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", cursor: "pointer", transition: "all .15s", marginBottom: 8 }, tag: { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, background: T.codeBg, color: T.textDim, marginRight: 5 } };

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
              <button onClick={() => copyPrompt(INSTALL_CMD)} style={{ padding: "12px 20px", background: copiedIdx === INSTALL_CMD ? "#22c55e" : ACCENT, color: "#000", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0 }}>{copiedIdx === INSTALL_CMD ? "已复制" : "复制"}</button>
            </div>
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
            <div style={{ position: "absolute", left: 27, top: 28, bottom: 28, width: 2, background: `linear-gradient(180deg,${SITE.usageSteps.map((m, i) => m.color + " " + (i / (SITE.usageSteps.length - 1) * 100) + "%").join(", ")})`, borderRadius: 1 }} />
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

        {/* QUIZ + rest of component - same structure as sales */}
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
              if (qi < FW.length - 1) { setQi(q => q + 1); setQa(null); } else setDone(true);
            }}
              style={{ marginTop: 16, padding: "11px 0", borderRadius: 10, background: ACCENT, color: "#000", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", width: "100%" }}>{qi < FW.length - 1 ? "下一题 →" : "查看结果"}</button>}
          </>;
        })()}

        {view === "quiz" && done && <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", color: T.text, marginBottom: 6 }}>{score >= FW.length - 1 ? SITE.subtitle + "大师" : score >= Math.ceil(FW.length * 0.67) ? "进阶玩家" : score >= Math.ceil(FW.length * 0.44) ? "学徒" : "新手"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: T.text }}>{score}<span style={{ fontSize: 16, color: T.textDim }}>/{FW.length}</span></div>
          <div style={{ fontSize: 15, fontWeight: 700, margin: "6px 0", color: score >= FW.length - 1 ? "#22c55e" : score >= Math.ceil(FW.length * 0.67) ? ACCENT : "#e67e22" }}>{score >= FW.length - 1 ? "已掌握精髓" : score >= Math.ceil(FW.length * 0.67) ? "基础扎实" : score >= Math.ceil(FW.length * 0.44) ? "继续加油" : "建议多浏览"}</div>
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

import { useState, useRef } from "react";

// ============================================================
// === DATA START === (替换以下数据区域即可生成新领域的展示网页)
// ============================================================

// 网站配置
const SITE = {
  skillName: "marketing-playbook",
  title: "营销知识库 Skill",
  subtitle: "营销方法论",
  slogan: "让 AI 开口就是营销顾问",
  description: "9 本营销必读经典提炼 · 可执行框架",
  installCmd: "clawhub install marketing-playbook",
  accentColor: "#f0c040",
  personas: [
    { title: "营销人冷启动龙虾", desc: "一键安装，龙虾秒懂营销", color: "#e74c3c" },
    { title: "营销人日常使用", desc: "定位、文案、转化、留存…随时调取方法论", color: "#3498db" },
    { title: "想学习营销经典理论", desc: "通过实战 prompt 掌握 9 本经典", color: "#1abc9c" },
  ],
  usageSteps: [
    { step: 1, title: "让 Agent 学习", examples: ["你去学一下营销方法论"], result: "升级龙虾大脑", color: "#f0c040" },
    { step: 2, title: "在相关任务中自动调用", examples: ["帮我分析这条内容为什么火", "帮我写卖点", "帮我做定位"], result: "Agent 自动匹配框架", color: "#e67e22" },
    { step: 3, title: "指定具体框架进行分析", examples: ["用 STEPPS 帮我分析"], result: "精确调用某一框架", color: "#e74c3c" },
  ],
};

// 金字塔原理：结论先行 + 以上统下 + MECE
// 塔尖：营销成功 = 获客 + 留客
// 四大支柱（相互独立、完全穷尽）：定战略 | 做表达 | 促转化 | 保留存
const PYRAMID = [
  { pillar: "定战略", desc: "我是谁？占什么位置？讲什么故事？", color: "#e74c3c", ids: [0, 5, 3] },      // 定位、紫牛、SB7
  { pillar: "做表达", desc: "怎么让人知道、记住、传播？", color: "#e67e22", ids: [2, 1, 8] },      // SUCCESs、STEPPS、内容飞轮
  { pillar: "促转化", desc: "怎么让人想买、敢买？", color: "#3498db", ids: [6, 4] },              // 价值包装、六大影响力
  { pillar: "保留存", desc: "怎么让人留下、养成习惯？", color: "#1abc9c", ids: [7] },            // 上瘾模型
];

const FW = [
  { id:0, name:"定位理论", en:"Positioning", emoji:"📍", book:"Positioning", author:"Ries & Trout", year:1981, color:"#e74c3c", coverId:55745,
    one:"在用户心智中占据一个独特位置", tags:["品牌定位","竞争差异化"],
    idea:"营销的终极战场不是货架，是用户心智。每个品类用户最多记住2-3个品牌，你的目标是成为第一个被想起的名字。",
    steps:[{n:"分析竞争环境",d:"这个品类里已经有谁？他们各自在用户心智中占据了什么位置？用户提到这个品类时第一反应是谁？"},{n:"找到空位",d:"哪些位置被占了（不要硬抢），哪些是空的但用户在意？可以从价格、人群、场景、属性四个维度找空位"},{n:"形成定位声明",d:"模板：「对于[目标人群]，[品牌]是[品类]中唯一能[独特价值]的，因为[支撑理由]」。如果竞品也能说这句话，说明不够独特"},{n:"贯穿一切触点",d:"定位不是slogan，是从产品、定价、渠道、内容到视觉一切决策的过滤器。每个动作都要问：这在强化还是稀释我的定位？"}],
    traps:["把定位等同于slogan","定位太宽什么都想是","忽视竞争对手","频繁更换定位"],
    combos:[{with:"紫牛",how:"定位告诉你占据什么位置，紫牛告诉你怎么让产品成为这个位置的最强证据"},{with:"品牌故事SB7",how:"定位确定后，用SB7把定位包装成用户能产生共鸣的故事"},{with:"SUCCESs",how:"定位确定后，用SUCCESs让定位信息更容易被记住"}],
    q:"以下哪个是好的定位声明？", opts:[
      {t:"我们为所有人提供最好的服务",c:false,e:"太宽泛，竞品也能说"},
      {t:"面向独立开发者的10分钟部署后端服务",c:true,e:"有明确人群和排他价值"},
      {t:"我们的技术行业领先",c:false,e:"这是自夸不是定位"},
      {t:"高品质低价格好服务",c:false,e:"不可能同时占据所有好位置"}]},
  { id:1, name:"STEPPS传播模型", en:"Contagious", emoji:"🔥", book:"Contagious", author:"Jonah Berger", year:2013, color:"#e67e22", coverId:9039370,
    one:"让内容自带传播力的6个引擎", tags:["爆款分析","内容策划"],
    idea:"内容传播不是随机的。6个引擎每多命中一个传播概率多一层。强命中2-3个比弱命中6个有效。",
    steps:[{n:"Social Currency 社交货币",d:"人们分享让自己显得聪明/有趣/内行的内容。问：分享这个能让分享者在社交圈'加分'吗？"},{n:"Triggers 触发器",d:"容易被日常场景提醒的内容被谈论更多。KitKat绑定'咖啡时间'，每次喝咖啡就想到它"},{n:"Emotion 情绪",d:"高唤醒情绪(敬畏/愤怒/兴奋)驱动分享，低唤醒(满足/悲伤)抑制分享。关键是唤醒度不是正负"},{n:"Public 公共可见性",d:"能被看到的行为会被模仿。苹果'Sent from iPhone'把私人行为变成公共可见"},{n:"Practical Value 实用价值",d:"人们分享有用的东西。不是信息越多越好，而是要'令人惊讶地有用'"},{n:"Stories 故事",d:"信息搭载在故事上传播。好故事有特洛伊木马效应——人为故事分享，你的信息搭便车"}],
    traps:["以为好内容自然会传播","混淆高唤醒和负面情绪","故事和品牌两张皮","六维度当checklist凑"],
    combos:[{with:"SUCCESs",how:"STEPPS让人分享，SUCCESs让人记住。先用SUCCESs打磨信息质量，再用STEPPS设计传播"},{with:"品牌故事SB7",how:"STEPPS的Stories维度可以直接用SB7框架来设计故事结构"},{with:"六大影响力",how:"稀缺性增强社交货币，社会认同增强公共可见性，互惠增强实用价值"}],
    q:"悲伤的内容容易被分享吗？", opts:[
      {t:"容易，很有感染力",c:false,e:"悲伤是低唤醒情绪，让人沉浸而非行动"},
      {t:"不容易，悲伤是低唤醒情绪",c:true,e:"关键是唤醒度不是正负，愤怒(高唤醒)反而促进分享"},
      {t:"取决于内容质量",c:false,e:"质量是前提但传播机制由唤醒度决定"},
      {t:"完全不会被分享",c:false,e:"不是完全不会，概率较低"}]},
  { id:2, name:"SUCCESs粘性法则", en:"Made to Stick", emoji:"🧲", book:"Made to Stick", author:"Heath Brothers", year:2007, color:"#9b59b6", coverId:7004880,
    one:"让信息被记住的6个要素", tags:["文案优化","卖点表达"],
    idea:"简单、意外、具体、可信、情感、故事——6个让信息过耳不忘的粘性要素。",
    steps:[{n:"Simple 简单",d:"找到核心信息用最精炼方式表达。不是简化，是找到最重要的点砍掉其他。类比是最好的工具"},{n:"Unexpected 意外",d:"找到受众的常识/预期，打破它，制造好奇心缺口。要'惊讶+有道理'，噱头只有第一下"},{n:"Concrete 具体",d:"闭眼能'看到'吗？用感官语言替代概念：'高质量'→'打开包装能闻到皮革的味道'"},{n:"Credible 可信",d:"越具体越可信——'编不出来这种细节'。让受众自己验证比给数据更有力"},{n:"Emotional 情感",d:"人对个体故事有反应，对统计麻木。问三次'为什么这件事重要'接近情感内核"},{n:"Stories 故事",d:"故事是信息的飞行模拟器。三种模式：挑战型(激励行动)、连接型(激励信任)、创意型(激励创新)"}],
    traps:["把简单等于简短","用抽象词堆砌","以为数据=可信","意外感只在标题用一次"],
    combos:[{with:"STEPPS",how:"SUCCESs让信息有粘性(被记住)，STEPPS让信息被传播(被分享)。做内容先SUCCESs再STEPPS"},{with:"定位理论",how:"定位确定核心信息是什么，SUCCESs确保这个信息能被记住"},{with:"品牌故事SB7",how:"SUCCESs的Stories维度可以用SB7框架来结构化设计"}],
    q:"哪个表达更有「粘性」？", opts:[
      {t:"存储容量达到5GB",c:false,e:"抽象数字没有画面感"},
      {t:"把1000首歌装进口袋",c:true,e:"具体+意外+简单，闭眼能看到"},
      {t:"行业领先的存储解决方案",c:false,e:"没有任何粘性要素"},
      {t:"超大容量满足一切需求",c:false,e:"太模糊什么都没说"}]},
  { id:3, name:"品牌故事SB7", en:"StoryBrand", emoji:"📖", book:"Building a StoryBrand", author:"Donald Miller", year:2017, color:"#2ecc71", coverId:8458703,
    one:"把客户变成故事主角，品牌变成导师", tags:["品牌叙事","官网文案"],
    idea:"核心翻转：客户是英雄，品牌是导师（尤达之于卢克）。别再自说自话了。",
    steps:[{n:"主角 = 客户",d:"客户有一个清晰的欲望/目标。用客户的语言描述，不要用行业术语"},{n:"问题 = 挑战",d:"外部问题(网站太慢) → 内部问题(客户流失让我焦虑) → 哲学问题(好产品不该因此失败)。用户买的是情感解决方案"},{n:"导师 = 品牌",d:"展现共情(我理解你的困境) + 权威(案例/数据/资质)。导师不是英雄"},{n:"计划",d:"清晰3-4步流程。消除不确定性，让客户觉得'这很简单我能做到'"},{n:"行动号召 CTA",d:"直接CTA(立即购买) + 过渡CTA(下载指南)。'了解更多'不是CTA，是推诿"},{n:"避免失败",d:"温和但清晰地展示不行动的代价。不是恐吓，是帮客户认清风险"},{n:"成功结局",d:"具体描述客户成功后的状态。'从每周加班20小时变成准时下班'比'提升效率'有力"}],
    traps:["品牌自恋通篇讲我们多厉害","只有外部问题没内部感受","CTA模糊","不敢讲失败风险"],
    combos:[{with:"定位理论",how:"定位确定品牌该占什么心智位置，SB7把定位转化成客户能共鸣的故事"},{with:"STEPPS",how:"SB7构建故事本体，STEPPS确保故事有传播力"},{with:"价值包装",how:"SB7讲'为什么选你'(情感)，Offers讲'凭什么这个价值'(理性)"}],
    q:"品牌官网首屏应该讲什么？", opts:[
      {t:"公司成立于2010年拥有100项专利",c:false,e:"没人在意你的专利"},
      {t:"你面临的问题+我们怎么帮你",c:true,e:"客户是主角，先讲痛点再讲解法"},
      {t:"团队由行业专家组成",c:false,e:"权威部分但不该放首屏"},
      {t:"立即免费试用",c:false,e:"没建立价值前不该推CTA"}]},
  { id:4, name:"六大影响力", en:"Influence", emoji:"🧠", book:"Influence", author:"Cialdini", year:1984, color:"#3498db", coverId:431011,
    one:"驱动人做决策的6个心理开关", tags:["转化优化","促销策略"],
    idea:"说服不靠话术，靠触发已有心理开关：互惠、承诺一致、社会认同、喜好、权威、稀缺。",
    steps:[{n:"互惠 Reciprocity",d:"先给予再请求。赠品/免费试用/有价值内容——激活回报本能。给的东西要和产品相关"},{n:"承诺一致 Commitment",d:"先小承诺再大行动。注册免费版→升级付费版。承诺要主动的、公开的、付出努力的"},{n:"社会认同 Social Proof",d:"不确定时看别人怎么做。'你所在行业的300家公司在用'比'100万用户'有效——相似性>数量"},{n:"喜好 Liking",d:"人更容易被喜欢的人说服。来源：相似性、赞美、熟悉感、真实共鸣。喜好≠讨好"},{n:"权威 Authority",d:"在特定领域比你懂就够。权威+亲和=最强组合。只有权威容易产生距离感"},{n:"稀缺 Scarcity",d:"失去的恐惧>获得的欲望。数量稀缺+时间稀缺。必须真实——虚假稀缺被识破后信任归零"}],
    traps:["影响力当套路用","一次堆太多原则","虚假稀缺被识破","忽视喜好基础"],
    combos:[{with:"价值包装",how:"影响力解决'怎么让人更想买'，Offers解决'买什么值不值'。先设计报价再优化转化"},{with:"STEPPS",how:"社会认同强化STEPPS的Public维度，互惠强化Practical Value"},{with:"SUCCESs",how:"SUCCESs的Credible维度可以用权威和社会认同来强化"}],
    q:"哪种社会认同更有效？", opts:[
      {t:"我们有100万用户",c:false,e:"数字大但缺乏相似性"},
      {t:"你所在行业的300家公司在用",c:true,e:"相似性比数量更重要"},
      {t:"获得了XX大奖",c:false,e:"这是权威不是社会认同"},
      {t:"产品广受好评",c:false,e:"太模糊没有可信细节"}]},
  { id:5, name:"紫牛", en:"Purple Cow", emoji:"🐄", book:"Purple Cow", author:"Seth Godin", year:2003, color:"#8e44ad", coverId:866008,
    one:"产品本身就是最好的营销", tags:["产品差异化","创新定位"],
    idea:"选择过剩的世界'好'不够。用户跟朋友吃饭会不会主动提到你？这是检验标准。",
    steps:[{n:"找标准动作",d:"列出所有竞品都在做的事——这是你不该继续跟的。大家都在做的事不会让你被注意到"},{n:"极端化思维",d:"某维度做到10倍好(不是10%)？砍掉行业标配功能(反常识减法)？服务被忽视的细分人群？"},{n:"瞄准Sneezers",d:"先打动会主动传播的那群人(早期采用者/意见领袖)。不需要所有人满意，一小群人狂热就够"},{n:"内置可传播性",d:"产品体验中有没有wow moment？开箱/使用/结果哪个环节最适合创造惊喜？有社交展示性吗？"}],
    traps:["紫牛=搞怪博眼球","差异化是营销部门的事","害怕冒犯一部分人","只做表面差异"],
    combos:[{with:"定位理论",how:"定位告诉你该占什么位置，紫牛让产品本身成为这个位置的最强证据"},{with:"STEPPS",how:"紫牛创造值得谈论的特质，STEPPS设计传播路径让人们真的去谈论"},{with:"价值包装",how:"紫牛解决'为什么注意到你'，Offers解决'为什么买你'"}],
    q:"哪个更接近「紫牛」思维？", opts:[
      {t:"产品质量比竞品好10%",c:false,e:"10%的好不会被谈论"},
      {t:"把行业标配功能直接砍掉",c:true,e:"反常识减法是最强差异化"},
      {t:"换了更年轻的包装",c:false,e:"表面差异没触及价值"},
      {t:"价格最低",c:false,e:"低价不是紫牛除非低到不可思议"}]},
  { id:6, name:"价值包装", en:"$100M Offers", emoji:"💰", book:"$100M Offers", author:"Alex Hormozi", year:2021, color:"#f39c12", coverId:11948182,
    one:"让报价好到无法拒绝", tags:["定价策略","产品包装"],
    idea:"价值=(理想结果×实现概率)÷(时间×努力)。拉高感知价值比降价有效。",
    steps:[{n:"识别理想结果",d:"客户真正想要的最终状态。不是产品功能，是功能带来的画面。'不是钻头是墙上那个洞，不是洞是挂上全家福的温馨客厅'"},{n:"列出所有障碍",d:"购买前+购买后的障碍(用不会/没时间/怕失败…)。至少列10个——每个障碍都是一个价值点"},{n:"每个障碍→解决方案",d:"产品功能/附加服务/工具/模板/社群/1对1辅导/保证承诺。优先选高价值低成本的"},{n:"报价堆叠",d:"核心产品+3-5个增值组件+保证。每个组件标注独立价值，加总vs实际售价让差距触目惊心"},{n:"增强器",d:"真实的稀缺+紧迫+风险消除保证(退款/效果保证)。给报价起一个有吸引力的名字"}],
    traps:["赠品堆砌凑数","不敢定高价","没有保证","只描述功能不描述结果"],
    combos:[{with:"六大影响力",how:"Offers中的稀缺性和保证都是影响力原则的具体应用。两者配合精确设计转化路径"},{with:"品牌故事SB7",how:"SB7解决'为什么选你'(情感层面)，Offers解决'值不值'(理性层面)"},{with:"紫牛",how:"产品本身足够紫牛的话，Offers的说服难度大幅降低"}],
    q:"客户说'太贵了'最可能原因？", opts:[
      {t:"价格确实太高",c:false,e:"价格相对于感知价值"},
      {t:"客户没钱",c:false,e:"大多数不是没钱是不觉得值"},
      {t:"感知价值不够高",c:true,e:"价格不是问题价值才是"},
      {t:"竞品更便宜",c:false,e:"报价无法抗拒竞品价格不重要"}]},
  { id:7, name:"上瘾模型", en:"Hooked", emoji:"🔄", book:"Hooked", author:"Nir Eyal", year:2014, color:"#1abc9c", coverId:12511799,
    one:"构建用户习惯的四步循环", tags:["产品留存","用户粘性"],
    idea:"触发→行动→可变奖赏→投入。'可变'是关键——可预测让人满足，不可预测让人上瘾。",
    steps:[{n:"触发 Trigger",d:"外部触发(推送/广告/朋友推荐)起步，目标是建立内部触发——当用户感到某种情绪时自动想到你的产品"},{n:"行动 Action",d:"行为=动机+能力+触发。核心操作要极简——减少步骤、减少思考、减少等待"},{n:"可变奖赏 Variable Reward",d:"三种类型：社交(点赞/认可)、猎物(刷到好内容/好deal)、自我(完成任务/技能提升)。可变性是核心"},{n:"投入 Investment",d:"用户留下的数据/内容/关系/学习成本让离开变难。投入→产品更好→增强下一次触发"}],
    traps:["上瘾=游戏化","只靠外部触发","奖赏太可预测","投入环节缺失"],
    combos:[{with:"STEPPS",how:"Hook解决'让老用户留下来'，STEPPS解决'让老用户带新用户来'。留存+传播双引擎"},{with:"六大影响力",how:"承诺一致性强化投入环节，社会认同强化社交奖赏"},{with:"价值包装",how:"Offers解决首次转化，Hook解决转化后的留存。先让人买再让人留"}],
    q:"为什么不断刷短视频？", opts:[
      {t:"内容很好",c:false,e:"内容是基础但机制才关键"},
      {t:"不知道下一条是什么",c:true,e:"不可预测奖赏是习惯核心"},
      {t:"推送通知",c:false,e:"推送是外部触发停不下来靠可变奖赏"},
      {t:"无聊",c:false,e:"无聊是内部触发但不能解释为什么是刷视频"}]},
  { id:8, name:"内容营销飞轮", en:"They Ask You Answer", emoji:"📝", book:"They Ask, You Answer", author:"Marcus Sheridan", year:2017, color:"#16a085", coverId:13158050,
    one:"用诚实回答用户问题驱动增长", tags:["内容策略","信任建设"],
    idea:"最好的营销不是推销是回答。成为行业里最诚实的品牌——包括讨论价格、缺点、竞品。",
    steps:[{n:"价格与费用 Pricing",d:"用户最想知道但品牌最不想说的。不是列价格表，而是诚实讨论影响价格的因素。当别人都藏着价格，你的透明就是最大差异化"},{n:"问题与缺点 Problems",d:"诚实讨论产品/行业的不足、不适合的人群。主动说缺点=极度可信——'连缺点都告诉我，其他肯定也是真的'"},{n:"对比 Versus",d:"用户一定会比较。你不写他们去别处找。关键：公正客观不踩竞品，态度是'帮你做最适合的选择'"},{n:"评测与排名 Reviews",d:"'2024年最好的5款XX'。即使你不是第一也没关系——诚实建立的信任比排名有力"},{n:"基础概念 What Is",d:"用户对术语、流程的基础问题。教育用户→建立权威→用户自然选你"}],
    traps:["只写安全内容","不敢提竞品","期望立即见效","内容和销售脱节"],
    combos:[{with:"定位理论",how:"定位决定你在哪个领域建立权威，内容飞轮是建立权威的执行方法"},{with:"SUCCESs",how:"选题来自They Ask You Answer，每篇内容的写法用SUCCESs优化粘性"},{with:"STEPPS",how:"回答用户问题的内容本身有高实用价值，再叠加STEPPS其他维度增强传播"}],
    q:"哪种内容最容易建立信任？", opts:[
      {t:"产品10大优势",c:false,e:"这是广告不是内容营销"},
      {t:"产品不适合哪些人",c:true,e:"主动说缺点让人觉得极度可信"},
      {t:"行业趋势报告",c:false,e:"有价值但不直接建立信任"},
      {t:"创始人创业故事",c:false,e:"增加喜好但不是最直接信任"}]}
];

// 每个场景对应金字塔支柱：0定战略 1做表达 2促转化 3保留存
const SCENES = [
  // 定战略
  {t:"我的品牌应该怎么定位？",p:0,s:5,l:"品牌定位",pillar:0,w:"定位是一切营销动作的起点——先搞清楚你在用户心智中的位置，后面的内容、文案、包装才有方向。",prompts:["帮我分析XX行业的竞争格局，找到定位机会","我的产品是XX，目标用户是XX，帮我做定位","诊断一下我们现在的品牌定位有什么问题"]},
  {t:"帮我讲好品牌故事",p:3,s:0,l:"品牌叙事",pillar:0,w:"客户是主角，品牌是导师。停止讲'我们多厉害'，开始讲'我们怎么帮你赢'。",prompts:["帮我用SB7框架写官网首页文案","我的品牌介绍'不够打动人'，帮我诊断","帮我为XX产品设计品牌叙事"]},
  {t:"产品同质化严重，怎么突围？",p:5,s:0,l:"产品差异化",pillar:0,w:"紫牛思维：列出竞品都在做的事然后别跟。要么某维度做到10倍好，要么砍掉标配反常识，要么服务被忽视的细分人群。",prompts:["用紫牛框架帮我分析XX产品怎么做出差异化","列出XX品类的标准动作，帮我找反常识的突破口","我的产品和竞品太像了，帮我设计差异化策略"]},
  {t:"竞品太多，怎么脱颖而出？",p:0,s:5,l:"竞争突围",pillar:0,w:"定位帮你找心智空位，紫牛让产品本身成为最强证据。先定位再紫牛，顺序不能反。",prompts:["XX行业竞争激烈，帮我找到可占据的心智位置","分析XX品类的心智地图，找出空白机会","竞品有ABC，我们怎么做出区隔？"]},
  // 做表达
  {t:"这条内容为什么火了？",p:1,s:2,l:"爆款分析",pillar:1,w:"内容传播有规律可循。STEPPS帮你从6个维度拆解爆款的底层机制，不再凭感觉。",prompts:["用STEPPS帮我分析这条内容为什么火了：[贴内容]","我这条内容发了没效果，帮我诊断哪里出了问题","帮我策划一条关于XX的有传播力的内容"]},
  {t:"帮我写有力的卖点文案",p:2,s:4,l:"文案撰写",pillar:1,w:"信息的粘性决定受众能不能记住你说的话。SUCCESs六要素帮你把'说了等于没说'变成'过耳不忘'。",prompts:["帮我优化这段文案让它更有力：[贴文案]","我的产品卖点是XX，帮我写一句有粘性的表达","这段介绍为什么'没感觉'？帮我诊断"]},
  {t:"不知道该写什么内容",p:8,s:1,l:"内容策略",pillar:1,w:"从用户最想知道但你最不想说的开始——价格、缺点、竞品对比。这反而是最有效的内容。",prompts:["我做XX行业，帮我用Big 5框架生成内容选题","帮我做一份一个月的内容日历","我应该先写哪些内容？帮我排优先级"]},
  {t:"写出来的文案没人看？",p:2,s:1,l:"文案粘性",pillar:1,w:"先用SUCCESs打磨信息质量——简单、意外、具体、可信、情感、故事；再用STEPPS设计传播——社交货币、触发器、情绪。",prompts:["帮我诊断这段文案为什么没传播力：[贴文案]","用SUCCESs+STEPPS帮我重写这段介绍","我的卖点用户记不住，怎么改？"]},
  {t:"品牌介绍太长没人看完？",p:2,s:3,l:"信息精简",pillar:1,w:"SUCCESs的Simple：找到核心砍掉其他。不是变短，是找到那一个最重要的点用最精炼方式表达。",prompts:["帮我精简这段品牌介绍，保留核心信息","这段3000字怎么压缩成3句有粘性的话？","用户3秒就划走，怎么抓住注意力？"]},
  {t:"小红书/抖音怎么涨粉？",p:1,s:8,l:"社交增长",pillar:1,w:"STEPPS设计传播力+内容飞轮保证持续产出。先让单条有传播基因，再让选题来自用户真问题。",prompts:["帮我策划一条小红书爆款内容选题","我的账号涨粉慢，用STEPPS帮我诊断","XX品类在小红书怎么做内容矩阵？"]},
  // 促转化
  {t:"怎么让产品更有吸引力？",p:6,s:5,l:"产品包装",pillar:2,w:"重新设计报价比降价有效得多。Hormozi的价值方程式帮你拉高感知价值而不是降低价格。",prompts:["帮我为XX产品设计一个无法拒绝的报价方案","我的产品定价XX，客户说贵了，帮我诊断","帮我做一个报价堆叠，让总价值远超售价"]},
  {t:"用户看了不买怎么办？",p:4,s:6,l:"转化优化",pillar:2,w:"转化的关键不是更多信息，是更好地触发决策的心理机制。6个影响力原则帮你找到卡点。",prompts:["审查一下我的销售页，哪些影响力原则没用到","帮我设计一个促销活动的说服策略","我的转化率低，帮我分析卡在哪个环节"]},
  {t:"怎么做促销活动？",p:4,s:6,l:"促销策划",pillar:2,w:"好的促销不是打折，是把影响力原则自然嵌入活动机制——互惠、社会认同、稀缺要配合使用。",prompts:["帮我设计一场XX主题的促销活动","用影响力原则帮我优化这个活动方案","怎么让促销活动既有效果又不伤品牌"]},
  {t:"落地页转化率低？",p:4,s:3,l:"落地页优化",pillar:2,w:"影响力原则+SB7叙事。先确保故事结构对（客户主角、痛点、导师、计划、CTA），再叠加强影响力（社会认同、稀缺、保证）。",prompts:["用SB7+影响力帮我审查这个落地页","我的落地页跳出率高，帮我诊断","帮我优化这个销售页的转化逻辑"]},
  {t:"客户总是犹豫不决？",p:4,s:6,l:"说服决策",pillar:2,w:"犹豫=信息不足或信任不足。影响力里的社会认同、权威、保证能消除顾虑；价值包装让'值不值'一目了然。",prompts:["客户总说'考虑一下'，怎么设计说服策略？","帮我设计一个消除购买顾虑的流程","客户比价比半天不定，怎么破？"]},
  {t:"新品上市怎么推广？",p:6,s:1,l:"新品上市",pillar:2,w:"价值包装让新品报价有吸引力，STEPPS设计传播让早期用户主动谈论。先让首批用户觉得值，再让他们愿意分享。",prompts:["帮我的新品设计上市推广方案","新品冷启动，怎么设计首批用户策略？","新品定价和传播怎么配合？"]},
  // 保留存
  {t:"用户用一次就走了",p:7,s:null,l:"用户留存",pillar:3,w:"留存问题的根源通常是习惯循环没建立起来——触发、行动、奖赏、投入，看哪个环节断了。",prompts:["用Hook模型帮我诊断产品的留存问题","帮我设计一个让用户养成习惯的机制","分析XX竞品为什么让人上瘾"]},
  {t:"日活/月活下降怎么办？",p:7,s:null,l:"活跃度下滑",pillar:3,w:"上瘾模型诊断：内部触发建立了没？核心行动够简单吗？奖赏是否可变？用户有没有投入（数据/关系/习惯）？",prompts:["我的产品日活下降，用Hook模型帮我诊断","用户为什么渐渐不爱来了？帮我分析","怎么设计可变奖赏提升回访？"]},
  {t:"怎么提高复购率？",p:7,s:4,l:"复购提升",pillar:3,w:"上瘾模型建立习惯循环，影响力中的承诺一致强化——用户已买过=小承诺，设计阶梯让复购变成自然下一步。",prompts:["帮我设计一个提高复购的机制","用户买过一次就不来了，怎么破？","用Hook+影响力帮我设计会员复购策略"]},
];

// ============================================================
// === DATA END === (以上为数据区域，以下为通用模板，无需修改)
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
  const pillarRefs = useRef([null,null,null,null]);
  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(text);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };
  const INSTALL_CMD = SITE.installCmd;
  if (!order.current) order.current = [...Array(FW.length).keys()].sort(() => Math.random() - 0.5);

  const filtered = search ? FW.filter(f => (f.name + f.en + f.one + f.tags.join("")).toLowerCase().includes(search.toLowerCase())) : FW;
  const ACCENT = SITE.accentColor || "#f0c040";
  const T = { bg: "#faf8f5", card: "#fff", border: "#e7e5e4", borderHover: "#d6d3d1", text: "#1c1917", textMuted: "#57534e", textDim: "#78716c", textFaint: "#a8a29e", codeBg: "#f5f5f4", accent: ACCENT, modalOverlay: "rgba(0,0,0,0.4)" };
  const s = { card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", cursor: "pointer", transition: "all .15s", marginBottom: 8 }, tag: { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: 11, background: T.codeBg, color: T.textDim, marginRight: 5 } };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif", fontSize: 14 }}>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 60px"}}>

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

        {/* Nav - 标签式导航 */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
          {[["首页","home"],["浏览","browse"],["诊断","diagnose"],["测试","quiz"]].map(([lb,v]) => (
            <div key={v} onClick={() => { setView(v); setScene(null); setQi(0); setScore(0); setQa(null); setDone(false); setWrongFwIds([]); order.current=[...Array(FW.length).keys()].sort(()=>Math.random()-0.5); }}
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
                <div><span style={{ fontWeight: 600, color: T.text }}>{PYRAMID.length} 支柱全链路</span> — {PYRAMID.map(p=>p.pillar).join("→")}</div>
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
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color+"60"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: T.text }}>使用方法</div>
          <div style={{ position: "relative", paddingLeft: 0 }}>
            <div style={{ position: "absolute", left: 27, top: 28, bottom: 28, width: 2, background: `linear-gradient(180deg,${SITE.usageSteps[0]?.color||ACCENT} 0%,${SITE.usageSteps[1]?.color||ACCENT} 50%,${SITE.usageSteps[2]?.color||ACCENT} 100%)`, borderRadius: 1 }} />
            {SITE.usageSteps.map((m, i) => (
              <div key={i} style={{ position: "relative", display: "flex", gap: 14, padding: "16px 18px 16px 56px", marginBottom: i<2?12:0, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, borderLeft: `4px solid ${m.color}`, transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: m.color, border: `3px solid ${T.bg}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", zIndex: 1 }}>{(m.step!=null)?m.step:i+1}</span>
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
          {/* 四大支柱快速导航 */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            {PYRAMID.map((p, pi) => {
              const hasMatch = p.ids.some(id => filtered.some(f => f.id === id));
              if (!hasMatch) return null;
              return (
                <div key={pi} onClick={() => document.getElementById("browse-pillar-"+pi)?.scrollIntoView({behavior:"smooth"})}
                  style={{padding:"8px 14px",borderRadius:8,background:p.color+"18",border:`1px solid ${p.color}40`,cursor:"pointer",fontSize:12,fontWeight:600,color:p.color,transition:"all .15s"}}
                  onMouseEnter={e => { e.currentTarget.style.background = p.color+"25"; e.currentTarget.style.borderColor = p.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.color+"18"; e.currentTarget.style.borderColor = p.color+"40"; }}>
                  {pi+1}. {p.pillar}
                </div>
              );
            })}
          </div>
          {/* 按支柱分组展示 */}
          {PYRAMID.map((p, pi) => {
            const ids = p.ids.filter(id => filtered.some(f => f.id === id));
            if (!ids.length) return null;
            return (
              <div key={pi} id={"browse-pillar-"+pi} style={{marginBottom:24}}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, borderLeft: `4px solid ${p.color}`, paddingLeft: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: p.color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{pi+1}</span>
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
                        onMouseEnter={e => { e.currentTarget.style.borderColor = p.color+"60"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "space-between" }}>
                          <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{fw.name} <span style={{ fontWeight: 400, fontSize: 12, color: T.textDim }}>{fw.en}</span></div>
                            <div style={{ fontSize: 11, color: T.textDim, marginBottom: 6 }}>《{fw.book}》{fw.author} · {fw.year}</div>
                            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>{fw.one}</div>
                            <div>{fw.tags.map(t => <span key={t} style={{ ...s.tag, background: p.color+"18", color: p.color, border: `1px solid ${p.color}40` }}>{t}</span>)}</div>
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
          {/* 顶部四步快速导航 */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            {PYRAMID.map((p, pi) => {
              const group = SCENES.filter(sc => sc.pillar === pi);
              if (!group.length) return null;
              return (
                <div key={pi} onClick={() => pillarRefs.current[pi]?.scrollIntoView({behavior:"smooth"})}
                  style={{padding:"8px 14px",borderRadius:8,background:p.color+"20",border:`1px solid ${p.color}50`,cursor:"pointer",fontSize:12,fontWeight:600,color:p.color,transition:"all .15s"}}
                  onMouseEnter={e => { e.currentTarget.style.background = p.color+"30"; e.currentTarget.style.borderColor = p.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.color+"20"; e.currentTarget.style.borderColor = p.color+"50"; }}>
                  {pi+1}. {p.pillar}
                </div>
              );
            })}
          </div>
          {/* 四大支柱：向下箭头流程 */}
          <div style={{position:"relative",paddingLeft:28}}>
            {/* 左侧垂直流程线：贯穿四大支柱 */}
            <div style={{position:"absolute",left:11,top:16,bottom:16,width:3,background:"linear-gradient(180deg,#e74c3c 0%,#e67e22 25%,#3498db 50%,#1abc9c 100%)",borderRadius:2}} />
            {PYRAMID.map((p, pi) => {
              const group = SCENES.filter(sc => sc.pillar === pi);
              if (!group.length) return null;
              return (
                <div key={pi} ref={el => pillarRefs.current[pi]=el} style={{position:"relative",marginBottom:28,minHeight:48}}>
                  <div style={{ position: "absolute", left: 4, top: 12, width: 16, height: 16, borderRadius: "50%", background: p.color, border: `3px solid ${T.bg}`, boxSizing: "border-box", zIndex: 1 }} />
                  <div onClick={() => pillarRefs.current[pi]?.scrollIntoView({ behavior: "smooth" })}
                    style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer", transition: "all .15s", padding: "2px 0" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                    <span style={{ position: "relative", zIndex: 1, width: 36, height: 36, borderRadius: 10, background: p.color, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${T.bg}`, flexShrink: 0 }}>{pi+1}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{p.pillar}</div>
                      <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    {pi < PYRAMID.length - 1 && <span style={{ marginLeft: "auto", fontSize: 18, color: p.color+"80", flexShrink: 0 }}>↓</span>}
                  </div>
                  <div style={{ marginLeft: 48 }}>
                    {group.map((sc,i) => (
                      <div key={i} onClick={() => setScene(sc)} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${p.color}` }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderLeftColor = p.color; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderLeftColor = p.color + "60"; }}>
                        <div><div style={{ fontWeight: 600, marginBottom: 3, color: T.text }}>{sc.t}</div><span style={{ ...s.tag, background: p.color+"18", color: p.color, border: "1px solid "+p.color+"40" }}>{sc.l}</span></div>
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
            onMouseEnter={e => { e.currentTarget.style.borderColor = FW[scene.p].color+"60"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", gap: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: FW[scene.p].color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 700, color: T.text }}>{FW[scene.p].name}</div><div style={{ fontSize: 12, color: T.textMuted }}>{FW[scene.p].one}</div></div></div>
          </div>
          {scene.s !== null && <>
            <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, marginBottom: 6, marginTop: 10 }}>补充配合</div>
            <div onClick={() => { setSel(FW[scene.s]); setModalAns(null); }} style={{ ...s.card, padding: "14px 18px", borderLeft: `4px solid ${FW[scene.s].color}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = FW[scene.s].color+"60"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ display: "flex", gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: FW[scene.s].color, flexShrink: 0, marginTop: 6 }} /><div><div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{FW[scene.s].name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{FW[scene.s].one}</div></div></div>
            </div>
          </>}
          <div style={{ marginTop: 16, padding: "14px 16px", background: ACCENT+"12", borderRadius: 10, border: `1px solid ${ACCENT}30` }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginBottom: 3 }}>为什么推荐？</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>{scene.w}</div>
          </div>
          {scene.prompts && <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textDim, marginBottom: 8 }}>试试对你的 AI 说（prompt建议）</div>
            {scene.prompts.map((pr,i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "10px 14px", background: T.card, borderRadius: 8, marginBottom: 5, border: `1px solid ${T.border}`, lineHeight: 1.5, cursor: "default" }}>
              <span style={{ color: T.textDim, marginRight: 6 }}>▸</span>{pr}
            </div>)}
          </div>}
        </>}

        {/* QUIZ */}
        {view === "quiz" && !done && (() => { const fw = FW[order.current[qi]]; return <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div><div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>{SITE.subtitle}测试</div><div style={{ fontSize: 11, color: T.textDim }}>{FW.length}道题 · 选完可看解析</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{score}<span style={{ fontSize: 12, color: T.textDim }}>/{FW.length}</span></div><div style={{ fontSize: 11, color: T.textDim }}>当前得分</div></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
            {order.current.map((fwId, i) => {
              const isCurrent = i===qi, isPast = i<qi;
              const wasWrong = isPast && wrongFwIds.includes(fwId);
              let dotBg = T.border, dotColor = T.textDim;
              if (isCurrent) { dotBg = fw.color+"30"; dotColor = fw.color; }
              else if (isPast) { dotBg = wasWrong ? "#ef444420" : "#22c55e20"; dotColor = wasWrong ? "#ef4444" : "#22c55e"; }
              return <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: dotBg, color: dotColor, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i+1}</div>;
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "12px 14px", background: T.card, borderRadius: 10, border: `1px solid ${fw.color}40` }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: fw.color, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{PYRAMID.findIndex(p=>p.ids.includes(fw.id))+1 || 0}</span>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{fw.name}</div><div style={{ fontSize: 11, color: T.textDim }}>{fw.en}</div></div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, lineHeight: 1.5, color: T.text }}>{fw.q}</div>
          {fw.opts.map((o,i) => {
            const picked = qa===i, show = qa!==null;
            let bg = T.card, bd = T.border;
            if (show && picked) { bg = o.c ? "#22c55e12" : "#ef444412"; bd = o.c ? "#22c55e50" : "#ef444450"; }
            else if (show && o.c) { bg = "#22c55e10"; bd = "#22c55e40"; }
            return <div key={i} style={{ marginBottom: 5 }}>
              <div onClick={() => { if (qa===null) { setQa(i); if(o.c) setScore(s=>s+1); }}}
                style={{ padding: "11px 14px", borderRadius: 10, cursor: show?"default":"pointer", background: bg, border: `1px solid ${bd}`, fontSize: 13, transition: "all .15s", color: T.text }}>
                {o.t}{show && o.c ? " ✓" : ""}{show && picked && !o.c ? " ✗" : ""}
              </div>
              {show && (picked || o.c) && <div style={{ fontSize: 11, color: T.textMuted, padding: "6px 14px 0" }}>{o.e}</div>}
              {show && picked && !o.c && <div onClick={() => setSel(fw)} style={{ fontSize: 11, color: fw.color, cursor: "pointer", padding: "6px 14px 0", fontWeight: 600 }}>→ 查看该方法论详情</div>}
            </div>;
          })}
          {qa !== null && <button onClick={() => {
            const pickedCorrect = fw.opts[qa].c;
            if (!pickedCorrect) setWrongFwIds(prev => [...prev, fw.id]);
            if (qi<FW.length-1) { setQi(q=>q+1); setQa(null); } else setDone(true);
          }}
            style={{ marginTop: 16, padding: "11px 0", borderRadius: 10, background: ACCENT, color: "#000", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", width: "100%" }}>{qi<FW.length-1?"下一题 →":"查看结果"}</button>}
        </>; })()}

        {view === "quiz" && done && <div style={{textAlign:"center",paddingTop:20}}>
          <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", color: T.text, marginBottom: 6 }}>{score>=FW.length-1?SITE.subtitle+"大师":score>=Math.ceil(FW.length*0.67)?"进阶玩家":score>=Math.ceil(FW.length*0.44)?"学徒":"新手"}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: T.text }}>{score}<span style={{ fontSize: 16, color: T.textDim }}>/{FW.length}</span></div>
          <div style={{ fontSize: 15, fontWeight: 700, margin: "6px 0", color: score>=FW.length-1?"#22c55e":score>=Math.ceil(FW.length*0.67)?ACCENT:"#e67e22" }}>{score>=FW.length-1?"已掌握精髓":score>=Math.ceil(FW.length*0.67)?"基础扎实":score>=Math.ceil(FW.length*0.44)?"继续加油":"建议多浏览"}</div>
          <div style={{ color: T.textDim, fontSize: 12, marginBottom: 20 }}>{score>=FW.length-1?"下一步实战运用。":score>=Math.ceil(FW.length*0.67)?"复习答错的理论。":"建议从浏览模式开始了解。"}</div>
          {wrongFwIds.length > 0 && <div style={{ textAlign: "left", marginBottom: 20, padding: "14px 18px", background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>建议复习以下方法论</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[...new Set(wrongFwIds)].map(id => {
                const f = FW[id];
                return <div key={id} onClick={() => setSel(f)} style={{ padding: "8px 14px", borderRadius: 8, background: f.color+"18", border: `1px solid ${f.color}40`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: f.color }}
                  onMouseEnter={e => { e.currentTarget.style.background = f.color+"25"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = f.color+"18"; }}>{f.name}</div>;
              })}
            </div>
          </div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setQi(0);setScore(0);setQa(null);setDone(false);setWrongFwIds([]);order.current=[...Array(FW.length).keys()].sort(()=>Math.random()-0.5); }}
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
                <img src={`https://covers.openlibrary.org/b/id/${sel.coverId}-M.jpg`} alt="" style={{ width: 72, height: 108, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
              ) : null}
              <span style={{ width: 72, height: 108, display: sel.coverId?"none":"flex", alignItems: "center", justifyContent: "center", background: T.codeBg, borderRadius: 8, fontSize: 32, flexShrink: 0, border: `1px solid ${T.border}` }}>{sel.emoji || sel.name?.[0] || "?"}</span>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{sel.name}</div><div style={{ color: T.textDim, fontSize: 12 }}>《{sel.book}》{sel.author} · {sel.year}</div></div>
            </div>
            <span onClick={() => setSel(null)} style={{ cursor: "pointer", color: T.textDim, fontSize: 18, padding: "4px 8px" }}>✕</span>
          </div>
          <div style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.8, padding: 14, background: T.codeBg, borderRadius: 10, borderLeft: `4px solid ${sel.color}`, marginBottom: 20 }}>{sel.idea}</div>

          <div style={{ fontWeight: 700, marginBottom: 10, color: T.text }}>核心框架</div>
          {sel.steps.map((st,i) => <div key={i} style={{ display: "flex", gap: 10, padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 5 }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: sel.color+"22", color: sel.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</span>
            <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: T.text }}>{st.n}</div><div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>{st.d}</div></div>
          </div>)}

          <div style={{ fontWeight: 700, margin: "18px 0 8px", color: T.text }}>常见误区</div>
          {sel.traps.map((t,i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "7px 12px", background: "#fef2f2", borderRadius: 6, borderLeft: "2px solid #ef4444", marginBottom: 4 }}>{t}</div>)}

          {sel.combos && <><div style={{ fontWeight: 700, margin: "18px 0 8px", color: T.text }}>组合使用</div>
          {sel.combos.map((c,i) => <div key={i} style={{ fontSize: 12, color: T.textMuted, padding: "10px 14px", background: T.codeBg, borderRadius: 8, marginBottom: 5, lineHeight: 1.6, border: `1px solid ${T.border}` }}>
            <span style={{ fontWeight: 600, color: sel.color }}>{sel.name} + {c.with}</span>
            <span style={{ color: T.textDim }}> — {c.how}</span>
          </div>)}</>}

          <div style={{ background: T.codeBg, borderRadius: 12, padding: 18, marginTop: 18, border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: T.text }}>小测试</div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: T.text }}>{sel.q}</div>
            {sel.opts.map((o,i) => {
              const picked = modalAns===i, show = modalAns!==null;
              let bg = T.card, bd = T.border;
              if (show && picked) { bg = o.c?"#22c55e12":"#ef444412"; bd = o.c?"#22c55e50":"#ef444450"; }
              else if (show && o.c) { bg="#22c55e10"; bd="#22c55e40"; }
              return <div key={i} style={{ marginBottom: 5 }}>
                <div onClick={() => { if(modalAns===null) setModalAns(i); }}
                  style={{ padding: "10px 14px", borderRadius: 8, cursor: show?"default":"pointer", background: bg, border: `1px solid ${bd}`, fontSize: 13, transition: "all .15s", color: T.text }}>
                  {o.t}{show&&o.c?" ✓":""}{show&&picked&&!o.c?" ✗":""}
                </div>
                {show && (picked||o.c) && <div style={{ fontSize: 11, color: T.textMuted, padding: "3px 14px" }}>{o.e}</div>}
              </div>;
            })}
          </div>
        </div>
      </div>}
    </div>
  );
}

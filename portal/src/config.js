// 知识 Skill 列表
export const KNOWLEDGE_SKILLS = [
  {
    id: "marketing",
    name: "营销方法论",
    one: "定位、文案、爆款、转化、留存",
    color: "#f0c040",
    frameworkCount: 9,
    bookCount: 9,
    comingSoon: false,
    showcasePath: "/showcases/marketing/",
    installCmd: "clawhub install marketing-playbook",
  },
  {
    id: "strategy",
    name: "战略方法论",
    one: "行业分析、战略制定、护城河、颠覆评估",
    color: "#4a90d9",
    frameworkCount: 6,
    bookCount: 6,
    comingSoon: false,
    showcasePath: "/showcases/strategy/",
    installCmd: "clawhub install strategy-playbook",
  },
  {
    id: "sales",
    name: "销售方法论",
    one: "获客、需求理解、成交、谈判",
    color: "#e74c3c",
    frameworkCount: 6,
    bookCount: 6,
    comingSoon: false,
    showcasePath: "/showcases/sales/",
    installCmd: "clawhub install sales-playbook",
  },
  {
    id: "product",
    name: "产品方法论",
    one: "需求发现、方案验证、产品打造、市场扩展",
    color: "#06b6d4",
    frameworkCount: 6,
    bookCount: 6,
    comingSoon: false,
    showcasePath: "/showcases/product/",
    installCmd: "clawhub install product-playbook",
  },
];

// 元工具
export const META_SKILLS = [
  {
    id: "books-to-skill",
    name: "books-to-skill",
    label: "书籍转 Skill",
    one: "把书籍知识变成结构化 skill",
    input: "书籍/领域",
    output: "SKILL.md + references",
    pagePath: "/meta/books-to-skill",
    link: "https://github.com/your-org/books-to-skill/tree/main/meta/books-to-skill",
    desc: "将经典书籍中的方法论提炼为 agent 可用的结构化 skill。从核心书库选领域、为每本书提炼 reference、生成 SKILL.md 索引。是「造武器的武器」。",
  },
  {
    id: "skill-to-showcase",
    name: "skill-to-showcase",
    label: "Skill 转展示网页",
    one: "把 skill 数据变成可部署的展示网页",
    input: "skill 数据",
    output: "React 展示站",
    pagePath: "/meta/skill-to-showcase",
    link: "https://github.com/your-org/books-to-skill/tree/main/meta/skill-to-showcase",
    desc: "为任何领域的方法论 skill 自动生成交互式展示网页。输入 skill 数据，输出可部署的 React 单页应用，含首页、知识库、场景匹配、知识测试。",
  },
];

// 按身份推荐：2 种身份，咨询顾问下分子领域
export const PERSONAS = [
  { id: "developer", label: "我是 Skill 开发者", one: "把书变成 skill，把 skill 变成展示网页", color: "#9b59b6" },
  {
    id: "consultant",
    label: "我是咨询顾问",
    one: "用方法论 Skill 辅助分析和决策",
    color: "#b45309",
    subDomains: [
      { id: "marketing", name: "营销", color: "#f0c040", skId: "marketing" },
      { id: "strategy", name: "战略", color: "#4a90d9", skId: "strategy" },
      { id: "sales", name: "销售", color: "#e74c3c", skId: "sales" },
      { id: "product", name: "产品", color: "#06b6d4", skId: "product" },
    ],
  },
];

// 开发中的领域（meta skill 提及的）
export const COMING_SOON_DOMAINS = [
  { name: "心理", color: "#f97316" },
  { name: "领导力", color: "#a855f7" },
  { name: "个人成长", color: "#14b8a6" },
  { name: "沟通", color: "#ec4899" },
  { name: "思维决策", color: "#64748b" },
];

// 项目结构说明
export const PROJECT_STRUCTURE = `books-to-skill/
├── skills/
│   ├── marketing/          # 营销方法论 (9 frameworks)
│   ├── strategy/           # 战略方法论 (6 frameworks)
│   ├── sales/              # 销售方法论 (6 frameworks)
│   └── product/            # 产品方法论 (6 frameworks)
├── meta/
│   ├── books-to-skill/     # 书籍→skill 元工具
│   └── skill-to-showcase/ # skill→展示网页 元工具
├── showcases/
│   ├── marketing/          # 营销展示站
│   ├── strategy/           # 战略展示站
│   ├── sales/              # 销售展示站
│   └── product/            # 产品展示站
└── portal/                 # 门户网站`;

export const GITHUB_URL = "https://github.com/your-org/books-to-skill";

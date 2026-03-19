// Meta Skill 页面扩展内容：设计理念、模块、流程

export const BOOKS_TO_SKILL_PAGE = {
  designPhilosophy: {
    title: "设计理念",
    tagline: "造武器的武器 —— 不直接回答问题，而是生产能回答问题的 skill",
    principles: [
      { tag: "可操作", desc: "读完「怎么用」部分，agent 能直接执行" },
      { tag: "有场景", desc: "从用户任务出发，不是理论概述" },
      { tag: "有判断", desc: "不只说怎么做，还说做得好不好、何时不该用" },
      { tag: "有连接", desc: "方法论网络中的节点，可组合使用" },
      { tag: "有人味", desc: "大白话写，像跟懂行的朋友聊天" },
    ],
  },
  coreAssets: {
    title: "核心资产",
    items: [
      {
        name: "核心书库",
        desc: "预先整理的精选书单，每本书含：书名、作者、核心框架名、方法论标签、最佳适用场景",
        stats: "16 个领域 · 90 本经典",
        domains: [
          { name: "营销与品牌", color: "#f0c040" },
          { name: "战略咨询", color: "#4a90d9" },
          { name: "销售与谈判", color: "#e74c3c" },
          { name: "产品与创新", color: "#06b6d4" },
          { name: "管理与组织", color: "#f97316" },
          { name: "领导力", color: "#a855f7" },
          { name: "个人成长", color: "#14b8a6" },
          { name: "沟通与表达", color: "#ec4899" },
          { name: "思维与决策", color: "#64748b" },
          { name: "创业", color: "#b45309" },
          { name: "人力资源", color: "#6366f1" },
          { name: "运营与供应链", color: "#22c55e" },
          { name: "设计与UX", color: "#0ea5e9" },
          { name: "数据与增长", color: "#8b5cf6" },
          { name: "应用心理学", color: "#f43f5e" },
          { name: "财务与投资", color: "#84cc16" },
        ],
      },
      {
        name: "已完成的范例",
        desc: "营销领域已完成打样",
        stats: "SKILL.md + 9 个 reference",
        detail: "可作为标准参考，复制到其他领域",
      },
    ],
  },
  workflow: {
    title: "生产流程",
    steps: [
      { n: 1, title: "选领域", desc: "从核心书库选领域，或验证新书后加入" },
      { n: 2, title: "提炼 reference", desc: "每本书一文件：定位、核心框架、怎么用、判断标准、常见误区、组合使用" },
      { n: 3, title: "生成索引 SKILL.md", desc: "方法论清单、使用方式、场景→方法论映射表" },
      { n: 4, title: "设计场景映射", desc: "用户真实表述 → 首选+补充方法论" },
      { n: 5, title: "测试验证", desc: "装备模式、实战模式、指定理论、边界测试" },
    ],
  },
  outputStructure: {
    title: "输出结构",
    tree: `[domain]/
├── SKILL.md              # 索引 skill（场景识别、方法论匹配）
└── references/
    ├── [框架1].md
    ├── [框架2].md
    └── ...`,
  },
};

export const SKILL_TO_SHOWCASE_PAGE = {
  designPhilosophy: {
    title: "设计理念",
    tagline: "Skill 的营销页面 —— 给用户看、让人了解、一键安装",
    principles: [
      { tag: "给人看的", desc: "营销页面不是技术文档" },
      { tag: "有亲和力", desc: "语气友好，突出领域独特价值" },
      { tag: "即开即用", desc: "生成后可本地预览或直接部署" },
    ],
  },
  pageTabs: {
    title: "生成的网页包含",
    tabs: [
      {
        name: "首页",
        label: "营销页",
        color: "#b45309",
        items: ["Skill 名称 + Slogan", "一键安装命令", "本 Skill 包含卖点", "使用场景 persona 卡片", "使用方法 3 步流程"],
      },
      {
        name: "浏览",
        label: "知识库",
        color: "#4a90d9",
        items: ["搜索框", "按支柱分组的方法论卡片", "详情 Modal：框架、误区、组合、小测试"],
      },
      {
        name: "诊断",
        label: "场景匹配",
        color: "#8b5cf6",
        items: ["按支柱分组的场景列表", "选场景 → 推荐方法论 + 理由", "可复制的 prompt 示例"],
      },
      {
        name: "测试",
        label: "知识检验",
        color: "#22c55e",
        items: ["N 道单选题（=方法论数量）", "九宫格进度、红绿反馈", "答错可跳转详情", "结果页：评级 + 复习建议"],
      },
    ],
  },
  workflow: {
    title: "生成流程",
    steps: [
      { n: 1, title: "确认输入", desc: "已有 skill、书库领域、或自定义方法论列表" },
      { n: 2, title: "准备数据", desc: "siteConfig、PYRAMID、FW、SCENES 四组数据" },
      { n: 3, title: "查找封面", desc: "从 Open Library 获取书籍封面" },
      { n: 4, title: "组装输出", desc: "填入 App.jsx 模板，输出完整 Vite 项目" },
    ],
  },
  outputStructure: {
    title: "输出结构",
    tree: `[skill]-showcase/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx`,
  },
};

export const META_CONTENT = {
  "books-to-skill": BOOKS_TO_SKILL_PAGE,
  "skill-to-showcase": SKILL_TO_SHOWCASE_PAGE,
};

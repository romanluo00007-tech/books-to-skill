# Books to Skill

将书籍转化为可复用的 AI 技能。

---

## 项目结构

```
books-to-skill/
├── skills/                    # 各领域知识 Skill
│   ├── marketing/             # 营销方法论 (9 frameworks)
│   ├── strategy/              # 战略方法论 (6 frameworks)
│   ├── sales/                 # 销售方法论 (6 frameworks)
│   └── product/               # 产品方法论 (6 frameworks)
├── meta/                      # 元工具 Meta Skill
│   ├── books-to-skill/        # 书籍 → Skill
│   └── skill-to-showcase/     # Skill → 展示网页
├── showcases/                 # 各领域展示站
│   ├── marketing/
│   ├── strategy/
│   ├── sales/
│   └── product/
└── portal/                    # 门户网站（统一入口）
```

---

## 快速开始

### 本地预览

```bash
npm run build
npm run preview
```

在浏览器打开 `http://localhost:3000`。

### 开发模式

```bash
npm run dev:portal      # 门户
npm run dev:marketing   # 营销展示站
# 其他 showcase 同理
```

---

## 部署

- **GitHub**：代码已推送至 [romanluo00007-tech/books-to-skill](https://github.com/romanluo00007-tech/books-to-skill)
- **Vercel**：导入该仓库即可自动构建部署，详见 [DEPLOY.md](./DEPLOY.md)

---

## 页面说明

| 路径 | 说明 |
|------|------|
| `/` | 门户首页 |
| `/meta/books-to-skill` | 书籍转 Skill 元工具说明 |
| `/meta/skill-to-showcase` | Skill 转展示网页元工具说明 |
| `/showcases/marketing/` | 营销方法论展示 |
| `/showcases/strategy/` | 战略方法论展示 |
| `/showcases/sales/` | 销售方法论展示 |
| `/showcases/product/` | 产品方法论展示 |

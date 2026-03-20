# Books to Skill

将书籍转化为可复用的 AI 技能。可 Fork 为模板，或直接使用。

---

## 项目结构

```
books-to-skill/
├── skills/                    # 各领域知识 Skill
│   ├── marketing/             # 营销方法论 (9 frameworks)
│   ├── strategy/              # 战略方法论 (6 frameworks)
│   ├── sales/                 # 销售方法论 (6 frameworks)
│   ├── product/               # 产品方法论 (6 frameworks)
│   └── case-library/          # 案例库 (创作者用，来源可追溯)
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

## 使用此模板（Fork 后的用户）

1. **Fork** 本仓库到你的 GitHub 账号
2. **配置 GitHub 链接**：在 `portal/` 下创建 `.env.local`（参考 `.env.example`）：
   ```bash
   cp portal/.env.example portal/.env.local
   ```
   编辑 `.env.local`，将 `YOUR_GITHUB_ORG` 改为你的 GitHub 用户名或组织名
3. **构建与预览**：
   ```bash
   npm run build
   npm run preview
   ```
4. **部署**：将你的 Fork 推送至 GitHub，按 [DEPLOY.md](./DEPLOY.md) 部署到 Vercel

---

## 个人配置（仅本地，不上传）

以下文件/目录包含你的个人配置，已加入 `.gitignore`，**不会随 git push 上传**：

| 文件 | 用途 | 说明 |
|------|------|------|
| `portal/.env.local` | 你的 GitHub 账号/组织 | 复制 `.env.example` 为 `.env.local`，填入 `VITE_GITHUB_ORG=你的用户名` |
| `dist/` | 构建产物 | 每次 `npm run build` 生成，无需提交 |
| `node_modules/` | 依赖 | 由 `npm install` 安装 |

**.gitignore 的作用**：被列在其中的文件，`git add` 时会自动忽略，因此不会进入提交、也不会被 push 到远程。你可以放心在 `.env.local` 里写自己的配置。

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

- **GitHub**：Fork 后推送到你自己的仓库
- **Vercel**：导入你的 Fork 仓库即可自动构建部署，详见 [DEPLOY.md](./DEPLOY.md)

---

## 页面说明

| 路径 | 说明 |
|------|------|
| `/` | 门户首页 |
| `/case-library` | 案例库（来源可追溯的商业案例，供创作者使用） |
| `/meta/books-to-skill` | 书籍转 Skill 元工具说明 |
| `/meta/skill-to-showcase` | Skill 转展示网页元工具说明 |
| `/showcases/marketing/` | 营销方法论展示 |
| `/showcases/strategy/` | 战略方法论展示 |
| `/showcases/sales/` | 销售方法论展示 |
| `/showcases/product/` | 产品方法论展示 |

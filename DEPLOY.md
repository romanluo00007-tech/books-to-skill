# 发布到 GitHub 与 Vercel

## 一、发布到 GitHub

```bash
cd "/Users/manluo/Documents/Ouraca/Ouraca Project/books-to-skill"

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/romanluo00007-tech/books-to-skill.git
git branch -M main
git push -u origin main
```

## 二、本地预览

```bash
npm run build
npm run preview
```

访问 `http://localhost:3000`。Meta 页面（`/meta/books-to-skill` 等）和 Showcase 页面均可正常访问。

## 三、部署到 Vercel

### 方式 A：Vercel 网页导入

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
2. 点击 **Add New Project**
3. **Import** 你的 `books-to-skill` 仓库
4. Vercel 会自动读取项目根目录的 `vercel.json`：
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
5. 点击 **Deploy** 完成部署

### 方式 B：Vercel CLI

```bash
npm i -g vercel
vercel
# 按提示登录并选择项目，首次会创建项目
```

## 四、路由与跳转说明

构建结果目录结构：

```
dist/
├── index.html          ← 门户首页 /，也用于 /meta/* SPA 回退
├── assets/
├── serve.json          ← 仅对 /meta/* 做 SPA fallback
├── showcases/
│   ├── marketing/      ← /showcases/marketing/
│   ├── strategy/       ← /showcases/strategy/
│   ├── sales/          ← /showcases/sales/
│   └── product/        ← /showcases/product/
```

- **门户首页**：`/` → Portal
- **Meta 页面**：`/meta/books-to-skill`、`/meta/skill-to-showcase` → Portal SPA 路由
- **展示页**：`/showcases/*` → 各自独立展示站

本地预览使用 `serve` + `serve.json`，仅对 `/meta/*` 做 SPA 回退，`/showcases/*` 正常返回静态文件。

## 五、可选：绑定自定义域名

在 Vercel 项目 **Settings → Domains** 中添加你的域名，并按提示完成 DNS 配置。

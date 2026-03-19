# 发布到 GitHub 与 Vercel

## 一、发布到 GitHub

```bash
# 1. 初始化 git（若尚未初始化）
git init

# 2. 添加远程仓库
git remote add origin https://github.com/你的用户名/books-to-skill.git

# 3. 提交并推送
git add .
git commit -m "feat: add deployment config for Vercel"
git branch -M main
git push -u origin main
```

## 二、部署到 Vercel

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

## 三、路由与跳转说明

构建结果目录结构：

```
dist/
├── index.html          ← 门户首页 /
├── assets/
├── showcases/
│   ├── marketing/      ← /showcases/marketing/
│   ├── strategy/       ← /showcases/strategy/
│   ├── sales/          ← /showcases/sales/
│   └── product/        ← /showcases/product/
```

- **门户首页**：`/` → Portal
- **展示页**：`/showcases/marketing/`、`/showcases/strategy/` 等 → 对应方法论展示站

各 showcase 的 Vite 配置已设置 `base: '/showcases/xxx/'`，静态资源路径正确，页面跳转和资源加载无需额外配置。

## 四、可选：绑定自定义域名

在 Vercel 项目 **Settings → Domains** 中添加你的域名，并按提示完成 DNS 配置。

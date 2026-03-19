# 将项目推送到 GitHub 的方法

## 前置条件

- 已安装 [Git](https://git-scm.com/)
- 拥有 [GitHub](https://github.com/) 账号

## 步骤一：初始化本地 Git 仓库

在项目根目录下执行：

```bash
cd "/Users/manluo/Documents/Ouraca/Ouraca Project/botlearn-marketing-knowledge"

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交
git commit -m "Initial commit: botlearn-marketing-knowledge"
```

## 步骤二：在 GitHub 上创建新仓库

1. 登录 [GitHub](https://github.com/)
2. 点击右上角 **+** → **New repository**
3. 填写仓库信息：
   - **Repository name**: `botlearn-marketing-knowledge`（或自定义名称）
   - **Description**: 可选，填写项目描述
   - **Public** 或 **Private**：按需选择
   - ⚠️ **不要**勾选 "Add a README file"（本地已有代码）
4. 点击 **Create repository**

## 步骤三：关联远程仓库并推送

创建仓库后，GitHub 会显示命令。在本地项目目录执行：

```bash
# 添加远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/botlearn-marketing-knowledge.git

# 推送到 GitHub（首次推送）
git branch -M main
git push -u origin main
```

如果使用 SSH 方式：

```bash
git remote add origin git@github.com:YOUR_USERNAME/botlearn-marketing-knowledge.git
git branch -M main
git push -u origin main
```

## 后续更新推送

之后每次修改代码后，执行：

```bash
git add .
git commit -m "你的提交说明"
git push
```

## 常见问题

### 1. 推送时要求输入用户名密码

GitHub 已不再支持密码认证，请使用：
- **Personal Access Token (PAT)**：在 GitHub → Settings → Developer settings → Personal access tokens 创建
- 或配置 **SSH Key**：更推荐，一次配置长期使用

### 2. 远程仓库已存在内容（如 README）

若在 GitHub 创建时勾选了 README，先拉取再推送：

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 3. 分支名称

如果本地默认分支是 `master` 而 GitHub 使用 `main`，可用 `git branch -M main` 重命名后再推送。

---

# 用 Vercel 发布，让其他人访问

你已关联 GitHub 和 Vercel，流程如下。

## 一、首次部署

1. 打开 [vercel.com](https://vercel.com) 并登录
2. 点击 **Add New...** → **Project**
3. 在 **Import Git Repository** 中选中 `botlearn-marketing-knowledge`
4. Vercel 会自动识别为 Vite 项目，默认配置通常是：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **Deploy**，等待构建完成

部署完成后会得到一个类似 `https://xxx.vercel.app` 的地址，即可分享给别人访问。

## 二、自动更新

Vercel 已连接 GitHub，之后每次在 GitHub 上推送（`git push`），Vercel 会自动重新部署，线上地址会自动更新。

## 三、自定义域名（可选）

在 Vercel 项目里：
1. 打开 **Settings** → **Domains**
2. 添加你自己的域名并按提示配置 DNS

## 常见问题

- **构建失败**：检查本地是否能成功执行 `npm run build`
- **页面空白**：确认 Vite 的 base 配置是否正确（一般无需修改）

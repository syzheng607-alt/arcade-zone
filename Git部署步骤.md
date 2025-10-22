# 🚀 使用 Git 和 GitHub 部署到 Vercel

## 📋 完整步骤清单

### ✅ 第一步：同意 Xcode 许可（一次性操作）

打开你的**终端**（Terminal.app），运行：

```bash
sudo xcodebuild -license
```

- 按**空格键**滚动到底
- 输入 `agree` 并回车
- 输入你的 Mac 密码（输入时不显示字符，正常）

---

### ✅ 第二步：初始化 Git 仓库

在终端中运行以下命令：

```bash
# 进入项目目录
cd "/Users/littlerock/Desktop/OKComputer_Arcade Game Site Design"

# 初始化 Git 仓库
git init

# 配置你的 Git 用户信息（如果还没配置过）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"

# 查看文件状态
git status
```

---

### ✅ 第三步：添加并提交文件

```bash
# 添加所有文件到暂存区
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "Initial commit: ArcadeZone gaming portal"

# 查看提交历史
git log --oneline
```

---

### ✅ 第四步：创建 GitHub 仓库

**方法 A：使用网页（推荐）**

1. 访问 https://github.com
2. 登录你的 GitHub 账户
3. 点击右上角的 **"+"** → **"New repository"**
4. 填写信息：
   - **Repository name**: `arcade-zone` 或 `okcomputer-arcade-site`
   - **Description**: "Modern arcade gaming portal website"
   - **Public** 或 **Private**（选择 Public 如果想让别人看到）
   - ⚠️ **不要**勾选 "Initialize with README"（我们已经有文件了）
5. 点击 **"Create repository"**
6. 复制显示的仓库 URL（类似：`https://github.com/你的用户名/arcade-zone.git`）

**方法 B：使用 GitHub CLI**

```bash
# 如果安装了 gh CLI
gh repo create arcade-zone --public --source=. --remote=origin --push
```

---

### ✅ 第五步：关联远程仓库并推送

在终端中运行（替换成你的 GitHub 仓库 URL）：

```bash
# 添加远程仓库（替换下面的 URL）
git remote add origin https://github.com/你的用户名/arcade-zone.git

# 查看远程仓库
git remote -v

# 推送到 GitHub
git branch -M main
git push -u origin main
```

如果遇到身份验证问题，GitHub 现在需要使用 **Personal Access Token**：

1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 推送时用 token 作为密码

---

### ✅ 第六步：在 Vercel 中部署

**方法 1：网页导入（最简单）**

1. 访问 https://vercel.com
2. 用 GitHub 账户登录
3. 点击 **"Add New..."** → **"Project"**
4. 点击 **"Import Git Repository"**
5. 选择你刚创建的 `arcade-zone` 仓库
6. 配置选项：
   - **Framework Preset**: 选择 "Other"
   - **Root Directory**: `./`（默认）
   - **Build Command**: 留空（静态网站不需要）
   - **Output Directory**: `./`（默认）
7. 点击 **"Deploy"**
8. 等待 1-2 分钟，部署完成！

**方法 2：使用 Vercel CLI**

如果你想用命令行：

```bash
# 安装 Node.js（如果还没有）
brew install node

# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

---

### ✅ 第七步：获取部署 URL

部署成功后，你会获得：

- 🌐 **生产环境 URL**: `https://arcade-zone.vercel.app`
- 🔍 **预览 URL**: `https://arcade-zone-git-main-你的用户名.vercel.app`
- 📊 **部署详情**: 在 Vercel 控制台查看

---

## 🔄 后续更新流程

每次修改代码后：

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "描述你的修改"

# 4. 推送到 GitHub
git push

# Vercel 会自动检测到推送并重新部署！🎉
```

---

## 🎯 关于 DEPLOYMENT_NOT_FOUND 错误

### 为什么会出现这个错误？

1. **访问了旧的/已删除的部署**
   - 每次推送 Git 都会创建新的预览部署
   - 旧的预览部署可能被清理

2. **URL 拼写错误**
   ```
   ❌ https://arcade-zonne.vercel.app  (拼写错误)
   ✅ https://arcade-zone.vercel.app   (正确)
   ```

3. **使用了临时部署 ID**
   ```
   ❌ https://arcade-zone-abc123.vercel.app  (临时部署)
   ✅ https://arcade-zone.vercel.app         (生产环境)
   ```

4. **部署失败或被删除**
   - 在 Vercel 控制台查看部署状态

### 如何避免？

✅ **始终使用生产环境 URL**
- 保存这个 URL：`https://你的项目名.vercel.app`
- 这是永久的（除非删除项目）

✅ **配置自定义域名**
- 在 Vercel 控制台 → Settings → Domains
- 添加你的域名（如果有）

✅ **在代码中使用环境变量**
```javascript
// 不要硬编码 URL
const API_URL = process.env.VERCEL_URL || 'localhost:3000'
```

✅ **定期检查 Vercel 控制台**
- 查看部署历史
- 确认部署状态

---

## 📚 有用的 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 撤销修改
git checkout -- filename

# 查看差异
git diff

# 创建新分支
git checkout -b feature-name

# 切换分支
git checkout main

# 合并分支
git merge feature-name

# 拉取最新代码
git pull
```

---

## ❓ 常见问题

### Q: 推送时要求输入用户名密码？

A: GitHub 已不支持密码认证，需要使用 Personal Access Token：
1. 生成 token: https://github.com/settings/tokens
2. 复制 token
3. 推送时用 token 代替密码

或者使用 SSH：
```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 GitHub
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 在 GitHub Settings → SSH Keys 中添加
```

### Q: Git 提示 "permission denied"？

A: 检查文件权限或使用 HTTPS/SSH 正确的 URL

### Q: Vercel 部署失败？

A: 
1. 查看 Vercel 控制台的构建日志
2. 确认所有文件都已推送到 GitHub
3. 检查 `vercel.json` 配置是否正确

### Q: 修改代码后网站没更新？

A: 
1. 确认已经 `git push` 推送到 GitHub
2. 在 Vercel 控制台查看是否触发了新部署
3. 清除浏览器缓存（Cmd + Shift + R）

---

## 🎉 完成！

现在你的工作流程是：

```
修改代码 → git add . → git commit -m "更新" → git push → Vercel 自动部署
```

**你的项目已准备好部署！** 🚀

有问题随时查看：
- Vercel 文档: https://vercel.com/docs
- GitHub 文档: https://docs.github.com
- Git 教程: https://git-scm.com/book/zh/v2



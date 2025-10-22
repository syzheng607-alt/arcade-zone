# ArcadeZone - Ultimate Gaming Portal

这是一个现代化的街机游戏门户网站。

## 🚀 部署到 Vercel

### 首次部署

1. 安装 Vercel CLI（如果还没有）：
```bash
npm install -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 在项目目录中运行：
```bash
cd "/Users/littlerock/Desktop/OKComputer_Arcade Game Site Design"
vercel
```

4. 按照提示操作：
   - Set up and deploy? **Yes**
   - Which scope? 选择你的账户
   - Link to existing project? **No**
   - What's your project's name? **arcade-zone** (或你喜欢的名称)
   - In which directory is your code located? **./**
   - Want to override the settings? **No**

### 后续部署

```bash
# 预览部署
vercel

# 生产部署
vercel --prod
```

## 📂 项目结构

```
.
├── index.html          # 主页
├── games.html          # 游戏列表页
├── purchase.html       # 购买页
├── contact.html        # 联系页
├── main.js            # 主要 JavaScript
├── resources/         # 图片资源
├── vercel.json        # Vercel 配置
└── README.md          # 项目文档
```

## 🔧 本地开发

使用任何本地服务器工具，例如：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# VS Code Live Server 扩展
```

## 📝 环境变量

本项目不需要环境变量（纯静态网站）。

## ⚠️ 常见问题

### DEPLOYMENT_NOT_FOUND 错误

如果遇到此错误：

1. **检查部署状态**：访问 [Vercel 控制台](https://vercel.com/dashboard)
2. **验证 URL**：确保使用正确的部署 URL
3. **重新部署**：运行 `vercel --prod`
4. **检查权限**：确认已登录正确的账户

### 资源加载问题

确保所有图片都在 `resources/` 目录中。

## 📄 许可证

MIT License



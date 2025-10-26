# 🚀 5分钟快速启动指南

## 立即开始前后端分离！

### 步骤 1: 创建 Supabase 账号（2分钟）⏱️

1. 打开浏览器访问：https://supabase.com
2. 点击 **"Start your project"**
3. 使用 GitHub 登录
4. 点击 **"New Project"**
5. 填写：
   - 项目名：`arcadezone`
   - 密码：随便设一个（记住它！）
   - 地区：`Northeast Asia (Tokyo)`
6. 点击 **"Create new project"**
7. 等待2分钟...

---

### 步骤 2: 获取密钥（1分钟）🔑

项目创建完成后：

1. 点击左侧 **Settings** → **API**
2. 复制两个值：
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhb... (很长的字符串)
   ```

---

### 步骤 3: 配置网站（30秒）⚙️

打开 `supabase-config.js`，替换：

```javascript
const SUPABASE_CONFIG = {
    url: 'https://你刚复制的项目URL',
    anonKey: '你刚复制的anon-key'
};
```

保存文件！

---

### 步骤 4: 创建数据库（30秒）💾

1. 在 Supabase Dashboard，点击 **SQL Editor**
2. 点击 **New query**
3. 复制 `database-schema.sql` 的全部内容
4. 粘贴，点击 **Run**
5. 看到 "Success" ✅

---

### 步骤 5: 启用认证（30秒）🔐

在每个 HTML 文件的 `<head>` 中添加：

```html
<!-- Supabase JS SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

在 `</body>` 前添加：

```html
<!-- Supabase 认证系统 -->
<script src="supabase-config.js"></script>
<script src="supabase-client.js"></script>
<script src="auth-supabase.js"></script>
```

---

### 步骤 6: 测试（30秒）✅

1. 打开浏览器访问 `index.html`
2. 看到 "Sign Up" 按钮
3. 点击注册一个账号
4. 成功！🎉

---

## 完整文件清单

需要在以下文件中添加脚本：

### 主页面
- ✅ `index.html`
- ✅ `games.html`
- ✅ `contact.html`
- ✅ `purchase.html`

### 游戏页面（iframe 包装器）
- ✅ `chessmaster.html`
- ✅ `snakegame.html`  
- ✅ `tetrisgame.html`
- ✅ `breakoutgame.html`

---

## HTML 模板

在每个文件中：

### 1. 在 `<head>` 中添加：

```html
<!-- Supabase JS SDK (CDN) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. 在导航栏中取消注释：

找到这行：
```html
<!-- TODO: 待后端开发完成后启用认证系统
<div id="auth-nav-container">
```

改为：
```html
<div id="auth-nav-container">
    <!-- 认证按钮会动态插入这里 -->
</div>
```

### 3. 在 `</body>` 前添加：

```html
<!-- Supabase 认证系统 -->
<script src="supabase-config.js"></script>
<script src="supabase-client.js"></script>
<script src="auth-supabase.js"></script>
```

---

## 游戏分数保存

在游戏文件中添加：

```javascript
// 游戏结束时
async function gameOver() {
    // 显示游戏结束画面
    showGameOver();
    
    // 保存分数（如果用户已登录）
    if (window.supabaseClient && window.supabaseClient.isAuthenticated()) {
        await window.supabaseClient.saveGameRecord(
            'snake',  // 游戏类型
            score,    // 分数
            null,     // 移动记录（可选）
            'completed'  // 结果
        );
        console.log('✅ 分数已保存！');
    }
}
```

---

## 调试技巧

### 检查连接状态

打开浏览器控制台（F12），运行：

```javascript
// 检查 Supabase 客户端
console.log(window.supabaseClient);

// 检查当前用户
console.log(window.supabaseClient.getCurrentUser());

// 测试数据库连接
await window.supabaseClient.getLeaderboard('snake', 5);
```

### 常见问题

**Q: 控制台显示 "Supabase config not found"**  
A: 确保 `supabase-config.js` 在其他脚本之前加载

**Q: 注册失败，提示 "Invalid API key"**  
A: 检查 API 密钥是否正确复制

**Q: 无法保存分数**  
A: 检查 RLS 策略是否正确创建（步骤4）

---

## 高级功能

### 显示排行榜

```javascript
async function showLeaderboard() {
    const result = await window.supabaseClient.getLeaderboard('snake', 10);
    
    if (result.success) {
        result.leaderboard.forEach((record, index) => {
            console.log(`${index + 1}. ${record.profiles.username}: ${record.score}`);
        });
    }
}
```

### 获取用户历史记录

```javascript
async function showUserHistory() {
    const result = await window.supabaseClient.getUserGameRecords('snake', 20);
    
    if (result.success) {
        console.log('你的游戏记录:', result.records);
    }
}
```

---

## 下一步

完成基础配置后，继续阅读：

1. 📖 `BACKEND_IMPLEMENTATION.md` - 详细实施指南
2. 📖 `BACKEND_TODO.md` - 完整功能列表
3. 📖 `SECURITY.md` - 安全建议

---

## 🎉 恭喜！

你的游戏网站现在有了：
- ✅ 安全的用户认证
- ✅ 云端数据存储
- ✅ 游戏分数保存
- ✅ 排行榜功能

**开始游戏吧！** 🎮✨


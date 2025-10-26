# 🧪 前后端分离测试指南

## 📋 测试清单

### 1️⃣ 认证系统测试

#### ✅ 用户注册
1. 访问 https://www.rockcavegames.com
2. 点击右上角 **Sign Up** 按钮
3. 填写信息：
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `Test123456`
   - 勾选同意条款
4. 点击 **Create Account**
5. ✅ **预期结果**: 收到成功提示，并且按钮变为用户名

#### ✅ 邮箱验证
1. 打开你的邮箱（注册时填写的邮箱）
2. 查找 Supabase 发送的验证邮件
3. 点击邮件中的验证链接
4. ✅ **预期结果**: 邮箱验证成功

#### ✅ 用户登录
1. 刷新页面或重新访问网站
2. 点击右上角 **Login** 按钮
3. 填写信息：
   - Email/Username: `test@example.com`
   - Password: `Test123456`
4. 点击 **Login**
5. ✅ **预期结果**: 登录成功，右上角显示用户名和 **Logout** 按钮

#### ✅ 用户登出
1. 点击右上角用户名旁的 **Logout** 按钮
2. ✅ **预期结果**: 退出登录，按钮变回 **Sign Up** / **Login**

#### ✅ 密码重置
1. 点击 **Login** 按钮
2. 点击 **Forgot password?**
3. 输入邮箱地址
4. 点击 **Send Reset Link**
5. ✅ **预期结果**: 收到重置密码邮件

---

### 2️⃣ 游戏数据保存测试

#### ✅ Chess Master 游戏记录
1. **登录账号**（必须先登录）
2. 访问 **Chess Master** 游戏
3. 玩一局游戏直到结束（胜利/失败/和棋）
4. 打开浏览器控制台（F12）
5. 查看控制台日志：
   ```
   ✅ Chess game connected to Supabase, user: test@example.com
   ✅ Game record saved successfully
   ```
6. ✅ **预期结果**: 看到成功保存的日志

#### ✅ 验证数据库记录
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目 → **Table Editor** → `game_records`
3. ✅ **预期结果**: 看到刚才保存的游戏记录，包含：
   - `game_type`: `chess`
   - `score`: 步数
   - `duration`: 游戏时长（秒）
   - `result`: `win` / `loss` / `draw`
   - `moves`: 游戏详细记录（JSON格式）

---

### 3️⃣ 用户个人中心测试

#### ✅ 访问个人中心
1. 登录后，点击右上角用户名
2. 选择 **Profile** 进入个人中心
3. ✅ **预期结果**: 看到：
   - 用户信息（用户名、邮箱）
   - 游戏记录列表
   - 统计数据（总游戏数、胜率等）

---

### 4️⃣ 多语言切换测试

#### ✅ 语言切换
1. 点击右上角的语言切换按钮（**中文** / **English**）
2. ✅ **预期结果**: 
   - 导航栏文字切换
   - 认证模态框文字切换
   - 游戏界面文字切换（Chess Master）

---

### 5️⃣ 移动端测试

#### ✅ 移动端认证
1. 用手机访问 https://www.rockcavegames.com
2. 测试注册/登录流程
3. ✅ **预期结果**: 模态框正常显示，表单可正常提交

#### ✅ 移动端游戏
1. 登录后访问 **Chess Master**
2. 玩一局游戏
3. ✅ **预期结果**: 游戏记录正常保存

---

## 🐛 常见问题排查

### ❌ 控制台显示 "Not logged in, game record not saved"
**原因**: 未登录
**解决**: 先登录账号，再玩游戏

### ❌ 控制台显示 "Failed to save game record"
**原因**: Supabase 连接失败或权限不足
**检查**:
1. `supabase-config.js` 中的 URL 和 `anonKey` 是否正确
2. 打开 Supabase Dashboard → **Authentication** → 检查是否启用邮箱认证
3. 打开 Supabase Dashboard → **Table Editor** → 检查 `game_records` 表的 RLS 策略

### ❌ 注册后收不到验证邮件
**原因**: Supabase 邮件服务未配置或被拦截
**解决**:
1. 检查垃圾邮件文件夹
2. 在 Supabase Dashboard → **Authentication** → **Email Templates** 中检查配置
3. 可以暂时禁用邮箱验证进行测试

### ❌ 游戏界面无法连接 Supabase
**原因**: `supabase-config.js` 未正确加载
**检查**:
1. 打开 Chrome DevTools → **Network** 标签
2. 刷新页面，查看 `supabase-config.js` 是否成功加载（状态码 200）
3. 在控制台输入 `window.SUPABASE_CONFIG`，检查是否有值

---

## ✅ 测试完成确认

完成以上所有测试后，确认以下功能正常：

- [ ] 用户注册
- [ ] 用户登录/登出
- [ ] 邮箱验证
- [ ] 密码重置
- [ ] Chess Master 游戏数据保存
- [ ] 数据库记录可查询
- [ ] 用户个人中心显示游戏记录
- [ ] 多语言切换
- [ ] 移动端适配

---

## 📊 数据库查询示例

如果想手动查询游戏记录，可以在 Supabase SQL Editor 中运行：

```sql
-- 查询所有游戏记录
SELECT * FROM game_records ORDER BY created_at DESC LIMIT 10;

-- 查询特定用户的游戏记录
SELECT * FROM game_records 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;

-- 统计每个用户的游戏数和胜率
SELECT 
  u.email,
  COUNT(*) as total_games,
  SUM(CASE WHEN g.result = 'win' THEN 1 ELSE 0 END) as wins,
  ROUND(100.0 * SUM(CASE WHEN g.result = 'win' THEN 1 ELSE 0 END) / COUNT(*), 2) as win_rate
FROM game_records g
JOIN auth.users u ON g.user_id = u.id
GROUP BY u.email;
```

---

## 🎉 下一步

测试完成后，可以继续：
1. 为其他游戏（Snake, Tetris, Breakout）添加数据保存功能
2. 在用户个人中心显示排行榜
3. 添加成就系统
4. 实现社交分享功能


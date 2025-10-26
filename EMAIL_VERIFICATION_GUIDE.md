# 📧 邮箱验证配置指南

## 🚨 当前问题

注册后提示 "Email not confirmed"，无法登录。

---

## ✅ 快速解决方案（用于测试）

### 方案 A：关闭邮箱验证（推荐测试时使用）

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 左侧菜单 → **Authentication** → **Providers**
4. 找到 **Email** 选项
5. **取消勾选** "Confirm email"
6. 点击 **Save**

✅ **完成！** 现在注册后可以直接登录，无需验证邮箱。

---

### 方案 B：手动验证已注册的用户

如果已经有用户注册但未验证：

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 左侧菜单 → **Authentication** → **Users**
3. 找到未验证的用户（显示 "Not confirmed"）
4. 点击用户
5. 点击右上角 **⋮** 菜单 → **Confirm Email**
6. 确认操作

✅ **完成！** 该用户现在可以登录了。

---

## 🔧 生产环境解决方案

### 选项 1：使用 Supabase 的内置邮件服务（免费）

**优点**: 零配置，立即可用
**缺点**: 
- 每天限制发送邮件数量
- 邮件可能被标记为垃圾邮件
- 发件人地址是 Supabase 官方邮箱

**配置步骤**:
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 左侧菜单 → **Authentication** → **Providers**
3. 确保 **Email** 选项中 "Confirm email" 已勾选
4. 左侧菜单 → **Authentication** → **Email Templates**
5. 自定义邮件模板（可选）

---

### 选项 2：配置自定义 SMTP（推荐生产环境）

使用你自己的邮件服务器（Gmail、SendGrid、AWS SES 等）。

#### 2.1 使用 Gmail SMTP

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 左侧菜单 → **Project Settings** → **Auth**
3. 滚动到 **SMTP Settings**
4. 填写以下信息：

```
Enable Custom SMTP: ✅ 勾选

Host: smtp.gmail.com
Port: 587
Sender email: your-email@gmail.com
Sender name: ArcadeZone
Username: your-email@gmail.com
Password: [Gmail App Password - 见下方获取方法]
```

5. 点击 **Save**

#### 获取 Gmail App Password（应用专用密码）

1. 访问 https://myaccount.google.com/apppasswords
2. 输入应用名称：`Supabase ArcadeZone`
3. 点击 **Create**
4. 复制生成的 16 位密码
5. 粘贴到 Supabase SMTP Password 字段

⚠️ **注意**: 你的 Google 账号需要启用两步验证才能创建应用专用密码。

---

#### 2.2 使用 SendGrid（推荐）

SendGrid 提供免费套餐（每天 100 封邮件）。

1. 注册 [SendGrid](https://sendgrid.com/) 账号
2. 创建 API Key：
   - Dashboard → **Settings** → **API Keys**
   - 点击 **Create API Key**
   - 选择 "Full Access"
   - 复制 API Key
3. 在 Supabase 配置：

```
Enable Custom SMTP: ✅ 勾选

Host: smtp.sendgrid.net
Port: 587
Sender email: noreply@yourdomain.com  (需要验证域名)
Sender name: ArcadeZone
Username: apikey  (固定值)
Password: [粘贴 SendGrid API Key]
```

4. 点击 **Save**

---

#### 2.3 使用 AWS SES（企业级）

AWS SES 非常便宜，每月前 62,000 封邮件免费。

1. 在 AWS 控制台创建 SES SMTP 凭证
2. 验证发件人邮箱或域名
3. 在 Supabase 配置：

```
Enable Custom SMTP: ✅ 勾选

Host: email-smtp.us-east-1.amazonaws.com  (根据你的区域)
Port: 587
Sender email: verified-email@yourdomain.com
Sender name: ArcadeZone
Username: [AWS SMTP Username]
Password: [AWS SMTP Password]
```

4. 点击 **Save**

---

## 🎨 自定义邮件模板

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 左侧菜单 → **Authentication** → **Email Templates**
3. 选择 **Confirm signup**
4. 自定义邮件内容：

```html
<h2>Welcome to ArcadeZone! 🎮</h2>
<p>Thanks for signing up! Please confirm your email address to start playing.</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you didn't sign up for ArcadeZone, you can safely ignore this email.</p>
<p>Happy gaming!</p>
<p>- The ArcadeZone Team</p>
```

5. 点击 **Save**

---

## 🧪 测试邮件发送

### 方法 1：使用测试邮箱

1. 使用临时邮箱服务测试：
   - https://temp-mail.org/
   - https://10minutemail.com/
2. 注册账号时使用临时邮箱
3. 检查临时邮箱是否收到验证邮件

### 方法 2：使用自己的邮箱

1. 使用你的真实邮箱注册
2. 检查收件箱和垃圾邮件文件夹
3. 如果收不到，检查 SMTP 配置

---

## 🐛 常见问题排查

### ❌ 问题 1: 收不到验证邮件

**可能原因**:
- 邮件被标记为垃圾邮件
- SMTP 配置错误
- Supabase 发送限制

**解决方法**:
1. 检查垃圾邮件文件夹
2. 检查 Supabase Dashboard → **Logs** → 查看邮件发送日志
3. 如果使用自定义 SMTP，测试 SMTP 连接是否正常
4. 考虑关闭邮箱验证进行测试

---

### ❌ 问题 2: 点击验证链接后显示错误

**可能原因**:
- 链接已过期（默认 24 小时）
- 已经验证过了

**解决方法**:
1. 重新注册
2. 或在 Supabase Dashboard 手动验证用户

---

### ❌ 问题 3: Gmail SMTP 登录失败

**可能原因**:
- 未启用两步验证
- 未使用应用专用密码
- Google 安全设置阻止

**解决方法**:
1. 确保启用了两步验证
2. 使用应用专用密码，不是账号密码
3. 检查 Google 账号安全设置

---

## 📊 推荐配置

### 开发/测试环境
✅ **关闭邮箱验证**  
理由：快速测试，无需配置邮件服务

### 预生产/生产环境
✅ **启用邮箱验证 + SendGrid SMTP**  
理由：免费额度足够，稳定可靠，易于配置

### 企业级生产环境
✅ **启用邮箱验证 + AWS SES**  
理由：成本低，发送量大，高可用性

---

## 🎯 当前建议

由于你在测试阶段，建议：

### 立即行动：
1. ✅ **关闭邮箱验证**（Supabase Dashboard → Auth → Providers → Email → 取消勾选 "Confirm email"）
2. ✅ 重新注册一个测试账号
3. ✅ 测试登录和游戏数据保存功能

### 上线前准备：
1. 配置 SendGrid SMTP
2. 启用邮箱验证
3. 自定义邮件模板
4. 测试邮件发送

---

## 📝 更新说明

前端已更新，现在会显示：
- ✅ 注册成功后提示用户检查邮箱
- ✅ 登录失败时显示 "Email not verified" 详细说明
- ✅ 提醒用户检查垃圾邮件文件夹

推送代码后，这些提示就会生效！

---

**现在去 Supabase Dashboard 关闭邮箱验证，然后继续测试吧！** 🚀


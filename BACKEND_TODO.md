# 后端开发待办清单 / Backend Development TODO

## 🎯 项目状态

**当前架构**: 纯静态前端（HTML + CSS + JavaScript）  
**托管平台**: Vercel  
**认证系统状态**: ⚠️ 已临时禁用（不安全）

---

## 📋 待实现功能列表

### 1️⃣ 后端架构选择

**推荐方案**（按优先级）：

#### 方案 A：无服务器（Serverless）- 推荐 ✅
- **Vercel Serverless Functions** + **Supabase**
  - ✅ 与当前 Vercel 托管无缝集成
  - ✅ Supabase 提供：PostgreSQL 数据库 + 认证 + 存储
  - ✅ 免费额度充足
  - ✅ 快速开发

- **Firebase** (Google)
  - ✅ 完整的 BaaS 解决方案
  - ✅ 实时数据库
  - ✅ 内置认证系统
  - ✅ 免费额度大

#### 方案 B：传统后端
- **Node.js + Express** + **PostgreSQL/MySQL**
  - 需要独立服务器（如 Railway, Render, AWS）
  - 需要自己管理数据库
  - 更灵活但成本更高

#### 方案 C：前后端分离（推荐）
- 前端：保持当前 Vercel 托管
- 后端：独立 API 服务器
- 数据库：云数据库服务

---

### 2️⃣ 用户认证系统

**必须实现**：

- [ ] **密码加密存储**
  - 使用 bcrypt 或 argon2 哈希
  - 加盐（salt）处理
  - 永远不存储明文密码

- [ ] **JWT Token 认证**
  - Access Token（短期有效）
  - Refresh Token（长期有效）
  - Token 刷新机制

- [ ] **Session 管理**
  - 服务器端 session 存储
  - Redis 缓存（可选）

- [ ] **第三方登录**（可选）
  - Google OAuth
  - GitHub OAuth
  - Discord OAuth

**安全措施**：
- [ ] HTTPS 强制
- [ ] CSRF 保护
- [ ] XSS 防护
- [ ] SQL 注入防护
- [ ] 速率限制（Rate Limiting）
- [ ] 密码重置功能
- [ ] 邮箱验证
- [ ] 两步验证（2FA）（可选）

---

### 3️⃣ 数据库设计

#### 用户表（users）
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### 用户资料表（user_profiles）
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 游戏记录表（game_records）
```sql
CREATE TABLE game_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    game_type VARCHAR(50) NOT NULL,
    score INTEGER,
    duration INTEGER,
    result VARCHAR(20),
    moves JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 4️⃣ API 端点设计

#### 认证相关
```
POST   /api/auth/register       - 用户注册
POST   /api/auth/login          - 用户登录
POST   /api/auth/logout         - 用户登出
POST   /api/auth/refresh        - 刷新 Token
POST   /api/auth/verify-email   - 验证邮箱
POST   /api/auth/reset-password - 重置密码
```

#### 用户相关
```
GET    /api/users/me            - 获取当前用户信息
PUT    /api/users/me            - 更新用户信息
GET    /api/users/:id           - 获取用户公开信息
DELETE /api/users/me            - 删除账户
```

#### 游戏相关
```
GET    /api/games               - 获取游戏列表
POST   /api/games/:id/records   - 保存游戏记录
GET    /api/users/me/records    - 获取我的游戏记录
GET    /api/leaderboard/:game   - 获取排行榜
```

---

### 5️⃣ 前端修改清单

启用认证系统时需要取消注释的文件：

- [ ] **index.html**
  - 取消注释 auth-nav-container
  - 取消注释 authentication modals（3个）
  - 取消注释 `<script src="auth.js"></script>`

- [ ] **games.html**
  - 取消注释 auth-nav-container
  - 取消注释 `<script src="auth.js"></script>`（2处）

- [ ] **chessmaster.html** (formerly play.html)
  - 取消注释 auth-nav-container
  - 取消注释 `<script src="auth.js"></script>`

- [ ] **修改 auth.js**
  - 移除 localStorage 存储
  - 改为调用后端 API
  - 实现 JWT Token 管理
  - 添加请求拦截器（自动添加 Token）

---

### 6️⃣ 部署方案

#### 开发环境
- 本地开发服务器
- 本地数据库（PostgreSQL/MySQL）

#### 生产环境
- **前端**: Vercel（已部署）
- **后端**: 
  - Vercel Serverless Functions, 或
  - Railway/Render/AWS
- **数据库**:
  - Supabase（推荐，免费500MB）
  - PostgreSQL on Railway
  - AWS RDS

---

### 7️⃣ 环境变量配置

需要配置的环境变量：

```env
# 数据库
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 邮件服务（用于验证邮箱）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# OAuth（如果使用第三方登录）
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🚀 开发步骤建议

### 阶段 1：基础设施（1-2天）
1. 选择技术栈（推荐 Supabase）
2. 创建数据库
3. 设计表结构
4. 配置环境变量

### 阶段 2：后端 API（3-5天）
1. 实现用户注册/登录
2. 实现 JWT Token 认证
3. 实现密码重置
4. 实现用户信息管理
5. 编写 API 测试

### 阶段 3：前端集成（2-3天）
1. 修改 auth.js 调用后端 API
2. 实现 Token 存储和刷新
3. 添加请求拦截器
4. 测试登录流程
5. 测试保存游戏记录

### 阶段 4：部署和测试（1-2天）
1. 部署后端到生产环境
2. 配置 CORS
3. 测试生产环境
4. 性能优化

**总计**: 7-12天（根据经验）

---

## 📚 参考资源

### 学习资源
- [Supabase 官方文档](https://supabase.com/docs)
- [JWT 认证完整指南](https://jwt.io/introduction)
- [OWASP 认证备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)

### 工具推荐
- **Postman**: API 测试
- **TablePlus**: 数据库管理
- **Supabase Studio**: 可视化数据库管理

---

## ⚠️ 重要提醒

1. **永远不要**在前端存储敏感信息
2. **永远不要**在代码中硬编码密钥
3. **始终使用** HTTPS
4. **定期更新**依赖包
5. **实施日志记录**和监控
6. **备份数据库**

---

**创建日期**: 2024年  
**状态**: 等待后端开发  
**优先级**: P2（游戏功能 > 用户系统）


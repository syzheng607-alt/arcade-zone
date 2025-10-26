# 中国大陆访问优化指南

## 🎯 优化目标
- 将首屏加载时间从 **3-5秒** 降至 **1-2秒**
- 消除 CDN 访问延迟
- 提升数据库查询速度

---

## 📦 方案1：CDN 替换（推荐，立即见效）

### 1. 替换 Google Fonts → 字节跳动 CDN
```html
<!-- 原来：被墙，超时 -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron..." rel="stylesheet">

<!-- 优化后：国内 CDN，速度快 -->
<link href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/fonts-googleapis/1.0.0/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
```

### 2. 替换其他 CDN → jsDelivr 或 BootCDN
```html
<!-- Tailwind CSS -->
<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/tailwindcss/3.0.23/tailwind.min.js"></script>

<!-- Anime.js -->
<script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/animejs/3.2.1/anime.min.js"></script>

<!-- Typed.js -->
<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/typed.js/2.0.12/typed.min.js"></script>

<!-- Splide -->
<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/@splidejs/splide/4.1.3/js/splide.min.js"></script>
<link href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/@splidejs/splide/4.1.3/css/splide.min.css" rel="stylesheet">

<!-- Splitting.js -->
<script src="https://cdn.bootcdn.net/ajax/libs/splitting/1.0.6/splitting.min.js"></script>
<link href="https://cdn.bootcdn.net/ajax/libs/splitting/1.0.6/splitting.css" rel="stylesheet">
```

### 3. Supabase SDK → jsDelivr 国内镜像
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
（jsDelivr 在中国有 CDN 节点，速度较快）

---

## 📦 方案2：资源本地化（最优，需要维护）

将所有 JS/CSS 文件下载到本地，完全避免 CDN 延迟：

```
/libs/
  ├── tailwind.min.js
  ├── anime.min.js
  ├── typed.min.js
  ├── splide.min.js
  ├── splitting.min.js
  ├── supabase.min.js
  └── fonts/
      ├── Orbitron.woff2
      ├── Rajdhani.woff2
      └── PressStart2P.woff2
```

优点：
- ✅ 最快（直接从 Vercel 加载）
- ✅ 无外部依赖
- ✅ 离线也能用

缺点：
- ❌ 需要手动更新
- ❌ 文件体积增加

---

## 📦 方案3：DNS 预解析 + 资源预加载

在 `<head>` 顶部添加：

```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//lf26-cdn-tos.bytecdntp.com">
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
<link rel="dns-prefetch" href="//upiuuwzydeqbqeovjrvc.supabase.co">

<!-- 预连接 -->
<link rel="preconnect" href="https://lf26-cdn-tos.bytecdntp.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- 关键资源预加载 -->
<link rel="preload" href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/fonts-googleapis/..." as="style">
<link rel="preload" href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/tailwindcss/3.0.23/tailwind.min.js" as="script">
```

---

## 📦 方案4：Vercel 配置优化

在 `vercel.json` 中添加缓存策略：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📦 方案5：Supabase 优化

### 选项 A：增加连接超时
在 `supabase-client.js` 中：
```javascript
const client = supabase.createClient(url, key, {
  db: {
    schema: 'public',
  },
  global: {
    fetch: (...args) => fetch(...args, { timeout: 10000 }) // 10秒超时
  }
});
```

### 选项 B：使用国内替代方案
- **LeanCloud**（中国服务器）
- **腾讯云 CloudBase**
- **阿里云 Serverless**

---

## 📦 方案6：备用部署（国内访问）

### Gitee Pages（免费，国内速度快）
1. 在 Gitee 创建仓库
2. 同步 GitHub 代码
3. 启用 Gitee Pages
4. 域名指向 Gitee Pages

### 腾讯云 / 阿里云 OSS（付费，最快）
- 静态网站托管
- 国内 CDN 加速
- 自定义域名

---

## 🎯 推荐执行顺序

### 阶段1：快速优化（30分钟）
1. ✅ 替换 CDN 为国内源（字节跳动 CDN）
2. ✅ 添加 DNS 预解析
3. ✅ 增加 Supabase 超时时间

**预期提升**：加载时间降低 **40-60%**

### 阶段2：深度优化（2-3小时）
1. ✅ 资源本地化
2. ✅ 配置 Vercel 缓存
3. ✅ 优化图片资源

**预期提升**：加载时间再降低 **20-30%**

### 阶段3：终极方案（长期）
1. ✅ Gitee Pages 备用部署
2. ✅ 考虑替换 Supabase 为国内服务

**预期提升**：接近国内网站速度

---

## 📊 性能对比

| 方案 | 首屏加载 | 实施成本 | 维护成本 |
|------|---------|---------|---------|
| 原方案（国外CDN） | 3-5秒 | 低 | 低 |
| 方案1（国内CDN） | 1.5-2.5秒 | 低 | 低 |
| 方案2（资源本地化） | 1-1.5秒 | 中 | 中 |
| 方案6（Gitee Pages） | 0.5-1秒 | 中 | 低 |

---

## ⚠️ 注意事项

1. **字体版权**：确保使用的字体允许本地化
2. **CDN 稳定性**：国内 CDN 也可能不稳定，建议添加 fallback
3. **Supabase**：如果数据库查询仍慢，考虑国内替代方案
4. **持续监控**：使用 [17ce.com](https://www.17ce.com/) 测试全国访问速度

---

## 🚀 需要我帮你实施吗？

我可以立即帮你执行**方案1（CDN替换）**，预计30分钟内完成，性能提升40-60%！


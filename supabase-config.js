// Supabase 配置文件
// 从 Supabase Dashboard → Settings → API 获取这些值

const SUPABASE_CONFIG = {
    // 你的 Supabase 项目 URL（类似 https://xxxxx.supabase.co）
    url: 'https://upiuuwzydeqbqeovjrvc.supabase.co',
    
    // 你的 Supabase anon/public key（一串很长的字符串）
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwaXV1d3p5ZGVxYnFlb3ZqcnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjMzMzIsImV4cCI6MjA3NzAzOTMzMn0.bDsqb39r40FpDrXG7IpJV09rqkm_cKZnWMYq2OuxUdM'
};

// 导出配置
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

// 使用说明：
// 1. 访问 https://supabase.com 创建项目
// 2. 进入 Settings → API
// 3. 复制 Project URL 和 anon public key
// 4. 替换上面的 YOUR_SUPABASE_URL_HERE 和 YOUR_SUPABASE_ANON_KEY_HERE
// 5. 保存文件

console.log('Supabase config loaded');


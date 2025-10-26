// Google reCAPTCHA v3 配置
// 用于防止机器人恶意注册

const RECAPTCHA_CONFIG = {
    // 从 https://www.google.com/recaptcha/admin 获取
    siteKey: 'YOUR_RECAPTCHA_SITE_KEY_HERE',  // 替换为你的 Site Key
    
    // 是否启用 reCAPTCHA（测试时可以设为 false）
    enabled: false,  // 生产环境改为 true
    
    // 最小信任分数（0.0 - 1.0，推荐 0.5）
    minScore: 0.5
};

// 执行 reCAPTCHA 验证
async function executeRecaptcha(action) {
    if (!RECAPTCHA_CONFIG.enabled) {
        console.log('⚠️ reCAPTCHA disabled for testing');
        return { success: true, score: 1.0 };
    }
    
    if (!window.grecaptcha) {
        console.error('❌ reCAPTCHA not loaded!');
        return { success: false, error: 'reCAPTCHA not available' };
    }
    
    try {
        const token = await window.grecaptcha.execute(
            RECAPTCHA_CONFIG.siteKey, 
            { action: action }
        );
        
        // 注意：实际验证需要在后端进行
        // 这里只是客户端获取 token
        // Supabase Edge Functions 可以用来验证 token
        
        console.log('✅ reCAPTCHA token obtained');
        return { success: true, token: token };
        
    } catch (error) {
        console.error('❌ reCAPTCHA error:', error);
        return { success: false, error: error.message };
    }
}

// 导出供其他脚本使用
window.RecaptchaHelper = {
    execute: executeRecaptcha,
    config: RECAPTCHA_CONFIG
};


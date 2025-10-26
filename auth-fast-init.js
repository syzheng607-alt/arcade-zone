// 快速认证初始化脚本（内联到 HTML head）
// 目的：在页面加载前立即检查登录状态并预渲染 UI

(function() {
    'use strict';
    
    // 从 localStorage 读取 Supabase session（同步操作，速度极快）
    const supabaseKey = Object.keys(localStorage).find(key => 
        key.startsWith('sb-') && key.includes('-auth-token')
    );
    
    if (!supabaseKey) {
        console.log('⚡ Fast init: No session found');
        return; // 未登录，等待 auth-supabase.js 处理
    }
    
    try {
        const sessionData = JSON.parse(localStorage.getItem(supabaseKey));
        const user = sessionData?.currentSession?.user;
        
        if (!user) {
            console.log('⚡ Fast init: Invalid session data');
            return;
        }
        
        console.log('⚡ Fast init: Found user session:', user.email);
        
        // 尝试从缓存读取 profile
        const cacheKey = `user_profile_${user.id}`;
        const cachedProfile = localStorage.getItem(cacheKey);
        
        let username = user.email.split('@')[0]; // 默认用户名
        
        if (cachedProfile) {
            try {
                const profile = JSON.parse(cachedProfile);
                username = profile.username || username;
                console.log('⚡ Fast init: Using cached username:', username);
            } catch (e) {
                console.warn('⚡ Fast init: Failed to parse cached profile');
            }
        }
        
        // 将用户信息存储到全局变量，供 auth-supabase.js 使用
        window.__fastAuthData = {
            userId: user.id,
            email: user.email,
            username: username,
            cachedAt: Date.now()
        };
        
        // DOM ready 后立即渲染 UI
        function renderAuthUI() {
            const containers = document.querySelectorAll('#auth-nav-container');
            console.log('⚡ Fast init: Rendering UI for', containers.length, 'containers');
            
            containers.forEach(container => {
                container.classList.remove('hidden');
                container.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <a href="profile.html" class="nav-link font-semibold">
                            👤 ${username}
                        </a>
                        <button id="logout-btn-fast" class="px-4 py-2 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 transition">
                            Logout
                        </button>
                    </div>
                `;
            });
            
            console.log('⚡ Fast init: UI rendered successfully');
        }
        
        // 尽可能早地渲染
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderAuthUI);
        } else {
            renderAuthUI();
        }
        
    } catch (error) {
        console.error('⚡ Fast init: Error:', error);
    }
})();


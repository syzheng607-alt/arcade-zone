// ArcadeZone - Supabase 认证系统
// 使用 Supabase 提供的安全认证服务

(function() {
    'use strict';
    
    // 检查 Supabase 是否已加载
    if (!window.supabase) {
        console.error('❌ Supabase client not loaded! Please include supabase-client.js first.');
        return;
    }
    
    console.log('🔐 Supabase Auth System loaded');
    
    // 全局状态
    window.currentUser = null;
    window.authInitialized = false;
    
    // 初始化认证系统
    async function initAuth() {
        try {
            // 获取当前 session
            const { data: { session } } = await window.supabase.auth.getSession();
            
            if (session) {
                window.currentUser = session.user;
                await loadUserProfile();
                updateUI(true);
                console.log('✅ User logged in:', window.currentUser.email);
            } else {
                window.currentUser = null;
                updateUI(false);
                console.log('ℹ️ No active session');
            }
            
            window.authInitialized = true;
            
        } catch (error) {
            console.error('❌ Auth initialization error:', error);
        }
    }
    
    // 监听认证状态变化
    window.supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth event:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            window.currentUser = session.user;
            await loadUserProfile();
            updateUI(true);
        } else if (event === 'SIGNED_OUT') {
            window.currentUser = null;
            window.userProfile = null;
            updateUI(false);
        }
    });
    
    // 加载用户资料
    async function loadUserProfile() {
        if (!window.currentUser) return;
        
        try {
            const { data, error } = await window.supabase
                .from('profiles')
                .select('*')
                .eq('id', window.currentUser.id)
                .single();
            
            if (error) {
                console.error('Failed to load profile:', error);
                return;
            }
            
            window.userProfile = data;
            console.log('✅ Profile loaded:', window.userProfile.username);
            
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
    
    // 注册新用户
    async function signUp(email, password, username) {
        try {
            // 1. 创建用户账号
            const { data, error } = await window.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    }
                }
            });
            
            if (error) throw error;
            
            // 2. 创建用户资料
            if (data.user) {
                const { error: profileError } = await window.supabase
                    .from('profiles')
                    .insert([{
                        id: data.user.id,
                        username: username,
                        display_name: username
                    }]);
                
                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }
            }
            
            return { success: true, data };
            
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 用户登录
    async function signIn(email, password) {
        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            return { success: true, data };
            
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 用户登出
    async function signOut() {
        try {
            const { error } = await window.supabase.auth.signOut();
            
            if (error) throw error;
            
            return { success: true };
            
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 更新UI
    function updateUI(isLoggedIn) {
        const authContainers = document.querySelectorAll('#auth-nav-container');
        
        authContainers.forEach(container => {
            if (isLoggedIn && window.userProfile) {
                // 已登录状态
                container.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <a href="profile.html" class="nav-link font-semibold">
                            👤 ${window.userProfile.username}
                        </a>
                        <button id="logout-btn" class="px-4 py-2 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 transition">
                            Logout
                        </button>
                    </div>
                `;
                
                // 添加登出事件
                const logoutBtn = container.querySelector('#logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', handleLogout);
                }
                
            } else {
                // 未登录状态
                container.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <button id="login-btn" class="nav-link font-semibold">
                            Login
                        </button>
                        <button id="signup-btn" class="px-4 py-2 rounded-lg font-bold bg-orange hover:bg-dark-orange transition">
                            Sign Up
                        </button>
                    </div>
                `;
                
                // 添加登录注册事件
                const loginBtn = container.querySelector('#login-btn');
                const signupBtn = container.querySelector('#signup-btn');
                
                if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
                if (signupBtn) signupBtn.addEventListener('click', showSignupModal);
            }
        });
    }
    
    // 显示登录模态框
    function showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="modal-content bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-white">Login to ArcadeZone</h2>
                <form id="login-form">
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">Email</label>
                        <input type="email" id="login-email" required
                            class="form-input w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-300 mb-2">Password</label>
                        <input type="password" id="login-password" required
                            class="form-input w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none">
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="btn-primary flex-1 py-3 rounded-lg font-bold">
                            Login
                        </button>
                        <button type="button" id="cancel-login" class="flex-1 py-3 rounded-lg font-bold bg-gray-600 hover:bg-gray-700">
                            Cancel
                        </button>
                    </div>
                </form>
                <div id="login-error" class="mt-4 text-red-500 text-sm hidden"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 事件处理
        const form = modal.querySelector('#login-form');
        const cancelBtn = modal.querySelector('#cancel-login');
        const errorDiv = modal.querySelector('#login-error');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = modal.querySelector('#login-email').value;
            const password = modal.querySelector('#login-password').value;
            
            const result = await signIn(email, password);
            
            if (result.success) {
                document.body.removeChild(modal);
                showNotification('登录成功！', 'success');
            } else {
                errorDiv.textContent = result.error;
                errorDiv.classList.remove('hidden');
            }
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 显示注册模态框
    function showSignupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="modal-content bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-white">Sign Up for ArcadeZone</h2>
                <form id="signup-form">
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">Username</label>
                        <input type="text" id="signup-username" required minlength="3"
                            class="form-input w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-300 mb-2">Email</label>
                        <input type="email" id="signup-email" required
                            class="form-input w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-300 mb-2">Password (min 6 characters)</label>
                        <input type="password" id="signup-password" required minlength="6"
                            class="form-input w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange outline-none">
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="btn-primary flex-1 py-3 rounded-lg font-bold">
                            Sign Up
                        </button>
                        <button type="button" id="cancel-signup" class="flex-1 py-3 rounded-lg font-bold bg-gray-600 hover:bg-gray-700">
                            Cancel
                        </button>
                    </div>
                </form>
                <div id="signup-error" class="mt-4 text-red-500 text-sm hidden"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 事件处理
        const form = modal.querySelector('#signup-form');
        const cancelBtn = modal.querySelector('#cancel-signup');
        const errorDiv = modal.querySelector('#signup-error');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = modal.querySelector('#signup-username').value;
            const email = modal.querySelector('#signup-email').value;
            const password = modal.querySelector('#signup-password').value;
            
            const result = await signUp(email, password, username);
            
            if (result.success) {
                document.body.removeChild(modal);
                showNotification('注册成功！欢迎加入 ArcadeZone！', 'success');
            } else {
                errorDiv.textContent = result.error;
                errorDiv.classList.remove('hidden');
            }
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 处理登出
    async function handleLogout() {
        const result = await signOut();
        if (result.success) {
            showNotification('已登出', 'success');
            // 如果在个人中心页面，跳转到首页
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'index.html';
            }
        }
    }
    
    // 通知函数
    function showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // 导出函数供其他脚本使用
    window.AuthSystem = {
        signUp,
        signIn,
        signOut,
        getCurrentUser: () => window.currentUser,
        getUserProfile: () => window.userProfile,
        isLoggedIn: () => !!window.currentUser
    };
    
    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
    
})();

console.log('✅ Auth system ready');


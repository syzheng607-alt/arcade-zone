// Supabase 客户端初始化
// 依赖：Supabase JS SDK (通过 CDN 加载)

class SupabaseClient {
    constructor() {
        this.client = null;
        this.currentUser = null;
        this.init();
    }

    init() {
        // 检查配置是否存在
        if (typeof SUPABASE_CONFIG === 'undefined') {
            console.error('Supabase config not found! Make sure supabase-config.js is loaded first.');
            return;
        }

        // 检查是否已填入真实配置
        if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL_HERE' || 
            SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
            console.warn('⚠️ Supabase not configured! Please update supabase-config.js with your real credentials.');
            return;
        }

        // 初始化 Supabase 客户端
        if (typeof supabase === 'undefined') {
            console.error('Supabase JS SDK not loaded! Include the CDN script first.');
            return;
        }

        this.client = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );

        // 暴露给 auth-supabase.js 使用
        window.supabase = this.client;

        console.log('✅ Supabase client initialized');

        // 检查当前用户会话
        this.checkSession();

        // 监听认证状态变化
        this.client.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            this.currentUser = session?.user || null;
            this.handleAuthStateChange(event, session);
        });
    }

    async checkSession() {
        try {
            const { data: { session } } = await this.client.auth.getSession();
            this.currentUser = session?.user || null;
            return session;
        } catch (error) {
            console.error('Error checking session:', error);
            return null;
        }
    }

    // 注册新用户
    async signUp(email, password, username) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        display_name: username
                    }
                }
            });

            if (error) throw error;

            console.log('✅ User registered successfully');
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    // 登录
    async signIn(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ User logged in successfully');
            this.currentUser = data.user;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // 登出
    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;

            console.log('✅ User logged out successfully');
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // 重置密码（发送邮件）
    async resetPassword(email) {
        try {
            const { error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });

            if (error) throw error;

            console.log('✅ Password reset email sent');
            return { success: true };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            return { success: false, error: error.message };
        }
    }

    // 更新密码
    async updatePassword(newPassword) {
        try {
            const { error } = await this.client.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            console.log('✅ Password updated successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Password update error:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否登录
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // 处理认证状态变化
    handleAuthStateChange(event, session) {
        // 触发自定义事件，让其他模块可以监听
        const authEvent = new CustomEvent('authStateChanged', {
            detail: { event, session, user: session?.user }
        });
        window.dispatchEvent(authEvent);
    }

    // === 数据库操作示例 ===

    // 保存游戏记录
    async saveGameRecord(gameType, score, moves, result) {
        if (!this.isAuthenticated()) {
            console.warn('User not authenticated, cannot save game record');
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { data, error } = await this.client
                .from('game_records')
                .insert([
                    {
                        user_id: this.currentUser.id,
                        game_type: gameType,
                        score: score,
                        moves: moves,
                        result: result,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            console.log('✅ Game record saved');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error saving game record:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取用户游戏记录
    async getUserGameRecords(gameType = null, limit = 10) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            let query = this.client
                .from('game_records')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (gameType) {
                query = query.eq('game_type', gameType);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, records: data };
        } catch (error) {
            console.error('❌ Error fetching game records:', error);
            return { success: false, error: error.message };
        }
    }

    // 获取排行榜
    async getLeaderboard(gameType, limit = 10) {
        try {
            const { data, error } = await this.client
                .from('game_records')
                .select('*, profiles:user_id(username, display_name)')
                .eq('game_type', gameType)
                .order('score', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, leaderboard: data };
        } catch (error) {
            console.error('❌ Error fetching leaderboard:', error);
            return { success: false, error: error.message };
        }
    }
}

// 创建全局实例
window.supabaseClient = new SupabaseClient();

console.log('Supabase client module loaded');


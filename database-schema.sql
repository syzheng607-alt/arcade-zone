-- ArcadeZone 数据库表结构
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本

-- 1. 用户资料表（扩展 auth.users）
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. 游戏记录表
CREATE TABLE IF NOT EXISTS public.game_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,  -- 'chess', 'arcade', 等
    score INTEGER DEFAULT 0,
    duration INTEGER,  -- 游戏时长（秒）
    result VARCHAR(20),  -- 'win', 'loss', 'draw'
    moves JSONB,  -- 游戏详细记录（棋谱等）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_game_records_user_id ON public.game_records(user_id);
CREATE INDEX IF NOT EXISTS idx_game_records_game_type ON public.game_records(game_type);
CREATE INDEX IF NOT EXISTS idx_game_records_score ON public.game_records(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_records_created_at ON public.game_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 4. 启用行级安全策略 (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_records ENABLE ROW LEVEL SECURITY;

-- 5. 创建 profiles 表的安全策略
-- 5.1 允许用户查看所有公开资料
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- 5.2 允许用户插入自己的资料
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5.3 允许用户更新自己的资料
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 6. 创建 game_records 表的安全策略
-- 6.1 允许用户查看所有游戏记录（用于排行榜）
CREATE POLICY "Game records are viewable by everyone"
ON public.game_records FOR SELECT
USING (true);

-- 6.2 允许用户插入自己的游戏记录
CREATE POLICY "Users can insert their own game records"
ON public.game_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6.3 允许用户更新自己的游戏记录
CREATE POLICY "Users can update their own game records"
ON public.game_records FOR UPDATE
USING (auth.uid() = user_id);

-- 6.4 允许用户删除自己的游戏记录
CREATE POLICY "Users can delete their own game records"
ON public.game_records FOR DELETE
USING (auth.uid() = user_id);

-- 7. 创建触发器：自动创建用户资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.1 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. 创建触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. 创建视图：排行榜
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    gr.game_type,
    gr.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    MAX(gr.score) as best_score,
    COUNT(*) as games_played,
    AVG(gr.score) as avg_score
FROM public.game_records gr
JOIN public.profiles p ON gr.user_id = p.id
GROUP BY gr.game_type, gr.user_id, p.username, p.display_name, p.avatar_url;

-- 10. 授予权限
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.game_records TO anon, authenticated;
GRANT ALL ON public.game_records TO authenticated;
GRANT SELECT ON public.leaderboard TO anon, authenticated;

-- 完成！
SELECT 'Database schema created successfully!' as message;


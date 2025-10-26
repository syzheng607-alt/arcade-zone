-- 修复级联删除问题
-- 当删除用户时，自动删除相关的 profiles 和 game_records

-- 1. 删除现有外键约束
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.game_records 
DROP CONSTRAINT IF EXISTS game_records_user_id_fkey;

-- 2. 重新添加外键约束，带 CASCADE 删除
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE public.game_records 
ADD CONSTRAINT game_records_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 验证约束
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confdeltype AS on_delete_action
FROM pg_constraint
WHERE conname IN ('profiles_id_fkey', 'game_records_user_id_fkey');

-- on_delete_action 说明:
-- 'c' = CASCADE (级联删除)
-- 'a' = NO ACTION
-- 'r' = RESTRICT
-- 'n' = SET NULL


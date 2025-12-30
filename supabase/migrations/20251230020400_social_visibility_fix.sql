-- Location: supabase/migrations/20251230020400_social_visibility_fix.sql
-- Description: Enables social visibility for activity logs and achievements.

-- 1. Allow authenticated users to view all activity logs
-- This is necessary for social feeds and leaderboards.
-- We already have "users_manage_own_activity_logs", so we add a SELECT-specific one.
DROP POLICY IF EXISTS "authenticated_view_activity_logs" ON public.activity_logs;
CREATE POLICY "authenticated_view_activity_logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (true);

-- 2. Allow authenticated users to view all achievements
DROP POLICY IF EXISTS "authenticated_view_achievements" ON public.achievements;
CREATE POLICY "authenticated_view_achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- 3. Ensure user_statistics are also visible (already done in previous migration, but making sure)
DROP POLICY IF EXISTS "authenticated_view_user_statistics" ON public.user_statistics;
CREATE POLICY "authenticated_view_user_statistics"
ON public.user_statistics
FOR SELECT
TO authenticated
USING (true);

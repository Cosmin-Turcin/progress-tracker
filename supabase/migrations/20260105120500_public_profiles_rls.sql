-- Allow public read access to user profiles
CREATE POLICY "anyone_view_any_profile" ON public.user_profiles FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "users_view_own_profile" ON public.user_profiles;

-- Allow public read access to achievements
CREATE POLICY "anyone_view_any_achievement" ON public.achievements FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "users_manage_own_achievements" ON public.achievements;
-- Re-add manage policy for authenticated users (update/delete/insert)
CREATE POLICY "users_manage_own_achievements" ON public.achievements FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow public read access to activity logs
CREATE POLICY "anyone_view_any_activity_log" ON public.activity_logs FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "users_manage_own_activity_logs" ON public.activity_logs;
-- Re-add manage policy for authenticated users
CREATE POLICY "users_manage_own_activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow public read access to user statistics
CREATE POLICY "anyone_view_any_statistics" ON public.user_statistics FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "users_manage_own_statistics" ON public.user_statistics;
-- Re-add manage policy for authenticated users
CREATE POLICY "users_manage_own_statistics" ON public.user_statistics FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow public read access to user settings (some parts might be sensitive, but for now required for points system)
CREATE POLICY "anyone_view_any_settings" ON public.user_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "users_manage_own_settings" ON public.user_settings;
CREATE POLICY "users_manage_own_settings" ON public.user_settings FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

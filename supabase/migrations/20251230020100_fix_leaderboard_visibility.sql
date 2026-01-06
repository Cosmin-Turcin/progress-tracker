-- Location: supabase/migrations/20251230020100_fix_leaderboard_visibility.sql
-- Description: Fixes RLS policies and RPC consistency for the Social Hub

-- 1. Update user_profiles RLS to allow viewing other profiles (standard for social features)
DROP POLICY IF EXISTS "users_view_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.user_profiles;
CREATE POLICY "profiles_public_read"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Update user_statistics RLS to allow viewing other statistics (needed for leaderboard)
DROP POLICY IF EXISTS "users_manage_own_statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "statistics_public_read" ON public.user_statistics;
DROP POLICY IF EXISTS "statistics_manage_own" ON public.user_statistics;
CREATE POLICY "statistics_public_read"
ON public.user_statistics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "statistics_manage_own"
ON public.user_statistics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. Redefine get_global_leaderboard with consistent naming and alias matching
DROP FUNCTION IF EXISTS public.get_global_leaderboard(UUID, TEXT, INTEGER);
CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
    requesting_user_id UUID,
    time_period TEXT DEFAULT 'all-time',
    limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    total_points INTEGER,
    current_streak INTEGER,
    achievements_unlocked INTEGER,
    total_activities INTEGER,
    rank INTEGER,
    friendship_status TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH leaderboard_data AS (
        SELECT 
            up.id AS u_id,
            up.full_name AS f_name,
            up.avatar_url AS a_url,
            COALESCE(us.total_points, 0) AS t_points,
            COALESCE(us.current_streak, 0) AS c_streak,
            COALESCE(us.achievements_unlocked, 0) AS a_unlocked,
            COALESCE(us.total_activities, 0) AS t_activities,
            RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rnk
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
        ORDER BY COALESCE(us.total_points, 0) DESC
        LIMIT limit_count
    )
    SELECT 
        ld.u_id,
        ld.f_name,
        ld.a_url,
        ld.t_points,
        ld.c_streak,
        ld.a_unlocked,
        ld.t_activities,
        ld.rnk::INTEGER,
        COALESCE(
            (SELECT f.status::TEXT 
             FROM public.friendships f 
             WHERE (f.user_id = requesting_user_id AND f.friend_id = ld.u_id)
                OR (f.user_id = ld.u_id AND f.friend_id = requesting_user_id)
             LIMIT 1),
            'none'
        ) AS friendship_status
    FROM leaderboard_data ld;
END;
$$;

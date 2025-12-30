-- Location: supabase/migrations/20251230020000_global_social_features.sql
-- Description: Adds Global Leaderboard and enhanced friendship check functionality

-- 1. Create function to get global leaderboard with friendship status
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
    friendship_status TEXT -- 'none', 'pending', 'accepted'
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH leaderboard_data AS (
        SELECT 
            up.id AS u_id,
            up.full_name,
            up.avatar_url,
            COALESCE(us.total_points, 0) AS total_points,
            COALESCE(us.current_streak, 0) AS current_streak,
            COALESCE(us.achievements_unlocked, 0) AS achievements_unlocked,
            COALESCE(us.total_activities, 0) AS total_activities,
            RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rank
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
        ORDER BY COALESCE(us.total_points, 0) DESC
        LIMIT limit_count
    )
    SELECT 
        ld.u_id,
        ld.full_name,
        ld.avatar_url,
        ld.total_points,
        ld.current_streak,
        ld.achievements_unlocked,
        ld.total_activities,
        ld.rank::INTEGER,
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

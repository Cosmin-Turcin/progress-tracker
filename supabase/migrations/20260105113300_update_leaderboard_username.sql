-- Update get_friends_leaderboard to include username
DROP FUNCTION IF EXISTS public.get_friends_leaderboard(uuid, text, integer);
CREATE OR REPLACE FUNCTION public.get_friends_leaderboard(
    requesting_user_id UUID,
    time_period TEXT DEFAULT 'all-time',
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    total_points INTEGER,
    current_streak INTEGER,
    achievements_unlocked INTEGER,
    total_activities INTEGER,
    rank INTEGER,
    position_change INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH friend_ids AS (
        SELECT DISTINCT 
            CASE 
                WHEN f.user_id = requesting_user_id THEN f.friend_id
                ELSE f.user_id
            END AS friend_user_id
        FROM public.friendships f
        WHERE (f.user_id = requesting_user_id OR f.friend_id = requesting_user_id)
        AND f.status = 'accepted'::public.friendship_status
    ),
    leaderboard_data AS (
        SELECT 
            up.id AS user_id,
            up.full_name,
            up.username,
            up.avatar_url,
            COALESCE(us.total_points, 0) AS total_points,
            COALESCE(us.current_streak, 0) AS current_streak,
            COALESCE(us.achievements_unlocked, 0) AS achievements_unlocked,
            COALESCE(us.total_activities, 0) AS total_activities,
            RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rank
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
        WHERE up.id IN (SELECT friend_user_id FROM friend_ids)
        OR up.id = requesting_user_id
        ORDER BY COALESCE(us.total_points, 0) DESC
        LIMIT limit_count
    )
    SELECT 
        ld.user_id,
        ld.full_name,
        ld.username,
        ld.avatar_url,
        ld.total_points,
        ld.current_streak,
        ld.achievements_unlocked,
        ld.total_activities,
        ld.rank::INTEGER,
        0::INTEGER AS position_change
    FROM leaderboard_data ld;
END;
$$;

-- Update get_global_leaderboard to include username
DROP FUNCTION IF EXISTS public.get_global_leaderboard(uuid, text, integer);
CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
    requesting_user_id UUID,
    time_period TEXT DEFAULT 'all-time',
    limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    username TEXT,
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
            up.username AS u_name,
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
        ld.u_name,
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

-- Location: supabase/migrations/20251230020300_reapply_ranking_stats.sql
-- Description: Robust re-application of leaderboard and ranking RPCs with explicit drops and qualified names.

-- 0. Force drop all related functions to ensure clean slate (handles param name changes)
DROP FUNCTION IF EXISTS public.get_period_points(UUID, TEXT);
DROP FUNCTION IF EXISTS public.get_global_leaderboard(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.get_friends_leaderboard(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS public.get_user_ranking_stats(UUID, TEXT);
DROP FUNCTION IF EXISTS public.get_user_ranking_stats(p_user_id UUID, p_period TEXT);

-- 1. Helper function
CREATE OR REPLACE FUNCTION public.get_period_points(p_user_id UUID, p_period TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    v_points INTEGER;
BEGIN
    IF p_period = 'weekly' THEN
        SELECT COALESCE(SUM(al.points), 0) INTO v_points
        FROM public.activity_logs al
        WHERE al.user_id = p_user_id AND al.activity_date >= (CURRENT_DATE - INTERVAL '7 days');
    ELSIF p_period = 'monthly' THEN
        SELECT COALESCE(SUM(al.points), 0) INTO v_points
        FROM public.activity_logs al
        WHERE al.user_id = p_user_id AND al.activity_date >= (CURRENT_DATE - INTERVAL '30 days');
    ELSE
        SELECT COALESCE(SUM(al.points), 0) INTO v_points
        FROM public.activity_logs al
        WHERE al.user_id = p_user_id;
    END IF;
    
    RETURN v_points;
END;
$$;

-- 2. get_global_leaderboard
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
    WITH calculated_stats AS (
        SELECT 
            up.id AS u_id,
            up.full_name AS f_name,
            up.avatar_url AS a_url,
            CASE 
                WHEN time_period = 'weekly' THEN 
                    (SELECT COALESCE(SUM(al.points), 0) FROM public.activity_logs al WHERE al.user_id = up.id AND al.activity_date >= (CURRENT_DATE - INTERVAL '7 days'))
                WHEN time_period = 'monthly' THEN 
                    (SELECT COALESCE(SUM(al.points), 0) FROM public.activity_logs al WHERE al.user_id = up.id AND al.activity_date >= (CURRENT_DATE - INTERVAL '30 days'))
                ELSE COALESCE(us.total_points, 0)
            END AS t_points,
            COALESCE(us.current_streak, 0) AS c_streak,
            COALESCE(us.achievements_unlocked, 0) AS a_unlocked,
            COALESCE(us.total_activities, 0) AS t_activities
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
    ),
    ranked_data AS (
        SELECT 
            cs.*,
            RANK() OVER (ORDER BY cs.t_points DESC) AS rnk
        FROM calculated_stats cs
        ORDER BY cs.t_points DESC
        LIMIT limit_count
    )
    SELECT 
        rd.u_id AS user_id,
        rd.f_name AS full_name,
        rd.a_url AS avatar_url,
        rd.t_points::INTEGER AS total_points,
        rd.c_streak AS current_streak,
        rd.a_unlocked AS achievements_unlocked,
        rd.t_activities AS total_activities,
        rd.rnk::INTEGER AS rank,
        COALESCE(
            (SELECT f.status::TEXT 
             FROM public.friendships f 
             WHERE (f.user_id = requesting_user_id AND f.friend_id = rd.u_id)
                OR (f.user_id = rd.u_id AND f.friend_id = requesting_user_id)
             LIMIT 1),
            'none'
        ) AS friendship_status
    FROM ranked_data rd;
END;
$$;

-- 3. get_friends_leaderboard
CREATE OR REPLACE FUNCTION public.get_friends_leaderboard(
    requesting_user_id UUID,
    time_period TEXT DEFAULT 'all-time',
    limit_count INTEGER DEFAULT 50
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
    position_change INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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
    calculated_stats AS (
        SELECT 
            up.id AS u_id,
            up.full_name AS f_name,
            up.avatar_url AS a_url,
            CASE 
                WHEN time_period = 'weekly' THEN 
                    (SELECT COALESCE(SUM(al.points), 0) FROM public.activity_logs al WHERE al.user_id = up.id AND al.activity_date >= (CURRENT_DATE - INTERVAL '7 days'))
                WHEN time_period = 'monthly' THEN 
                    (SELECT COALESCE(SUM(al.points), 0) FROM public.activity_logs al WHERE al.user_id = up.id AND al.activity_date >= (CURRENT_DATE - INTERVAL '30 days'))
                ELSE COALESCE(us.total_points, 0)
            END AS t_points,
            COALESCE(us.current_streak, 0) AS c_streak,
            COALESCE(us.achievements_unlocked, 0) AS a_unlocked,
            COALESCE(us.total_activities, 0) AS t_activities
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
        WHERE up.id IN (SELECT friend_user_id FROM friend_ids)
        OR up.id = requesting_user_id
    ),
    ranked_data AS (
        SELECT 
            cs.*,
            RANK() OVER (ORDER BY cs.t_points DESC) AS rnk
        FROM calculated_stats cs
        ORDER BY cs.t_points DESC
        LIMIT limit_count
    )
    SELECT 
        rd.u_id AS user_id,
        rd.f_name AS full_name,
        rd.a_url AS avatar_url,
        rd.t_points::INTEGER AS total_points,
        rd.c_streak AS current_streak,
        rd.a_unlocked AS achievements_unlocked,
        rd.t_activities AS total_activities,
        rd.rnk::INTEGER AS rank,
        0::INTEGER AS position_change
    FROM ranked_data rd;
END;
$$;

-- 4. get_user_ranking_stats - Standardized params
CREATE OR REPLACE FUNCTION public.get_user_ranking_stats(
    p_user_id UUID,
    p_period TEXT DEFAULT 'all-time'
)
RETURNS TABLE (
    user_id UUID,
    total_points INTEGER,
    current_streak INTEGER,
    achievements_unlocked INTEGER,
    rank INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_points INTEGER;
    v_rank INTEGER;
    v_streak INTEGER;
    v_achievements INTEGER;
BEGIN
    -- Get points for the period
    v_points := public.get_period_points(p_user_id, p_period);
    
    -- Calculate rank based on that period's points across all users
    IF p_period = 'weekly' THEN
        SELECT count(*) + 1 INTO v_rank
        FROM (
            SELECT al.user_id, SUM(al.points) as pts 
            FROM public.activity_logs al 
            WHERE al.activity_date >= (CURRENT_DATE - INTERVAL '7 days')
            GROUP BY al.user_id
        ) s
        WHERE s.pts > v_points;
    ELSIF p_period = 'monthly' THEN
        SELECT count(*) + 1 INTO v_rank
        FROM (
            SELECT al.user_id, SUM(al.points) as pts 
            FROM public.activity_logs al 
            WHERE al.activity_date >= (CURRENT_DATE - INTERVAL '30 days')
            GROUP BY al.user_id
        ) s
        WHERE s.pts > v_points;
    ELSE
        SELECT count(*) + 1 INTO v_rank
        FROM public.user_statistics us
        WHERE us.total_points > v_points;
    END IF;

    -- Get streak and achievements from user_statistics
    SELECT COALESCE(us.current_streak, 0), COALESCE(us.achievements_unlocked, 0)
    INTO v_streak, v_achievements
    FROM public.user_statistics us
    WHERE us.user_id = p_user_id;

    RETURN QUERY
    SELECT 
        p_user_id,
        COALESCE(v_points, 0) AS total_points,
        COALESCE(v_streak, 0) AS current_streak,
        COALESCE(v_achievements, 0) AS achievements_unlocked,
        COALESCE(v_rank, 1) AS rank;
END;
$$;

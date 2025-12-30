-- Location: supabase/migrations/20251230020200_user_ranking_stats.sql
-- Description: Enhances leaderboard RPCs with time-period filtering and adds a user stats/rank RPC.

-- 1. Helper function to get point summation for a period
CREATE OR REPLACE FUNCTION public.get_period_points(p_user_id UUID, p_time_period TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_points INTEGER;
BEGIN
    IF p_time_period = 'weekly' THEN
        SELECT COALESCE(SUM(points), 0) INTO v_points
        FROM public.activity_logs
        WHERE user_id = p_user_id AND activity_date >= (CURRENT_DATE - INTERVAL '7 days');
    ELSIF p_time_period = 'monthly' THEN
        SELECT COALESCE(SUM(points), 0) INTO v_points
        FROM public.activity_logs
        WHERE user_id = p_user_id AND activity_date >= (CURRENT_DATE - INTERVAL '30 days');
    ELSE
        SELECT COALESCE(SUM(points), 0) INTO v_points
        FROM public.activity_logs
        WHERE user_id = p_user_id;
    END IF;
    
    RETURN v_points;
END;
$$;

-- 2. Update get_global_leaderboard to support time periods
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
            *,
            RANK() OVER (ORDER BY t_points DESC) AS rnk
        FROM calculated_stats
        ORDER BY t_points DESC
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

-- 3. Update get_friends_leaderboard to support time periods
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
            *,
            RANK() OVER (ORDER BY t_points DESC) AS rnk
        FROM calculated_stats
        ORDER BY t_points DESC
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

-- 4. New RPC for single user ranking and stats
CREATE OR REPLACE FUNCTION public.get_user_ranking_stats(
    target_user_id UUID,
    p_time_period TEXT DEFAULT 'all-time'
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
AS $$
DECLARE
    v_points INTEGER;
    v_rank INTEGER;
    v_streak INTEGER;
    v_achievements INTEGER;
BEGIN
    -- Get points for the period
    v_points := public.get_period_points(target_user_id, p_time_period);
    
    -- Calculate rank based on that period's points across all users
    IF p_time_period = 'weekly' THEN
        SELECT count(*) + 1 INTO v_rank
        FROM (
            SELECT user_id, SUM(points) as pts 
            FROM public.activity_logs 
            WHERE activity_date >= (CURRENT_DATE - INTERVAL '7 days')
            GROUP BY user_id
        ) s
        WHERE s.pts > v_points;
    ELSIF p_time_period = 'monthly' THEN
        SELECT count(*) + 1 INTO v_rank
        FROM (
            SELECT user_id, SUM(points) as pts 
            FROM public.activity_logs 
            WHERE activity_date >= (CURRENT_DATE - INTERVAL '30 days')
            GROUP BY user_id
        ) s
        WHERE s.pts > v_points;
    ELSE
        SELECT count(*) + 1 INTO v_rank
        FROM public.user_statistics
        WHERE total_points > v_points;
    END IF;

    -- Get streak and achievements from user_statistics
    SELECT COALESCE(current_streak, 0), COALESCE(achievements_unlocked, 0)
    INTO v_streak, v_achievements
    FROM public.user_statistics
    WHERE user_id = target_user_id;

    RETURN QUERY
    SELECT 
        target_user_id,
        COALESCE(v_points, 0) AS total_points,
        COALESCE(v_streak, 0) AS current_streak,
        COALESCE(v_achievements, 0) AS achievements_unlocked,
        COALESCE(v_rank, 1) AS rank;
END;
$$;

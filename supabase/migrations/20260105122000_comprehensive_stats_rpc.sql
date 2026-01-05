-- Improved comprehensive user statistics RPC
CREATE OR REPLACE FUNCTION public.get_user_comprehensive_stats(
    p_user_id UUID
)
RETURNS TABLE (
    total_points INTEGER,
    weekly_points INTEGER,
    monthly_points INTEGER,
    current_streak INTEGER,
    total_activities INTEGER,
    total_achievements INTEGER,
    rank INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_points INTEGER;
    v_weekly_points INTEGER;
    v_monthly_points INTEGER;
    v_streak INTEGER;
    v_activities INTEGER;
    v_achievements INTEGER;
    v_rank INTEGER;
    v_last_date DATE;
    v_check_date DATE;
BEGIN
    -- 1. Get totals from statistics (reliable for points/activity count)
    SELECT COALESCE(us.total_points, 0), 
           COALESCE(us.total_activities, 0)
    INTO v_total_points, v_activities
    FROM public.user_statistics us
    WHERE us.user_id = p_user_id;

    -- 2. Calculate achievement count dynamically for 100% accuracy
    SELECT COUNT(*) INTO v_achievements
    FROM public.achievements
    WHERE user_id = p_user_id;

    -- 3. Get weekly and monthly points from activity logs
    SELECT COALESCE(SUM(points), 0) INTO v_weekly_points
    FROM public.activity_logs
    WHERE user_id = p_user_id AND activity_date >= (CURRENT_DATE - INTERVAL '7 days');

    SELECT COALESCE(SUM(points), 0) INTO v_monthly_points
    FROM public.activity_logs
    WHERE user_id = p_user_id AND activity_date >= (CURRENT_DATE - INTERVAL '30 days');

    -- 4. Calculate current streak dynamically
    SELECT MAX(activity_date) INTO v_last_date
    FROM public.activity_logs
    WHERE user_id = p_user_id;

    IF v_last_date IS NULL OR v_last_date < (CURRENT_DATE - 1) THEN
        v_streak := 0;
    ELSE
        v_streak := 0;
        v_check_date := v_last_date;
        WHILE EXISTS (
            SELECT 1 FROM public.activity_logs
            WHERE user_id = p_user_id AND activity_date = v_check_date
        ) LOOP
            v_streak := v_streak + 1;
            v_check_date := v_check_date - 1;
        END LOOP;
    END IF;

    -- 5. Calculate rank based on total points
    SELECT count(*) + 1 INTO v_rank
    FROM public.user_statistics us
    WHERE us.total_points > v_total_points;

    RETURN QUERY
    SELECT 
        COALESCE(v_total_points, 0),
        COALESCE(v_weekly_points, 0),
        COALESCE(v_monthly_points, 0),
        COALESCE(v_streak, 0),
        COALESCE(v_activities, 0),
        COALESCE(v_achievements, 0),
        COALESCE(v_rank, 1);
END;
$$;

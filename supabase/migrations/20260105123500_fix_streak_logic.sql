-- Robust streak calculation function
CREATE OR REPLACE FUNCTION public.calculate_user_streak(p_user_id UUID)
RETURNS INTEGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_last_date DATE;
    v_check_date DATE;
BEGIN
    -- Get the most recent activity date
    SELECT MAX(activity_date) INTO v_last_date
    FROM public.activity_logs
    WHERE user_id = p_user_id;
    
    IF v_last_date IS NULL THEN
        UPDATE public.user_statistics SET current_streak = 0 WHERE user_id = p_user_id;
        RETURN 0;
    END IF;
    
    -- Check if streak is still active (activity today or yesterday)
    -- Using CURRENT_DATE - 1 is more robust than INTERVAL in some contexts
    IF v_last_date < (CURRENT_DATE - 1) THEN
        UPDATE public.user_statistics SET current_streak = 0 WHERE user_id = p_user_id;
        RETURN 0;
    END IF;
    
    -- Calculate consecutive days
    v_check_date := v_last_date;
    WHILE EXISTS (
        SELECT 1 FROM public.activity_logs
        WHERE user_id = p_user_id AND activity_date = v_check_date
    ) LOOP
        v_current_streak := v_current_streak + 1;
        v_check_date := v_check_date - 1;
    END LOOP;
    
    -- Update user_statistics
    UPDATE public.user_statistics
    SET 
        current_streak = v_current_streak,
        longest_streak = GREATEST(longest_streak, v_current_streak),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    RETURN v_current_streak;
END;
$$;

-- Backfill streaks for all users
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT user_id FROM public.user_statistics LOOP
        PERFORM public.calculate_user_streak(r.user_id);
    END LOOP;
END $$;

-- Location: supabase/migrations/20251230010000_automation_achievements.sql
-- Description: Automated achievement granting based on user activity and statistics

-- Function to check and grant achievements
CREATE OR REPLACE FUNCTION public.check_and_grant_achievements()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
DECLARE
    v_total_activities INTEGER;
    v_current_streak INTEGER;
    v_total_points_today INTEGER;
    v_has_achievement BOOLEAN;
BEGIN
    -- 1. Get current stats
    SELECT COUNT(*) INTO v_total_activities 
    FROM public.activity_logs 
    WHERE user_id = NEW.user_id;

    SELECT current_streak INTO v_current_streak 
    FROM public.user_statistics 
    WHERE user_id = NEW.user_id;

    SELECT SUM(points) INTO v_total_points_today
    FROM public.activity_logs
    WHERE user_id = NEW.user_id AND activity_date = CURRENT_DATE;

    -- 2. Check for "First Steps"
    IF v_total_activities >= 1 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'first_steps' OR title = 'First Steps')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'First Steps', 'You logged your first activity! Welcome aboard.', 'Footprints', 'var(--color-primary)', 'first_steps');
        END IF;
    END IF;

    -- 3. Check for "Streak Starter" (3 days)
    IF v_current_streak >= 3 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_3' OR title = 'Streak Starter')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Streak Starter', '3 days in a row! You''re building a great habit.', 'Zap', 'var(--color-warning)', 'streak_3');
        END IF;
    END IF;

    -- 4. Check for "Consistent" (7 days)
    IF v_current_streak >= 7 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_7' OR title = 'Consistent')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Consistent', 'A full week! You''re on fire.', 'Flame', 'var(--color-accent)', 'streak_7');
        END IF;
    END IF;

    -- 5. Check for "High Flyer" (100+ points in a day)
    IF v_total_points_today >= 100 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'points_100_day' OR title = 'High Flyer')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'High Flyer', 'You earned over 100 points in a single day!', 'Rocket', 'var(--color-success)', 'points_100_day');
        END IF;
    END IF;

    RETURN NEW;
END;
$func$;

-- Trigger to run after activity statistics are updated
-- We use AFTER INSERT on activity_logs because statistics are also updated by an AFTER INSERT trigger on the same table.
-- To ensure statistics are already updated, we can either make this trigger run later or check stats specifically.
-- Since triggers run in alphabetical order by name, and trg_update_statistics_on_activity starts with 't', 
-- we'll name this one 'trg_z_check_achievements' to run late.
CREATE TRIGGER trg_z_check_achievements
    AFTER INSERT ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.check_and_grant_achievements();

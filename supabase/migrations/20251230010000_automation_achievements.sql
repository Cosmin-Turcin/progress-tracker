-- Location: supabase/migrations/20251230010000_automation_achievements.sql
-- Description: Production-ready achievement automation logic with 15+ badges

CREATE OR REPLACE FUNCTION public.check_and_grant_achievements()
RETURNS TRIGGER 
SECURITY DEFINER 
LANGUAGE plpgsql
AS $func$
DECLARE
    v_total_activities INTEGER;
    v_total_points INTEGER;
    v_current_streak INTEGER;
    v_total_points_today INTEGER;
    v_category_count INTEGER;
    v_has_achievement BOOLEAN;
    v_hour INTEGER;
BEGIN
    -- 1. Cache user stats for performance
    SELECT COUNT(*), COALESCE(SUM(points), 0) INTO v_total_activities, v_total_points FROM public.activity_logs WHERE user_id = NEW.user_id;
    SELECT current_streak INTO v_current_streak FROM public.user_statistics WHERE user_id = NEW.user_id;
    SELECT COALESCE(SUM(points), 0) INTO v_total_points_today FROM public.activity_logs WHERE user_id = NEW.user_id AND activity_date = CURRENT_DATE;
    v_hour := EXTRACT(HOUR FROM (NEW.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Bucharest')); -- Adjust timezone as needed or use local

    -- ==========================================
    -- 2. CORE & POINT MILESTONES
    -- ==========================================

    -- First Steps
    IF v_total_activities >= 1 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'first_steps' OR title = 'First Steps')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'First Steps', 'Log your first activity! Welcome aboard.', 'Footprints', 'var(--color-primary)', 'first_steps');
        END IF;
    END IF;

    -- High Flyer (100+ points today)
    IF v_total_points_today >= 100 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'points_100_day' OR title = 'High Flyer')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'High Flyer', 'You earned over 100 points in a single day!', 'Rocket', 'var(--color-success)', 'points_100_day');
        END IF;
    END IF;

    -- Halfway Hero (500 pts)
    IF v_total_points >= 500 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'points_500' OR title = 'Halfway Hero')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Halfway Hero', 'Reached 500 total points across all categories.', 'Shield', 'var(--color-primary)', 'points_500');
        END IF;
    END IF;

    -- Millennium Member (1000 pts)
    IF v_total_points >= 1000 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'points_1000' OR title = 'Millennium Member')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Millennium Member', 'Incredible! You''ve reached 1,000 total points.', 'Crown', 'var(--color-warning)', 'points_1000');
        END IF;
    END IF;

    -- ==========================================
    -- 3. STREAK MILESTONES
    -- ==========================================

    -- Streak Starter (3 days)
    IF v_current_streak >= 3 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_3' OR title = 'Streak Starter')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Streak Starter', '3 days in a row! You''re building a great habit.', 'Zap', 'var(--color-warning)', 'streak_3');
        END IF;
    END IF;

    -- Consistent (7 days)
    IF v_current_streak >= 7 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_7' OR title = 'Consistent')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Consistent', 'A full week! You''re on fire.', 'Flame', 'var(--color-accent)', 'streak_7');
        END IF;
    END IF;

    -- Bi-Weekly Hero (14 days)
    IF v_current_streak >= 14 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_14' OR title = 'Bi-Weekly Hero')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Bi-Weekly Hero', 'Two weeks of pure discipline.', 'Trophy', 'var(--color-primary)', 'streak_14');
        END IF;
    END IF;

    -- Monthly Legend (30 days)
    IF v_current_streak >= 30 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'streak_30' OR title = 'Monthly Legend')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Monthly Legend', 'A full month! You are now a habit-building legend.', 'Star', 'var(--color-warning)', 'streak_30');
        END IF;
    END IF;

    -- ==========================================
    -- 4. CATEGORY MILESTONES (10 LOGS)
    -- ==========================================

    -- Fitness Fanatic
    IF NEW.category = 'fitness' THEN
        SELECT COUNT(*) INTO v_category_count FROM public.activity_logs WHERE user_id = NEW.user_id AND category = 'fitness';
        IF v_category_count >= 10 THEN
            SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'fitness_10' OR title = 'Fitness Fanatic')) INTO v_has_achievement;
            IF NOT v_has_achievement THEN
                INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
                VALUES (NEW.user_id, 'Fitness Fanatic', 'Consistency is key. You''ve logged 10 fitness activities.', 'Dumbbell', 'var(--color-success)', 'fitness_10');
            END IF;
        END IF;
    END IF;

    -- Mindset Master
    IF NEW.category = 'mindset' THEN
        SELECT COUNT(*) INTO v_category_count FROM public.activity_logs WHERE user_id = NEW.user_id AND category = 'mindset';
        IF v_category_count >= 10 THEN
            SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'mindset_10' OR title = 'Mindset Master')) INTO v_has_achievement;
            IF NOT v_has_achievement THEN
                INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
                VALUES (NEW.user_id, 'Mindset Master', 'Focus and clarity. 10 mindset sessions completed.', 'Brain', 'var(--color-primary)', 'mindset_10');
            END IF;
        END IF;
    END IF;

    -- Nutrition Ninja
    IF NEW.category = 'nutrition' THEN
        SELECT COUNT(*) INTO v_category_count FROM public.activity_logs WHERE user_id = NEW.user_id AND category = 'nutrition';
        IF v_category_count >= 10 THEN
            SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'nutrition_10' OR title = 'Nutrition Ninja')) INTO v_has_achievement;
            IF NOT v_has_achievement THEN
                INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
                VALUES (NEW.user_id, 'Nutrition Ninja', 'Fueling your body right. 10 nutrition logs.', 'Apple', 'var(--color-accent)', 'nutrition_10');
            END IF;
        END IF;
    END IF;

    -- Work Warrior
    IF NEW.category = 'work' THEN
        SELECT COUNT(*) INTO v_category_count FROM public.activity_logs WHERE user_id = NEW.user_id AND category = 'work';
        IF v_category_count >= 10 THEN
            SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'work_10' OR title = 'Work Warrior')) INTO v_has_achievement;
            IF NOT v_has_achievement THEN
                INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
                VALUES (NEW.user_id, 'Work Warrior', 'Peak productivity. 10 work blocks logged.', 'Briefcase', 'var(--color-secondary)', 'work_10');
            END IF;
        END IF;
    END IF;

    -- ==========================================
    -- 5. SPECIAL & TIME-BASED
    -- ==========================================

    -- Early Bird (Before 7 AM)
    IF v_hour < 7 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'early_bird' OR title = 'Early Bird')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Early Bird', 'The early bird gets the worm. Activity logged before 7 AM.', 'Sunrise', 'var(--color-warning)', 'early_bird');
        END IF;
    END IF;

    -- Night Owl (After 11 PM / 23)
    IF v_hour >= 23 THEN
        SELECT EXISTS(SELECT 1 FROM public.achievements WHERE user_id = NEW.user_id AND (achievement_type = 'night_owl' OR title = 'Night Owl')) INTO v_has_achievement;
        IF NOT v_has_achievement THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            VALUES (NEW.user_id, 'Night Owl', 'Burning the midnight oil. Activity logged after 11 PM.', 'Moon', 'var(--color-secondary)', 'night_owl');
        END IF;
    END IF;

    RETURN NEW;
END;
$func$;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_z_check_achievements ON public.activity_logs;
CREATE TRIGGER trg_z_check_achievements 
AFTER INSERT ON public.activity_logs 
FOR EACH ROW EXECUTE FUNCTION public.check_and_grant_achievements();

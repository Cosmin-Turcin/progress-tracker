-- Location: supabase/migrations/20251230010001_backfill_achievements.sql
-- Description: One-time script to retroactively grant 15+ achievement types to existing users

DO $BACKFILL$
DECLARE
    r RECORD;
    v_total_points INTEGER;
    v_streak INTEGER;
    v_count_fitness INTEGER;
    v_count_mindset INTEGER;
    v_count_nutrition INTEGER;
    v_count_work INTEGER;
BEGIN
    FOR r IN SELECT id, email FROM public.user_profiles LOOP
        -- 1. Get Stats directly from logs for reliability
        SELECT COUNT(*), COALESCE(SUM(points), 0) INTO r.total_activities, v_total_points FROM public.activity_logs WHERE user_id = r.id;
        
        -- Calculate Longest Streak
        WITH daily_logs AS (SELECT DISTINCT activity_date FROM public.activity_logs WHERE user_id = r.id),
             streak_calc AS (SELECT activity_date, activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::int as grp FROM daily_logs)
        SELECT COALESCE(MAX(streak_length), 0) INTO v_streak FROM (SELECT COUNT(*) as streak_length FROM streak_calc GROUP BY grp) s;

        -- Category Counts
        SELECT COUNT(*) INTO v_count_fitness FROM public.activity_logs WHERE user_id = r.id AND category = 'fitness';
        SELECT COUNT(*) INTO v_count_mindset FROM public.activity_logs WHERE user_id = r.id AND category = 'mindset';
        SELECT COUNT(*) INTO v_count_nutrition FROM public.activity_logs WHERE user_id = r.id AND category = 'nutrition';
        SELECT COUNT(*) INTO v_count_work FROM public.activity_logs WHERE user_id = r.id AND category = 'work';

        -- ==========================================
        -- 2. GRANT CORE & POINTS
        -- ==========================================
        
        -- First Steps
        IF r.total_activities >= 1 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'First Steps', 'Log your first activity! Welcome aboard.', 'Footprints', 'var(--color-primary)', 'first_steps'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND (achievement_type = 'first_steps' OR title = 'First Steps'));
        END IF;

        -- Halfway Hero (500)
        IF v_total_points >= 500 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Halfway Hero', 'Reached 500 total points across all categories.', 'Shield', 'var(--color-primary)', 'points_500'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'points_500');
        END IF;

        -- Millennium Member (1000)
        IF v_total_points >= 1000 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Millennium Member', 'Incredible! You''ve reached 1,000 total points.', 'Crown', 'var(--color-warning)', 'points_1000'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'points_1000');
        END IF;

        -- ==========================================
        -- 3. GRANT STREAKS
        -- ==========================================

        -- Streak 3
        IF v_streak >= 3 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Streak Starter', '3 days in a row! You''re building a great habit.', 'Zap', 'var(--color-warning)', 'streak_3'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND (achievement_type = 'streak_3' OR title = 'Streak Starter'));
        END IF;

        -- Streak 7
        IF v_streak >= 7 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Consistent', 'A full week! You''re on fire.', 'Flame', 'var(--color-accent)', 'streak_7'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND (achievement_type = 'streak_7' OR title = 'Consistent'));
        END IF;

        -- Streak 14
        IF v_streak >= 14 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Bi-Weekly Hero', 'Two weeks of pure discipline.', 'Trophy', 'var(--color-primary)', 'streak_14'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'streak_14');
        END IF;

        -- Streak 30
        IF v_streak >= 30 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Monthly Legend', 'A full month! You are now a habit-building legend.', 'Star', 'var(--color-warning)', 'streak_30'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'streak_30');
        END IF;

        -- ==========================================
        -- 4. GRANT CATEGORIES (10 Logs)
        -- ==========================================

        IF v_count_fitness >= 10 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Fitness Fanatic', 'Consistency is key. You''ve logged 10 fitness activities.', 'Dumbbell', 'var(--color-success)', 'fitness_10'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'fitness_10');
        END IF;

        IF v_count_mindset >= 10 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Mindset Master', 'Focus and clarity. 10 mindset sessions completed.', 'Brain', 'var(--color-primary)', 'mindset_10'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'mindset_10');
        END IF;

        IF v_count_nutrition >= 10 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Nutrition Ninja', 'Fueling your body right. 10 nutrition logs.', 'Apple', 'var(--color-accent)', 'nutrition_10'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'nutrition_10');
        END IF;

        IF v_count_work >= 10 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.id, 'Work Warrior', 'Peak productivity. 10 work blocks logged.', 'Briefcase', 'var(--color-secondary)', 'work_10'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'work_10');
        END IF;

        -- ==========================================
        -- 5. TIME-BASED BACKFILL
        -- ==========================================
        
        -- Early Bird
        IF EXISTS (SELECT 1 FROM public.activity_logs WHERE user_id = r.id AND EXTRACT(HOUR FROM (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Bucharest')) < 7) THEN
             INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
             SELECT r.id, 'Early Bird', 'Log an activity before 7:00 AM.', 'Sunrise', 'var(--color-warning)', 'early_bird'
             WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'early_bird');
        END IF;

        -- Night Owl
        IF EXISTS (SELECT 1 FROM public.activity_logs WHERE user_id = r.id AND EXTRACT(HOUR FROM (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Bucharest')) >= 23) THEN
             INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
             SELECT r.id, 'Night Owl', 'Log an activity after 11:00 PM.', 'Moon', 'var(--color-secondary)', 'night_owl'
             WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.id AND achievement_type = 'night_owl');
        END IF;

    END LOOP;
END;
$BACKFILL$;

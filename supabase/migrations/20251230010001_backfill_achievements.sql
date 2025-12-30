-- Location: supabase/migrations/20251230010001_backfill_achievements.sql
-- Description: One-time script to grant achievements to existing users who already met requirements

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT 
            us.user_id,
            us.current_streak,
            (SELECT COUNT(*) FROM public.activity_logs WHERE user_id = us.user_id) as total_activities,
            (SELECT SUM(points) FROM public.activity_logs WHERE user_id = us.user_id AND activity_date = CURRENT_DATE) as daily_points
        FROM public.user_statistics us
    ) LOOP
        -- First Steps
        IF r.total_activities >= 1 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.user_id, 'First Steps', 'You logged your first activity! Welcome aboard.', 'Footprints', 'var(--color-primary)', 'first_steps'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.user_id AND achievement_type = 'first_steps');
        END IF;

        -- Streak Starter
        IF r.current_streak >= 3 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.user_id, 'Streak Starter', '3 days in a row! You\'re building a great habit.', 'Zap', 'var(--color-warning)', 'streak_3'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.user_id AND achievement_type = 'streak_3');
        END IF;

        -- Consistent
        IF r.current_streak >= 7 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.user_id, 'Consistent', 'A full week! You\'re on fire.', 'Flame', 'var(--color-accent)', 'streak_7'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.user_id AND achievement_type = 'streak_7');
        END IF;

        -- High Flyer
        IF r.daily_points >= 100 THEN
            INSERT INTO public.achievements (user_id, title, description, icon, icon_color, achievement_type)
            SELECT r.user_id, 'High Flyer', 'You earned over 100 points in a single day!', 'Rocket', 'var(--color-success)', 'points_100_day'
            WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = r.user_id AND achievement_type = 'points_100_day');
        END IF;
    END LOOP;
END;
$$;

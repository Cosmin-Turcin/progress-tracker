-- Location: supabase/migrations/20251219085520_activity_tracking_module.sql
-- Schema Analysis: Extending existing auth and user tables
-- Integration Type: Addition of activity tracking, goals, settings, and reminders
-- Dependencies: user_profiles, user_statistics

-- ============================================================================
-- 1. ENUMS & TYPES
-- ============================================================================

CREATE TYPE public.activity_category AS ENUM ('fitness', 'mindset', 'nutrition', 'work', 'social');
CREATE TYPE public.activity_intensity AS ENUM ('light', 'normal', 'intense');
CREATE TYPE public.goal_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');
CREATE TYPE public.goal_status_type AS ENUM ('active', 'completed', 'failed', 'paused');
CREATE TYPE public.reminder_type AS ENUM ('activity', 'goal', 'streak', 'achievement');
CREATE TYPE public.reminder_frequency AS ENUM ('once', 'daily', 'weekly', 'custom');

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_name TEXT NOT NULL,
    category public.activity_category NOT NULL,
    intensity public.activity_intensity DEFAULT 'normal'::public.activity_intensity,
    points INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    notes TEXT,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_time TIME,
    icon TEXT,
    icon_color TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Goals Table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goal_type public.goal_type NOT NULL DEFAULT 'daily'::public.goal_type,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    unit TEXT,
    category public.activity_category,
    goal_status public.goal_status_type DEFAULT 'active'::public.goal_status_type,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_points JSONB DEFAULT '{"fitness": {"base": 10, "multiplier": 1.5}, "mindset": {"base": 8, "multiplier": 1.3}, "nutrition": {"base": 5, "multiplier": 1.2}, "work": {"base": 15, "multiplier": 1.4}, "social": {"base": 7, "multiplier": 1.1}}'::JSONB,
    daily_goals JSONB DEFAULT '{"totalPoints": 100, "activityFrequency": 5, "streakTarget": 7}'::JSONB,
    notifications JSONB DEFAULT '{"pushEnabled": true, "emailSummary": true, "reminderTime": "09:00", "achievementAlerts": true}'::JSONB,
    system_preferences JSONB DEFAULT '{"theme": "light", "language": "en", "autoExport": false, "privacyMode": false}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Reminders Table
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    reminder_type public.reminder_type NOT NULL,
    frequency public.reminder_frequency NOT NULL DEFAULT 'once'::public.reminder_frequency,
    scheduled_time TIME NOT NULL,
    scheduled_days INTEGER[], -- Array of days: 0=Sunday, 1=Monday, etc.
    is_active BOOLEAN DEFAULT true,
    last_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Achievements Table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    icon_color TEXT,
    achieved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_new BOOLEAN DEFAULT true,
    achievement_type TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_date ON public.activity_logs(activity_date);
CREATE INDEX idx_activity_logs_category ON public.activity_logs(category);
CREATE INDEX idx_activity_logs_user_date ON public.activity_logs(user_id, activity_date);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(goal_status);
CREATE INDEX idx_goals_user_status ON public.goals(user_id, goal_status);

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_reminders_is_active ON public.reminders(is_active);
CREATE INDEX idx_reminders_user_active ON public.reminders(user_id, is_active);

CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_is_new ON public.achievements(is_new);

-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- Function to update user statistics when activity is logged
CREATE OR REPLACE FUNCTION public.update_user_statistics_on_activity()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    -- Update user_statistics
    UPDATE public.user_statistics
    SET 
        total_points = total_points + NEW.points,
        total_activities = total_activities + 1,
        last_activity_date = NEW.activity_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;

    -- Recalculate streak
    PERFORM public.calculate_user_streak(NEW.user_id);
    
    RETURN NEW;
END;
$func$;

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION public.calculate_user_streak(p_user_id UUID)
RETURNS INTEGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
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
        RETURN 0;
    END IF;
    
    -- Check if streak is still active (activity today or yesterday)
    IF v_last_date < CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN 0;
    END IF;
    
    -- Calculate consecutive days
    v_check_date := v_last_date;
    WHILE EXISTS (
        SELECT 1 FROM public.activity_logs
        WHERE user_id = p_user_id AND activity_date = v_check_date
    ) LOOP
        v_current_streak := v_current_streak + 1;
        v_check_date := v_check_date - INTERVAL '1 day';
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
$func$;

-- Function to auto-create user settings
CREATE OR REPLACE FUNCTION public.create_default_user_settings()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$func$;

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- Activity Logs Policies (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_activity_logs"
ON public.activity_logs
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Goals Policies (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_goals"
ON public.goals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User Settings Policies (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_settings"
ON public.user_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Reminders Policies (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_reminders"
ON public.reminders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Achievements Policies (Pattern 2: Simple User Ownership)
CREATE POLICY "users_manage_own_achievements"
ON public.achievements
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger to update statistics when activity is logged
CREATE TRIGGER trg_update_statistics_on_activity
    AFTER INSERT ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_statistics_on_activity();

-- Trigger to create default settings when user profile is created
CREATE TRIGGER trg_create_default_settings
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_user_settings();

-- ============================================================================
-- 8. MOCK DATA (Reference existing users)
-- ============================================================================

DO $$
DECLARE
    demo_user_id UUID;
    test_user_id UUID;
    activity_id_1 UUID := gen_random_uuid();
    activity_id_2 UUID := gen_random_uuid();
    activity_id_3 UUID := gen_random_uuid();
    goal_id_1 UUID := gen_random_uuid();
    goal_id_2 UUID := gen_random_uuid();
BEGIN
    -- Get existing user IDs
    SELECT id INTO demo_user_id FROM public.user_profiles WHERE email = 'demo@progresstracker.com' LIMIT 1;
    SELECT id INTO test_user_id FROM public.user_profiles WHERE email = 'test@progresstracker.com' LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Insert sample activities for demo user
        INSERT INTO public.activity_logs (id, user_id, activity_name, category, intensity, points, duration_minutes, activity_date, activity_time, icon, icon_color)
        VALUES
            (activity_id_1, demo_user_id, 'Morning yoga session', 'fitness', 'light', 15, 30, CURRENT_DATE, '07:00', 'Dumbbell', 'var(--color-primary)'),
            (activity_id_2, demo_user_id, 'Meditation practice', 'mindset', 'normal', 10, 15, CURRENT_DATE, '07:30', 'Brain', 'var(--color-secondary)'),
            (activity_id_3, demo_user_id, 'Cardio run', 'fitness', 'intense', 25, 45, CURRENT_DATE, '11:00', 'Heart', 'var(--color-error)');
        
        -- Insert sample goals for demo user
        INSERT INTO public.goals (id, user_id, title, description, goal_type, target_value, current_value, unit, category, goal_status, start_date, end_date)
        VALUES
            (goal_id_1, demo_user_id, 'Daily Activity Points', 'Reach 100 points every day', 'daily', 100, 50, 'points', 'fitness', 'active', CURRENT_DATE, CURRENT_DATE),
            (goal_id_2, demo_user_id, 'Weekly Streak', 'Maintain 7-day streak', 'weekly', 7, 3, 'days', 'fitness', 'active', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days');
        
        -- Insert sample reminders for demo user
        INSERT INTO public.reminders (user_id, title, message, reminder_type, frequency, scheduled_time, scheduled_days, is_active)
        VALUES
            (demo_user_id, 'Morning Workout', 'Time for your morning exercise routine', 'activity', 'daily', '06:30', ARRAY[1,2,3,4,5], true),
            (demo_user_id, 'Evening Meditation', 'Wind down with meditation', 'activity', 'daily', '20:00', ARRAY[0,1,2,3,4,5,6], true);
        
        -- Insert sample achievements for demo user
        INSERT INTO public.achievements (user_id, title, description, icon, icon_color, is_new, achievement_type)
        VALUES
            (demo_user_id, '7-Day Streak!', 'You have logged activities for 7 consecutive days', 'Flame', 'var(--color-accent)', true, 'streak'),
            (demo_user_id, 'Fitness Milestone', 'Reached 500 total fitness points this month', 'Trophy', 'var(--color-success)', true, 'milestone');
    END IF;
    
    IF test_user_id IS NOT NULL THEN
        -- Insert sample activity for test user
        INSERT INTO public.activity_logs (user_id, activity_name, category, intensity, points, duration_minutes, activity_date, activity_time, icon, icon_color)
        VALUES
            (test_user_id, 'Quick workout', 'fitness', 'normal', 20, 20, CURRENT_DATE, '08:00', 'Dumbbell', 'var(--color-primary)');
    END IF;
END $$;
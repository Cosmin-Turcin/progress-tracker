-- Location: supabase/migrations/20251219085147_auth_user_profiles.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: NEW_MODULE - Complete authentication system
-- Dependencies: None

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- 2. Core Tables - user_profiles as intermediary
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    role public.user_role DEFAULT 'user'::public.user_role,
    bio TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User statistics tracking
CREATE TABLE public.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    total_activities INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    achievements_unlocked INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_statistics_user_id ON public.user_statistics(user_id);

-- 4. Trigger Function for Automatic Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create user profile from auth.users metadata
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
    );
    
    -- Create initial statistics record
    INSERT INTO public.user_statistics (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

-- 5. Trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies - Pattern 1 for user_profiles (core user table)
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2 for user_statistics (simple user ownership)
CREATE POLICY "users_manage_own_statistics"
ON public.user_statistics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Mock Data - Complete auth.users for testing
DO $$
DECLARE
    demo_user_id UUID := gen_random_uuid();
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Create demo users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (demo_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@progresstracker.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User", "avatar_url": "", "role": "user"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (test_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'test@progresstracker.com', crypt('test123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Test User", "avatar_url": "", "role": "user"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update statistics with sample data
    UPDATE public.user_statistics
    SET 
        total_activities = 45,
        current_streak = 7,
        longest_streak = 15,
        total_points = 2340,
        achievements_unlocked = 8,
        last_activity_date = CURRENT_DATE
    WHERE user_id = demo_user_id;

    UPDATE public.user_statistics
    SET 
        total_activities = 23,
        current_streak = 3,
        longest_streak = 8,
        total_points = 1150,
        achievements_unlocked = 4,
        last_activity_date = CURRENT_DATE - INTERVAL '1 day'
    WHERE user_id = test_user_id;
END $$;
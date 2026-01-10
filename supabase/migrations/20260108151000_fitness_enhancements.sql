-- Fitness Enhancements Migration
-- Adds tables for saved routines and live sessions

-- Create workout_saves table
CREATE TABLE IF NOT EXISTS public.workout_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES public.workout_routines(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, routine_id)
);

-- Enable RLS for saves
ALTER TABLE public.workout_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saves"
    ON public.workout_saves FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save routines"
    ON public.workout_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave routines"
    ON public.workout_saves FOR DELETE
    USING (auth.uid() = user_id);

-- Create live_sessions table
CREATE TABLE IF NOT EXISTS public.live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('HIIT', 'Strength', 'Yoga', 'Mindfulness', 'Nutrition Q&A', 'Other')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    stream_url TEXT,
    thumbnail_url TEXT,
    is_live BOOLEAN DEFAULT false,
    attendees_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for live sessions
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live sessions"
    ON public.live_sessions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create sessions"
    ON public.live_sessions FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own sessions"
    ON public.live_sessions FOR UPDATE
    USING (auth.uid() = creator_id);

-- Add some seed data for live sessions
INSERT INTO public.live_sessions (creator_id, title, description, category, scheduled_at, duration_minutes, is_live)
SELECT 
    id, 
    'Elite HIIT Protocol', 
    'High-intensity interval training for maximum metabolic boost.', 
    'HIIT', 
    NOW() + INTERVAL '2 hours', 
    45,
    false
FROM public.user_profiles 
LIMIT 1;

INSERT INTO public.live_sessions (creator_id, title, description, category, scheduled_at, duration_minutes, is_live)
SELECT 
    id, 
    'Zen Yoga Flow', 
    'Recovery and mobility session for high-achievers.', 
    'Yoga', 
    NOW() + INTERVAL '1 day', 
    60,
    false
FROM public.user_profiles 
LIMIT 1;

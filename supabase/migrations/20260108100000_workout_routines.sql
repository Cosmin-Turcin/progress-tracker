-- Workout Routines Migration
-- Creates tables for storing and sharing workout routines

-- Create workout_routines table
CREATE TABLE IF NOT EXISTS public.workout_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER DEFAULT 30,
    difficulty TEXT DEFAULT 'Intermediate',
    video_url TEXT,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_routines_user_id ON public.workout_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_routines_is_public ON public.workout_routines(is_public);
CREATE INDEX IF NOT EXISTS idx_workout_routines_created_at ON public.workout_routines(created_at DESC);

-- Enable RLS
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_routines
-- Everyone can view public routines
CREATE POLICY "Anyone can view public routines"
    ON public.workout_routines FOR SELECT
    USING (is_public = true);

-- Users can view their own routines (including private)
CREATE POLICY "Users can view own routines"
    ON public.workout_routines FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own routines
CREATE POLICY "Users can create routines"
    ON public.workout_routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own routines
CREATE POLICY "Users can update own routines"
    ON public.workout_routines FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own routines
CREATE POLICY "Users can delete own routines"
    ON public.workout_routines FOR DELETE
    USING (auth.uid() = user_id);

-- Seed sample routines (using existing demo user if available)
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to find an existing user to attach routines to
    SELECT id INTO demo_user_id FROM public.user_profiles LIMIT 1;
    
    -- Only insert if we have a user
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO public.workout_routines (user_id, title, description, duration, difficulty, exercises, is_public)
        VALUES
            (demo_user_id, 'Explosive Morning Power', 'High-intensity interval training designed to jumpstart your metabolic rate.', 35, 'Hard', '[{"name": "Jumping Jacks", "duration": "60", "reps": "50"}, {"name": "Burpees", "reps": "20"}, {"name": "Mountain Climbers", "duration": "45"}, {"name": "Push Ups", "reps": "30"}]'::jsonb, true),
            (demo_user_id, 'Mind-Muscle Connection', 'Slow, controlled movements focusing on muscle hypertrophy and isometric holds.', 50, 'Mid', '[{"name": "Tempo Squats", "reps": "15", "sets": "4"}, {"name": "Slow Pushups", "reps": "12", "sets": "4"}, {"name": "Static Lunge", "duration": "30", "sets": "3"}]'::jsonb, true),
            (demo_user_id, 'Core Foundation Elite', 'The ultimate core stabilization program used by professional athletes.', 20, 'Pro', '[{"name": "Plank", "duration": "120"}, {"name": "Hollow Body Hold", "duration": "60"}, {"name": "Dragon Flags", "reps": "8"}]'::jsonb, true);
    END IF;
END $$;

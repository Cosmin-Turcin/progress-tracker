-- Migration: Add professional_data to user_profiles
-- Description: Adds a JSONB column to store experience, education, and skills.

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS professional_data JSONB DEFAULT '{"experience": [], "education": [], "skills": [], "summary": ""}'::jsonb;

-- Update RLS policies to ensure users can manage their professional data
-- (Existing policies on user_profiles already cover this since it's the same table)

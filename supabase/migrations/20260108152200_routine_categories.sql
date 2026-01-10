-- Add category column to workout_routines
ALTER TABLE public.workout_routines 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General' CHECK (category IN ('General', 'Strength', 'HIIT', 'Yoga', 'Cardio', 'Mobility', 'Other'));

-- Update existing routines to have a more descriptive category
UPDATE public.workout_routines SET category = 'HIIT' WHERE title ILIKE '%HIIT%' OR title ILIKE '%Morning Power%';
UPDATE public.workout_routines SET category = 'Strength' WHERE title ILIKE '%Muscle%' OR title ILIKE '%Power%';
UPDATE public.workout_routines SET category = 'Other' WHERE title ILIKE '%Core%';

-- Create an index for category searches
CREATE INDEX IF NOT EXISTS idx_workout_routines_category ON public.workout_routines(category);

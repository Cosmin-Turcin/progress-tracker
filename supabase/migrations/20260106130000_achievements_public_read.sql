-- Migration: Allow public read access to achievements for search feature
-- Description: Adds RLS policy to allow authenticated users to view all achievements

-- Drop existing policy if any
DROP POLICY IF EXISTS "achievements_public_read" ON public.achievements;

-- Allow authenticated users to view all achievements (for profile views and search)
CREATE POLICY "achievements_public_read"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

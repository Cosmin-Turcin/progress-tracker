-- Migration: Add cover_url to user_profiles
-- Description: Adds a TEXT column to store a custom cover image URL.

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS cover_url TEXT;

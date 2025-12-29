-- Add 'others' to activity_category enum
ALTER TYPE public.activity_category ADD VALUE 'others';

-- Update user_settings table to include 'others' in default activity_points
ALTER TABLE public.user_settings 
ALTER COLUMN activity_points SET DEFAULT '{"fitness": {"base": 10, "multiplier": 1.5}, "mindset": {"base": 8, "multiplier": 1.3}, "nutrition": {"base": 5, "multiplier": 1.2}, "work": {"base": 15, "multiplier": 1.4}, "social": {"base": 7, "multiplier": 1.1}, "others": {"base": 5, "multiplier": 1.0}}'::JSONB;

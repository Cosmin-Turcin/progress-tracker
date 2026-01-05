-- Add username column to user_profiles
ALTER TABLE IF EXISTS public.user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create an index for case-insensitive username lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_lower ON public.user_profiles (LOWER(username));

-- Add constraint for username format
ALTER TABLE public.user_profiles
ADD CONSTRAINT username_format_check 
CHECK (username ~* '^[a-zA-Z0-9_\.]{3,20}$');

-- Update the handle_new_user function to handle username from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  );
  
  -- Also initialize user statistics
  INSERT INTO public.user_statistics (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

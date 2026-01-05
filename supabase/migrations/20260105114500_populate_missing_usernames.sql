-- Populate missing usernames for existing users
-- Uses a combination of full_name (if available) and a short UUID fragment to ensure uniqueness
UPDATE public.user_profiles
SET username = LOWER(
    REGEXP_REPLACE(
        COALESCE(full_name, 'user'), 
        '[^a-zA-Z0-9]', 
        '', 
        'g'
    )
) || SUBSTRING(id::TEXT, 1, 4)
WHERE username IS NULL;

-- Ensure all current profiles satisfy the format constraint (just in case)
-- This might fail if the update above somehow creates a conflict, but the UUID fragment makes it unlikely.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE username IS NULL) THEN
        RAISE EXCEPTION 'Failed to populate all missing usernames';
    END IF;
END $$;

-- ================================================================
-- FIX: Messages to User Profiles Relationship
-- Purpose: Update foreign key to reference user_profiles instead of auth.users
-- Issue: PostgREST cannot find relationship between messages and user_profiles
-- ================================================================

-- Drop existing foreign key constraint on messages.sender_id
ALTER TABLE public.messages 
    DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- Add new foreign key constraint referencing user_profiles
ALTER TABLE public.messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) 
    REFERENCES public.user_profiles(id) 
    ON DELETE CASCADE;

-- Also fix conversations table to reference user_profiles
ALTER TABLE public.conversations 
    DROP CONSTRAINT IF EXISTS conversations_user1_id_fkey;

ALTER TABLE public.conversations 
    DROP CONSTRAINT IF EXISTS conversations_user2_id_fkey;

ALTER TABLE public.conversations 
    ADD CONSTRAINT conversations_user1_id_fkey 
    FOREIGN KEY (user1_id) 
    REFERENCES public.user_profiles(id) 
    ON DELETE CASCADE;

ALTER TABLE public.conversations 
    ADD CONSTRAINT conversations_user2_id_fkey 
    FOREIGN KEY (user2_id) 
    REFERENCES public.user_profiles(id) 
    ON DELETE CASCADE;

-- Verify relationships are now correct
COMMENT ON CONSTRAINT messages_sender_id_fkey ON public.messages IS 
    'Foreign key to user_profiles for PostgREST relationship resolution';

COMMENT ON CONSTRAINT conversations_user1_id_fkey ON public.conversations IS 
    'Foreign key to user_profiles for PostgREST relationship resolution';

COMMENT ON CONSTRAINT conversations_user2_id_fkey ON public.conversations IS 
    'Foreign key to user_profiles for PostgREST relationship resolution';
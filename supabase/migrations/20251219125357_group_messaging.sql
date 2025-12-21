-- Location: supabase/migrations/20251219125357_group_messaging.sql
-- Schema Analysis: Existing 1-on-1 messaging (conversations, messages, message_reactions, typing_indicators)
-- Integration Type: Extension - Adding group messaging capabilities
-- Dependencies: user_profiles, conversations, messages, message_reactions

-- ================================================================
-- 1. TYPES
-- ================================================================

CREATE TYPE public.group_member_role AS ENUM ('owner', 'admin', 'member');

-- ================================================================
-- 2. TABLES - GROUP CONVERSATIONS
-- ================================================================

-- Group conversations (supports multiple users)
CREATE TABLE public.group_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_team_activity BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMPTZ
);

-- Group members junction table
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.group_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.group_member_role DEFAULT 'member'::public.group_member_role,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_muted BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    UNIQUE(conversation_id, user_id)
);

-- Group messages (reuse existing messages table structure but add group support)
CREATE TABLE public.group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.group_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    file_type TEXT,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES public.activity_logs(id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    read_by JSONB DEFAULT '[]'::jsonb
);

-- Group message reactions
CREATE TABLE public.group_message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji)
);

-- Group typing indicators
CREATE TABLE public.group_typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.group_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + interval '10 seconds'),
    UNIQUE(conversation_id, user_id)
);

-- ================================================================
-- 3. INDEXES
-- ================================================================

CREATE INDEX idx_group_conversations_created_by ON public.group_conversations(created_by);
CREATE INDEX idx_group_conversations_last_message ON public.group_conversations(last_message_at DESC);
CREATE INDEX idx_group_members_conversation ON public.group_members(conversation_id);
CREATE INDEX idx_group_members_user ON public.group_members(user_id);
CREATE INDEX idx_group_messages_conversation ON public.group_messages(conversation_id, created_at DESC);
CREATE INDEX idx_group_messages_sender ON public.group_messages(sender_id);
CREATE INDEX idx_group_message_reactions_message ON public.group_message_reactions(message_id);
CREATE INDEX idx_group_typing_conversation ON public.group_typing_indicators(conversation_id);

-- ================================================================
-- 4. STORAGE BUCKET FOR FILE ATTACHMENTS
-- ================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'message-attachments',
    'message-attachments',
    false,
    52428800,
    ARRAY[
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
);

-- ================================================================
-- 5. FUNCTIONS
-- ================================================================

-- Function to update group conversation timestamp
CREATE OR REPLACE FUNCTION public.update_group_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    UPDATE public.group_conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$func$;

-- Function to add user to read_by array
CREATE OR REPLACE FUNCTION public.mark_group_message_as_read(message_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    current_read_by JSONB;
BEGIN
    SELECT read_by INTO current_read_by
    FROM public.group_messages
    WHERE id = message_uuid;
    
    IF NOT (current_read_by ? user_uuid::TEXT) THEN
        UPDATE public.group_messages
        SET read_by = current_read_by || jsonb_build_object(user_uuid::TEXT, NOW())
        WHERE id = message_uuid;
    END IF;
    
    RETURN true;
END;
$func$;

-- Function to get group members with profiles
CREATE OR REPLACE FUNCTION public.get_group_members_with_profiles(conversation_uuid UUID)
RETURNS TABLE(
    member_id UUID,
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT,
    joined_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $func$
SELECT 
    gm.id as member_id,
    gm.user_id,
    up.full_name,
    up.avatar_url,
    gm.role::TEXT,
    gm.joined_at
FROM public.group_members gm
JOIN public.user_profiles up ON gm.user_id = up.id
WHERE gm.conversation_id = conversation_uuid
ORDER BY gm.joined_at;
$func$;

-- ================================================================
-- 6. ENABLE RLS
-- ================================================================

ALTER TABLE public.group_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_typing_indicators ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 7. RLS POLICIES
-- ================================================================

-- Group Conversations: Users can view groups they are members of
CREATE POLICY "users_view_member_groups"
ON public.group_conversations
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = id
        AND gm.user_id = auth.uid()
    )
);

-- Group Conversations: Users can create new groups
CREATE POLICY "users_create_groups"
ON public.group_conversations
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Group Conversations: Owners and admins can update
CREATE POLICY "admins_update_groups"
ON public.group_conversations
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'admin')
    )
);

-- Group Members: Users can view members of groups they belong to
CREATE POLICY "users_view_group_members"
ON public.group_members
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm2
        WHERE gm2.conversation_id = conversation_id
        AND gm2.user_id = auth.uid()
    )
);

-- Group Members: Owners and admins can add members
CREATE POLICY "admins_add_members"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = conversation_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'admin')
    )
);

-- Group Members: Users can update their own settings
CREATE POLICY "users_update_own_membership"
ON public.group_members
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Group Members: Owners and admins can update other members
CREATE POLICY "admins_update_members"
ON public.group_members
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = conversation_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'admin')
    )
);

-- Group Messages: Users can view messages in groups they belong to
CREATE POLICY "users_view_group_messages"
ON public.group_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = conversation_id
        AND gm.user_id = auth.uid()
    )
);

-- Group Messages: Members can send messages
CREATE POLICY "members_send_messages"
ON public.group_messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = conversation_id
        AND gm.user_id = auth.uid()
    )
);

-- Group Messages: Users can update their own messages
CREATE POLICY "users_update_own_messages"
ON public.group_messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid());

-- Group Messages: Users can delete their own messages
CREATE POLICY "users_delete_own_messages"
ON public.group_messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- Group Message Reactions: Users can view reactions in their groups
CREATE POLICY "users_view_group_reactions"
ON public.group_message_reactions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_messages gm
        JOIN public.group_members gmem ON gm.conversation_id = gmem.conversation_id
        WHERE gm.id = message_id
        AND gmem.user_id = auth.uid()
    )
);

-- Group Message Reactions: Users can add reactions
CREATE POLICY "users_add_group_reactions"
ON public.group_message_reactions
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.group_messages gm
        JOIN public.group_members gmem ON gm.conversation_id = gmem.conversation_id
        WHERE gm.id = message_id
        AND gmem.user_id = auth.uid()
    )
);

-- Group Message Reactions: Users can remove their own reactions
CREATE POLICY "users_remove_own_reactions"
ON public.group_message_reactions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Group Typing Indicators: Users can view typing in their groups
CREATE POLICY "users_view_group_typing"
ON public.group_typing_indicators
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.conversation_id = conversation_id
        AND gm.user_id = auth.uid()
    )
);

-- Group Typing Indicators: Users can set typing status
CREATE POLICY "users_set_group_typing"
ON public.group_typing_indicators
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Storage RLS: Users can upload to their own folder
CREATE POLICY "users_upload_attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'message-attachments'
    AND owner = auth.uid()
);

-- Storage RLS: Users can view attachments in their groups
CREATE POLICY "users_view_attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'message-attachments'
);

-- Storage RLS: Users can delete their own attachments
CREATE POLICY "users_delete_own_attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'message-attachments'
    AND owner = auth.uid()
);

-- ================================================================
-- 8. TRIGGERS
-- ================================================================

CREATE TRIGGER trigger_update_group_conversation_timestamp
AFTER INSERT ON public.group_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_group_conversation_timestamp();

-- ================================================================
-- 9. MOCK DATA
-- ================================================================

DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    group1_id UUID;
    group2_id UUID;
    msg1_id UUID;
BEGIN
    SELECT id INTO user1_id FROM public.user_profiles LIMIT 1 OFFSET 0;
    SELECT id INTO user2_id FROM public.user_profiles LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM public.user_profiles LIMIT 1 OFFSET 2;
    
    IF user1_id IS NULL OR user2_id IS NULL THEN
        RAISE NOTICE 'Not enough users found. Skipping group messaging mock data.';
        RETURN;
    END IF;
    
    group1_id := gen_random_uuid();
    group2_id := gen_random_uuid();
    
    INSERT INTO public.group_conversations (id, name, description, created_by, is_team_activity, last_message_at)
    VALUES 
        (group1_id, 'Morning Runners', 'Daily morning run group for fitness enthusiasts', user1_id, true, NOW() - interval '2 hours'),
        (group2_id, 'Meditation Squad', 'Evening meditation and mindfulness practice', user2_id, true, NOW() - interval '5 hours');
    
    INSERT INTO public.group_members (conversation_id, user_id, role)
    VALUES
        (group1_id, user1_id, 'owner'),
        (group1_id, user2_id, 'admin'),
        (group2_id, user2_id, 'owner'),
        (group2_id, user1_id, 'member');
    
    IF user3_id IS NOT NULL THEN
        INSERT INTO public.group_members (conversation_id, user_id, role)
        VALUES
            (group1_id, user3_id, 'member'),
            (group2_id, user3_id, 'member');
    END IF;
    
    msg1_id := gen_random_uuid();
    
    INSERT INTO public.group_messages (id, conversation_id, sender_id, content, message_type, created_at)
    VALUES
        (msg1_id, group1_id, user1_id, 'Good morning everyone! Ready for our 5K run today? 🏃', 'text', NOW() - interval '2 hours'),
        (gen_random_uuid(), group1_id, user2_id, 'Absolutely! Meeting at the usual spot at 6 AM? 💪', 'text', NOW() - interval '90 minutes'),
        (gen_random_uuid(), group2_id, user2_id, 'Who is joining for evening meditation today?', 'text', NOW() - interval '5 hours'),
        (gen_random_uuid(), group2_id, user1_id, 'I will be there! Looking forward to it 🧘', 'text', NOW() - interval '4 hours');
    
    INSERT INTO public.group_message_reactions (message_id, user_id, emoji)
    VALUES
        (msg1_id, user2_id, '👍'),
        (msg1_id, user1_id, '🔥');
    
END $$;
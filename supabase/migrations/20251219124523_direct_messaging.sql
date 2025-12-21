-- ================================================================
-- DIRECT MESSAGING MODULE
-- Purpose: One-on-one chat between friends with real-time delivery
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- CONVERSATIONS TABLE
-- Purpose: Store conversation metadata between two users
-- ================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    
    -- Participants (always two users for direct messaging)
    user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata
    is_archived_user1 BOOLEAN DEFAULT FALSE,
    is_archived_user2 BOOLEAN DEFAULT FALSE,
    is_muted_user1 BOOLEAN DEFAULT FALSE,
    is_muted_user2 BOOLEAN DEFAULT FALSE,
    
    -- Constraints
    CONSTRAINT different_users CHECK (user1_id != user2_id),
    CONSTRAINT ordered_users CHECK (user1_id < user2_id),
    CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id)
);

-- Indexes for conversations
CREATE INDEX idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- ================================================================
-- MESSAGES TABLE
-- Purpose: Store individual chat messages
-- ================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'activity', 'achievement', 'sticker')),
    
    -- Metadata for special message types
    activity_id UUID REFERENCES public.activity_logs(id) ON DELETE SET NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE SET NULL,
    sticker_id VARCHAR(50),
    
    -- Delivery status
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    -- Message state
    is_deleted BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ
);

-- Indexes for messages
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_unread ON public.messages(conversation_id, read_at) WHERE read_at IS NULL;

-- ================================================================
-- MESSAGE REACTIONS TABLE
-- Purpose: Store emoji reactions to messages
-- ================================================================
CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_message_reaction UNIQUE (message_id, user_id)
);

CREATE INDEX idx_message_reactions_message ON public.message_reactions(message_id);

-- ================================================================
-- TYPING INDICATORS TABLE
-- Purpose: Track real-time typing status
-- ================================================================
CREATE TABLE IF NOT EXISTS public.typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 seconds'),
    
    CONSTRAINT unique_typing_indicator UNIQUE (conversation_id, user_id)
);

CREATE INDEX idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);

-- ================================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ================================================================
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET updated_at = NOW(),
        last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- ================================================================
-- AUTO-CLEANUP EXPIRED TYPING INDICATORS
-- ================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
    DELETE FROM public.typing_indicators
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations with friends"
    ON public.conversations FOR INSERT
    WITH CHECK (
        (auth.uid() = user1_id OR auth.uid() = user2_id)
        AND EXISTS (
            SELECT 1 FROM public.friendships
            WHERE (user_id = user1_id AND friend_id = user2_id AND status = 'accepted')
               OR (user_id = user2_id AND friend_id = user1_id AND status = 'accepted')
        )
    );

CREATE POLICY "Users can update their own conversation settings"
    ON public.conversations FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id)
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_id
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_id
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages"
    ON public.messages FOR UPDATE
    USING (sender_id = auth.uid())
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
    ON public.messages FOR DELETE
    USING (sender_id = auth.uid());

-- Message reactions policies
CREATE POLICY "Users can view reactions on accessible messages"
    ON public.message_reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON m.conversation_id = c.id
            WHERE m.id = message_id
            AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can add reactions to accessible messages"
    ON public.message_reactions FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON m.conversation_id = c.id
            WHERE m.id = message_id
            AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can remove their own reactions"
    ON public.message_reactions FOR DELETE
    USING (user_id = auth.uid());

-- Typing indicators policies
CREATE POLICY "Users can view typing in their conversations"
    ON public.typing_indicators FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_id
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can set typing status in their conversations"
    ON public.typing_indicators FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_id
            AND (user1_id = auth.uid() OR user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own typing status"
    ON public.typing_indicators FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own typing status"
    ON public.typing_indicators FOR DELETE
    USING (user_id = auth.uid());

-- ================================================================
-- HELPER FUNCTIONS
-- ================================================================

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
    p_user1_id UUID,
    p_user2_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_conversation_id UUID;
    v_ordered_user1_id UUID;
    v_ordered_user2_id UUID;
BEGIN
    -- Order user IDs to maintain consistency
    IF p_user1_id < p_user2_id THEN
        v_ordered_user1_id := p_user1_id;
        v_ordered_user2_id := p_user2_id;
    ELSE
        v_ordered_user1_id := p_user2_id;
        v_ordered_user2_id := p_user1_id;
    END IF;
    
    -- Try to find existing conversation
    SELECT id INTO v_conversation_id
    FROM public.conversations
    WHERE user1_id = v_ordered_user1_id 
    AND user2_id = v_ordered_user2_id;
    
    -- Create if doesn't exist
    IF v_conversation_id IS NULL THEN
        INSERT INTO public.conversations (user1_id, user2_id)
        VALUES (v_ordered_user1_id, v_ordered_user2_id)
        RETURNING id INTO v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    UPDATE public.messages
    SET read_at = NOW()
    WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND read_at IS NULL;
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- MOCK DATA FOR TESTING
-- ================================================================
DO $$
DECLARE
    v_user1_id UUID;
    v_user2_id UUID;
    v_conversation_id UUID;
BEGIN
    -- Get existing users
    SELECT id INTO v_user1_id FROM auth.users LIMIT 1;
    SELECT id INTO v_user2_id FROM auth.users OFFSET 1 LIMIT 1;
    
    IF v_user1_id IS NOT NULL AND v_user2_id IS NOT NULL THEN
        -- Create conversation
        v_conversation_id := get_or_create_conversation(v_user1_id, v_user2_id);
        
        -- Insert sample messages
        INSERT INTO public.messages (conversation_id, sender_id, content, created_at, delivered_at, read_at)
        VALUES
            (v_conversation_id, v_user1_id, 'Hey! How was your workout today?', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 50 minutes'),
            (v_conversation_id, v_user2_id, 'It was great! Just hit a new PR on squats 💪', NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '1 hour 40 minutes'),
            (v_conversation_id, v_user1_id, 'That''s awesome! What was your PR?', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour 25 minutes'),
            (v_conversation_id, v_user2_id, '185 lbs for 5 reps! I''m so pumped!', NOW() - INTERVAL '1 hour 20 minutes', NOW() - INTERVAL '1 hour 20 minutes', NOW() - INTERVAL '1 hour 15 minutes'),
            (v_conversation_id, v_user1_id, 'Congratulations! 🎉 Want to do a leg day challenge tomorrow?', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes'),
            (v_conversation_id, v_user2_id, 'Absolutely! Let''s crush it together 🔥', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '40 minutes'),
            (v_conversation_id, v_user1_id, 'Perfect! Meet at the gym at 7am?', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NULL),
            (v_conversation_id, v_user2_id, 'See you there! 💪', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NULL);
        
        RAISE NOTICE 'Mock conversation and messages created successfully';
    END IF;
END $$;
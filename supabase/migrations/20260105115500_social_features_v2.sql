-- Create achievement_reactions table
CREATE TABLE IF NOT EXISTS public.achievement_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL DEFAULT 'congratulations',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create friend_challenges table
CREATE TABLE IF NOT EXISTS public.friend_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenged_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_type TEXT NOT NULL,
    challenge_details TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, completed
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.achievement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievement_reactions
-- 1. Users can view all reactions (social feature)
-- 2. Users can create their own reactions
-- 3. Users can delete their own reactions
CREATE POLICY "anyone_view_achievement_reactions" ON public.achievement_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_create_own_achievement_reactions" ON public.achievement_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_delete_own_achievement_reactions" ON public.achievement_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for friend_challenges
-- 1. Users can view challenges they are involved in
-- 2. Users can create challenges
-- 3. Involved users can update challenges (accept/complete)
CREATE POLICY "users_view_own_challenges" ON public.friend_challenges FOR SELECT TO authenticated USING (challenger_id = auth.uid() OR challenged_id = auth.uid());
CREATE POLICY "users_create_challenges" ON public.friend_challenges FOR INSERT TO authenticated WITH CHECK (challenger_id = auth.uid());
CREATE POLICY "users_update_own_challenges" ON public.friend_challenges FOR UPDATE TO authenticated USING (challenger_id = auth.uid() OR challenged_id = auth.uid()) WITH CHECK (challenger_id = auth.uid() OR challenged_id = auth.uid());

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_achievement_reactions_achievement_user_id ON public.achievement_reactions(achievement_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_participants ON public.friend_challenges(challenger_id, challenged_id);

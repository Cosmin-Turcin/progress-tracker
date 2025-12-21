-- Location: supabase/migrations/20251219094814_friends_leaderboard.sql
-- Schema Analysis: Existing tables - user_profiles, user_statistics, achievements
-- Integration Type: Extension - Adding friendships functionality
-- Dependencies: user_profiles table

-- 1. Create friendship_status enum
CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'declined');

-- 2. Create friendships table
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.friendship_status DEFAULT 'pending'::public.friendship_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT friendships_no_self_friendship CHECK (user_id != friend_id),
    CONSTRAINT friendships_unique_pair UNIQUE (user_id, friend_id)
);

-- 3. Create indexes for friendships
CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

-- 4. Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for friendships
CREATE POLICY "users_view_own_friendships"
ON public.friendships
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "users_create_friendships"
ON public.friendships
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_friendships"
ON public.friendships
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR friend_id = auth.uid())
WITH CHECK (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "users_delete_own_friendships"
ON public.friendships
FOR DELETE
TO authenticated
USING (user_id = auth.uid() OR friend_id = auth.uid());

-- 6. Create function to get friends leaderboard
CREATE OR REPLACE FUNCTION public.get_friends_leaderboard(
    requesting_user_id UUID,
    time_period TEXT DEFAULT 'all-time',
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    total_points INTEGER,
    current_streak INTEGER,
    achievements_unlocked INTEGER,
    total_activities INTEGER,
    rank INTEGER,
    position_change INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH friend_ids AS (
        SELECT DISTINCT 
            CASE 
                WHEN f.user_id = requesting_user_id THEN f.friend_id
                ELSE f.user_id
            END AS friend_user_id
        FROM public.friendships f
        WHERE (f.user_id = requesting_user_id OR f.friend_id = requesting_user_id)
        AND f.status = 'accepted'::public.friendship_status
    ),
    leaderboard_data AS (
        SELECT 
            up.id AS user_id,
            up.full_name,
            up.avatar_url,
            COALESCE(us.total_points, 0) AS total_points,
            COALESCE(us.current_streak, 0) AS current_streak,
            COALESCE(us.achievements_unlocked, 0) AS achievements_unlocked,
            COALESCE(us.total_activities, 0) AS total_activities,
            RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rank
        FROM public.user_profiles up
        LEFT JOIN public.user_statistics us ON up.id = us.user_id
        WHERE up.id IN (SELECT friend_user_id FROM friend_ids)
        OR up.id = requesting_user_id
        ORDER BY COALESCE(us.total_points, 0) DESC
        LIMIT limit_count
    )
    SELECT 
        ld.user_id,
        ld.full_name,
        ld.avatar_url,
        ld.total_points,
        ld.current_streak,
        ld.achievements_unlocked,
        ld.total_activities,
        ld.rank::INTEGER,
        0::INTEGER AS position_change
    FROM leaderboard_data ld;
END;
$$;

-- 7. Mock data for friendships
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
BEGIN
    -- Get existing user IDs
    SELECT id INTO user1_id FROM public.user_profiles WHERE email = 'demo@progresstracker.com';
    SELECT id INTO user2_id FROM public.user_profiles WHERE email = 'test@progresstracker.com';

    -- Create friendship between existing users
    IF user1_id IS NOT NULL AND user2_id IS NOT NULL THEN
        INSERT INTO public.friendships (user_id, friend_id, status)
        VALUES (user1_id, user2_id, 'accepted'::public.friendship_status)
        ON CONFLICT (user_id, friend_id) DO NOTHING;
    END IF;
END $$;
-- Mindset Enhancements Migration
-- Adds tables for saved articles and focus stream videos

-- Create mindset_saves table
CREATE TABLE IF NOT EXISTS public.mindset_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.mindset_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Enable RLS for saves
ALTER TABLE public.mindset_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mindset saves"
    ON public.mindset_saves FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save mindset articles"
    ON public.mindset_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave mindset articles"
    ON public.mindset_saves FOR DELETE
    USING (auth.uid() = user_id);

-- Create mindset_videos table
CREATE TABLE IF NOT EXISTS public.mindset_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'Meditation',
    duration_minutes INTEGER,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for videos
ALTER TABLE public.mindset_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mindset videos"
    ON public.mindset_videos FOR SELECT
    USING (true);

-- Seed some sample videos
INSERT INTO public.mindset_videos (title, description, video_url, thumbnail_url, category, duration_minutes, views_count)
VALUES
    ('Morning Meditation for Deep Work', 'Start your day with clarity and focus.', 'https://example.com/video1', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000', 'Meditation', 12, 2400),
    ('Neural Synchronization Protocol', 'Advanced techniques for peak cognitive performance.', 'https://example.com/video2', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000', 'Science', 45, 1800),
    ('Stoic Resilience Masterclass', 'Building an unshakable mindset through ancient wisdom.', 'https://example.com/video3', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000', 'Philosophy', 30, 3100);

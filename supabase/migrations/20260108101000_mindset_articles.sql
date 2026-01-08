-- Mindset Articles Migration
-- Creates tables for storing articles, journals, and insights

-- Create mindset_articles table
CREATE TABLE IF NOT EXISTS public.mindset_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    preview TEXT,
    type TEXT DEFAULT 'Article' CHECK (type IN ('Article', 'Reflection', 'Daily Journal')),
    privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public', 'shared', 'private')),
    category TEXT DEFAULT 'Insight',
    cover_url TEXT,
    read_count INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mindset_articles_user_id ON public.mindset_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_mindset_articles_privacy ON public.mindset_articles(privacy);
CREATE INDEX IF NOT EXISTS idx_mindset_articles_type ON public.mindset_articles(type);
CREATE INDEX IF NOT EXISTS idx_mindset_articles_created_at ON public.mindset_articles(created_at DESC);

-- Enable RLS
ALTER TABLE public.mindset_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mindset_articles
-- Everyone can view public articles
CREATE POLICY "Anyone can view public articles"
    ON public.mindset_articles FOR SELECT
    USING (privacy = 'public');

-- Users can view their own articles (including private)
CREATE POLICY "Users can view own articles"
    ON public.mindset_articles FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own articles
CREATE POLICY "Users can create articles"
    ON public.mindset_articles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own articles
CREATE POLICY "Users can update own articles"
    ON public.mindset_articles FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own articles
CREATE POLICY "Users can delete own articles"
    ON public.mindset_articles FOR DELETE
    USING (auth.uid() = user_id);

-- Seed sample articles
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM public.user_profiles LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO public.mindset_articles (user_id, title, content, preview, type, privacy, read_time)
        VALUES
            (demo_user_id, 'The Architecture of Discipline', 'Discipline is not about punishment, it is about creating a structure where success becomes the path of least resistance. When we examine the lives of high achievers, we find a common thread: they have all built systems that make excellence automatic.

## The Compound Effect

Every small decision compounds over time. A 1% improvement daily leads to being 37x better over a year. This is not motivation—this is mathematics.

## Building Your System

1. **Morning Ritual**: The first hour sets the tone for the day
2. **Deep Work Blocks**: Protect 4 hours of uninterrupted focus
3. **Evening Review**: Reflect, adjust, prepare for tomorrow

> "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle

The key insight is this: discipline is a muscle. The more you exercise it, the stronger it becomes.', 'Discipline is not about punishment, it is about creating a structure where success becomes the path of least resistance...', 'Article', 'public', 6),
            
            (demo_user_id, 'Flow State & Neural Synchronization', 'Understanding the biological clocks that govern your peak performance windows and how to align your deep work with your natural rhythms is essential for sustainable high performance.

## The Science of Flow

Flow states occur when challenge meets skill at the optimal intersection. Too easy, and you get bored. Too hard, and you experience anxiety. The sweet spot is where magic happens.

### Triggers for Flow:
- Clear goals
- Immediate feedback
- Challenge-skill balance
- Deep concentration
- Sense of control

## Practical Application

Track your energy levels for a week. Notice when you feel most creative, most analytical, most social. Then design your schedule around these patterns.', 'Understanding the biological clocks that govern your peak performance windows and how to align your deep work...', 'Article', 'public', 12);
    END IF;
END $$;

-- Location: supabase/migrations/20260101150000_quick_shortcuts.sql
-- Description: Adds customizable quick shortcuts to user settings.

-- 1. Add column to user_settings if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'quick_shortcuts') THEN
        ALTER TABLE public.user_settings ADD COLUMN quick_shortcuts JSONB DEFAULT '[
            {"label": "Workout", "category": "fitness", "icon": "Dumbbell", "iconColor": "var(--color-primary)"},
            {"label": "Meditation", "category": "mindset", "icon": "Brain", "iconColor": "var(--color-secondary)"},
            {"label": "Cardio", "category": "fitness", "icon": "Heart", "iconColor": "var(--color-error)"},
            {"label": "Strength", "category": "fitness", "icon": "Zap", "iconColor": "var(--color-accent)"},
            {"label": "Nutrition", "category": "nutrition", "icon": "Apple", "iconColor": "var(--color-success)"},
            {"label": "Focus Session", "category": "work", "icon": "Target", "iconColor": "var(--color-primary)"},
            {"label": "Journalling", "category": "mindset", "icon": "Book", "iconColor": "var(--color-secondary)"},
            {"label": "Other", "category": "others", "icon": "MoreHorizontal", "iconColor": "var(--color-muted-foreground)"}
        ]'::JSONB;
    END IF;
END $$;

-- 2. Update existing rows to have the default shortcuts if the column exists but is null
UPDATE public.user_settings 
SET quick_shortcuts = '[
    {"label": "Workout", "category": "fitness", "icon": "Dumbbell", "iconColor": "var(--color-primary)"},
    {"label": "Meditation", "category": "mindset", "icon": "Brain", "iconColor": "var(--color-secondary)"},
    {"label": "Cardio", "category": "fitness", "icon": "Heart", "iconColor": "var(--color-error)"},
    {"label": "Strength", "category": "fitness", "icon": "Zap", "iconColor": "var(--color-accent)"},
    {"label": "Nutrition", "category": "nutrition", "icon": "Apple", "iconColor": "var(--color-success)"},
    {"label": "Focus Session", "category": "work", "icon": "Target", "iconColor": "var(--color-primary)"},
    {"label": "Journalling", "category": "mindset", "icon": "Book", "iconColor": "var(--color-secondary)"},
    {"label": "Other", "category": "others", "icon": "MoreHorizontal", "iconColor": "var(--color-muted-foreground)"}
]'::JSONB
WHERE quick_shortcuts IS NULL;

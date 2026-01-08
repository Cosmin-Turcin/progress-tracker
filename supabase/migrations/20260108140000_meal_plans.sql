-- Nutrition Meal Plans Migration
-- Creates tables for storing and sharing meal plans

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goal TEXT DEFAULT 'Maintenance' CHECK (goal IN ('Maintenance', 'Muscle Gain', 'Fat Loss', 'Performance', 'Focus')),
    calories INTEGER DEFAULT 2000,
    protein INTEGER DEFAULT 150,
    carbs INTEGER DEFAULT 200,
    fats INTEGER DEFAULT 60,
    meals JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_is_public ON public.meal_plans(is_public);
CREATE INDEX IF NOT EXISTS idx_meal_plans_goal ON public.meal_plans(goal);
CREATE INDEX IF NOT EXISTS idx_meal_plans_created_at ON public.meal_plans(created_at DESC);

-- Enable RLS
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public meal plans"
    ON public.meal_plans FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view own meal plans"
    ON public.meal_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create meal plans"
    ON public.meal_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
    ON public.meal_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
    ON public.meal_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Seed sample meal plans
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM public.user_profiles LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO public.meal_plans (user_id, title, description, goal, calories, protein, carbs, fats, meals, is_public)
        VALUES
            (demo_user_id, 'Peak Metabolic Fire', 'High-protein, moderate-fat approach optimized for steady energy and fat oxidation.', 'Fat Loss', 2200, 180, 120, 60, '[{"name": "Breakfast", "foods": "4 eggs, 2 slices whole grain toast, avocado"}, {"name": "Lunch", "foods": "Grilled chicken breast, quinoa, steamed vegetables"}, {"name": "Dinner", "foods": "Salmon fillet, sweet potato, asparagus"}]'::jsonb, true),
            (demo_user_id, 'Performance Bulk v2', 'Surplus-driven nutrition targeting maximum muscle glycogen replenishment.', 'Muscle Gain', 3100, 200, 450, 80, '[{"name": "Breakfast", "foods": "Oatmeal with banana, protein shake, peanut butter"}, {"name": "Lunch", "foods": "Rice, beef stir-fry, mixed vegetables"}, {"name": "Snack", "foods": "Greek yogurt, almonds, berries"}, {"name": "Dinner", "foods": "Pasta, grilled chicken, olive oil"}]'::jsonb, true),
            (demo_user_id, 'Ketogenic Focus Plan', 'Strict ketogenic protocol designed for sustained cognitive focus and mood stability.', 'Focus', 2000, 140, 30, 160, '[{"name": "Breakfast", "foods": "Bulletproof coffee, bacon, eggs"}, {"name": "Lunch", "foods": "Caesar salad with grilled salmon, olive oil dressing"}, {"name": "Dinner", "foods": "Ribeye steak, butter, sautéed spinach"}]'::jsonb, true);
    END IF;
END $$;

-- Work Tasks Migration
-- Creates tables for task management within the Work hub

-- Create work_tasks table
CREATE TABLE IF NOT EXISTS public.work_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT DEFAULT 'general',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_tasks_user_id ON public.work_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_work_tasks_status ON public.work_tasks(status);
CREATE INDEX IF NOT EXISTS idx_work_tasks_priority ON public.work_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_work_tasks_due_date ON public.work_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_work_tasks_created_at ON public.work_tasks(created_at DESC);

-- Enable RLS
ALTER TABLE public.work_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Tasks are private to each user
CREATE POLICY "Users can view own tasks"
    ON public.work_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tasks"
    ON public.work_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON public.work_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON public.work_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create work_projects table for organizing tasks
CREATE TABLE IF NOT EXISTS public.work_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project_id to tasks
ALTER TABLE public.work_tasks 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.work_projects(id) ON DELETE SET NULL;

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_work_projects_user_id ON public.work_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_work_tasks_project_id ON public.work_tasks(project_id);

-- Enable RLS for projects
ALTER TABLE public.work_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
    ON public.work_projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
    ON public.work_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.work_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.work_projects FOR DELETE
    USING (auth.uid() = user_id);

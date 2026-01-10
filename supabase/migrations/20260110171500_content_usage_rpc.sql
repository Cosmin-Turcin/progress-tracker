-- RPC to track content usage and award points securely
-- This bypasses RLS for the creator reward section by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_content_usage_reward(
    p_content_type TEXT,
    p_content_id UUID,
    p_creator_id UUID,
    p_category public.activity_category
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_usage_points INTEGER := 5;
    v_creator_points INTEGER := 15;
    v_result JSONB;
BEGIN
    -- Get current authenticated user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Award usage points to the active user
    INSERT INTO public.activity_logs (
        user_id,
        activity_name,
        category,
        points,
        notes
    ) VALUES (
        v_user_id,
        'Used ' || p_content_type,
        p_category,
        v_usage_points,
        jsonb_build_object('contentId', p_content_id, 'contentType', p_content_type, 'action', 'usage')
    );

    -- 2. Award creator reward (if creator is different or if self-reward is allowed)
    IF p_creator_id IS NOT NULL THEN
        -- Log activity for creator
        INSERT INTO public.activity_logs (
            user_id,
            category,
            activity_name,
            points,
            notes
        ) VALUES (
            p_creator_id,
            p_category,
            'Content Usage Reward: ' || p_content_type,
            v_creator_points,
            jsonb_build_object('usedBy', v_user_id, 'contentId', p_content_id, 'contentType', p_content_type)
        );

        -- Note: Statistics are updated by the trg_update_statistics_on_activity trigger on activity_logs
    END IF;

    RETURN jsonb_build_object('success', true, 'user_id', v_user_id, 'creator_id', p_creator_id);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

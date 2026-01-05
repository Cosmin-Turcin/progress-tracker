-- Trigger to sync achievements count to user_statistics
CREATE OR REPLACE FUNCTION public.sync_achievements_count()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.user_statistics
        SET achievements_unlocked = achievements_unlocked + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.user_statistics
        SET achievements_unlocked = GREATEST(achievements_unlocked - 1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_achievements_count ON public.achievements;
CREATE TRIGGER trg_sync_achievements_count
AFTER INSERT OR DELETE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.sync_achievements_count();

-- Backfill existing counts
UPDATE public.user_statistics us
SET achievements_unlocked = (
    SELECT COUNT(*) 
    FROM public.achievements a 
    WHERE a.user_id = us.user_id
);

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * useEcosystemPoints
 * 
 * Handles awarding points for ecosystem activities:
 * - Content Creation (Fitness Routine, Mindset Article, Meal Plan)
 * - Content Usage (Using a routine, reading an article, following a meal plan)
 */
export const useEcosystemPoints = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const awardPoints = useCallback(async ({ points, reason, metadata }) => {
        if (!user) return;

        setLoading(true);
        try {
            // 1. Update user total points in user_statistics
            const { data: stats, error: statsError } = await supabase
                .from('user_statistics')
                .select('total_points')
                .eq('user_id', user.id)
                .single();

            if (statsError) throw statsError;

            const newTotal = (stats.total_points || 0) + points;

            const { error: updateError } = await supabase
                .from('user_statistics')
                .update({ total_points: newTotal })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            // 2. Log activity for the reward
            await supabase.from('activity_logs').insert({
                user_id: user.id,
                category: metadata?.category || 'social',
                activity_name: reason,
                points: points,
                notes: JSON.stringify({ ...metadata, type: 'ecosystem_reward' })
            });

            return { success: true, newTotal };
        } catch (err) {
            console.error('Error awarding ecosystem points:', err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [user]);

    const trackUsage = useCallback(async ({ creatorId, contentId, contentType, category }) => {
        if (!user) return;

        console.log('Tracking usage via RPC:', { creatorId, contentId, contentType, category });

        setLoading(true);
        try {
            // Call the secure RPC to award points to both user and creator
            const { data, error } = await supabase.rpc('handle_content_usage_reward', {
                p_content_type: contentType,
                p_content_id: contentId,
                p_creator_id: creatorId,
                p_category: category || 'social'
            });

            if (error) throw error;

            console.log('Usage tracked successfully via RPC:', data);
            return { success: true, data };
        } catch (err) {
            console.error('Error tracking usage via RPC:', err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [user]);

    return { awardPoints, trackUsage, loading };
};

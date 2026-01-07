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

        setLoading(true);
        try {
            // 1. Award usage points to the active user (small reward for being active)
            await awardPoints({
                points: 5,
                reason: `Used ${contentType}`,
                metadata: { contentId, contentType, action: 'usage', category }
            });

            // 2. Award creator reward (larger reward for sharing valuable content)
            if (creatorId && creatorId !== user.id) {
                // Award points to creator in user_statistics
                const { data: creatorStats, error: creatorStatsError } = await supabase
                    .from('user_statistics')
                    .select('total_points')
                    .eq('user_id', creatorId)
                    .single();

                if (!creatorStatsError) {
                    const newCreatorTotal = (creatorStats.total_points || 0) + 15;
                    await supabase
                        .from('user_statistics')
                        .update({ total_points: newCreatorTotal })
                        .eq('user_id', creatorId);

                    // Log activity for creator
                    await supabase.from('activity_logs').insert({
                        user_id: creatorId,
                        category: category || 'social',
                        activity_name: `Content Usage Reward: ${contentType}`,
                        points: 15,
                        notes: JSON.stringify({ usedBy: user.id, contentId, contentType })
                    });
                }
            }

            return { success: true };
        } catch (err) {
            console.error('Error tracking usage:', err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [user, awardPoints]);

    return { awardPoints, trackUsage, loading };
};

import { supabase } from '../lib/supabase';

/**
 * Service for managing workout routines in the database.
 */
export const routineService = {
    /**
     * Fetch all public routines, ordered by most recent.
     * @returns {Promise<Array>} Array of routines
     */
    async getAllPublic() {
        try {
            const { data, error } = await supabase
                .from('workout_routines')
                .select(`
                    *,
                    user_profiles:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching public routines:', error);
            throw error;
        }
    },

    /**
     * Fetch routines created by a specific user.
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of routines
     */
    async getByUser(userId) {
        try {
            const { data, error } = await supabase
                .from('workout_routines')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching user routines:', error);
            throw error;
        }
    },

    /**
     * Create a new workout routine.
     * @param {Object} routineData - Routine data
     * @returns {Promise<Object>} Created routine
     */
    async create(routineData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('workout_routines')
                .insert({
                    user_id: user.id,
                    title: routineData.title,
                    description: routineData.description,
                    duration: routineData.duration,
                    difficulty: routineData.difficulty,
                    category: routineData.category || 'General',
                    video_url: routineData.videoUrl,
                    exercises: routineData.exercises,
                    is_public: true
                })
                .select(`
                    *,
                    user_profiles:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating routine:', error);
            throw error;
        }
    },

    /**
     * Update a routine.
     * @param {string} routineId - Routine ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated routine
     */
    async update(routineId, updates) {
        try {
            const { data, error } = await supabase
                .from('workout_routines')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', routineId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating routine:', error);
            throw error;
        }
    },

    /**
     * Increment the usage count for a routine.
     * @param {string} routineId - Routine ID
     * @returns {Promise<void>}
     */
    async incrementUsage(routineId) {
        try {
            // Use RPC for atomic increment, or fallback to fetch + update
            const { data: routine, error: fetchError } = await supabase
                .from('workout_routines')
                .select('usage_count')
                .eq('id', routineId)
                .single();

            if (fetchError) throw fetchError;

            const newCount = (routine.usage_count || 0) + 1;

            const { error: updateError } = await supabase
                .from('workout_routines')
                .update({ usage_count: newCount })
                .eq('id', routineId);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error incrementing usage:', error);
            // Non-critical, don't throw
        }
    },

    /**
     * Delete a routine.
     * @param {string} routineId - Routine ID
     * @returns {Promise<void>}
     */
    async delete(routineId) {
        try {
            const { error } = await supabase
                .from('workout_routines')
                .delete()
                .eq('id', routineId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting routine:', error);
            throw error;
        }
    },

    /**
     * Save a routine to user bookmarks.
     * @param {string} routineId - Routine ID
     */
    async saveRoutine(routineId) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('workout_saves')
                .insert({ user_id: user.id, routine_id: routineId });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving routine:', error);
            throw error;
        }
    },

    /**
     * Unsave a routine.
     * @param {string} routineId - Routine ID
     */
    async unsaveRoutine(routineId) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('workout_saves')
                .delete()
                .eq('user_id', user.id)
                .eq('routine_id', routineId);

            if (error) throw error;
        } catch (error) {
            console.error('Error unsaving routine:', error);
            throw error;
        }
    },

    /**
     * Fetch routines saved by the current user.
     * @returns {Promise<Array>} Array of routines
     */
    async getSavedRoutines() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('workout_saves')
                .select(`
                    id,
                    routine:routine_id (
                        *,
                        user_profiles:user_id (
                            id,
                            full_name,
                            username,
                            avatar_url
                        )
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            return data.map(item => item.routine) || [];
        } catch (error) {
            console.error('Error fetching saved routines:', error);
            throw error;
        }
    },

    /**
     * Fetch upcoming live sessions.
     * @returns {Promise<Array>} Array of live sessions
     */
    async getLiveSessions() {
        try {
            const { data, error } = await supabase
                .from('live_sessions')
                .select(`
                    *,
                    creator:creator_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .order('scheduled_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching live sessions:', error);
            throw error;
        }
    },

    /**
     * Update attendance count for a live session.
     * @param {string} sessionId - Session ID
     */
    async joinLiveSession(sessionId) {
        try {
            const { data: session, error: fetchError } = await supabase
                .from('live_sessions')
                .select('attendees_count')
                .eq('id', sessionId)
                .single();

            if (fetchError) throw fetchError;

            const { error: updateError } = await supabase
                .from('live_sessions')
                .update({ attendees_count: (session.attendees_count || 0) + 1 })
                .eq('id', sessionId);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error joining live session:', error);
        }
    },

    /**
     * Fetch creator earnings and usage statistics.
     * @returns {Promise<Object>} Statistics object
     */
    async getCreatorStats() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Get total earnings from activity_logs
            const { data: earningsData, error: earningsError } = await supabase
                .from('activity_logs')
                .select('points')
                .eq('user_id', user.id)
                .ilike('activity_name', 'Content Usage Reward: %');

            if (earningsError) throw earningsError;
            const totalEarnings = earningsData.reduce((sum, log) => sum + (log.points || 0), 0);

            // 2. Get today's usage count
            const today = new Date().toISOString().split('T')[0];
            const { count: todayUses, error: usageError } = await supabase
                .from('activity_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .ilike('activity_name', 'Content Usage Reward: %')
                .gte('created_at', today);

            if (usageError) throw usageError;

            return {
                totalEarnings,
                todayUses: todayUses || 0
            };
        } catch (error) {
            console.error('Error fetching creator stats:', error);
            return { totalEarnings: 0, todayUses: 0 };
        }
    }
};

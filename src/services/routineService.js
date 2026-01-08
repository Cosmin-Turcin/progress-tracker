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
    }
};

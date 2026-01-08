import { supabase } from '../lib/supabase';

/**
 * Service for managing meal plans in the database.
 */
export const mealPlanService = {
    /**
     * Fetch all public meal plans, ordered by most recent.
     * @returns {Promise<Array>} Array of meal plans
     */
    async getAllPublic() {
        try {
            const { data, error } = await supabase
                .from('meal_plans')
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
            console.error('Error fetching public meal plans:', error);
            throw error;
        }
    },

    /**
     * Fetch meal plans created by a specific user.
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of meal plans
     */
    async getByUser(userId) {
        try {
            const { data, error } = await supabase
                .from('meal_plans')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching user meal plans:', error);
            throw error;
        }
    },

    /**
     * Create a new meal plan.
     * @param {Object} planData - Meal plan data
     * @returns {Promise<Object>} Created meal plan
     */
    async create(planData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('meal_plans')
                .insert({
                    user_id: user.id,
                    title: planData.title,
                    description: planData.description,
                    goal: planData.goal,
                    calories: planData.calories,
                    protein: planData.macros?.p || planData.protein,
                    carbs: planData.macros?.c || planData.carbs,
                    fats: planData.macros?.f || planData.fats,
                    meals: planData.meals,
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
            console.error('Error creating meal plan:', error);
            throw error;
        }
    },

    /**
     * Increment the usage count for a meal plan.
     * @param {string} planId - Meal plan ID
     * @returns {Promise<void>}
     */
    async incrementUsage(planId) {
        try {
            const { data: plan, error: fetchError } = await supabase
                .from('meal_plans')
                .select('usage_count')
                .eq('id', planId)
                .single();

            if (fetchError) throw fetchError;

            const newCount = (plan.usage_count || 0) + 1;

            const { error: updateError } = await supabase
                .from('meal_plans')
                .update({ usage_count: newCount })
                .eq('id', planId);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error incrementing usage:', error);
        }
    },

    /**
     * Delete a meal plan.
     * @param {string} planId - Meal plan ID
     * @returns {Promise<void>}
     */
    async delete(planId) {
        try {
            const { error } = await supabase
                .from('meal_plans')
                .delete()
                .eq('id', planId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            throw error;
        }
    }
};

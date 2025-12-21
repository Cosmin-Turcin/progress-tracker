import { supabase } from '../lib/supabase';

export const goalService = {
  /**
   * Get all goals for the current user
   * @param {string} userId - User ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Array of goals
   */
  async getAll(userId, status = null) {
    try {
      let query = supabase?.from('goals')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false });
      
      if (status) {
        query = query?.eq('goal_status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert snake_case to camelCase
      return data?.map(goal => ({
        id: goal?.id,
        userId: goal?.user_id,
        title: goal?.title,
        description: goal?.description,
        goalType: goal?.goal_type,
        targetValue: goal?.target_value,
        currentValue: goal?.current_value,
        unit: goal?.unit,
        category: goal?.category,
        goalStatus: goal?.goal_status,
        startDate: goal?.start_date,
        endDate: goal?.end_date,
        createdAt: goal?.created_at,
        updatedAt: goal?.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  /**
   * Create a new goal
   * @param {Object} goalData - Goal data
   * @returns {Promise<Object>} Created goal
   */
  async create(goalData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Convert camelCase to snake_case
      const dbGoal = {
        user_id: user?.id,
        title: goalData?.title,
        description: goalData?.description,
        goal_type: goalData?.goalType,
        target_value: goalData?.targetValue,
        current_value: goalData?.currentValue || 0,
        unit: goalData?.unit,
        category: goalData?.category,
        goal_status: goalData?.goalStatus || 'active',
        start_date: goalData?.startDate || new Date()?.toISOString()?.split('T')?.[0],
        end_date: goalData?.endDate
      };
      
      const { data, error } = await supabase?.from('goals')?.insert(dbGoal)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        description: data?.description,
        goalType: data?.goal_type,
        targetValue: data?.target_value,
        currentValue: data?.current_value,
        unit: data?.unit,
        category: data?.category,
        goalStatus: data?.goal_status,
        startDate: data?.start_date,
        endDate: data?.end_date,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  /**
   * Update a goal
   * @param {string} goalId - Goal ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated goal
   */
  async update(goalId, updates) {
    try {
      // Convert camelCase to snake_case
      const dbUpdates = {};
      if (updates?.title) dbUpdates.title = updates?.title;
      if (updates?.description !== undefined) dbUpdates.description = updates?.description;
      if (updates?.goalType) dbUpdates.goal_type = updates?.goalType;
      if (updates?.targetValue !== undefined) dbUpdates.target_value = updates?.targetValue;
      if (updates?.currentValue !== undefined) dbUpdates.current_value = updates?.currentValue;
      if (updates?.unit) dbUpdates.unit = updates?.unit;
      if (updates?.category) dbUpdates.category = updates?.category;
      if (updates?.goalStatus) dbUpdates.goal_status = updates?.goalStatus;
      if (updates?.startDate) dbUpdates.start_date = updates?.startDate;
      if (updates?.endDate !== undefined) dbUpdates.end_date = updates?.endDate;
      
      dbUpdates.updated_at = new Date()?.toISOString();
      
      const { data, error } = await supabase?.from('goals')?.update(dbUpdates)?.eq('id', goalId)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        description: data?.description,
        goalType: data?.goal_type,
        targetValue: data?.target_value,
        currentValue: data?.current_value,
        unit: data?.unit,
        category: data?.category,
        goalStatus: data?.goal_status,
        startDate: data?.start_date,
        endDate: data?.end_date,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  /**
   * Delete a goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<void>}
   */
  async delete(goalId) {
    try {
      const { error } = await supabase?.from('goals')?.delete()?.eq('id', goalId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  /**
   * Update goal progress
   * @param {string} goalId - Goal ID
   * @param {number} progress - New progress value
   * @returns {Promise<Object>} Updated goal
   */
  async updateProgress(goalId, progress) {
    try {
      const { data, error } = await supabase?.from('goals')?.update({ 
          current_value: progress,
          updated_at: new Date()?.toISOString()
        })?.eq('id', goalId)?.select()?.single();
      
      if (error) throw error;
      
      // Check if goal is completed
      if (data?.current_value >= data?.target_value && data?.goal_status === 'active') {
        await this.update(goalId, { goalStatus: 'completed' });
      }
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        description: data?.description,
        goalType: data?.goal_type,
        targetValue: data?.target_value,
        currentValue: data?.current_value,
        unit: data?.unit,
        category: data?.category,
        goalStatus: data?.goal_status,
        startDate: data?.start_date,
        endDate: data?.end_date,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }
};
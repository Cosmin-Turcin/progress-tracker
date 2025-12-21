import { supabase } from '../lib/supabase';

export const reminderService = {
  /**
   * Get all reminders for the current user
   * @param {string} userId - User ID
   * @param {boolean} activeOnly - Get only active reminders
   * @returns {Promise<Array>} Array of reminders
   */
  async getAll(userId, activeOnly = false) {
    try {
      let query = supabase?.from('reminders')?.select('*')?.eq('user_id', userId)?.order('scheduled_time', { ascending: true });
      
      if (activeOnly) {
        query = query?.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert snake_case to camelCase
      return data?.map(reminder => ({
        id: reminder?.id,
        userId: reminder?.user_id,
        title: reminder?.title,
        message: reminder?.message,
        reminderType: reminder?.reminder_type,
        frequency: reminder?.frequency,
        scheduledTime: reminder?.scheduled_time,
        scheduledDays: reminder?.scheduled_days,
        isActive: reminder?.is_active,
        lastSentAt: reminder?.last_sent_at,
        createdAt: reminder?.created_at,
        updatedAt: reminder?.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  /**
   * Create a new reminder
   * @param {Object} reminderData - Reminder data
   * @returns {Promise<Object>} Created reminder
   */
  async create(reminderData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Convert camelCase to snake_case
      const dbReminder = {
        user_id: user?.id,
        title: reminderData?.title,
        message: reminderData?.message,
        reminder_type: reminderData?.reminderType,
        frequency: reminderData?.frequency,
        scheduled_time: reminderData?.scheduledTime,
        scheduled_days: reminderData?.scheduledDays,
        is_active: reminderData?.isActive !== undefined ? reminderData?.isActive : true
      };
      
      const { data, error } = await supabase?.from('reminders')?.insert(dbReminder)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        message: data?.message,
        reminderType: data?.reminder_type,
        frequency: data?.frequency,
        scheduledTime: data?.scheduled_time,
        scheduledDays: data?.scheduled_days,
        isActive: data?.is_active,
        lastSentAt: data?.last_sent_at,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  /**
   * Update a reminder
   * @param {string} reminderId - Reminder ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated reminder
   */
  async update(reminderId, updates) {
    try {
      // Convert camelCase to snake_case
      const dbUpdates = {};
      if (updates?.title) dbUpdates.title = updates?.title;
      if (updates?.message !== undefined) dbUpdates.message = updates?.message;
      if (updates?.reminderType) dbUpdates.reminder_type = updates?.reminderType;
      if (updates?.frequency) dbUpdates.frequency = updates?.frequency;
      if (updates?.scheduledTime) dbUpdates.scheduled_time = updates?.scheduledTime;
      if (updates?.scheduledDays) dbUpdates.scheduled_days = updates?.scheduledDays;
      if (updates?.isActive !== undefined) dbUpdates.is_active = updates?.isActive;
      
      dbUpdates.updated_at = new Date()?.toISOString();
      
      const { data, error } = await supabase?.from('reminders')?.update(dbUpdates)?.eq('id', reminderId)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        message: data?.message,
        reminderType: data?.reminder_type,
        frequency: data?.frequency,
        scheduledTime: data?.scheduled_time,
        scheduledDays: data?.scheduled_days,
        isActive: data?.is_active,
        lastSentAt: data?.last_sent_at,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  /**
   * Toggle reminder active status
   * @param {string} reminderId - Reminder ID
   * @returns {Promise<Object>} Updated reminder
   */
  async toggleActive(reminderId) {
    try {
      // First get current status
      const { data: current, error: fetchError } = await supabase?.from('reminders')?.select('is_active')?.eq('id', reminderId)?.single();
      
      if (fetchError) throw fetchError;
      
      // Toggle status
      const { data, error } = await supabase?.from('reminders')?.update({ 
          is_active: !current?.is_active,
          updated_at: new Date()?.toISOString()
        })?.eq('id', reminderId)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        title: data?.title,
        message: data?.message,
        reminderType: data?.reminder_type,
        frequency: data?.frequency,
        scheduledTime: data?.scheduled_time,
        scheduledDays: data?.scheduled_days,
        isActive: data?.is_active,
        lastSentAt: data?.last_sent_at,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error toggling reminder:', error);
      throw error;
    }
  },

  /**
   * Delete a reminder
   * @param {string} reminderId - Reminder ID
   * @returns {Promise<void>}
   */
  async delete(reminderId) {
    try {
      const { error } = await supabase?.from('reminders')?.delete()?.eq('id', reminderId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }
};
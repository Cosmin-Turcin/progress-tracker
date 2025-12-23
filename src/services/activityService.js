import { supabase } from '../lib/supabase';

export const activityService = {
  /**
   * Get all activities for the current user
   * @param {string} userId - User ID
   * @param {Date} date - Optional date to filter activities
   * @returns {Promise<Array>} Array of activities
   */
  async getAll(userId, date = null) {
    try {
      let query = supabase?.from('activity_logs')?.select('*')?.eq('user_id', userId)?.order('activity_date', { ascending: false })?.order('activity_time', { ascending: false });

      if (date) {
        const dateStr = date?.toISOString()?.split('T')?.[0];
        query = query?.eq('activity_date', dateStr);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert snake_case to camelCase
      return data?.map(activity => ({
        id: activity?.id,
        userId: activity?.user_id,
        activityName: activity?.activity_name,
        category: activity?.category,
        intensity: activity?.intensity,
        points: activity?.points,
        durationMinutes: activity?.duration_minutes,
        notes: activity?.notes,
        activityDate: activity?.activity_date,
        activityTime: activity?.activity_time,
        icon: activity?.icon,
        iconColor: activity?.icon_color,
        createdAt: activity?.created_at,
        updatedAt: activity?.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  /**
   * Get activities by date range
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of activities
   */
  async getByDateRange(userId, startDate, endDate) {
    try {
      const startStr = startDate?.toISOString()?.split('T')?.[0];
      const endStr = endDate?.toISOString()?.split('T')?.[0];

      const { data, error } = await supabase?.from('activity_logs')?.select('*')?.eq('user_id', userId)?.gte('activity_date', startStr)?.lte('activity_date', endStr)?.order('activity_date', { ascending: false });

      if (error) throw error;

      return data?.map(activity => ({
        id: activity?.id,
        userId: activity?.user_id,
        activityName: activity?.activity_name,
        category: activity?.category,
        intensity: activity?.intensity,
        points: activity?.points,
        durationMinutes: activity?.duration_minutes,
        notes: activity?.notes,
        activityDate: activity?.activity_date,
        activityTime: activity?.activity_time,
        icon: activity?.icon,
        iconColor: activity?.icon_color,
        createdAt: activity?.created_at,
        updatedAt: activity?.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching activities by date range:', error);
      throw error;
    }
  },

  /**
   * Create a new activity
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} Created activity
   */
  async create(activityData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const getLocalDateString = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      // Convert camelCase to snake_case for database
      const dbActivity = {
        user_id: user?.id,
        activity_name: activityData?.activityName,
        category: activityData?.category,
        intensity: activityData?.intensity || 'normal',
        points: activityData?.points,
        duration_minutes: activityData?.durationMinutes,
        notes: activityData?.notes,
        activity_date: activityData?.activityDate || getLocalDateString(),
        activity_time: activityData?.activityTime || new Date()?.toTimeString()?.split(' ')?.[0],
        icon: activityData?.icon,
        icon_color: activityData?.iconColor
      };

      const { data, error } = await supabase?.from('activity_logs')?.insert(dbActivity)?.select()?.single();

      if (error) throw error;

      // Convert back to camelCase
      return {
        id: data?.id,
        userId: data?.user_id,
        activityName: data?.activity_name,
        category: data?.category,
        intensity: data?.intensity,
        points: data?.points,
        durationMinutes: data?.duration_minutes,
        notes: data?.notes,
        activityDate: data?.activity_date,
        activityTime: data?.activity_time,
        icon: data?.icon,
        iconColor: data?.icon_color,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  /**
   * Update an activity
   * @param {string} activityId - Activity ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated activity
   */
  async update(activityId, updates) {
    try {
      // Convert camelCase to snake_case
      const dbUpdates = {};
      if (updates?.activityName) dbUpdates.activity_name = updates?.activityName;
      if (updates?.category) dbUpdates.category = updates?.category;
      if (updates?.intensity) dbUpdates.intensity = updates?.intensity;
      if (updates?.points !== undefined) dbUpdates.points = updates?.points;
      if (updates?.durationMinutes !== undefined) dbUpdates.duration_minutes = updates?.durationMinutes;
      if (updates?.notes !== undefined) dbUpdates.notes = updates?.notes;
      if (updates?.activityDate) dbUpdates.activity_date = updates?.activityDate;
      if (updates?.activityTime) dbUpdates.activity_time = updates?.activityTime;
      if (updates?.icon) dbUpdates.icon = updates?.icon;
      if (updates?.iconColor) dbUpdates.icon_color = updates?.iconColor;

      dbUpdates.updated_at = new Date()?.toISOString();

      const { data, error } = await supabase?.from('activity_logs')?.update(dbUpdates)?.eq('id', activityId)?.select()?.single();

      if (error) throw error;

      return {
        id: data?.id,
        userId: data?.user_id,
        activityName: data?.activity_name,
        category: data?.category,
        intensity: data?.intensity,
        points: data?.points,
        durationMinutes: data?.duration_minutes,
        notes: data?.notes,
        activityDate: data?.activity_date,
        activityTime: data?.activity_time,
        icon: data?.icon,
        iconColor: data?.icon_color,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  /**
   * Delete an activity
   * @param {string} activityId - Activity ID
   * @returns {Promise<void>}
   */
  async delete(activityId) {
    try {
      const { error } = await supabase?.from('activity_logs')?.delete()?.eq('id', activityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  /**
   * Get activity statistics for a user
   * @param {string} userId - User ID
   * @param {Date} date - Optional date to filter
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics(userId, date = null) {
    try {
      let query = supabase?.from('activity_logs')?.select('category, points')?.eq('user_id', userId);

      if (date) {
        const dateStr = date?.toISOString()?.split('T')?.[0];
        query = query?.eq('activity_date', dateStr);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate statistics
      const stats = {
        totalPoints: 0,
        fitnessPoints: 0,
        mindsetPoints: 0,
        nutritionPoints: 0,
        workPoints: 0,
        socialPoints: 0,
        activitiesCount: data?.length || 0
      };

      data?.forEach(activity => {
        stats.totalPoints += activity?.points;

        switch (activity?.category) {
          case 'fitness':
            stats.fitnessPoints += activity?.points;
            break;
          case 'mindset':
            stats.mindsetPoints += activity?.points;
            break;
          case 'nutrition':
            stats.nutritionPoints += activity?.points;
            break;
          case 'work':
            stats.workPoints += activity?.points;
            break;
          case 'social':
            stats.socialPoints += activity?.points;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching activity statistics:', error);
      throw error;
    }
  },

  /**
   * Get timeline data for chart
   * @param {string} userId - User ID
   * @param {Date} date - Date to get timeline for
   * @returns {Promise<Array>} Timeline data
   */
  async getTimelineData(userId, date = null) {
    try {
      const dateStr = date ? date?.toISOString()?.split('T')?.[0] : new Date()?.toISOString()?.split('T')?.[0];

      const { data, error } = await supabase?.from('activity_logs')?.select('activity_time, category, points')?.eq('user_id', userId)?.eq('activity_date', dateStr)?.order('activity_time', { ascending: true });

      if (error) throw error;

      // Generate hourly timeline data
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const timeline = hours?.map(hour => {
        const hourStr = `${hour?.toString()?.padStart(2, '0')}:00`;
        const activities = data?.filter(a => a?.activity_time && a?.activity_time?.startsWith(hourStr?.split(':')?.[0])) || [];

        const fitnessPoints = activities?.filter(a => a?.category === 'fitness')?.reduce((sum, a) => sum + a?.points, 0);

        const mindsetPoints = activities?.filter(a => a?.category === 'mindset')?.reduce((sum, a) => sum + a?.points, 0);

        return {
          time: hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour === 0 ? 12 : hour} AM`,
          fitness: fitnessPoints,
          mindset: mindsetPoints,
          total: fitnessPoints + mindsetPoints
        };
      });

      return timeline;
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      throw error;
    }
  }
};
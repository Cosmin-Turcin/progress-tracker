import { supabase } from '../lib/supabase';

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

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
        const dateStr = formatDate(date);
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
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);

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

      let points = activityData?.points;

      // If points are not provided, calculate them based on settings
      if (points === undefined || points === null || points === '') {
        const { data: settings } = await supabase?.from('user_settings')?.select('activity_points')?.eq('user_id', user?.id)?.maybeSingle();

        const activityPoints = settings?.activity_points || {
          fitness: { base: 10, multiplier: 1.5 },
          mindset: { base: 8, multiplier: 1.3 },
          nutrition: { base: 5, multiplier: 1.2 },
          work: { base: 15, multiplier: 1.4 },
          social: { base: 7, multiplier: 1.1 },
          others: { base: 5, multiplier: 1.0 }
        };

        const config = activityPoints[activityData?.category] || activityPoints['others'] || { base: 5, multiplier: 1.0 };
        const intensityMultiplier = activityData?.intensity === 'intense' ? 1.5 : (activityData?.intensity === 'light' ? 0.7 : 1.0);
        points = Math.round(config.base * config.multiplier * intensityMultiplier);
      }

      const getLocalDateString = () => formatDate(new Date());

      // Convert camelCase to snake_case for database
      const dbActivity = {
        user_id: user?.id,
        activity_name: activityData?.activityName,
        category: activityData?.category,
        intensity: activityData?.intensity || 'normal',
        points: points,
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
      const targetDate = date || new Date();
      const targetDateStr = formatDate(targetDate);

      const prevDate = new Date(targetDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = formatDate(prevDate);

      // 1. Fetch points breakdown for target date and previous date
      const { data, error } = await supabase
        ?.from('activity_logs')
        ?.select('category, points, activity_date')
        ?.eq('user_id', userId)
        ?.in('activity_date', [targetDateStr, prevDateStr]);

      if (error) throw error;

      // 2. Fetch all unique activity dates for streak calculation
      const { data: allDatesData, error: datesError } = await supabase
        ?.from('activity_logs')
        ?.select('activity_date')
        ?.eq('user_id', userId)
        ?.order('activity_date', { ascending: false });

      if (datesError) throw datesError;

      // Unique sorted dates (YYYY-MM-DD)
      const uniqueDates = Array.from(new Set(allDatesData?.map(d => d.activity_date)));

      const calculateStreaks = (dates) => {
        if (!dates || dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

        let current = 0;
        let longest = 0;
        let tempStreak = 0;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);

        // Check if user has activity today or yesterday to continue current streak
        const hasActivityRecent = dates[0] === todayStr || dates[0] === yesterdayStr;

        if (!hasActivityRecent) {
          current = 0;
        }

        for (let i = 0; i < dates.length; i++) {
          if (i === 0) {
            tempStreak = 1;
          } else {
            const currentDay = new Date(dates[i]);
            const prevDay = new Date(dates[i - 1]);

            // Check if days are consecutive
            const diffTime = Math.abs(prevDay - currentDay);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              tempStreak++;
            } else {
              if (current === 0 && hasActivityRecent) {
                current = tempStreak;
              }
              longest = Math.max(longest, tempStreak);
              tempStreak = 1;
            }
          }
        }

        if (current === 0 && hasActivityRecent) {
          current = tempStreak;
        }
        longest = Math.max(longest, tempStreak);

        return { currentStreak: current, longestStreak: longest };
      };

      const { currentStreak, longestStreak } = calculateStreaks(uniqueDates);

      // Process today vs yesterday
      const targetStats = {
        totalPoints: 0,
        fitnessPoints: 0,
        mindsetPoints: 0,
        activitiesCount: 0
      };

      const prevStats = {
        totalPoints: 0,
        fitnessPoints: 0,
        mindsetPoints: 0,
        activitiesCount: 0
      };

      data?.forEach(item => {
        const isTarget = item.activity_date === targetDateStr;
        const stats = isTarget ? targetStats : prevStats;

        stats.totalPoints += item.points;
        stats.activitiesCount++;

        if (item.category === 'fitness') stats.fitnessPoints += item.points;
        if (item.category === 'mindset') stats.mindsetPoints += item.points;
      });

      return {
        ...targetStats,
        currentStreak,
        longestStreak,
        comparison: {
          prevTotalPoints: prevStats.totalPoints,
          prevFitnessPoints: prevStats.fitnessPoints,
          prevMindsetPoints: prevStats.mindsetPoints,
          prevActivitiesCount: prevStats.activitiesCount
        }
      };
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
      const dateStr = date ? formatDate(date) : formatDate(new Date());

      const { data, error } = await supabase?.from('activity_logs')?.select('activity_time, category, points')?.eq('user_id', userId)?.eq('activity_date', dateStr)?.order('activity_time', { ascending: true });

      if (error) throw error;

      // Generate hourly timeline data
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const timeline = hours?.map(hour => {
        const hourStr = `${hour?.toString()?.padStart(2, '0')}:00`;
        const activities = data?.filter(a => a?.activity_time && a?.activity_time?.startsWith(hourStr?.split(':')?.[0])) || [];

        const fitnessPoints = activities?.filter(a => a?.category === 'fitness')?.reduce((sum, a) => sum + a?.points, 0);
        const mindsetPoints = activities?.filter(a => a?.category === 'mindset')?.reduce((sum, a) => sum + a?.points, 0);
        const nutritionPoints = activities?.filter(a => a?.category === 'nutrition')?.reduce((sum, a) => sum + a?.points, 0);
        const workPoints = activities?.filter(a => a?.category === 'work')?.reduce((sum, a) => sum + a?.points, 0);
        const socialPoints = activities?.filter(a => a?.category === 'social')?.reduce((sum, a) => sum + a?.points, 0);
        const othersPoints = activities?.filter(a => a?.category === 'others')?.reduce((sum, a) => sum + a?.points, 0);

        return {
          time: hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour === 0 ? 12 : hour} AM`,
          fitness: fitnessPoints,
          mindset: mindsetPoints,
          nutrition: nutritionPoints,
          work: workPoints,
          social: socialPoints,
          others: othersPoints,
          total: fitnessPoints + mindsetPoints + nutritionPoints + workPoints + socialPoints + othersPoints
        };
      });

      return timeline;
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      throw error;
    }
  }
};
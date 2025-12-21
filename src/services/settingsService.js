import { supabase } from '../lib/supabase';

export const settingsService = {
  /**
   * Get user settings
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User settings
   */
  async get(userId) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.select('*')?.eq('user_id', userId)?.single();
      
      if (error) {
        // If no settings exist, return defaults
        if (error?.code === 'PGRST116') {
          return {
            activityPoints: {
              fitness: { base: 10, multiplier: 1.5 },
              mindset: { base: 8, multiplier: 1.3 },
              nutrition: { base: 5, multiplier: 1.2 },
              work: { base: 15, multiplier: 1.4 },
              social: { base: 7, multiplier: 1.1 }
            },
            dailyGoals: {
              totalPoints: 100,
              activityFrequency: 5,
              streakTarget: 7
            },
            notifications: {
              pushEnabled: true,
              emailSummary: true,
              reminderTime: '09:00',
              achievementAlerts: true
            },
            systemPreferences: {
              theme: 'light',
              language: 'en',
              autoExport: false,
              privacyMode: false
            }
          };
        }
        throw error;
      }
      
      return {
        id: data?.id,
        userId: data?.user_id,
        activityPoints: data?.activity_points,
        dailyGoals: data?.daily_goals,
        notifications: data?.notifications,
        systemPreferences: data?.system_preferences,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  /**
   * Update user settings
   * @param {string} userId - User ID
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Updated settings
   */
  async update(userId, settings) {
    try {
      const dbSettings = {};
      
      if (settings?.activityPoints) dbSettings.activity_points = settings?.activityPoints;
      if (settings?.dailyGoals) dbSettings.daily_goals = settings?.dailyGoals;
      if (settings?.notifications) dbSettings.notifications = settings?.notifications;
      if (settings?.systemPreferences) dbSettings.system_preferences = settings?.systemPreferences;
      
      dbSettings.updated_at = new Date()?.toISOString();
      
      // Try to update first
      const { data: updateData, error: updateError } = await supabase?.from('user_settings')?.update(dbSettings)?.eq('user_id', userId)?.select()?.single();
      
      if (updateError) {
        // If no row exists, insert
        if (updateError?.code === 'PGRST116') {
          dbSettings.user_id = userId;
          
          const { data: insertData, error: insertError } = await supabase?.from('user_settings')?.insert(dbSettings)?.select()?.single();
          
          if (insertError) throw insertError;
          
          return {
            id: insertData?.id,
            userId: insertData?.user_id,
            activityPoints: insertData?.activity_points,
            dailyGoals: insertData?.daily_goals,
            notifications: insertData?.notifications,
            systemPreferences: insertData?.system_preferences,
            createdAt: insertData?.created_at,
            updatedAt: insertData?.updated_at
          };
        }
        throw updateError;
      }
      
      return {
        id: updateData?.id,
        userId: updateData?.user_id,
        activityPoints: updateData?.activity_points,
        dailyGoals: updateData?.daily_goals,
        notifications: updateData?.notifications,
        systemPreferences: updateData?.system_preferences,
        createdAt: updateData?.created_at,
        updatedAt: updateData?.updated_at
      };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  /**
   * Reset settings to defaults
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reset settings
   */
  async reset(userId) {
    try {
      const defaultSettings = {
        user_id: userId,
        activity_points: {
          fitness: { base: 10, multiplier: 1.5 },
          mindset: { base: 8, multiplier: 1.3 },
          nutrition: { base: 5, multiplier: 1.2 },
          work: { base: 15, multiplier: 1.4 },
          social: { base: 7, multiplier: 1.1 }
        },
        daily_goals: {
          totalPoints: 100,
          activityFrequency: 5,
          streakTarget: 7
        },
        notifications: {
          pushEnabled: true,
          emailSummary: true,
          reminderTime: '09:00',
          achievementAlerts: true
        },
        system_preferences: {
          theme: 'light',
          language: 'en',
          autoExport: false,
          privacyMode: false
        },
        updated_at: new Date()?.toISOString()
      };
      
      const { data, error } = await supabase?.from('user_settings')?.upsert(defaultSettings)?.select()?.single();
      
      if (error) throw error;
      
      return {
        id: data?.id,
        userId: data?.user_id,
        activityPoints: data?.activity_points,
        dailyGoals: data?.daily_goals,
        notifications: data?.notifications,
        systemPreferences: data?.system_preferences,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }
};
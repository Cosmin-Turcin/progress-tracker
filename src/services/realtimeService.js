import { supabase } from '../lib/supabase';

/**
 * Supabase Real-time Subscription Service
 * Provides instant synchronization across all screens when activities, streaks, or goals update
 */

class RealtimeService {
  constructor() {
    this.channels = new Map();
  }

  /**
   * Subscribe to activity logs changes in real-time
   * @param {string} userId - Current user's ID
   * @param {Function} onInsert - Callback when new activity is created
   * @param {Function} onUpdate - Callback when activity is updated
   * @param {Function} onDelete - Callback when activity is deleted
   * @returns {Function} Unsubscribe function
   */
  subscribeToActivities(userId, { onInsert, onUpdate, onDelete }) {
    const channelName = `activities_${userId}`;

    // Remove existing channel if it exists
    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase?.channel(channelName)?.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_logs',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Activity inserted', payload);
        if (onInsert) {
          // Convert snake_case to camelCase
          const activity = this._convertToCamelCase(payload?.new);
          onInsert(activity);
        }
      }
    )?.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'activity_logs',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Activity updated', payload);
        if (onUpdate) {
          const activity = this._convertToCamelCase(payload?.new);
          onUpdate(activity);
        }
      }
    )?.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'activity_logs',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Activity deleted', payload);
        if (onDelete) {
          const activity = this._convertToCamelCase(payload?.old);
          onDelete(activity);
        }
      }
    )?.subscribe((status) => {
      console.log('Activity subscription status:', status);
    });

    this.channels?.set(channelName, channel);

    // Return unsubscribe function
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to user statistics changes in real-time (for streaks)
   * @param {string} userId - Current user's ID
   * @param {Function} onChange - Callback when statistics change
   * @returns {Function} Unsubscribe function
   */
  subscribeToStatistics(userId, onChange) {
    const channelName = `statistics_${userId}`;

    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase?.channel(channelName)?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_statistics',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Statistics changed', payload);
        if (onChange) {
          const stats = this._convertToCamelCase(payload?.new);
          onChange(stats);
        }
      }
    )?.subscribe((status) => {
      console.log('Statistics subscription status:', status);
    });

    this.channels?.set(channelName, channel);
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to goals changes in real-time
   * @param {string} userId - Current user's ID
   * @param {Function} onInsert - Callback when new goal is created
   * @param {Function} onUpdate - Callback when goal is updated
   * @param {Function} onDelete - Callback when goal is deleted
   * @returns {Function} Unsubscribe function
   */
  subscribeToGoals(userId, { onInsert, onUpdate, onDelete }) {
    const channelName = `goals_${userId}`;

    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase?.channel(channelName)?.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Goal inserted', payload);
        if (onInsert) {
          const goal = this._convertToCamelCase(payload?.new);
          onInsert(goal);
        }
      }
    )?.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Goal updated', payload);
        if (onUpdate) {
          const goal = this._convertToCamelCase(payload?.new);
          onUpdate(goal);
        }
      }
    )?.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Goal deleted', payload);
        if (onDelete) {
          const goal = this._convertToCamelCase(payload?.old);
          onDelete(goal);
        }
      }
    )?.subscribe((status) => {
      console.log('Goals subscription status:', status);
    });

    this.channels?.set(channelName, channel);
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to achievements changes in real-time
   * @param {string} userId - Current user's ID
   * @param {Function} onInsert - Callback when new achievement is unlocked
   * @returns {Function} Unsubscribe function
   */
  subscribeToAchievements(userId, onInsert) {
    const channelName = `achievements_${userId}`;

    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase?.channel(channelName)?.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'achievements',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Achievement unlocked', payload);
        if (onInsert) {
          const achievement = this._convertToCamelCase(payload?.new);
          onInsert(achievement);
        }
      }
    )?.subscribe((status) => {
      console.log('Achievements subscription status:', status);
    });

    this.channels?.set(channelName, channel);
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to friends' activities in real-time for leaderboard updates
   * @param {string} userId - Current user's ID
   * @param {string[]} friendIds - Array of friend user IDs
   * @param {Function} onUpdate - Callback when any friend's activity changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToFriendsActivities(userId, friendIds, onUpdate) {
    const channelName = `friends_activities_${userId}`;

    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    // Include current user in the monitoring
    const allUserIds = [userId, ...(friendIds || [])];

    if (allUserIds?.length === 0) {
      console.log('No users to subscribe to for friends activities');
      return () => { };
    }

    const channel = supabase?.channel(channelName);

    // Subscribe to activity logs changes for all friends
    allUserIds?.forEach(id => {
      channel?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${id}`
        },
        (payload) => {
          console.log(`Real-time: Friend activity changed for user ${id}`, payload);
          if (onUpdate) {
            onUpdate({
              userId: id,
              event: payload?.eventType,
              activity: this._convertToCamelCase(payload?.new || payload?.old)
            });
          }
        }
      );

      // Also subscribe to their statistics changes (for streak updates)
      channel?.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_statistics',
          filter: `user_id=eq.${id}`
        },
        (payload) => {
          console.log(`Real-time: Friend statistics updated for user ${id}`, payload);
          if (onUpdate) {
            onUpdate({
              userId: id,
              event: 'statistics_update',
              statistics: this._convertToCamelCase(payload?.new)
            });
          }
        }
      );
    });

    channel?.subscribe((status) => {
      console.log('Friends activities subscription status:', status);
    });

    this.channels?.set(channelName, channel);
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to friendships changes (new friends, accepted requests)
   * @param {string} userId - Current user's ID
   * @param {Function} onChange - Callback when friendships change
   * @returns {Function} Unsubscribe function
   */
  subscribeToFriendships(userId, onChange) {
    const channelName = `friendships_${userId}`;

    if (this.channels?.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase?.channel(channelName)?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'friendships',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Friendships changed', payload);
        if (onChange) {
          onChange({
            event: payload?.eventType,
            friendship: this._convertToCamelCase(payload?.new || payload?.old)
          });
        }
      }
    )?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'friendships',
        filter: `friend_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time: Received friendship request/update', payload);
        if (onChange) {
          onChange({
            event: payload?.eventType,
            friendship: this._convertToCamelCase(payload?.new || payload?.old)
          });
        }
      }
    )?.subscribe((status) => {
      console.log('Friendships subscription status:', status);
    });

    this.channels?.set(channelName, channel);
    return () => this.unsubscribe(channelName);
  }

  /**
   * Alias for subscribeToFriendships focusing on request notifications
   */
  subscribeToFriendRequests(userId, onChange) {
    return this.subscribeToFriendships(userId, onChange);
  }

  /**
   * Unsubscribe from a specific channel
   * @param {string} channelName - Name of the channel to unsubscribe
   */
  unsubscribe(channelName) {
    const channel = this.channels?.get(channelName);
    if (channel) {
      supabase?.removeChannel(channel);
      this.channels?.delete(channelName);
      console.log(`Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    this.channels?.forEach((channel, name) => {
      supabase?.removeChannel(channel);
      console.log(`Unsubscribed from ${name}`);
    });
    this.channels?.clear();
  }

  /**
   * Convert database snake_case to JavaScript camelCase
   * @private
   */
  _convertToCamelCase(obj) {
    if (!obj) return obj;

    const camelObj = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
      camelObj[camelKey] = value;
    }
    return camelObj;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
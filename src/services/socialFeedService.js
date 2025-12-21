import { supabase } from '../lib/supabase';

/**
 * Service for managing social activity feed operations
 */
class SocialFeedService {
  /**
   * Fetch friend activities with user details
   * @param {string} userId - Current user ID
   * @param {Object} filters - Filter options (friendType, activityType)
   * @param {number} limit - Number of activities to fetch
   * @param {number} offset - Pagination offset
   * @returns {Promise<Object>} Activities with pagination info
   */
  async getFriendActivities(userId, filters = {}, limit = 20, offset = 0) {
    try {
      // Get user's friends
      const { data: friendships, error: friendshipsError } = await supabase?.from('friendships')?.select('friend_id')?.eq('user_id', userId)?.eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships?.map(f => f?.friend_id) || [];

      if (friendIds?.length === 0) {
        return { activities: [], hasMore: false };
      }

      // Build query for activities
      let query = supabase?.from('activity_logs')?.select(`
          *,
          user_profiles!activity_logs_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)?.in('user_id', friendIds)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      // Apply activity type filter
      if (filters?.activityType && filters?.activityType !== 'all') {
        query = query?.eq('category', filters?.activityType);
      }

      const { data: activities, error: activitiesError } = await query;

      if (activitiesError) throw activitiesError;

      // Fetch achievements for activities
      const activityIds = activities?.map(a => a?.id) || [];
      const { data: achievements } = await supabase?.from('achievements')?.select('*')?.in('user_id', friendIds);

      // Map achievements to activities
      const activitiesWithAchievements = activities?.map(activity => ({
        ...activity,
        achievements: achievements?.filter(a => a?.user_id === activity?.user_id) || []
      })) || [];

      return {
        activities: activitiesWithAchievements,
        hasMore: activities?.length === limit
      };
    } catch (error) {
      console.error('Error fetching friend activities:', error);
      throw error;
    }
  }

  /**
   * Get trending achievements among friends
   * @param {string} userId - Current user ID
   * @param {number} limit - Number of trending items
   * @returns {Promise<Array>} Trending achievements
   */
  async getTrendingAchievements(userId, limit = 5) {
    try {
      const { data: friendships, error: friendshipsError } = await supabase?.from('friendships')?.select('friend_id')?.eq('user_id', userId)?.eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships?.map(f => f?.friend_id) || [];

      if (friendIds?.length === 0) {
        return [];
      }

      const { data: achievements, error } = await supabase?.from('achievements')?.select(`
          *,
          user_profiles!achievements_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)?.in('user_id', friendIds)?.gte('earned_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString())?.order('earned_at', { ascending: false })?.limit(limit);

      if (error) throw error;

      return achievements || [];
    } catch (error) {
      console.error('Error fetching trending achievements:', error);
      throw error;
    }
  }

  /**
   * Get active streak leaderboard for friends
   * @param {string} userId - Current user ID
   * @param {number} limit - Number of users to fetch
   * @returns {Promise<Array>} Streak leaderboard
   */
  async getStreakLeaderboard(userId, limit = 10) {
    try {
      const { data: friendships, error: friendshipsError } = await supabase?.from('friendships')?.select('friend_id')?.eq('user_id', userId)?.eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships?.map(f => f?.friend_id) || [];

      if (friendIds?.length === 0) {
        return [];
      }

      const { data: profiles, error } = await supabase?.from('user_profiles')?.select('id, username, full_name, avatar_url, current_streak, longest_streak')?.in('id', friendIds)?.order('current_streak', { ascending: false })?.limit(limit);

      if (error) throw error;

      return profiles || [];
    } catch (error) {
      console.error('Error fetching streak leaderboard:', error);
      throw error;
    }
  }

  /**
   * Add reaction to an activity
   * @param {string} activityId - Activity ID
   * @param {string} userId - User ID
   * @param {string} reactionType - Type of reaction (congrats, inspire, challenge)
   * @returns {Promise<Object>} Reaction data
   */
  async addReaction(activityId, userId, reactionType) {
    try {
      const { data, error } = await supabase?.from('activity_reactions')?.insert({
          activity_id: activityId,
          user_id: userId,
          reaction_type: reactionType
        })?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  /**
   * Remove reaction from an activity
   * @param {string} activityId - Activity ID
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async removeReaction(activityId, userId) {
    try {
      const { error } = await supabase?.from('activity_reactions')?.delete()?.eq('activity_id', activityId)?.eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }

  /**
   * Get reactions for activities
   * @param {Array<string>} activityIds - Array of activity IDs
   * @returns {Promise<Object>} Reactions grouped by activity ID
   */
  async getReactions(activityIds) {
    try {
      const { data, error } = await supabase?.from('activity_reactions')?.select('*')?.in('activity_id', activityIds);

      if (error) throw error;

      // Group reactions by activity_id
      const grouped = {};
      data?.forEach(reaction => {
        if (!grouped?.[reaction?.activity_id]) {
          grouped[reaction.activity_id] = [];
        }
        grouped?.[reaction?.activity_id]?.push(reaction);
      });

      return grouped;
    } catch (error) {
      console.error('Error fetching reactions:', error);
      throw error;
    }
  }

  /**
   * Add comment to an activity
   * @param {string} activityId - Activity ID
   * @param {string} userId - User ID
   * @param {string} content - Comment content
   * @returns {Promise<Object>} Comment data
   */
  async addComment(activityId, userId, content) {
    try {
      const { data, error } = await supabase?.from('activity_comments')?.insert({
          activity_id: activityId,
          user_id: userId,
          content: content
        })?.select(`
          *,
          user_profiles!activity_comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Get comments for an activity
   * @param {string} activityId - Activity ID
   * @returns {Promise<Array>} Comments
   */
  async getComments(activityId) {
    try {
      const { data, error } = await supabase?.from('activity_comments')?.select(`
          *,
          user_profiles!activity_comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)?.eq('activity_id', activityId)?.order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Subscribe to friend activities in real-time
   * @param {string} userId - Current user ID
   * @param {Function} callback - Callback function for new activities
   * @returns {Function} Unsubscribe function
   */
  subscribeFriendActivities(userId, callback) {
    const channel = supabase?.channel('friend_activities')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities'
        },
        async (payload) => {
          // Check if the activity is from a friend
          const { data: friendship } = await supabase?.from('friendships')?.select('id')?.eq('user_id', userId)?.eq('friend_id', payload?.new?.user_id)?.eq('status', 'accepted')?.single();

          if (friendship) {
            // Fetch complete activity with user profile
            const { data: activity } = await supabase?.from('activities')?.select(`
                *,
                user_profiles!activities_user_id_fkey (
                  id,
                  username,
                  full_name,
                  avatar_url
                )
              `)?.eq('id', payload?.new?.id)?.single();

            if (activity) {
              callback(activity);
            }
          }
        }
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }

  /**
   * Subscribe to friend achievements in real-time
   * @param {string} userId - Current user ID
   * @param {Function} callback - Callback function for new achievements
   * @returns {Function} Unsubscribe function
   */
  subscribeFriendAchievements(userId, callback) {
    const channel = supabase?.channel('friend_achievements')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'achievements'
        },
        async (payload) => {
          // Check if the achievement is from a friend
          const { data: friendship } = await supabase?.from('friendships')?.select('id')?.eq('user_id', userId)?.eq('friend_id', payload?.new?.user_id)?.eq('status', 'accepted')?.single();

          if (friendship) {
            // Fetch complete achievement with user profile
            const { data: achievement } = await supabase?.from('achievements')?.select(`
                *,
                user_profiles!achievements_user_id_fkey (
                  id,
                  username,
                  full_name,
                  avatar_url
                )
              `)?.eq('id', payload?.new?.id)?.single();

            if (achievement) {
              callback(achievement);
            }
          }
        }
      )?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }
}

export default new SocialFeedService();
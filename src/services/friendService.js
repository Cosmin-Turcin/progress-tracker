import { supabase } from '../lib/supabase';

export const friendService = {
  // Get all friendships for current user
  async getFriendships() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('friendships')?.select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at
        `)?.or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`);

      if (error) throw error;

      return data?.map(friendship => ({
        id: friendship?.id,
        userId: friendship?.user_id,
        friendId: friendship?.friend_id,
        status: friendship?.status,
        createdAt: friendship?.created_at,
        updatedAt: friendship?.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching friendships:', error);
      throw error;
    }
  },

  // Search users to add as friends
  async searchUsers(query) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('user_profiles')?.select('id, full_name, email, avatar_url, username')?.ilike('full_name', `%${query}%`)?.neq('id', user?.id)?.limit(10);

      if (error) throw error;

      return data?.map(profile => ({
        id: profile?.id,
        fullName: profile?.full_name,
        username: profile?.username,
        email: profile?.email,
        avatarUrl: profile?.avatar_url
      })) || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Send friend request
  async sendFriendRequest(friendId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('friendships')?.insert({
        user_id: user?.id,
        friend_id: friendId,
        status: 'pending'
      })?.select()?.single();

      if (error) throw error;

      return {
        id: data?.id,
        userId: data?.user_id,
        friendId: data?.friend_id,
        status: data?.status,
        createdAt: data?.created_at
      };
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // Accept friend request
  async acceptFriendRequest(friendshipId) {
    try {
      const { data, error } = await supabase?.from('friendships')?.update({ status: 'accepted', updated_at: new Date()?.toISOString() })?.eq('id', friendshipId)?.select()?.single();

      if (error) throw error;

      return {
        id: data?.id,
        status: data?.status,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  // Decline friend request
  async declineFriendRequest(friendshipId) {
    try {
      const { error } = await supabase?.from('friendships')?.delete()?.eq('id', friendshipId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error declining friend request:', error);
      throw error;
    }
  },

  // Remove friend
  async removeFriend(friendshipId) {
    try {
      const { error } = await supabase?.from('friendships')?.delete()?.eq('id', friendshipId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  // Get pending friend requests (received)
  async getPendingRequests() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('friendships')
        ?.select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          user_profiles!friendships_user_id_fkey (
            id,
            full_name,
            username,
            email,
            avatar_url
          )
        `)
        ?.eq('friend_id', user?.id)
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(request => ({
        id: request?.id,
        userId: request?.user_id,
        friendId: request?.friend_id,
        status: request?.status,
        createdAt: request?.created_at,
        requester: {
          id: request?.user_profiles?.id,
          fullName: request?.user_profiles?.full_name,
          username: request?.user_profiles?.username,
          email: request?.user_profiles?.email,
          avatarUrl: request?.user_profiles?.avatar_url
        }
      })) || [];
    } catch (error) {
      console.error('Error getting pending requests:', error);
      throw error;
    }
  },

  // Get accepted friends list
  async getFriends() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('friendships')
        ?.select(`
          id,
          user_id,
          friend_id,
          created_at,
          user_profiles!friendships_friend_id_fkey (
            id,
            full_name,
            username,
            email,
            avatar_url
          )
        `)
        ?.eq('user_id', user?.id)
        ?.eq('status', 'accepted')
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(friendship => ({
        id: friendship?.id,
        friend: {
          id: friendship?.user_profiles?.id,
          fullName: friendship?.user_profiles?.full_name,
          username: friendship?.user_profiles?.username,
          email: friendship?.user_profiles?.email,
          avatarUrl: friendship?.user_profiles?.avatar_url
        },
        since: friendship?.created_at
      })) || [];
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  },

  // Get friends leaderboard
  async getFriendsLeaderboard(timePeriod = 'all-time', limitCount = 50) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.rpc('get_friends_leaderboard', {
        requesting_user_id: user?.id,
        time_period: timePeriod,
        limit_count: limitCount
      });

      if (error) throw error;

      return data?.map(row => ({
        userId: row?.user_id,
        fullName: row?.full_name,
        username: row?.username,
        avatarUrl: row?.avatar_url,
        totalPoints: row?.total_points,
        currentStreak: row?.current_streak,
        achievementsUnlocked: row?.achievements_unlocked,
        totalActivities: row?.total_activities,
        rank: row?.rank,
        positionChange: row?.position_change
      })) || [];
    } catch (error) {
      console.error('Error fetching friends leaderboard:', error);
      throw error;
    }
  },

  // Get global leaderboard
  async getGlobalLeaderboard(timePeriod = 'all-time', limitCount = 100) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      // user might be null for global list if public (but we are in authenticated app)

      const { data, error } = await supabase?.rpc('get_global_leaderboard', {
        requesting_user_id: user?.id,
        time_period: timePeriod,
        limit_count: limitCount
      });

      if (error) throw error;

      return data?.map(row => ({
        userId: row?.user_id,
        fullName: row?.full_name,
        username: row?.username,
        avatarUrl: row?.avatar_url,
        totalPoints: row?.total_points,
        currentStreak: row?.current_streak,
        achievementsUnlocked: row?.achievements_unlocked,
        totalActivities: row?.total_activities,
        rank: row?.rank,
        friendshipStatus: row?.friendship_status
      })) || [];
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  },

  // Get current user's ranking and stats for header
  async getUserRankingStats(timePeriod = 'all-time') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.rpc('get_user_ranking_stats', {
        p_user_id: user?.id,
        p_period: timePeriod
      });

      if (error) throw error;

      const row = data?.[0];
      return {
        userId: row?.user_id,
        totalPoints: row?.total_points || 0,
        currentStreak: row?.current_streak || 0,
        achievementsUnlocked: row?.achievements_unlocked || 0,
        rank: row?.rank || '-'
      };
    } catch (error) {
      console.error('Error fetching user ranking stats:', error);
      throw error;
    }
  },

  /**
   * Get detailed friend profile information
   * @param {string} friendId - Friend's user ID
   * @returns {Promise<Object>} Friend profile with stats and activities
   */
  async getFriendProfile(friendId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();

      // Get friend's profile
      const { data: profile, error: profileError } = await supabase?.from('user_profiles')?.select('*')?.eq('id', friendId)?.single();

      if (profileError) throw profileError;

      // Get friendship details
      let friendship = null;
      if (user) {
        const { data: friendshipData, error: friendshipError } = await supabase
          ?.from('friendships')
          ?.select('*')
          ?.or(`and(user_id.eq.${user?.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user?.id})`)
          ?.eq('status', 'accepted')
          ?.limit(1);

        if (friendshipError) throw friendshipError;
        friendship = friendshipData?.[0];
      }

      // Get friend's statistics
      const { data: activityStats } = await supabase?.rpc('get_user_comprehensive_stats', { p_user_id: friendId });

      // Get friend's recent achievements
      const { data: achievements } = await supabase?.from('achievements')
        ?.select('*')
        ?.eq('user_id', friendId)
        ?.order('achieved_at', { ascending: false })
        ?.limit(10);

      // Get friend's recent activities
      const { data: activities } = await supabase?.from('activity_logs')?.select('*')?.eq('user_id', friendId)?.order('activity_date', { ascending: false })?.order('activity_time', { ascending: false })?.limit(20);

      // Get mutual friends count
      const { data: friendFriendships } = await supabase?.from('friendships')?.select('friend_id, user_id')?.filter('status', 'eq', 'accepted')?.or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

      const friendIds = friendFriendships?.map(f => f.user_id === friendId ? f.friend_id : f.user_id) || [];

      let mutualCount = 0;
      if (user && friendIds.length > 0) {
        const { count: mutualCountData } = await supabase?.from('friendships')
          ?.select('*', { count: 'only', head: true })
          ?.eq('status', 'accepted')
          ?.or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
          ?.in('friend_id', friendIds);
        mutualCount = mutualCountData || 0;
      }

      return {
        profile,
        friendship,
        stats: activityStats?.[0] || {},
        achievements: achievements?.map(a => ({
          ...a,
          achievedAt: a.achieved_at,
          achievementType: a.achievement_type,
          iconColor: a.icon_color,
          isNew: a.is_new
        })) || [],
        activities: activities?.map(a => ({
          ...a,
          activityDate: a.activity_date,
          activityTime: a.activity_time,
          activityName: a.activity_name,
          iconColor: a.icon_color
        })) || [],
        mutualFriendsCount: mutualCount || 0
      };
    } catch (error) {
      console.error('Error fetching friend profile:', error);
      throw error;
    }
  },

  /**
   * Get shared achievements between current user and friend
   * @param {string} friendId - Friend's user ID
   * @returns {Promise<Array>} Shared achievements
   */
  async getSharedAchievements(friendId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      // If not logged in, no shared achievements possible
      if (!user) return [];

      const { data: friendAchievements } = await supabase?.from('achievements')?.select('achievement_type')?.eq('user_id', friendId);
      const achievementTypes = friendAchievements?.map(a => a.achievement_type) || [];

      const { data, error } = await supabase?.from('achievements')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.in('achievement_type', achievementTypes);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shared achievements:', error);
      throw error;
    }
  },

  /**
   * Send activity challenge to friend
   * @param {string} friendId - Friend's user ID
   * @param {Object} challengeData - Challenge details
   * @returns {Promise<Object>} Created challenge
   */
  async sendChallenge(friendId, challengeData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create challenge notification or record
      const { data, error } = await supabase?.from('friend_challenges')?.insert({
        challenger_id: user?.id,
        challenged_id: friendId,
        challenge_type: challengeData?.type,
        challenge_details: challengeData?.details,
        status: 'pending'
      })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending challenge:', error);
      throw error;
    }
  },

  /**
   * Congratulate friend on achievement
   * @param {string} friendId - Friend's user ID
   * @param {string} achievementId - Achievement ID
   * @returns {Promise<Object>} Congratulation record
   */
  async congratulateFriend(friendId, achievementId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('achievement_reactions')?.insert({
        user_id: user?.id,
        achievement_user_id: friendId,
        achievement_id: achievementId,
        reaction_type: 'congratulations'
      })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error congratulating friend:', error);
      throw error;
    }
  },

  /**
   * Get profile by username
   * @param {string} username - User's unique username
   * @returns {Promise<Object>} User profile
   */
  async getProfileByUsername(username) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.ilike('username', username)
        ?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile by username:', error);
      throw error;
    }
  },

  /**
   * Get comprehensive stats for any user
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats(userId) {
    try {
      if (!userId) return null;
      const { data, error } = await supabase?.rpc('get_user_comprehensive_stats', { p_user_id: userId });
      if (error) throw error;
      return data?.[0] || {};
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {};
    }
  }
};

// Re-export methods for convenience as requested by existing codebase patterns
export const getFriendProfile = friendService.getFriendProfile;
export const getSharedAchievements = friendService.getSharedAchievements;
export const sendChallenge = friendService.sendChallenge;
export const congratulateFriend = friendService.congratulateFriend;
export const removeFriend = friendService.removeFriend;
export const getProfileByUsername = friendService.getProfileByUsername;
export const getUserStats = friendService.getUserStats;

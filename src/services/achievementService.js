import { supabase } from '../lib/supabase';

export const achievementService = {
  // Get all achievements for current user
  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('achievements')?.select('*')?.eq('user_id', user?.id)?.order('achieved_at', { ascending: false });

    if (error) throw error;

    // Convert snake_case to camelCase
    return data?.map(achievement => ({
      id: achievement?.id,
      userId: achievement?.user_id,
      title: achievement?.title,
      description: achievement?.description,
      achievementType: achievement?.achievement_type,
      icon: achievement?.icon,
      iconColor: achievement?.icon_color,
      achievedAt: achievement?.achieved_at,
      isNew: achievement?.is_new,
      createdAt: achievement?.created_at
    }));
  },

  // Get achievements by type
  async getByType(type) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('achievements')?.select('*')?.eq('user_id', user?.id)?.eq('achievement_type', type)?.order('achieved_at', { ascending: false });

    if (error) throw error;

    return data?.map(achievement => ({
      id: achievement?.id,
      userId: achievement?.user_id,
      title: achievement?.title,
      description: achievement?.description,
      achievementType: achievement?.achievement_type,
      icon: achievement?.icon,
      iconColor: achievement?.icon_color,
      achievedAt: achievement?.achieved_at,
      isNew: achievement?.is_new,
      createdAt: achievement?.created_at
    }));
  },

  // Mark achievement as viewed (not new)
  async markAsViewed(achievementId) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase?.from('achievements')?.update({ is_new: false })?.eq('id', achievementId)?.eq('user_id', user?.id);

    if (error) throw error;
  },

  // Get achievement statistics
  async getStats() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('achievements')?.select('achievement_type')?.eq('user_id', user?.id);

    if (error) throw error;

    // Count by type
    const stats = {
      total: data?.length,
      streak: data?.filter(a => a?.achievement_type === 'streak')?.length,
      milestone: data?.filter(a => a?.achievement_type === 'milestone')?.length,
      goal: data?.filter(a => a?.achievement_type === 'goal')?.length,
      special: data?.filter(a => a?.achievement_type === 'special')?.length
    };

    return stats;
  },

  // Search achievements
  async search(query) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('achievements')?.select('*')?.eq('user_id', user?.id)?.or(`title.ilike.%${query}%,description.ilike.%${query}%`)?.order('achieved_at', { ascending: false });

    if (error) throw error;

    return data?.map(achievement => ({
      id: achievement?.id,
      userId: achievement?.user_id,
      title: achievement?.title,
      description: achievement?.description,
      achievementType: achievement?.achievement_type,
      icon: achievement?.icon,
      iconColor: achievement?.icon_color,
      achievedAt: achievement?.achieved_at,
      isNew: achievement?.is_new,
      createdAt: achievement?.created_at
    }));
  }
};
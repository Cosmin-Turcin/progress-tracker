import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUp(email, password, fullName, username) {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          avatar_url: '',
          role: 'user'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase?.auth?.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase?.auth?.getUser();
    if (error) throw error;
    return user;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

    if (error) throw error;
    return data;
  },

  async getProfile(userId) {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

    if (error) throw error;
    return data;
  },

  async getStatistics(userId) {
    const { data, error } = await supabase?.from('user_statistics')?.select('*')?.eq('user_id', userId)?.single();

    if (error) throw error;
    return data;
  },

  async isUsernameAvailable(username) {
    if (!username || username.length < 3) return false;
    const { data, error } = await supabase
      ?.from('user_profiles')
      ?.select('username')
      ?.ilike('username', username)
      ?.single();

    if (error && error.code === 'PGRST116') {
      // PGRST116 means no rows found, so username is available
      return true;
    }
    return false;
  }
};
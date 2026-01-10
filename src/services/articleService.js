import { supabase } from '../lib/supabase';

/**
 * Service for managing mindset articles in the database.
 */
export const articleService = {
    /**
     * Fetch all public articles, ordered by most recent.
     * @returns {Promise<Array>} Array of articles
     */
    async getAllPublic() {
        try {
            const { data, error } = await supabase
                .from('mindset_articles')
                .select(`
                    *,
                    user_profiles:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('privacy', 'public')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching public articles:', error);
            throw error;
        }
    },

    /**
     * Fetch articles created by a specific user.
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of articles
     */
    async getByUser(userId) {
        try {
            const { data, error } = await supabase
                .from('mindset_articles')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching user articles:', error);
            throw error;
        }
    },

    /**
     * Create a new article.
     * @param {Object} articleData - Article data
     * @returns {Promise<Object>} Created article
     */
    async create(articleData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Calculate read time (approx 200 words per minute)
            const wordCount = articleData.content?.split(/\s+/).length || 0;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            // Generate preview from content
            const preview = articleData.content?.substring(0, 200).replace(/[#*_]/g, '').trim() + '...';

            const { data, error } = await supabase
                .from('mindset_articles')
                .insert({
                    user_id: user.id,
                    title: articleData.title,
                    content: articleData.content,
                    preview: preview,
                    type: articleData.type || 'Article',
                    privacy: articleData.privacy || 'public',
                    category: articleData.category || 'Insight',
                    cover_url: articleData.coverUrl,
                    read_time: readTime
                })
                .select(`
                    *,
                    user_profiles:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    },

    /**
     * Increment the read count for an article.
     * @param {string} articleId - Article ID
     * @returns {Promise<void>}
     */
    async incrementReadCount(articleId) {
        try {
            const { data: article, error: fetchError } = await supabase
                .from('mindset_articles')
                .select('read_count')
                .eq('id', articleId)
                .single();

            if (fetchError) throw fetchError;

            const newCount = (article.read_count || 0) + 1;

            const { error: updateError } = await supabase
                .from('mindset_articles')
                .update({ read_count: newCount })
                .eq('id', articleId);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error incrementing read count:', error);
        }
    },

    /**
     * Delete an article.
     * @param {string} articleId - Article ID
     * @returns {Promise<void>}
     */
    async delete(articleId) {
        try {
            const { error } = await supabase
                .from('mindset_articles')
                .delete()
                .eq('id', articleId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    },

    /**
     * Fetch mindset videos for focus stream.
     * @returns {Promise<Array>} Array of videos
     */
    async getMindsetVideos() {
        try {
            const { data, error } = await supabase
                .from('mindset_videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching mindset videos:', error);
            throw error;
        }
    },

    /**
     * Save an article to user bookmarks.
     * @param {string} articleId - Article ID
     */
    async saveArticle(articleId) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('mindset_saves')
                .insert({ user_id: user.id, article_id: articleId });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving article:', error);
            throw error;
        }
    },

    /**
     * Unsave an article.
     * @param {string} articleId - Article ID
     */
    async unsaveArticle(articleId) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('mindset_saves')
                .delete()
                .eq('user_id', user.id)
                .eq('article_id', articleId);

            if (error) throw error;
        } catch (error) {
            console.error('Error unsaving article:', error);
            throw error;
        }
    },

    /**
     * Fetch articles saved by the current user.
     * @returns {Promise<Array>} Array of articles
     */
    async getSavedArticles() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('mindset_saves')
                .select(`
                    id,
                    article:article_id (
                        *,
                        user_profiles:user_id (
                            id,
                            full_name,
                            username,
                            avatar_url
                        )
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            return data.map(item => item.article) || [];
        } catch (error) {
            console.error('Error fetching saved articles:', error);
            throw error;
        }
    },

    /**
     * Fetch articles created by the current user (all privacy levels).
     * @returns {Promise<Array>} Array of articles
     */
    async getMyArticles() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('mindset_articles')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching my articles:', error);
            throw error;
        }
    }
};

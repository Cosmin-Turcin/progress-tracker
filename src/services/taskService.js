import { supabase } from '../lib/supabase';

/**
 * Service for managing work tasks in the database.
 */
export const taskService = {
    /**
     * Fetch all tasks for the current user.
     * @returns {Promise<Array>} Array of tasks
     */
    async getAll() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('work_tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    /**
     * Fetch tasks by status.
     * @param {string} status - Task status
     * @returns {Promise<Array>} Array of tasks
     */
    async getByStatus(status) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('work_tasks')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', status)
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching tasks by status:', error);
            throw error;
        }
    },

    /**
     * Create a new task.
     * @param {Object} taskData - Task data
     * @returns {Promise<Object>} Created task
     */
    async create(taskData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('work_tasks')
                .insert({
                    user_id: user.id,
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status || 'todo',
                    priority: taskData.priority || 'medium',
                    category: taskData.category || 'general',
                    due_date: taskData.dueDate,
                    project_id: taskData.projectId
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    /**
     * Update a task.
     * @param {string} taskId - Task ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated task
     */
    async update(taskId, updates) {
        try {
            const updateData = {
                ...updates,
                updated_at: new Date().toISOString()
            };

            // If marking as done, record completion time
            if (updates.status === 'done') {
                updateData.completed_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('work_tasks')
                .update(updateData)
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    /**
     * Update task status (convenience method).
     * @param {string} taskId - Task ID
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated task
     */
    async updateStatus(taskId, status) {
        return this.update(taskId, { status });
    },

    /**
     * Delete a task.
     * @param {string} taskId - Task ID
     * @returns {Promise<void>}
     */
    async delete(taskId) {
        try {
            const { error } = await supabase
                .from('work_tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    /**
     * Get task statistics.
     * @returns {Promise<Object>} Task stats
     */
    async getStats() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { total: 0, todo: 0, inProgress: 0, done: 0 };

            const { data, error } = await supabase
                .from('work_tasks')
                .select('status')
                .eq('user_id', user.id);

            if (error) throw error;

            const stats = {
                total: data?.length || 0,
                todo: data?.filter(t => t.status === 'todo').length || 0,
                inProgress: data?.filter(t => t.status === 'in_progress').length || 0,
                done: data?.filter(t => t.status === 'done').length || 0
            };

            return stats;
        } catch (error) {
            console.error('Error fetching task stats:', error);
            return { total: 0, todo: 0, inProgress: 0, done: 0 };
        }
    }
};

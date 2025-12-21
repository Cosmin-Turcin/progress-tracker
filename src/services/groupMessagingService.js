import { supabase } from '../lib/supabase';

/**
 * Group Messaging Service
 * Handles group conversation operations with real-time updates, file attachments, and team activities
 */

// ================================================================
// GROUP CONVERSATION MANAGEMENT
// ================================================================

/**
 * Create a new group conversation
 */
export const createGroupConversation = async (name, description = '', memberIds = [], isTeamActivity = false) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: conversation, error: convError } = await supabase
      ?.from('group_conversations')
      ?.insert({
        name,
        description,
        created_by: user?.id,
        is_team_activity: isTeamActivity
      })
      ?.select()
      ?.single();

    if (convError) throw convError;

    const membersToAdd = [
      { conversation_id: conversation?.id, user_id: user?.id, role: 'owner' },
      ...memberIds?.map(id => ({
        conversation_id: conversation?.id,
        user_id: id,
        role: 'member'
      }))
    ];

    const { error: membersError } = await supabase
      ?.from('group_members')
      ?.insert(membersToAdd);

    if (membersError) throw membersError;

    return conversation;
  } catch (error) {
    console.error('Error creating group conversation:', error);
    throw error;
  }
};

/**
 * Get all group conversations for current user
 */
export const getUserGroupConversations = async () => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: memberships, error } = await supabase
      ?.from('group_members')
      ?.select(`
        conversation_id,
        role,
        is_muted,
        is_archived,
        group_conversations!inner(
          id,
          name,
          description,
          avatar_url,
          created_by,
          is_team_activity,
          created_at,
          last_message_at
        )
      `)
      ?.eq('user_id', user?.id)
      ?.order('group_conversations(last_message_at)', { ascending: false });

    if (error) throw error;

    const conversationsWithDetails = await Promise.all(
      memberships?.map(async (membership) => {
        const conv = membership?.group_conversations;
        
        const { data: latestMessage } = await supabase
          ?.from('group_messages')
          ?.select('content, created_at, sender_id, message_type')
          ?.eq('conversation_id', conv?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(1)
          ?.single();

        const { data: members } = await supabase
          ?.rpc('get_group_members_with_profiles', { conversation_uuid: conv?.id });

        const unreadCount = await getUnreadMessageCount(conv?.id);

        return {
          ...conv,
          memberRole: membership?.role,
          isMuted: membership?.is_muted,
          isArchived: membership?.is_archived,
          latestMessage,
          members,
          memberCount: members?.length || 0,
          unreadCount
        };
      })
    );

    return conversationsWithDetails;
  } catch (error) {
    console.error('Error fetching group conversations:', error);
    throw error;
  }
};

/**
 * Get group conversation details
 */
export const getGroupConversationDetails = async (conversationId) => {
  try {
    const { data: conversation, error: convError } = await supabase
      ?.from('group_conversations')
      ?.select('*')
      ?.eq('id', conversationId)
      ?.single();

    if (convError) throw convError;

    const { data: members } = await supabase
      ?.rpc('get_group_members_with_profiles', { conversation_uuid: conversationId });

    return {
      ...conversation,
      members
    };
  } catch (error) {
    console.error('Error fetching group conversation details:', error);
    throw error;
  }
};

/**
 * Update group conversation settings
 */
export const updateGroupConversation = async (conversationId, updates) => {
  try {
    const { data, error } = await supabase
      ?.from('group_conversations')
      ?.update(updates)
      ?.eq('id', conversationId)
      ?.select()
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating group conversation:', error);
    throw error;
  }
};

/**
 * Update user's group membership settings
 */
export const updateGroupMembershipSettings = async (conversationId, settings) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      ?.from('group_members')
      ?.update(settings)
      ?.eq('conversation_id', conversationId)
      ?.eq('user_id', user?.id)
      ?.select()
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating group membership settings:', error);
    throw error;
  }
};

// ================================================================
// GROUP MEMBER MANAGEMENT
// ================================================================

/**
 * Add members to a group
 */
export const addGroupMembers = async (conversationId, userIds) => {
  try {
    const membersToAdd = userIds?.map(userId => ({
      conversation_id: conversationId,
      user_id: userId,
      role: 'member'
    }));

    const { data, error } = await supabase
      ?.from('group_members')
      ?.insert(membersToAdd)
      ?.select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding group members:', error);
    throw error;
  }
};

/**
 * Remove a member from a group
 */
export const removeGroupMember = async (conversationId, userId) => {
  try {
    const { error } = await supabase
      ?.from('group_members')
      ?.delete()
      ?.eq('conversation_id', conversationId)
      ?.eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};

/**
 * Update member role
 */
export const updateMemberRole = async (conversationId, userId, role) => {
  try {
    const { data, error } = await supabase
      ?.from('group_members')
      ?.update({ role })
      ?.eq('conversation_id', conversationId)
      ?.eq('user_id', userId)
      ?.select()
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
};

// ================================================================
// MESSAGE MANAGEMENT
// ================================================================

/**
 * Get messages for a group conversation
 */
export const getGroupMessages = async (conversationId, limit = 50, offset = 0) => {
  try {
    const { data, error } = await supabase
      ?.from('group_messages')
      ?.select(`
        *,
        sender:user_profiles!sender_id(id, full_name, avatar_url),
        reactions:group_message_reactions(emoji, user_id, created_at)
      `)
      ?.eq('conversation_id', conversationId)
      ?.order('created_at', { ascending: false })
      ?.range(offset, offset + limit - 1);

    if (error) throw error;
    return data?.reverse();
  } catch (error) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
};

/**
 * Send a message to a group
 */
export const sendGroupMessage = async (conversationId, content, messageType = 'text', metadata = {}) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const messageData = {
      conversation_id: conversationId,
      sender_id: user?.id,
      content,
      message_type: messageType,
      ...metadata
    };

    const { data, error } = await supabase
      ?.from('group_messages')
      ?.insert(messageData)
      ?.select(`
        *,
        sender:user_profiles!sender_id(id, full_name, avatar_url)
      `)
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending group message:', error);
    throw error;
  }
};

/**
 * Send message with file attachment
 */
export const sendGroupMessageWithFile = async (conversationId, content, file) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file?.name?.split('.')?.pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase
      ?.storage
      ?.from('message-attachments')
      ?.upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase
      ?.storage
      ?.from('message-attachments')
      ?.createSignedUrl(uploadData?.path, 31536000);

    return await sendGroupMessage(conversationId, content, 'file', {
      file_url: urlData?.signedUrl,
      file_name: file?.name,
      file_size: file?.size,
      file_type: file?.type
    });
  } catch (error) {
    console.error('Error sending message with file:', error);
    throw error;
  }
};

/**
 * Share achievement in group
 */
export const shareAchievementInGroup = async (conversationId, achievementId, message = '') => {
  try {
    const { data: achievement } = await supabase
      ?.from('achievements')
      ?.select('*')
      ?.eq('id', achievementId)
      ?.single();

    if (!achievement) throw new Error('Achievement not found');

    return await sendGroupMessage(
      conversationId,
      message || `Check out my achievement: ${achievement?.title}!`,
      'achievement',
      { achievement_id: achievementId }
    );
  } catch (error) {
    console.error('Error sharing achievement:', error);
    throw error;
  }
};

/**
 * Share activity in group
 */
export const shareActivityInGroup = async (conversationId, activityId, message = '') => {
  try {
    const { data: activity } = await supabase
      ?.from('activity_logs')
      ?.select('*')
      ?.eq('id', activityId)
      ?.single();

    if (!activity) throw new Error('Activity not found');

    return await sendGroupMessage(
      conversationId,
      message || `Check out my activity: ${activity?.activity_name}!`,
      'activity',
      { activity_id: activityId }
    );
  } catch (error) {
    console.error('Error sharing activity:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
export const markGroupMessageAsRead = async (messageId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      ?.rpc('mark_group_message_as_read', {
        message_uuid: messageId,
        user_uuid: user?.id
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

/**
 * Get unread message count
 */
export const getUnreadMessageCount = async (conversationId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { count, error } = await supabase
      ?.from('group_messages')
      ?.select('*', { count: 'exact', head: true })
      ?.eq('conversation_id', conversationId)
      ?.not('sender_id', 'eq', user?.id)
      ?.not('read_by', 'cs', `{"${user?.id}":*}`);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Edit a group message
 */
export const editGroupMessage = async (messageId, newContent) => {
  try {
    const { data, error } = await supabase
      ?.from('group_messages')
      ?.update({
        content: newContent,
        is_edited: true,
        edited_at: new Date()?.toISOString()
      })
      ?.eq('id', messageId)
      ?.select()
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error editing group message:', error);
    throw error;
  }
};

/**
 * Delete a group message
 */
export const deleteGroupMessage = async (messageId) => {
  try {
    const { error } = await supabase
      ?.from('group_messages')
      ?.update({ is_deleted: true })
      ?.eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting group message:', error);
    throw error;
  }
};

// ================================================================
// REACTIONS
// ================================================================

/**
 * Add reaction to a group message
 */
export const addGroupReaction = async (messageId, emoji) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      ?.from('group_message_reactions')
      ?.insert({
        message_id: messageId,
        user_id: user?.id,
        emoji
      })
      ?.select()
      ?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding group reaction:', error);
    throw error;
  }
};

/**
 * Remove reaction from a group message
 */
export const removeGroupReaction = async (messageId, emoji) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      ?.from('group_message_reactions')
      ?.delete()
      ?.eq('message_id', messageId)
      ?.eq('user_id', user?.id)
      ?.eq('emoji', emoji);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing group reaction:', error);
    throw error;
  }
};

// ================================================================
// TYPING INDICATORS
// ================================================================

/**
 * Set typing indicator for group
 */
export const setGroupTypingIndicator = async (conversationId, isTyping) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    if (isTyping) {
      const { error } = await supabase
        ?.from('group_typing_indicators')
        ?.upsert({
          conversation_id: conversationId,
          user_id: user?.id,
          expires_at: new Date(Date.now() + 10000)?.toISOString()
        });

      if (error) throw error;
    } else {
      const { error } = await supabase
        ?.from('group_typing_indicators')
        ?.delete()
        ?.eq('conversation_id', conversationId)
        ?.eq('user_id', user?.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error setting group typing indicator:', error);
    throw error;
  }
};

/**
 * Get typing users in group
 */
export const getGroupTypingUsers = async (conversationId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      ?.from('group_typing_indicators')
      ?.select('user_id')
      ?.eq('conversation_id', conversationId)
      ?.neq('user_id', user?.id)
      ?.gt('expires_at', new Date()?.toISOString());

    if (error) throw error;

    const userIds = data?.map(t => t?.user_id) || [];
    
    if (userIds?.length === 0) return [];

    const { data: users } = await supabase
      ?.from('user_profiles')
      ?.select('id, full_name')
      ?.in('id', userIds);

    return users || [];
  } catch (error) {
    console.error('Error getting group typing users:', error);
    return [];
  }
};

// ================================================================
// REAL-TIME SUBSCRIPTIONS
// ================================================================

/**
 * Subscribe to group messages
 */
export const subscribeToGroupMessages = (conversationId, callback) => {
  return supabase
    ?.channel(`group-messages:${conversationId}`)
    ?.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      async (payload) => {
        const { data } = await supabase
          ?.from('group_messages')
          ?.select(`
            *,
            sender:user_profiles!sender_id(id, full_name, avatar_url)
          `)
          ?.eq('id', payload?.new?.id)
          ?.single();

        callback(data);
      }
    )
    ?.subscribe();
};

/**
 * Subscribe to group message updates
 */
export const subscribeToGroupMessageUpdates = (conversationId, callback) => {
  return supabase
    ?.channel(`group-message-updates:${conversationId}`)
    ?.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => callback({ type: 'UPDATE', data: payload?.new })
    )
    ?.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_message_reactions'
      },
      (payload) => callback({ type: 'REACTION_ADD', data: payload?.new })
    )
    ?.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'group_message_reactions'
      },
      (payload) => callback({ type: 'REACTION_REMOVE', data: payload?.old })
    )
    ?.subscribe();
};

/**
 * Subscribe to group typing indicators
 */
export const subscribeToGroupTyping = (conversationId, callback) => {
  return supabase
    ?.channel(`group-typing:${conversationId}`)
    ?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'group_typing_indicators',
        filter: `conversation_id=eq.${conversationId}`
      },
      async () => {
        const typingUsers = await getGroupTypingUsers(conversationId);
        callback(typingUsers);
      }
    )
    ?.subscribe();
};

/**
 * Subscribe to group member changes
 */
export const subscribeToGroupMemberChanges = (conversationId, callback) => {
  return supabase
    ?.channel(`group-members:${conversationId}`)
    ?.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'group_members',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => callback(payload)
    )
    ?.subscribe();
};

export default {
  createGroupConversation,
  getUserGroupConversations,
  getGroupConversationDetails,
  updateGroupConversation,
  updateGroupMembershipSettings,
  addGroupMembers,
  removeGroupMember,
  updateMemberRole,
  getGroupMessages,
  sendGroupMessage,
  sendGroupMessageWithFile,
  shareAchievementInGroup,
  shareActivityInGroup,
  markGroupMessageAsRead,
  getUnreadMessageCount,
  editGroupMessage,
  deleteGroupMessage,
  addGroupReaction,
  removeGroupReaction,
  setGroupTypingIndicator,
  getGroupTypingUsers,
  subscribeToGroupMessages,
  subscribeToGroupMessageUpdates,
  subscribeToGroupTyping,
  subscribeToGroupMemberChanges
};
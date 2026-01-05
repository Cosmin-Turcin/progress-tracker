import { supabase } from '../lib/supabase';

/**
 * Messaging Service
 * Handles direct messaging operations with real-time updates
 */

// ================================================================
// CONVERSATION MANAGEMENT
// ================================================================

/**
 * Get or create a conversation between two users
 */
export const getOrCreateConversation = async (friendId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    // Call database function to get or create conversation
    const { data, error } = await supabase?.rpc('get_or_create_conversation', {
      p_user1_id: user?.id,
      p_user2_id: friendId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for current user with latest message
 */
export const getUserConversations = async () => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase?.from('conversations')?.select(`
        *,
        messages:messages(
          content,
          created_at,
          sender_id
        )
      `)?.or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)?.order('last_message_at', { ascending: false });

    if (error) throw error;

    // Get friend profiles for each conversation
    const conversationsWithProfiles = await Promise.all(
      data?.map(async (conversation) => {
        const friendId = conversation?.user1_id === user?.id
          ? conversation?.user2_id
          : conversation?.user1_id;

        const { data: profile } = await supabase?.from('user_profiles')?.select('full_name, username, avatar_url')?.eq('id', friendId)?.single();

        return {
          ...conversation,
          friend: profile,
          friendId,
          latestMessage: conversation?.messages?.[0]
        };
      })
    );

    return conversationsWithProfiles;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get conversation details with friend info
 */
export const getConversationDetails = async (conversationId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase?.from('conversations')?.select('*')?.eq('id', conversationId)?.single();

    if (error) throw error;

    // Get friend profile
    const friendId = data?.user1_id === user?.id ? data?.user2_id : data?.user1_id;
    const { data: friend } = await supabase?.from('user_profiles')?.select('full_name, username, avatar_url')?.eq('id', friendId)?.single();

    return {
      ...data,
      friend,
      friendId
    };
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    throw error;
  }
};

/**
 * Update conversation settings (mute, archive)
 */
export const updateConversationSettings = async (conversationId, settings) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: conversation } = await supabase?.from('conversations')?.select('user1_id, user2_id')?.eq('id', conversationId)?.single();

    const isUser1 = conversation?.user1_id === user?.id;
    const updateFields = {};

    if (settings?.isMuted !== undefined) {
      updateFields[isUser1 ? 'is_muted_user1' : 'is_muted_user2'] = settings?.isMuted;
    }
    if (settings?.isArchived !== undefined) {
      updateFields[isUser1 ? 'is_archived_user1' : 'is_archived_user2'] = settings?.isArchived;
    }

    const { data, error } = await supabase?.from('conversations')?.update(updateFields)?.eq('id', conversationId)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating conversation settings:', error);
    throw error;
  }
};

// ================================================================
// MESSAGE MANAGEMENT
// ================================================================

/**
 * Get messages for a conversation with pagination
 */
export const getMessages = async (conversationId, limit = 50, offset = 0) => {
  try {
    const { data, error } = await supabase?.from('messages')?.select(`
        *,
        sender:user_profiles!sender_id(full_name, username, avatar_url),
        reactions:message_reactions(emoji, user_id)
      `)?.eq('conversation_id', conversationId)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

    if (error) throw error;
    return data?.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a new message
 */
export const sendMessage = async (conversationId, content, messageType = 'text', metadata = {}) => {
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

    const { data, error } = await supabase?.from('messages')?.insert(messageData)?.select(`
        *,
        sender:user_profiles!sender_id(full_name, avatar_url)
      `)?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase?.rpc('mark_messages_as_read', {
      p_conversation_id: conversationId,
      p_user_id: user?.id
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId) => {
  try {
    const { error } = await supabase?.from('messages')?.update({ is_deleted: true })?.eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * Edit a message
 */
export const editMessage = async (messageId, newContent) => {
  try {
    const { data, error } = await supabase?.from('messages')?.update({
      content: newContent,
      is_edited: true,
      edited_at: new Date()?.toISOString()
    })?.eq('id', messageId)?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

// ================================================================
// REACTIONS
// ================================================================

/**
 * Add reaction to a message
 */
export const addReaction = async (messageId, emoji) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase?.from('message_reactions')?.insert({
      message_id: messageId,
      user_id: user?.id,
      emoji
    })?.select()?.single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

/**
 * Remove reaction from a message
 */
export const removeReaction = async (messageId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase?.from('message_reactions')?.delete()?.eq('message_id', messageId)?.eq('user_id', user?.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
};

// ================================================================
// TYPING INDICATORS
// ================================================================

/**
 * Set typing indicator
 */
export const setTypingIndicator = async (conversationId, isTyping) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    if (isTyping) {
      // Use upsert to handle the unique constraint properly
      const { error } = await supabase?.from('typing_indicators')
        ?.upsert({
          conversation_id: conversationId,
          user_id: user?.id,
          started_at: new Date()?.toISOString(),
          expires_at: new Date(Date.now() + 5000)?.toISOString()
        }, {
          onConflict: 'conversation_id,user_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } else {
      const { error } = await supabase?.from('typing_indicators')?.delete()?.eq('conversation_id', conversationId)?.eq('user_id', user?.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error setting typing indicator:', error);
    // Don't throw error for typing indicators - fail silently
  }
};

/**
 * Get typing users in conversation
 */
export const getTypingUsers = async (conversationId) => {
  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase?.from('typing_indicators')?.select('user_id')?.eq('conversation_id', conversationId)?.neq('user_id', user?.id)?.gt('expires_at', new Date()?.toISOString());

    if (error) throw error;
    return data?.map(t => t?.user_id);
  } catch (error) {
    console.error('Error getting typing users:', error);
    throw error;
  }
};

// ================================================================
// REAL-TIME SUBSCRIPTIONS
// ================================================================

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversationId, callback) => {
  return supabase?.channel(`messages:${conversationId}`)?.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    async (payload) => {
      // Fetch complete message with sender info
      const { data } = await supabase?.from('messages')?.select(`
            *,
            sender:user_profiles!sender_id(full_name, username, avatar_url)
          `)?.eq('id', payload?.new?.id)?.single();

      callback(data);
    }
  )?.subscribe();
};

/**
 * Subscribe to message updates (edits, deletes, reactions)
 */
export const subscribeToMessageUpdates = (conversationId, callback) => {
  return supabase?.channel(`message-updates:${conversationId}`)?.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => callback({ type: 'UPDATE', data: payload?.new })
  )?.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'message_reactions',
      filter: `message_id=in.(SELECT id FROM messages WHERE conversation_id='${conversationId}')`
    },
    (payload) => callback({ type: 'REACTION_ADD', data: payload?.new })
  )?.on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'message_reactions',
      filter: `message_id=in.(SELECT id FROM messages WHERE conversation_id='${conversationId}')`
    },
    (payload) => callback({ type: 'REACTION_REMOVE', data: payload?.old })
  )?.subscribe();
};

/**
 * Subscribe to typing indicators
 */
export const subscribeToTyping = (conversationId, callback) => {
  return supabase?.channel(`typing:${conversationId}`)?.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'typing_indicators',
      filter: `conversation_id=eq.${conversationId}`
    },
    async () => {
      const typingUsers = await getTypingUsers(conversationId);
      callback(typingUsers);
    }
  )?.subscribe();
};

/**
 * Subscribe to read receipts
 */
export const subscribeToReadReceipts = (conversationId, callback) => {
  return supabase?.channel(`read-receipts:${conversationId}`)?.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      if (payload?.new?.read_at && !payload?.old?.read_at) {
        callback(payload?.new);
      }
    }
  )?.subscribe();
};
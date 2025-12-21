import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import {
  getConversationDetails,
  getMessages,
  getOrCreateConversation,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToMessageUpdates,
  subscribeToTyping,
  subscribeToReadReceipts,
  editMessage as editMessageService
} from '../../services/messagingService';
import { friendService } from '../../services/friendService';

const DirectMessaging = () => {
  const { friendId: routeFriendId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get friend data from navigation state or route params
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Check if friend data was passed via navigation state
    if (location?.state?.friendId) {
      setSelectedFriend({
        id: location?.state?.friendId,
        name: location?.state?.friendName || 'Friend',
        avatar: location?.state?.friendAvatar
      });
    } else if (routeFriendId) {
      // If friendId is in route params, fetch friend data
      loadFriendData(routeFriendId);
    } else {
      // No friend data available
      setLoading(false);
      setError('No friend selected. Please select a friend to start messaging.');
    }
  }, [location, routeFriendId]);

  const loadFriendData = async (friendId) => {
    try {
      // Fetch friend profile data
      const friendProfile = await friendService?.getFriendProfile(friendId);
      if (friendProfile?.profile) {
        setSelectedFriend({
          id: friendProfile?.profile?.user_id || friendId,
          name: friendProfile?.profile?.display_name || friendProfile?.profile?.full_name || 'Friend',
          avatar: friendProfile?.profile?.avatar_url
        });
      } else {
        setError('Friend not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading friend data:', error);
      setError('Failed to load friend data');
      setLoading(false);
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize conversation
  useEffect(() => {
    const initConversation = async () => {
      // Validate friend ID before proceeding
      if (!selectedFriend || !selectedFriend?.id) {
        return; // Error already set in previous useEffect
      }

      try {
        setLoading(true);
        setError(null);

        // Get or create conversation
        const conversationId = await getOrCreateConversation(selectedFriend?.id);

        // Get conversation details
        const conversationDetails = await getConversationDetails(conversationId);
        setConversation(conversationDetails);

        // Load messages
        const messageData = await getMessages(conversationId);
        setMessages(messageData);

        // Mark messages as read
        await markMessagesAsRead(conversationId);

        scrollToBottom();
      } catch (err) {
        console.error('Error initializing conversation:', err);
        setError(err?.message || 'Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    initConversation();
  }, [selectedFriend]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;

    const subscriptions = [];

    // Subscribe to new messages
    const messagesSubscription = subscribeToMessages(
      conversation?.id,
      (newMessage) => {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          if (prev?.some(msg => msg?.id === newMessage?.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        scrollToBottom();
        
        // Mark as read if not own message
        if (newMessage?.sender_id !== conversation?.friendId) {
          markMessagesAsRead(conversation?.id);
        }
      }
    );
    subscriptions?.push(messagesSubscription);

    // Subscribe to message updates
    const updatesSubscription = subscribeToMessageUpdates(
      conversation?.id,
      (update) => {
        if (update?.type === 'UPDATE') {
          setMessages(prev =>
            prev?.map(msg =>
              msg?.id === update?.data?.id ? { ...msg, ...update?.data } : msg
            )
          );
        } else if (update?.type === 'REACTION_ADD') {
          setMessages(prev =>
            prev?.map(msg =>
              msg?.id === update?.data?.message_id
                ? {
                    ...msg,
                    reactions: [...(msg?.reactions || []), update?.data]
                  }
                : msg
            )
          );
        } else if (update?.type === 'REACTION_REMOVE') {
          setMessages(prev =>
            prev?.map(msg =>
              msg?.id === update?.data?.message_id
                ? {
                    ...msg,
                    reactions: msg?.reactions?.filter(r => r?.id !== update?.data?.id) || []
                  }
                : msg
            )
          );
        }
      }
    );
    subscriptions?.push(updatesSubscription);

    // Subscribe to typing indicators
    const typingSubscription = subscribeToTyping(
      conversation?.id,
      (users) => setTypingUsers(users)
    );
    subscriptions?.push(typingSubscription);

    // Subscribe to read receipts
    const readReceiptsSubscription = subscribeToReadReceipts(
      conversation?.id,
      (updatedMessage) => {
        setMessages(prev =>
          prev?.map(msg =>
            msg?.id === updatedMessage?.id ? { ...msg, ...updatedMessage } : msg
          )
        );
      }
    );
    subscriptions?.push(readReceiptsSubscription);

    // Cleanup subscriptions
    return () => {
      subscriptions?.forEach(sub => sub?.unsubscribe());
    };
  }, [conversation?.id, conversation?.friendId]);

  const handleEditMessage = async (messageId, newContent) => {
    try {
      await editMessageService(messageId, newContent);
      setEditingMessage(null);
    } catch (err) {
      console.error('Error editing message:', err);
      alert('Failed to edit message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Chat</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/friends-leaderboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Friends
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chat with {conversation?.friend?.full_name || 'Friend'} - FitQuest</title>
      </Helmet>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <ChatHeader
          friend={conversation?.friend}
          conversationId={conversation?.id}
          isMuted={false}
          isArchived={false}
        />

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
        >
          {messages?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start the conversation!</h3>
              <p className="text-gray-600">
                Say hi to {conversation?.friend?.full_name || 'your friend'} and share your fitness journey
              </p>
            </div>
          ) : (
            <>
              {messages?.map((message) => (
                <MessageBubble
                  key={message?.id}
                  message={message}
                  isOwnMessage={message?.sender_id !== conversation?.friendId}
                  onEdit={(msg) => setEditingMessage(msg)}
                />
              ))}

              {/* Typing indicator */}
              {typingUsers?.length > 0 && (
                <TypingIndicator friendName={conversation?.friend?.full_name || 'Friend'} />
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <MessageInput
          conversationId={conversation?.id}
          onMessageSent={scrollToBottom}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          editMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      </div>
    </>
  );
};

export default DirectMessaging;
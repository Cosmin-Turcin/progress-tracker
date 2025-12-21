import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, TrendingUp, Trophy } from 'lucide-react';
import { sendMessage, setTypingIndicator } from '../../../services/messagingService';

const MessageInput = ({ conversationId, onMessageSent, replyTo, onCancelReply, editMessage, onCancelEdit }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickShare, setShowQuickShare] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const popularStickers = ['💪', '🔥', '👍', '❤️', '🎉', '⚡', '🏆', '🚀', '💯', '👏'];

  useEffect(() => {
    if (editMessage) {
      setMessage(editMessage?.content);
      inputRef?.current?.focus();
    }
  }, [editMessage]);

  const handleTyping = () => {
    // Clear existing timeout
    if (typingTimeoutRef?.current) {
      clearTimeout(typingTimeoutRef?.current);
    }

    // Set typing indicator
    setTypingIndicator(conversationId, true);

    // Clear typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTypingIndicator(conversationId, false);
    }, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e?.target?.value);
    handleTyping();
  };

  const handleSend = async () => {
    if (!message?.trim() || isSending) return;

    try {
      setIsSending(true);
      
      if (editMessage) {
        // Edit existing message
        await editMessage(editMessage?.id, message?.trim());
        onCancelEdit?.();
      } else {
        // Send new message
        await sendMessage(conversationId, message?.trim());
        onMessageSent?.();
      }

      setMessage('');
      setTypingIndicator(conversationId, false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSticker = async (sticker) => {
    try {
      await sendMessage(conversationId, sticker, 'sticker');
      setShowEmojiPicker(false);
      onMessageSent?.();
    } catch (error) {
      console.error('Error sending sticker:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Reply/Edit indicator */}
      {(replyTo || editMessage) && (
        <div className="mb-2 flex items-center justify-between bg-blue-50 rounded-lg p-2">
          <div className="flex-1">
            <p className="text-xs text-blue-600 font-medium">
              {editMessage ? 'Editing message' : `Replying to ${replyTo?.sender?.full_name}`}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {editMessage?.content || replyTo?.content}
            </p>
          </div>
          <button
            onClick={editMessage ? onCancelEdit : onCancelReply}
            className="text-blue-600 hover:text-blue-700 ml-2"
          >
            ✕
          </button>
        </div>
      )}
      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Quick actions */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Stickers"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowQuickShare(!showQuickShare)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share activity"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message?.trim() || isSending}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {/* Sticker picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Motivational Stickers</p>
          <div className="grid grid-cols-5 gap-2">
            {popularStickers?.map(sticker => (
              <button
                key={sticker}
                onClick={() => handleSendSticker(sticker)}
                className="text-3xl hover:scale-125 transition-transform p-2"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Quick share menu */}
      {showQuickShare && (
        <div className="absolute bottom-full left-20 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Share recent activity</span>
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">Share achievement</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
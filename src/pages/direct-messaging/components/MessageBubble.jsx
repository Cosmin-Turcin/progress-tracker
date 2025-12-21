import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Check, CheckCheck } from 'lucide-react';
import { addReaction, removeReaction, deleteMessage } from '../../../services/messagingService';

const MessageBubble = ({ message, isOwnMessage, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  const handleReaction = async (emoji) => {
    try {
      const existingReaction = message?.reactions?.find(
        r => r?.user_id === message?.sender_id && r?.emoji === emoji
      );

      if (existingReaction) {
        await removeReaction(message?.id);
      } else {
        await addReaction(message?.id, emoji);
      }
      setShowReactions(false);
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message?.id);
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const renderMessageContent = () => {
    if (message?.is_deleted) {
      return <span className="italic text-gray-400">Message deleted</span>;
    }

    switch (message?.message_type) {
      case 'activity':
        return (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <div>
              <p className="font-medium">Shared an activity</p>
              <p className="text-sm opacity-80">{message?.content}</p>
            </div>
          </div>
        );
      case 'achievement':
        return (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-medium">Unlocked achievement</p>
              <p className="text-sm opacity-80">{message?.content}</p>
            </div>
          </div>
        );
      case 'sticker':
        return <span className="text-5xl">{message?.content}</span>;
      default:
        return <p className="whitespace-pre-wrap break-words">{message?.content}</p>;
    }
  };

  const getDeliveryStatus = () => {
    if (!isOwnMessage) return null;
    
    if (message?.read_at) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else if (message?.delivered_at) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isOwnMessage && (
        <img
          src={message?.sender?.avatar_url || '/assets/images/no_image.png'}
          alt={message?.sender?.full_name || 'User avatar'}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Message bubble */}
        <div
          className={`relative group rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-sm' :'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          {/* Message content */}
          {renderMessageContent()}

          {/* Reactions */}
          {message?.reactions?.length > 0 && (
            <div className="absolute -bottom-3 left-2 flex gap-1">
              {Object.entries(
                message?.reactions?.reduce((acc, r) => {
                  acc[r?.emoji] = (acc?.[r?.emoji] || 0) + 1;
                  return acc;
                }, {})
              )?.map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji} {count > 1 && count}
                </span>
              ))}
            </div>
          )}

          {/* Menu button */}
          {isOwnMessage && !message?.is_deleted && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Context menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-32">
              <button
                onClick={() => {
                  onEdit?.(message);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div className="flex items-center gap-1 mt-1 px-2">
          <span className="text-xs text-gray-500">
            {message?.created_at 
              ? formatDistanceToNow(new Date(message?.created_at), { addSuffix: true })
              : 'Just now'}
          </span>
          {message?.is_edited && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
          {getDeliveryStatus()}
        </div>

        {/* Reaction picker */}
        {!message?.is_deleted && (
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Add reaction
            </button>
            {showReactions && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 flex gap-2">
                {commonEmojis?.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
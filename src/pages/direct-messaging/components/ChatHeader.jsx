import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Bell, BellOff, Archive, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateConversationSettings } from '../../../services/messagingService';

const ChatHeader = ({ friend, conversationId, isMuted, isArchived }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleMuteToggle = async () => {
    try {
      await updateConversationSettings(conversationId, { isMuted: !isMuted });
      setShowMenu(false);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      await updateConversationSettings(conversationId, { isArchived: !isArchived });
      setShowMenu(false);
      if (!isArchived) {
        navigate('/friends-leaderboard'); // Navigate back after archiving
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/friend-profile-view?friendId=${friend?.user_id || friend?.id}`);
    setShowMenu(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section - Back button and friend info */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
            onClick={handleViewProfile}
          >
            <div className="relative">
              <img
                src={friend?.avatar_url || '/assets/images/no_image.png'}
                alt={friend?.full_name || 'Friend avatar'}
                className="w-10 h-10 rounded-full"
              />
              {friend?.is_online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {friend?.full_name || friend?.username || 'Unknown User'}
              </h2>
              <p className="text-sm text-gray-500">
                {friend?.is_online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Right section - Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-48">
                <button
                  onClick={handleViewProfile}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  View Profile
                </button>

                <button
                  onClick={handleMuteToggle}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  {isMuted ? (
                    <>
                      <Bell className="w-4 h-4" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4" />
                      Mute
                    </>
                  )}
                </button>

                <button
                  onClick={handleArchiveToggle}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {isArchived ? 'Unarchive' : 'Archive'}
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <span>🚫</span>
                  Block User
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
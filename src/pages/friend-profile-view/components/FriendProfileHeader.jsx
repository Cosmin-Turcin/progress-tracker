import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, MessageCircle, Trophy, UserMinus, Share2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const FriendProfileHeader = ({ profile, friendship, onUnfriend, onMessage, onChallenge }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name}'s Profile`,
        text: `Check out ${profile?.display_name}'s fitness journey!`,
        url: window.location?.href,
      })?.catch((error) => console.log('Error sharing:', error));
    }
  };

  const formatFriendshipDuration = (createdAt) => {
    const duration = new Date() - new Date(createdAt);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    
    if (days < 30) return `Friends for ${days} days`;
    if (days < 365) return `Friends for ${Math.floor(days / 30)} months`;
    return `Friends for ${Math.floor(days / 365)} years`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    onMessage();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => {
                    onChallenge();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Trophy className="w-4 h-4" />
                  Send Challenge
                </button>
                <button
                  onClick={() => {
                    onUnfriend();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <UserMinus className="w-4 h-4" />
                  Unfriend
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Profile Info */}
      <div className="flex items-start gap-6">
        {/* Profile Photo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile?.display_name?.charAt(0)?.toUpperCase()}
          </div>
          {isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {profile?.display_name || 'Unknown User'}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <span className="font-medium">{profile?.mutual_friends_count || 0}</span>
              <span>mutual friends</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>{formatFriendshipDuration(friendship?.created_at)}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className={isOnline ? 'text-green-600' : 'text-gray-500'}>
              {isOnline ? 'Active now' : 'Offline'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onMessage}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
            <Button
              variant="outline"
              onClick={onChallenge}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfileHeader;
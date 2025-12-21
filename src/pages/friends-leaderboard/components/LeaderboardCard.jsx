import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LeaderboardCard({ friend, rank, currentUserId }) {
  const navigate = useNavigate();
  const isCurrentUser = friend?.userId === currentUserId;
  
  const borderColor = isCurrentUser ? 'border-blue-500' : 'border-gray-200';
  
  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const handleViewProfile = () => {
    navigate(`/friend-profile-view/${friend?.userId}`);
  };

  const handleMessage = (e) => {
    e?.stopPropagation(); // Prevent card click from triggering
    navigate('/direct-messaging', {
      state: {
        friendId: friend?.userId,
        friendName: friend?.fullName || 'Friend',
        friendAvatar: friend?.avatarUrl
      }
    });
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md cursor-pointer ${borderColor}`}
      onClick={handleViewProfile}
    >
      <div className="flex items-center gap-4">
        <div className={`text-2xl font-bold ${getRankColor(friend?.rank)}`}>
          {friend?.rank === 1 && <Trophy className="w-8 h-8" />}
          {friend?.rank !== 1 && `#${friend?.rank}`}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {friend?.avatarUrl ? (
              <img src={friend?.avatarUrl} alt={friend?.fullName || 'User'} className="w-full h-full rounded-full object-cover" />
            ) : (
              friend?.fullName?.charAt(0)?.toUpperCase() || '?'
            )}
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900">
            {friend?.fullName || 'Unknown User'}
            {isCurrentUser && <span className="ml-2 text-xs text-blue-600">(You)</span>}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{friend?.totalPoints || 0} pts</span>
            <span>•</span>
            <span>{friend?.currentStreak || 0} day streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentUser && (
            <button
              onClick={handleMessage}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              title="Send Message"
            >
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </button>
          )}
          
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              {getTrendIcon(friend?.positionChange || 0)}
            </div>
            <div className="text-sm text-gray-600">
              {friend?.achievementsUnlocked || 0} achievements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, MessageCircle, UserPlus, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { friendService } from '../../../services/friendService';

export function LeaderboardCard({ friend, currentUserId, onUpdate }) {
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState(friend?.friendshipStatus || 'none');
  const isCurrentUser = friend?.userId === currentUserId;

  const borderColor = isCurrentUser ? 'border-primary' : 'border-border';

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-error" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-slate-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const handleViewProfile = () => {
    navigate(`/friend-profile-view/${friend?.userId}`);
  };

  const handleMessage = (e) => {
    e?.stopPropagation();
    navigate('/direct-messaging', {
      state: {
        friendId: friend?.userId,
        friendName: friend?.fullName || 'Friend',
        friendAvatar: friend?.avatarUrl
      }
    });
  };

  const handleAddFriend = async (e) => {
    e?.stopPropagation();
    try {
      await friendService?.sendFriendRequest(friend?.userId);
      setRequestStatus('pending');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  return (
    <div
      className={`bg-card rounded-2xl border-2 p-5 transition-all hover:shadow-moderate cursor-pointer ${borderColor}`}
      onClick={handleViewProfile}
    >
      <div className="flex items-center gap-4">
        <div className={`text-2xl font-black font-data w-12 flex justify-center ${getRankColor(friend?.rank)}`}>
          {friend?.rank === 1 ? <Trophy className="w-8 h-8" /> : `#${friend?.rank}`}
        </div>

        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-lg border-2 border-primary/20 shadow-inner">
            {friend?.avatarUrl ? (
              <img src={friend?.avatarUrl} alt={friend?.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              friend?.fullName?.charAt(0)?.toUpperCase()
            )}
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            {friend?.fullName || 'Anonymous'}
            {isCurrentUser && <span className="ml-2 text-xs font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded">You</span>}
          </h3>
          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            <span className="flex items-center gap-1"><Trophy size={10} /> {friend?.totalPoints || 0} pts</span>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1 text-orange-600"><TrendingUp size={10} /> {friend?.currentStreak || 0}d streak</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCurrentUser && (
            <div className="flex items-center gap-2">
              {requestStatus === 'none' && (
                <button
                  onClick={handleAddFriend}
                  className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all group lg:px-4 lg:py-2 lg:flex lg:items-center lg:gap-2"
                  title="Add Friend"
                >
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline text-[10px] font-black tracking-widest">ADD FRIEND</span>
                </button>
              )}
              {requestStatus === 'pending' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-widest">PENDING</span>
                </div>
              )}
              {requestStatus === 'accepted' && (
                <>
                  <button
                    onClick={handleMessage}
                    className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/10 shadow-sm"
                    title="Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}

          <div className="hidden sm:flex flex-col items-end">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
              {friend?.achievementsUnlocked || 0} BADGES
              {getTrendIcon(0)}
            </div>
            {requestStatus === 'accepted' && (
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" title="Friend" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  Flame,
  Zap,
  MessageCircle,
  Share2,
  Trophy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * ActivityCard Component
 * Displays individual friend activity with reactions and comments
 */
const ActivityCard = ({
  activity,
  reactions,
  currentUserId,
  onReaction,
  onComment,
  onShare
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const userReaction = reactions?.find(r => r?.user_id === currentUserId);

  const reactionCounts = {
    congrats: reactions?.filter(r => r?.reaction_type === 'congrats')?.length || 0,
    inspire: reactions?.filter(r => r?.reaction_type === 'inspire')?.length || 0,
    challenge: reactions?.filter(r => r?.reaction_type === 'challenge')?.length || 0
  };

  const handleReactionClick = (type) => {
    if (userReaction?.reaction_type === type) {
      onReaction?.(activity?.id, null); // Remove reaction
    } else {
      onReaction?.(activity?.id, type); // Add/change reaction
    }
  };

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (commentText?.trim()) {
      onComment?.(activity?.id, commentText);
      setCommentText('');
    }
  };

  const getActivityIcon = () => {
    switch (activity?.activity_type) {
      case 'exercise':
        return '🏃';
      case 'nutrition':
        return '🥗';
      case 'sleep':
        return '😴';
      case 'mindset':
        return '🧘';
      case 'hydration':
        return '💧';
      default:
        return '✨';
    }
  };

  const getActivityColor = () => {
    switch (activity?.activity_type) {
      case 'exercise':
        return 'border-l-blue-500 bg-blue-50';
      case 'nutrition':
        return 'border-l-green-500 bg-green-50';
      case 'sleep':
        return 'border-l-purple-500 bg-purple-50';
      case 'mindset':
        return 'border-l-indigo-500 bg-indigo-50';
      case 'hydration':
        return 'border-l-cyan-500 bg-cyan-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getActivityColor()} p-4 mb-4 transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={activity?.user_profiles?.avatar_url || '/assets/images/no_image.png'}
          alt={`${activity?.user_profiles?.full_name || 'User'} profile`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {activity?.user_profiles?.full_name || activity?.user_profiles?.username || 'Unknown User'}
            </h3>
            <span className="text-2xl">{getActivityIcon()}</span>
          </div>
          <p className="text-sm text-gray-600">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </p>
        </div>
        {activity?.points_earned > 0 && (
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              +{activity?.points_earned}
            </span>
          </div>
        )}
      </div>
      {/* Activity Description */}
      <div className="mb-3">
        <p className="text-gray-900 mb-2">
          <span className="font-medium capitalize">{activity?.activity_type}</span>
          {activity?.duration && ` • ${activity?.duration} mins`}
        </p>
        {activity?.notes && (
          <p className="text-gray-600 text-sm">{activity?.notes}</p>
        )}
      </div>
      {/* Achievements */}
      {activity?.achievements?.length > 0 && (
        <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-900">New Achievement!</span>
          </div>
          {activity?.achievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center gap-2">
              <span className="text-2xl">{achievement?.badge_icon || '🏆'}</span>
              <div>
                <p className="font-medium text-gray-900">{achievement?.title}</p>
                <p className="text-sm text-gray-600">{achievement?.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Reaction Buttons */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
        <button
          onClick={() => handleReactionClick('congrats')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${userReaction?.reaction_type === 'congrats' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
            }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">{reactionCounts?.congrats}</span>
        </button>
        <button
          onClick={() => handleReactionClick('inspire')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${userReaction?.reaction_type === 'inspire' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
            }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">{reactionCounts?.inspire}</span>
        </button>
        <button
          onClick={() => handleReactionClick('challenge')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${userReaction?.reaction_type === 'challenge' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
            }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">{reactionCounts?.challenge}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-auto"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Comment</span>
        </button>
        <button
          onClick={() => onShare?.(activity)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e?.target?.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!commentText?.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>
        </div>
      )}
      {/* Expand/Collapse Button */}
      {activity?.description && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show Details
            </>
          )}
        </button>
      )}
      {/* Expanded Details */}
      {expanded && activity?.description && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm">{activity?.description}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
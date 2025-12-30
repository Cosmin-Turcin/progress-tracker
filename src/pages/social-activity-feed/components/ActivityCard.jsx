import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Flame,
  Zap,
  MessageCircle,
  Share2,
  Trophy,
  ChevronDown,
  ChevronUp,
  Activity,
  Brain,
  Utensils,
  Moon,
  Droplets,
  Dumbbell
} from 'lucide-react';

/**
 * ActivityCard Component
 * Displays individual friend activity with premium styling and micro-animations
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
      onReaction?.(activity?.id, null);
    } else {
      onReaction?.(activity?.id, type);
    }
  };

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (commentText?.trim()) {
      onComment?.(activity?.id, commentText);
      setCommentText('');
    }
  };

  const getActivityConfig = () => {
    switch (activity?.category) {
      case 'fitness':
        return { icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-200' };
      case 'mindset':
        return { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-200' };
      case 'nutrition':
        return { icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-200' };
      case 'sleep':
        return { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50/50', border: 'border-indigo-200' };
      case 'hydration':
        return { icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50/50', border: 'border-cyan-200' };
      default:
        return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-50/50', border: 'border-gray-200' };
    }
  };

  const config = getActivityConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border border-border rounded-xl shadow-subtle overflow-hidden transition-all hover:shadow-moderate"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={activity?.user_profiles?.avatar_url || 'https://ui-avatars.com/api/?name=' + (activity?.user_profiles?.full_name || 'User')}
              alt={activity?.user_profiles?.full_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-subtle ${config.color}`}>
              <Icon size={12} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {activity?.user_profiles?.full_name || 'Anonymous User'}
              </h3>
              {activity?.points > 0 && (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-100">
                  <Trophy size={10} />
                  +{activity?.points}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mb-4">
          <h4 className="text-lg font-bold text-foreground mb-1 leading-tight">
            {activity?.activity_name}
          </h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium capitalize ${config.bg} ${config.color} border ${config.border}`}>
              {activity?.category}
            </span>
            {activity?.duration_minutes && (
              <span className="text-muted-foreground self-center">
                • {activity?.duration_minutes}m
              </span>
            )}
            {activity?.intensity && (
              <span className="text-muted-foreground self-center">
                • {activity?.intensity} intensity
              </span>
            )}
          </div>
        </div>

        {/* Note/Description */}
        {activity?.notes && (
          <div className="mb-4 text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border border-border/50 italic">
            "{activity?.notes}"
          </div>
        )}

        {/* Achievements */}
        <AnimatePresence>
          {activity?.achievements?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-full bg-amber-200 text-amber-700">
                  <Trophy size={14} />
                </div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Milestone Unlocked</span>
              </div>
              {activity?.achievements?.map((achievement) => (
                <div key={achievement?.id} className="flex items-center gap-3">
                  <div className="text-2xl drop-shadow-sm">{achievement?.icon === 'Trophy' ? '🏆' : achievement?.icon === 'Flame' ? '🔥' : achievement?.icon === 'Zap' ? '⚡️' : '🏅'}</div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">{achievement?.title}</p>
                    <p className="text-xs text-amber-800/80">{achievement?.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions & Reactions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-full">
            <button
              onClick={() => handleReactionClick('congrats')}
              className={`p-2 rounded-full transition-all ${userReaction?.reaction_type === 'congrats'
                ? 'bg-white shadow-sm text-rose-500 scale-110'
                : 'text-muted-foreground hover:text-rose-500 hover:bg-white/50'}`}
              title="Congrats"
            >
              <Heart size={18} fill={userReaction?.reaction_type === 'congrats' ? "currentColor" : "none"} />
              {reactionCounts.congrats > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                  {reactionCounts.congrats}
                </span>
              )}
            </button>
            <button
              onClick={() => handleReactionClick('inspire')}
              className={`p-2 rounded-full transition-all ${userReaction?.reaction_type === 'inspire'
                ? 'bg-white shadow-sm text-amber-500 scale-110'
                : 'text-muted-foreground hover:text-amber-500 hover:bg-white/50'}`}
              title="Inspiring"
            >
              <Flame size={18} fill={userReaction?.reaction_type === 'inspire' ? "currentColor" : "none"} />
              {reactionCounts.inspire > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                  {reactionCounts.inspire}
                </span>
              )}
            </button>
            <button
              onClick={() => handleReactionClick('challenge')}
              className={`p-2 rounded-full transition-all ${userReaction?.reaction_type === 'challenge'
                ? 'bg-white shadow-sm text-blue-500 scale-110'
                : 'text-muted-foreground hover:text-blue-500 hover:bg-white/50'}`}
              title="Challenging"
            >
              <Zap size={18} fill={userReaction?.reaction_type === 'challenge' ? "currentColor" : "none"} />
              {reactionCounts.challenge > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
                  {reactionCounts.challenge}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium text-sm ${showComments ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            <MessageCircle size={16} />
            Comments
          </button>

          <button
            onClick={() => onShare?.(activity)}
            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Comments Input */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e?.target?.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-muted/30 border border-border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText?.trim()}
                  className="bg-primary text-primary-foreground p-2 rounded-full disabled:opacity-50 transition-all hover-lift"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MessageCircle size={20} />
                  </motion.div>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
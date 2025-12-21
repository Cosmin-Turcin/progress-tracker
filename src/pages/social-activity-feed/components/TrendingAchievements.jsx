import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, Trophy } from 'lucide-react';

/**
 * TrendingAchievements Component
 * Displays trending achievements among friends
 */
const TrendingAchievements = ({ achievements }) => {
  if (!achievements || achievements?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Achievements</h3>
        </div>
        <p className="text-gray-500 text-sm text-center py-4">
          No trending achievements yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Trending Achievements</h3>
      </div>
      <div className="space-y-3">
        {achievements?.map((achievement) => (
          <div
            key={achievement?.id}
            className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl">{achievement?.badge_icon || '🏆'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={achievement?.user_profiles?.avatar_url || '/assets/images/no_image.png'}
                  alt={`${achievement?.user_profiles?.full_name || 'User'} profile`}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900 truncate">
                  {achievement?.user_profiles?.full_name || achievement?.user_profiles?.username}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {achievement?.title}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                {achievement?.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Trophy className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(achievement.earned_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAchievements;
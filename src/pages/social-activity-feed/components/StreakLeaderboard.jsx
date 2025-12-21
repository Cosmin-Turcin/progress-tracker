import React from 'react';
import { Flame, Award } from 'lucide-react';

/**
 * StreakLeaderboard Component
 * Displays active streak leaderboard for friends
 */
const StreakLeaderboard = ({ streaks }) => {
  if (!streaks || streaks?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Streak Leaders</h3>
        </div>
        <p className="text-gray-500 text-sm text-center py-4">
          No active streaks yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Streak Leaders</h3>
      </div>
      <div className="space-y-2">
        {streaks?.map((user, index) => (
          <div
            key={user?.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold text-sm">
              {index + 1}
            </div>
            <img
              src={user?.avatar_url || '/assets/images/no_image.png'}
              alt={`${user?.full_name || user?.username} profile`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user?.full_name || user?.username}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Current: {user?.current_streak} days</span>
                {user?.longest_streak > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Best: {user?.longest_streak}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <Flame className="w-5 h-5" />
              <span className="font-bold text-lg">{user?.current_streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakLeaderboard;
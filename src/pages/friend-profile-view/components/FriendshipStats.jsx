import React from 'react';
import { Users, Trophy, Calendar, TrendingUp } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const FriendshipStats = ({ stats, sharedAchievements }) => {
  const friendshipMetrics = [
    {
      icon: Users,
      label: 'Mutual Friends',
      value: stats?.mutualFriendsCount || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Trophy,
      label: 'Shared Achievements',
      value: sharedAchievements?.length || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Calendar,
      label: 'Days as Friends',
      value: Math.floor((new Date() - new Date(stats?.friendship?.created_at)) / (1000 * 60 * 60 * 24)) || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'Challenges Completed',
      value: stats?.challengesCompleted || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Friendship Statistics</h2>
      <div className="grid grid-cols-1 gap-4">
        {friendshipMetrics?.map((metric, index) => {
          const Icon = metric?.icon;

          return (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`${metric?.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${metric?.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{metric?.value}</p>
                <p className="text-sm text-gray-600">{metric?.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Shared Achievements Preview */}
      {sharedAchievements?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Recent Shared Achievements
          </h3>
          <div className="space-y-2">
            {sharedAchievements?.slice(0, 3)?.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
              >
                <Trophy className="w-5 h-5 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {achievement?.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    +{achievement?.points_value || achievement?.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendshipStats;
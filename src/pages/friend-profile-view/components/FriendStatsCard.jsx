import React from 'react';
import { Trophy, Flame, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const FriendStatsCard = ({ stats, userStats }) => {
  const statItems = [
    {
      icon: Trophy,
      label: 'Total Points',
      value: stats?.total_points || 0,
      userValue: userStats?.total_points || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats?.current_streak || 0} days`,
      userValue: `${userStats?.current_streak || 0} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Target,
      label: 'Activities',
      value: stats?.total_activities || 0,
      userValue: userStats?.total_activities || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: stats?.total_achievements || 0,
      userValue: userStats?.total_achievements || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: `${stats?.weekly_points || 0} pts`,
      userValue: `${userStats?.weekly_points || 0} pts`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: `${stats?.monthly_points || 0} pts`,
      userValue: `${userStats?.monthly_points || 0} pts`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const getComparison = (friendValue, userValue) => {
    const friend = typeof friendValue === 'string' ? parseInt(friendValue) : friendValue;
    const user = typeof userValue === 'string' ? parseInt(userValue) : userValue;
    
    if (friend > user) {
      return { text: `${friend - user} ahead`, color: 'text-red-600' };
    } else if (user > friend) {
      return { text: `${user - friend} behind`, color: 'text-green-600' };
    }
    return { text: 'Same level', color: 'text-gray-600' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems?.map((item, index) => {
          const Icon = item?.icon;
          const comparison = getComparison(item?.value, item?.userValue);
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`${item?.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${item?.color}`} />
                </div>
                <span className={`text-xs font-medium ${comparison?.color}`}>
                  {comparison?.text}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{item?.value}</p>
                <p className="text-sm text-gray-600">{item?.label}</p>
                <p className="text-xs text-gray-500">Your: {item?.userValue}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendStatsCard;
import React from 'react';
import { Trophy, Target, Flame, Star } from 'lucide-react';

export default function AchievementStats({ stats }) {
  const statItems = [
    {
      label: 'Total Achievements',
      value: stats?.total || 0,
      icon: Trophy,
      color: 'bg-purple-100 text-purple-600',
      bgGradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Streak Badges',
      value: stats?.streak || 0,
      icon: Flame,
      color: 'bg-orange-100 text-orange-600',
      bgGradient: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Milestones',
      value: stats?.milestone || 0,
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Special Events',
      value: stats?.special || 0,
      icon: Star,
      color: 'bg-pink-100 text-pink-600',
      bgGradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems?.map((item, index) => {
        const IconComponent = item?.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{item?.label}</p>
                <p className="text-3xl font-bold text-gray-800">{item?.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item?.color}`}>
                <IconComponent className="w-8 h-8" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
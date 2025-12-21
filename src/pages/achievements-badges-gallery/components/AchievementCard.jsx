import React from 'react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export default function AchievementCard({ achievement, onCardClick }) {
  const IconComponent = Icons?.[achievement?.icon] || Icons?.Award;

  const getTypeColor = (type) => {
    const colors = {
      streak: 'bg-orange-50 border-orange-200',
      milestone: 'bg-purple-50 border-purple-200',
      goal: 'bg-blue-50 border-blue-200',
      special: 'bg-pink-50 border-pink-200'
    };
    return colors?.[type] || 'bg-gray-50 border-gray-200';
  };

  const getTypeLabel = (type) => {
    const labels = {
      streak: 'Streak',
      milestone: 'Milestone',
      goal: 'Goal',
      special: 'Special Event'
    };
    return labels?.[type] || type;
  };

  return (
    <div
      onClick={() => onCardClick?.(achievement)}
      className={`relative group cursor-pointer rounded-xl border-2 ${getTypeColor(achievement?.achievementType)} p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
    >
      {achievement?.isNew && (
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
          New
        </span>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full ${achievement?.iconColor || 'bg-gradient-to-br from-yellow-400 to-orange-500'} shadow-lg group-hover:animate-bounce`}>
          <IconComponent className="w-12 h-12 text-white" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-800">{achievement?.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{achievement?.description}</p>
        </div>

        <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-500">
            {getTypeLabel(achievement?.achievementType)}
          </span>
          <span className="text-xs text-gray-400">
            {achievement?.achievedAt ? format(new Date(achievement.achievedAt), 'MMM dd, yyyy') : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
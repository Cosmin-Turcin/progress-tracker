import React from 'react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export default function AchievementCard({ achievement, onCardClick, locked }) {
  const IconComponent = Icons?.[achievement?.icon] || Icons?.Award;
  const LockIcon = Icons?.Lock;

  const getTypeColor = (type) => {
    if (locked) return 'bg-gray-50 border-gray-200 opacity-75';
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
      onClick={() => !locked && onCardClick?.(achievement)}
      className={`relative group ${locked ? 'cursor-default' : 'cursor-pointer'} rounded-xl border-2 ${getTypeColor(achievement?.achievementType)} p-6 transition-all duration-300 ${!locked && 'hover:scale-105 hover:shadow-lg'}`}
    >
      {achievement?.isNew && !locked && (
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
          New
        </span>
      )}

      {locked && (
        <div className="absolute top-3 right-3 p-1.5 bg-gray-200 rounded-full text-gray-500">
          <LockIcon className="w-4 h-4" />
        </div>
      )}

      <div className={`flex flex-col items-center space-y-4 ${locked ? 'grayscale' : ''}`}>
        <div className={`p-4 rounded-full ${locked ? 'bg-gray-200' : (achievement?.iconColor || 'bg-gradient-to-br from-yellow-400 to-orange-500')} shadow-lg ${!locked && 'group-hover:animate-bounce'}`}>
          <IconComponent className={`w-12 h-12 ${locked ? 'text-gray-400' : 'text-white'}`} />
        </div>

        <div className="text-center space-y-2">
          <h3 className={`text-lg font-bold ${locked ? 'text-gray-500' : 'text-gray-800'}`}>{achievement?.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {locked ? `How to unlock: ${achievement?.requirement}` : achievement?.description}
          </p>
        </div>

        <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-500">
            {getTypeLabel(achievement?.achievementType)}
          </span>
          <span className="text-xs text-gray-400">
            {achievement?.achievedAt ? format(new Date(achievement.achievedAt), 'MMM dd, yyyy') : (locked ? 'Locked' : '')}
          </span>
        </div>
      </div>
    </div>
  );
}
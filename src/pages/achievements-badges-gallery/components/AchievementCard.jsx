import React from 'react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export default function AchievementCard({ achievement, onCardClick, locked }) {
  const IconComponent = Icons?.[achievement?.icon] || Icons?.Award;
  const LockIcon = Icons?.Lock;

  const getNormalizedType = (type) => {
    if (!type) return 'milestone';
    const t = type.toLowerCase();
    if (t.includes('streak')) return 'streak';
    if (t.includes('milestone') || t.includes('points') || t.includes('first')) return 'milestone';
    if (t.includes('goal')) return 'goal';
    if (t.includes('special') || t.includes('owl') || t.includes('bird')) return 'special';
    return 'milestone'; // Default fallback
  };

  const getCardStyles = (rawType) => {
    if (locked) return 'bg-gray-50 border-gray-200';
    const type = getNormalizedType(rawType);
    const styles = {
      streak: 'bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300 shadow-orange-100',
      milestone: 'bg-gradient-to-br from-purple-100 to-indigo-200 border-purple-300 shadow-purple-100',
      goal: 'bg-gradient-to-br from-blue-100 to-cyan-200 border-blue-300 shadow-blue-100',
      special: 'bg-gradient-to-br from-pink-100 to-rose-200 border-pink-300 shadow-pink-100'
    };
    return styles?.[type] || 'bg-gray-100 border-gray-300';
  };

  const getIconStyles = (rawType) => {
    if (locked) return 'bg-gray-200';
    const type = getNormalizedType(rawType);
    const styles = {
      streak: 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/40 border-4 border-orange-200',
      milestone: 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/40 border-4 border-purple-200',
      goal: 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/40 border-4 border-blue-200',
      special: 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/40 border-4 border-pink-200'
    };
    return styles?.[type] || 'bg-gradient-to-br from-gray-600 to-gray-700';
  };

  const getTypeLabel = (rawType) => {
    const type = getNormalizedType(rawType);
    const labels = {
      streak: 'Streak',
      milestone: 'Milestone',
      goal: 'Goal',
      special: 'Special Event'
    };
    return labels?.[type] || 'Achievement';
  };

  return (
    <div
      onClick={() => !locked && onCardClick?.(achievement)}
      className={`relative group ${locked ? 'cursor-default' : 'cursor-pointer'} rounded-xl border-2 ${getCardStyles(achievement?.achievementType)} p-6 transition-all duration-300 ${!locked && 'hover:scale-105 hover:shadow-lg'}`}
    >
      {achievement?.isNew && !locked && (
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse z-10">
          New
        </span>
      )}

      {locked && (
        <div className="absolute top-3 right-3 p-1.5 bg-gray-200 rounded-full text-gray-500">
          <LockIcon className="w-4 h-4" />
        </div>
      )}

      <div className={`flex flex-col items-center space-y-4 ${locked ? 'grayscale opacity-75' : ''}`}>
        <div className={`p-4 rounded-full ${getIconStyles(achievement?.achievementType)} shadow-xl ${!locked && 'group-hover:scale-110 transition-transform duration-300'} flex items-center justify-center`}>
          <IconComponent className={`w-10 h-10 ${locked ? 'text-gray-400' : 'text-white drop-shadow-md'}`} />
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
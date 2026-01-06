import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AchievementCard from '../../achievements-badges-gallery/components/AchievementCard';

export default function AchievementShowcase({ achievements }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Achievement Gallery</h2>
          <p className="text-gray-600">Your latest unlocked achievements</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {achievements?.length || 0} Total Achievements
        </div>
      </div>

      {achievements?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No achievements yet</p>
          <p className="text-sm text-gray-500 mt-1">Complete activities to unlock achievements</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements?.map((achievement) => (
            <AchievementCard
              key={achievement?.id || achievement?.title}
              achievement={achievement}
              locked={false}
            />
          ))}
        </div>
      )}

      {achievements?.length > 0 && (
        <div className="flex justify-center">
          <Link
            to="/achievements-badges-gallery"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm transition-all duration-200"
          >
            View All Achievements
          </Link>
        </div>
      )}
    </div>
  );
}
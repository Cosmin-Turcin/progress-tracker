import { Award, Trophy, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Icon from '../../../components/AppIcon';


export default function AchievementShowcase({ achievements }) {
  const getIconComponent = (iconName) => {
    const Icon = LucideIcons?.[iconName];
    return Icon || Award;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      streak: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      milestone: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      goal: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      special: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
    };
    return colors?.[type] || colors?.milestone;
  };

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
          {achievements?.map((achievement) => {
            const Icon = getIconComponent(achievement?.icon);
            const colors = getTypeColor(achievement?.achievementType);

            return (
              <div
                key={achievement?.id}
                className={`${colors?.bg} rounded-xl p-6 border ${colors?.border} hover:shadow-lg transition group relative overflow-hidden`}
              >
                {achievement?.isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      <Star className="w-3 h-3" />
                      NEW
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 group-hover:scale-110 transition"
                    style={{ color: achievement?.iconColor || 'currentColor' }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                      {achievement?.title}
                    </h3>
                    <span className={`inline-block px-2 py-1 ${colors?.bg} ${colors?.text} text-xs font-medium rounded-full border ${colors?.border}`}>
                      {achievement?.achievementType}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {achievement?.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Unlocked
                  </span>
                  <span>{formatDate(achievement?.achievedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {achievements?.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => window.location.href = '/achievements-badges-gallery'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            View All Achievements
          </button>
        </div>
      )}
    </div>
  );
}
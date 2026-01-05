import { Award, Trophy, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
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
            // Color mapping logic from Gallery
            const getCardStyles = (type) => {
              const styles = {
                streak: 'bg-orange-50 border-orange-200',
                milestone: 'bg-purple-50 border-purple-200',
                goal: 'bg-blue-50 border-blue-200',
                special: 'bg-pink-50 border-pink-200'
              };
              return styles?.[type] || 'bg-gray-50 border-gray-200';
            };
            const cardStyle = getCardStyles(achievement?.achievementType);

            // Icon Background
            const iconBg = achievement?.iconColor || 'bg-gradient-to-br from-yellow-400 to-orange-500';

            return (
              <div
                key={achievement?.id}
                className={`relative group cursor-pointer rounded-xl border-2 ${cardStyle} p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                {achievement?.isNew && (
                  <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse z-10">
                    New
                  </span>
                )}

                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full ${iconBg} shadow-lg group-hover:animate-bounce text-white`}>
                    <Icon className="w-12 h-12" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{achievement?.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                      {achievement?.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200/60">
                    <span className="text-xs font-medium text-gray-500 capitalize">
                      {achievement?.achievementType}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(achievement?.achievedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
import React, { useState } from 'react';
import { Award, Trophy, Star, Heart, TrendingUp } from 'lucide-react';
import Button from '../../../components/ui/Button';

const AchievementShowcase = ({ achievements, onCongratulate }) => {
  const [filter, setFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const categories = ['all', 'fitness', 'nutrition', 'mindfulness', 'social', 'milestone'];

  const filteredAchievements = achievements?.filter(achievement => {
    if (filter === 'all') return true;
    return achievement?.achievements?.achievement_category === filter;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      fitness: TrendingUp,
      nutrition: Star,
      mindfulness: Heart,
      social: Trophy,
      milestone: Award,
    };
    return icons?.[category] || Award;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Recent Achievements</h2>
        <span className="text-sm text-gray-600">
          {filteredAchievements?.length || 0} unlocked
        </span>
      </div>
      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {categories?.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
          </button>
        ))}
      </div>
      {/* Achievements Grid */}
      {filteredAchievements?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements?.map((achievement, index) => {
            const CategoryIcon = getCategoryIcon(achievement?.achievements?.achievement_category);
            
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAchievement(achievement)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <CategoryIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    {achievement?.achievements?.points_value} pts
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {achievement?.achievements?.achievement_name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {achievement?.achievements?.achievement_description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(achievement?.unlocked_at)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onCongratulate(achievement?.achievement_id);
                    }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Heart className="w-3 h-3" />
                    Congrats
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No achievements in this category yet</p>
        </div>
      )}
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedAchievement?.achievements?.achievement_name}
              </h3>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {selectedAchievement?.achievements?.achievement_description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Unlocked: {formatDate(selectedAchievement?.unlocked_at)}
              </span>
              <Button
                onClick={() => {
                  onCongratulate(selectedAchievement?.achievement_id);
                  setSelectedAchievement(null);
                }}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Congratulate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementShowcase;
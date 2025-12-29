import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { achievementService } from '../../services/achievementService';
import { ACHIEVEMENT_DEFINITIONS } from '../../data/achievementDefinitions';
import { Trophy, Sparkles } from 'lucide-react';
import AchievementCard from './components/AchievementCard';
import AchievementModal from './components/AchievementModal';
import AchievementStats from './components/AchievementStats';
import FilterBar from './components/FilterBar';
import Header from '../../components/Header';

export default function AchievementsBadgesGallery() {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadAchievements();
    loadStats();
  }, []);

  useEffect(() => {
    filterAchievements();
  }, [allAchievements, searchQuery, selectedType]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const earned = await achievementService?.getAll();
      setEarnedAchievements(earned || []);

      // Merge with master list
      const merged = ACHIEVEMENT_DEFINITIONS?.map(def => {
        const earnedMatch = earned?.find(e => {
          // Attempt to match by type if it's a specific badge (e.g. streak_7) 
          // or fallback to title matching for legacy 
          return e?.achievementType === def?.id || e?.title === def?.title;
        });

        if (earnedMatch) {
          return { ...earnedMatch, requirement: def?.requirement, isLocked: false };
        }
        return { ...def, isLocked: true };
      });

      setAllAchievements(merged);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await achievementService?.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const filterAchievements = () => {
    let filtered = [...allAchievements];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered?.filter(a => a?.achievementType === selectedType);
    }

    // Filter by search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(a =>
        a?.title?.toLowerCase()?.includes(query) ||
        a?.description?.toLowerCase()?.includes(query) ||
        a?.requirement?.toLowerCase()?.includes(query)
      );
    }

    setFilteredAchievements(filtered);
  };

  const handleCardClick = async (achievement) => {
    setSelectedAchievement(achievement);
    if (achievement?.isNew) {
      try {
        await achievementService?.markAsViewed(achievement?.id);
        // Update local state
        setAllAchievements(prev =>
          prev?.map(a => a?.id === achievement?.id ? { ...a, isNew: false } : a)
        );
      } catch (err) {
        console.error('Failed to mark as viewed:', err);
      }
    }
  };

  const handleShare = (achievement) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Copy to clipboard as fallback
    const text = `I just earned: ${achievement?.title}! ${achievement?.description}`;
    navigator.clipboard?.writeText(text)?.catch(() => { });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Achievements - Progress Tracker</title>
      </Helmet>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-800">Achievements Gallery</h1>
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <p className="text-lg text-gray-600">
              Celebrate your progress and milestones
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              <p className="font-medium">Error loading achievements</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Statistics */}
          <AchievementStats stats={stats} />

          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            achievementCounts={stats}
          />

          {/* Achievements Grid */}
          {filteredAchievements?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery || selectedType !== 'all' ? 'No achievements match your filters' : 'No achievements yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery || selectedType !== 'all' ? 'Try adjusting your search or filters' : 'Keep logging activities to unlock achievements!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAchievements?.map((achievement) => (
                <AchievementCard
                  key={achievement?.id || achievement?.title}
                  achievement={achievement}
                  onCardClick={handleCardClick}
                  locked={achievement?.isLocked}
                />
              ))}
            </div>
          )}

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
                🎉
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
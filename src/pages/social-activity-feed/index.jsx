import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { RefreshCw, Bell, BellOff, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import socialFeedService from '../../services/socialFeedService';
import FeedFilters from './components/FeedFilters';
import ActivityCard from './components/ActivityCard';
import TrendingAchievements from './components/TrendingAchievements';
import StreakLeaderboard from './components/StreakLeaderboard';

/**
 * SocialActivityFeed Page
 * Main page component for displaying friend activities in real-time
 */
const SocialActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [reactions, setReactions] = useState({});
  const [trendingAchievements, setTrendingAchievements] = useState([]);
  const [streakLeaderboard, setStreakLeaderboard] = useState([]);
  const [filters, setFilters] = useState({
    friendType: 'all',
    activityType: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  // Fetch friend activities
  const fetchActivities = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      const result = await socialFeedService?.getFriendActivities(
        user?.id,
        filters,
        20,
        currentOffset
      );

      if (reset) {
        setActivities(result?.activities);
        setOffset(20);
      } else {
        setActivities(prev => [...prev, ...result?.activities]);
        setOffset(prev => prev + 20);
      }

      setHasMore(result?.hasMore);

      // Fetch reactions for activities
      const activityIds = result?.activities?.map(a => a?.id);
      if (activityIds?.length > 0) {
        const reactionsData = await socialFeedService?.getReactions(activityIds);
        setReactions(prev => ({ ...prev, ...reactionsData }));
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err?.message);
    }
  }, [user?.id, filters, offset]);

  // Fetch trending achievements
  const fetchTrendingAchievements = useCallback(async () => {
    try {
      const data = await socialFeedService?.getTrendingAchievements(user?.id);
      setTrendingAchievements(data);
    } catch (err) {
      console.error('Error fetching trending achievements:', err);
    }
  }, [user?.id]);

  // Fetch streak leaderboard
  const fetchStreakLeaderboard = useCallback(async () => {
    try {
      const data = await socialFeedService?.getStreakLeaderboard(user?.id);
      setStreakLeaderboard(data);
    } catch (err) {
      console.error('Error fetching streak leaderboard:', err);
    }
  }, [user?.id]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchActivities(true),
        fetchTrendingAchievements(),
        fetchStreakLeaderboard()
      ]);
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id, filters]);

  // Real-time subscriptions
  useEffect(() => {
    if (!realtimeEnabled || !user?.id) return;

    const unsubscribeActivities = socialFeedService?.subscribeFriendActivities(
      user?.id,
      (newActivity) => {
        setActivities(prev => [newActivity, ...prev]);
      }
    );

    const unsubscribeAchievements = socialFeedService?.subscribeFriendAchievements(
      user?.id,
      (newAchievement) => {
        setTrendingAchievements(prev => [newAchievement, ...prev?.slice(0, 4)]);
      }
    );

    return () => {
      unsubscribeActivities();
      unsubscribeAchievements();
    };
  }, [realtimeEnabled, user?.id]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchActivities(true),
      fetchTrendingAchievements(),
      fetchStreakLeaderboard()
    ]);
    setRefreshing(false);
  };

  // Handle reaction
  const handleReaction = async (activityId, reactionType) => {
    try {
      if (reactionType) {
        await socialFeedService?.addReaction(activityId, user?.id, reactionType);
      } else {
        await socialFeedService?.removeReaction(activityId, user?.id);
      }

      // Refresh reactions
      const reactionsData = await socialFeedService?.getReactions([activityId]);
      setReactions(prev => ({ ...prev, ...reactionsData }));
    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };

  // Handle comment
  const handleComment = async (activityId, content) => {
    try {
      await socialFeedService?.addComment(activityId, user?.id, content);
      // Could fetch and display comments here
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle share
  const handleShare = (activity) => {
    // Implement share functionality
    console.log('Share activity:', activity);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Social Activity Feed - HealthTrack</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Social Activity Feed
                </h1>
                <p className="text-gray-600 text-sm">
                  Stay connected with your friends' health journey
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    realtimeEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {realtimeEnabled ? (
                    <>
                      <Bell className="w-4 h-4" />
                      Live
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4" />
                      Paused
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <FeedFilters filters={filters} onFilterChange={setFilters} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Activity Feed - 8 columns */}
            <div className="lg:col-span-8 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {activities?.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">
                    No activities to show. Add some friends to see their activities!
                  </p>
                </div>
              ) : (
                <>
                  {activities?.map((activity) => (
                    <ActivityCard
                      key={activity?.id}
                      activity={activity}
                      reactions={reactions?.[activity?.id] || []}
                      currentUserId={user?.id}
                      onReaction={handleReaction}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center py-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <TrendingAchievements achievements={trendingAchievements} />
              <StreakLeaderboard streaks={streakLeaderboard} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialActivityFeed;
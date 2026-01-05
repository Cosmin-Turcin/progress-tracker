import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Bell,
  BellOff,
  Loader2,
  Users,
  Activity as ActivityIcon,
  Trophy,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socialFeedService from '../../services/socialFeedService';
import FeedFilters from './components/FeedFilters';
import ActivityCard from './components/ActivityCard';
import TrendingAchievements from './components/TrendingAchievements';
import StreakLeaderboard from './components/StreakLeaderboard';
import Header from '../../components/Header';

/**
 * SocialActivityFeed Page
 * Premium real-time feed for friend interactions and achievements
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
        15,
        currentOffset
      );

      if (reset) {
        setActivities(result?.activities || []);
        setOffset(15);
      } else {
        setActivities(prev => [...prev, ...(result?.activities || [])]);
        setOffset(prev => prev + 15);
      }

      setHasMore(result?.hasMore);

      // Fetch reactions for activities
      const activityIds = (result?.activities || [])?.map(a => a?.id);
      if (activityIds?.length > 0) {
        const reactionsData = await socialFeedService?.getReactions(activityIds);
        setReactions(prev => ({ ...prev, ...reactionsData }));
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Could not load activity feed. Please try again later.');
    }
  }, [user?.id, filters, offset]);

  // Fetch trending achievements
  const fetchTrendingAchievements = useCallback(async () => {
    try {
      const data = await socialFeedService?.getTrendingAchievements(user?.id);
      setTrendingAchievements(data || []);
    } catch (err) {
      console.error('Error fetching trending achievements:', err);
    }
  }, [user?.id]);

  // Fetch streak leaderboard
  const fetchStreakLeaderboard = useCallback(async () => {
    try {
      const data = await socialFeedService?.getStreakLeaderboard(user?.id);
      setStreakLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching streak leaderboard:', err);
    }
  }, [user?.id]);

  // Initial and filtered data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
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
  }, [user?.id, filters.activityType, filters.friendType]);

  // Real-time subscriptions
  useEffect(() => {
    if (!realtimeEnabled || !user?.id) return;

    const unsubscribeActivities = socialFeedService?.subscribeFriendActivities(
      user?.id,
      (newActivity) => {
        setActivities(prev => [newActivity, ...prev]);
        // Immediately fetch reactions for new activity (will be empty)
        setReactions(prev => ({ ...prev, [newActivity.id]: [] }));
      }
    );

    const unsubscribeAchievements = socialFeedService?.subscribeFriendAchievements(
      user?.id,
      (newAchievement) => {
        setTrendingAchievements(prev => [newAchievement, ...prev?.slice(0, 4)]);
      }
    );

    return () => {
      if (unsubscribeActivities) unsubscribeActivities();
      if (unsubscribeAchievements) unsubscribeAchievements();
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

      // Refresh reactions for this specific activity
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
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Curating your social feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Social Activity Feed | HealthTrack</title>
      </Helmet>

      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Hero */}
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Feed</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Social Activity
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg">
                Stay updated with your community's progress. High-five achievements, comment on workouts, and stay inspired.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${realtimeEnabled
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {realtimeEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                {realtimeEnabled ? 'Real-time On' : 'Real-time Paused'}
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 rounded-xl bg-white border border-border text-foreground hover:bg-muted transition-all active-press"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Decorative Background Icon */}
          <ActivityIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-primary/5 rotate-12 pointer-events-none" />
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <FeedFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="popLayout">
              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-6 text-center"
                >
                  <p className="font-semibold mb-2">{error}</p>
                  <button onClick={handleRefresh} className="text-sm underline font-bold">Try again</button>
                </motion.div>
              ) : activities?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-border rounded-2xl p-12 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Users className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your feed is looking quiet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Connect with more friends to see their daily activities and achievements here.
                  </p>
                  <Link
                    to="/friends-leaderboard"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover-lift"
                  >
                    Find Friends <ArrowRight size={18} />
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {activities?.map((activity, index) => (
                    <ActivityCard
                      key={activity?.id || index}
                      activity={activity}
                      reactions={reactions?.[activity?.id] || []}
                      currentUserId={user?.id}
                      onReaction={handleReaction}
                      onComment={handleComment}
                      onShare={(act) => console.log('Share:', act)}
                    />
                  ))}

                  {/* Infinite Load Status */}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more activities'}
                      </button>
                    </div>
                  )}

                  {!hasMore && activities.length > 0 && (
                    <p className="text-center text-muted-foreground text-sm py-8 italic">
                      You've reached the end of the feed. Time to log your own activity!
                    </p>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <section className="bg-card border border-border rounded-2xl p-1 overflow-hidden shadow-subtle">
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-amber-500" size={18} />
                    <h2 className="font-bold">Trending Stats</h2>
                  </div>
                </div>
                <div className="p-4 space-y-6">
                  <TrendingAchievements achievements={trendingAchievements} />
                  <div className="h-px bg-border" />
                  <StreakLeaderboard streaks={streakLeaderboard} />
                </div>
              </section>

              {/* Quick Navigation / CTA */}
              <div className="bg-gradient-to-br from-indigo-600 to-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Direct Messaging
                </h3>
                <p className="text-white/80 text-xs mb-4">
                  Chat privately with your friends to coordinate workouts or share tips.
                </p>
                <Link
                  to="/direct-messaging"
                  className="flex items-center justify-center w-full py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold hover:bg-white/30 transition-all border border-white/10"
                >
                  Go to Messages
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SocialActivityFeed;
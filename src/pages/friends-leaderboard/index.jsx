import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Trophy, UserPlus, Globe, Clock, Search, Activity as ActivityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { friendService } from '../../services/friendService';
import { realtimeService } from '../../services/realtimeService';
import { LeaderboardCard } from './components/LeaderboardCard';
import { LeaderboardFilters } from './components/LeaderboardFilters';
import { SearchFriends } from './components/SearchFriends';
import { CurrentUserStats } from './components/CurrentUserStats';
import { RequestsList } from './components/RequestsList';
import Header from '../../components/Header';

const TABS = [
  { id: 'global', label: 'Global Rankings', icon: Globe },
  { id: 'friends', label: 'Your Friends', icon: Users },
  { id: 'requests', label: 'Requests', icon: Clock }
];

export default function FriendsLeaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [refreshing, setRefreshing] = useState(false);

  const currentUserStats = leaderboard?.find(item => item?.userId === user?.id);

  useEffect(() => {
    loadData();
    loadPendingCount();
  }, [activeTab, selectedPeriod, user?.id]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Listen for friend-related changes
    const unsubFriends = realtimeService?.subscribeToFriendsActivities(user?.id, [], () => {
      if (activeTab === 'friends') loadData();
    });

    // Listen for new friend requests
    const unsubRequests = realtimeService?.subscribeToFriendRequests(user?.id, () => {
      loadPendingCount();
      if (activeTab === 'requests') loadData();
    });

    return () => {
      if (unsubFriends) unsubFriends();
      if (unsubRequests) unsubRequests();
    };
  }, [user?.id, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      let data = [];
      if (activeTab === 'global') {
        data = await friendService?.getGlobalLeaderboard(selectedPeriod);
      } else if (activeTab === 'friends') {
        data = await friendService?.getFriendsLeaderboard(selectedPeriod);
      }
      setLeaderboard(data);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCount = async () => {
    try {
      const requests = await friendService?.getPendingRequests();
      setPendingCount(requests?.length || 0);
    } catch (err) {
      console.error('Error loading pending count:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadPendingCount()]);
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Social Hub</h1>
            </div>
            <p className="text-muted-foreground font-medium text-lg">Compete with friends and the global community.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/social-activity-feed"
              className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 font-black text-[10px] tracking-widest uppercase"
            >
              <ActivityIcon className="w-4 h-4" />
              Activity Feed
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-3 bg-card border-2 border-border rounded-2xl shadow-sm hover:shadow-moderate transition-all flex items-center gap-2 font-black text-[10px] tracking-widest uppercase"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
          </div>
        </div>

        {/* Global Summary & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <CurrentUserStats userStats={currentUserStats} />
          </div>
          <div className="flex flex-col gap-4">
            <SearchFriends />
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex items-center gap-2 mb-8 bg-card p-1.5 rounded-2xl border-2 border-border w-fit">
          {TABS?.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                <span className="font-black text-[10px] tracking-widest uppercase">{tab.label}</span>
                {tab.id === 'requests' && pendingCount > 0 && (
                  <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full border-2 ${isActive ? 'bg-white text-primary border-primary' : 'bg-primary text-white border-white'
                    }`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {activeTab !== 'requests' && (
            <div className="lg:col-span-1">
              <LeaderboardFilters
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          )}

          <div className={activeTab === 'requests' ? 'lg:col-span-4' : 'lg:col-span-3'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-3xl border-2 border-border shadow-sm p-6 md:p-8"
              >
                {activeTab === 'requests' ? (
                  <RequestsList onUpdate={loadPendingCount} />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                        {activeTab === 'global' ? 'Global Hall of Fame' : 'Friends Circle'}
                      </h2>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {leaderboard?.length} COMPETITORS
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Calculating Rankings...</p>
                      </div>
                    ) : leaderboard?.length === 0 ? (
                      <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                        <Trophy className="w-16 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-foreground uppercase mb-2">No Rankings Found</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">
                          {activeTab === 'friends'
                            ? "It's quiet in here. Search for some friends to start competing!"
                            : "Be the first to claim the top spot of the season!"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leaderboard?.map((item) => (
                          <LeaderboardCard
                            key={item?.userId}
                            friend={item}
                            currentUserId={user?.id}
                            onUpdate={loadData}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
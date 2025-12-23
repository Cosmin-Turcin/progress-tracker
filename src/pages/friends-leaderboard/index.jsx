import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { friendService } from '../../services/friendService';
import { realtimeService } from '../../services/realtimeService';
import { LeaderboardCard } from './components/LeaderboardCard';
import { LeaderboardFilters } from './components/LeaderboardFilters';
import { SearchFriends } from './components/SearchFriends';
import { CurrentUserStats } from './components/CurrentUserStats';
import Header from '../../components/Header';

export default function FriendsLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [refreshing, setRefreshing] = useState(false);

  const currentUserStats = leaderboard?.find(friend => friend?.userId === user?.id);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedPeriod]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id || leaderboard?.length === 0) return;

    // Get friend IDs from leaderboard
    const friendIds = leaderboard
      ?.filter(friend => friend?.userId !== user?.id)
      ?.map(friend => friend?.userId);

    console.log('Setting up real-time subscriptions for friends:', friendIds);

    // Subscribe to friends' activities for instant leaderboard updates
    const unsubscribe = realtimeService?.subscribeToFriendsActivities(
      user?.id,
      friendIds,
      (update) => {
        console.log('Real-time friend update:', update);
        // Refresh leaderboard when any friend activity changes
        loadLeaderboard();
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, leaderboard]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await friendService?.getFriendsLeaderboard(selectedPeriod);
      setLeaderboard(data);
    } catch (err) {
      setError(err?.message || 'Failed to load leaderboard');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadLeaderboard();
    } catch (err) {
      setError(err?.message || 'Failed to refresh leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Friends Leaderboard</h1>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CurrentUserStats userStats={currentUserStats} />
          </div>

          <div className="space-y-4">
            <SearchFriends />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LeaderboardFilters
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rankings</h2>

              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading leaderboard...</div>
              ) : leaderboard?.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p className="mb-2">No friends in your leaderboard yet.</p>
                  <p className="text-sm">Search and add friends to see rankings!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard?.map((friend) => (
                    <LeaderboardCard
                      key={friend?.userId}
                      friend={friend}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
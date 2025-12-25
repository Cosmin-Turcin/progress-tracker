import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { achievementService } from '../../services/achievementService';
import { activityService } from '../../services/activityService';
import { friendService } from '../../services/friendService';
import { authService } from '../../services/authService';
import { realtimeService } from '../../services/realtimeService';
import Header from '../../components/Header';
import { Award, TrendingUp, Activity, Target, Users, Loader, AlertCircle, X, Briefcase } from 'lucide-react';
import ProfileHeader from './components/ProfileHeader';
import StatsGrid from './components/StatsGrid';
import AchievementShowcase from './components/AchievementShowcase';
import ActivityTimeline from './components/ActivityTimeline';
import FriendRequestPanel from './components/FriendRequestPanel';
import ProfileCustomization from './components/ProfileCustomization';
import ProfessionalTab from './components/ProfessionalTab';

export default function UserProfile() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  // Data states
  const [statistics, setStatistics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // UI states
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  // Set up real-time subscriptions for instant updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions for user profile');

    // Subscribe to user statistics changes (streaks)
    const unsubStats = realtimeService?.subscribeToStatistics(user?.id, (stats) => {
      console.log('Real-time: Statistics updated', stats);
      setStatistics(stats);
    });

    // Subscribe to achievements
    const unsubAchievements = realtimeService?.subscribeToAchievements(user?.id, (achievement) => {
      console.log('Real-time: New achievement unlocked!', achievement);
      setAchievements(prev => [achievement, ...(prev || [])]);
      // Show notification
      if (achievement?.title) {
        alert(`🎉 Achievement Unlocked: ${achievement?.title}!`);
      }
    });

    // Subscribe to activities
    const unsubActivities = realtimeService?.subscribeToActivities(user?.id, {
      onInsert: (activity) => {
        console.log('Real-time: New activity logged', activity);
        setRecentActivities(prev => [activity, ...(prev || [])]?.slice(0, 10));
      },
      onUpdate: (activity) => {
        console.log('Real-time: Activity updated', activity);
        setRecentActivities(prev =>
          prev?.map(a => a?.id === activity?.id ? activity : a)
        );
      },
      onDelete: (activity) => {
        console.log('Real-time: Activity deleted', activity);
        setRecentActivities(prev =>
          prev?.filter(a => a?.id !== activity?.id)
        );
      }
    });

    // Subscribe to friendships
    const unsubFriendships = realtimeService?.subscribeToFriendships(user?.id, (update) => {
      console.log('Real-time: Friendships changed', update);
      loadProfileData(); // Refresh friend data
    });

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubStats) unsubStats();
      if (unsubAchievements) unsubAchievements();
      if (unsubActivities) unsubActivities();
      if (unsubFriendships) unsubFriendships();
    };
  }, [user?.id]);

  const loadProfileData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [stats, achievementsList, activities, requests, friendsList] = await Promise.all([
        authService?.getStatistics(user?.id),
        achievementService?.getAll(),
        activityService?.getByDateRange(
          user?.id,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date()
        ),
        friendService?.getPendingRequests(),
        friendService?.getFriends()
      ]);

      setStatistics(stats);
      setAchievements(achievementsList?.slice(0, 6) || []);
      setRecentActivities(activities?.slice(0, 10) || []);
      setPendingRequests(requests || []);
      setFriends(friendsList || []);
    } catch (err) {
      setError(err?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService?.acceptFriendRequest(requestId);
      await loadProfileData();
    } catch (err) {
      setError(err?.message || 'Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await friendService?.declineFriendRequest(requestId);
      await loadProfileData();
    } catch (err) {
      setError(err?.message || 'Failed to decline friend request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'timeline', label: 'Activity Timeline', icon: Activity },
    { id: 'friends', label: 'Friends', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <ProfileHeader
          profile={profile}
          user={user}
          onCustomize={() => setShowCustomization(true)}
          friendCount={friends?.length || 0}
        />

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab?.id
                    ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'stats' && (
              <StatsGrid statistics={statistics} />
            )}

            {activeTab === 'professional' && (
              <ProfessionalTab targetProfile={profile} />
            )}

            {activeTab === 'achievements' && (
              <AchievementShowcase
                achievements={achievements}
                onCongratulate={() => { }}
              />
            )}

            {activeTab === 'timeline' && (
              <ActivityTimeline activities={recentActivities} />
            )}

            {activeTab === 'friends' && (
              <FriendRequestPanel
                pendingRequests={pendingRequests}
                friends={friends}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            )}
          </div>
        </div>

        {statistics && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 opacity-80" />
                <span className="text-sm opacity-90">Total Score</span>
              </div>
              <p className="text-4xl font-bold">{statistics?.total_points || 0}</p>
              <p className="text-sm opacity-90 mt-2">Points earned</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-sm opacity-90">Current Streak</span>
              </div>
              <p className="text-4xl font-bold">{statistics?.current_streak || 0}</p>
              <p className="text-sm opacity-90 mt-2">Days in a row</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 opacity-80" />
                <span className="text-sm opacity-90">Achievements</span>
              </div>
              <p className="text-4xl font-bold">{statistics?.achievements_unlocked || 0}</p>
              <p className="text-sm opacity-90 mt-2">Unlocked badges</p>
            </div>
          </div>
        )}
      </div>
      {showCustomization && (
        <ProfileCustomization
          onClose={() => setShowCustomization(false)}
          onSave={() => {
            setShowCustomization(false);
            loadProfileData();
          }}
        />
      )}
    </div>
  );
}
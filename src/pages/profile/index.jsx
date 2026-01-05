import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { achievementService } from '../../services/achievementService';
import { activityService } from '../../services/activityService';
import { friendService } from '../../services/friendService';
import { authService } from '../../services/authService';
import { realtimeService } from '../../services/realtimeService';
import Header from '../../components/Header';
import {
  Award, TrendingUp, Activity, Target, Users,
  Loader, AlertCircle, X, Briefcase, Layout
} from 'lucide-react';

// Unified Components
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import AchievementShowcase from './components/AchievementShowcase';
import ActivityTimeline from './components/ActivityTimeline';
import FriendRequestPanel from './components/FriendRequestPanel';
import ProfileCustomization from './components/ProfileCustomization';
import ProfessionalTab from './components/ProfessionalTab';
import FriendshipStats from './components/FriendshipStats';
import QuickChallengePanel from './components/QuickChallengePanel';
import AchievementOverlay from '../../components/ui/AchievementOverlay';

export default function Profile({ resolvedUserId }) {
  const { userId: paramId, username: paramUsername } = useParams();
  const { user: currentUser, profile: currentUserProfile } = useAuth();

  // Determine whose profile we are looking at
  const [targetUserId, setTargetUserId] = useState(resolvedUserId);
  const isOwnProfile = !targetUserId || targetUserId === currentUser?.id;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [profileData, setProfileData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendship, setFriendship] = useState(null);
  const [sharedAchievements, setSharedAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null); // Comparison stats

  // UI states
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Resolve targetUserId from params if not provided via props
  useEffect(() => {
    const resolveTarget = async () => {
      if (resolvedUserId) {
        setTargetUserId(resolvedUserId);
        return;
      }

      if (paramUsername) {
        try {
          const resolved = await friendService?.getProfileByUsername(paramUsername);
          if (resolved) {
            setTargetUserId(resolved.id);
          } else {
            setError('User not found');
            setLoading(false);
          }
        } catch (err) {
          setError('Failed to resolve user');
          setLoading(false);
        }
      } else if (paramId) {
        setTargetUserId(paramId);
      } else {
        // Own profile
        setTargetUserId(currentUser?.id);
      }
    };

    resolveTarget();
  }, [paramId, paramUsername, resolvedUserId, currentUser]);

  // 2. Load data whenever targetUserId changes
  useEffect(() => {
    if (targetUserId) {
      loadProfileData();
    }
  }, [targetUserId]);

  // 3. Real-time subscriptions
  useEffect(() => {
    if (!targetUserId) return;

    // Subscriptions only for stats, achievements, and activities
    const unsubStats = realtimeService?.subscribeToStatistics(targetUserId, (stats) => {
      setStatistics(stats);
    });

    const unsubAchievements = realtimeService?.subscribeToAchievements(targetUserId, (achievement) => {
      setAchievements(prev => [achievement, ...(prev || [])]);
      if (isOwnProfile) setShowAchievement(achievement);
    });

    const unsubActivities = realtimeService?.subscribeToActivities(targetUserId, {
      onInsert: (activity) => {
        setRecentActivities(prev => [activity, ...(prev || [])]?.slice(0, 10));
      }
    });

    return () => {
      if (unsubStats) unsubStats();
      if (unsubAchievements) unsubAchievements();
      if (unsubActivities) unsubActivities();
    };
  }, [targetUserId, isOwnProfile]);

  const loadProfileData = async () => {
    setLoading(true);
    setError('');

    try {
      if (isOwnProfile) {
        // Load personal profile data
        const [stats, achievementsList, activities, requests, friendsList] = await Promise.all([
          authService?.getStatistics(targetUserId),
          achievementService?.getAll(),
          activityService?.getByDateRange(
            targetUserId,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
            new Date()
          ),
          friendService?.getPendingRequests(),
          friendService?.getFriends()
        ]);

        setProfileData(currentUserProfile);
        setStatistics(stats);
        setAchievements(achievementsList || []);
        setRecentActivities(activities || []);
        setPendingRequests(requests || []);
        setFriends(friendsList || []);
      } else {
        // Load public profile data
        const [publicData, shared, currentStats] = await Promise.all([
          friendService?.getFriendProfile(targetUserId),
          friendService?.getSharedAchievements(targetUserId),
          currentUser?.id ? authService?.getStatistics(currentUser.id) : null
        ]);

        setProfileData(publicData?.profile);
        setStatistics(publicData?.stats);
        setFriendship(publicData?.friendship);
        setAchievements(publicData?.achievements || []);
        setRecentActivities(publicData?.activities || []);
        setSharedAchievements(shared || []);
        setUserStats(currentStats);
        setFriends(publicData?.friends || []); // Assuming friendship service provides this or just count
      }
    } catch (err) {
      console.error('Error loading profile:', err);
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

  const handleUnfriend = async () => {
    if (!window.confirm(`Are you sure you want to remove ${profileData?.full_name} from your friends?`)) {
      return;
    }
    try {
      await friendService?.removeFriend(targetUserId);
      setSuccessMessage('Friend removed successfully');
      setTimeout(() => navigate('/friends-leaderboard'), 2000);
    } catch (err) {
      setError(err?.message || 'Failed to remove friend');
    }
  };

  const handleMessage = () => {
    navigate('/direct-messaging', {
      state: {
        friendId: targetUserId,
        friendName: profileData?.full_name,
        friendAvatar: profileData?.avatar_url
      }
    });
  };

  const handleSendChallenge = async (challengeData) => {
    try {
      await friendService?.sendChallenge(targetUserId, challengeData);
      setSuccessMessage(`Challenge sent to ${profileData?.full_name}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to send challenge');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center p-20">
          <div className="text-center">
            <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center shadow-sm">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        <ProfileHeader
          profile={profileData}
          user={isOwnProfile ? currentUser : { email: 'hidden' }}
          isOwnProfile={isOwnProfile}
          friendship={friendship}
          onCustomize={() => setShowCustomization(true)}
          onUnfriend={handleUnfriend}
          onMessage={handleMessage}
          onChallenge={() => { }} // Remove tab switching logic
          isUnlogged={!currentUser}
          friendCount={friends?.length || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-12">
              {/* Statistics Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
                </div>
                <ProfileStats
                  stats={statistics}
                  userStats={userStats}
                  isOwnProfile={isOwnProfile}
                />
              </section>

              {/* Achievements Section */}
              <section className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Achievements Showcase</h3>
                </div>
                <AchievementShowcase
                  achievements={achievements}
                  onCongratulate={(id) => {
                    if (!isOwnProfile) friendService?.congratulateFriend(targetUserId, id);
                  }}
                />
              </section>

              {/* Professional Section */}
              <section className="pt-8 border-t border-gray-100">
                <ProfessionalTab targetProfile={profileData} isReadOnly={!isOwnProfile} embedded={true} />
              </section>

              {/* Social/Friends Section */}
              <section className="pt-8 border-t border-gray-100">
                <FriendRequestPanel
                  pendingRequests={pendingRequests}
                  friends={friends}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                  isReadOnly={!isOwnProfile}
                />
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {!isOwnProfile && currentUser && (
              <QuickChallengePanel
                onSendChallenge={handleSendChallenge}
                friendName={profileData?.full_name}
              />
            )}

            {!isOwnProfile && (
              <FriendshipStats
                stats={{
                  mutualFriendsCount: profileData?.mutual_friends_count,
                  friendship: friendship,
                  challengesCompleted: statistics?.challenges_completed
                }}
                sharedAchievements={sharedAchievements}
              />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <ActivityTimeline activities={recentActivities} compact={true} />
            </div>

            {isOwnProfile && (
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Grow your circle</h3>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                  Connect with more friends to compare progress and stay motivated together!
                </p>
                <button
                  onClick={() => navigate('/friends-leaderboard')}
                  className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-md"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        </div>
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

      <AchievementOverlay
        achievement={showAchievement}
        onClose={() => setShowAchievement(null)}
      />
    </div>
  );
}
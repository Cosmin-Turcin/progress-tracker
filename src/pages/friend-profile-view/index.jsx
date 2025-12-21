import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '../../components/Header';
import FriendProfileHeader from './components/FriendProfileHeader';
import FriendStatsCard from './components/FriendStatsCard';
import AchievementShowcase from './components/AchievementShowcase';
import ActivityTimeline from './components/ActivityTimeline';
import FriendshipStats from './components/FriendshipStats';
import QuickChallengePanel from './components/QuickChallengePanel';
import { 
  getFriendProfile, 
  getSharedAchievements, 
  sendChallenge, 
  congratulateFriend,
  removeFriend 
} from '../../services/friendService';

const FriendProfileView = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const [sharedAchievements, setSharedAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadFriendProfile();
  }, [friendId]);

  const loadFriendProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load friend profile data
      const profileData = await getFriendProfile(friendId);
      setFriendData(profileData);

      // Load shared achievements
      const shared = await getSharedAchievements(friendId);
      setSharedAchievements(shared);

      // Load current user stats for comparison (would need to be implemented)
      // const currentUserStats = await getUserStats();
      // setUserStats(currentUserStats);

    } catch (err) {
      console.error('Error loading friend profile:', err);
      setError(err?.message || 'Failed to load friend profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!window.confirm(`Are you sure you want to remove ${friendData?.profile?.display_name} from your friends?`)) {
      return;
    }

    try {
      await removeFriend(friendId);
      setSuccessMessage('Friend removed successfully');
      setTimeout(() => {
        navigate('/friends-leaderboard');
      }, 2000);
    } catch (err) {
      setError(err?.message || 'Failed to remove friend');
    }
  };

  const handleMessage = () => {
    // Navigate to direct messaging with friend data
    const friendName = friendData?.profile?.display_name || friendData?.profile?.full_name || 'this friend';
    const friendUserId = friendData?.profile?.user_id || friendId;
    
    navigate('/direct-messaging', {
      state: {
        friendId: friendUserId,
        friendName: friendName,
        friendAvatar: friendData?.profile?.avatar_url
      }
    });
  };

  const handleSendChallenge = async (challengeData) => {
    try {
      await sendChallenge(friendId, challengeData);
      setSuccessMessage(`Challenge sent to ${friendData?.profile?.display_name}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to send challenge');
    }
  };

  const handleCongratulate = async (achievementId) => {
    try {
      await congratulateFriend(friendId, achievementId);
      setSuccessMessage('Congratulations sent!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to send congratulations');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading friend profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/friends-leaderboard')}
              className="text-blue-600 hover:underline"
            >
              Back to Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center">{successMessage}</p>
          </div>
        )}

        {/* Profile Header */}
        <FriendProfileHeader
          profile={friendData?.profile}
          friendship={friendData?.friendship}
          onUnfriend={handleUnfriend}
          onMessage={handleMessage}
          onChallenge={() => handleSendChallenge({ type: 'quick', details: 'Quick challenge' })}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Activities (8 cols on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <FriendStatsCard
              stats={friendData?.stats}
              userStats={userStats}
            />

            {/* Achievements */}
            <AchievementShowcase
              achievements={friendData?.achievements}
              onCongratulate={handleCongratulate}
            />

            {/* Activity Timeline */}
            <ActivityTimeline
              activities={friendData?.activities}
            />
          </div>

          {/* Right Sidebar - Quick Actions and Stats (4 cols on desktop) */}
          <div className="space-y-6">
            {/* Quick Challenge Panel */}
            <QuickChallengePanel
              onSendChallenge={handleSendChallenge}
              friendName={friendData?.profile?.display_name}
            />

            {/* Friendship Statistics */}
            <FriendshipStats
              stats={friendData}
              sharedAchievements={sharedAchievements}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfileView;
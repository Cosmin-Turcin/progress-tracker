import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, TrendingUp, Award, Activity, Users, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import Header from '../../components/Header';
import FriendProfileHeader from './components/FriendProfileHeader';
import FriendStatsCard from './components/FriendStatsCard';
import AchievementShowcase from './components/AchievementShowcase';
import ActivityTimeline from './components/ActivityTimeline';
import FriendshipStats from './components/FriendshipStats';
import QuickChallengePanel from './components/QuickChallengePanel';
import ProfessionalTab from '../user-profile/components/ProfessionalTab';
import {
  getFriendProfile,
  getSharedAchievements,
  sendChallenge,
  congratulateFriend,
  removeFriend
} from '../../services/friendService';

const FriendProfileView = ({ resolvedUserId }) => {
  const { friendId: paramId } = useParams();
  const friendId = resolvedUserId || paramId;
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useAuth();
  const isUnlogged = !currentUserProfile;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const [sharedAchievements, setSharedAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'timeline', label: 'Activity Feed', icon: Activity },
  ];

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

    } catch (err) {
      console.error('Error loading friend profile:', err);
      setError(err?.message || 'Failed to load friend profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!window.confirm(`Are you sure you want to remove ${friendData?.profile?.display_name || friendData?.profile?.full_name} from your friends?`)) {
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
      setSuccessMessage(`Challenge sent to ${friendData?.profile?.display_name || friendData?.profile?.full_name}!`);
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
          isUnlogged={isUnlogged}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area (Tabs) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <div className="flex gap-1 p-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'stats' && (
                  <FriendStatsCard
                    stats={friendData?.stats}
                    userStats={userStats}
                  />
                )}

                {activeTab === 'professional' && (
                  <ProfessionalTab targetProfile={friendData?.profile} isReadOnly={true} />
                )}

                {activeTab === 'achievements' && (
                  <AchievementShowcase
                    achievements={friendData?.achievements}
                    onCongratulate={handleCongratulate}
                  />
                )}

                {activeTab === 'timeline' && (
                  <ActivityTimeline
                    activities={friendData?.activities}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {!isUnlogged && (
              <QuickChallengePanel
                onSendChallenge={handleSendChallenge}
                friendName={friendData?.profile?.display_name || friendData?.profile?.full_name}
              />
            )}

            {isUnlogged && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Connect to Interact</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Log in to challenge {friendData?.profile?.display_name}, send messages, and track your own progress!
                </p>
                <Button
                  onClick={() => navigate('/signin')}
                  className="w-full bg-blue-600 text-white"
                >
                  Sign In
                </Button>
              </div>
            )}

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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { realtimeService } from '../../services/realtimeService';
import { 
  User, Mail, Calendar, Award, TrendingUp, Target, 
  Activity, Edit2, Save, X, LogOut, Loader, AlertCircle 
} from 'lucide-react';
import Header from '../../components/Header';

export default function Profile() {
  const { user, profile, signOut, updateProfile: updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  // Real-time subscription for statistics updates
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to statistics changes for instant streak/points updates
    const unsubscribe = realtimeService?.subscribeToStatistics(user?.id, (stats) => {
      setStatistics({
        total_activities: stats?.totalActivities,
        current_streak: stats?.currentStreak,
        longest_streak: stats?.longestStreak,
        total_points: stats?.totalPoints,
        achievements_unlocked: stats?.achievementsUnlocked
      });
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [user]);

  const loadUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const stats = await authService?.getStatistics(user?.id);
      setStatistics(stats);
      setEditForm({
        fullName: profile?.full_name || '',
        bio: profile?.bio || ''
      });
    } catch (err) {
      setError(err?.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (err) {
      setError(err?.message || 'Failed to sign out');
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setError('');

    try {
      await updateAuthProfile({
        full_name: editForm?.fullName,
        bio: editForm?.bio
      });
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Authenticated</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: Activity, 
      label: 'Total Activities', 
      value: statistics?.total_activities || 0,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      icon: TrendingUp, 
      label: 'Current Streak', 
      value: `${statistics?.current_streak || 0} days`,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      icon: Target, 
      label: 'Total Points', 
      value: statistics?.total_points || 0,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      icon: Award, 
      label: 'Achievements', 
      value: statistics?.achievements_unlocked || 0,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile?.full_name || 'User'}</h1>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          fullName: profile?.full_name || '',
                          bio: profile?.bio || ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e?.target?.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm?.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e?.target?.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">{profile?.bio || 'No bio added yet'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {profile?.created_at ? new Date(profile.created_at)?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards?.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-6 h-6 ${stat?.iconColor}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat?.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {statistics?.longest_streak && statistics?.longest_streak > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Longest Streak</p>
                    <p className="text-lg font-bold text-gray-900">{statistics?.longest_streak} days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
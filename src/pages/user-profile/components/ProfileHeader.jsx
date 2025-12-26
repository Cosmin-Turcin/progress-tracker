import { User, Mail, Calendar, Settings, Share2, Users } from 'lucide-react';

export default function ProfileHeader({ profile, user, onCustomize, friendCount }) {
  const memberSince = profile?.created_at
    ? new Date(profile?.created_at)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
    : 'Unknown';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.full_name}'s Profile`,
        text: `Check out ${profile?.full_name}'s fitness journey!`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {profile?.cover_url ? (
        <div className="h-32 w-full overflow-hidden">
          <img
            src={profile.cover_url}
            alt="Profile Cover"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-32"></div>
      )}

      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile?.avatar_url}
                  alt={profile?.full_name || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.full_name || 'User'}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {friendCount} {friendCount === 1 ? 'friend' : 'friends'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 md:mb-4">
            <button
              onClick={onCustomize}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Customize Profile
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {profile?.bio && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{profile?.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
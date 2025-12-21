import { useState } from 'react';
import { Users, User, Check, X, Search, UserPlus, Mail, AlertCircle } from 'lucide-react';
import { friendService } from '../../../services/friendService';

export default function FriendRequestPanel({ pendingRequests, friends, onAccept, onDecline }) {
  const [activeView, setActiveView] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [sentRequests, setSentRequests] = useState([]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query?.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError('');

    try {
      const results = await friendService?.searchUsers(query);
      setSearchResults(results || []);
    } catch (err) {
      setError(err?.message || 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendService?.sendFriendRequest(userId);
      setSearchResults(prev => prev?.filter(u => u?.id !== userId));
      setSentRequests(prev => [...prev, userId]);
    } catch (err) {
      setError(err?.message || 'Failed to send friend request');
    }
  };

  const views = [
    { id: 'requests', label: 'Requests', count: pendingRequests?.length || 0 },
    { id: 'friends', label: 'Friends', count: friends?.length || 0 },
    { id: 'search', label: 'Find Friends', count: 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Social Hub</h2>
        <p className="text-gray-600">Manage your friends and connections</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {views?.map((view) => (
          <button
            key={view?.id}
            onClick={() => setActiveView(view?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeView === view?.id
                ? 'bg-blue-50 text-blue-600' :'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {view?.label}
            {view?.count > 0 && (
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                activeView === view?.id
                  ? 'bg-blue-600 text-white' :'bg-gray-200 text-gray-700'
              }`}>
                {view?.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeView === 'requests' && (
        <div className="space-y-4">
          {pendingRequests?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No pending friend requests</p>
            </div>
          ) : (
            pendingRequests?.map((request) => (
              <div
                key={request?.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{request?.requester?.fullName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {request?.requester?.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(request?.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline(request?.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeView === 'friends' && (
        <div className="space-y-4">
          {friends?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No friends yet</p>
              <button
                onClick={() => setActiveView('search')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends?.map((friendship) => (
                <div
                  key={friendship?.id}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{friendship?.friend?.fullName}</p>
                    <p className="text-sm text-gray-600 truncate">{friendship?.friend?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e?.target?.value)}
              placeholder="Search users by name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {searching && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!searching && searchResults?.length === 0 && searchQuery?.length >= 2 && (
            <div className="text-center py-8 text-gray-600">
              No users found matching "{searchQuery}"
            </div>
          )}

          {!searching && searchResults?.length > 0 && (
            <div className="space-y-3">
              {searchResults?.map((user) => (
                <div
                  key={user?.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.fullName}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  {sentRequests?.includes(user?.id) ? (
                    <span className="text-sm text-green-600 font-medium">Request Sent</span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user?.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
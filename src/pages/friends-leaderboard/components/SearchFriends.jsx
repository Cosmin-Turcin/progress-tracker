import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { friendService } from '../../../services/friendService';

export function SearchFriends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query?.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await friendService?.searchUsers(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      setError(err?.message || 'Failed to search users');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      await friendService?.sendFriendRequest(friendId);
      setSearchResults(prev => prev?.filter(user => user?.id !== friendId));
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to send friend request');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 relative">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Find Friends</h3>
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e?.target?.value)}
          placeholder="Search by name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {showResults && searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
      {loading && (
        <div className="mt-2 text-sm text-gray-600">Searching...</div>
      )}
      {showResults && searchResults?.length > 0 && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {searchResults?.map((user) => (
            <div key={user?.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.avatarUrl ? (
                    <img src={user?.avatarUrl} alt={user?.fullName || 'User'} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.fullName?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.fullName || 'Unknown'}</p>
                  <p className="text-xs text-gray-600">{user?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user?.id)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
      {showResults && searchQuery && searchResults?.length === 0 && !loading && (
        <div className="mt-2 text-sm text-gray-600">No users found</div>
      )}
    </div>
  );
}
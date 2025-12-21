import React from 'react';
import { Filter, Users, Activity } from 'lucide-react';

/**
 * FeedFilters Component
 * Provides filtering options for the social activity feed
 */
const FeedFilters = ({ filters, onFilterChange }) => {
  const friendTypes = [
    { value: 'all', label: 'All Friends' },
    { value: 'close', label: 'Close Friends' }
  ];

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'exercise', label: 'Exercise' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'mindset', label: 'Mindset' },
    { value: 'hydration', label: 'Hydration' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Feed Filters</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Friend Type Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4" />
            Friend Type
          </label>
          <select
            value={filters?.friendType || 'all'}
            onChange={(e) => onFilterChange?.({ ...filters, friendType: e?.target?.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {friendTypes?.map((type) => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Type Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4" />
            Activity Type
          </label>
          <select
            value={filters?.activityType || 'all'}
            onChange={(e) => onFilterChange?.({ ...filters, activityType: e?.target?.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {activityTypes?.map((type) => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FeedFilters;
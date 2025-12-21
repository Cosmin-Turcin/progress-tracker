import React, { useState } from 'react';
import { Activity, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ActivityTimeline = ({ activities }) => {
  const [filterType, setFilterType] = useState('all');
  const [timePeriod, setTimePeriod] = useState('week');

  const activityTypes = ['all', 'cardio', 'strength', 'yoga', 'nutrition', 'mindset'];
  const timePeriods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  const filterActivities = () => {
    let filtered = activities || [];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered?.filter(activity =>
        activity?.activity_category?.toLowerCase() === filterType?.toLowerCase()
      );
    }

    // Filter by time period
    const now = new Date();
    if (timePeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered?.filter(activity =>
        new Date(activity?.completed_at) >= weekAgo
      );
    } else if (timePeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered?.filter(activity =>
        new Date(activity?.completed_at) >= monthAgo
      );
    }

    return filtered;
  };

  const filteredActivities = filterActivities();

  const getActivityIcon = (category) => {
    return Activity;
  };

  const getActivityColor = (category) => {
    const colors = {
      cardio: 'text-red-600 bg-red-50',
      strength: 'text-blue-600 bg-blue-50',
      yoga: 'text-purple-600 bg-purple-50',
      nutrition: 'text-green-600 bg-green-50',
      mindset: 'text-indigo-600 bg-indigo-50',
    };
    return colors?.[category?.toLowerCase()] || 'text-gray-600 bg-gray-50';
  };

  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return diffInHours < 1 ? 'Just now' : `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Activity Timeline</h2>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Activity Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Activity Type
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {activityTypes?.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === type
                  ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Period Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Time Period
          </label>
          <div className="flex items-center gap-2">
            {timePeriods?.map((period) => (
              <button
                key={period?.value}
                onClick={() => setTimePeriod(period?.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timePeriod === period?.value
                  ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Calendar className="w-4 h-4" />
                {period?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Timeline */}
      {filteredActivities?.length > 0 ? (
        <div className="space-y-4">
          {filteredActivities?.map((activity, index) => {
            const IconComponent = getActivityIcon(activity?.activity_category);
            const colorClass = getActivityColor(activity?.activity_category);

            return (
              <div key={index} className="flex items-start gap-4">
                <div className={`${colorClass} p-3 rounded-lg flex-shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-900">
                      {activity?.activity_name}
                    </h4>
                    <span className="text-sm font-medium text-blue-600">
                      +{activity?.points_earned} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{activity?.duration_minutes} min</span>
                    <span>•</span>
                    <span className="capitalize">{activity?.activity_category}</span>
                    <span>•</span>
                    <span>{formatActivityDate(activity?.completed_at)}</span>
                  </div>

                  {activity?.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {activity?.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activities found for this filter</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
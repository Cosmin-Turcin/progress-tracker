import { useState } from 'react';
import { Activity, Calendar, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Icon from '../../../components/AppIcon';

export default function ActivityTimeline({ activities, compact = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIconComponent = (iconName) => {
    const Icon = LucideIcons?.[iconName];
    return Icon || Activity;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    }
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString?.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      fitness: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
      mindset: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
      nutrition: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
      work: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
      social: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' }
    };
    return colors?.[category] || colors?.fitness;
  };

  const groupedActivities = activities?.reduce((acc, activity) => {
    const date = formatDate(activity?.activityDate);
    if (!acc?.[date]) acc[date] = [];
    acc?.[date]?.push(activity);
    return acc;
  }, {});

  const allDates = Object.entries(groupedActivities || {});
  const displayedActivities = isExpanded ? allDates : allDates.slice(0, 3);
  const hasMore = allDates.length > 3;

  return (
    <div className={`space-y-${compact ? '4' : '6'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Activity Timeline</h2>
            <p className="text-gray-600">Your recent progress and accomplishments</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
              Filter by Category
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
              Date Range
            </button>
          </div>
        </div>
      )}

      {Object?.keys(groupedActivities || {})?.length === 0 ? (
        <div className={`text-center ${compact ? 'py-6' : 'py-12'} bg-gray-50 rounded-xl border-2 border-dashed border-gray-300`}>
          <Activity className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} text-gray-400 mx-auto mb-4`} />
          <p className="text-gray-600 font-medium">No activities recorded yet</p>
          {!compact && <p className="text-sm text-gray-500 mt-1">Start logging activities to see your progress here</p>}
        </div>
      ) : (
        <div className={`space-y-${compact ? '6' : '8'}`}>
          {displayedActivities.map(([date, dateActivities]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-gray-50 z-10 py-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
                  <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>{date}</h3>
                  <span className="text-sm text-gray-500">
                    ({dateActivities?.length})
                  </span>
                </div>
              </div>

              <div className={`relative ${compact ? 'pl-4' : 'pl-8'} space-y-4`}>
                <div className={`absolute ${compact ? 'left-1.5' : 'left-3'} top-0 bottom-0 w-0.5 bg-gray-200`}></div>

                {dateActivities?.map((activity) => {
                  const Icon = getIconComponent(activity?.icon);
                  const colors = getCategoryColor(activity?.category);

                  return (
                    <div key={activity?.id} className="relative">
                      <div className={`absolute ${compact ? '-left-3.5' : '-left-5'} w-6 h-6 ${colors?.dot} rounded-full border-4 border-white shadow-sm scale-${compact ? '75' : '100'}`}></div>

                      <div className={`${colors?.bg} rounded-lg ${compact ? 'p-3' : 'p-4'} border ${colors?.border} hover:shadow-md transition`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            {!compact && (
                              <div
                                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"
                                style={{ color: activity?.iconColor || 'currentColor' }}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className={`${compact ? 'text-sm' : 'font-semibold'} text-gray-900 font-bold truncate`}>
                                {activity?.activityName}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-block px-1.5 py-0.5 ${colors?.bg} ${colors?.text} text-[10px] font-bold rounded border ${colors?.border} uppercase`}>
                                  {activity?.category}
                                </span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatTime(activity?.activityTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-900 ml-2">
                            <Award className="w-3.5 h-3.5 text-yellow-500" />
                            {activity?.points} pts
                          </div>
                        </div>

                        {activity?.notes && !compact && (
                          <p className="text-sm text-gray-700 py-1">
                            {activity?.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-2.5 mt-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  See More Activity
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
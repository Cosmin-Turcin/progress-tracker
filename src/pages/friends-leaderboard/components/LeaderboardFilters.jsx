import React from 'react';
import { Calendar } from 'lucide-react';

export function LeaderboardFilters({ selectedPeriod, onPeriodChange }) {
  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'all-time', label: 'All Time' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Time Period</h3>
      </div>
      <div className="flex gap-2">
        {periods?.map((period) => (
          <button
            key={period?.value}
            onClick={() => onPeriodChange?.(period?.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period?.value
                ? 'bg-blue-500 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period?.label}
          </button>
        ))}
      </div>
    </div>
  );
}
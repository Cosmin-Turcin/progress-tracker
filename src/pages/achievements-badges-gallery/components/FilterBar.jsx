import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  selectedType, 
  onTypeChange,
  achievementCounts 
}) {
  const filterTypes = [
    { value: 'all', label: 'All Achievements', count: achievementCounts?.total || 0 },
    { value: 'streak', label: 'Streak', count: achievementCounts?.streak || 0 },
    { value: 'milestone', label: 'Milestone', count: achievementCounts?.milestone || 0 },
    { value: 'goal', label: 'Goal', count: achievementCounts?.goal || 0 },
    { value: 'special', label: 'Special Event', count: achievementCounts?.special || 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {filterTypes?.map((type) => (
            <button
              key={type?.value}
              onClick={() => onTypeChange?.(type?.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === type?.value
                  ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{type?.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedType === type?.value
                  ? 'bg-white bg-opacity-20' :'bg-white'
              }`}>
                {type?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HabitBreakdownTable = ({ habits }) => {
  const [sortBy, setSortBy] = useState('consistency');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedHabits = [...habits]?.sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    return (a?.[sortBy] - b?.[sortBy]) * multiplier;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Detailed Habit Breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Habit
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('consistency')}
              >
                <div className="flex items-center gap-2">
                  Consistency Score
                  <Icon name={sortBy === 'consistency' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} />
                </div>
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('bestStreak')}
              >
                <div className="flex items-center gap-2">
                  Best Streak
                  <Icon name={sortBy === 'bestStreak' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} />
                </div>
              </th>
              <th 
                className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('currentStreak')}
              >
                <div className="flex items-center gap-2">
                  Current Streak
                  <Icon name={sortBy === 'currentStreak' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} />
                </div>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHabits?.map((habit, index) => (
              <tr 
                key={habit?.id} 
                className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-card'}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon name={habit?.icon} size={20} color="var(--color-primary)" />
                    <div>
                      <p className="font-medium text-foreground">{habit?.name}</p>
                      <p className="text-sm text-muted-foreground">{habit?.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold font-data ${getScoreColor(habit?.consistency)}`}>
                      {habit?.consistency}%
                    </span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${habit?.consistency >= 80 ? 'bg-success' : habit?.consistency >= 60 ? 'bg-primary' : habit?.consistency >= 40 ? 'bg-warning' : 'bg-error'}`}
                        style={{ width: `${habit?.consistency}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Award" size={16} color="var(--color-warning)" />
                    <span className="font-medium font-data">{habit?.bestStreak} days</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Flame" size={16} color="var(--color-warning)" />
                    <span className="font-medium font-data">{habit?.currentStreak} days</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-start gap-2">
                    <Icon name="Lightbulb" size={16} color="var(--color-primary)" className="mt-0.5" />
                    <p className="text-sm text-muted-foreground">{habit?.recommendation}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitBreakdownTable;
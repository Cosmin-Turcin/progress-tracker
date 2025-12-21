import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HabitConsistencyMatrix = ({ habits, selectedPeriod }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-muted';
    if (intensity <= 0.3) return 'bg-error/30';
    if (intensity <= 0.6) return 'bg-warning/40';
    if (intensity <= 0.8) return 'bg-primary/50';
    return 'bg-success/60';
  };

  const getDayLabel = (index) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days?.[index % 7];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Habit Consistency Matrix</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Low</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <div className="w-4 h-4 rounded bg-error/30"></div>
              <div className="w-4 h-4 rounded bg-warning/40"></div>
              <div className="w-4 h-4 rounded bg-primary/50"></div>
              <div className="w-4 h-4 rounded bg-success/60"></div>
            </div>
            <span className="text-sm text-muted-foreground">High</span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {habits?.map((habit) => (
          <div key={habit?.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedHabit(selectedHabit === habit?.id ? null : habit?.id)}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <Icon name={habit?.icon} size={20} />
                  <span className="font-medium">{habit?.name}</span>
                </button>
                <span className="text-sm text-muted-foreground">
                  {habit?.completionRate}% completion
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Flame" size={16} color="var(--color-warning)" />
                <span className="text-sm font-medium font-data">{habit?.currentStreak} days</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {habit?.weekData?.map((day, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-center text-muted-foreground font-medium">
                    {getDayLabel(index)}
                  </div>
                  <div
                    className={`h-12 rounded ${getIntensityColor(day?.intensity)} transition-all duration-200 hover:scale-105 cursor-pointer relative group`}
                    title={`${day?.date}: ${day?.completed ? 'Completed' : 'Missed'}`}
                  >
                    {day?.completed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="Check" size={16} color="var(--color-foreground)" />
                      </div>
                    )}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {day?.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedHabit === habit?.id && (
              <div className="mt-4 p-4 bg-muted rounded-lg animate-fade-in">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Best Streak</p>
                    <p className="text-lg font-semibold font-data">{habit?.bestStreak} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Completions</p>
                    <p className="text-lg font-semibold font-data">{habit?.totalCompletions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg per Week</p>
                    <p className="text-lg font-semibold font-data">{habit?.avgPerWeek}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitConsistencyMatrix;
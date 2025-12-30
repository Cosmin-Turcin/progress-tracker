import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const HabitConsistencyMatrix = ({ habits, selectedPeriod }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);

  const getIntensityScale = (intensity) => {
    if (intensity === 0) return { bg: 'bg-muted/50', border: 'border-transparent', label: 'none' };
    if (intensity <= 0.3) return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: 'low' };
    if (intensity <= 0.6) return { bg: 'bg-blue-500/40', border: 'border-blue-500/50', label: 'med' };
    if (intensity <= 0.8) return { bg: 'bg-blue-500/70', border: 'border-blue-500/80', label: 'high' };
    return { bg: 'bg-blue-500', border: 'border-blue-600', label: 'peak' };
  };

  const getDayLabel = (index) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days?.[index % 7];
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold font-heading text-foreground tracking-tight">Consistency Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1 text-balance">Track your daily intensity and execution patterns.</p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Intensity</span>
          <div className="flex gap-1">
            {['bg-muted/50', 'bg-blue-500/20', 'bg-blue-500/40', 'bg-blue-500/70', 'bg-blue-500']?.map((bg, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${bg}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {habits?.map((habit) => (
          <motion.div
            layout
            key={habit?.id}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name={habit?.icon} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <button
                    onClick={() => setSelectedHabit(selectedHabit === habit?.id ? null : habit?.id)}
                    className="font-bold text-foreground hover:text-primary transition-colors text-lg"
                  >
                    {habit?.name}
                  </button>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${habit?.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {habit?.completionRate}% consistent
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                <Icon name="Flame" size={14} color="var(--color-warning)" />
                <span className="text-xs font-black font-data text-orange-600">{habit?.currentStreak}d</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {habit?.weekData?.map((day, index) => {
                const scale = getIntensityScale(day?.intensity);
                return (
                  <div key={index} className="space-y-1.5 text-center">
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase">
                      {getDayLabel(index)}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.08, y: -2 }}
                      className={`h-14 rounded-xl border-2 ${scale.bg} ${scale.border} transition-colors duration-300 relative group cursor-help`}
                    >
                      {day?.completed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon name="Check" size={16} color={day.intensity > 0.6 ? "white" : "var(--color-primary)"} />
                        </div>
                      )}

                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-[10px] font-bold rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none uppercase tracking-widest">
                        {day?.date} • {scale.label}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedHabit === habit?.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-6 bg-muted/30 border border-border rounded-2xl">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Best Streak</p>
                        <p className="text-2xl font-black font-data text-foreground">{habit?.bestStreak || 0}d</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Logs</p>
                        <p className="text-2xl font-black font-data text-foreground">{habit?.totalCompletions || 0}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Weekly Avg</p>
                        <p className="text-2xl font-black font-data text-foreground">{habit?.avgPerWeek || 0}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HabitConsistencyMatrix;
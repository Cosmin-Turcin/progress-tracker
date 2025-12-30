import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    if (score >= 80) return 'text-blue-500';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-8 border-b border-border flex items-center justify-between bg-muted/10">
        <div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Detailed Breakdown</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Deep dive into your habit metrics</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl">
          <Icon name="Filter" size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sorted by {sortBy}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Habit Discovery
              </th>
              <th
                className="text-left p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('consistency')}
              >
                <div className="flex items-center gap-2">
                  Consistency
                  <Icon name={sortBy === 'consistency' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={14} />
                </div>
              </th>
              <th
                className="text-left p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('currentStreak')}
              >
                <div className="flex items-center gap-2">
                  Power Streak
                  <Icon name={sortBy === 'currentStreak' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={14} />
                </div>
              </th>
              <th className="text-left p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Growth Strategy
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedHabits?.map((habit, index) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={habit?.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                      <Icon name={habit?.icon} size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="font-black text-foreground uppercase tracking-tight leading-none mb-1">{habit?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{habit?.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-black font-data tracking-tighter ${getScoreColor(habit?.consistency)}`}>
                        {habit?.consistency}%
                      </span>
                    </div>
                    <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${habit?.consistency}%` }}
                        className={`h-full ${habit?.consistency >= 80 ? 'bg-blue-500' : habit?.consistency >= 60 ? 'bg-primary' : habit?.consistency >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <Icon name="Flame" size={16} color="var(--color-warning)" />
                    </div>
                    <span className="font-black font-data text-foreground tracking-tighter text-lg">{habit?.currentStreak}d</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3 max-w-xs">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase leading-relaxed tracking-tight italic">"{habit?.recommendation}"</p>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitBreakdownTable;
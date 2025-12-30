import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const HabitPriorityRanking = ({ habits }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return {
          container: 'bg-red-500/5 text-red-500 border-red-500/20',
          badge: 'bg-red-500 text-white',
          label: 'CRITICAL'
        };
      case 'medium':
        return {
          container: 'bg-orange-500/5 text-orange-600 border-orange-500/20',
          badge: 'bg-orange-500 text-white',
          label: 'HIGH'
        };
      default:
        return {
          container: 'bg-blue-500/5 text-blue-600 border-blue-500/20',
          badge: 'bg-blue-500 text-white',
          label: 'NORMAL'
        };
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Priority Ranking</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="Activity" size={16} color="var(--color-primary)" />
        </div>
      </div>
      <div className="space-y-4">
        {habits?.length === 0 ? (
          <div className="py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No habits ranked yet</p>
          </div>
        ) : habits?.map((habit, index) => {
          const styles = getPriorityStyles(habit?.priority);
          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={habit?.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 group ${styles.container}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black font-data opacity-20 group-hover:opacity-40 transition-opacity">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon name={habit?.icon} size={18} />
                      <span className="font-black text-sm uppercase tracking-tight">{habit?.name}</span>
                    </div>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">{habit?.category}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-widest ${styles.badge}`}>
                  {styles.label}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-current/10 pt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Icon name="Target" size={12} className="opacity-50" />
                    <span className="text-xs font-black font-data tracking-tight">{habit?.completionRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <Icon name="Flame" size={12} />
                    <span className="text-xs font-black font-data tracking-tight">{habit?.streak}d</span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitPriorityRanking;
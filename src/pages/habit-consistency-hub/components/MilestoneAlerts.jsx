import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MilestoneAlerts = ({ milestones }) => {
  const getMilestoneIcon = (type) => {
    switch (type) {
      case 'streak': return 'Flame';
      case 'achievement': return 'Award';
      default: return 'Star';
    }
  };

  const getMilestoneColor = (daysUntil) => {
    if (daysUntil <= 1) return 'border-red-500/20 bg-red-500/5';
    if (daysUntil <= 3) return 'border-orange-500/20 bg-orange-500/5';
    return 'border-blue-500/20 bg-blue-500/5';
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Upcoming Milestones</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="Bell" size={16} color="var(--color-primary)" />
        </div>
      </div>
      <div className="space-y-4">
        {milestones?.length === 0 ? (
          <div className="py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No milestones yet</p>
          </div>
        ) : milestones?.map((milestone) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={milestone?.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${getMilestoneColor(milestone?.daysUntil)}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${milestone?.daysUntil <= 1 ? 'bg-red-500/10' : milestone?.daysUntil <= 3 ? 'bg-orange-500/10' : 'bg-blue-500/10'}`}>
                <Icon
                  name={getMilestoneIcon(milestone?.type)}
                  size={24}
                  color={milestone?.daysUntil <= 1 ? "var(--color-error)" : milestone?.daysUntil <= 3 ? "var(--color-warning)" : "var(--color-primary)"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-foreground text-sm uppercase leading-tight mb-1">{milestone?.title}</h4>
                <p className="text-xs text-muted-foreground font-medium mb-3 line-clamp-2">{milestone?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{milestone?.habit}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {milestone?.daysUntil}d left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneAlerts;
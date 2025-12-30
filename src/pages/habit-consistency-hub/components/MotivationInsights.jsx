import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MotivationInsights = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp';
      case 'warning': return 'AlertTriangle';
      case 'tip': return 'Lightbulb';
      default: return 'Info';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600';
      case 'warning': return 'border-amber-500/20 bg-amber-500/5 text-amber-600';
      case 'tip': return 'border-blue-500/20 bg-blue-500/5 text-blue-600';
      default: return 'border-slate-500/20 bg-slate-500/5 text-slate-600';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Icon name="Sparkles" size={16} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">AI Motivation Insights</h3>
      </div>
      <div className="space-y-4">
        {insights?.length === 0 ? (
          <div className="py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No insights available</p>
          </div>
        ) : insights?.map((insight) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={insight?.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${getInsightColor(insight?.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center border border-current/10 shadow-sm shrink-0">
                <Icon name={getInsightIcon(insight?.type)} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-foreground text-sm uppercase leading-tight mb-1">{insight?.title}</h4>
                <p className="text-xs text-muted-foreground font-medium mb-3 leading-relaxed">{insight?.message}</p>
                {insight?.action && (
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-current pb-0.5 hover:opacity-70 transition-opacity">
                    {insight?.action} →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MotivationInsights;
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ConsistencyCard = ({ title, value, subtitle, icon, trend, status = 'neutral' }) => {
  const statusStyles = {
    success: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600',
    warning: 'bg-amber-500/5 border-amber-500/20 text-amber-600',
    error: 'bg-rose-500/5 border-rose-500/20 text-rose-600',
    neutral: 'bg-slate-500/5 border-slate-500/20 text-slate-600'
  };

  const getStatusIconColor = () => {
    if (status === 'success') return 'var(--color-success)';
    if (status === 'warning') return 'var(--color-warning)';
    if (status === 'error') return 'var(--color-error)';
    return 'var(--color-primary)';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl border-2 p-6 transition-all duration-300 shadow-sm ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center border border-current/10 shadow-inner">
          <Icon name={icon} size={28} color={getStatusIconColor()} />
        </div>
        {trend && (
          <div className={`p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-current/10 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest`}>
            {trend?.direction === 'up' && <Icon name="TrendingUp" size={12} />}
            {trend?.direction === 'down' && <Icon name="TrendingDown" size={12} />}
            <span>{trend?.value}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black font-data tracking-tighter leading-none">{value}</p>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Live</span>
        </div>
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-pulse" />
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default ConsistencyCard;
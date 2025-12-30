import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TrendingAchievements Component
 * Displays trending achievements among friends with premium styling
 */
const TrendingAchievements = ({ achievements }) => {
  if (!achievements || achievements?.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-2 rounded-full bg-muted">
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs font-medium italic">
          No trending achievements yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Trending</h3>
        </div>
      </div>

      <div className="space-y-3">
        {achievements?.map((achievement, index) => (
          <motion.div
            key={achievement?.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all cursor-default"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {achievement?.icon === 'Trophy' ? '🏆' : achievement?.icon === 'Flame' ? '🔥' : achievement?.icon === 'Zap' ? '⚡️' : '🏅'}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <img
                    src={achievement?.user_profiles?.avatar_url || 'https://ui-avatars.com/api/?name=' + (achievement?.user_profiles?.full_name || 'User')}
                    alt={achievement?.user_profiles?.full_name}
                    className="w-4 h-4 rounded-full border border-white"
                  />
                  <span className="text-[10px] font-bold text-foreground/70 truncate">
                    {achievement?.user_profiles?.full_name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(achievement.achieved_at || achievement.created_at), { addSuffix: true })}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-foreground mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {achievement?.title}
                </h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {achievement?.description}
                </p>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-primary group-hover:h-1/2 transition-all duration-300 rounded-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAchievements;
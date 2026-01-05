import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Award, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * StreakLeaderboard Component
 * Displays active streak leaderboard for friends with premium styling
 */
const StreakLeaderboard = ({ streaks }) => {
  const navigate = useNavigate();
  if (!streaks || streaks?.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-2 rounded-full bg-muted">
            <Flame size={16} className="text-muted-foreground" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs font-medium italic">
          No active streaks yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Streak Leaders</h3>
        </div>
      </div>

      <div className="space-y-2">
        {streaks?.map((user, index) => (
          <motion.div
            key={user?.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border"
          >
            <div className={`flex items-center justify-center w-7 h-7 rounded-lg font-black text-[10px] ${index === 0 ? 'bg-amber-100 text-amber-700' :
              index === 1 ? 'bg-slate-100 text-slate-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-muted-foreground'
              }`}>
              {index + 1}
            </div>

            <img
              src={user?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user?.full_name || 'User')}
              alt={user?.full_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:border-primary transition-all"
              onClick={() => {
                if (user?.username) {
                  navigate(`/u/${user.username}`);
                } else {
                  navigate(`/friend-profile-view/${user?.id}`);
                }
              }}
            />

            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => {
                if (user?.username) {
                  navigate(`/u/${user.username}`);
                } else {
                  navigate(`/friend-profile-view/${user?.id}`);
                }
              }}
            >
              <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {user?.full_name || 'Anonymous'}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                  <Flame size={10} className="text-orange-500" /> {user?.current_streak} days
                </span>
                {user?.longest_streak > user?.current_streak && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Trophy size={10} className="text-amber-500" /> {user?.longest_streak}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className={`text-lg font-black tracking-tighter ${user?.current_streak > 0 ? 'text-orange-600' : 'text-muted-foreground/30'}`}>
                {user?.current_streak}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StreakLeaderboard;
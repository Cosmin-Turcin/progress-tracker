import React from 'react';
import { Award, Flame, Activity, Trophy } from 'lucide-react';

export function CurrentUserStats({ userStats }) {
  const isLoading = !userStats;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3 font-data">
          <Activity className="w-6 h-6" />
          Performance Hub
        </h2>
        <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase">
          Live Status
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all group">
          <div className="flex items-center gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase">Total Points</span>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 bg-white/20 animate-pulse rounded-lg" />
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black font-data tracking-tighter">{userStats?.totalPoints?.toLocaleString() || 0}</p>
                <span className="text-xs font-bold opacity-60">PTS</span>
              </div>
              <p className="text-[10px] font-black mt-2 opacity-60 uppercase tracking-widest leading-none">
                Rank #{userStats?.rank || '-'}
              </p>
            </>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all group">
          <div className="flex items-center gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-orange-400/20 rounded-lg text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase">Current Streak</span>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 bg-white/20 animate-pulse rounded-lg" />
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black font-data tracking-tighter">{userStats?.currentStreak || 0}</p>
                <span className="text-xs font-bold opacity-60">DAYS</span>
              </div>
              <p className="text-[10px] font-black mt-2 opacity-60 uppercase tracking-widest leading-none">Consecutive Logs</p>
            </>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all group">
          <div className="flex items-center gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase">Badges Earned</span>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 bg-white/20 animate-pulse rounded-lg" />
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black font-data tracking-tighter">{userStats?.achievementsUnlocked || 0}</p>
                <span className="text-xs font-bold opacity-60">TOTAL</span>
              </div>
              <p className="text-[10px] font-black mt-2 opacity-60 uppercase tracking-widest leading-none">Achievements</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
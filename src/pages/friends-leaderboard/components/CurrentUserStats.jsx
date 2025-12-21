import React from 'react';
import { Award, Flame, Activity } from 'lucide-react';

export function CurrentUserStats({ userStats }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Total Points</span>
          </div>
          <p className="text-3xl font-bold">{userStats?.totalPoints || 0}</p>
          <p className="text-sm opacity-80">Rank #{userStats?.rank || '-'}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <p className="text-3xl font-bold">{userStats?.currentStreak || 0}</p>
          <p className="text-sm opacity-80">days in a row</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Achievements</span>
          </div>
          <p className="text-3xl font-bold">{userStats?.achievementsUnlocked || 0}</p>
          <p className="text-sm opacity-80">unlocked</p>
        </div>
      </div>
    </div>
  );
}
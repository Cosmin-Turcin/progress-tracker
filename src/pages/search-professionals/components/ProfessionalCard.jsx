import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy, ArrowRight } from 'lucide-react';

const ProfessionalCard = ({ user }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        if (user?.username) {
            navigate(`/u/${user.username}`);
        } else {
            navigate(`/friend-profile-view/${user?.id}`);
        }
    };

    // Determine tier based on consistency
    const getTier = (score) => {
        if (score >= 90) return { label: 'Elite', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
        if (score >= 75) return { label: 'Pro', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
        if (score >= 50) return { label: 'Achiever', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
        return { label: 'Rising', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' };
    };

    const consistencyScore = user?.consistency_score || 0;
    const tier = getTier(consistencyScore);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow p-6 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=random`}
                    alt={user?.full_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-lg">{user?.full_name || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500 truncate">@{user?.username || 'user'}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.bg} ${tier.color}`}>
                    {tier.label}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b border-gray-100 mb-4">
                <div>
                    <p className="text-2xl font-black text-gray-900">{user?.current_streak || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Flame size={12} className="text-orange-500" /> Streak</p>
                </div>
                <div>
                    <p className="text-2xl font-black text-gray-900">{user?.achievements_count || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Award size={12} className="text-amber-500" /> Badges</p>
                </div>
                <div>
                    <p className="text-2xl font-black text-gray-900">{user?.total_points?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Trophy size={12} className="text-blue-500" /> Points</p>
                </div>
            </div>

            {/* Achievements */}
            <div className="flex items-center gap-2 mb-2">
                <Award size={14} className="text-amber-500" />
                <span className="text-xs text-gray-600">Top Achievements:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {user?.achievements && user.achievements.length > 0 ? (
                    user.achievements.slice(0, 3).map((ach, i) => (
                        <span key={ach?.id || i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium border border-amber-200">
                            {ach?.title}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">No badges yet</span>
                )}
            </div>

            {/* Action */}
            <button
                onClick={handleViewProfile}
                className="mt-auto w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
            >
                View Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

export default ProfessionalCard;

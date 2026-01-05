import React, { useState } from 'react';
import {
    User, Mail, Calendar, Settings, Share2, Users,
    ArrowLeft, MoreVertical, MessageCircle, Trophy, UserMinus, Activity,
    CheckCircle, Shield, Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

export default function ProfileHeader({
    profile,
    user,
    isOwnProfile,
    friendship,
    onCustomize,
    onUnfriend,
    onMessage,
    onChallenge,
    isUnlogged,
    friendCount
}) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    const memberSince = profile?.created_at
        ? new Date(profile?.created_at)?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
        : 'Unknown';

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${profile?.full_name}'s Profile`,
                    text: `Check out ${profile?.full_name}'s high-performance profile and achievements!`,
                    url: url,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert('Profile link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }
    };

    const formatFriendshipDuration = (createdAt) => {
        if (!createdAt) return '';
        const duration = new Date() - new Date(createdAt);
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));

        if (days < 30) return `Friends for ${days} days`;
        if (days < 365) return `Friends for ${Math.floor(days / 30)} months`;
        return `Friends for ${Math.floor(days / 365)} years`;
    };

    return (
        <div className="relative w-full overflow-hidden bg-white mb-8 group">
            {/* Back Button Overlay */}
            <div className="absolute top-6 left-6 z-30">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all border border-white/20 font-medium group/back"
                >
                    <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>
            </div>

            {/* Immersive Cover Background - Full Width Screen */}
            <div className="absolute inset-0 h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
                {/* Fallback pattern or image */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
            </div>

            {/* Glass Content Container */}
            <div className="relative z-20 pt-32 md:pt-48 pb-10 px-6 md:px-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    {/* Avatar with Ring */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden ring-4 ring-black/5">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile?.avatar_url}
                                    alt={profile?.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                                    {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {isOnline && !isOwnProfile && (
                            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                        )}
                        {/* Verified Badge Absolute */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Info Block */}
                    <div className="flex-1 text-white pb-2 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-lg">
                                    {profile?.full_name || 'User'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-white/90">
                                    {profile?.username && (
                                        <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-2">
                                            @{profile.username}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5 drop-shadow-md">
                                        <Users className="w-4 h-4 text-white/80" />
                                        {friendCount} connections
                                    </span>
                                    <span className="flex items-center gap-1.5 drop-shadow-md">
                                        <Calendar className="w-4 h-4 text-white/80" />
                                        Joined {memberSince}
                                    </span>
                                    {!isOwnProfile && friendship && (
                                        <span className="text-white/80 italic">
                                            {formatFriendshipDuration(friendship.created_at)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions Group */}
                            <div className="flex items-center gap-3">
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            onClick={handleShare}
                                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all active:scale-95 group/btn"
                                            title="Share Profile"
                                        >
                                            <Share2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={onCustomize}
                                            className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-50 transition shadow-xl font-bold active:scale-95 flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    </>
                                ) : !isUnlogged && (
                                    <>
                                        <button
                                            onClick={handleShare}
                                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all active:scale-95"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <Button
                                            onClick={onMessage}
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
                                        >
                                            Message
                                        </Button>
                                        <Button
                                            onClick={onChallenge}
                                            className="bg-white text-black hover:bg-gray-100 border-none shadow-lg"
                                        >
                                            Challenge
                                        </Button>
                                        {/* Dropdown for other actions */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowMenu(!showMenu)}
                                                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                            {showMenu && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800">
                                                    <button onClick={onUnfriend} className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium">
                                                        <UserMinus className="w-4 h-4" /> Unfriend
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {profile?.bio && (
                            <div className="mt-6">
                                <p className="text-white/90 text-lg leading-relaxed max-w-2xl font-light tracking-wide drop-shadow-md border-l-2 border-white/30 pl-4">
                                    "{profile.bio}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

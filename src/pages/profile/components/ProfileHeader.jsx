import React, { useState } from 'react';
import {
    User, Mail, Calendar, Settings, Share2, Users,
    ArrowLeft, MoreVertical, MessageCircle, Trophy, UserMinus, Activity
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${profile?.full_name}'s Profile`,
                text: `Check out ${profile?.full_name}'s progress journey!`,
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // In a real app we'd use a toast here
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
            {/* Cover Area */}
            <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                {!isOwnProfile && (
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-md transition-all border border-white/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium text-sm">Back</span>
                    </button>
                )}

                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                        onClick={handleShare}
                        className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-md transition-all border border-white/20"
                        title="Share Profile"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    {!isOwnProfile && !isUnlogged && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-md transition-all border border-white/20"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                                    <button
                                        onClick={() => {
                                            onMessage();
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4 text-blue-600" />
                                        Send Message
                                    </button>
                                    <button
                                        onClick={() => {
                                            onChallenge();
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                                    >
                                        <Trophy className="w-4 h-4 text-orange-600" />
                                        Send Challenge
                                    </button>
                                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                    <button
                                        onClick={() => {
                                            onUnfriend();
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600 transition-colors"
                                    >
                                        <UserMinus className="w-4 h-4" />
                                        Unfriend
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-4 gap-4">
                    <div className="flex items-end gap-5">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile?.avatar_url}
                                        alt={profile?.full_name || 'User'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {isOnline && !isOwnProfile && (
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                                    <Activity className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {profile?.full_name || 'User'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 font-medium">
                                {profile?.username && (
                                    <span className="text-blue-600">@{profile.username}</span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    Member since {memberSince}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    {friendCount} {friendCount === 1 ? 'friend' : 'friends'}
                                </span>
                                {!isOwnProfile && friendship && (
                                    <span className="text-gray-500 font-normal">
                                        {formatFriendshipDuration(friendship.created_at)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-2">
                        {isOwnProfile ? (
                            <button
                                onClick={onCustomize}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 active:scale-95 font-semibold"
                            >
                                <Settings className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : !isUnlogged && (
                            <>
                                <Button
                                    onClick={onMessage}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 active:scale-95 transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">Message</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onChallenge}
                                    className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
                                >
                                    <Trophy className="w-4 h-4 text-orange-500" />
                                    <span className="hidden sm:inline">Challenge</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {profile?.bio && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-700 leading-relaxed italic">
                            "{profile.bio}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

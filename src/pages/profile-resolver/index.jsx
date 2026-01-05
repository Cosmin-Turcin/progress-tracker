import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { friendService } from '../../services/friendService';
import { Loader2 } from 'lucide-react';
import Header from '../../components/Header';
import UserProfile from '../user-profile';
import FriendProfileView from '../friend-profile-view';

const ProfileResolver = () => {
    const { username } = useParams();
    const { profile: currentUserProfile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [targetId, setTargetId] = useState(null);

    useEffect(() => {
        const resolveUsername = async () => {
            if (!username) return;

            try {
                setLoading(true);
                const profile = await friendService.getProfileByUsername(username);

                if (!profile) {
                    setError('User not found');
                    return;
                }

                setTargetId(profile.id);
            } catch (err) {
                console.error('Error resolving username:', err);
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        resolveUsername();
    }, [username]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                        <p className="text-gray-600 mb-4">The user "{username}" does not exist.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // If the target profile is the current user, go to personal profile
    if (currentUserProfile && targetId === currentUserProfile.id) {
        return <UserProfile resolvedUserId={targetId} />;
    }

    // Otherwise, go to friend profile view
    return <FriendProfileView resolvedUserId={targetId} />;
};

export default ProfileResolver;

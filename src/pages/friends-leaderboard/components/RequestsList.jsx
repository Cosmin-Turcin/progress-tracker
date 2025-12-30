import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { friendService } from '../../../services/friendService';

export function RequestsList({ onUpdate }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await friendService?.getPendingRequests();
            setRequests(data);
        } catch (err) {
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            if (action === 'accept') {
                await friendService?.acceptFriendRequest(requestId);
            } else {
                await friendService?.declineFriendRequest(requestId);
            }
            setRequests(prev => prev?.filter(r => r?.id !== requestId));
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(`Failed to ${action} request`);
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading requests...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Requests</h2>
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            {requests?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No pending friend requests</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests?.map((request) => (
                        <div key={request?.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                    {request?.requester?.avatarUrl ? (
                                        <img src={request?.requester?.avatarUrl} alt={request?.requester?.fullName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        request?.requester?.fullName?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-none">{request?.requester?.fullName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{request?.requester?.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(request?.id, 'accept')}
                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    title="Accept Request"
                                >
                                    <UserCheck className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleAction(request?.id, 'decline')}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Decline Request"
                                >
                                    <UserX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dumbbell,
    Plus,
    Play,
    Clock,
    Flame,
    Trophy,
    Video,
    Search,
    ChevronRight,
    Filter,
    Share2,
    Zap,
    Loader2,
    Users,
    Calendar,
    Bookmark
} from 'lucide-react';
import Header from '../../components/Header';
import RoutineBuilder from './components/RoutineBuilder';
import WorkoutPlayer from './components/WorkoutPlayer';
import { useEcosystemPoints } from '../../hooks/useEcosystemPoints';
import { routineService } from '../../services/routineService';
import { supabase } from '../../lib/supabase';

const LiveSessionCard = ({ session, onJoin }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card rounded-3xl p-6 border border-border hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all group"
    >
        <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${session.is_live ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
                    }`}>
                    {session.is_live ? 'LIVE NOW' : 'UPCOMING'}
                </div>
            </div>
            {session.thumbnail_url ? (
                <img src={session.thumbnail_url} alt={session.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20">
                    <Video className="w-12 h-12 text-indigo-200 dark:text-indigo-800" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-indigo-600 fill-current ml-1" />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
                    {session.category}
                </span>
                <h3 className="font-black text-foreground leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {session.title}
                </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                <Users className="w-3 h-3" /> {session.attendees_count}
            </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
            {session.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(session.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoin(session)}
                className={`px-4 py-2 rounded-xl font-black transition-colors ${session.is_live ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
            >
                {session.is_live ? 'JOIN NOW' : 'REMIND ME'}
            </motion.button>
        </div>
    </motion.div>
);

const RoutineCard = ({ routine, onUse, onSave, isSaved }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card rounded-3xl p-6 border border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all group"
    >
        <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onSave(routine.id);
                }}
                className={`absolute top-4 right-4 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${isSaved ? 'bg-blue-600 text-white' : 'bg-card/80 text-muted-foreground hover:text-blue-600'
                    }`}
            >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            {routine.image ? (
                <img src={routine.image} alt={routine.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-950/20">
                    <Dumbbell className="w-12 h-12 text-blue-200 dark:text-blue-800" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-blue-600 fill-current ml-1" />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-start mb-2">
            <h3 className="font-black text-foreground leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {routine.title}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-lg border border-orange-500/20">
                <Flame className="w-3 h-3" /> {routine.difficulty}
            </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
            {routine.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {routine.duration}m</span>
                <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {routine.exercises} Ex</span>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onUse(routine);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 transition-colors"
            >
                START
            </motion.button>
        </div>
    </motion.div>
);

const FitnessHub = () => {
    const [activeTab, setActiveTab] = useState('explore');
    const [showBuilder, setShowBuilder] = useState(false);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [routines, setRoutines] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    const [liveCategory, setLiveCategory] = useState('All');
    const [routineCategory, setRoutineCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [creatorStats, setCreatorStats] = useState({ totalEarnings: 0, todayUses: 0 });

    const { awardPoints, trackUsage } = useEcosystemPoints();

    const loadStats = async () => {
        const stats = await routineService.getCreatorStats();
        setCreatorStats(stats);
    };

    // Fetch content based on active tab
    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (activeTab === 'explore') {
                    const data = await routineService.getAllPublic();
                    setRoutines(data);
                    // Also fetch saved IDs to show bookmark state
                    if (user) {
                        const saved = await routineService.getSavedRoutines();
                        setSavedIds(saved.map(s => s.id));
                    }
                } else if (activeTab === 'my_routines') {
                    if (user) {
                        const data = await routineService.getByUser(user.id);
                        setRoutines(data);
                    } else {
                        setRoutines([]);
                    }
                } else if (activeTab === 'saved') {
                    if (user) {
                        const data = await routineService.getSavedRoutines();
                        setRoutines(data);
                        setSavedIds(data.map(s => s.id));
                    } else {
                        setRoutines([]);
                    }
                } else if (activeTab === 'live_sessions') {
                    const data = await routineService.getLiveSessions();
                    setLiveSessions(data);
                }
            } catch (error) {
                console.error('Failed to load content:', error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
        loadStats();
    }, [activeTab]);

    const handleCreateRoutine = async (newRoutine) => {
        try {
            // Save to database
            const savedRoutine = await routineService.create(newRoutine);

            // Award points for creation
            await awardPoints({
                points: 50,
                reason: 'Created a new workout routine',
                metadata: { type: 'fitness_routine', title: newRoutine.title, category: 'fitness' }
            });

            // Add to local state
            setRoutines([savedRoutine, ...routines]);
            setShowBuilder(false);
        } catch (error) {
            console.error('Error creating routine:', error);
        }
    };

    const handleWorkoutComplete = async (workoutData) => {
        // Increment usage count
        if (activeWorkout?.id) {
            await routineService.incrementUsage(activeWorkout.id);
        }

        // trackUsage awards points to both user and creator
        await trackUsage({
            contentType: 'fitness_routine',
            contentId: activeWorkout?.id || workoutData.routineTitle,
            creatorId: activeWorkout?.user_id,
            category: 'fitness'
        });

        // Refresh stats to show new earnings
        await loadStats();

        setActiveWorkout(null);
    };

    const handleSaveRoutine = async (routineId) => {
        try {
            if (savedIds.includes(routineId)) {
                await routineService.unsaveRoutine(routineId);
                setSavedIds(savedIds.filter(id => id !== routineId));
                if (activeTab === 'saved') {
                    setRoutines(routines.filter(r => r.id !== routineId));
                }
            } else {
                await routineService.saveRoutine(routineId);
                setSavedIds([...savedIds, routineId]);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const handleJoinSession = async (session) => {
        try {
            await routineService.joinLiveSession(session.id);
            setLiveSessions(liveSessions.map(s =>
                s.id === session.id ? { ...s, attendees_count: (s.attendees_count || 0) + 1 } : s
            ));

            if (session.is_live) {
                window.open(session.stream_url || '#', '_blank');
            } else {
                alert(`Reminder set for ${session.title}!`);
            }
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors">
            <Header />

            <main className="container mx-auto max-w-7xl px-6 py-12">
                {/* Hub Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                <Dumbbell className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase font-outline-2 text-glow-primary">
                                Fitness <span className="text-blue-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium">
                            Create world-class routines and get rewarded when the community uses them.
                        </p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-3xl font-black shadow-xl shadow-primary/20 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        CREATE ROUTINE
                    </motion.button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-8 mb-12 border-b border-gray-100 overflow-x-auto">
                    {['explore', 'my_routines', 'saved', 'live_sessions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {tab.replace('_', ' ')}
                            {activeTab === tab && (
                                <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                                {activeTab === 'explore' ? 'Featured Routines' :
                                    activeTab === 'my_routines' ? 'My Arsenal' :
                                        activeTab === 'saved' ? 'Saved Protocols' : 'Live Ecosystem'}
                            </h2>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <select
                                        value={activeTab === 'live_sessions' ? liveCategory : routineCategory}
                                        onChange={(e) => activeTab === 'live_sessions' ? setLiveCategory(e.target.value) : setRoutineCategory(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 bg-card border border-border rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:border-primary/50 transition-all shadow-sm"
                                    >
                                        {(activeTab === 'live_sessions'
                                            ? ['All', 'HIIT', 'Strength', 'Yoga', 'Mindfulness']
                                            : ['All', 'Strength', 'HIIT', 'Yoga', 'Cardio', 'Mobility']
                                        ).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-border hidden md:block" />

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none w-32 md:w-48 transition-all text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="col-span-full flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : activeTab === 'live_sessions' ? (
                            liveSessions.length === 0 ? (
                                <div className="text-center py-20">
                                    <Video className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No sessions scheduled</p>
                                    <p className="text-gray-300 text-sm mt-2">Check back soon for elite live content.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {liveSessions
                                        .filter(s => liveCategory === 'All' || s.category === liveCategory)
                                        .map(session => (
                                            <LiveSessionCard
                                                key={session.id}
                                                session={session}
                                                onJoin={handleJoinSession}
                                            />
                                        ))
                                    }
                                </div>
                            )
                        ) : routines.filter(r => routineCategory === 'All' || r.category === routineCategory).length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <Dumbbell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest">
                                    {routineCategory !== 'All' ? `No ${routineCategory} protocols found` :
                                        activeTab === 'my_routines' ? 'Your arsenal is empty' :
                                            activeTab === 'saved' ? 'No saved routines' : 'No routines yet'}
                                </p>
                                <p className="text-gray-300 text-sm mt-2">
                                    {routineCategory !== 'All' ? 'Try another category' :
                                        activeTab === 'my_routines' ? 'Create your first protocol to start built your legacy.' :
                                            activeTab === 'saved' ? 'Bookmark some routines to see them here.' : 'Be the first to create one!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {routines
                                    .filter(r => routineCategory === 'All' || r.category === routineCategory)
                                    .map((routine) => (
                                        <RoutineCard
                                            key={routine.id}
                                            routine={{
                                                ...routine,
                                                exercises: routine.exercises?.length || 0,
                                                author: routine.user_profiles?.full_name || routine.user_profiles?.username || 'Anonymous'
                                            }}
                                            isSaved={savedIds.includes(routine.id)}
                                            onSave={handleSaveRoutine}
                                            onUse={() => setActiveWorkout(routine)}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-12">
                        {/* Creator Rewards Stats */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-80 mb-6 flex items-center gap-2">
                                <Trophy className="w-4 h-4" /> Creator Earnings
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-3xl font-black tracking-tight">{creatorStats.totalEarnings.toLocaleString()} <span className="text-xs">pts</span></p>
                                    <p className="text-[10px] uppercase font-bold opacity-60">Total usage points</p>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-black">{creatorStats.todayUses}</p>
                                        <p className="text-[10px] uppercase font-bold opacity-60">Uses today</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-yellow-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Videos */}
                        <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center justify-between">
                                Mindset Clips
                                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">SEE ALL</span>
                            </h3>
                            <div className="space-y-4">
                                {[1, 2].map(v => (
                                    <div key={v} className="group cursor-pointer">
                                        <div className="aspect-video rounded-2xl bg-gray-200 mb-2 relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                <Play className="text-white fill-current" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">Daily Focus: Visualizing the Win</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showBuilder && (
                    <RoutineBuilder
                        onClose={() => setShowBuilder(false)}
                        onSave={handleCreateRoutine}
                    />
                )}
                {activeWorkout && (
                    <WorkoutPlayer
                        routine={activeWorkout}
                        onClose={() => setActiveWorkout(null)}
                        onComplete={handleWorkoutComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FitnessHub;

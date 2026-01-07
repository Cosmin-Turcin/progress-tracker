import React, { useState } from 'react';
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
    Zap
} from 'lucide-react';
import Header from '../../components/Header';
import RoutineBuilder from './components/RoutineBuilder';
import { useEcosystemPoints } from '../../hooks/useEcosystemPoints';

const RoutineCard = ({ routine, onUse }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group"
    >
        <div className="relative aspect-video rounded-2xl bg-gray-100 mb-4 overflow-hidden">
            {routine.image ? (
                <img src={routine.image} alt={routine.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <Dumbbell className="w-12 h-12 text-blue-200" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-blue-600 fill-current ml-1" />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-start mb-2">
            <h3 className="font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {routine.title}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                <Flame className="w-3 h-3" /> {routine.difficulty}
            </div>
        </div>

        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
            {routine.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
    const [routines, setRoutines] = useState([
        {
            title: "Explosive Morning Power",
            description: "High-intensity interval training designed to jumpstart your metabolic rate.",
            duration: 35,
            exercises: 8,
            difficulty: "Hard",
            author: "AlexR",
            image: null
        },
        {
            title: "Mind-Muscle Connection",
            description: "Slow, controlled movements focusing on muscle hypertrophy and isometric holds.",
            duration: 50,
            exercises: 12,
            difficulty: "Mid",
            author: "SarahV",
            image: null
        },
        {
            title: "Core Foundation Elite",
            description: "The ultimate core stabilization program used by professional athletes.",
            duration: 20,
            exercises: 6,
            difficulty: "Pro",
            author: "CoachK",
            image: null
        }
    ]);

    const { awardPoints, trackUsage } = useEcosystemPoints();

    const handleCreateRoutine = async (newRoutine) => {
        // Award points for creation
        await awardPoints({
            points: 50,
            reason: 'Created a new workout routine',
            metadata: { type: 'fitness_routine', title: newRoutine.title, category: 'fitness' }
        });

        setRoutines([{ ...newRoutine, author: 'Me', exercises: (newRoutine.exercises || []).length }, ...routines]);
        setShowBuilder(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto max-w-7xl px-6 py-12">
                {/* Hub Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 text-white">
                                <Dumbbell className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase font-outline-2">
                                Fitness <span className="text-blue-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-gray-500 font-medium">
                            Create world-class routines and get rewarded when the community uses them.
                        </p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-3xl font-black shadow-xl shadow-gray-200 group"
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
                            className={`pb-4 text-sm font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab.replace('_', ' ')}
                            {activeTab === tab && (
                                <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Featured Routines</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search power..."
                                        className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48 transition-all focus:w-64"
                                    />
                                </div>
                                <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Filter className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {routines.map((routine, i) => (
                                <RoutineCard
                                    key={i}
                                    routine={routine}
                                    onUse={() => trackUsage({
                                        contentType: 'fitness_routine',
                                        contentId: routine.title,
                                        creatorId: routine.author === 'Me' ? null : 'other_user',
                                        category: 'fitness'
                                    })}
                                />
                            ))}
                        </div>
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
                                    <p className="text-3xl font-black tracking-tight">1,240 <span className="text-xs">pts</span></p>
                                    <p className="text-[10px] uppercase font-bold opacity-60">Total usage points</p>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-black">45</p>
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
            </AnimatePresence>
        </div>
    );
};

export default FitnessHub;

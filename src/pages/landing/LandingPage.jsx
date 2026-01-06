import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Brain, Utensils, Shield, Smartphone, Globe, Lock, Check, Zap } from 'lucide-react';

// Component Imports
import ActivityCard from '../social-activity-feed/components/ActivityCard';
import HabitConsistencyMatrix from '../habit-consistency-hub/components/HabitConsistencyMatrix';
import AchievementShowcase from '../profile/components/AchievementShowcase';

const LandingPage = () => {
    // Mock Data for Showcases
    const mockActivity = {
        id: 'mock-1',
        user_profiles: {
            full_name: 'Alex Rivera',
            username: 'arivera',
            avatar_url: 'https://i.pravatar.cc/150?u=arivera'
        },
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
        activity_name: 'Morning Power Run 🏃‍♂️',
        category: 'fitness',
        duration_minutes: 45,
        intensity: 'high',
        notes: 'Beat my personal best! The cool air really helped today.',
        achievements: [
            { id: 'a1', title: 'Early Bird', description: 'Complete an activity before 7AM', icon: 'Zap' }
        ],
        points: 150
    };

    const mockHabits = [
        {
            id: 'h1',
            name: 'Deep Work Session',
            icon: 'Brain',
            completionRate: 85,
            currentStreak: 12,
            bestStreak: 21,
            totalCompletions: 48,
            avgPerWeek: 5.2,
            weekData: [
                { date: 'Mon', intensity: 0.8, completed: true },
                { date: 'Tue', intensity: 1.0, completed: true },
                { date: 'Wed', intensity: 0.6, completed: true },
                { date: 'Thu', intensity: 0, completed: false },
                { date: 'Fri', intensity: 0.9, completed: true },
                { date: 'Sat', intensity: 0.7, completed: true },
                { date: 'Sun', intensity: 0.5, completed: true },
            ]
        }
    ];

    const mockAchievements = [
        { id: 'ach1', title: 'Consistent Crusher', description: ' maintain a 7-day streak', icon: 'Flame', unlocked_at: new Date().toISOString() },
        { id: 'ach2', title: 'Social Butterfly', description: 'React to 50 friend activities', icon: 'Heart', unlocked_at: new Date().toISOString() },
        { id: 'ach3', title: 'Iron Will', description: 'Complete a workout in bad weather', icon: 'Dumbbell', unlocked_at: new Date().toISOString() }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
            </div>

            <div className="relative z-10">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 container mx-auto backdrop-blur-sm sticky top-0 bg-black/50 border-b border-white/10 z-50">
                    <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Progress Tracker
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/signin"
                            className="hidden md:inline-block text-gray-300 hover:text-white font-medium transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/daily-activity-dashboard"
                            className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                        >
                            Launch App
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-24 md:py-32 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-8"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        Now in Public Beta
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
                    >
                        Evolution, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            Decentralized.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        A next-generation ecosystem to master your Fitness, Mindset, and Nutrition.
                        Store your verifiable growth on-chain.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/signup"
                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-lg font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all flex items-center justify-center"
                        >
                            Start Evolving <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <a
                            href="#features"
                            className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-lg font-bold hover:bg-white/10 transition-all text-gray-300"
                        >
                            Explore Features
                        </a>
                    </motion.div>
                </section>

                {/* Live Interface Demo Section */}
                <section id="features" className="container mx-auto px-6 py-24">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for High Performers</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Experience the components that power your growth. Interactive, responsive, and beautiful.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* Component 1: Activity Feed */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Social Accountability</h3>
                            </div>
                            <div className="pointer-events-none select-none"> {/* Disable interaction for demo purposes if needed, or keep it interactive */}
                                <ActivityCard
                                    activity={mockActivity}
                                    reactions={[
                                        { reaction_type: 'inspire', user_id: 'mock-user' }
                                    ]}
                                    currentUserId="current-user"
                                    onReaction={() => { }}
                                />
                            </div>
                            <p className="mt-6 text-gray-400 text-sm">
                                Share your wins, get inspired, and keep your circle motivated with rich social features.
                            </p>
                        </motion.div>

                        {/* Component 2: Habit Matrix */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl lg:mt-12"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Visual Consistency</h3>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden">
                                <HabitConsistencyMatrix habits={mockHabits} />
                            </div>
                            <p className="mt-6 text-gray-400 text-sm">
                                Visualize your momentum with heatmaps and intensity tracking for every habit.
                            </p>
                        </motion.div>

                        {/* Component 3: Achievements */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Gamified Growth</h3>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <AchievementShowcase achievements={mockAchievements} />
                            </div>
                            <p className="mt-6 text-gray-400 text-sm">
                                Unlock badges and milestones as you progress. Your achievements are proof of work.
                            </p>
                        </motion.div>

                    </div>
                </section>

                {/* Roadmap Section (Redesigned) */}
                <section className="container mx-auto px-6 py-24 border-t border-white/5">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
                        Roadmap <span className="text-gray-600">2026</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Phase 1 */}
                        <div className="group bg-gradient-to-b from-gray-900 to-black p-1 rounded-2xl hover:bg-gradient-to-b hover:from-blue-600 hover:to-purple-600 transition-all duration-500">
                            <div className="bg-gray-950 h-full p-8 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl text-white">LIVE</div>
                                <div className="p-3 bg-blue-900/20 rounded-lg w-fit mb-6 text-blue-400">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Phase 1: Foundation</h3>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-center gap-3"><span className="p-1 rounded bg-green-500/10 text-green-500"><Check size={14} /></span> Fitness Tracking</li>
                                    <li className="flex items-center gap-3"><span className="p-1 rounded bg-green-500/10 text-green-500"><Check size={14} /></span> Mindset Logging</li>
                                    <li className="flex items-center gap-3"><span className="p-1 rounded bg-green-500/10 text-green-500"><Check size={14} /></span> Nutrition Database</li>
                                </ul>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="group bg-gradient-to-b from-gray-900 to-black p-1 rounded-2xl border-t border-purple-500/30">
                            <div className="bg-gray-950 h-full p-8 rounded-xl">
                                <div className="p-3 bg-purple-900/20 rounded-lg w-fit mb-6 text-purple-400">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Phase 2: Trust</h3>
                                <p className="text-sm text-gray-500 mb-4 font-mono">IN DEVELOPMENT</p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-center gap-3"><Globe size={18} className="text-purple-500" /> Verified CV DApp</li>
                                    <li className="flex items-center gap-3"><Lock size={18} className="text-purple-500" /> Anti-fraud Algo</li>
                                    <li className="flex items-center gap-3"><Activity size={18} className="text-purple-500" /> Real-time Validation</li>
                                </ul>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="group bg-gradient-to-b from-gray-900 to-black p-1 rounded-2xl border-t border-teal-500/30">
                            <div className="bg-gray-950 h-full p-8 rounded-xl">
                                <div className="p-3 bg-teal-900/20 rounded-lg w-fit mb-6 text-teal-400">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Phase 3: Expansion</h3>
                                <p className="text-sm text-gray-500 mb-4 font-mono">PLANNED</p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-center gap-3"><Smartphone size={18} className="text-teal-500" /> Native iOS App</li>
                                    <li className="flex items-center gap-3"><Smartphone size={18} className="text-teal-500" /> Native Android App</li>
                                    <li className="flex items-center gap-3"><Activity size={18} className="text-teal-500" /> Wearable Integration</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recruiters & Community Section */}
                <section className="container mx-auto px-6 py-24 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Find the Top 1% of <br />
                                <span className="text-blue-500">Disciplined Talent</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Whether you are a recruiter looking for proven high achievers or a professional seeking a circle of excellence, our advanced search connects you with the best using authenticated data.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl h-fit text-blue-400">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Verified Proof of Work</h4>
                                        <p className="text-gray-400 text-sm">
                                            Don't rely on inflated CVs. See actual consistency streaks, achievement badges, and disciplined activity logs verified on-chain.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl h-fit text-purple-400">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Advanced Talent Search</h4>
                                        <p className="text-gray-400 text-sm">
                                            Filter users by specific habit completion rates, consistency scores, and mindset achievements to find truly dedicated individuals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative shadow-2xl"
                        >
                            {/* Mock Search UI */}
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-6">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                    <Lock size={10} /> Authenticated Search
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">98%</div>
                                    <div>
                                        <div className="h-2 w-24 bg-gray-700 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-gray-800 rounded-full" />
                                    </div>
                                    <div className="ml-auto text-green-400 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">Top Rated</div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 opacity-75">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">95%</div>
                                    <div>
                                        <div className="h-2 w-32 bg-gray-700 rounded-full mb-2" />
                                        <div className="h-2 w-20 bg-gray-800 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 opacity-50">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">92%</div>
                                    <div>
                                        <div className="h-2 w-28 bg-gray-700 rounded-full mb-2" />
                                        <div className="h-2 w-12 bg-gray-800 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                                <p className="text-gray-500 text-sm mb-4">Connect with the elite community</p>
                                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                    Access Talent Pool
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container mx-auto px-6 py-24 text-center">
                    <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-6">Ready to upgrade your life?</h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Join thousands of high performers tracking their way to success.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-block px-10 py-5 bg-white text-blue-900 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-xl"
                            >
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 bg-black pt-16 pb-8 text-center text-gray-500">
                    <div className="container mx-auto px-6 flex flex-col items-center">
                        <div className="text-2xl font-bold text-white mb-8">Progress Tracker</div>
                        <div className="flex gap-8 mb-8 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Discord</a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} Progress Tracker. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;

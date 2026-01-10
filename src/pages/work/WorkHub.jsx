import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Search,
    FileText,
    Star,
    TrendingUp,
    Users,
    ShieldCheck,
    ChevronRight,
    ArrowRight,
    ListTodo
} from 'lucide-react';
import Header from '../../components/Header';
import TaskManager from './components/TaskManager';

const WorkHub = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 text-primary-foreground">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase font-outline-2 text-glow-primary">
                                Professional <span className="text-blue-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium">
                            The elite interface for high-performers. Build your legacy, manage your tasks, and connect with talent.
                        </p>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-8 mb-16">
                    {/* Left Column - Actions */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* CV Builder Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/cv-builder')}
                            className="group relative bg-card rounded-[2.5rem] p-8 border border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileText className="w-32 h-32 text-foreground" />
                            </div>
                            <div className="relative z-10">
                                <div className="p-3 bg-primary text-primary-foreground rounded-xl w-fit mb-6 shadow-lg">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight uppercase">Premium CV Architect</h3>
                                <p className="text-muted-foreground mb-6">
                                    Transform your professional narrative into an elite digital portfolio.
                                </p>
                                <div className="flex items-center gap-3 text-blue-600 font-black group-hover:gap-5 transition-all text-sm">
                                    OPEN ARCHITECT <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Talent Search Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/search-professionals')}
                            className="group relative bg-gray-900 rounded-[2.5rem] p-8 text-white border border-gray-800 hover:shadow-2xl shadow-gray-300 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 p-6 opacity-10">
                                <Search className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="p-3 bg-white/10 rounded-xl w-fit mb-6 backdrop-blur-sm">
                                    <Search className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black mb-3 tracking-tight uppercase">Talent Radar</h3>
                                <p className="text-gray-400 mb-6">
                                    Discover and connect with other high-achievers.
                                </p>
                                <div className="flex items-center gap-3 text-blue-400 font-black group-hover:gap-5 transition-all text-sm">
                                    START SEARCH <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Profile Strength</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black text-foreground">92%</span>
                                    <TrendingUp className="text-green-500 w-5 h-5 mb-1" />
                                </div>
                                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="w-[92%] h-full bg-blue-600" />
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Global Rank</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="text-yellow-500 w-6 h-6" />
                                    <span className="text-2xl font-black text-foreground uppercase tracking-tight">Elite</span>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Top 2%</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Task Manager */}
                    <div className="lg:col-span-7">
                        <TaskManager />
                    </div>
                </div>

                {/* Bottom Motivational Banner */}
                <div className="bg-blue-600 p-8 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-blue-500/20">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-blue-200" />
                        <div>
                            <p className="text-xl font-black uppercase tracking-tight">Your consistency is your ultimate proof.</p>
                            <p className="text-blue-100/80 text-sm">Complete tasks daily to maintain your elite status.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <ListTodo className="w-4 h-4" />
                        Task Streak: 7 Days
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WorkHub;

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
    ArrowRight
} from 'lucide-react';
import Header from '../../components/Header';

const WorkHub = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gray-900 rounded-2xl shadow-lg shadow-gray-200 text-white">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase font-outline-2">
                                Professional <span className="text-blue-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-gray-500 font-medium">
                            The elite interface for high-performers. Build your legacy, verify your consistency, and connect with talent.
                        </p>
                    </motion.div>
                </div>

                {/* Main Actions Bento */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => navigate('/cv-builder')}
                        className="lg:col-span-2 group relative bg-white rounded-[2.5rem] p-10 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText className="w-40 h-40 text-gray-900" />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-gray-900 text-white rounded-2xl w-fit mb-8 shadow-xl">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Premium CV Architect</h3>
                            <p className="text-gray-500 text-lg max-w-lg mb-10 leading-relaxed">
                                Transform your professional narrative into an elite digital portfolio with our premium two-column architecture.
                            </p>
                            <div className="flex items-center gap-3 text-blue-600 font-black group-hover:gap-5 transition-all">
                                OPEN ARCHITECT <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => navigate('/search-professionals')}
                        className="group relative bg-gray-900 rounded-[2.5rem] p-10 text-white border border-gray-800 hover:shadow-2xl shadow-gray-300 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute bottom-0 right-0 p-8 opacity-10">
                            <Search className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-white/10 rounded-2xl w-fit mb-8 backdrop-blur-sm">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">Talent Radar</h3>
                            <p className="text-gray-400 mb-10">
                                Discover and connect with other high-achievers. Verified by consistency, not just claims.
                            </p>
                            <div className="flex items-center gap-3 text-blue-400 font-black group-hover:gap-5 transition-all">
                                START SEARCH <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Market Insights / Stats Section */}
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Profile Strength</h4>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-4xl font-black text-gray-900">92%</span>
                            <TrendingUp className="text-green-500 w-6 h-6 mb-1" />
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Global Rank</h4>
                        <div className="flex items-center gap-3 mb-2">
                            <Star className="text-yellow-500 w-8 h-8" />
                            <span className="text-3xl font-black text-gray-900 uppercase tracking-tight">Elite</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top 2% of Performers</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Verified Projects</h4>
                        <span className="text-3xl font-black text-gray-900 mb-2">12</span>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-3xl text-white flex flex-col justify-between shadow-xl shadow-blue-100">
                        <ShieldCheck className="w-8 h-8 text-blue-200 mb-6" />
                        <p className="text-lg font-black uppercase tracking-tight leading-tight">Your consistency is your ultimate proof.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WorkHub;

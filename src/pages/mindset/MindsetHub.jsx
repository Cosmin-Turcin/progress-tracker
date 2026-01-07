import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    BookOpen,
    Video,
    Plus,
    Search,
    Filter,
    Lock,
    Globe,
    Users,
    Play,
    Clock,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import Header from '../../components/Header';
import JournalEditor from './components/JournalEditor';
import { useEcosystemPoints } from '../../hooks/useEcosystemPoints';

const JournalCard = ({ journal, onRead }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all group cursor-pointer"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl ${journal.type === 'Article' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {journal.type === 'Article' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{journal.date}</span>
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors uppercase tracking-tight">
            {journal.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-3 font-medium leading-relaxed">
            {journal.preview}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {journal.readTime} min read</span>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onRead();
                }}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-black hover:bg-purple-700 transition-colors"
            >
                READ
            </motion.button>
        </div>
    </motion.div>
);

const MindsetHub = () => {
    const [activeTab, setActiveTab] = useState('journals');
    const [showEditor, setShowEditor] = useState(false);
    const [journals, setJournals] = useState([
        {
            title: "The Architecture of Discipline",
            preview: "Discipline is not about punishment, it is about creating a structure where success becomes the path of least resistance...",
            type: "Article",
            date: "Oct 24, 2026",
            readTime: 6,
            author: "OrdomaticTeam"
        },
        {
            title: "Flow State & Neural Synchronization",
            preview: "Understanding the biological clocks that govern your peak performance windows and how to align your deep work...",
            type: "Article",
            date: "Oct 22, 2026",
            readTime: 12,
            author: "Dr. Mind"
        },
        {
            title: "Morning Routine: Reflection",
            preview: "Today I focused on the gap between intention and action. The resistance was high but the system held...",
            type: "Journal",
            date: "Today",
            readTime: 3,
            author: "Me"
        }
    ]);

    const { awardPoints, trackUsage } = useEcosystemPoints();

    const handleCreateJournal = async (newJournal) => {
        // Award points for creation
        await awardPoints({
            points: 30,
            reason: 'Published a mindset article',
            metadata: { type: 'mindset_article', title: newJournal.title, category: 'mindset' }
        });

        setJournals([{
            ...newJournal,
            preview: newJournal.content.substring(0, 150) + '...',
            readTime: Math.max(1, Math.ceil(newJournal.content.length / 500))
        }, ...journals]);
        setShowEditor(false);
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
                            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200 text-white">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase font-outline-2">
                                Mindset <span className="text-purple-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-gray-500 font-medium font-sans">
                            Master your internal narrative through structured journaling and curated focus content.
                        </p>
                    </motion.div>

                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowEditor(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-3xl font-black shadow-xl shadow-gray-200 group"
                        >
                            <BookOpen className="w-5 h-5" />
                            NEW ARTICLE
                        </motion.button>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex gap-8 mb-12 border-b border-gray-100 overflow-x-auto">
                    {['journals', 'videos', 'saved_wisdom', 'private_notes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-black uppercase tracking-widest relative whitespace-nowrap ${activeTab === tab ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab.replace('_', ' ')}
                            {activeTab === tab && (
                                <motion.div layoutId="mindsetTabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Layout */}
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-12">
                        {activeTab === 'journals' ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Recent Insights</h2>
                                    <div className="flex gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search wisdom..."
                                                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none w-48 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {journals.map((journal, i) => (
                                        <JournalCard
                                            key={i}
                                            journal={journal}
                                            onRead={() => trackUsage({
                                                contentType: 'mindset_article',
                                                contentId: journal.title,
                                                creatorId: journal.author === 'Me' ? null : 'other_user',
                                                category: 'mindset'
                                            })}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 italic text-gray-400 font-medium">
                                Content for {activeTab} is being prepared for your focus.
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Focus Video Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center justify-between">
                                Focus Stream
                                <span className="text-[10px] text-purple-600 font-black cursor-pointer hover:underline">BROWSE ALL</span>
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(v => (
                                    <div key={v} className="bg-white p-4 rounded-3xl border border-gray-50 flex items-center gap-4 group cursor-pointer hover:border-purple-200 transition-all">
                                        <div className="w-20 aspect-video rounded-xl bg-gray-100 relative overflow-hidden flex-shrink-0">
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <Play className="w-4 h-4 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-purple-600">Morning Meditation for Deep Work</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">12:45 • 2.4k views</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quote of the Day */}
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-purple-100 font-serif text-6xl opacity-20">"</div>
                            <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-4">Daily Momentum</h3>
                            <p className="text-lg font-black text-gray-900 leading-relaxed tracking-tight uppercase">
                                "Order is not something we look for, it is something we create through the repeated application of will."
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Marcus Aurelius</span>
                            </div>
                        </div>

                        {/* Stats Check-in */}
                        <div className="bg-purple-900 rounded-[2.5rem] p-8 text-white relative shadow-2xl shadow-purple-200 overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mb-20 -mr-20" />
                            <TrendingUp className="w-10 h-10 text-purple-300 mb-6" />
                            <h3 className="text-3xl font-black mb-2 tracking-tighter uppercase">92% <span className="text-sm opacity-60">Focus</span></h3>
                            <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-6">Your Mindset Consistency</p>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[92%] h-full bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showEditor && (
                    <JournalEditor
                        onClose={() => setShowEditor(false)}
                        onSave={handleCreateJournal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MindsetHub;

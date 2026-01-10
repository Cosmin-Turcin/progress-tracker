import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Dumbbell,
    Brain,
    Utensils,
    Briefcase,
    ArrowRight,
    Zap,
    Trophy,
    Users,
    Video,
    FileText,
    Calendar
} from 'lucide-react';
import Header from '../../components/Header';

const ModuleCard = ({ title, description, icon: Icon, color, path, stats, delay }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(path)}
            className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer h-full"
        >
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 w-fit mb-6 transition-transform group-hover:scale-110`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
            </div>

            <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">{title}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
                {description}
            </p>

            {stats && (
                <div className="flex gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                            <span className="text-lg font-black text-foreground">{stat.value}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 text-sm font-black text-primary group-hover:gap-3 transition-all">
                Open Hub <ArrowRight className="w-4 h-4" />
            </div>
        </motion.div>
    );
};

const HubDashboard = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col transition-colors">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl px-6 py-12 md:py-20">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4 tracking-tighter uppercase">
                            Ordomatic <span className="text-primary">Ecosystem</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl font-medium font-sans">
                            The unified interface for systemic growth. Your evolution across Fitness, Mindset, and Nutrition is now synchronized.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <ModuleCard
                        title="Fitness"
                        description="Build routines, host workouts, and earn points when the community evolves with you."
                        icon={Dumbbell}
                        color="bg-blue-600"
                        path="/fitness"
                        delay={0.1}
                        stats={[{ label: 'Routines', value: '12' }, { label: 'Earned', value: '450 pts' }]}
                    />
                    <ModuleCard
                        title="Mindset"
                        description="Share journals, publish articles, and explore video content for maximum focus."
                        icon={Brain}
                        color="bg-purple-600"
                        path="/mindset"
                        delay={0.2}
                        stats={[{ label: 'Articles', value: '8' }, { label: 'Reading', value: '10' }]}
                    />
                    <ModuleCard
                        title="Nutrition"
                        description="Optimize your fuel with structured meal plans and metabolic tracking."
                        icon={Utensils}
                        color="bg-emerald-600"
                        path="/nutrition"
                        delay={0.3}
                        stats={[{ label: 'Plans', value: '4' }, { label: 'Streak', value: '15d' }]}
                    />
                    <ModuleCard
                        title="Work"
                        description="Build your premium CV, showcase projects, and connect with elite talent."
                        icon={Briefcase}
                        color="bg-gray-900 dark:bg-gray-100 dark:text-gray-900"
                        path="/work"
                        delay={0.4}
                        stats={[{ label: 'Success', value: '98%' }, { label: 'Rank', value: 'Elite' }]}
                    />
                </div>

                {/* Quick Links & Recommendations Section */}
                <div className="grid lg:grid-cols-3 gap-12 border-t border-border pt-16">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                            <Zap className="w-6 h-6 text-warning" /> Recent in Feed
                        </h2>
                        <div className="space-y-4">
                            {[
                                { user: 'AlexR', action: 'created', item: 'Explosive Morning Power', type: 'Routine' },
                                { user: 'SarahV', action: 'published', item: 'The Architecture of Discipline', type: 'Article' },
                                { user: 'CoachK', action: 'shared', item: 'Performance Bulk v2', type: 'Meal Plan' }
                            ].map((activity, i) => (
                                <div key={i} className="bg-card p-6 rounded-[2rem] border border-border flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                                            {activity.user[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground uppercase tracking-tight">
                                                <span className="text-primary">{activity.user}</span> {activity.action} a new {activity.type}
                                            </p>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{activity.item}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-purple-600" /> Leaderboard
                        </h2>
                        <div className="bg-card p-6 rounded-3xl border border-border shadow-subtle">
                            {/* Simplified small leaderboard preview */}
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((pos) => (
                                    <div key={pos} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-muted-foreground/20 text-lg w-4">#{pos}</span>
                                            <div className="w-8 h-8 rounded-full bg-muted" />
                                            <div className="h-3 w-20 bg-muted rounded" />
                                        </div>
                                        <span className="font-bold text-muted-foreground/40 text-xs">...</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/friends-leaderboard')}
                                className="w-full mt-8 py-3 bg-muted text-muted-foreground rounded-xl text-sm font-black hover:bg-muted/80 transition-colors"
                            >
                                View All Rankings
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HubDashboard;

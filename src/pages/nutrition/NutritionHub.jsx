import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Utensils,
    Flame,
    Plus,
    Search,
    Filter,
    Apple,
    Droplets,
    Zap,
    Clock,
    Trophy,
    ChevronRight,
    Target,
    BarChart3
} from 'lucide-react';
import Header from '../../components/Header';
import MealPlanBuilder from './components/MealPlanBuilder';
import { useEcosystemPoints } from '../../hooks/useEcosystemPoints';

const PlanCard = ({ plan, onFollow }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all group cursor-pointer"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
                <Apple className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                {plan.goal}
            </div>
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-green-600 transition-colors uppercase tracking-tight">
            {plan.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-medium">
            {plan.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-gray-50 p-2 rounded-xl text-center">
                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter">Protein</span>
                <span className="text-xs font-black text-gray-900">{plan.macros.p}g</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl text-center">
                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter">Carbs</span>
                <span className="text-xs font-black text-gray-900">{plan.macros.c}g</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl text-center">
                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter">Fats</span>
                <span className="text-xs font-black text-gray-900">{plan.macros.f}g</span>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {plan.calories} kcal</span>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onFollow();
                }}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-black hover:bg-green-700 transition-colors"
            >
                FOLLOW
            </motion.button>
        </div>
    </motion.div>
);

const NutritionHub = () => {
    const [activeTab, setActiveTab] = useState('plans');
    const [showBuilder, setShowBuilder] = useState(false);
    const [plans, setPlans] = useState([
        {
            title: "Peak Metabolic Fire",
            description: "High-protein, moderate-fat approach optimized for steady energy and fat oxidation.",
            goal: "Fat Loss",
            calories: 2200,
            macros: { p: 180, c: 120, f: 60 },
            author: "Ordomatic"
        },
        {
            title: "Performance Bulk v2",
            description: "Surplus-driven nutrition targeting maximum muscle glycogen replenishment.",
            goal: "Muscle Gain",
            calories: 3100,
            macros: { p: 200, c: 450, f: 80 },
            author: "CoachK"
        },
        {
            title: "Ketogenic Focus Plan",
            description: "Strict ketogenic protocol designed for sustained cognitive focus and mood stability.",
            goal: "Focus",
            calories: 2000,
            macros: { p: 140, c: 30, f: 160 },
            author: "BioOptimize"
        }
    ]);

    const { awardPoints, trackUsage } = useEcosystemPoints();

    const handleCreatePlan = async (newPlan) => {
        // Award points for creation
        await awardPoints({
            points: 40,
            reason: 'Created a new meal plan',
            metadata: { type: 'nutrition_plan', title: newPlan.title, category: 'nutrition' }
        });

        setPlans([newPlan, ...plans]);
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
                            <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-200 text-white">
                                <Utensils className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase font-outline-2">
                                Nutrition <span className="text-green-600">Hub</span>
                            </h1>
                        </div>
                        <p className="text-lg text-gray-500 font-medium">
                            Architect your fuel. Share metabolic protocols and earn points when others thrive on your plans.
                        </p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-3xl font-black shadow-xl shadow-gray-200 group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        CREATE PLAN
                    </motion.button>
                </div>

                {/* Content Layout */}
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-8 mb-12 border-b border-gray-100 overflow-x-auto">
                            {['plans', 'recipes', 'tracking', 'supplements'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-black uppercase tracking-widest relative whitespace-nowrap ${activeTab === tab ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="nutritionTabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Verified Protocols</h2>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Find macros..."
                                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none w-48 transition-all"
                                        />
                                    </div>
                                    <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <Filter className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {plans.map((plan, i) => (
                                    <PlanCard
                                        key={i}
                                        plan={plan}
                                        onFollow={() => trackUsage({
                                            contentType: 'nutrition_plan',
                                            contentId: plan.title,
                                            creatorId: plan.author === 'Ordomatic' ? null : 'other_user',
                                            category: 'nutrition'
                                        })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Metabolic Dashboard Preview */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Metabolic Status
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">1,840</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In (kcal)</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">2,150</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Out (est)</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Protein Target</span>
                                    <span className="text-green-600">165 / 180g</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Hydration Widget */}
                        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <Droplets className="w-8 h-8 text-blue-200 mb-6" />
                            <h3 className="text-3xl font-black tracking-tighter uppercase mb-1">2.4 <span className="text-sm">L</span></h3>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-6">Hydration Level</p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">
                                Log 500ml
                            </button>
                        </div>

                        {/* Nutrition Wisdom */}
                        <div className="bg-green-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-green-200">
                            <Apple className="w-10 h-10 text-green-300 mb-6" />
                            <p className="text-lg font-black uppercase tracking-tight leading-relaxed">
                                "Micro-nutrients are the fine-tuning of the evolutionary engine."
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showBuilder && (
                    <MealPlanBuilder
                        onClose={() => setShowBuilder(false)}
                        onSave={handleCreatePlan}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default NutritionHub;

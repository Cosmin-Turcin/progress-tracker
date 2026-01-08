import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Apple,
    Zap,
    Target,
    Utensils,
    Clock,
    ChevronLeft,
    Share2,
    Bookmark,
    Heart,
    CheckCircle
} from 'lucide-react';

const MealPlanViewer = ({ plan, onClose }) => {
    if (!plan) return null;

    const macros = plan.macros || { p: plan.protein, c: plan.carbs, f: plan.fats };
    const meals = plan.meals || [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[95vh] mx-4"
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-8 py-12">
                        {/* Plan Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {plan.goal || 'Nutrition'}
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-400 font-medium">{formatDate(plan.created_at)}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
                            {plan.title}
                        </h1>

                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            {plan.description}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4 pb-10 mb-10 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg">
                                {(plan.user_profiles?.full_name || plan.user_profiles?.username || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">
                                    {plan.user_profiles?.full_name || plan.user_profiles?.username || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-400">Nutritionist</p>
                            </div>
                        </div>

                        {/* Macro Overview */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] p-8 mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white text-green-600 rounded-xl shadow-sm">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h2 className="font-black text-gray-900 uppercase tracking-tight">Daily Targets</h2>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <Zap className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{plan.calories}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calories</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                                    <p className="text-2xl font-black text-blue-600">{macros.p}g</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protein</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                                    <p className="text-2xl font-black text-amber-600">{macros.c}g</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carbs</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                                    <p className="text-2xl font-black text-purple-600">{macros.f}g</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fats</p>
                                </div>
                            </div>
                        </div>

                        {/* Meals */}
                        {meals.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                                        <Utensils className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-black text-gray-900 uppercase tracking-tight">Daily Structure</h2>
                                </div>

                                <div className="space-y-4">
                                    {meals.map((meal, index) => (
                                        <motion.div
                                            key={meal.id || index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-sm">
                                                    {index + 1}
                                                </div>
                                                <h3 className="font-black text-gray-900 uppercase tracking-tight">
                                                    {meal.name}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed pl-11">
                                                {meal.foods}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <button className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all uppercase tracking-widest">
                                <CheckCircle className="w-5 h-5" />
                                Start Following This Plan
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MealPlanViewer;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Save,
    Apple,
    Plus,
    Trash2,
    Zap,
    Target,
    Utensils,
    Droplets,
    Layout
} from 'lucide-react';

const MealPlanBuilder = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('Maintenance');
    const [calories, setCalories] = useState(2000);
    const [macros, setMacros] = useState({ p: 150, c: 200, f: 60 });
    const [meals, setMeals] = useState([
        { id: 1, name: 'Breakfast', foods: '' },
        { id: 2, name: 'Lunch', foods: '' },
        { id: 3, name: 'Dinner', foods: '' }
    ]);

    const addMeal = () => {
        setMeals([...meals, { id: Date.now(), name: 'New Meal', foods: '' }]);
    };

    const removeMeal = (id) => {
        setMeals(meals.filter(m => m.id !== id));
    };

    const updateMeal = (id, field, value) => {
        setMeals(meals.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            description,
            goal,
            calories,
            macros,
            meals,
            author: 'Me'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Protocol Architect</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Design your metabolic blueprint</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
                    {/* General Settings */}
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Layout className="w-4 h-4" /></div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Core Stats</h3>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Protocol Title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-xl font-black text-gray-900"
                                />
                                <textarea
                                    placeholder="Describe the metabolic strategy..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none min-h-[100px] font-medium text-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Calories</label>
                                    <input
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-gray-900 text-center"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nutritional Goal</label>
                                    <select
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-gray-900 appearance-none text-center"
                                    >
                                        <option>Maintenance</option>
                                        <option>Muscle Gain</option>
                                        <option>Fat Loss</option>
                                        <option>Performance</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Macros Breakdown */}
                        <div className="bg-gray-50 p-8 rounded-[2rem] space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white text-green-600 rounded-xl shadow-sm"><Target className="w-4 h-4" /></div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Macro Splits</h3>
                            </div>

                            {['p', 'c', 'f'].map((macro) => (
                                <div key={macro} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">
                                            {macro === 'p' ? 'Protein' : macro === 'c' ? 'Carbohydrates' : 'Fats'}
                                        </span>
                                        <span className="text-gray-900">{macros[macro]}g</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={macros[macro]}
                                        onChange={(e) => setMacros({ ...macros, [macro]: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                                    />
                                </div>
                            ))}

                            <div className="pt-4 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Caloric Estimate</span>
                                <span className="text-lg font-black text-green-600 uppercase">
                                    {macros.p * 4 + macros.c * 4 + macros.f * 9} kcal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Meals Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Utensils className="w-4 h-4" /></div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Daily Structure</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addMeal}
                                className="flex items-center gap-2 text-xs font-black text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl transition-all"
                            >
                                <Plus className="w-4 h-4" /> ADD MEAL
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {meals.map((meal, index) => (
                                <motion.div
                                    key={meal.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-6 rounded-[2rem] border border-gray-100 relative group shadow-sm hover:border-green-200 transition-all"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={meal.name}
                                            onChange={(e) => updateMeal(meal.id, 'name', e.target.value)}
                                            className="bg-transparent border-none outline-none font-black text-gray-900 uppercase tracking-tight text-lg w-full focus:text-green-600"
                                        />
                                        <button
                                            onClick={() => removeMeal(meal.id)}
                                            className="p-2 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        placeholder="Foods and quantities..."
                                        value={meal.foods}
                                        onChange={(e) => updateMeal(meal.id, 'foods', e.target.value)}
                                        className="w-full bg-gray-50 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-600 text-sm min-h-[80px]"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>{meals.length} Meals</span>
                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                        <span>Verified Strategy</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-3 px-12 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 hover:scale-105 transition-all uppercase tracking-widest text-sm"
                    >
                        <Save className="w-5 h-5" /> PUBLISH PROTOCOL
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MealPlanBuilder;

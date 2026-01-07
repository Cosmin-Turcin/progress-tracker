import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Plus,
    Trash2,
    Save,
    Clock,
    Dumbbell,
    Video,
    Type,
    Layout,
    MessageSquare
} from 'lucide-react';

const RoutineBuilder = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(30);
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [videoUrl, setVideoUrl] = useState('');
    const [exercises, setExercises] = useState([
        { id: 1, name: '', sets: '', reps: '', duration: '', notes: '' }
    ]);

    const addExercise = () => {
        setExercises([...exercises, { id: Date.now(), name: '', sets: '', reps: '', duration: '', notes: '' }]);
    };

    const removeExercise = (id) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    const updateExercise = (id, field, value) => {
        setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            description,
            duration,
            difficulty,
            videoUrl,
            exercises
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
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">New Routine</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Design your evolution</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* General Info Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layout className="w-4 h-4" /></div>
                            <h3 className="font-black text-gray-900 uppercase tracking-tight">Main Details</h3>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Routine Title (e.g. Spartan Strength)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold text-gray-900"
                            />
                            <textarea
                                placeholder="What is the focus of this workout?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] text-gray-600 font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Duration (min)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold appearance-none"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Elite</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Instructional Video URL</label>
                            <div className="relative">
                                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="https://youtube.com/..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Exercises Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Dumbbell className="w-4 h-4" /></div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Exercises</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addExercise}
                                className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Move
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {exercises.map((ex, index) => (
                                    <motion.div
                                        key={ex.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-gray-50 p-6 rounded-2xl relative group"
                                    >
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-12 md:col-span-6">
                                                <input
                                                    type="text"
                                                    placeholder="Exercise name"
                                                    value={ex.name}
                                                    onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Sets"
                                                    value={ex.sets}
                                                    onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Reps"
                                                    value={ex.reps}
                                                    onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Secs"
                                                    value={ex.duration}
                                                    onChange={(e) => updateExercise(ex.id, 'duration', e.target.value)}
                                                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeExercise(ex.id)}
                                            className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>

                {/* Action Bar */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {exercises.length} Exercises defined
                    </p>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all"
                    >
                        <Save className="w-5 h-5" /> PUBLISH ROUTINE
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RoutineBuilder;

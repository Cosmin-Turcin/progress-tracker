import React, { useState } from 'react';
import { Plus, X, Wrench } from 'lucide-react';

const SKILL_CATEGORIES = [
    { value: 'programming', label: 'Programming', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'design', label: 'Design', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { value: 'business', label: 'Business', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'tools', label: 'Tools', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'language', label: 'Languages', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const SKILL_LEVELS = [
    { value: 'beginner', label: 'Beginner', width: '25%' },
    { value: 'intermediate', label: 'Intermediate', width: '50%' },
    { value: 'advanced', label: 'Advanced', width: '75%' },
    { value: 'expert', label: 'Expert', width: '100%' },
];

export default function SkillsEditor({ skills = [], onChange }) {
    const [newSkill, setNewSkill] = useState({ name: '', category: 'programming', level: 'intermediate', yearsExp: '' });

    const addSkill = () => {
        if (!newSkill.name.trim()) return;

        // Check if skill already exists
        if (skills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
            return;
        }

        onChange([...skills, {
            ...newSkill,
            id: Date.now().toString(),
            name: newSkill.name.trim()
        }]);
        setNewSkill({ name: '', category: 'programming', level: 'intermediate', yearsExp: '' });
    };

    const removeSkill = (id) => {
        onChange(skills.filter(s => s.id !== id));
    };

    const updateSkill = (id, field, value) => {
        onChange(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const getCategoryStyle = (category) => {
        return SKILL_CATEGORIES.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const groupedSkills = SKILL_CATEGORIES.map(cat => ({
        ...cat,
        skills: skills.filter(s => s.category === cat.value)
    })).filter(cat => cat.skills.length > 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Expertise</h2>
                <p className="text-gray-500">Add your professional skills with proficiency levels</p>
            </div>

            {/* Add Skill Form */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4">Add New Skill</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Skill Name *</label>
                        <input
                            type="text"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="e.g., JavaScript, Figma, Project Management"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                        <select
                            value={newSkill.category}
                            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {SKILL_CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Level</label>
                        <select
                            value={newSkill.level}
                            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {SKILL_LEVELS.map(lvl => (
                                <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Years of Experience (Optional)</label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={newSkill.yearsExp}
                            onChange={(e) => setNewSkill({ ...newSkill, yearsExp: e.target.value })}
                            placeholder="e.g., 5"
                            className="w-32 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                    </div>
                    <button
                        onClick={addSkill}
                        disabled={!newSkill.name.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" /> Add Skill
                    </button>
                </div>
            </div>

            {/* Skills Display */}
            {skills.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No skills added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Use the form above to add your skills</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedSkills.map(group => (
                        <div key={group.value}>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                {group.label} ({group.skills.length})
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {group.skills.map(skill => (
                                    <div
                                        key={skill.id}
                                        className={`relative flex items-center justify-between p-4 rounded-xl border ${getCategoryStyle(skill.category)} group`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold">{skill.name}</span>
                                                {skill.yearsExp && (
                                                    <span className="text-xs opacity-70">{skill.yearsExp}y exp</span>
                                                )}
                                            </div>
                                            <div className="mt-2 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-current rounded-full transition-all"
                                                    style={{ width: SKILL_LEVELS.find(l => l.value === skill.level)?.width }}
                                                />
                                            </div>
                                            <span className="text-xs opacity-70 mt-1 block capitalize">{skill.level}</span>
                                        </div>
                                        <button
                                            onClick={() => removeSkill(skill.id)}
                                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {skills.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <span className="text-2xl font-black text-gray-900">{skills.length}</span>
                    <span className="text-gray-500 ml-2">skills added across {groupedSkills.length} categories</span>
                </div>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';

const PROFICIENCY_LEVELS = [
    { value: 'native', label: 'Native', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'fluent', label: 'Fluent', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'professional', label: 'Professional', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const COMMON_LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Mandarin Chinese',
    'Japanese', 'Korean', 'Portuguese', 'Italian', 'Russian',
    'Arabic', 'Hindi', 'Dutch', 'Polish', 'Swedish'
];

export default function LanguageEditor({ languages = [], onChange }) {
    const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'intermediate' });

    const addLanguage = () => {
        if (!newLanguage.language.trim()) return;

        // Check if language already exists
        if (languages.some(l => l.language.toLowerCase() === newLanguage.language.toLowerCase())) {
            return;
        }

        onChange([...languages, {
            ...newLanguage,
            id: Date.now().toString(),
            language: newLanguage.language.trim()
        }]);
        setNewLanguage({ language: '', proficiency: 'intermediate' });
    };

    const removeLanguage = (id) => {
        onChange(languages.filter(l => l.id !== id));
    };

    const getProficiencyStyle = (proficiency) => {
        return PROFICIENCY_LEVELS.find(p => p.value === proficiency)?.color || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getProficiencyLabel = (proficiency) => {
        return PROFICIENCY_LEVELS.find(p => p.value === proficiency)?.label || proficiency;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Languages</h2>
                <p className="text-gray-500">Add the languages you speak</p>
            </div>

            {/* Add Language Form */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4">Add Language</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Language *</label>
                        <input
                            type="text"
                            list="common-languages"
                            value={newLanguage.language}
                            onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                            placeholder="e.g., English"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                        <datalist id="common-languages">
                            {COMMON_LANGUAGES.map(lang => (
                                <option key={lang} value={lang} />
                            ))}
                        </datalist>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Proficiency Level</label>
                        <select
                            value={newLanguage.proficiency}
                            onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {PROFICIENCY_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={addLanguage}
                            disabled={!newLanguage.language.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Languages Display */}
            {languages.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No languages added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Use the form above to add languages</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {languages.map(lang => (
                        <div
                            key={lang.id}
                            className={`relative flex items-center justify-between p-4 rounded-xl border ${getProficiencyStyle(lang.proficiency)} group`}
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 opacity-70" />
                                <div>
                                    <span className="font-bold">{lang.language}</span>
                                    <span className="text-xs ml-2 opacity-70">({getProficiencyLabel(lang.proficiency)})</span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeLanguage(lang.id)}
                                className="p-1 rounded-full hover:bg-black/10 opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Proficiency Guide */}
            <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Proficiency Guide</h4>
                <div className="grid grid-cols-5 gap-2 text-xs">
                    {PROFICIENCY_LEVELS.map(level => (
                        <div key={level.value} className={`p-2 rounded-lg text-center ${level.color}`}>
                            <span className="font-bold">{level.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

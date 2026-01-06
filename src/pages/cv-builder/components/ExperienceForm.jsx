import React from 'react';
import { Plus, Trash2, Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';

const JOB_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
];

export default function ExperienceForm({ experiences = [], onChange }) {
    const addExperience = () => {
        onChange([
            ...experiences,
            {
                id: Date.now().toString(),
                title: '',
                company: '',
                location: '',
                type: 'full-time',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                highlights: [],
            }
        ]);
    };

    const updateExperience = (id, field, value) => {
        onChange(experiences.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const removeExperience = (id) => {
        onChange(experiences.filter(exp => exp.id !== id));
    };

    const addHighlight = (id, highlight) => {
        if (!highlight.trim()) return;
        onChange(experiences.map(exp =>
            exp.id === id
                ? { ...exp, highlights: [...(exp.highlights || []), highlight.trim()] }
                : exp
        ));
    };

    const removeHighlight = (id, index) => {
        onChange(experiences.map(exp =>
            exp.id === id
                ? { ...exp, highlights: exp.highlights.filter((_, i) => i !== index) }
                : exp
        ));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
                    <p className="text-gray-500">Add your professional work history</p>
                </div>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
            </div>

            {experiences.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No work experience added yet</p>
                    <button
                        onClick={addExperience}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Add your first experience
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    #{index + 1}
                                </span>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Job Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Job Title *</label>
                                    <input
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                        placeholder="e.g., Senior Software Engineer"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Company *</label>
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        placeholder="e.g., Google"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={exp.location || ''}
                                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                            placeholder="e.g., San Francisco, CA"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Employment Type</label>
                                    <select
                                        value={exp.type || 'full-time'}
                                        onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                                    >
                                        {JOB_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date *</label>
                                    <input
                                        type="month"
                                        value={exp.startDate || ''}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="month"
                                            value={exp.endDate || ''}
                                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                            disabled={exp.current}
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={exp.current || false}
                                                onChange={(e) => {
                                                    updateExperience(exp.id, 'current', e.target.checked);
                                                    if (e.target.checked) updateExperience(exp.id, 'endDate', '');
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            Current
                                        </label>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                    <textarea
                                        value={exp.description || ''}
                                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        placeholder="Describe your role, responsibilities, and impact..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none"
                                    />
                                </div>

                                {/* Key Achievements */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Key Achievements</label>
                                    <input
                                        type="text"
                                        placeholder="Press Enter to add an achievement..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addHighlight(exp.id, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                    {exp.highlights && exp.highlights.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {exp.highlights.map((highlight, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    <span className="flex-1">{highlight}</span>
                                                    <button
                                                        onClick={() => removeHighlight(exp.id, i)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >×</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

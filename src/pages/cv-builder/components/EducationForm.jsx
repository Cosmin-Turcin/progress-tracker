import React from 'react';
import { Plus, Trash2, GraduationCap, MapPin } from 'lucide-react';

export default function EducationForm({ education = [], onChange }) {
    const addEducation = () => {
        onChange([
            ...education,
            {
                id: Date.now().toString(),
                degree: '',
                field: '',
                school: '',
                location: '',
                startYear: '',
                endYear: '',
                gpa: '',
                honors: '',
            }
        ]);
    };

    const updateEducation = (id, field, value) => {
        onChange(education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
    };

    const removeEducation = (id) => {
        onChange(education.filter(edu => edu.id !== id));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
                    <p className="text-gray-500">Add your educational background</p>
                </div>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Education
                </button>
            </div>

            {education.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No education added yet</p>
                    <button
                        onClick={addEducation}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Add your first degree
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {education.map((edu, index) => (
                        <div key={edu.id} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    #{index + 1}
                                </span>
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Degree */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Degree *</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        placeholder="e.g., Bachelor of Science"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Field of Study */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Field of Study *</label>
                                    <input
                                        type="text"
                                        value={edu.field || ''}
                                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                        placeholder="e.g., Computer Science"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* School */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">School / University *</label>
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                        placeholder="e.g., Massachusetts Institute of Technology"
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
                                            value={edu.location || ''}
                                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                            placeholder="e.g., Cambridge, MA"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Start Year */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Year</label>
                                    <select
                                        value={edu.startYear || ''}
                                        onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Select year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* End Year */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">End Year (or Expected)</label>
                                    <select
                                        value={edu.endYear || ''}
                                        onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Select year</option>
                                        {Array.from({ length: 55 }, (_, i) => currentYear + 5 - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* GPA */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">GPA (Optional)</label>
                                    <input
                                        type="text"
                                        value={edu.gpa || ''}
                                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                        placeholder="e.g., 3.8 / 4.0"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Honors */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Honors / Awards</label>
                                    <input
                                        type="text"
                                        value={edu.honors || ''}
                                        onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                                        placeholder="e.g., Magna Cum Laude, Dean's List"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

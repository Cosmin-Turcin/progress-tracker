import React from 'react';
import { Plus, Trash2, FolderOpen, ExternalLink, Calendar } from 'lucide-react';

export default function ProjectForm({ projects = [], onChange }) {
    const addProject = () => {
        onChange([
            ...projects,
            {
                id: Date.now().toString(),
                name: '',
                description: '',
                url: '',
                technologies: [],
                startDate: '',
                endDate: '',
            }
        ]);
    };

    const updateProject = (id, field, value) => {
        onChange(projects.map(proj =>
            proj.id === id ? { ...proj, [field]: value } : proj
        ));
    };

    const removeProject = (id) => {
        onChange(projects.filter(proj => proj.id !== id));
    };

    const addTechnology = (id, tech) => {
        if (!tech.trim()) return;
        onChange(projects.map(proj =>
            proj.id === id
                ? { ...proj, technologies: [...(proj.technologies || []), tech.trim()] }
                : proj
        ));
    };

    const removeTechnology = (id, index) => {
        onChange(projects.map(proj =>
            proj.id === id
                ? { ...proj, technologies: proj.technologies.filter((_, i) => i !== index) }
                : proj
        ));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
                    <p className="text-gray-500">Showcase your personal and professional projects</p>
                </div>
                <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No projects added yet</p>
                    <button
                        onClick={addProject}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Add your first project
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {projects.map((proj, index) => (
                        <div key={proj.id} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    #{index + 1}
                                </span>
                                <button
                                    onClick={() => removeProject(proj.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Project Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Project Name *</label>
                                    <input
                                        type="text"
                                        value={proj.name}
                                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                        placeholder="e.g., E-commerce Platform"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Project URL */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Project URL</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={proj.url || ''}
                                            onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                                            placeholder="https://github.com/..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="month"
                                        value={proj.startDate || ''}
                                        onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                                    <input
                                        type="month"
                                        value={proj.endDate || ''}
                                        onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                    <textarea
                                        value={proj.description || ''}
                                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                        placeholder="Describe the project, your role, and the impact..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none"
                                    />
                                </div>

                                {/* Technologies */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Technologies Used</label>
                                    <input
                                        type="text"
                                        placeholder="Press Enter to add (e.g., React, Node.js)"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addTechnology(proj.id, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {proj.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                                >
                                                    {tech}
                                                    <button
                                                        onClick={() => removeTechnology(proj.id, i)}
                                                        className="hover:text-purple-900"
                                                    >×</button>
                                                </span>
                                            ))}
                                        </div>
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

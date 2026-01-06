import React from 'react';

export default function ProgressIndicator({ cvData }) {
    const sections = [
        { id: 'basics', label: 'Basics', check: () => cvData.headline || cvData.summary },
        { id: 'experience', label: 'Experience', check: () => cvData.experience?.length > 0 },
        { id: 'education', label: 'Education', check: () => cvData.education?.length > 0 },
        { id: 'skills', label: 'Skills', check: () => cvData.skills?.length > 0 },
        { id: 'certifications', label: 'Certs', check: () => cvData.certifications?.length > 0 },
        { id: 'projects', label: 'Projects', check: () => cvData.projects?.length > 0 },
        { id: 'languages', label: 'Languages', check: () => cvData.languages?.length > 0 },
    ];

    const completedCount = sections.filter(s => s.check()).length;
    const percentage = Math.round((completedCount / sections.length) * 100);

    return (
        <div className="flex items-center gap-3">
            {/* Progress Ring */}
            <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200"
                    />
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(percentage / 100) * 125.6} 125.6`}
                        strokeLinecap="round"
                        className={percentage === 100 ? 'text-green-500' : 'text-blue-600'}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                    {percentage}%
                </span>
            </div>
            <div className="text-sm">
                <p className="font-bold text-gray-900">{completedCount}/{sections.length}</p>
                <p className="text-gray-500 text-xs">sections</p>
            </div>
        </div>
    );
}

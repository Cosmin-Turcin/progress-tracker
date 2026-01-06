import React from 'react';
import { Briefcase, GraduationCap, Award, Wrench, FolderOpen, Globe, MapPin, Calendar, ExternalLink, Mail, User } from 'lucide-react';

export default function CVPreview({ cvData, profile }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Preview</h2>
                    <p className="text-gray-500">This is how your profile appears to recruiters</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                >
                    Print / Download PDF
                </button>
            </div>

            {/* Preview Container */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg print:shadow-none print:border-none">
                {/* Header */}
                <div className="border-b-2 border-gray-900 pb-6 mb-8">
                    <div className="flex items-start gap-6">
                        {profile?.avatar_url && (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 print:w-20 print:h-20"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-gray-900">
                                {profile?.full_name || 'Your Name'}
                            </h1>
                            {cvData.headline && (
                                <p className="text-lg text-blue-600 font-semibold mt-1">{cvData.headline}</p>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                {profile?.email && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" /> {profile.email}
                                    </span>
                                )}
                                {profile?.username && (
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" /> @{profile.username}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right text-sm space-y-1">
                            {cvData.availability && cvData.availability !== 'not-looking' && (
                                <span className={`inline-block px-3 py-1 rounded-full font-bold ${cvData.availability === 'looking'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {cvData.availability === 'looking' ? 'Actively Looking' : 'Open to Opportunities'}
                                </span>
                            )}
                            {cvData.remotePreference && cvData.remotePreference !== 'flexible' && (
                                <p className="text-gray-500 capitalize">{cvData.remotePreference}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {cvData.summary && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" /> Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {cvData.experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <Briefcase className="w-5 h-5 text-blue-600" /> Experience
                        </h2>
                        <div className="space-y-6">
                            {cvData.experience.map(exp => (
                                <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200">
                                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full" />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                            <p className="text-blue-600 font-medium">{exp.company}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                                            {exp.location && <p className="flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" />{exp.location}</p>}
                                        </div>
                                    </div>
                                    {exp.description && <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>}
                                    {exp.highlights?.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.highlights.map((h, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">•</span> {h}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {cvData.education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" /> Education
                        </h2>
                        <div className="space-y-4">
                            {cvData.education.map(edu => (
                                <div key={edu.id} className="flex justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                        <p className="text-gray-600">{edu.school}</p>
                                        {edu.honors && <p className="text-sm text-amber-600 font-medium">{edu.honors}</p>}
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>{edu.startYear} – {edu.endYear}</p>
                                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {cvData.skills?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <Wrench className="w-5 h-5 text-blue-600" /> Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {cvData.skills.map(skill => (
                                <span
                                    key={skill.id}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                    {skill.name}
                                    {skill.level === 'expert' && ' ★'}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {cvData.certifications?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <Award className="w-5 h-5 text-blue-600" /> Certifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {cvData.certifications.map(cert => (
                                <div key={cert.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                                        <p className="text-gray-500 text-sm">{cert.issuer}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{formatDate(cert.issueDate)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {cvData.projects?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FolderOpen className="w-5 h-5 text-blue-600" /> Projects
                        </h2>
                        <div className="space-y-4">
                            {cvData.projects.map(proj => (
                                <div key={proj.id}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                                    {proj.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {proj.technologies.map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">{tech}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {cvData.languages?.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <Globe className="w-5 h-5 text-blue-600" /> Languages
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {cvData.languages.map(lang => (
                                <span key={lang.id} className="text-sm">
                                    <span className="font-bold text-gray-900">{lang.language}</span>
                                    <span className="text-gray-500 ml-1">({lang.proficiency})</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

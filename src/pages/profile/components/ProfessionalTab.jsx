import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, GraduationCap, Award, Edit2, Save, X, Plus, Trash2, ChevronRight, Globe, FolderOpen, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfessionalTab({ targetProfile, isReadOnly = false, embedded = false }) {
    const navigate = useNavigate();
    const { profile: currentUserProfile, updateProfile } = useAuth();
    const effectiveProfile = targetProfile || currentUserProfile;

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profData, setProfData] = useState({
        headline: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        languages: [],
        availability: 'not-looking',
        remotePreference: 'flexible',
    });

    // Sync profData with profile when profile loads or when not editing
    React.useEffect(() => {
        if (!isEditing && effectiveProfile?.professional_data) {
            const pd = effectiveProfile.professional_data;
            setProfData({
                headline: pd.headline || '',
                summary: pd.summary || '',
                experience: pd.experience || [],
                education: pd.education || [],
                skills: pd.skills || [],
                certifications: pd.certifications || [],
                projects: pd.projects || [],
                languages: pd.languages || [],
                availability: pd.availability || 'not-looking',
                remotePreference: pd.remotePreference || 'flexible',
            });
        }
    }, [effectiveProfile, isEditing]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({
                professional_data: profData
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving professional data:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const addExperience = () => {
        setProfData({
            ...profData,
            experience: [...profData.experience, { id: Date.now(), title: "", company: "", period: "", description: "" }]
        });
    };

    const updateExperience = (id, field, value) => {
        setProfData({
            ...profData,
            experience: profData.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        });
    };

    const removeExperience = (id) => {
        setProfData({
            ...profData,
            experience: profData.experience.filter(exp => exp.id !== id)
        });
    };

    const addEducation = () => {
        setProfData({
            ...profData,
            education: [...profData.education, { id: Date.now(), degree: "", school: "", period: "" }]
        });
    };

    const updateEducation = (id, field, value) => {
        setProfData({
            ...profData,
            education: profData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        });
    };

    const removeEducation = (id) => {
        setProfData({
            ...profData,
            education: profData.education.filter(edu => edu.id !== id)
        });
    };

    const addSkill = (skill) => {
        if (skill && !profData.skills.includes(skill)) {
            setProfData({
                ...profData,
                skills: [...profData.skills, skill]
            });
        }
    };

    const removeSkill = (skill) => {
        setProfData({
            ...profData,
            skills: profData.skills.filter(s => s !== skill)
        });
    };

    const SectionHeader = ({ icon: Icon, title, onAdd }) => (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            {isEditing && onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            )}
        </div>
    );

    return (
        <div className={embedded ? "w-full p-6 md:p-8" : "max-w-4xl mx-auto py-8 px-4"}>
            {/* Resume-like Header for Embedded Mode */}
            {embedded && (
                <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-gray-900" />
                            Professional History
                        </h2>
                        <p className="text-gray-500 font-medium mt-1">Digital Curriculum Vitae</p>
                        {profData.headline && (
                            <p className="text-lg text-blue-600 font-bold mt-2">{profData.headline}</p>
                        )}
                    </div>
                    {!isReadOnly && (
                        <div className="flex gap-2 print:hidden">
                            <button
                                onClick={() => navigate('/cv-builder')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm shadow-md"
                            >
                                <Edit2 className="w-4 h-4" /> Full CV Builder
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-bold text-sm shadow-md"
                            >
                                {isEditing ? <><X className="w-4 h-4" /> Exit Editing</> : <><Edit2 className="w-4 h-4" /> Quick Edit</>}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="ml-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-sm shadow-md disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Only show standard header if NOT embedded */}
            {!embedded && (
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Professional Background</h2>
                        <p className="text-gray-500 mt-1">Manage your professional identity and accomplishments</p>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setProfData(effectiveProfile?.professional_data || { experience: [], education: [], skills: [], summary: "" });
                                        setIsEditing(false);
                                    }}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save CV</>}
                                </button>
                            </>
                        ) : !isReadOnly && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold shadow-xl"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            )}

            {embedded && !isReadOnly && (
                /* Hide old embedded controls since we moved them up */
                <></>
            )}

            <div className="space-y-12">
                {/* Professional Summary */}
                <section>
                    <SectionHeader icon={Award} title="Professional Summary" />
                    {isEditing ? (
                        <textarea
                            value={profData.summary}
                            onChange={(e) => setProfData({ ...profData, summary: e.target.value })}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            rows={4}
                            placeholder="Write a brief professional summary..."
                        />
                    ) : (
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {profData.summary || "No professional summary added yet. Click edit to build your profile."}
                        </p>
                    )}
                </section>

                {/* Work Experience */}
                <section className="print:break-inside-avoid">
                    <SectionHeader icon={Briefcase} title="Experience" onAdd={addExperience} />
                    <div className="space-y-8">
                        {(profData.experience || []).length === 0 && !isEditing && (
                            <p className="text-gray-500 italic">No work experience listed</p>
                        )}
                        {(profData.experience || []).map((exp) => (
                            <div key={exp.id} className="relative group">
                                {isEditing && (
                                    <button
                                        onClick={() => removeExperience(exp.id)}
                                        className="absolute -right-2 -top-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <input
                                            placeholder="Job Title"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            placeholder="Company"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            placeholder="Period (e.g., 2020 - Present)"
                                            value={exp.period}
                                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <textarea
                                            placeholder="Key Responsibilities & Achievements"
                                            value={exp.description}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                            className="col-span-2 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            rows={3}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Briefcase className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xl font-bold text-gray-900">{exp.title}</h4>
                                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{exp.period}</span>
                                            </div>
                                            <p className="text-gray-600 font-semibold mb-3">{exp.company}</p>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section className="print:break-inside-avoid">
                    <SectionHeader icon={GraduationCap} title="Education" onAdd={addEducation} />
                    <div className="space-y-6">
                        {(profData.education || []).length === 0 && !isEditing && (
                            <p className="text-gray-500 italic">No education listed</p>
                        )}
                        {(profData.education || []).map((edu) => (
                            <div key={edu.id} className="relative group">
                                {isEditing && (
                                    <button
                                        onClick={() => removeEducation(edu.id)}
                                        className="absolute -right-2 -top-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <input
                                            placeholder="Degree / Program"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            placeholder="School / University"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            placeholder="Period"
                                            value={edu.period}
                                            onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                                <p className="text-sm text-gray-500">{edu.school}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">{edu.period}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <SectionHeader icon={Award} title="Expertise & Skills" />
                    <div className="flex flex-wrap gap-3">
                        {(profData.skills || []).map((skill, index) => {
                            // Handle both string and object skill formats
                            const skillName = typeof skill === 'string' ? skill : (skill?.name || '');
                            const skillKey = typeof skill === 'string' ? skill : (skill?.id || index);

                            if (!skillName) return null;

                            return (
                                <span
                                    key={skillKey}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${isEditing
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {skillName}
                                    {isEditing && (
                                        <button onClick={() => removeSkill(skill)} className="hover:text-blue-900">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </span>
                            );
                        })}
                        {isEditing && (
                            <input
                                type="text"
                                placeholder="Add skill..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addSkill(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="px-4 py-2 rounded-xl text-sm border-2 border-dashed border-gray-200 focus:border-blue-500 outline-none transition w-32"
                            />
                        )}
                    </div>
                </section>

                {/* Certifications - Read Only Display */}
                {profData.certifications?.length > 0 && (
                    <section>
                        <SectionHeader icon={Award} title="Certifications" />
                        <div className="space-y-3">
                            {profData.certifications.map((cert, index) => (
                                <div key={cert.id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{cert.name}</h4>
                                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                                        {cert.issueDate && (
                                            <span className="text-xs text-gray-500">Issued: {cert.issueDate}</span>
                                        )}
                                    </div>
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" /> View
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects - Read Only Display */}
                {profData.projects?.length > 0 && (
                    <section>
                        <SectionHeader icon={FolderOpen} title="Projects" />
                        <div className="grid md:grid-cols-2 gap-4">
                            {profData.projects.map((project, index) => (
                                <div key={project.id || index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                                        {project.url && (
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                                    )}
                                    {project.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 bg-white rounded-full text-purple-700 border border-purple-200">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages - Read Only Display */}
                {profData.languages?.length > 0 && (
                    <section>
                        <SectionHeader icon={Globe} title="Languages" />
                        <div className="flex flex-wrap gap-3">
                            {profData.languages.map((lang, index) => {
                                const langName = typeof lang === 'string' ? lang : (lang?.language || '');
                                const proficiency = typeof lang === 'object' ? lang?.proficiency : 'Professional';

                                if (!langName) return null;

                                return (
                                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl">
                                        <Globe className="w-4 h-4" />
                                        <span className="font-bold">{langName}</span>
                                        {proficiency && (
                                            <span className="text-xs opacity-70">({proficiency})</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Availability Badge */}
                {(profData.availability && profData.availability !== 'not-looking') && (
                    <section>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 font-bold text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {profData.availability === 'looking' ? 'Actively Looking for Opportunities' : 'Open to Opportunities'}
                            {profData.remotePreference && profData.remotePreference !== 'flexible' && (
                                <span className="text-green-600 font-normal">• {profData.remotePreference}</span>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

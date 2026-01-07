import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Edit2, Save, X, Plus, Trash2, ChevronRight, Globe, FolderOpen, ExternalLink, Calendar, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const TimelineItem = ({ children, icon: Icon, isLast }) => (
    <div className="relative pl-8 pb-10">
        {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-100" />}
        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10 shadow-sm">
            <Icon className="w-4 h-4 text-blue-600" />
        </div>
        {children}
    </div>
);

const SidebarCard = ({ title, icon: Icon, children, colorClass = "bg-blue-50 text-blue-600" }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        {children}
    </div>
);

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

    const SectionHeader = ({ icon: Icon, title, onAdd, light = false }) => (
        <div className={`flex items-center justify-between mb-8 ${!light ? 'pb-2 border-b-2 border-gray-900 group' : ''}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${light ? 'bg-blue-50 text-blue-600' : 'bg-gray-900 text-white'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight ${light ? 'text-gray-900' : 'text-gray-900'}`}>{title}</h3>
            </div>
            {isEditing && onAdd && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAdd}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Entry
                </motion.button>
            )}
        </div>
    );

    return (
        <div className={embedded ? "w-full p-6 md:p-12 bg-white" : "max-w-6xl mx-auto py-12 px-6"}>
            {/* Premium Header */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-10 border-b-2 border-gray-100 ${embedded ? '' : 'mt-8'}`}>
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                {embedded ? "Digital Portfolio" : "Professional Identity"}
                            </h2>
                            <p className="text-gray-500 font-medium">Curated Professional History & Skills</p>
                        </div>
                    </div>
                    {profData.headline && (
                        <p className="text-xl text-blue-600 font-bold bg-blue-50/50 px-4 py-1 rounded-lg inline-block">{profData.headline}</p>
                    )}
                </div>

                {!isReadOnly && (
                    <div className="flex flex-wrap gap-3 print:hidden">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/cv-builder')}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black text-sm shadow-xl shadow-blue-100"
                        >
                            <Edit2 className="w-4 h-4" /> Open CV Builder
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition font-black text-sm shadow-xl ${isEditing
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                                }`}
                        >
                            {isEditing ? <><X className="w-4 h-4" /> Exit Edit</> : <><Edit2 className="w-4 h-4" /> Quick Edit</>}
                        </motion.button>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition font-black text-sm shadow-xl shadow-green-100 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-12">

                {/* Main Column: Experience & Education */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Professional Summary */}
                    <section className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <SectionHeader icon={Award} title="The Narrative" light />
                        {isEditing ? (
                            <textarea
                                value={profData.summary}
                                onChange={(e) => setProfData({ ...profData, summary: e.target.value })}
                                className="w-full p-6 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none resize-none font-medium text-gray-700"
                                rows={5}
                                placeholder="Tell your professional story..."
                            />
                        ) : (
                            <p className="text-gray-700 text-lg leading-relaxed font-medium">
                                {profData.summary || "This user hasn't added a professional narrative yet."}
                            </p>
                        )}
                    </section>

                    {/* Work Experience Timeline */}
                    <section>
                        <SectionHeader icon={Briefcase} title="Career Journey" onAdd={addExperience} />
                        <div className="mt-8">
                            {(profData.experience || []).length === 0 && !isEditing ? (
                                <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <p className="text-gray-400 font-medium italic">No milestones recorded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    {(profData.experience || []).map((exp, idx) => (
                                        <TimelineItem
                                            key={exp.id}
                                            icon={Briefcase}
                                            isLast={idx === (profData.experience || []).length - 1}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group relative"
                                            >
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeExperience(exp.id)}
                                                        className="absolute -right-3 -top-3 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-lg opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {isEditing ? (
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <input
                                                            placeholder="Job Title"
                                                            value={exp.title}
                                                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                        />
                                                        <input
                                                            placeholder="Company"
                                                            value={exp.company}
                                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                        <input
                                                            placeholder="Period (e.g., 2020 - Present)"
                                                            value={exp.period}
                                                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-600"
                                                        />
                                                        <textarea
                                                            placeholder="Role achievements..."
                                                            value={exp.description}
                                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                            className="col-span-2 w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                                                            <div>
                                                                <h4 className="text-xl font-black text-gray-900 leading-tight mb-1">{exp.title}</h4>
                                                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                                                    <Building2 className="w-4 h-4" />
                                                                    {exp.company}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-black whitespace-nowrap shadow-sm border border-blue-100">
                                                                <Calendar className="w-4 h-4" />
                                                                {exp.period}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line border-l-4 border-gray-50 pl-4">
                                                            {exp.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </TimelineItem>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Education Timeline */}
                    <section>
                        <SectionHeader icon={GraduationCap} title="Education" onAdd={addEducation} />
                        <div className="mt-8">
                            {(profData.education || []).map((edu, idx) => (
                                <TimelineItem
                                    key={edu.id}
                                    icon={GraduationCap}
                                    isLast={idx === (profData.education || []).length - 1}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group relative"
                                    >
                                        {isEditing && (
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute -right-3 -top-3 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-lg opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                        {isEditing ? (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Degree / Program"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                />
                                                <input
                                                    placeholder="School"
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <input
                                                    placeholder="Period"
                                                    value={edu.period}
                                                    onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-600"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900">{edu.degree}</h4>
                                                    <p className="text-gray-500 font-bold flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4" />
                                                        {edu.school}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-blue-600 font-black px-4 py-2 bg-blue-50 rounded-xl">{edu.period}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                </TimelineItem>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Column: Skills, Projects, etc. */}
                <div className="space-y-8">

                    {/* Availability Status */}
                    <AnimatePresence>
                        {(profData.availability && profData.availability !== 'not-looking') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                            <Globe className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-extrabold text-sm uppercase tracking-widest opacity-90">Current Status</span>
                                    </div>
                                    <h3 className="text-xl font-black mb-2">
                                        {profData.availability === 'looking' ? 'Actively Looking' : 'Open to New Roles'}
                                    </h3>
                                    {profData.remotePreference && (
                                        <div className="flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-xl inline-block backdrop-blur-md">
                                            <MapPin className="w-4 h-4" />
                                            {profData.remotePreference} • Remote flexible
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expertise Card */}
                    <SidebarCard title="Core Expertise" icon={Award}>
                        <div className="flex flex-wrap gap-2">
                            {(profData.skills || []).map((skill, index) => {
                                const skillName = typeof skill === 'string' ? skill : (skill?.name || '');
                                const proficiency = typeof skill === 'object' ? skill?.level : 'intermediate';

                                if (!skillName) return null;

                                return (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -2 }}
                                        className={`px-4 py-2 rounded-xl text-sm font-black transition-all border ${isEditing
                                            ? 'bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-2'
                                            : 'bg-gray-50 text-gray-700 border-gray-100 shadow-sm'
                                            }`}
                                    >
                                        {skillName}
                                        {isEditing && (
                                            <button onClick={() => removeSkill(skill)} className="hover:text-red-600 transition">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                            {isEditing && (
                                <input
                                    type="text"
                                    placeholder="+ Skill"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addSkill(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="px-4 py-2 rounded-xl text-sm border-2 border-dashed border-gray-200 focus:border-blue-500 outline-none transition w-full mt-2"
                                />
                            )}
                        </div>
                    </SidebarCard>

                    {/* Projects Card */}
                    {profData.projects?.length > 0 && (
                        <SidebarCard title="Featured Work" icon={FolderOpen} colorClass="bg-purple-50 text-purple-600">
                            <div className="space-y-4">
                                {profData.projects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 group transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-black text-gray-900 leading-tight">{project.name}</h4>
                                            {project.url && (
                                                <a href={project.url} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium line-clamp-2">{project.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </SidebarCard>
                    )}

                    {/* Certifications Card */}
                    {profData.certifications?.length > 0 && (
                        <SidebarCard title="Credentials" icon={Award} colorClass="bg-amber-50 text-amber-600">
                            <div className="space-y-3">
                                {profData.certifications.map((cert, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 leading-none mb-1">{cert.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{cert.issuer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SidebarCard>
                    )}

                    {/* Languages Card */}
                    {profData.languages?.length > 0 && (
                        <SidebarCard title="Languages" icon={Globe} colorClass="bg-indigo-50 text-indigo-600">
                            <div className="grid grid-cols-1 gap-3">
                                {profData.languages.map((lang, index) => {
                                    const langName = typeof lang === 'string' ? lang : (lang?.language || '');
                                    const proficiency = typeof lang === 'object' ? lang?.proficiency : 'Native';
                                    return (
                                        <div key={index} className="flex justify-between items-center p-3 bg-indigo-50/30 rounded-xl border border-indigo-50">
                                            <span className="font-black text-gray-900 text-sm">{langName}</span>
                                            <span className="text-[10px] bg-white px-2 py-1 rounded-lg text-indigo-600 font-black shadow-sm uppercase">{proficiency}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </SidebarCard>
                    )}
                </div>
            </div>
        </div>
    );
}


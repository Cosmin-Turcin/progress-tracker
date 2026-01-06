import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Wrench, Award, Globe, FolderOpen,
    Eye, Save, ChevronLeft, ChevronRight, Check, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsEditor from './components/SkillsEditor';
import CertificationForm from './components/CertificationForm';
import ProjectForm from './components/ProjectForm';
import LanguageEditor from './components/LanguageEditor';
import CVPreview from './components/CVPreview';
import ProgressIndicator from './components/ProgressIndicator';

const TABS = [
    { id: 'basics', label: 'Basics', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'preview', label: 'Preview', icon: Eye },
];

const DEFAULT_CV_DATA = {
    headline: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    interests: [],
    availability: 'not-looking',
    preferredRoles: [],
    remotePreference: 'flexible',
};

export default function CVBuilder() {
    const navigate = useNavigate();
    const { profile, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('basics');
    const [cvData, setCvData] = useState(DEFAULT_CV_DATA);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load existing data
    useEffect(() => {
        if (profile?.professional_data) {
            setCvData({
                ...DEFAULT_CV_DATA,
                ...profile.professional_data
            });
        }
    }, [profile]);

    // Track changes
    const updateCvData = (updates) => {
        setCvData(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ professional_data: cvData });
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving CV:', error);
        } finally {
            setSaving(false);
        }
    };

    const currentTabIndex = TABS.findIndex(t => t.id === activeTab);
    const canGoNext = currentTabIndex < TABS.length - 1;
    const canGoPrev = currentTabIndex > 0;

    const goNext = () => {
        if (canGoNext) setActiveTab(TABS[currentTabIndex + 1].id);
    };

    const goPrev = () => {
        if (canGoPrev) setActiveTab(TABS[currentTabIndex - 1].id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900">CV Builder</h1>
                                <p className="text-sm text-gray-500">Build your professional profile</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ProgressIndicator cvData={cvData} />
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${hasChanges
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> {hasChanges ? 'Save Changes' : 'Saved'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <nav className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-28">
                            {TABS.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const isCompleted = index < currentTabIndex;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive
                                                ? 'bg-blue-50 text-blue-700 font-bold'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' :
                                                isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {isCompleted && !isActive ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className={isActive ? 'font-semibold' : ''}>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-gray-200 p-8"
                            >
                                {activeTab === 'basics' && (
                                    <BasicsTab cvData={cvData} updateCvData={updateCvData} />
                                )}
                                {activeTab === 'experience' && (
                                    <ExperienceForm
                                        experiences={cvData.experience}
                                        onChange={(exp) => updateCvData({ experience: exp })}
                                    />
                                )}
                                {activeTab === 'education' && (
                                    <EducationForm
                                        education={cvData.education}
                                        onChange={(edu) => updateCvData({ education: edu })}
                                    />
                                )}
                                {activeTab === 'skills' && (
                                    <SkillsEditor
                                        skills={cvData.skills}
                                        onChange={(skills) => updateCvData({ skills })}
                                    />
                                )}
                                {activeTab === 'certifications' && (
                                    <CertificationForm
                                        certifications={cvData.certifications}
                                        onChange={(certs) => updateCvData({ certifications: certs })}
                                    />
                                )}
                                {activeTab === 'projects' && (
                                    <ProjectForm
                                        projects={cvData.projects}
                                        onChange={(projects) => updateCvData({ projects })}
                                    />
                                )}
                                {activeTab === 'languages' && (
                                    <LanguageEditor
                                        languages={cvData.languages}
                                        onChange={(langs) => updateCvData({ languages: langs })}
                                    />
                                )}
                                {activeTab === 'preview' && (
                                    <CVPreview cvData={cvData} profile={profile} />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={goPrev}
                                disabled={!canGoPrev}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${canGoPrev ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" /> Previous
                            </button>
                            <button
                                onClick={goNext}
                                disabled={!canGoNext}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${canGoNext ? 'bg-blue-600 text-white hover:bg-blue-700' : 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                                    }`}
                            >
                                Next <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Basics Tab Component
function BasicsTab({ cvData, updateCvData }) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-500">Start with your professional headline and summary</p>
            </div>

            {/* Headline */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Professional Headline</label>
                <input
                    type="text"
                    value={cvData.headline || ''}
                    onChange={(e) => updateCvData({ headline: e.target.value })}
                    placeholder="e.g., Senior Software Engineer | Blockchain Expert | Open Source Contributor"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-1">This appears at the top of your profile</p>
            </div>

            {/* Summary */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Professional Summary</label>
                <textarea
                    value={cvData.summary || ''}
                    onChange={(e) => updateCvData({ summary: e.target.value })}
                    rows={5}
                    placeholder="Write a compelling summary of your professional background, key achievements, and career goals..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{(cvData.summary || '').length}/500 characters</p>
            </div>

            {/* Availability & Preferences */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
                    <select
                        value={cvData.availability || 'not-looking'}
                        onChange={(e) => updateCvData({ availability: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="open">Open to opportunities</option>
                        <option value="looking">Actively looking</option>
                        <option value="not-looking">Not looking</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Remote Preference</label>
                    <select
                        value={cvData.remotePreference || 'flexible'}
                        onChange={(e) => updateCvData({ remotePreference: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="remote">Remote only</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>
            </div>

            {/* Interests */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Professional Interests</label>
                <input
                    type="text"
                    placeholder="Press Enter to add (e.g., Blockchain, AI, Trading)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                            const newInterests = [...(cvData.interests || []), e.target.value.trim()];
                            updateCvData({ interests: newInterests });
                            e.target.value = '';
                        }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                    {(cvData.interests || []).map((interest, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                        >
                            {interest}
                            <button
                                onClick={() => updateCvData({ interests: cvData.interests.filter((_, idx) => idx !== i) })}
                                className="hover:text-blue-900"
                            >×</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

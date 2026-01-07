import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Briefcase, Brain, Utensils, Dumbbell, X, Code, TrendingUp, Building2, Palette, Stethoscope, GraduationCap, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfessionalCard from './components/ProfessionalCard';

const SearchProfessionals = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [selectedRemote, setSelectedRemote] = useState('all');
    const [skillSearch, setSkillSearch] = useState('');
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { id: 'all', label: 'All', icon: Users },
        { id: 'fitness', label: 'Fitness', icon: Dumbbell },
        { id: 'mindset', label: 'Mindset', icon: Brain },
        { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    ];

    const levels = [
        { id: 'all', label: 'All Levels' },
        { id: 'elite', label: 'Elite (90%+)' },
        { id: 'pro', label: 'Pro (75%+)' },
        { id: 'achiever', label: 'Achiever (50%+)' },
    ];

    const roles = [
        { id: 'all', label: 'All Roles', icon: Users },
        { id: 'developer', label: 'Developer', icon: Code, keywords: ['developer', 'programmer', 'engineer', 'software', 'coding', 'frontend', 'backend', 'fullstack'] },
        { id: 'trader', label: 'Trader', icon: TrendingUp, keywords: ['trader', 'trading', 'investor', 'finance', 'crypto', 'stocks', 'forex'] },
        { id: 'executive', label: 'Executive', icon: Building2, keywords: ['ceo', 'cto', 'cfo', 'founder', 'executive', 'director', 'manager', 'lead'] },
        { id: 'designer', label: 'Designer', icon: Palette, keywords: ['designer', 'ui', 'ux', 'creative', 'graphic', 'artist'] },
        { id: 'healthcare', label: 'Healthcare', icon: Stethoscope, keywords: ['doctor', 'nurse', 'medical', 'healthcare', 'physician', 'therapist'] },
        { id: 'education', label: 'Education', icon: GraduationCap, keywords: ['teacher', 'professor', 'educator', 'tutor', 'instructor', 'coach'] },
    ];

    const availabilityOptions = [
        { id: 'all', label: 'Any Availability' },
        { id: 'looking', label: 'Actively Looking', color: 'text-green-600' },
        { id: 'open', label: 'Open to Opportunities', color: 'text-blue-600' },
    ];

    const remoteOptions = [
        { id: 'all', label: 'Any Location' },
        { id: 'remote', label: 'Remote Only' },
        { id: 'hybrid', label: 'Hybrid' },
        { id: 'onsite', label: 'On-site' },
    ];

    useEffect(() => {
        fetchProfessionals();
    }, [selectedCategory, selectedLevel, selectedRole, selectedAvailability, selectedRemote, searchQuery, skillSearch]);

    const fetchProfessionals = async () => {
        setLoading(true);
        try {
            console.log('Fetching professionals...');

            // Join with user_statistics and achievements for data
            let query = supabase
                ?.from('user_profiles')
                ?.select(`
                    id, 
                    full_name, 
                    username, 
                    avatar_url, 
                    bio,
                    professional_data,
                    user_statistics (
                        current_streak,
                        longest_streak,
                        total_points,
                        total_activities,
                        achievements_unlocked
                    ),
                    achievements (
                        id,
                        title,
                        icon,
                        achieved_at
                    )
                `)
                ?.limit(100);

            if (searchQuery) {
                query = query?.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;

            console.log('Query result:', { data, error, count: data?.length });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            // Client-side filtering
            let filteredData = data || [];

            // Flatten nested user_statistics and calculate consistency score
            filteredData = filteredData.map(user => {
                const stats = user?.user_statistics?.[0] || user?.user_statistics || {};
                const currentStreak = stats?.current_streak || 0;
                return {
                    ...user,
                    current_streak: currentStreak,
                    longest_streak: stats?.longest_streak || 0,
                    total_points: stats?.total_points || 0,
                    total_activities: stats?.total_activities || 0,
                    achievements_count: stats?.achievements_unlocked || 0,
                    consistency_score: Math.min(100, Math.max(40, currentStreak * 5 + 50)),
                };
            });

            if (selectedLevel !== 'all') {
                filteredData = filteredData.filter(user => {
                    const score = user.consistency_score;
                    if (selectedLevel === 'elite') return score >= 90;
                    if (selectedLevel === 'pro') return score >= 75;
                    if (selectedLevel === 'achiever') return score >= 50;
                    return true;
                });
            }

            // Role filtering based on professional_data
            if (selectedRole !== 'all') {
                const roleConfig = roles.find(r => r.id === selectedRole);
                if (roleConfig?.keywords) {
                    filteredData = filteredData.filter(user => {
                        const profData = user?.professional_data || {};
                        const searchText = [
                            profData?.summary || '',
                            ...(profData?.experience?.map(e => `${e?.title} ${e?.company}`) || []),
                            ...(profData?.skills || []),
                            user?.bio || ''
                        ].join(' ').toLowerCase();

                        return roleConfig.keywords.some(keyword => searchText.includes(keyword));
                    });
                }
            }

            // Availability filtering
            if (selectedAvailability !== 'all') {
                filteredData = filteredData.filter(user => {
                    const profData = user?.professional_data || {};
                    return profData?.availability === selectedAvailability;
                });
            }

            // Remote preference filtering
            if (selectedRemote !== 'all') {
                filteredData = filteredData.filter(user => {
                    const profData = user?.professional_data || {};
                    return profData?.remotePreference === selectedRemote;
                });
            }

            // Skill search filtering
            if (skillSearch.trim()) {
                const searchTerms = skillSearch.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
                filteredData = filteredData.filter(user => {
                    const profData = user?.professional_data || {};
                    const userSkills = (profData?.skills || []).map(s =>
                        typeof s === 'string' ? s.toLowerCase() : (s?.name || '').toLowerCase()
                    );
                    return searchTerms.some(term =>
                        userSkills.some(skill => skill.includes(term))
                    );
                });
            }

            // Sort by consistency score
            filteredData.sort((a, b) => b.consistency_score - a.consistency_score);

            setProfessionals(filteredData);
        } catch (error) {
            console.error('Error fetching professionals:', error);
            setProfessionals([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black">Search Professionals</h1>
                        </div>
                        <p className="text-blue-200 text-lg max-w-2xl">
                            Find verified high achievers with proven track records. Filter by expertise, consistency, and achievements.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e?.target?.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${showFilters ? 'bg-white text-gray-900' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border-b border-gray-200 shadow-sm"
                >
                    <div className="container mx-auto max-w-6xl py-6 px-6">
                        <div className="flex flex-wrap gap-8">
                            {/* Category Filter */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            <cat.icon size={16} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level Filter */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Consistency Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {levels.map(lvl => (
                                        <button
                                            key={lvl.id}
                                            onClick={() => setSelectedLevel(lvl.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLevel === lvl.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {lvl.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Professional Role Filter */}
                            <div className="w-full">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Professional Role</label>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => setSelectedRole(role.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {role.icon && <role.icon size={16} />}
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Filter */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Availability</label>
                                <div className="flex flex-wrap gap-2">
                                    {availabilityOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelectedAvailability(opt.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedAvailability === opt.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {opt.id !== 'all' && <CheckCircle size={16} />}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Remote Preference Filter */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Location Preference</label>
                                <div className="flex flex-wrap gap-2">
                                    {remoteOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelectedRemote(opt.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRemote === opt.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {opt.id !== 'all' && <MapPin size={16} />}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Skill Search */}
                            <div className="w-full">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Search by Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g., React, Python, Figma (comma separated)"
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Results */}
            <div className="container mx-auto max-w-6xl py-10 px-6">
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="h-20 bg-gray-100 rounded-lg mb-4" />
                                <div className="h-10 bg-gray-200 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : professionals.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">No professionals found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-bold text-gray-900">{professionals.length}</span> professionals found
                            </p>
                            {(selectedCategory !== 'all' || selectedLevel !== 'all' || selectedRole !== 'all' || selectedAvailability !== 'all' || selectedRemote !== 'all' || skillSearch) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedLevel('all');
                                        setSelectedRole('all');
                                        setSelectedAvailability('all');
                                        setSelectedRemote('all');
                                        setSkillSearch('');
                                    }}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <X size={14} /> Clear Filters
                                </button>
                            )}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {professionals.map(user => (
                                <ProfessionalCard key={user?.id} user={user} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchProfessionals;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Save,
    Globe,
    Lock,
    Users,
    Image as ImageIcon,
    Type,
    Layout,
    Paperclip,
    Eye
} from 'lucide-react';

const JournalEditor = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [type, setType] = useState('Article');
    const [category, setCategory] = useState('Insight');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            content,
            privacy,
            type,
            category,
            date: 'Today',
            author: 'Me'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
                {/* Editor Top Bar */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Type className="w-5 h-5" /></div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Wisdom Composer</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mindset Module // v1.0</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Editor Workspace */}
                <div className="flex-grow flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
                    {/* Main Writing Area */}
                    <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        <input
                            type="text"
                            placeholder="Title your insight..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl md:text-5xl font-black text-gray-900 placeholder-gray-100 border-none outline-none mb-8 tracking-tighter"
                        />

                        <textarea
                            placeholder="The repeated application of will..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full text-lg font-medium text-gray-600 placeholder-gray-200 border-none outline-none resize-none leading-relaxed"
                        />
                    </div>

                    {/* Sidebar Settings */}
                    <div className="w-full md:w-80 p-8 space-y-10 bg-gray-50/30 overflow-y-auto">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Privacy Engine</label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'public', label: 'Public Article', icon: Globe, desc: 'Visible to everyone on the feed' },
                                    { id: 'shared', label: 'Shared with Network', icon: Users, desc: 'Only your verified connections' },
                                    { id: 'private', label: 'Private Journal', icon: Lock, desc: 'Encrypted and for your eyes only' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPrivacy(opt.id)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${privacy === opt.id ? 'border-purple-600 bg-white shadow-lg shadow-purple-50' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-1">
                                            <opt.icon className={`w-4 h-4 ${privacy === opt.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-black uppercase tracking-tight ${privacy === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-widest">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Metadata</label>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase text-gray-900 outline-none appearance-none"
                                    >
                                        <option>Article</option>
                                        <option>Reflection</option>
                                        <option>Daily Journal</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <button className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase text-gray-400 text-left hover:bg-gray-50">
                                        Attach Cover
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <button
                                onClick={handleSubmit}
                                disabled={!title || !content}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 disabled:bg-gray-200 disabled:shadow-none transition-all uppercase tracking-widest text-sm"
                            >
                                <Save className="w-5 h-5" /> PUBLISH INSIGHT
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default JournalEditor;

import React, { useState, useRef } from 'react';
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
    Eye,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Code,
    Minus,
    Undo,
    Redo
} from 'lucide-react';

const EnhancedJournalEditor = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [type, setType] = useState('Article');
    const [category, setCategory] = useState('Insight');
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef(null);

    // Insert formatting at cursor position
    const insertFormatting = (before, after = '', placeholder = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end) || placeholder;
        const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);

        setContent(newContent);

        // Set cursor position after formatting
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const formatActions = [
        { icon: Bold, action: () => insertFormatting('**', '**', 'bold text'), title: 'Bold' },
        { icon: Italic, action: () => insertFormatting('*', '*', 'italic text'), title: 'Italic' },
        { icon: Heading1, action: () => insertFormatting('\n# ', '\n', 'Heading'), title: 'Heading 1' },
        { icon: Heading2, action: () => insertFormatting('\n## ', '\n', 'Subheading'), title: 'Heading 2' },
        { type: 'divider' },
        { icon: List, action: () => insertFormatting('\n- ', '', 'List item'), title: 'Bullet List' },
        { icon: ListOrdered, action: () => insertFormatting('\n1. ', '', 'List item'), title: 'Numbered List' },
        { icon: Quote, action: () => insertFormatting('\n> ', '\n', 'Quote'), title: 'Block Quote' },
        { type: 'divider' },
        { icon: LinkIcon, action: () => insertFormatting('[', '](url)', 'link text'), title: 'Link' },
        { icon: Code, action: () => insertFormatting('`', '`', 'code'), title: 'Inline Code' },
        { icon: Minus, action: () => insertFormatting('\n---\n', '', ''), title: 'Divider' },
    ];

    // Simple markdown to HTML preview
    const renderPreview = (text) => {
        if (!text) return '';

        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-black text-gray-900 mt-6 mb-3">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black text-gray-900 mt-8 mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-gray-900 mt-10 mb-6">$1</h1>')
            // Bold and Italic
            .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-purple-600 underline hover:text-purple-800">$1</a>')
            // Code
            .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-purple-700">$1</code>')
            // Block quotes
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-purple-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-8 border-gray-200" />')
            // Lists
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
            // Paragraphs
            .replace(/\n\n/gim, '</p><p class="my-4 text-gray-700 leading-relaxed">')
            .replace(/\n/gim, '<br />');

        return `<p class="my-4 text-gray-700 leading-relaxed">${html}</p>`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            content,
            privacy,
            type,
            category
        });
    };

    const wordCount = content.split(/\s+/).filter(w => w).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

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
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[95vh]"
            >
                {/* Editor Top Bar */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Type className="w-5 h-5" /></div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Wisdom Composer</h2>
                            <div className="flex items-center gap-4 mt-0.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {wordCount} words • {readTime} min read
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${showPreview ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Eye className="w-4 h-4" /> {showPreview ? 'Edit' : 'Preview'}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Formatting Toolbar */}
                {!showPreview && (
                    <div className="px-8 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1 overflow-x-auto">
                        {formatActions.map((action, i) =>
                            action.type === 'divider' ? (
                                <div key={i} className="w-px h-6 bg-gray-200 mx-2" />
                            ) : (
                                <button
                                    key={i}
                                    onClick={action.action}
                                    title={action.title}
                                    className="p-2 hover:bg-white rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <action.icon className="w-4 h-4" />
                                </button>
                            )
                        )}
                    </div>
                )}

                {/* Editor Workspace */}
                <div className="flex-grow flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
                    {/* Main Writing Area */}
                    <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        <input
                            type="text"
                            placeholder="Title your insight..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl md:text-5xl font-black text-gray-900 placeholder-gray-200 border-none outline-none mb-8 tracking-tighter"
                        />

                        {showPreview ? (
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
                            />
                        ) : (
                            <textarea
                                ref={textareaRef}
                                placeholder="Start writing... Use **bold**, *italic*, # headings, > quotes, and more..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full text-lg font-medium text-gray-600 placeholder-gray-300 border-none outline-none resize-none leading-relaxed font-mono"
                                style={{ minHeight: '400px' }}
                            />
                        )}
                    </div>

                    {/* Sidebar Settings */}
                    <div className="w-full md:w-80 p-6 space-y-8 bg-gray-50/30 overflow-y-auto">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Privacy</label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'public', label: 'Public', icon: Globe, desc: 'Visible to everyone' },
                                    { id: 'shared', label: 'Network Only', icon: Users, desc: 'Only connections' },
                                    { id: 'private', label: 'Private', icon: Lock, desc: 'Only you' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPrivacy(opt.id)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${privacy === opt.id ? 'border-purple-600 bg-white shadow-lg shadow-purple-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <opt.icon className={`w-4 h-4 ${privacy === opt.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                            <span className={`text-sm font-bold ${privacy === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none appearance-none"
                            >
                                <option>Article</option>
                                <option>Reflection</option>
                                <option>Daily Journal</option>
                            </select>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <button
                                onClick={handleSubmit}
                                disabled={!title || !content}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-100 hover:bg-purple-700 disabled:bg-gray-200 disabled:shadow-none transition-all uppercase tracking-widest text-sm"
                            >
                                <Save className="w-5 h-5" /> PUBLISH
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EnhancedJournalEditor;

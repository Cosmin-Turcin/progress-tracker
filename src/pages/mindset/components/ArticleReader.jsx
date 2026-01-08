import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Clock,
    Eye,
    Share2,
    Bookmark,
    Heart,
    Globe,
    Lock,
    Users,
    ChevronLeft,
    MessageCircle
} from 'lucide-react';

const ArticleReader = ({ article, onClose }) => {
    if (!article) return null;

    // Simple markdown to HTML rendering
    const renderContent = (text) => {
        if (!text) return '';

        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-black text-gray-900 mt-8 mb-4 tracking-tight">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black text-gray-900 mt-10 mb-5 tracking-tight">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-gray-900 mt-12 mb-6 tracking-tight">$1</h1>')
            // Bold and Italic
            .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-purple-600 underline hover:text-purple-800" target="_blank" rel="noopener noreferrer">$1</a>')
            // Code
            .replace(/`(.*?)`/gim, '<code class="bg-purple-50 px-2 py-1 rounded text-sm font-mono text-purple-700">$1</code>')
            // Block quotes
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-purple-400 pl-6 py-2 my-6 italic text-gray-600 bg-purple-50/30 rounded-r-xl">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-10 border-gray-200" />')
            // Ordered lists
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal mb-2">$1</li>')
            // Unordered lists
            .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc mb-2">$1</li>')
            // Paragraphs (double newlines)
            .replace(/\n\n/gim, '</p><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
            // Single newlines to breaks
            .replace(/\n/gim, '<br />');

        return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${html}</p>`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const PrivacyIcon = article.privacy === 'private' ? Lock : article.privacy === 'shared' ? Users : Globe;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[95vh] mx-4"
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto">
                    <article className="max-w-3xl mx-auto px-8 py-12">
                        {/* Article Metadata */}
                        <div className="flex items-center gap-4 mb-8 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <PrivacyIcon className="w-4 h-4" />
                                <span className="font-bold uppercase tracking-widest text-[10px]">{article.type || 'Article'}</span>
                            </div>
                            <span className="text-gray-200">•</span>
                            <span className="text-gray-400 font-medium">{formatDate(article.created_at)}</span>
                            <span className="text-gray-200">•</span>
                            <div className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{article.read_time || 5} min read</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
                            {article.title}
                        </h1>

                        {/* Author */}
                        <div className="flex items-center gap-4 pb-10 mb-10 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                                {(article.user_profiles?.full_name || article.user_profiles?.username || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">
                                    {article.user_profiles?.full_name || article.user_profiles?.username || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-400">Author</p>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
                        />

                        {/* Engagement Section */}
                        <div className="mt-16 pt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
                                        <Heart className="w-5 h-5" />
                                        <span className="font-bold">Like</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="font-bold">Comment</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Eye className="w-4 h-4" />
                                    <span className="font-medium">{article.read_count || 0} views</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </motion.div>
        </div>
    );
};

export default ArticleReader;

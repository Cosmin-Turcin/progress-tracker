import React from 'react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';
import { X, Share2, Download } from 'lucide-react';

export default function AchievementModal({ achievement, onClose, onShare }) {
  if (!achievement) return null;

  const IconComponent = Icons?.[achievement?.icon] || Icons?.Award;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: achievement?.title,
          text: achievement?.description,
          url: window.location?.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      onShare?.(achievement);
    }
  };

  const handleDownload = () => {
    // Generate certificate download
    const content = `
      Achievement Certificate
      
      ${achievement?.title}
      ${achievement?.description}
      
      Earned on: ${format(new Date(achievement.achievedAt), 'MMMM dd, yyyy')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${achievement?.title?.replace(/\s+/g, '_')}_certificate.txt`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex flex-col items-center space-y-6">
            <div className={`p-6 rounded-full ${achievement?.iconColor || 'bg-gradient-to-br from-yellow-400 to-orange-500'} shadow-xl`}>
              <IconComponent className="w-20 h-20 text-white" />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">{achievement?.title}</h2>
              <p className="text-lg text-gray-600 max-w-md">{achievement?.description}</p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="px-4 py-2 bg-white rounded-full font-medium">
                {achievement?.achievementType}
              </span>
              <span className="px-4 py-2 bg-white rounded-full">
                {format(new Date(achievement.achievedAt), 'MMMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
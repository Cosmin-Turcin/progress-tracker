import React, { useState } from 'react';
import { Trophy, Dumbbell, Activity, Heart, Target, Send } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const QuickChallengePanel = ({ onSendChallenge, friendName }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customChallenge, setCustomChallenge] = useState({ type: '', details: '' });

  const quickChallenges = [
    {
      icon: Dumbbell,
      type: 'strength',
      title: '7-Day Strength Challenge',
      description: 'Complete 5 strength workouts in 7 days',
      duration: '7 days',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Activity,
      type: 'cardio',
      title: 'Cardio Sprint Week',
      description: 'Log 150 minutes of cardio this week',
      duration: '7 days',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Target,
      type: 'daily',
      title: 'Daily Goal Streak',
      description: 'Hit daily goals for 10 consecutive days',
      duration: '10 days',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Heart,
      type: 'wellness',
      title: 'Wellness Week',
      description: 'Complete 3 mindfulness sessions this week',
      duration: '7 days',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleSendChallenge = () => {
    if (selectedChallenge) {
      onSendChallenge(selectedChallenge);
      setSelectedChallenge(null);
    } else if (customChallenge?.type && customChallenge?.details) {
      onSendChallenge(customChallenge);
      setCustomChallenge({ type: '', details: '' });
      setShowCustom(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Quick Challenge</h2>
        <Trophy className="w-5 h-5 text-yellow-600" />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Challenge {friendName} to stay motivated together!
      </p>
      {/* Quick Challenge Options */}
      <div className="space-y-3 mb-4">
        {quickChallenges?.map((challenge, index) => {
          const Icon = challenge?.icon;
          const isSelected = selectedChallenge?.type === challenge?.type;
          
          return (
            <button
              key={index}
              onClick={() => setSelectedChallenge(challenge)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`${challenge?.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${challenge?.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{challenge?.title}</h4>
                    <span className="text-xs text-gray-500">{challenge?.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600">{challenge?.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {/* Custom Challenge Option */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors text-sm font-medium mb-4"
      >
        + Create Custom Challenge
      </button>
      {showCustom && (
        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Challenge type (e.g., cardio, strength)"
            value={customChallenge?.type}
            onChange={(e) => setCustomChallenge({ ...customChallenge, type: e?.target?.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Challenge details and goals..."
            value={customChallenge?.details}
            onChange={(e) => setCustomChallenge({ ...customChallenge, details: e?.target?.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
        </div>
      )}
      {/* Send Challenge Button */}
      <Button
        onClick={handleSendChallenge}
        disabled={!selectedChallenge && (!customChallenge?.type || !customChallenge?.details)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        Send Challenge
      </Button>
    </div>
  );
};

export default QuickChallengePanel;
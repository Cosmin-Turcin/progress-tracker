import React from 'react';
import { X, Zap } from 'lucide-react';

const QuickIntensityModal = ({ activity, onClose, onSelect }) => {
    if (!activity) return null;

    const intensities = [
        { value: 'light', label: 'Easy', multiplier: '0.7x', description: 'Low effort, relaxed pace', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { value: 'normal', label: 'Medium', multiplier: '1.0x', description: 'Steady effort, normal pace', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { value: 'intense', label: 'Hard', multiplier: '1.5x', description: 'High effort, intense pace', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-foreground">Select Intensity</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            How intense was your <span className="font-semibold text-primary">{activity?.label}</span>?
                        </p>
                    </div>

                    <div className="space-y-3">
                        {intensities?.map((opt) => (
                            <button
                                key={opt?.value}
                                onClick={() => onSelect(opt?.value)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 group ${opt?.bgColor}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${opt?.color} bg-white dark:bg-gray-800 shadow-sm transition-transform group-hover:scale-110`}>
                                    <Zap className="w-5 h-5 fill-current" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground">{opt?.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase border border-current ${opt?.color}`}>
                                            {opt?.multiplier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{opt?.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickIntensityModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Play,
    Pause,
    SkipForward,
    CheckCircle2,
    Clock,
    Zap,
    RotateCcw,
    ChevronRight,
    Trophy
} from 'lucide-react';

const WorkoutPlayer = ({ routine, onClose, onComplete }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [exerciseProgress, setExerciseProgress] = useState([]);

    const currentExercise = routine.exercises[currentExerciseIndex];

    // Initialize timer for current exercise
    useEffect(() => {
        if (currentExercise && currentExercise.duration) {
            setTimeLeft(parseInt(currentExercise.duration));
        } else {
            setTimeLeft(null);
        }
    }, [currentExerciseIndex]);

    // Timer logic
    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            handleExerciseComplete();
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const handleExerciseComplete = () => {
        const completedExercise = {
            ...currentExercise,
            completedAt: new Date().toISOString()
        };
        setExerciseProgress([...exerciseProgress, completedExercise]);

        if (currentExerciseIndex < routine.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setIsPlaying(false); // Pause between exercises
        } else {
            setIsFinished(true);
            setIsPlaying(false);
        }
    };

    const handleFinishWorkout = () => {
        onComplete({
            routineTitle: routine.title,
            completedExercises: exerciseProgress.length,
            totalExercises: routine.exercises.length,
            timestamp: new Date().toISOString()
        });
    };

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100] bg-gray-900 flex items-center justify-center p-6"
            >
                <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Trophy className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Workout Complete!</h2>
                    <p className="text-gray-500 mb-10 font-medium">
                        You've dominated the <span className="text-blue-600 font-bold">{routine.title}</span> routine. Consistency is the only path to elite performance.
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-6 mb-10 text-left space-y-4">
                        <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                            <span className="text-gray-400 font-sans">Exercises Logged</span>
                            <span className="text-gray-900">{exerciseProgress.length} / {routine.exercises.length}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <button
                        onClick={handleFinishWorkout}
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors shadow-xl"
                    >
                        COLLECT REWARDS
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
            {/* Player Header */}
            <header className="p-6 flex justify-between items-center border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter truncate max-w-[200px] md:max-w-none">
                        {routine.title}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        <Zap className="w-3 h-3 text-yellow-500" /> Evolution in Progress
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <X className="w-6 h-6 text-gray-900" />
                </button>
            </header>

            {/* Exercise Content */}
            <main className="flex-grow flex flex-col items-center justify-center p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentExerciseIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl text-center"
                    >
                        <div className="mb-8">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest">
                                Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-none">
                            {currentExercise.name}
                        </h2>

                        <div className="flex flex-wrap justify-center gap-6 mb-12">
                            {currentExercise.reps && (
                                <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Reps</span>
                                    <span className="text-2xl font-black text-gray-900">{currentExercise.reps}</span>
                                </div>
                            )}
                            {currentExercise.sets && (
                                <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Sets</span>
                                    <span className="text-2xl font-black text-gray-900">{currentExercise.sets}</span>
                                </div>
                            )}
                        </div>

                        {/* Visual Timer or Placeholder */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-16">
                            <div className="absolute inset-0 rounded-full border-8 border-gray-50" />
                            {timeLeft !== null && (
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="47%"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray="295"
                                        strokeDashoffset={295 * (1 - timeLeft / parseInt(currentExercise.duration))}
                                        className="text-blue-600 transition-all duration-1000"
                                    />
                                </svg>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                {timeLeft !== null ? (
                                    <>
                                        <span className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter">
                                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                        </span>
                                        <Clock className="w-6 h-6 text-gray-300 mt-2" />
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <CheckCircle2 className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                                        <span className="block text-sm font-black text-gray-400 uppercase tracking-widest">Ready to go?</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Controls */}
            <footer className="p-8 bg-gray-50 md:bg-white border-t border-gray-100">
                <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
                    <button
                        onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex-grow py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl transition-all ${isPlaying ? 'bg-white border-2 border-gray-900 text-gray-900' : 'bg-gray-900 text-white'
                            }`}
                    >
                        {isPlaying ? (
                            <><Pause className="w-6 h-6 fill-current" /> PAUSE</>
                        ) : (
                            <><Play className="w-6 h-6 fill-current" /> {timeLeft === null ? 'START EXERCISE' : 'RESUME'}</>
                        )}
                    </button>

                    <button
                        onClick={handleExerciseComplete}
                        className="p-5 bg-blue-600 text-white rounded-[2rem] hover:bg-blue-700 transition-colors shadow-xl"
                    >
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </footer>

            {/* Progress Bar Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentExerciseIndex) / routine.exercises.length) * 100}%` }}
                />
            </div>
        </motion.div>
    );
};

export default WorkoutPlayer;

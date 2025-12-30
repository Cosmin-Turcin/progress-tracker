import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const AchievementOverlay = ({ achievement, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
                >
                    {/* Animated Background Sparkles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)]?.map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    top: '50%',
                                    left: '50%',
                                    scale: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    scale: Math.random() * 1.5,
                                    opacity: 0
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                                className="absolute w-2 h-2 rounded-full"
                                style={{ backgroundColor: achievement.iconColor }}
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, y: 30, opacity: 0, rotateX: 30 }}
                        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.8, y: 30, opacity: 0, rotateX: 30 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="relative max-w-sm w-full overflow-hidden rounded-3xl bg-card border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-10 text-center"
                    >
                        {/* Dynamic Glow background */}
                        <div
                            className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse"
                            style={{ backgroundColor: achievement.iconColor }}
                        ></div>
                        <div
                            className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse"
                            style={{ backgroundColor: achievement.iconColor }}
                        ></div>

                        <motion.div
                            animate={{
                                rotate: [12, -12, 12],
                                scale: [1, 1.15, 1],
                                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-28 h-28 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-xl transform"
                            style={{
                                background: `linear-gradient(135deg, ${achievement.iconColor}22, ${achievement.iconColor}05)`,
                                border: `1px solid ${achievement.iconColor}33`
                            }}
                        >
                            <Icon name={achievement.icon} size={56} color={achievement.iconColor} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-xs font-black tracking-[0.2em] text-primary uppercase mb-3 block">Level Up!</span>
                            <h2 className="text-3xl font-black text-foreground mb-4 leading-tight uppercase tracking-tighter">
                                {achievement.title}
                            </h2>
                            <p className="text-muted-foreground mb-10 leading-relaxed font-medium text-lg">
                                {achievement.description}
                            </p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 500);
                            }}
                            className="group relative w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xl overflow-hidden shadow-2xl transition-all"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                            <span className="relative z-10">AWESOME!</span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementOverlay;

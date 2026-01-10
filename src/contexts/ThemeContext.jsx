import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Initial load from localStorage to prevent flicker
        return localStorage.getItem('ordomatic-theme') || 'light';
    });

    const applyTheme = useCallback((targetTheme) => {
        const root = window.document.documentElement;

        // Remove existing classes
        root.classList.remove('light', 'dark');

        if (targetTheme === 'auto') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            root.style.colorScheme = systemTheme;
        } else {
            root.classList.add(targetTheme);
            root.style.colorScheme = targetTheme;
        }
    }, []);

    // Effect to apply theme when it changes
    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('ordomatic-theme', theme);

        // Listen for system changes if in auto mode
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('auto');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, applyTheme]);

    const updateTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

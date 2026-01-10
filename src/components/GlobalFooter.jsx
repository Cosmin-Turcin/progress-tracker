import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const GlobalFooter = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    // If on landing, we use the landing's own footer
    if (isLanding) return null;

    return (
        <footer className="mt-auto py-8 px-4 border-t border-border bg-card shadow-subtle transition-colors">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <BrandLogo className="w-6 h-6 grayscale opacity-50 dark:invert" />
                    <span className="text-sm font-black text-muted-foreground tracking-tight">Ordomatic</span>
                </div>

                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Link to="/" className="hover:text-primary transition-colors">App Landing</Link>
                    <Link to="/friends-leaderboard" className="hover:text-primary transition-colors">Community</Link>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>

                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                    &copy; {new Date().getFullYear()} Ordomatic. Built for performers.
                </div>
            </div>
        </footer>
    );
};

export default GlobalFooter;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const GlobalFooter = () => {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    // If on landing, we use the landing's own footer
    if (isLanding) return null;

    return (
        <footer className="mt-auto py-8 px-4 border-t border-gray-100 bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <BrandLogo className="w-6 h-6 grayscale opacity-50" />
                    <span className="text-sm font-black text-gray-400 tracking-tight">Ordomatic</span>
                </div>

                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Link to="/" className="hover:text-blue-600 transition-colors">App Landing</Link>
                    <Link to="/friends-leaderboard" className="hover:text-blue-600 transition-colors">Community</Link>
                    <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                </div>

                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    &copy; {new Date().getFullYear()} Ordomatic. Built for performers.
                </div>
            </div>
        </footer>
    );
};

export default GlobalFooter;

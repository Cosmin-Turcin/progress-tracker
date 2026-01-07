import React from 'react';

const BrandLogo = ({ className = "w-10 h-10", color = "currentColor", gradient = false }) => {
    const id = React.useId();

    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {gradient && (
                <defs>
                    <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
            )}

            {/* Outer Circle / Gear base */}
            <path
                d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 75C36.19 75 25 63.81 25 50C25 36.19 36.19 25 50 25C63.81 25 75 36.19 75 50C75 63.81 63.81 75 50 75Z"
                fill={gradient ? `url(#${id}-grad)` : color}
            />

            {/* Mechanical Teeth (Left) */}
            <path d="M10 44H20V56H10V44Z" fill={gradient ? `url(#${id}-grad)` : color} />
            <path d="M18 24L26 31L18 39L10 32L18 24Z" fill={gradient ? `url(#${id}-grad)` : color} />
            <path d="M18 76L10 68L18 61L26 69L18 76Z" fill={gradient ? `url(#${id}-grad)` : color} />

            {/* Circuit Nodes (Right) */}
            <circle cx="75" cy="50" r="4" fill={gradient ? "#8B5CF6" : color} />
            <circle cx="65" cy="35" r="3" fill={gradient ? "#3B82F6" : color} />
            <circle cx="65" cy="65" r="3" fill={gradient ? "#3B82F6" : color} />

            {/* Connecting Lines */}
            <path d="M65 35L75 50L65 65" stroke={gradient ? "#3B82F6" : color} strokeWidth="2" strokeLinecap="round" />

            {/* Center Core */}
            <circle cx="50" cy="50" r="8" fill={gradient ? `url(#${id}-grad)` : color} className="animate-pulse" style={{ transformOrigin: 'center' }} />
        </svg>
    );
};

export default BrandLogo;

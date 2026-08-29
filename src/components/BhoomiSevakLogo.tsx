import React from 'react';

interface BhoomiSevakLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  subtext?: string;
  variant?: 'light' | 'dark' | 'color';
}

export const BhoomiSevakLogo: React.FC<BhoomiSevakLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  subtext,
  variant = 'color',
}) => {
  const dimensionMap = {
    sm: { box: 'w-8 h-8', svg: 32, title: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', svg: 44, title: 'text-base sm:text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', svg: 56, title: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svg: 64, title: 'text-2xl', sub: 'text-sm' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon SVG Emblem */}
      <div
        className={`${dim.box} shrink-0 rounded-2xl relative flex items-center justify-center p-1.5 shadow-xs transition-transform transform group-hover:scale-102 ${
          variant === 'dark'
            ? 'bg-slate-800 text-white'
            : 'bg-gradient-to-br from-[#4c3a9e] via-[#5e4db2] to-[#3b2d82] text-white'
        }`}
        style={{
          boxShadow: '0 2px 8px -2px rgba(94, 77, 178, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bs_grad_earth" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c6bc9" />
              <stop offset="50%" stopColor="#5e4db2" />
              <stop offset="100%" stopColor="#3b2b80" />
            </linearGradient>
            <linearGradient id="bs_grad_gold" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="bs_grad_sprout" x1="18" y1="10" x2="30" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Cadastral Parcel Quadrant Grid Base (Land Divisions) */}
          <rect x="8" y="8" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="26" y="8" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.18" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="8" y="26" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="26" y="26" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.1" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />

          {/* Survey Coordinates / Geo-Point Intersection Marker */}
          <circle cx="24" cy="24" r="3.5" fill="url(#bs_grad_gold)" />
          <circle cx="24" cy="24" r="1.2" fill="#ffffff" />

          {/* Cross Boundary Grid Lines */}
          <path d="M 24 5 L 24 43" stroke="#e0d7ff" strokeWidth="1.2" strokeDasharray="2 1.5" strokeOpacity="0.6" />
          <path d="M 5 24 L 43 24" stroke="#e0d7ff" strokeWidth="1.2" strokeDasharray="2 1.5" strokeOpacity="0.6" />

          {/* Rising Agricultural Sprout / Seed of Growth (Bhoomi) */}
          <path
            d="M 24 24 C 24 16 33 13 33 13 C 33 13 32 22 24 24 Z"
            fill="url(#bs_grad_sprout)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          <path
            d="M 24 24 C 24 18 17 15 17 15 C 17 15 18 22 24 24 Z"
            fill="#a7f3d0"
            fillOpacity="0.9"
            stroke="#ffffff"
            strokeWidth="0.8"
          />

          {/* Digital Verification Arc (Sevak Protection / Trust) */}
          <path
            d="M 12 36 C 18 41 30 41 36 36"
            stroke="url(#bs_grad_gold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Optional Integrated Text Layout */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 leading-none ${dim.title}`}>
              भूमि सेवक
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#5e4db2] border border-purple-200/80">
              Bhoomi Sevak
            </span>
          </div>
          {subtext && (
            <span className={`text-slate-600 font-medium mt-0.5 leading-tight ${dim.sub}`}>
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

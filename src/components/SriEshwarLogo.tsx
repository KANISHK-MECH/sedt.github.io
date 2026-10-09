import React from 'react';

interface SriEshwarLogoProps {
  variant?: 'emblem' | 'full' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SriEshwarEmblem: React.FC<{ className?: string }> = ({ className = 'w-10 h-4.5' }) => {
  return (
    <svg
      viewBox="0 0 120 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-xs ${className}`}
      aria-label="Sri Eshwar Emblem"
    >
      {/* Red Background Rectangle */}
      <rect width="120" height="50" rx="3" fill="#D81A24" />

      {/* Top Left Eye / Slit */}
      <path
        d="M 20 16.5 C 20 14, 46 14, 46 16.5 C 46 19, 20 19, 20 16.5 Z"
        fill="#FFFFFF"
      />

      {/* Top Right Eye / Slit */}
      <path
        d="M 74 16.5 C 74 14, 100 14, 100 16.5 C 100 19, 74 19, 74 16.5 Z"
        fill="#FFFFFF"
      />

      {/* Center Pagoda / Curved Wing Motif */}
      <path
        d="M 18 33.5 C 36 33.5, 47 31.5, 54 26 C 57.5 23.2, 59.2 19.8, 60 18 C 60.8 19.8, 62.5 23.2, 66 26 C 73 31.5, 84 33.5, 102 33.5 C 85 36, 68 36.5, 60 36.5 C 52 36.5, 35 36, 18 33.5 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export const SriEshwarFullCard: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-slate-200/80 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center ${className}`}
    >
      <SriEshwarEmblem className={compact ? "w-16 h-7 mb-1.5" : "w-20 h-8.5 mb-2"} />
      <div
        className="text-[11px] sm:text-[13px] font-black tracking-wider text-[#08245F] uppercase leading-none"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        SRI ESHWAR
      </div>
      <div
        className="text-[15px] sm:text-[18px] font-black tracking-tight text-[#08245F] uppercase leading-tight mt-0.5"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        DRONE TECH
      </div>
      <div className="text-[8px] sm:text-[9.5px] font-bold text-slate-600 tracking-normal mt-0.5">
        Sri Eshwar Drone Tech Pvt. Ltd.
      </div>
    </div>
  );
};


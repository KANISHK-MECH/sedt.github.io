import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Sparkles, ShieldCheck, Menu, X } from 'lucide-react';
import { SriEshwarEmblem } from './SriEshwarLogo';

export const Header: React.FC = () => {
  const { openEnrollModal, openBrochureModal, isMobileMenuOpen, toggleMobileMenu } = useApp();

  return (
    <header className="h-14 sm:h-16 bg-white rounded-2xl border border-[#CFEAFF] px-3 sm:px-5 flex items-center justify-between shadow-sm shrink-0 z-30 mx-2.5 sm:mx-3.5 md:mx-4 mt-2 sm:mt-2.5 mb-1 sm:mb-2 transition-all">
      {/* Top Left: Logo and Brand Name + Mobile Hamburger */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
        {/* Mobile Navigation Drawer Toggle (Visible below lg screens) */}
        <button
          id="header-mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[#08245F] hover:bg-slate-100 active:bg-slate-200 border border-[#CFEAFF] transition-all cursor-pointer shrink-0"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#d71920]" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#08245F]" />}
        </button>

        {/* Sri Eshwar Official Emblem Badge */}
        <div className="relative flex items-center justify-center shrink-0">
          <SriEshwarEmblem className="w-10 h-4.5 sm:w-12 sm:h-5.5 rounded" />
        </div>

        {/* Brand Name Matching Official Design */}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center space-x-1 sm:space-x-1.5 leading-none">
            <span
              className="text-[11px] sm:text-[14px] font-black tracking-tight text-[#08245F] uppercase truncate"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              SRI ESHWAR
            </span>
            <span className="text-[6.5px] sm:text-[8px] font-bold uppercase tracking-wider bg-red-50 text-[#d81a24] border border-red-200 px-1 py-0.2 rounded shrink-0">
              RPTO
            </span>
          </div>
          <div
            className="text-[10px] sm:text-[13px] font-black tracking-tight text-[#08245F] uppercase leading-tight mt-0.5 truncate"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span>DRONE TECH</span>
            <span className="text-[8px] sm:text-[9.5px] font-bold text-slate-500 normal-case tracking-normal ml-1 hidden sm:inline">
              Pvt. Ltd.
            </span>
          </div>
        </div>
      </div>

      {/* Top Center: Amber pulse indicator */}
      <div className="hidden xl:flex items-center space-x-2.5 bg-[#F4FAFF] border border-[#CFEAFF] px-3.5 py-1.5 rounded-full shadow-2xs">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFB800]"></span>
        </span>
        <span className="text-[11px] font-bold text-[#08245F] tracking-wider uppercase">
          DGCA AUTHORIZED RPTO (TN 21/2024) · COIMBATORE
        </span>
        <span className="text-[10px] text-slate-400 font-medium">|</span>
        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          10-Yr License
        </span>
      </div>

      {/* Top Right: CTA Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        <button
          id="header-download-brochure-btn"
          onClick={openBrochureModal}
          className="cursor-pointer flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold text-[#08245F] bg-[#F4FAFF] hover:bg-[#EAF5FF] border border-[#CFEAFF] transition-all shadow-2xs active:scale-98 shrink-0 whitespace-nowrap"
        >
          <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600 shrink-0" />
          <span className="hidden md:inline">Download Syllabus</span>
          <span className="md:hidden">Brochure</span>
        </button>

        <button
          id="header-enroll-now-btn"
          onClick={() => openEnrollModal()}
          className="cursor-pointer flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-sm transition-all border border-[#FFB800]/40 group whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#08245F] group-hover:rotate-12 transition-transform shrink-0" />
          <span>Enroll Now</span>
        </button>
      </div>
    </header>
  );
};

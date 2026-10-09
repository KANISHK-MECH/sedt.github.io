import React from 'react';
import { useApp } from '../../context/AppContext';
import { SriEshwarEmblem } from '../SriEshwarLogo';
import {
  Sparkles,
  FileText,
  Play,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle,
  ArrowRight,
  Plane,
  Compass,
  Zap,
  Target
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { openEnrollModal, openBrochureModal, openTourModal, setActiveTab } = useApp();

  const categoryBadges = [
    {
      title: 'Small Category',
      sub: '2 kg – 25 kg RPC',
      tag: '5-Day Certification',
      color: 'border-[#CFEAFF] bg-[#F4FAFF] text-[#08245F]',
      courseId: 'small-rpc'
    },
    {
      title: 'Medium Category',
      sub: '25 kg – 150 kg RPC',
      tag: 'Agri & Cargo Class',
      color: 'border-[#CFEAFF] bg-[#F4FAFF] text-[#08245F]',
      courseId: 'medium-rpc'
    },
    {
      title: 'Small Upgrade',
      sub: '3 Days Upgrade',
      tag: 'Micro to Small',
      color: 'border-[#CFEAFF] bg-[#F4FAFF] text-[#08245F]',
      courseId: 'small-upgrade'
    },
    {
      title: 'Medium Upgrade',
      sub: '3 Days Upgrade',
      tag: 'Small to Medium',
      color: 'border-[#CFEAFF] bg-[#F4FAFF] text-[#08245F]',
      courseId: 'medium-upgrade'
    },
    {
      title: 'Small + Medium Upgrade',
      sub: 'Combo Upgrade',
      tag: 'Complete Dual Master',
      color: 'border-red-200 bg-red-50/70 text-[#d71920]',
      courseId: 'combo-package'
    }
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5 min-h-full">
        {/* 1. HERO SECTION */}
        <div 
          className="relative rounded-3xl text-white p-5 sm:p-6 2xl:p-7 shadow-xl border border-white/20 overflow-hidden flex flex-col justify-between shrink-0"
          style={{
            background: 'linear-gradient(135deg, #08245F 0%, #073B8F 33%, #0057B8 66%, #087EDB 100%)'
          }}
        >
          {/* Aerodynamic Flight Wave Streamlines matching image.png */}
          <svg
            className="absolute right-0 top-0 bottom-0 w-3/5 h-full opacity-45 pointer-events-none"
            viewBox="0 0 600 300"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,230 C150,290 260,110 400,150 C500,175 550,95 600,60"
              stroke="url(#heroWaveGrad1)"
              strokeWidth="1.8"
            />
            <path
              d="M0,245 C140,300 270,125 390,165 C490,185 540,110 600,75"
              stroke="url(#heroWaveGrad1)"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
            <path
              d="M0,215 C160,280 250,95 410,135 C510,160 560,80 600,45"
              stroke="url(#heroWaveGrad2)"
              strokeWidth="1.5"
            />
            <path
              d="M0,200 C170,265 240,80 420,120 C520,145 570,65 600,30"
              stroke="url(#heroWaveGrad2)"
              strokeWidth="1.2"
            />
            <path
              d="M0,260 C130,310 280,145 380,180 C480,200 530,125 600,90"
              stroke="url(#heroWaveGrad1)"
              strokeWidth="1.2"
            />
            <defs>
              <linearGradient id="heroWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#087FE5" stopOpacity="0" />
                <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#CFEAFF" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="heroWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0057B8" stopOpacity="0" />
                <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#087FE5" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Upward Flying Airplane Silhouette matching image.png */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none transform -rotate-12">
            <Plane className="w-64 h-64 text-[#38BDF8]" />
          </div>

          {/* Top Tag & Official Sri Eshwar Logo Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-[#FFB800] text-[#08245F] shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#08245F]" />
                DGCA Approved RPTO
              </span>
              <span className="text-[11px] sm:text-xs text-[#CFEAFF] font-medium">
                Authorization: DGCA/RPTO-TN 21/2024
              </span>
            </div>

            {/* Official Logo Display */}
            <div className="bg-white rounded-xl py-1.5 px-3 shadow-md flex items-center space-x-2.5 border border-[#CFEAFF] shrink-0 self-start sm:self-auto">
              <SriEshwarEmblem className="w-9 h-4 sm:w-11 sm:h-5" />
              <div className="flex flex-col leading-none">
                <div className="text-[9px] sm:text-[10.5px] font-black text-[#08245F] tracking-tight uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  SRI ESHWAR
                </div>
                <div className="text-[11px] sm:text-[13px] font-black text-[#08245F] tracking-tight uppercase leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  DRONE TECH
                </div>
                <div className="text-[7px] sm:text-[8px] font-semibold text-slate-500 leading-none mt-0.5">
                  Sri Eshwar Drone Tech Pvt. Ltd.
                </div>
              </div>
            </div>
          </div>

          {/* Main Headings */}
          <div className="max-w-2xl 2xl:max-w-3xl space-y-2 relative z-10">
            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-black tracking-tight leading-tight uppercase text-white"
              style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
            >
              Become a <span className="text-[#FFB800]">DGCA Certified</span> Commercial Drone Pilot
            </h1>
            <p className="text-xs sm:text-sm 2xl:text-base text-slate-100 leading-relaxed max-w-xl 2xl:max-w-2xl">
              Fast-track your commercial drone pilot certification with certified DGCA instructors, 
              immersive simulator labs, and intensive field flight training at Kinathukadavu, Coimbatore.
            </p>
          </div>

          {/* Action Buttons matching image.png */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-5 relative z-10">
            <button
              id="home-hero-enroll-btn"
              onClick={() => openEnrollModal()}
              className="cursor-pointer flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs 2xl:text-sm font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all uppercase tracking-wide group whitespace-nowrap"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="home-hero-brochure-btn"
              onClick={openBrochureModal}
              className="cursor-pointer flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs 2xl:text-sm font-bold text-white bg-[#071D4A] hover:bg-[#073B8F] active:scale-98 border border-white/20 shadow-xs transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Syllabus</span>
            </button>

            <button
              id="home-hero-tour-btn"
              onClick={openTourModal}
              className="cursor-pointer flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs 2xl:text-sm font-bold text-amber-200 bg-[#071D4A] hover:bg-[#073B8F] active:scale-98 border border-amber-400/30 shadow-xs transition-all whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              <span>Campus Tour</span>
            </button>
          </div>
        </div>

        {/* 2. MIDDLE FEATURES ROW matching image.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 2xl:gap-4">
          <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 shadow-md shadow-sky-950/5 flex items-start space-x-3.5 hover:border-[#8CCCF5] transition-colors">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#08245F] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs 2xl:text-sm font-black text-[#08245F] uppercase tracking-wide">
                Official DGCA Curriculum
              </h3>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-relaxed">
                Complete theoretical flight planning, meteorology, ATC communication, and Digital Sky registration.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 shadow-md shadow-sky-950/5 flex items-start space-x-3.5 hover:border-[#8CCCF5] transition-colors">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFB800] text-[#08245F] flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5 fill-[#08245F] text-[#08245F]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs 2xl:text-sm font-black text-[#08245F] uppercase tracking-wide">
                High-Fidelity Simulators
              </h3>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-relaxed">
                12 dual-seat training simulators with realistic weather wind drift, emergency failures, and night modes.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 shadow-md shadow-sky-950/5 flex items-start space-x-3.5 hover:border-[#8CCCF5] transition-colors sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#087FE5] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs 2xl:text-sm font-black text-[#08245F] uppercase tracking-wide">
                Industrial Specializations
              </h3>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-relaxed">
                Hands-on electives in solar thermography, wind turbine blade audits, precision agriculture, and mapping.
              </p>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM CATEGORY BADGES STRIP (Responsive 2 to 5 Columns) */}
        <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 2xl:p-5 shadow-md shadow-sky-950/5 space-y-2.5 mt-auto shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#08245F]" />
              <h3 className="text-xs 2xl:text-sm font-black text-[#08245F] uppercase tracking-wide">
                DGCA Certified Course Categories
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="cursor-pointer text-[11px] 2xl:text-xs font-bold text-[#08245F] hover:text-[#FFB800] flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Course Details & Pricing</span>
              <ArrowRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
            </button>
          </div>

          {/* Column Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 2xl:gap-3.5">
            {categoryBadges.map((badge, idx) => (
              <button
                key={idx}
                id={`home-category-badge-${idx}`}
                onClick={() => {
                  setActiveTab('courses');
                }}
                className={`cursor-pointer text-left p-3 2xl:p-3.5 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-24 2xl:h-26 ${badge.color}`}
              >
                <div>
                  <span className="text-[9px] 2xl:text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                    {badge.tag}
                  </span>
                  <h4 className="text-xs 2xl:text-sm font-black leading-snug mt-0.5">
                    {badge.title}
                  </h4>
                </div>
                <p className="text-[10px] 2xl:text-[11px] font-semibold opacity-90 truncate">
                  {badge.sub}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

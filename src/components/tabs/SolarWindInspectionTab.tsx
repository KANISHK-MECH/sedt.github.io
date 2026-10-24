import React, { useEffect, useRef, useState } from 'react';
import {
  Sun,
  Wind,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WIND_INSPECTIONS } from '../../data/mockData';
import solarMappingAuditImg from '../../assets/images/regenerated_image_1791799694667.webp';

interface SolarWindInspectionTabProps {
  initialSection?: 'solar' | 'wind';
}

export const SolarWindInspectionTab: React.FC<SolarWindInspectionTabProps> = ({
  initialSection
}) => {
  const { openSolarBookingModal, openWindBookingModal, openEnrollModal, openLightbox } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'solar' | 'wind'>('all');
  const solarRef = useRef<HTMLDivElement>(null);
  const windRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload inspection images immediately on mount
  useEffect(() => {
    [solarMappingAuditImg].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    WIND_INSPECTIONS.forEach((card) => {
      if (card.image) {
        const img = new Image();
        img.src = card.image;
      }
    });
  }, []);

  // Auto-scroll to requested section if initialSection is provided
  useEffect(() => {
    if (initialSection === 'wind' && windRef.current) {
      setTimeout(() => {
        windRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveFilter('wind');
      }, 150);
    } else if (initialSection === 'solar' && solarRef.current) {
      setTimeout(() => {
        solarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveFilter('solar');
      }, 150);
    }
  }, [initialSection]);

  const scrollToSolar = () => {
    solarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveFilter('solar');
  };

  const scrollToWind = () => {
    windRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveFilter('wind');
  };

  const SOLAR_WORKFLOW_STEPS = [
    {
      id: 'solar-step-1',
      stepNumber: '01 — THERMAL FAULT DETECTION',
      headline: 'Find invisible PV faults & hot ribbons',
      description:
        'Radiometric thermal imaging detects hotspots, abnormal cell temperatures, bypass-diode faults, and localized thermal anomalies across PV modules.',
      output: 'Thermal map + ΔT hotspot classification + GPS coordinates',
      standard: 'IEC 62446-3 Thermography',
      image: '/images/thermal-image-1.webp'
    },
    {
      id: 'solar-step-2',
      stepNumber: '02 — RGB VISUAL INSPECTION',
      headline: 'Identify visible module & site damage',
      description:
        'High-resolution RGB imagery pinpoints glass fractures, PID warping, microcracks, vegetation encroachment, and localized dust soiling.',
      output: '48MP Orthomosaic + defect tagging + GPS location',
      standard: '48MP Orthomosaic RGB',
      image: '/images/rgb-solar-panel.webp'
    },
    {
      id: 'solar-step-3',
      stepNumber: '03 — MAPPING & INSPECTION REPORT',
      headline: 'Turn aerial data into actionable EPC punch-lists',
      description:
        'Receive a consolidated audit report with fault locations, annotated images, site maps, and a 3D digital twin model for warranty claims and maintenance.',
      output: 'Geospatial fault report + GIS layers + 3D site model',
      standard: 'Consolidated Geospatial Audit',
      image: solarMappingAuditImg
    }
  ];

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full overflow-y-auto scroll-smooth p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8 space-y-6 lg:space-y-8"
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto space-y-6 lg:space-y-8">
        
        {/* ========================================================
            1. UNIFIED CATEGORY HERO & JUMP CONTROLS
           ======================================================== */}
        <section
          className="text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 2xl:p-7 shadow-lg border border-white/10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #071D4A 0%, #08245F 35%, #073B8F 70%, #0057B8 100%)'
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] 2xl:text-xs font-black uppercase px-2.5 py-0.75 rounded-md bg-[#FFB800] text-[#08245F] shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#08245F]" />
                  Renewable Energy Drone Operations
                </span>
                <span className="text-[11px] 2xl:text-xs text-[#CFEAFF] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  IEC 62446-3, IEC 61400 & DNV-GL Certified
                </span>
              </div>

              <h1
                className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-black text-white tracking-tight uppercase"
                style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
              >
                Solar & Wind Energy Drone Inspections
              </h1>

              <p className="text-xs sm:text-sm 2xl:text-base text-slate-100 font-normal leading-relaxed max-w-2xl">
                Comprehensive autonomous UAV aerial surveys for renewable power infrastructure.
                Eliminate hazardous rope climbing and manual string walks while capturing sub-millimeter
                PV hotspot anomalies and high-altitude turbine blade structural damage.
              </p>

              {/* Quick Jump Action Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
                <button
                  onClick={scrollToSolar}
                  className="cursor-pointer inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <Sun className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Solar PV Inspections</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={scrollToWind}
                  className="cursor-pointer inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-black bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <Wind className="w-3.5 h-3.5 text-sky-300" />
                  <span>Wind Turbine Inspections</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={() => openSolarBookingModal()}
                  className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all shadow-xs uppercase tracking-wider"
                >
                  <Sun className="w-3.5 h-3.5 text-[#08245F]" />
                  <span>Book Solar</span>
                </button>

                <button
                  onClick={() => openWindBookingModal()}
                  className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black text-white bg-sky-500 hover:bg-sky-400 active:scale-98 transition-all shadow-md uppercase tracking-wider border border-white/20 ml-auto lg:ml-0"
                >
                  <Wind className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Book Wind</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Badge Column */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-2.5 shrink-0 min-w-[200px] lg:min-w-[220px]">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 2xl:p-3 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#FFB800]/20 text-[#FFB800] shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm 2xl:text-base font-black text-white">IEC 62446-3</div>
                  <div className="text-[10px] text-slate-300 font-medium">Thermal PV Standard</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 2xl:p-3 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-sky-400/20 text-sky-300 shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm 2xl:text-base font-black text-white">0.1 mm Precision</div>
                  <div className="text-[10px] text-slate-300 font-medium">Blade Crack Detection</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 2xl:p-3 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-400/20 text-emerald-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm 2xl:text-base font-black text-white">Zero Climber Risk</div>
                  <div className="text-[10px] text-slate-300 font-medium">100% Autonomous Flights</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. SECTION A: SOLAR PV DRONE INSPECTION
           ======================================================== */}
        <section
          ref={solarRef}
          id="solar-inspection-section"
          className="space-y-4 pt-2 scroll-mt-6"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#CFEAFF]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Category Part 1
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Photovoltaic Asset Integrity
                  </span>
                </div>
                <h2
                  className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] tracking-tight uppercase"
                  style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
                >
                  Solar PV Drone Inspection & Thermal Analysis
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => openSolarBookingModal()}
                className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Solar Inspection</span>
              </button>
            </div>
          </div>

          {/* Workflow Steps Grid (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 2xl:gap-5">
            {SOLAR_WORKFLOW_STEPS.map((card) => {
              const displayImage = card.image;

              return (
                <div
                  key={card.id}
                  className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 2xl:p-5 shadow-sm hover:shadow-md hover:border-[#8CCCF5] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3 flex-1 flex flex-col">
                    {/* Image Frame */}
                    <div className="relative h-40 sm:h-44 md:h-36 lg:h-40 xl:h-44 2xl:h-52 w-full rounded-xl overflow-hidden bg-slate-900 border border-[#CFEAFF] group shrink-0">
                      <img
                        id={`solar-card-img-${card.id}`}
                        src={displayImage}
                        alt={card.headline}
                        loading="eager"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (card.id === 'solar-step-1' && !target.src.includes('/images/thermal-image-1.webp')) {
                            target.src = '/images/thermal-image-1.webp';
                          } else if (card.id === 'solar-step-2' && !target.src.includes('rgb-solar-panel.webp')) {
                            target.src = '/images/rgb-solar-panel.webp';
                          } else if (card.id === 'solar-step-3' && !target.src.includes('/images/solar-mapping-audit.webp')) {
                            target.src = '/images/solar-mapping-audit.webp';
                          }
                        }}
                      />

                      {/* Standard Tag */}
                      <div className="absolute top-2 left-2 bg-[#071D4A]/90 backdrop-blur-xs text-[#FFB800] text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded border border-white/10 uppercase shadow-xs">
                        {card.standard}
                      </div>

                      {/* Zoom Lightbox Click */}
                      <button
                        onClick={() => openLightbox(displayImage, card.headline, card.description)}
                        className="cursor-pointer absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 text-[9px] 2xl:text-xs font-bold px-2 py-0.5 rounded shadow-xs transition-colors"
                      >
                        Inspect Full-Res
                      </button>
                    </div>

                    {/* Step Eyebrow & Title */}
                    <div className="space-y-1 shrink-0">
                      <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#087FE5] uppercase block">
                        {card.stepNumber}
                      </span>
                      <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#08245F] leading-snug">
                        {card.headline}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Output Specification */}
                    <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-lg p-2.5 mt-auto shrink-0">
                      <span className="text-[9px] 2xl:text-[10px] font-black uppercase text-[#08245F] tracking-wider block">
                        Expected Output Deliverable
                      </span>
                      <p className="text-[10px] sm:text-[11px] 2xl:text-xs font-semibold text-[#08245F] leading-tight mt-0.5">
                        {card.output}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <button
                    onClick={() => openSolarBookingModal()}
                    className="cursor-pointer w-full mt-3 py-2 px-3 rounded-xl text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all text-center shadow-xs shrink-0"
                  >
                    Book Solar Inspection
                  </button>
                </div>
              );
            })}
          </div>

          {/* Solar Value Highlights Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            <div className="bg-white border border-[#CFEAFF] rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-amber-600 block">Fast Turnaround</span>
              <p className="text-xs sm:text-sm font-bold text-[#08245F] mt-0.5">50 MW in Under 2 Days</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Autonomous waypoint flight sweeps</p>
            </div>
            <div className="bg-white border border-[#CFEAFF] rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-sky-600 block">Fault Resolution</span>
              <p className="text-xs sm:text-sm font-bold text-[#08245F] mt-0.5">Cell-Level Hotspot ΔT</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Radiometric thermal sensors</p>
            </div>
            <div className="bg-white border border-[#CFEAFF] rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-emerald-600 block">Revenue Recovery</span>
              <p className="text-xs sm:text-sm font-bold text-[#08245F] mt-0.5">+5% to +12% Generation</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Fix inactive strings & PID modules</p>
            </div>
            <div className="bg-white border border-[#CFEAFF] rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-indigo-600 block">Deliverables</span>
              <p className="text-xs sm:text-sm font-bold text-[#08245F] mt-0.5">CAD / KMZ / GIS Exports</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ready for EPC maintenance crews</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. SMOOTH SECTION BRIDGE / SCROLL CONNECTOR
           ======================================================== */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="w-full border-t border-[#CFEAFF]" />
          <div className="absolute px-4 py-1.5 rounded-full bg-[#071D4A] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-md border border-white/10">
            <span>Scroll for Wind Turbine Inspections</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#FFB800] animate-bounce" />
          </div>
        </div>

        {/* ========================================================
            4. SECTION B: WIND TURBINE BLADE & NACELLE UAV SURVEYS
           ======================================================== */}
        <section
          ref={windRef}
          id="wind-turbine-section"
          className="space-y-4 pt-2 scroll-mt-6"
        >
          {/* Section Header & Stats Banner */}
          <div
            className="text-white rounded-2xl p-4 sm:p-5 2xl:p-6 shadow-md border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
            style={{
              background: 'linear-gradient(135deg, #08245F 0%, #073B8F 50%, #0057B8 100%)'
            }}
          >
            <div className="space-y-1.5 max-w-xl 2xl:max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#d71920] text-white">
                  Category Part 2 • Extreme Altitude Asset Inspections
                </span>
                <span className="text-xs 2xl:text-sm text-slate-300 font-semibold">
                  DNV-GL & IEC 61400 Standards
                </span>
              </div>
              <h2
                className="text-lg sm:text-xl 2xl:text-2xl font-black text-white tracking-tight uppercase"
                style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
              >
                Wind Turbine Blade & Nacelle UAV Surveys
              </h2>
              <p className="text-xs 2xl:text-sm text-slate-200 leading-relaxed">
                Eliminate dangerous rope-access climbing. Sri Eshwar trained drone pilots capture 0.1mm blade cracks, 
                leading edge erosion, lightning receptor punctures, and generator thermal stress in under 45 minutes per turbine.
              </p>
            </div>

            {/* Quick Stats Grid & Booking CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="grid grid-cols-3 gap-2 2xl:gap-3 shrink-0">
                <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 2xl:p-3.5 text-center">
                  <span className="text-base 2xl:text-xl font-black text-[#FFB800]">45 Mins</span>
                  <p className="text-[9px] 2xl:text-[10px] text-slate-300 uppercase font-semibold">Per Turbine</p>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 2xl:p-3.5 text-center">
                  <span className="text-base 2xl:text-xl font-black text-emerald-400">0.1 mm</span>
                  <p className="text-[9px] 2xl:text-[10px] text-slate-300 uppercase font-semibold">Crack Precision</p>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-xl p-2.5 2xl:p-3.5 text-center">
                  <span className="text-base 2xl:text-xl font-black text-white">100% Zero</span>
                  <p className="text-[9px] 2xl:text-[10px] text-slate-300 uppercase font-semibold">Climber Risk</p>
                </div>
              </div>

              <button
                type="button"
                id="book-wind-inspection-btn"
                onClick={openWindBookingModal}
                className="cursor-pointer inline-flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all shadow-md uppercase tracking-wider whitespace-nowrap self-stretch sm:self-auto"
              >
                <Calendar className="w-4 h-4 text-[#08245F]" />
                <span>Book Wind Inspection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Three Wind Inspection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 2xl:gap-5">
            {WIND_INSPECTIONS.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4 2xl:p-5 shadow-sm hover:shadow-md hover:border-[#8CCCF5] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Image Frame */}
                  <div className="relative h-40 sm:h-44 md:h-36 lg:h-40 xl:h-44 2xl:h-52 w-full rounded-xl overflow-hidden bg-slate-900 border border-[#CFEAFF] group">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('photo-1466611653911')) {
                          target.src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=700&q=80';
                        }
                      }}
                    />

                    {/* Standard Tag */}
                    <div className="absolute top-2 left-2 bg-[#071D4A]/90 text-[#FFB800] text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-white/10 uppercase shadow-xs">
                      {card.standard}
                    </div>

                    {/* Zoom Lightbox */}
                    <button
                      onClick={() => openLightbox(card.image, card.title, card.description)}
                      className="cursor-pointer absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 text-[9px] 2xl:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs transition-colors"
                    >
                      Inspect Full-Res
                    </button>
                  </div>

                  {/* Title & Fault Type */}
                  <div>
                    <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#08245F] leading-snug">
                      {card.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[9px] 2xl:text-[10px] font-extrabold text-[#d71920] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                        ⚡ {card.faultType}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] 2xl:text-xs text-slate-600 leading-snug">
                    {card.description}
                  </p>

                  {/* Specs */}
                  <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-2.5 space-y-1 text-[10px] 2xl:text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">Optical Sensor:</span>
                      <span className="font-bold truncate max-w-[150px] 2xl:max-w-[200px]">{card.resolution}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">Preventive Benefit:</span>
                      <span className="font-extrabold text-emerald-700 truncate max-w-[150px] 2xl:max-w-[200px]">{card.efficiencyImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Book Inspection & Training */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={openWindBookingModal}
                    className="cursor-pointer py-2 px-2 rounded-xl text-[11px] 2xl:text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-colors text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-[#08245F]" />
                    <span>Book Survey</span>
                  </button>
                  <button
                    onClick={() => openEnrollModal('combo-package')}
                    className="cursor-pointer py-2 px-2 rounded-xl text-[11px] 2xl:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-colors text-center border border-slate-200"
                  >
                    <span>Pilot Training</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer Bar */}
          <div className="bg-white border border-[#CFEAFF] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs 2xl:text-sm text-slate-700 shadow-xs">
            <span className="font-bold text-[#08245F] flex items-center gap-1.5 text-[11px] 2xl:text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              Field training includes high wind-turbulence stabilization on Muppandal & Udumalpet wind corridors.
            </span>
            <button
              onClick={() => openEnrollModal()}
              className="cursor-pointer text-[11px] 2xl:text-xs font-bold text-[#087FE5] hover:text-[#0057B8] transition-colors flex items-center gap-1"
            >
              <span>Enroll for Advanced Industrial Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

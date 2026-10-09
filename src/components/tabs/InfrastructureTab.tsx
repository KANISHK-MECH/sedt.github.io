import React from 'react';
import { FACILITIES } from '../../data/mockData';
import {
  Building2,
  Plane,
  Monitor,
  Wrench,
  GraduationCap,
  Sparkles,
  Eye,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InfrastructureTab: React.FC = () => {
  const { openLightbox, openTourModal, openEnrollModal } = useApp();

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5 min-h-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CFEAFF] pb-2.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#F4FAFF] text-[#08245F] border border-[#CFEAFF]">
                World-Class Training Ecosystem
              </span>
              <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                Sri Eshwar College Campus, Kinathukadavu
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] mt-0.5 tracking-tight uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
            >
              DGCA RPTO Campus & Flight Infrastructure
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={openTourModal}
              className="cursor-pointer text-xs 2xl:text-sm font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>▶ 360° Video Campus Tour</span>
            </button>
          </div>
        </div>

        {/* Facility Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">15+ Acres</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">DGCA Airfield Turf</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">Multi-Storey</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">RPTO Headquarters</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">12 Simulators</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">PX4 Digital Flight Lab</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">2 Drone Stations</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">Assembly & Avionics Bays</p>
          </div>
        </div>

        {/* 8 Infrastructure Cards Grid (Responsive 1 -> 2 -> 3 -> 4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 2xl:gap-4 flex-1 min-h-0">
          {FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="bg-white border border-[#CFEAFF] rounded-2xl p-3 sm:p-3.5 2xl:p-4 shadow-sm hover:shadow-md hover:border-[#8CCCF5] transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Photo Banner with Clickable Lightbox */}
                <div className="relative h-36 sm:h-40 2xl:h-44 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = '1';
                        target.src = '/images/airfield.webp';
                      } else {
                        target.onerror = null;
                        target.src = '/images/drone-infra-building.webp';
                      }
                    }}
                  />

                  {/* Badge Tag */}
                  <div className="absolute top-2 left-2 bg-[#071D4A]/90 text-[#FFB800] text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-white/10 uppercase backdrop-blur-xs">
                    {facility.stats}
                  </div>

                  {/* Click to Zoom */}
                  <button
                    onClick={() => openLightbox(facility.image, facility.name, facility.description)}
                    className="cursor-pointer absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 text-[9px] 2xl:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3 text-[#08245F]" />
                    <span>Enlarge</span>
                  </button>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#08245F] line-clamp-1">
                    {facility.name}
                  </h3>
                  <p className="text-[10px] 2xl:text-xs font-bold text-[#d71920] mt-0.5 truncate">
                    {facility.subtitle}
                  </p>
                  <p className="text-[11px] 2xl:text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                    {facility.description}
                  </p>
                </div>

                {/* Bullet highlights */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 2xl:p-2.5 space-y-1">
                  {facility.highlights.slice(0, 3).map((hl, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-[10px] 2xl:text-xs text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openLightbox(facility.image, facility.name, facility.description)}
                className="cursor-pointer w-full mt-2.5 py-1.5 2xl:py-2 px-2 rounded-lg text-[11px] 2xl:text-xs font-bold text-[#08245F] bg-[#F4FAFF] hover:bg-[#EAF5FF] border border-[#CFEAFF] transition-colors text-center"
              >
                View HD Facility Gallery
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

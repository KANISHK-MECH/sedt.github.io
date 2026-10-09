import React from 'react';
import { INSTRUCTORS } from '../../data/mockData';
import {
  ShieldCheck,
  Award,
  Compass,
  CheckCircle2,
  Users,
  Plane,
  Building,
  FileCheck,
  CalendarCheck,
  UserCheck,
  Eye,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutTab: React.FC = () => {
  const { openTourModal, openEnrollModal, openLightbox } = useApp();

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5 min-h-full">
        {/* 1. TOP SECTION: RPTO CREDENTIALS & COMPANY HEADQUARTERS SHOWCASE */}
        <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 sm:p-4.5 2xl:p-5 shadow-sm space-y-3.5 sm:space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#F4FAFF] text-[#08245F] border border-[#CFEAFF]">
                  Official RPTO Organization
                </span>
                <span className="text-xs 2xl:text-sm font-bold text-slate-500">
                  Coimbatore, Tamil Nadu
                </span>
              </div>
              <h2
                className="text-xl 2xl:text-2xl font-black text-[#08245F] mt-1 uppercase tracking-tight"
                style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
              >
                Sri Eshwar Drone Tech Pvt Ltd
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={openTourModal}
                className="cursor-pointer text-xs 2xl:text-sm font-bold text-[#08245F] bg-[#F4FAFF] hover:bg-[#EAF5FF] px-3 py-1.5 rounded-lg border border-[#CFEAFF] transition-colors flex items-center gap-1.5"
              >
                <span>▶ 360° Campus Tour</span>
              </button>
              <button
                onClick={() => openEnrollModal()}
                className="cursor-pointer text-xs 2xl:text-sm font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                Apply for Next Batch
              </button>
            </div>
          </div>

          {/* COMPANY CAMPUS BUILDING FEATURE BANNER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 2xl:gap-5 items-stretch bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-2xl border border-[#CFEAFF] p-3 sm:p-4 overflow-hidden">
            {/* Building Photo with Click-to-Enlarge Lightbox */}
            <div className="lg:col-span-5 xl:col-span-5 relative rounded-xl overflow-hidden shadow-xs border border-slate-200 group bg-slate-900 min-h-[220px] sm:min-h-[250px] lg:min-h-[260px] flex items-center justify-center">
              <img
                src="/images/Drone-Infra-Bulding.webp"
                alt="Sri Eshwar Drone Tech Headquarters Building"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = '1';
                    target.src = '/images/drone-infra-building.webp';
                  } else {
                    target.onerror = null;
                    target.src = '/images/airfield.webp';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D4A]/90 via-[#071D4A]/25 to-transparent pointer-events-none" />

              {/* Tag / Badge on Image */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#071D4A]/90 text-[#FFB800] text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-white/10 shadow-xs backdrop-blur-xs">
                <Building className="w-3 h-3" />
                <span>Headquarters & Flight Center</span>
              </div>

              {/* Enlarge Button */}
              <button
                type="button"
                onClick={() =>
                  openLightbox(
                    '/images/Drone-Infra-Bulding.webp',
                    'Sri Eshwar Drone Tech Pvt Ltd - Corporate & Training Campus',
                    'Modern multi-storey DGCA Authorized RPTO Training Facility & Airfield at Kinathukadavu, Coimbatore, Tamil Nadu.'
                  )
                }
                className="cursor-pointer absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-slate-800 text-[10px] 2xl:text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 z-10"
              >
                <Eye className="w-3.5 h-3.5 text-[#08245F]" />
                <span>Enlarge Photo</span>
              </button>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-2.5 left-2.5 text-white pr-28 pointer-events-none">
                <p className="text-xs sm:text-sm font-black leading-tight drop-shadow-sm">
                  Sri Eshwar Drone Tech
                </p>
                <p className="text-[10px] 2xl:text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#FFB800] shrink-0" />
                  <span>Kinathukadavu, Coimbatore</span>
                </p>
              </div>
            </div>

            {/* Overview & Facility Narrative */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] 2xl:text-xs font-bold text-[#d71920] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    State-of-the-art RPTO Campus
                  </span>
                </div>
                <h3 className="text-base sm:text-lg 2xl:text-xl font-black text-[#08245F] leading-snug">
                  World-Class Aviation Infrastructure for Next-Generation Drone Pilots
                </h3>
                <p className="text-xs 2xl:text-sm text-slate-600 leading-relaxed">
                  Sri Eshwar Drone Tech Pvt Ltd operates from a purpose-built, multi-storey aviation campus in Kinathukadavu, Coimbatore. Authorized by the Directorate General of Civil Aviation (DGCA/RPTO-TN 21/2024), the facility integrates precision flight simulators, advanced avionics labs, digital ground-school lecture halls, and direct access to 15+ acres of certified Green Zone flying fields.
                </p>
              </div>

              {/* Quick Facility Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80">
                <div className="bg-white rounded-lg p-2 border border-[#CFEAFF]">
                  <span className="text-[10px] text-slate-500 font-medium block">Campus Airspace</span>
                  <span className="text-xs font-extrabold text-[#08245F]">15+ Acres Green Zone</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#CFEAFF]">
                  <span className="text-[10px] text-slate-500 font-medium block">Flight Simulators</span>
                  <span className="text-xs font-extrabold text-[#08245F]">12 Dual-Cockpit Stations</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#CFEAFF] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 font-medium block">Classroom Tech</span>
                  <span className="text-xs font-extrabold text-[#08245F]">Smart Interactive AV</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 2xl:gap-4">
            <div className="p-3 2xl:p-3.5 rounded-xl bg-[#F4FAFF] border border-[#CFEAFF] space-y-1">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-4 h-4 text-[#08245F]" />
                <span className="text-[9px] 2xl:text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <h4 className="text-xs 2xl:text-sm font-black text-[#08245F]">DGCA RPTO License</h4>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-snug">
                Authorized Remote Pilot Training Org (DGCA/RPTO-TN 21/2024) by the Directorate General of Civil Aviation.
              </p>
            </div>

            <div className="p-3 2xl:p-3.5 rounded-xl bg-[#F4FAFF] border border-[#CFEAFF] space-y-1">
              <div className="flex items-center justify-between">
                <Plane className="w-4 h-4 text-[#FFB800]" />
                <span className="text-[9px] 2xl:text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  15+ Acres
                </span>
              </div>
              <h4 className="text-xs 2xl:text-sm font-black text-[#08245F]">Kinathukadavu Airfield</h4>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-snug">
                Unrestricted Green Zone flying zone with dual runways, calibrated landing pads & live weather telemetry.
              </p>
            </div>

            <div className="p-3 2xl:p-3.5 rounded-xl bg-[#F4FAFF] border border-[#CFEAFF] space-y-1">
              <div className="flex items-center justify-between">
                <Award className="w-4 h-4 text-[#d71920]" />
                <span className="text-[9px] 2xl:text-[10px] font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                  99.4% Pass
                </span>
              </div>
              <h4 className="text-xs 2xl:text-sm font-black text-[#08245F]">Exam Pass Guarantee</h4>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-snug">
                Over 1,250 pilots trained with high first-attempt pass records on official DGCA skill evaluations.
              </p>
            </div>

            <div className="p-3 2xl:p-3.5 rounded-xl bg-[#F4FAFF] border border-[#CFEAFF] space-y-1">
              <div className="flex items-center justify-between">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] 2xl:text-[10px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                  Digital Sky
                </span>
              </div>
              <h4 className="text-xs 2xl:text-sm font-black text-[#08245F]">Direct License Issue</h4>
              <p className="text-[11px] 2xl:text-xs text-slate-600 leading-snug">
                Immediate Remote Pilot Certificate (RPC) endorsement uploaded directly onto the Digital Sky platform.
              </p>
            </div>
          </div>
        </div>

        {/* 2. INSTRUCTOR PROFILES SECTION */}
        <div className="bg-white border border-[#CFEAFF] rounded-2xl p-4.5 2xl:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#08245F]" />
              <h3 className="text-xs 2xl:text-sm font-black text-[#08245F] uppercase tracking-wide">
                Certified DGCA Flight & Ground Instructors
              </h3>
            </div>
            <span className="text-[10px] 2xl:text-xs text-slate-500 font-semibold">
              All CFI & Ground Examiners hold active DGCA badges
            </span>
          </div>

          {/* 4 Instructor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 2xl:gap-4">
            {INSTRUCTORS.map((instructor) => (
              <div
                key={instructor.id}
                className="bg-white border border-[#CFEAFF] rounded-xl p-3 2xl:p-3.5 flex flex-col justify-between hover:border-[#8CCCF5] hover:shadow-sm transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-xl object-cover object-top border border-slate-300 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                      style={{ objectPosition: instructor.imagePosition || 'top' }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/Mr.M.Mahaboob.webp';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs 2xl:text-sm font-black text-[#08245F] leading-tight whitespace-pre-line break-words">
                        {instructor.name}
                      </h4>
                      <p className="text-[10px] 2xl:text-xs font-bold text-[#d71920] truncate">
                        {instructor.role}
                      </p>
                      <span className="text-[9px] 2xl:text-[10px] font-semibold text-slate-500 block truncate">
                        {instructor.dgcaNumber}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] 2xl:text-xs text-slate-600 leading-snug line-clamp-3">
                    {instructor.bio}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200">
                  <span className="text-[9px] 2xl:text-[10px] font-bold text-[#08245F] bg-[#F4FAFF] border border-[#CFEAFF] px-2 py-0.5 rounded block truncate text-center">
                    🎯 {instructor.specialization}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Directorate Contact Notice */}
          <div className="mt-4 p-3 rounded-xl bg-[#F4FAFF] border border-[#CFEAFF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[#FFB800] shrink-0" />
              <span className="text-slate-700 font-medium">
                For administrative, batch booking & DGCA regulatory enquiries:
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span>Accountable Manager: <a href="tel:+919500635060" className="text-[#08245F] hover:text-[#d71920] underline">+91 95006 35060</a></span>
              <span className="text-slate-300">•</span>
              <span>Chief Instructor: <a href="tel:+919894743267" className="text-[#08245F] hover:text-[#d71920] underline">+91 98947 43267</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

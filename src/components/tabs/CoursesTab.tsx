import React from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  Award,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { courses, openEnrollModal, openDetailsModal } = useApp();

  // Separate courses: 4 in the 2x2 grid, 1 in the tall right combo card
  const gridCourses = courses.filter((c) => c.category !== 'combo');
  const comboCourse = courses.find((c) => c.category === 'combo') || courses[courses.length - 1];

  const formatPrice = (amount?: number) => {
    if (typeof amount !== 'number') return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5 min-h-full">
        {/* 1. TOP HEADER & SUBTITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#08245F] border border-[#CFEAFF]">
                DGCA Certified Syllabus
              </span>
              <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                Rule 38 of Drone Rules 2021
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] mt-0.5 tracking-tight uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
            >
              DGCA Remote Pilot Certification Courses
            </h2>
            <p className="text-xs 2xl:text-sm text-slate-600 font-medium">
              Five government-approved courses for commercial drone operations in India.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] sm:text-[11px] 2xl:text-xs font-bold text-slate-600 bg-white px-2.5 sm:px-3 py-1 rounded-lg border border-[#CFEAFF]">
              GST & Flight Exam Included
            </span>
          </div>
        </div>

        {/* 2. MAIN COURSES GRID (2x2 Left Grid + 1 Full-Height Right Combo Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 2xl:gap-4 flex-1 min-h-0">
          {/* Left: 2x2 Grid (8 Columns on lg) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-4">
            {gridCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 2xl:p-4 shadow-sm hover:shadow-md hover:border-[#8CCCF5] transition-all flex flex-col justify-between relative group"
              >
                <div className="space-y-2.5">
                  {/* Course Image Banner */}
                  <div className="relative h-28 sm:h-32 2xl:h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={course.image}
                      alt={course.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                      style={{ objectFit: 'fill' }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/airfield.webp';
                      }}
                    />
                    {/* Crimson Category Tag */}
                    <div className="absolute top-2 left-2 bg-[#d71920] text-white text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                      {course.category.includes('upgrade') ? 'Upgrade Course' : 'Full Certification'}
                    </div>

                    {/* Duration pill */}
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] 2xl:text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFB800]" />
                      {course.duration}
                    </div>
                  </div>

                  {/* Title & Weight */}
                  <div>
                    <h3 className="text-xs sm:text-sm 2xl:text-base font-black text-[#08245F] leading-snug line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-[10px] 2xl:text-xs text-slate-500 font-semibold truncate mt-0.5">
                      {course.weightClass}
                    </p>
                  </div>

                  {/* Pricing & Admission Status */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-base 2xl:text-lg font-black text-[#d71920]">
                        {formatPrice(course.price)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-[10px] 2xl:text-xs text-slate-400 line-through ml-1.5 font-medium">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] 2xl:text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Admissions Open
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    id={`course-details-${course.id}`}
                    onClick={() => openDetailsModal(course)}
                    className="cursor-pointer py-1.5 2xl:py-2 px-2 rounded-lg text-[11px] 2xl:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-center"
                  >
                    View Details
                  </button>
                  <button
                    id={`course-apply-${course.id}`}
                    onClick={() => openEnrollModal(course.id)}
                    className="cursor-pointer py-1.5 2xl:py-2 px-2 rounded-lg text-[11px] 2xl:text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-2xs transition-all text-center"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Tall Right Combo Card (4 Columns on lg) */}
          {comboCourse && (
            <div className="lg:col-span-4 bg-gradient-to-b from-[#08245F] to-[#071D4A] text-white border-2 border-[#FFB800]/80 rounded-2xl p-4 2xl:p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
              {/* Top Best Value Banner */}
              <div className="absolute top-0 right-0 bg-[#d71920] text-white text-[10px] 2xl:text-xs font-black px-4 py-1 rounded-bl-xl shadow-md uppercase tracking-wider flex items-center gap-1 z-10">
                <Sparkles className="w-3 h-3" />
                Best Value Combo
              </div>

              <div className="space-y-3 relative z-0">
                <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-[#FFB800]">
                  Dual DGCA Pilot License
                </span>

                {/* Course Image */}
                <div className="relative h-36 2xl:h-44 w-full rounded-xl overflow-hidden border border-white/20">
                  <img
                    id="combo-course-image"
                    src={comboCourse.image || '/images/small-medium-class.webp'}
                    alt={comboCourse.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-fill object-center"
                    style={{ objectFit: 'fill' }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = '/images/small-medium-class.webp';
                      } else {
                        target.onerror = null;
                        target.src = '/images/drone-infra-building.webp';
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-[#071D4A]/90 backdrop-blur-xs text-white text-[10px] 2xl:text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-[#FFB800]" />
                    {comboCourse.duration} Intensive
                  </div>
                </div>

                <div>
                  <h3 className="text-sm 2xl:text-base font-black text-white leading-snug">
                    {comboCourse.name}
                  </h3>
                  <p className="text-[11px] 2xl:text-xs text-amber-300 font-semibold mt-0.5">
                    {comboCourse.weightClass}
                  </p>
                  <p className="text-[11px] 2xl:text-xs text-slate-300 mt-1 leading-snug">
                    Save ₹8,000+ with bundled dual small & medium class certification with live agricultural spray drills.
                  </p>
                </div>

                {/* Highlights bullets */}
                <div className="space-y-1 bg-white/5 rounded-xl p-2.5 2xl:p-3 border border-white/10 text-[10px] 2xl:text-xs text-slate-200">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Dual Small + Medium RPC Licenses</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                    <span>Agri Spraying & Heavy Hexacopter Training</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                    <span>Free Solar/Wind Industrial Module</span>
                  </div>
                </div>

                {/* Pricing section */}
                <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl 2xl:text-2xl font-black text-[#FFB800]">
                      {formatPrice(comboCourse.price)}
                    </span>
                    <span className="text-xs 2xl:text-sm text-slate-400 line-through ml-2 font-medium">
                      {formatPrice(comboCourse.originalPrice || 55000)}
                    </span>
                  </div>
                  <span className="text-[9px] 2xl:text-[10px] font-extrabold text-[#08245F] bg-[#FFB800] px-2 py-0.5 rounded-full uppercase">
                    Admissions Open
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/10">
                <button
                  id="combo-details-btn"
                  onClick={() => openDetailsModal(comboCourse)}
                  className="cursor-pointer py-2 px-2 rounded-xl text-xs 2xl:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-center"
                >
                  Curriculum
                </button>
                <button
                  id="combo-apply-btn"
                  onClick={() => openEnrollModal(comboCourse.id)}
                  className="cursor-pointer py-2 px-2 rounded-xl text-xs 2xl:text-sm font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all text-center flex items-center justify-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. BOTTOM ELIGIBILITY REQUIREMENTS BAR */}
        <div className="bg-white border border-[#CFEAFF] rounded-xl px-4 py-2.5 2xl:py-3 flex flex-wrap items-center justify-between text-xs 2xl:text-sm text-slate-700 shadow-2xs shrink-0 mt-auto">
          <span className="font-extrabold text-[#08245F] uppercase tracking-wider text-[11px] 2xl:text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            DGCA Eligibility Requirements:
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] 2xl:text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Age 18+ Years
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 10th Standard Pass
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Indian Citizen (Aadhaar/Passport)
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid Medical Certificate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

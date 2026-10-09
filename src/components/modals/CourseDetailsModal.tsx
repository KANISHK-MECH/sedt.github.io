import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  Award,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const CourseDetailsModal: React.FC = () => {
  const {
    isDetailsOpen,
    closeDetailsModal,
    selectedCourseForDetails,
    openEnrollModal
  } = useApp();

  if (!isDetailsOpen || !selectedCourseForDetails) return null;

  const course = selectedCourseForDetails;

  const handleApply = () => {
    const id = course.id;
    closeDetailsModal();
    openEnrollModal(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#08245F] to-[#073B8F] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-[#FFB800]" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFB800]">
                DGCA Approved Certification
              </span>
              <h3 className="text-sm font-black">
                {course.name}
              </h3>
            </div>
          </div>
          <button
            onClick={closeDetailsModal}
            className="cursor-pointer text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700">
          {/* Top Banner with Image and Specs */}
          <div className="flex flex-col sm:flex-row gap-3.5 bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3">
            <img
              src={course.image}
              alt={course.name}
              loading="lazy"
              decoding="async"
              className="w-full sm:w-44 h-28 rounded-lg object-fill border border-slate-200"
              style={{ objectFit: 'fill' }}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/airfield.webp';
              }}
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#d71920] uppercase">
                  {course.weightClass}
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-[#08245F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FFB800]" /> {course.duration}
                  </span>
                  <span className="text-emerald-700 font-bold">10-Yr License</span>
                </div>
                <span className="text-base font-black text-[#d71920]">
                  {typeof course.price === 'number'
                    ? `₹${course.price.toLocaleString('en-IN')}`
                    : 'On Request'}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-[#08245F] uppercase tracking-wide flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              Course Key Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Day Detailed Syllabus */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-[#08245F] uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Day-by-Day Syllabus Breakdown
            </h4>
            <div className="space-y-1.5 bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3">
              {course.syllabus.map((syl, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                  <span className="font-extrabold text-[#08245F] shrink-0 text-[11px]">
                    Step {idx + 1}:
                  </span>
                  <span className="leading-snug">{syl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-[#08245F] uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Mandatory DGCA Candidate Prerequisites
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.prerequisites.map((req, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200"
                >
                  ✓ {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={closeDetailsModal}
            className="cursor-pointer text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Back to Catalog
          </button>
          <button
            onClick={handleApply}
            className="cursor-pointer flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all uppercase tracking-wide"
          >
            <span>Apply For This Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

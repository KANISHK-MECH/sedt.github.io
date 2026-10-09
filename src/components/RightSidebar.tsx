import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Sparkles,
  Users,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { news, batches, openEnrollModal, setActiveTab } = useApp();

  return (
    <aside className="hidden xl:flex xl:w-64 2xl:w-72 3xl:w-80 bg-transparent shrink-0 flex-col py-1 pr-3 sm:pr-4 pl-1 space-y-3 overflow-y-auto">
      {/* 1. UPCOMING BATCHES CARD */}
      <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 shadow-md shadow-sky-950/5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#FFB800]">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                Upcoming Batches
              </h3>
              <p className="text-[10px] text-slate-500">DGCA Scheduled Flights</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold text-[#d71920] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#d71920]" />
            Fast-Track
          </span>
        </div>

        <div className="space-y-2">
          {batches.slice(0, 3).map((batch) => (
            <div
              key={batch.id}
              className="p-2.5 rounded-xl border border-slate-100 hover:border-[#CFEAFF] bg-slate-50/70 hover:bg-white transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#08245F] truncate max-w-[140px]">
                  {batch.name}
                </span>
                <span
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white"
                  style={{ backgroundColor: batch.badgeColor || '#08245F' }}
                >
                  {batch.status || 'Admissions Open'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {batch.startDate.split(',')[1]?.trim() || batch.startDate}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {batch.duration.split('(')[0]?.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          id="right-sidebar-book-seat-btn"
          onClick={() => openEnrollModal()}
          className="w-full cursor-pointer flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all shadow-sm"
        >
          <span>Book Your Seat Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. NEWS & UPDATES CARD */}
      <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 shadow-md shadow-sky-950/5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#08245F]">
              <Sparkles className="w-4 h-4 text-[#08245F]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                RPTO News & Updates
              </h3>
              <p className="text-[10px] text-slate-500">Live Circulars</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>

        <div className="space-y-2.5">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase text-[#d71920] bg-red-50 px-1 rounded">
                  {item.category}
                </span>
                <span className="text-[9px] text-slate-400">{item.date}</span>
              </div>
              <h4 className="text-[11px] font-bold text-slate-800 leading-snug">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

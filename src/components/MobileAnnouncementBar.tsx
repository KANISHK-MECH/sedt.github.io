import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Sparkles, Flame, ChevronRight } from 'lucide-react';

export const MobileAnnouncementBar: React.FC = () => {
  const { batches, news, openEnrollModal } = useApp();

  // Combine batches into a continuous scrollable string / elements
  // Combine news into a continuous scrollable string / elements

  return (
    <div className="xl:hidden w-full flex flex-col gap-1.5 shrink-0">
      {/* 1. BATCH TICKER BAR */}
      <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-amber-200/80 shadow-xs overflow-hidden h-7 sm:h-8">
        {/* Fixed Label Badge */}
        <div className="flex items-center gap-1 bg-linear-to-r from-amber-500 to-[#FFB800] text-[#08245F] font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 sm:px-2.5 h-full shrink-0 shadow-2xs select-none">
          <Calendar className="w-3 h-3 text-[#08245F] shrink-0" />
          <span>Batch :</span>
        </div>

        {/* Marquee / Scrollable ticker text */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center group">
          <div className="mobile-ticker-track flex items-center whitespace-nowrap gap-4 px-2 will-change-transform">
            {batches.map((batch, index) => (
              <button
                key={`${batch.id}-${index}`}
                onClick={() => openEnrollModal(batch.name)}
                className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-semibold text-[#08245F] hover:text-[#d71920] transition-colors cursor-pointer shrink-0"
              >
                <span className="font-bold text-[#08245F]">{batch.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-medium">Starts {batch.startDate.split(',')[1]?.trim() || batch.startDate}</span>
                <span
                  className="text-[8px] font-black px-1.5 py-0.2 rounded text-white shrink-0 uppercase tracking-tight"
                  style={{ backgroundColor: batch.badgeColor || '#08245F' }}
                >
                  {batch.status || 'Open'}
                </span>
                <span className="text-amber-500 font-bold ml-1">|</span>
              </button>
            ))}
            {/* Duplicated for seamless continuous scroll loop */}
            {batches.map((batch, index) => (
              <button
                key={`${batch.id}-dup-${index}`}
                onClick={() => openEnrollModal(batch.name)}
                className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-semibold text-[#08245F] hover:text-[#d71920] transition-colors cursor-pointer shrink-0"
              >
                <span className="font-bold text-[#08245F]">{batch.name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-medium">Starts {batch.startDate.split(',')[1]?.trim() || batch.startDate}</span>
                <span
                  className="text-[8px] font-black px-1.5 py-0.2 rounded text-white shrink-0 uppercase tracking-tight"
                  style={{ backgroundColor: batch.badgeColor || '#08245F' }}
                >
                  {batch.status || 'Open'}
                </span>
                <span className="text-amber-500 font-bold ml-1">|</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick CTA to book */}
        <button
          onClick={() => openEnrollModal()}
          aria-label="Book seat"
          className="bg-amber-50 hover:bg-amber-100 text-[#08245F] px-1.5 sm:px-2 h-full flex items-center justify-center shrink-0 border-l border-amber-200/80 transition-colors"
          title="Book Batch Seat"
        >
          <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
        </button>
      </div>

      {/* 2. NEWS TICKER BAR */}
      <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-sky-200/80 shadow-xs overflow-hidden h-7 sm:h-8">
        {/* Fixed Label Badge */}
        <div className="flex items-center gap-1 bg-linear-to-r from-[#08245F] to-[#0d368b] text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 sm:px-2.5 h-full shrink-0 shadow-2xs select-none">
          <Sparkles className="w-3 h-3 text-[#FFB800] shrink-0" />
          <span>News :</span>
        </div>

        {/* Marquee / Scrollable ticker text */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center group">
          <div className="mobile-ticker-track-slow flex items-center whitespace-nowrap gap-4 px-2 will-change-transform">
            {news.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] text-[#08245F] shrink-0"
              >
                <span className="text-[8.5px] font-black uppercase text-[#d71920] bg-red-50 border border-red-200 px-1 py-0.2 rounded shrink-0">
                  {item.category}
                </span>
                <span className="font-bold text-[#08245F]">{item.title}:</span>
                <span className="text-slate-600 font-medium">{item.summary}</span>
                <span className="text-sky-400 font-bold ml-1">✦</span>
              </div>
            ))}
            {/* Duplicated for seamless loop */}
            {news.map((item, index) => (
              <div
                key={`${item.id}-dup-${index}`}
                className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] text-[#08245F] shrink-0"
              >
                <span className="text-[8.5px] font-black uppercase text-[#d71920] bg-red-50 border border-red-200 px-1 py-0.2 rounded shrink-0">
                  {item.category}
                </span>
                <span className="font-bold text-[#08245F]">{item.title}:</span>
                <span className="text-slate-600 font-medium">{item.summary}</span>
                <span className="text-sky-400 font-bold ml-1">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live indicator dot */}
        <div className="px-1.5 sm:px-2 h-full flex items-center justify-center shrink-0 border-l border-sky-100 bg-sky-50/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

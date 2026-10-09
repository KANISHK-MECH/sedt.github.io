import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

export const GalleryLightbox: React.FC = () => {
  const { lightboxData, closeLightbox } = useApp();

  if (!lightboxData.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="cursor-pointer absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl relative">
          <img
            src={lightboxData.image}
            alt={lightboxData.title}
            className="w-full max-h-[75vh] object-contain mx-auto"
            referrerPolicy="no-referrer"
          />

          {/* Description bar */}
          <div className="bg-slate-900/90 backdrop-blur-xs p-4 text-white border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-[#FFB800]">
                {lightboxData.title}
              </h3>
              {lightboxData.desc && (
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-snug">
                  {lightboxData.desc}
                </p>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              Sri Eshwar RPTO Archive · HD Inspection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

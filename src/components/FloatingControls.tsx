import React, { useState } from 'react';
import { MessageCircle, PhoneCall, UserCheck, Award, ChevronUp } from 'lucide-react';

export const FloatingControls: React.FC = () => {
  const [showCallMenu, setShowCallMenu] = useState(false);

  const accountableManagerPhone = '+919500635060';
  const chiefInstructorPhone = '+919894743267';
  const whatsappNumber = '919500635060';
  const whatsappMessage = encodeURIComponent(
    'Hello Sri Eshwar Drone Tech, I would like to inquire about DGCA Remote Pilot Certification courses and upcoming batch availability.'
  );

  return (
    <div className="fixed bottom-4 left-60 lg:left-64 z-40 flex items-center space-x-2.5">
      {/* Green WhatsApp Button (Accountable Manager) */}
      <a
        id="floating-whatsapp-btn"
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 transition-all border border-emerald-400/40 group"
      >
        <MessageCircle className="w-4 h-4 fill-white text-[#25D366] group-hover:scale-110 transition-transform" />
        <span className="tracking-wide">WhatsApp</span>
      </a>

      {/* Call Helpline with Quick Dropup for both Accountable Manager & Chief Instructor */}
      <div className="relative">
        {showCallMenu && (
          <div className="absolute bottom-12 left-0 w-64 bg-[#071D4A] border border-[#08245F] rounded-2xl shadow-2xl p-2.5 space-y-2 text-white animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 px-2 pt-1 border-b border-white/10 pb-1 flex items-center justify-between">
              <span>Direct RPTO Contacts</span>
              <span className="text-[9px] text-[#FFB800]">DGCA Certified</span>
            </div>

            {/* Accountable Manager */}
            <a
              href={`tel:${accountableManagerPhone}`}
              className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left group"
            >
              <div className="p-1.5 rounded-lg bg-[#FFB800] text-[#08245F] shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider leading-none">
                  Accountable Manager
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  +91 95006 35060
                </div>
              </div>
            </a>

            {/* Chief Instructor */}
            <a
              href={`tel:${chiefInstructorPhone}`}
              className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-left group"
            >
              <div className="p-1.5 rounded-lg bg-[#d71920] text-white shrink-0 group-hover:scale-105 transition-transform">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider leading-none">
                  Chief Instructor
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  +91 98947 43267
                </div>
              </div>
            </a>
          </div>
        )}

        <button
          id="floating-call-btn"
          onClick={() => setShowCallMenu(!showCallMenu)}
          className="cursor-pointer flex items-center space-x-2 px-3.5 py-2 rounded-full bg-[#d71920] hover:bg-[#be151b] text-white text-xs font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 transition-all border border-red-300/40 group"
        >
          <PhoneCall className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Direct Helpline</span>
          <ChevronUp className={`w-3 h-3 transition-transform ${showCallMenu ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

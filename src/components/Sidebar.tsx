import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { SriEshwarEmblem } from './SriEshwarLogo';
import {
  Plane,
  Info,
  BookOpen,
  Layers,
  Sun,
  Flame,
  Building2,
  Phone,
  MessageCircle,
  PhoneCall,
  X
} from 'lucide-react';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Plane },
  { id: 'about', label: 'About', icon: Info },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'training', label: 'Training', icon: Layers },
  { id: 'inspections', label: 'Solar & Wind Inspection', icon: Sun },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Phone }
];

export const Sidebar: React.FC<{ isMobileDrawer?: boolean }> = ({ isMobileDrawer = false }) => {
  const { activeTab, setActiveTab, setIsMobileMenuOpen } = useApp();

  const accountableManagerPhone = '+919500635060';
  const chiefInstructorPhone = '+919894743267';
  const whatsappNumber = '919500635060';
  const whatsappMessage = encodeURIComponent(
    'Hello Sri Eshwar Drone Tech, I would like to inquire about DGCA Remote Pilot Certification courses and upcoming batch availability.'
  );

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    if (isMobileDrawer) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <aside
      className={`w-52 lg:w-56 xl:w-60 2xl:w-64 flex flex-col justify-between shrink-0 h-full py-3.5 sm:py-4 px-2.5 sm:px-3.5 xl:px-4 select-none overflow-y-auto ${
        isMobileDrawer
          ? 'bg-[#071D4A]/98 backdrop-blur-md shadow-2xl border-r border-white/10 w-72'
          : 'bg-transparent'
      }`}
    >
      {/* Navigation Pills */}
      <div>
        {isMobileDrawer && (
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <SriEshwarEmblem className="w-9 h-4" />
              <div>
                <div className="text-xs font-black text-white uppercase tracking-tight leading-none">
                  SRI ESHWAR
                </div>
                <div className="text-[10px] font-extrabold text-[#FFB800] uppercase leading-none mt-0.5">
                  DRONE TECH RPTO
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <nav className="space-y-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'inspections' && (activeTab === 'solar' || activeTab === 'wind'));

            return (
              <button
                key={item.id}
                id={`${isMobileDrawer ? 'mobile-' : ''}sidebar-tab-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`relative w-full cursor-pointer flex items-center space-x-2.5 lg:space-x-3 xl:space-x-3.5 px-3.5 lg:px-4 xl:px-5 py-2.5 lg:py-2.5 xl:py-3 rounded-full text-xs font-bold transition-all duration-200 group shadow-md shadow-[#071D4A]/25 ${
                  isActive
                    ? 'bg-[#087FE5] text-white ring-2 ring-[#38BDF8]/60 shadow-lg shadow-[#087FE5]/35 scale-[1.02]'
                    : isMobileDrawer
                    ? 'bg-[#071D4A] text-white hover:bg-[#0c2b6b] hover:scale-[1.01]'
                    : 'bg-[#071D4A] text-white/95 hover:bg-[#0c2b6b] hover:text-white border border-white/10 hover:scale-[1.01]'
                }`}
              >
                {/* Left Icon */}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#FFB800]' : 'text-sky-200/90 group-hover:text-white'
                  }`}
                />

                {/* Nav Label */}
                <span className="tracking-wide text-white text-[12px] xl:text-[13px] font-bold truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Circular Action Buttons */}
      <div className="pt-6 px-1 flex flex-col space-y-3">
        {/* WhatsApp Round Floating Button */}
        <a
          id={`${isMobileDrawer ? 'mobile-' : ''}sidebar-whatsapp-btn`}
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp (Accountable Manager: +91 95006 35060)"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all border border-white/20"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        </a>

        {/* Phone Call Round Floating Button */}
        <a
          id={`${isMobileDrawer ? 'mobile-' : ''}sidebar-phone-btn`}
          href={`tel:${accountableManagerPhone}`}
          title="Accountable Manager: +91 95006 35060 | Chief Instructor: +91 98947 43267"
          className="w-12 h-12 rounded-full bg-[#d71920] hover:bg-[#be151b] text-white flex items-center justify-center shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all border border-white/20"
        >
          <PhoneCall className="w-5 h-5 text-white" />
        </a>
      </div>
    </aside>
  );
};

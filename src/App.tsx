import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { ToastContainer } from './components/ToastContainer';
import { TabType } from './types';
import {
  Plane,
  BookOpen,
  Layers,
  Sun,
  Flame,
  Building2,
  Images,
  Phone,
  Info,
  Menu,
  X
} from 'lucide-react';

// Tabs
import { HomeTab } from './components/tabs/HomeTab';
import { AboutTab } from './components/tabs/AboutTab';
import { CoursesTab } from './components/tabs/CoursesTab';
import { TrainingTab } from './components/tabs/TrainingTab';
import { SolarWindInspectionTab } from './components/tabs/SolarWindInspectionTab';
import { InfrastructureTab } from './components/tabs/InfrastructureTab';
import { RpcHoldersTab } from './components/tabs/RpcHoldersTab';
import { ContactTab } from './components/tabs/ContactTab';

// Modals
import { EnrollModal } from './components/modals/EnrollModal';
import { CourseDetailsModal } from './components/modals/CourseDetailsModal';
import { BrochureModal } from './components/modals/BrochureModal';
import { SolarBookingModal } from './components/modals/SolarBookingModal';
import { WindBookingModal } from './components/modals/WindBookingModal';
import { CampusTourModal } from './components/modals/CampusTourModal';
import { GalleryLightbox } from './components/modals/GalleryLightbox';
import { AdminWebsite } from './components/admin/AdminWebsite';

const MOBILE_NAV_ITEMS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Plane },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'training', label: 'Training', icon: Layers },
  { id: 'inspections', label: 'Solar & Wind', icon: Sun },
  { id: 'infrastructure', label: 'Gallery', icon: Images },
  { id: 'contact', label: 'Contact', icon: Phone }
];

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'about':
        return <AboutTab />;
      case 'courses':
        return <CoursesTab />;
      case 'training':
        return <TrainingTab />;
      case 'rpc-holders':
        return <RpcHoldersTab />;
      case 'inspections':
        return <SolarWindInspectionTab />;
      case 'solar':
        return <SolarWindInspectionTab initialSection="solar" />;
      case 'wind':
        return <SolarWindInspectionTab initialSection="wind" />;
      case 'infrastructure':
      case 'gallery':
        return <InfrastructureTab />;
      case 'contact':
        return <ContactTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col font-sans relative text-[#08245F] selection:bg-[#FFB800] selection:text-[#08245F]"
      style={{
        background: 'linear-gradient(180deg, #F4FAFF 0%, #EAF5FF 25%, #CFEAFF 65%, #8CCCF5 100%)'
      }}
    >
      {/* Aviation Sky Atmospheric Lighting Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft bottom atmospheric deep sky glow */}
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1600px] h-[500px] opacity-60 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(140, 204, 245, 0.65) 0%, rgba(207, 234, 255, 0.4) 45%, transparent 75%)'
          }}
        />

        {/* Subtle aeronautical grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #08245F 1px, transparent 1px), linear-gradient(to bottom, #08245F 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* 1. TOP HEADER & GLOBAL CONTROLS */}
      <Header />

      {/* 2. THREE-PANE RESPONSIVE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Desktop Sidebar (Visible lg and up) */}
        <div className="hidden lg:flex shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile/Tablet Slide-over Navigation Drawer Backdrop & Panel */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer Content */}
            <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar isMobileDrawer={true} />
            </div>
          </div>
        )}

        {/* Center Main Tab Viewport */}
        <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
          {renderActiveTab()}
        </main>

        {/* Right Sidebar Widgets (News & Upcoming Batches, visible on xl screens) */}
        <RightSidebar />
      </div>

      {/* 3. MOBILE BOTTOM QUICK NAVIGATION BAR (Visible below sm breakpoint) */}
      <div className="sm:hidden h-14 bg-white/95 backdrop-blur-md border-t border-[#CFEAFF] flex items-center justify-around px-1 shrink-0 z-20 shadow-lg">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all min-w-0 ${
                isActive ? 'text-[#087FE5] font-black scale-105' : 'text-[#08245F]/70 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#087FE5]/15 text-[#087FE5]' : 'text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] min-[360px]:text-[9.5px] leading-tight tracking-tight mt-0.5 truncate max-w-full px-0.5 text-center">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. DIALOGS & OVERLAYS */}
      <EnrollModal />
      <CourseDetailsModal />
      <BrochureModal />
      <SolarBookingModal />
      <WindBookingModal />
      <CampusTourModal />
      <GalleryLightbox />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = React.useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      hash === '#admin' ||
      hash.startsWith('#/admin') ||
      search.includes('admin')
    );
  });

  React.useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminRoute(
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash.startsWith('#/admin') ||
        search.includes('admin')
      );
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  return (
    <AppProvider>
      {isAdminRoute ? (
        <div className="h-screen h-[100dvh] min-h-[100dvh] w-full overflow-hidden flex flex-col">
          <AdminWebsite />
          <ToastContainer />
        </div>
      ) : (
        <MainLayout />
      )}
    </AppProvider>
  );
}

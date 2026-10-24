import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Unlock,
  KeyRound,
  Users,
  Award,
  Calendar,
  Sparkles,
  Save,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  LogOut,
  Search,
  Plus,
  Edit2,
  X,
  Activity,
  Phone,
  Mail,
  ChevronRight,
  Database,
  ExternalLink,
  RefreshCw,
  FileText,
  MessageSquare,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowLeft,
  AlertTriangle,
  Send,
  Menu,
  CheckCheck,
  Images,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Course, Batch, Enquiry, GalleryItem, RpcHolder } from '../../types';
import { AdminRpcHoldersSection } from './AdminRpcHoldersSection';

export const AdminWebsite: React.FC = () => {
  const {
    courses,
    updateCourse,
    batches,
    updateBatch,
    addBatch,
    news,
    addNewsItem,
    deleteNewsItem,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    rpcHolders,
    addRpcHolder,
    updateRpcHolder,
    deleteRpcHolder,
    openLightbox,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    resetAllDataToDefaults,
    dbStatus,
    lastDbSync,
    refreshDatabase,
    showToast
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await refreshDatabase(false);
    setTimeout(() => setIsRefreshing(false), 500);
    showToast('Database synchronized with live server', 'success');
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sri_eshwar_admin_auth') === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'courses' | 'batches' | 'rpc-holders' | 'news' | 'gallery'>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Gallery Management States
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [newGalleryForm, setNewGalleryForm] = useState<{
    name: string;
    subtitle: string;
    description: string;
    image: string;
    stats: string;
    category: string;
  }>({
    name: '',
    subtitle: '',
    description: '',
    image: '',
    stats: 'Campus Photo',
    category: 'Training'
  });

  // Enquiry filters, track filter and candidate message modal
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trackFilter, setTrackFilter] = useState<'all' | 'dgca' | 'glider' | 'drone-design' | 'repair' | 'internship' | 'solar-inspection' | 'wind-inspection'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit states
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseSearch, setCourseSearch] = useState('');
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState<Omit<Batch, 'id'>>({
    name: '',
    type: 'weekday',
    startDate: '',
    endDate: '',
    timing: '09:00 AM - 05:00 PM',
    duration: '5 Days',
    seatsTotal: 10,
    seatsLeft: 10,
    status: 'Open',
    badgeColor: 'bg-emerald-600'
  });

  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', category: 'DGCA Notice', summary: '' });
  const [showAddNews, setShowAddNews] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Helper to exit the admin portal back to the main public site
  const handleExitAdmin = () => {
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    } else if (window.location.pathname.includes('admin')) {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = '/';
    }
  };

  // Helper to format WhatsApp phone number and URL reliably
  const getWhatsAppUrl = (phone: string, fullName: string, courseName: string) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    const formattedPhone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `Hello ${fullName}, greetings from Sri Eshwar Drone Tech Pvt Ltd (DGCA RPTO). We received your application for ${courseName}.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Helper to parse key-value pairs from applicant notes
  const parseApplicantDetails = (message?: string) => {
    if (!message) return null;
    const details: { label: string; value: string }[] = [];

    if (message.includes('|')) {
      const parts = message.split('|');
      parts.forEach((part) => {
        const colonIdx = part.indexOf(':');
        if (colonIdx !== -1) {
          const key = part.slice(0, colonIdx).trim();
          const val = part.slice(colonIdx + 1).trim();
          if (key && val) {
            details.push({ label: key, value: val });
          }
        }
      });
    } else if (message.includes('\n') && message.includes(':')) {
      const lines = message.split('\n');
      lines.forEach((line) => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim();
          const val = line.slice(colonIdx + 1).trim();
          if (key && val && !key.startsWith('[')) {
            details.push({ label: key, value: val });
          }
        }
      });
    }

    return details.length > 0 ? details : null;
  };

  // Helper to categorize registrations and generate rich track badges
  const getEnquiryTrackBadge = (enq: Enquiry) => {
    const cId = (enq.courseId || '').toLowerCase();
    const cName = (enq.courseName || '').toLowerCase();
    const msg = (enq.message || '').toLowerCase();

    if (cId.includes('solar') || cName.includes('solar') || msg.includes('solar') || msg.includes('photovoltaic') || msg.includes('thermography')) {
      return {
        type: 'solar-inspection' as const,
        label: '☀️ Solar PV Drone Inspection',
        shortLabel: 'Solar PV',
        icon: '☀️',
        bg: 'bg-amber-100 text-amber-950 border-amber-300 font-black'
      };
    }
    if (cId.includes('wind') || cName.includes('wind') || msg.includes('wind') || msg.includes('turbine') || msg.includes('blade')) {
      return {
        type: 'wind-inspection' as const,
        label: '💨 Wind Turbine Drone Inspection',
        shortLabel: 'Wind Turbine',
        icon: '💨',
        bg: 'bg-sky-100 text-sky-950 border-sky-300 font-black'
      };
    }
    if (cId.includes('glider') || cName.includes('glider') || msg.includes('glider')) {
      return {
        type: 'glider' as const,
        label: 'Track 1 · Glider Design',
        shortLabel: 'Glider',
        icon: '🛩️',
        bg: 'bg-blue-50 text-blue-900 border-blue-200'
      };
    }
    if (cId.includes('drone-design') || cName.includes('drone design') || msg.includes('drone design')) {
      return {
        type: 'drone-design' as const,
        label: 'Track 2 · Drone Design & Dev',
        shortLabel: 'Drone Dev',
        icon: '🚁',
        bg: 'bg-red-50 text-red-900 border-red-200'
      };
    }
    if (cId.includes('repair') || cName.includes('repair') || cName.includes('maintenance') || msg.includes('repair')) {
      return {
        type: 'repair' as const,
        label: 'Track 3 · Drone Repair & Maint',
        shortLabel: 'Repair',
        icon: '🔧',
        bg: 'bg-amber-50 text-amber-900 border-amber-200'
      };
    }
    if (cId.includes('intern') || cName.includes('intern') || msg.includes('intern')) {
      return {
        type: 'internship' as const,
        label: 'Track 4 · Internship (2 Weeks)',
        shortLabel: 'Internship',
        icon: '🎓',
        bg: 'bg-purple-50 text-purple-900 border-purple-200'
      };
    }
    return {
      type: 'dgca' as const,
      label: 'DGCA Commercial Pilot RPC',
      shortLabel: 'DGCA RPC',
      icon: '🪪',
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-200'
    };
  };

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sri_eshwar_admin_auth', 'true');
      setErrorMsg('');
      showToast('Admin Portal Authenticated Successfully', 'success');
    } else {
      setErrorMsg('Incorrect administrative passcode. Enter "admin123"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sri_eshwar_admin_auth');
    setPasscode('');
    setIsMobileNavOpen(false);
    showToast('Logged out of Admin Portal', 'info');
  };

  // CSV Export for Candidate Enquiries
  const exportEnquiriesCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Phone', 'Email', 'Course', 'Batch', 'Status', 'Date', 'Notes', 'Message'];
    const rows = enquiries.map((e) => [
      e.id,
      `"${(e.fullName || '').replace(/"/g, '""')}"`,
      `"${e.phone || ''}"`,
      `"${e.email || ''}"`,
      `"${(e.courseName || '').replace(/"/g, '""')}"`,
      `"${(e.preferredBatch || '').replace(/"/g, '""')}"`,
      e.status,
      `"${e.createdAt}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Eshwar_RPTO_Admissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Admissions exported to CSV', 'success');
  };

  // JSON Database Export
  const exportFullDatabaseJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      rpto: 'Sri Eshwar Drone Tech Pvt Ltd (DGCA/RPTO-TN 21/2024)',
      enquiries,
      courses,
      batches,
      news
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `RPTO_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Complete database exported as JSON', 'success');
  };

  // Filtered Enquiries supporting status, track, and search query
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const badge = getEnquiryTrackBadge(e);
    const matchesTrack = trackFilter === 'all' || badge.type === trackFilter;
    const matchesSearch =
      (e.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.phone || '').includes(searchQuery) ||
      (e.courseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.message && e.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesTrack && matchesSearch;
  });

  // Calculate quick metrics
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;
  const enrolledCount = enquiries.filter((e) => e.status === 'Enrolled').length;
  const archivedCount = enquiries.filter((e) => e.status === 'Archived').length;
  const totalSlots = batches.reduce((acc, b) => acc + b.seatsTotal, 0);
  const seatsAvailable = batches.reduce((acc, b) => acc + b.seatsLeft, 0);

  // Track-specific counts
  const dgcaCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'dgca').length;
  const gliderCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'glider').length;
  const droneDesignCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'drone-design').length;
  const repairCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'repair').length;
  const internshipCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'internship').length;
  const solarInspectionCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'solar-inspection').length;
  const windInspectionCount = enquiries.filter((e) => getEnquiryTrackBadge(e).type === 'wind-inspection').length;

  // Filtered courses
  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.weightClass.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Navigation tab configuration
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Activity, badge: null },
    { id: 'enquiries', label: 'Admissions', icon: Users, badge: newCount > 0 ? newCount : null },
    { id: 'courses', label: 'Courses', icon: Award, badge: courses.length },
    { id: 'batches', label: 'Batches', icon: Calendar, badge: batches.length },
    { id: 'rpc-holders', label: 'RPC Holders', icon: ShieldCheck, badge: rpcHolders.length },
    { id: 'news', label: 'News & Notices', icon: Sparkles, badge: news.length },
    { id: 'gallery', label: 'Gallery', icon: Images, badge: gallery.length }
  ] as const;

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATION LOCK SCREEN (RESPONSIVE FOR ALL DEVICES)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#071D4A] flex flex-col justify-between text-slate-100 font-sans p-4 sm:p-6 select-text overflow-y-auto">
        {/* Header */}
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFB800] text-[#08245F] flex items-center justify-center font-black text-xs sm:text-sm shadow-md shrink-0">
              RPTO
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-black uppercase tracking-wider text-white truncate">
                Sri Eshwar Drone Tech Pvt Ltd
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                DGCA Authorized RPTO · TN 21/2024
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExitAdmin}
            className="cursor-pointer text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0 min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back to Public Site</span>
          </button>
        </header>

        {/* Login Box */}
        <main className="max-w-md w-full mx-auto my-6 sm:my-auto bg-[#08245F] border border-slate-700/80 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800]">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              RPTO Management Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter administrative passcode to manage student admissions, flight batches, and courses.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Administrative Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter passcode (admin123)"
                  className="w-full bg-[#071D4A] border border-slate-600 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all min-h-[44px]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-2 min-h-[40px] flex items-center justify-center"
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 font-semibold mt-2 flex items-center gap-1.5 bg-red-950/40 p-2.5 rounded-lg border border-red-800/60">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-3 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] active:scale-[0.98] text-[#08245F] font-black text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Unlock className="w-4 h-4" />
              <span>Access RPTO Console</span>
            </button>

            {/* Quick Demo Key autofill button */}
            <button
              type="button"
              onClick={() => {
                setPasscode('admin123');
                setErrorMsg('');
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-[#FFB800] py-2 cursor-pointer transition-colors min-h-[38px] flex items-center justify-center gap-1"
            >
              <span>Click to autofill demo key:</span>
              <span className="font-mono font-bold text-[#FFB800] bg-black/30 px-1.5 py-0.5 rounded">admin123</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={handleExitAdmin}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl w-full mx-auto text-center py-2 text-[11px] text-slate-400">
          Sri Eshwar Drone Tech Pvt Ltd · DGCA/RPTO-TN 21/2024 · Kinathukadavu Airfield, Coimbatore
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED STANDALONE ADMIN WEBSITE DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col font-sans text-slate-800 overflow-hidden select-text relative">
      {/* 1. TOP HEADER BAR (RESPONSIVE ACROSS ALL DEVICES) */}
      <header className="bg-[#08245F] text-white px-3 sm:px-6 py-2.5 shrink-0 flex items-center justify-between shadow-md z-30 border-b border-slate-700 min-h-[56px]">
        {/* Left: Mobile Menu Trigger + Brand Info */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden text-white p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
            title="Toggle Admin Menu"
            aria-label="Toggle Admin Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 rounded-lg bg-[#FFB800] text-[#08245F] font-black flex items-center justify-center text-xs shadow-xs shrink-0">
            RPTO
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-xs sm:text-base font-black uppercase tracking-wider text-white truncate">
                Sri Eshwar RPTO
              </h1>
              <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 hidden sm:block truncate">
              DGCA/RPTO-TN 21/2024 · Kinathukadavu
            </p>
          </div>
        </div>

        {/* Right: Actions, Sync & Logout */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Live Database Sync Indicator (lg+) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : dbStatus === 'syncing'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-red-400'
              }`}
            />
            <span className="text-[11px] font-bold text-slate-200">
              {dbStatus === 'connected'
                ? `DB Synced ${lastDbSync ? `(${lastDbSync})` : ''}`
                : dbStatus === 'syncing'
                ? 'Syncing DB...'
                : 'Offline Cache'}
            </span>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5 min-h-[38px]"
            title="Force immediate synchronization with server database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync DB</span>
          </button>

          {/* Backup Button (hidden on mobile, in drawer instead) */}
          <button
            type="button"
            onClick={exportFullDatabaseJSON}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5 hidden md:flex min-h-[38px]"
            title="Download full database JSON backup"
          >
            <Database className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
            <span className="hidden lg:inline">Backup DB</span>
          </button>

          {/* Return to Website Button */}
          <button
            type="button"
            onClick={handleExitAdmin}
            className="cursor-pointer text-xs font-bold text-sky-200 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[38px]"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Website</span>
          </button>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-red-950/70 hover:bg-red-900 border border-red-800/80 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[38px]"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300 shrink-0" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. MOBILE DRAWER OVERLAY (SLIDE-OUT MENU FOR PHONES/TABLETS) */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-50 p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFB800] text-[#08245F] font-black flex items-center justify-center text-xs">
                    RPTO
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase text-[#08245F]">Admin Console</h3>
                    <p className="text-[10px] text-slate-500">DGCA/RPTO-TN 21/2024</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  Management Sections
                </p>
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-[#08245F] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : 'text-slate-500'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge !== null && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            tab.id === 'enquiries' && newCount > 0
                              ? 'bg-red-600 text-white'
                              : isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Quick Utilities */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  Database Utilities
                </p>

                <button
                  type="button"
                  onClick={() => {
                    handleManualSync();
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 min-h-[40px] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sync Server Database</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportFullDatabaseJSON();
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 min-h-[40px] cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Download DB Backup (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportEnquiriesCSV();
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 min-h-[40px] cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Admissions CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    handleExitAdmin();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-800 hover:bg-blue-50 flex items-center gap-2 min-h-[40px] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Public Website</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setShowResetConfirmModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset System Data</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN BODY (SIDEBAR FOR TABLET/DESKTOP + SCROLLABLE MAIN CONTENT) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 w-full relative">
        {/* Desktop & Tablet Sidebar */}
        <aside className="w-56 lg:w-64 bg-white border-r border-slate-200 shrink-0 flex-col justify-between hidden md:flex min-h-0 overflow-y-auto">
          <div className="p-3 space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#08245F] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        tab.id === 'enquiries' && newCount > 0
                          ? 'bg-[#d71920] text-white'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Operations */}
          <div className="p-3 border-t border-slate-200 space-y-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#08245F]">
                <span>Storage Target:</span>
                <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">rpto-db.json</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Full two-way persistence active for all registrations and course fee updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="w-full cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset System Data</span>
            </button>
          </div>
        </aside>


        {/* Content Area - fully responsive with mobile bottom bar offset */}
        <main
          id="admin-main-scrollable"
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 md:p-6 lg:p-8 pb-20 md:pb-8 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Admissions & Operations Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Real-time synchronization for candidate applications and airfield flight batches.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isRefreshing}
                    className="cursor-pointer text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs min-h-[38px]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards (Responsive: 2-col on mobile, 5-col on desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
                <div
                  onClick={() => {
                    setActiveTab('enquiries');
                    setStatusFilter('All');
                    setTrackFilter('all');
                  }}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-400 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold">
                    <span>Total Applications</span>
                    <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#08245F]">{enquiries.length}</div>
                  <p className="text-[10px] sm:text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {newCount} pending review
                  </p>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('enquiries');
                    setStatusFilter('Enrolled');
                  }}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-400 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold">
                    <span>Enrolled Candidates</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">{enrolledCount}</div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                    {enquiries.length > 0 ? `${Math.round((enrolledCount / enquiries.length) * 100)}% conversion rate` : '0%'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('batches')}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-amber-400 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold">
                    <span>Flight Batches</span>
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#08245F]">{batches.length}</div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{seatsAvailable} of {totalSlots} seats open</p>
                </div>

                <div
                  onClick={() => setActiveTab('courses')}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-red-400 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold">
                    <span>Course Catalog</span>
                    <Award className="w-4 h-4 text-[#d71920] shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#08245F]">{courses.length}</div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">DGCA RPC & Tech Tracks</p>
                </div>

                <div
                  onClick={() => setActiveTab('gallery')}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-400 active:scale-[0.98] transition-all col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-bold">
                    <span>Photo Gallery</span>
                    <Images className="w-4 h-4 text-purple-600 shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#08245F]">{gallery.length}</div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Campus & Flight Photos</p>
                </div>
              </div>

              {/* Technical Tracks Breakdown Mini Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                      Applications by Specialization Track
                    </h3>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      Click any track to filter the candidate management table directly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('all');
                    }}
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer p-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 pt-1">
                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('dgca');
                    }}
                    className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="text-base">🪪</div>
                    <div className="text-lg font-black text-indigo-950 mt-1">{dgcaCount}</div>
                    <div className="text-[10px] font-bold text-indigo-700 uppercase leading-tight">DGCA Pilots</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('glider');
                    }}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="text-base">🛩️</div>
                    <div className="text-lg font-black text-blue-950 mt-1">{gliderCount}</div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase leading-tight">Glider Design</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('drone-design');
                    }}
                    className="p-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="text-base">🚁</div>
                    <div className="text-lg font-black text-red-950 mt-1">{droneDesignCount}</div>
                    <div className="text-[10px] font-bold text-red-700 uppercase leading-tight">Drone Dev</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('repair');
                    }}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="text-base">🔧</div>
                    <div className="text-lg font-black text-amber-950 mt-1">{repairCount}</div>
                    <div className="text-[10px] font-bold text-amber-700 uppercase leading-tight">Repair & Maint</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('solar-inspection');
                    }}
                    className="p-3 rounded-xl border border-amber-300 bg-amber-100/60 hover:bg-amber-100 cursor-pointer transition-all active:scale-[0.98] col-span-1"
                  >
                    <div className="text-base">☀️</div>
                    <div className="text-lg font-black text-amber-950 mt-1">{solarInspectionCount}</div>
                    <div className="text-[10px] font-bold text-amber-900 uppercase leading-tight">Solar Inspection</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('wind-inspection');
                    }}
                    className="p-3 rounded-xl border border-sky-300 bg-sky-100/60 hover:bg-sky-100 cursor-pointer transition-all active:scale-[0.98] col-span-1"
                  >
                    <div className="text-base">💨</div>
                    <div className="text-lg font-black text-sky-950 mt-1">{windInspectionCount}</div>
                    <div className="text-[10px] font-bold text-sky-900 uppercase leading-tight">Wind Inspection</div>
                  </div>
                </div>
              </div>

              {/* Quick Section: Recent Candidate Inquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#08245F] uppercase tracking-wide">
                      Recent Candidate Applications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showing latest registrations awaiting contact or flight slot assignment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className="cursor-pointer text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 p-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Card View (< md) */}
                <div className="md:hidden space-y-3">
                  {enquiries.slice(0, 5).map((enq) => {
                    const badge = getEnquiryTrackBadge(enq);
                    return (
                      <div
                        key={enq.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-sm text-[#08245F]">{enq.fullName}</h4>
                            <p className="text-[11px] text-slate-500">{enq.courseName}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                              enq.status === 'New'
                                ? 'bg-blue-100 text-blue-800'
                                : enq.status === 'Contacted'
                                ? 'bg-amber-100 text-amber-800'
                                : enq.status === 'Enrolled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${badge.bg}`}>
                            <span>{badge.icon}</span>
                            <span>{badge.shortLabel}</span>
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">📞 {enq.phone}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{enq.createdAt}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${enq.phone}`}
                              className="p-2 text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 min-h-[36px] min-w-[36px] flex items-center justify-center"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={getWhatsAppUrl(enq.phone, enq.fullName, enq.courseName)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 min-h-[36px] min-w-[36px] flex items-center justify-center"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setAdminNoteInput(enq.notes || '');
                            }}
                            className="cursor-pointer text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center gap-1"
                          >
                            <span>Review Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop/Tablet Table View (>= md) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                        <th className="py-2.5 px-3">Candidate</th>
                        <th className="py-2.5 px-3">Track / Category</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.slice(0, 6).map((enq) => {
                        const badge = getEnquiryTrackBadge(enq);
                        return (
                          <tr key={enq.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-[#08245F]">{enq.fullName}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${badge.bg}`}>
                                <span>{badge.icon}</span>
                                <span>{badge.label}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">{enq.phone}</td>
                            <td className="py-2.5 px-3 text-slate-500">{enq.createdAt}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                  enq.status === 'New'
                                    ? 'bg-blue-100 text-blue-800'
                                    : enq.status === 'Contacted'
                                    ? 'bg-amber-100 text-amber-800'
                                    : enq.status === 'Enrolled'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnquiry(enq);
                                  setAdminNoteInput(enq.notes || '');
                                }}
                                className="cursor-pointer text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md transition-colors"
                              >
                                Review Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ENQUIRIES & ADMISSIONS DESK */}
          {/* ========================================================= */}
          {activeTab === 'enquiries' && (
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Candidate Applications & Admissions Desk
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage enquiries, candidate contact status, and enrolled student records with live database synchronization.
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={exportEnquiriesCSV}
                    className="cursor-pointer text-xs font-bold text-[#08245F] bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors min-h-[38px]"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Top Track & Volume Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                <div
                  onClick={() => {
                    setTrackFilter('all');
                    setStatusFilter('All');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                    trackFilter === 'all'
                      ? 'bg-white border-[#08245F] shadow-xs ring-1 ring-[#08245F]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Bookings</p>
                  <p className="text-xl font-black text-[#08245F] mt-0.5">{enquiries.length}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{newCount} pending</p>
                </div>

                <div
                  onClick={() => setTrackFilter('solar-inspection')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                    trackFilter === 'solar-inspection'
                      ? 'bg-amber-50 border-amber-600 shadow-xs ring-1 ring-amber-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                    <span>☀️</span> Solar PV
                  </p>
                  <p className="text-xl font-black text-amber-950 mt-0.5">{solarInspectionCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Thermography</p>
                </div>

                <div
                  onClick={() => setTrackFilter('wind-inspection')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                    trackFilter === 'wind-inspection'
                      ? 'bg-sky-50 border-sky-600 shadow-xs ring-1 ring-sky-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-sky-700 uppercase flex items-center gap-1">
                    <span>💨</span> Wind Turbine
                  </p>
                  <p className="text-xl font-black text-sky-950 mt-0.5">{windInspectionCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Blade & Nacelle</p>
                </div>

                <div
                  onClick={() => setTrackFilter('dgca')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                    trackFilter === 'dgca'
                      ? 'bg-indigo-50/50 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                    <span>🪪</span> DGCA RPC
                  </p>
                  <p className="text-xl font-black text-indigo-950 mt-0.5">{dgcaCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Small/Med Pilot</p>
                </div>

                <div
                  onClick={() => setTrackFilter('drone-design')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                    trackFilter === 'drone-design' || trackFilter === 'glider' || trackFilter === 'repair'
                      ? 'bg-red-50/50 border-red-600 shadow-xs ring-1 ring-red-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1">
                    <span>🛠️</span> Tech Tracks
                  </p>
                  <p className="text-xl font-black text-[#08245F] mt-0.5">
                    {gliderCount + droneDesignCount + repairCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Tracks 1-3</p>
                </div>

                <div
                  onClick={() => setTrackFilter('internship')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] col-span-2 sm:col-span-1 ${
                    trackFilter === 'internship'
                      ? 'bg-purple-50/50 border-purple-600 shadow-xs ring-1 ring-purple-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                    <span>🎓</span> Internship
                  </p>
                  <p className="text-xl font-black text-purple-950 mt-0.5">{internshipCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">2-Wk Cohorts</p>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  {/* Search box */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, course..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#08245F] focus:bg-white transition-all min-h-[40px]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status chips */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Status:</span>
                    {[
                      { id: 'All', label: 'All', count: enquiries.length },
                      { id: 'New', label: 'New', count: newCount },
                      { id: 'Contacted', label: 'Contacted', count: contactedCount },
                      { id: 'Enrolled', label: 'Enrolled', count: enrolledCount },
                      { id: 'Archived', label: 'Archived', count: archivedCount }
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setStatusFilter(st.id)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1 min-h-[34px] ${
                          statusFilter === st.id
                            ? 'bg-[#08245F] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{st.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          statusFilter === st.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Sub-Filters */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Track:</span>
                  {[
                    { id: 'all', label: `All (${enquiries.length})` },
                    { id: 'solar-inspection', label: `☀️ Solar (${solarInspectionCount})` },
                    { id: 'wind-inspection', label: `💨 Wind (${windInspectionCount})` },
                    { id: 'dgca', label: `🪪 DGCA (${dgcaCount})` },
                    { id: 'glider', label: `🛩️ Glider (${gliderCount})` },
                    { id: 'drone-design', label: `🚁 Design (${droneDesignCount})` },
                    { id: 'repair', label: `🔧 Repair (${repairCount})` },
                    { id: 'internship', label: `🎓 Internship (${internshipCount})` }
                  ].map((track) => (
                    <button
                      type="button"
                      key={track.id}
                      onClick={() => setTrackFilter(track.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer min-h-[32px] ${
                        trackFilter === track.id
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {track.label}
                    </button>
                  ))}

                  {(searchQuery || statusFilter !== 'All' || trackFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('All');
                        setTrackFilter('all');
                      }}
                      className="ml-auto text-xs text-red-600 hover:underline font-bold shrink-0 cursor-pointer px-2"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Showing <span className="font-bold text-[#08245F]">{filteredEnquiries.length}</span> of {enquiries.length} candidate applications
                </div>
              </div>

              {/* CANDIDATE APPLICATIONS LIST: DUAL RESPONSIVE DISPLAY */}
              {/* 1. Mobile Cards View (< md) */}
              <div className="md:hidden space-y-3">
                {filteredEnquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs font-semibold">
                    No applications found matching your filters.
                  </div>
                ) : (
                  filteredEnquiries.map((enq) => {
                    const badge = getEnquiryTrackBadge(enq);
                    return (
                      <div
                        key={enq.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 hover:border-slate-300 transition-colors"
                      >
                        {/* Header: Name, Track & Status Selector */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-black text-[#08245F] text-base">{enq.fullName}</h3>
                            <div className="mt-1">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${badge.bg}`}>
                                <span>{badge.icon}</span>
                                <span>{badge.label}</span>
                              </span>
                            </div>
                          </div>

                          <select
                            value={enq.status}
                            onChange={(e) => {
                              updateEnquiryStatus(enq.id, e.target.value as Enquiry['status']);
                            }}
                            className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none min-h-[34px] ${
                              enq.status === 'New'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : enq.status === 'Contacted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : enq.status === 'Enrolled'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>

                        {/* Course & Date Info */}
                        <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-100">
                          <div className="font-bold text-slate-800">{enq.courseName}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>{enq.preferredBatch || 'Regular Batch'}</span>
                            <span>{enq.createdAt}</span>
                          </div>
                        </div>

                        {/* Message Preview */}
                        {enq.message && (
                          <p className="text-xs text-slate-600 italic line-clamp-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                            "{enq.message}"
                          </p>
                        )}

                        {/* Action Bar (One-Tap Call, WhatsApp, Email, Details, Delete) */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${enq.phone}`}
                              className="p-2.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                              title="Call"
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            <a
                              href={getWhatsAppUrl(enq.phone, enq.fullName, enq.courseName)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            <a
                              href={`mailto:${enq.email}`}
                              className="p-2.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEnquiry(enq);
                                setAdminNoteInput(enq.notes || '');
                              }}
                              className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#16357d] px-3 py-2 rounded-xl transition-colors min-h-[40px] flex items-center gap-1 shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#FFB800]" />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Permanently remove application record from ${enq.fullName}?`)) {
                                  deleteEnquiry(enq.id);
                                }
                              }}
                              className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 2. Desktop/Tablet Table View (>= md) */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                        <th className="py-3 px-4">Candidate & Track</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Course & Duration</th>
                        <th className="py-3 px-4">Message Preview</th>
                        <th className="py-3 px-4">Date & Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                            No applications or messages found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enq) => {
                          const badge = getEnquiryTrackBadge(enq);

                          return (
                            <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Candidate & Track */}
                              <td className="py-3 px-4">
                                <div className="font-black text-[#08245F] text-sm">
                                  {enq.fullName}
                                </div>
                                <div className="mt-1">
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${badge.bg}`}>
                                    <span>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                  </span>
                                </div>
                              </td>

                              {/* Contact Info */}
                              <td className="py-3 px-4">
                                <a
                                  href={`tel:${enq.phone}`}
                                  className="text-slate-800 hover:text-blue-700 font-bold text-xs flex items-center gap-1"
                                  title="Click to call"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{enq.phone}</span>
                                </a>
                                <a
                                  href={`mailto:${enq.email}`}
                                  className="text-slate-500 hover:text-blue-700 text-[11px] flex items-center gap-1 mt-0.5"
                                  title="Click to email"
                                >
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span className="truncate max-w-[150px]">{enq.email}</span>
                                </a>
                              </td>

                              {/* Course Name & Batch */}
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-800 leading-snug">{enq.courseName}</div>
                                {enq.preferredBatch && (
                                  <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                                    {enq.preferredBatch}
                                  </div>
                                )}
                              </td>

                              {/* Message Preview */}
                              <td className="py-3 px-4 max-w-xs">
                                {enq.message ? (
                                  <div
                                    onClick={() => {
                                      setSelectedEnquiry(enq);
                                      setAdminNoteInput(enq.notes || '');
                                    }}
                                    className="cursor-pointer group"
                                  >
                                    <p className="text-[11px] text-slate-600 line-clamp-2 italic group-hover:text-blue-700">
                                      "{enq.message}"
                                    </p>
                                    <span className="text-[10px] font-bold text-blue-600 group-hover:underline flex items-center gap-0.5 mt-0.5">
                                      <span>Read details</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">No message notes</span>
                                )}
                              </td>

                              {/* Date & Status */}
                              <td className="py-3 px-4 space-y-1">
                                <div className="text-slate-500 text-[11px]">{enq.createdAt}</div>
                                <select
                                  value={enq.status}
                                  onChange={(e) => {
                                    updateEnquiryStatus(enq.id, e.target.value as Enquiry['status']);
                                  }}
                                  className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border cursor-pointer focus:outline-none ${
                                    enq.status === 'New'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : enq.status === 'Contacted'
                                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                                      : enq.status === 'Enrolled'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-slate-50 text-slate-800 border-slate-200'
                                  }`}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Enrolled">Enrolled</option>
                                  <option value="Archived">Archived</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedEnquiry(enq);
                                      setAdminNoteInput(enq.notes || '');
                                    }}
                                    className="cursor-pointer p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                                    title="View Full Registration Details & Notes"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={`tel:${enq.phone}`}
                                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
                                    title="Call Candidate"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>

                                  <a
                                    href={getWhatsAppUrl(enq.phone, enq.fullName, enq.courseName)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                                    title="WhatsApp Candidate"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Permanently remove application record from ${enq.fullName}?`)) {
                                        deleteEnquiry(enq.id);
                                      }
                                    }}
                                    className="cursor-pointer p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                    title="Delete Application"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: COURSES & FEE MATRIX */}
          {/* ========================================================= */}
          {activeTab === 'courses' && (
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase">
                    DGCA Course Catalog & Fee Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update course titles, fees, training durations, weight classes, and seat allocations. Changes persist to live server DB.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#08245F] min-h-[40px]"
                  />
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredCourses.map((course) => {
                  const isEditing = editingCourse?.id === course.id;

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          {isEditing ? (
                            <div className="w-full space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Course Name</label>
                              <input
                                type="text"
                                value={editingCourse.name}
                                onChange={(e) =>
                                  setEditingCourse({ ...editingCourse, name: e.target.value })
                                }
                                className="font-black text-sm text-[#08245F] border border-slate-300 rounded-lg p-2 w-full"
                              />
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-black text-base text-[#08245F]">{course.name}</h3>
                              <p className="text-xs text-slate-500 font-semibold">{course.weightClass}</p>
                            </div>
                          )}
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#08245F] border border-blue-200 shrink-0">
                            {course.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold">COURSE FEE (₹)</span>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingCourse.price}
                                onChange={(e) =>
                                  setEditingCourse({ ...editingCourse, price: parseInt(e.target.value) || 0 })
                                }
                                className="font-black text-sm text-[#08245F] border border-slate-300 rounded-lg p-1.5 w-full mt-0.5"
                              />
                            ) : (
                              <span className="font-black text-base text-[#08245F]">
                                {typeof course.price === 'number' ? `₹${course.price.toLocaleString('en-IN')}` : '₹0'}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] font-bold">DURATION</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingCourse.duration}
                                onChange={(e) =>
                                  setEditingCourse({ ...editingCourse, duration: e.target.value })
                                }
                                className="font-bold text-xs text-slate-800 border border-slate-300 rounded-lg p-1.5 w-full mt-0.5"
                              />
                            ) : (
                              <span className="font-bold text-xs text-slate-700">{course.duration}</span>
                            )}
                          </div>
                        </div>

                        {/* Weight Class & Seats row when editing */}
                        {isEditing && (
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                            <div>
                              <span className="text-slate-500 block text-[10px] font-bold">WEIGHT CLASS</span>
                              <input
                                type="text"
                                value={editingCourse.weightClass}
                                onChange={(e) =>
                                  setEditingCourse({ ...editingCourse, weightClass: e.target.value })
                                }
                                className="font-bold text-xs text-slate-800 border border-slate-300 rounded-lg p-1.5 w-full mt-0.5"
                              />
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-bold">SEATS LEFT / TOTAL</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <input
                                  type="number"
                                  value={editingCourse.seatsLeft}
                                  onChange={(e) =>
                                    setEditingCourse({ ...editingCourse, seatsLeft: parseInt(e.target.value) || 0 })
                                  }
                                  className="w-16 text-xs font-bold border border-slate-300 rounded p-1.5"
                                />
                                <span>/</span>
                                <input
                                  type="number"
                                  value={editingCourse.totalSeats}
                                  onChange={(e) =>
                                    setEditingCourse({ ...editingCourse, totalSeats: parseInt(e.target.value) || 0 })
                                  }
                                  className="w-16 text-xs font-bold border border-slate-300 rounded p-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold mb-1">SYLLABUS & OVERVIEW</span>
                          {isEditing ? (
                            <textarea
                              value={editingCourse.description}
                              onChange={(e) =>
                                setEditingCourse({ ...editingCourse, description: e.target.value })
                              }
                              rows={3}
                              className="w-full text-xs text-slate-700 border border-slate-300 rounded-lg p-2"
                            />
                          ) : (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          )}
                        </div>

                        {!isEditing && course.highlights && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {course.highlights.slice(0, 3).map((hl, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                ✓ {hl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingCourse(null)}
                              className="cursor-pointer text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors min-h-[38px]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateCourse(editingCourse);
                                setEditingCourse(null);
                                showToast('Course details updated', 'success');
                              }}
                              className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors min-h-[38px]"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Changes
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingCourse({ ...course })}
                            className="cursor-pointer text-xs font-bold text-[#08245F] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors min-h-[38px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Details & Fee
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: FLIGHT BATCHES */}
          {/* ========================================================= */}
          {activeTab === 'batches' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Airfield Flight Batches & Capacity
                  </h2>
                  <p className="text-xs text-slate-500">
                    Schedule upcoming cohorts, set seat quotas, and manage pilot availability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(true)}
                  className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#16357d] px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto min-h-[40px]"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>Schedule New Batch</span>
                </button>
              </div>

              {/* Add New Batch Modal */}
              {showAddBatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90dvh] overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                      <div>
                        <h3 className="text-sm font-black text-[#08245F] uppercase">Schedule New Flight Batch</h3>
                        <p className="text-xs text-slate-500">Create a new training cohort linked to central database.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddBatchModal(false)}
                        className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newBatchForm.name.trim() || !newBatchForm.startDate.trim()) {
                          showToast('Please provide Batch Name and Start Date', 'error');
                          return;
                        }
                        addBatch({
                          ...newBatchForm,
                          seatsLeft: Number(newBatchForm.seatsLeft),
                          seatsTotal: Number(newBatchForm.seatsTotal)
                        });
                        setShowAddBatchModal(false);
                        setNewBatchForm({
                          name: '',
                          type: 'weekday',
                          startDate: '',
                          endDate: '',
                          timing: '09:00 AM - 05:00 PM',
                          duration: '5 Days',
                          seatsTotal: 10,
                          seatsLeft: 10,
                          status: 'Open',
                          badgeColor: 'bg-emerald-600'
                        });
                        showToast('New flight batch scheduled', 'success');
                      }}
                      className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs flex-1"
                    >
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Batch Title *</label>
                        <input
                          type="text"
                          required
                          value={newBatchForm.name}
                          onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                          placeholder="e.g. Small RPC Weekday Cohort #15"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs min-h-[40px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Schedule Type</label>
                          <select
                            value={newBatchForm.type}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, type: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold min-h-[40px]"
                          >
                            <option value="weekday">Weekday (Mon - Fri)</option>
                            <option value="weekend">Weekend (Sat - Sun)</option>
                            <option value="custom">Custom Schedule</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Duration</label>
                          <input
                            type="text"
                            value={newBatchForm.duration}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, duration: e.target.value })}
                            placeholder="e.g. 5 Days / 40 Hrs"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs min-h-[40px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Start Date *</label>
                          <input
                            type="text"
                            required
                            value={newBatchForm.startDate}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, startDate: e.target.value })}
                            placeholder="e.g. 14 Apr 2026"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs min-h-[40px]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">End Date</label>
                          <input
                            type="text"
                            value={newBatchForm.endDate}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, endDate: e.target.value })}
                            placeholder="e.g. 18 Apr 2026"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs min-h-[40px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Total Seats</label>
                          <input
                            type="number"
                            min={1}
                            value={newBatchForm.seatsTotal}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setNewBatchForm({ ...newBatchForm, seatsTotal: val, seatsLeft: val });
                            }}
                            className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold min-h-[40px]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Seats Left</label>
                          <input
                            type="number"
                            min={0}
                            value={newBatchForm.seatsLeft}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, seatsLeft: parseInt(e.target.value) || 0 })}
                            className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold min-h-[40px]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Status</label>
                          <select
                            value={newBatchForm.status}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, status: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold min-h-[40px]"
                          >
                            <option value="Open">Open</option>
                            <option value="Filling Fast">Filling Fast</option>
                            <option value="Sold Out">Sold Out</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddBatchModal(false)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer min-h-[40px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 min-h-[40px]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Publish Batch</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Batches Mobile Cards (< md) */}
              <div className="md:hidden space-y-3">
                {batches.map((batch) => {
                  const fillRatio = batch.seatsTotal > 0 ? (batch.seatsTotal - batch.seatsLeft) / batch.seatsTotal : 0;
                  return (
                    <div
                      key={batch.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-[#08245F]">{batch.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] capitalize">
                              {batch.type}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">{batch.startDate}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                            batch.status === 'Filling Fast'
                              ? 'bg-amber-100 text-amber-800'
                              : batch.status === 'Open'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {batch.status}
                        </span>
                      </div>

                      {/* Capacity progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{batch.seatsLeft} of {batch.seatsTotal} seats open</span>
                          <span className="text-slate-400 font-normal">{batch.duration}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              batch.seatsLeft === 0
                                ? 'bg-red-500'
                                : batch.seatsLeft <= 3
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.round(fillRatio * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingBatch({ ...batch })}
                          className="cursor-pointer text-xs font-bold text-[#08245F] hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Batch</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Batches Desktop/Tablet Table (>= md) */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                        <th className="py-3 px-4">Batch Title</th>
                        <th className="py-3 px-4">Schedule Type</th>
                        <th className="py-3 px-4">Start Date</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Seat Capacity</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {batches.map((batch) => {
                        const isEditing = editingBatch?.id === batch.id;

                        if (isEditing && editingBatch) {
                          return (
                            <tr key={batch.id} className="bg-blue-50/60">
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={editingBatch.name}
                                  onChange={(e) =>
                                    setEditingBatch({ ...editingBatch, name: e.target.value })
                                  }
                                  className="font-bold text-xs text-[#08245F] border border-slate-300 rounded p-1 w-full"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={editingBatch.type}
                                  onChange={(e) =>
                                    setEditingBatch({ ...editingBatch, type: e.target.value as any })
                                  }
                                  className="text-xs font-bold border border-slate-300 rounded p-1"
                                >
                                  <option value="weekday">Weekday</option>
                                  <option value="weekend">Weekend</option>
                                  <option value="custom">Custom</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={editingBatch.startDate}
                                  onChange={(e) =>
                                    setEditingBatch({ ...editingBatch, startDate: e.target.value })
                                  }
                                  className="text-xs border border-slate-300 rounded p-1 w-28"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={editingBatch.duration}
                                  onChange={(e) =>
                                    setEditingBatch({ ...editingBatch, duration: e.target.value })
                                  }
                                  className="text-xs border border-slate-300 rounded p-1 w-20"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="number"
                                    value={editingBatch.seatsLeft}
                                    onChange={(e) =>
                                      setEditingBatch({
                                        ...editingBatch,
                                        seatsLeft: parseInt(e.target.value) || 0
                                      })
                                    }
                                    className="text-xs border border-slate-300 rounded p-1 w-14 font-bold"
                                    title="Seats Left"
                                  />
                                  <span>/</span>
                                  <input
                                    type="number"
                                    value={editingBatch.seatsTotal}
                                    onChange={(e) =>
                                      setEditingBatch({
                                        ...editingBatch,
                                        seatsTotal: parseInt(e.target.value) || 0
                                      })
                                    }
                                    className="text-xs border border-slate-300 rounded p-1 w-14 font-bold"
                                    title="Total Seats"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={editingBatch.status}
                                  onChange={(e) =>
                                    setEditingBatch({
                                      ...editingBatch,
                                      status: e.target.value as Batch['status']
                                    })
                                  }
                                  className="text-xs font-bold p-1 border rounded"
                                >
                                  <option value="Open">Open</option>
                                  <option value="Filling Fast">Filling Fast</option>
                                  <option value="Sold Out">Sold Out</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingBatch(null)}
                                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateBatch(editingBatch);
                                    setEditingBatch(null);
                                    showToast('Batch updated successfully', 'success');
                                  }}
                                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-md cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Save className="w-3 h-3" />
                                  Save
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        const fillRatio = batch.seatsTotal > 0 ? (batch.seatsTotal - batch.seatsLeft) / batch.seatsTotal : 0;

                        return (
                          <tr key={batch.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-[#08245F]">{batch.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] capitalize">
                                {batch.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-800 font-medium">{batch.startDate}</td>
                            <td className="py-3 px-4 text-slate-600">{batch.duration}</td>
                            <td className="py-3 px-4">
                              <div className="space-y-1 max-w-[130px]">
                                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                                  <span>{batch.seatsLeft} open</span>
                                  <span className="text-slate-400 font-normal">/ {batch.seatsTotal}</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      batch.seatsLeft === 0
                                        ? 'bg-red-500'
                                        : batch.seatsLeft <= 3
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.round(fillRatio * 100))}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  batch.status === 'Filling Fast'
                                    ? 'bg-amber-100 text-amber-800'
                                    : batch.status === 'Open'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {batch.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setEditingBatch({ ...batch })}
                                className="cursor-pointer text-xs font-bold text-[#08245F] hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                              >
                                Edit Batch
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: NEWS & ANNOUNCEMENTS */}
          {/* ========================================================= */}
          {activeTab === 'news' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase">
                    RPTO News & Notice Board
                  </h2>
                  <p className="text-xs text-slate-500">
                    Publish official announcements, DGCA regulatory circulars, and placement updates to public website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddNews(true)}
                  className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#16357d] px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto min-h-[40px]"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>New Announcement</span>
                </button>
              </div>

              {/* Add News Form */}
              {showAddNews && (
                <div className="bg-white rounded-2xl border border-blue-200 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#08245F] uppercase">Create New Announcement</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Headline / Title *</label>
                      <input
                        type="text"
                        placeholder="Notice title or headline..."
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 min-h-[40px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select
                        value={newAnnouncement.category}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 font-bold min-h-[40px]"
                      >
                        <option value="DGCA Notice">DGCA Notice</option>
                        <option value="Admissions">Admissions</option>
                        <option value="Airfield">Airfield</option>
                        <option value="Placement">Placement</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Summary / Full Circular Text</label>
                    <textarea
                      placeholder="Summary or details of the announcement..."
                      value={newAnnouncement.summary}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, summary: e.target.value })}
                      rows={2}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="text-xs font-bold text-slate-500 px-3.5 py-2 hover:text-slate-700 cursor-pointer min-h-[38px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newAnnouncement.title.trim()) {
                          showToast('Please enter an announcement title', 'error');
                          return;
                        }
                        await addNewsItem({
                          title: newAnnouncement.title,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          category: newAnnouncement.category,
                          summary: newAnnouncement.summary || newAnnouncement.title
                        });
                        setShowAddNews(false);
                        setNewAnnouncement({ title: '', category: 'DGCA Notice', summary: '' });
                        showToast('Announcement published', 'success');
                      }}
                      className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 min-h-[38px]"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish</span>
                    </button>
                  </div>
                </div>
              )}

              {/* News List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
                {news.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-3">
                    <div className="space-y-1 max-w-2xl min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#08245F] border border-blue-200 shrink-0">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium truncate">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 break-words">{item.title}</h4>
                      {item.summary && (
                        <p className="text-[11px] text-slate-500 leading-relaxed break-words">{item.summary}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteNewsItem(item.id);
                        showToast('Announcement removed', 'info');
                      }}
                      className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: PHOTO GALLERY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#08245F] tracking-tight uppercase flex items-center gap-2">
                    <Images className="w-5 h-5 text-[#FFB800]" />
                    <span>Campus & Flight Photo Gallery Management</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Add, edit, filter, and organize photos with title, subtitle, and description synchronized to the server database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Live Database Sync</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(true)}
                    className="cursor-pointer text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 min-h-[40px] uppercase tracking-wide transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Photo</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[
                    { id: 'all', label: 'All Photos' },
                    { id: 'Training', label: 'Training' },
                    { id: 'Events', label: 'Events' },
                    { id: 'Industrial', label: 'Industrial' },
                    { id: 'Facilities', label: 'Facilities' }
                  ].map((cat) => {
                    const isSelected = galleryCategoryFilter === cat.id;
                    const count = cat.id === 'all'
                      ? gallery.length
                      : gallery.filter((item) => {
                          const c = (item.category || '').toLowerCase();
                          const target = cat.id.toLowerCase();
                          if (c === target) return true;
                          const t = `${item.name} ${item.subtitle || ''} ${item.description || ''} ${item.stats || ''}`.toLowerCase();
                          if (target === 'training') return /pilot|simulator|ground|flight|class|exam/i.test(t);
                          if (target === 'events') return /event|ceremony|convocation|expo|showcase|wings/i.test(t);
                          if (target === 'industrial') return /industrial|assembly|avionics|diagnostics|station|solar|sensor/i.test(t);
                          if (target === 'facilities') return /airfield|runway|campus|headquarters|building/i.test(t);
                          return false;
                        }).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setGalleryCategoryFilter(cat.id)}
                        className={`cursor-pointer px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[34px] ${
                          isSelected
                            ? 'bg-[#08245F] text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#08245F]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar + Published Count */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search photos by title, subtitle, category or description..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    {gallerySearch && (
                      <button
                        type="button"
                        onClick={() => setGallerySearch('')}
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                      {gallery.length} Photos in Database
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery
                  .filter((item) => {
                    // Category filter
                    if (galleryCategoryFilter !== 'all') {
                      const c = (item.category || '').toLowerCase();
                      const target = galleryCategoryFilter.toLowerCase();
                      let matches = false;
                      if (c === target) matches = true;
                      else {
                        const t = `${item.name} ${item.subtitle || ''} ${item.description || ''} ${item.stats || ''}`.toLowerCase();
                        if (target === 'training' && /pilot|simulator|ground|flight|class|exam/i.test(t)) matches = true;
                        if (target === 'events' && /event|ceremony|convocation|expo|showcase|wings/i.test(t)) matches = true;
                        if (target === 'industrial' && /industrial|assembly|avionics|diagnostics|station|solar|sensor/i.test(t)) matches = true;
                        if (target === 'facilities' && /airfield|runway|campus|headquarters|building/i.test(t)) matches = true;
                      }
                      if (!matches) return false;
                    }

                    // Search filter
                    if (gallerySearch.trim()) {
                      const q = gallerySearch.toLowerCase();
                      const text = `${item.name} ${item.subtitle || ''} ${item.description || ''} ${item.category || ''} ${item.stats || ''}`.toLowerCase();
                      if (!text.includes(q)) return false;
                    }

                    return true;
                  })
                  .map((item) => {
                    const itemCat = item.category || 'Facilities';
                    const getBadgeStyle = (cat: string) => {
                      switch (cat) {
                        case 'Training':
                          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        case 'Events':
                          return 'bg-amber-100 text-amber-800 border-amber-200';
                        case 'Industrial':
                          return 'bg-sky-100 text-sky-800 border-sky-200';
                        case 'Facilities':
                        default:
                          return 'bg-purple-100 text-purple-800 border-purple-200';
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div>
                          {/* Image Preview Container - Locked 16:9 aspect ratio */}
                          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ aspectRatio: '16 / 9' }}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = '/images/airfield.webp';
                              }}
                            />

                            {/* Category Tag (Top Left) */}
                            <span
                              className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-2xs ${getBadgeStyle(
                                itemCat
                              )}`}
                            >
                              {itemCat}
                            </span>

                            {/* Stats Tag (Top Right) */}
                            {item.stats && (
                              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#071D4A]/90 text-[#FFB800] text-[9px] font-black uppercase tracking-wider backdrop-blur-xs border border-white/10">
                                {item.stats}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => openLightbox(item.image, item.name, item.description)}
                              className="cursor-pointer absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs transition-colors"
                            >
                              <Eye className="w-3 h-3 text-[#FFB800]" />
                              <span>Preview</span>
                            </button>
                          </div>

                          {/* Text Content: Title, Subtitle, Description */}
                          <div className="p-3.5 space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-xs sm:text-sm font-black text-[#08245F] line-clamp-1">
                                {item.name}
                              </h3>
                            </div>
                            {item.subtitle && (
                              <p className="text-[10px] sm:text-xs font-bold text-[#d71920] line-clamp-1">
                                {item.subtitle}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400 font-mono truncate">
                            ID: {item.id}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingGalleryItem(item)}
                              className="cursor-pointer text-xs font-bold text-[#08245F] hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                deleteGalleryItem(item.id);
                              }}
                              className="cursor-pointer text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 p-1.5 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {gallery.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">No photos in the gallery yet</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Click "Add New Photo" to publish photos to the public gallery.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(true)}
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: RPC HOLDERS REGISTRY */}
          {/* ========================================================= */}
          {activeTab === 'rpc-holders' && <AdminRpcHoldersSection />}
        </main>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION BAR (FIXED FOR CONVENIENT THUMB ACCESS ON PHONES) */}
      <nav aria-label="Mobile Bottom Bar" className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around shadow-lg safe-area-pb overflow-x-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 px-0.5 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer relative min-h-[44px] ${
                isActive
                  ? 'text-[#08245F] font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#08245F] stroke-[2.5]' : 'text-slate-500'}`} />
                {tab.id === 'enquiries' && newCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {newCount}
                  </span>
                )}
              </div>
              <span className={`text-[9px] leading-tight truncate max-w-[50px] ${isActive ? 'text-[#08245F] font-black' : 'text-slate-500'}`}>
                {tab.id === 'enquiries'
                  ? 'Admissions'
                  : tab.id === 'courses'
                  ? 'Courses'
                  : tab.id === 'batches'
                  ? 'Batches'
                  : tab.id === 'rpc-holders'
                  ? 'RPCs'
                  : tab.id === 'gallery'
                  ? 'Gallery'
                  : tab.id === 'news'
                  ? 'News'
                  : 'Overview'}
              </span>
              {isActive && (
                <span className="w-5 h-0.5 bg-[#08245F] rounded-full absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 5. CANDIDATE REGISTRATION DETAILS MODAL (ACCESSIBLE FROM ANY TAB) */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
            {/* Sticky Compact Modal Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 flex items-start justify-between gap-2.5 bg-white shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${getEnquiryTrackBadge(selectedEnquiry).bg}`}>
                    <span>{getEnquiryTrackBadge(selectedEnquiry).icon}</span>
                    <span className="truncate max-w-[170px]">{getEnquiryTrackBadge(selectedEnquiry).label}</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ID: {selectedEnquiry.id}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#08245F] truncate">
                  {selectedEnquiry.fullName}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {selectedEnquiry.createdAt} · <span className="text-[#08245F] font-bold">{selectedEnquiry.courseName}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 bg-slate-50 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {/* Quick Communication Bar (Compact 3-column row) */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="py-2 px-1 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-[11px] font-bold text-blue-900 flex items-center justify-center gap-1.5 transition-colors"
                  title={`Call ${selectedEnquiry.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Call</span>
                </a>

                <a
                  href={getWhatsAppUrl(selectedEnquiry.phone, selectedEnquiry.fullName, selectedEnquiry.courseName)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-1 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[11px] font-bold text-emerald-900 flex items-center justify-center gap-1.5 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>

                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="py-2 px-1 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[11px] font-bold text-indigo-900 flex items-center justify-center gap-1.5 transition-colors"
                  title={`Email ${selectedEnquiry.email}`}
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">Email</span>
                </a>
              </div>

              {/* Program & Batch Info (Compact) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Program</p>
                  <p className="font-bold text-xs text-[#08245F] mt-0.5 truncate" title={selectedEnquiry.courseName}>
                    {selectedEnquiry.courseName}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cohort / Batch</p>
                  <p className="font-bold text-xs text-slate-700 mt-0.5 truncate" title={selectedEnquiry.preferredBatch || 'Standard Cohort'}>
                    {selectedEnquiry.preferredBatch || 'Standard Cohort'}
                  </p>
                </div>
              </div>

              {/* Parsed Applicant Attributes if available */}
              {(() => {
                const details = parseApplicantDetails(selectedEnquiry.message);
                if (!details) return null;
                return (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Profile Details:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {details.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">{item.label}</span>
                          <span className="font-semibold text-slate-800 text-[11px] block truncate">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Candidate Registration Message Notes */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Registration Notes & Inquiries
                  </label>
                  {selectedEnquiry.message && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedEnquiry.message || '');
                        setCopiedId(selectedEnquiry.id);
                        setTimeout(() => setCopiedId(null), 1500);
                        showToast('Message copied to clipboard', 'info');
                      }}
                      className="text-[10px] text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer py-0.5"
                    >
                      {copiedId === selectedEnquiry.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto border border-slate-800 shadow-inner">
                  {selectedEnquiry.message || 'No additional message was provided by the applicant.'}
                </div>
              </div>

              {/* Admin Status & Notes Editor */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Application Status
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['New', 'Contacted', 'Enrolled', 'Archived'] as const).map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => {
                          updateEnquiryStatus(selectedEnquiry.id, st, adminNoteInput);
                          setSelectedEnquiry((prev) => (prev ? { ...prev, status: st } : null));
                        }}
                        className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center truncate ${
                          selectedEnquiry.status === st
                            ? 'bg-[#08245F] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Coordinator Remarks (Internal)
                  </label>
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Called candidate on 10:30 AM, batch confirmed..."
                    className="w-full text-xs font-medium p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer (Compact) */}
            <div className="px-3.5 py-2.5 sm:px-5 sm:py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, adminNoteInput);
                    showToast('Admin notes updated in database', 'success');
                  }}
                  className="px-3.5 py-2 text-xs font-black bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Remarks</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete application for ${selectedEnquiry.fullName}?`)) {
                      deleteEnquiry(selectedEnquiry.id);
                      setSelectedEnquiry(null);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete this application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FACTORY RESET CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#08245F] uppercase">
                  Reset System Data to Factory Defaults?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This will reload initial baseline courses, flight batches, circular notices, and default applications into your database. Custom test records will be restored to clean defaults.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllDataToDefaults();
                  setShowResetConfirmModal(false);
                  showToast('Database reset to defaults', 'info');
                }}
                className="px-4 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD GALLERY PHOTO MODAL */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08245F] uppercase">Add Photo to Gallery</h3>
                  <p className="text-[11px] text-slate-500">Photo will appear live in the public Gallery tab</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGalleryForm.image.trim()) {
                  showToast('Please provide an image URL or upload a photo', 'error');
                  return;
                }
                if (!newGalleryForm.name.trim()) {
                  showToast('Please enter a photo title', 'error');
                  return;
                }
                if (!newGalleryForm.subtitle.trim()) {
                  showToast('Please enter a subtitle', 'error');
                  return;
                }
                if (!newGalleryForm.description.trim()) {
                  showToast('Please enter a description', 'error');
                  return;
                }

                addGalleryItem({
                  name: newGalleryForm.name.trim(),
                  subtitle: newGalleryForm.subtitle.trim(),
                  description: newGalleryForm.description.trim(),
                  image: newGalleryForm.image.trim(),
                  stats: newGalleryForm.stats.trim() || 'Photo',
                  category: newGalleryForm.category || 'Training'
                });

                setNewGalleryForm({
                  name: '',
                  subtitle: '',
                  description: '',
                  image: '',
                  stats: 'Campus Photo',
                  category: 'Training'
                });
                setShowAddGalleryModal(false);
              }}
              className="space-y-3.5"
            >
              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Photo (Image URL or Upload from Device) <span className="text-red-500">*</span>
                </label>

                {/* Live Preview - 16:9 Aspect Ratio */}
                <div className="relative aspect-video w-full rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
                  {newGalleryForm.image ? (
                    <img
                      src={newGalleryForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16 / 9' }}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/images/airfield.webp';
                      }}
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400 space-y-1">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs font-semibold">No photo selected</p>
                      <p className="text-[10px] text-slate-500">Paste a link, choose a preset, or upload an image file</p>
                    </div>
                  )}
                  {newGalleryForm.image && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                      Preview Active
                    </span>
                  )}
                </div>

                {/* Input + File Upload */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://... or /images/..."
                    value={newGalleryForm.image}
                    onChange={(e) => setNewGalleryForm({ ...newGalleryForm, image: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 text-xs font-bold text-[#08245F] bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setNewGalleryForm(prev => ({ ...prev, image: result }));
                              showToast('Image uploaded successfully', 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Or select a campus drone preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Airfield', url: '/images/airfield.webp' },
                      { label: 'RPTO Campus', url: '/images/drone-infra-building.webp' },
                      { label: 'Flight Simulators', url: '/images/simulator-zone.webp' },
                      { label: 'Ground Class', url: '/images/ground-class.webp' },
                      { label: 'Assembly Rig', url: '/images/drone-station.webp' },
                      { label: 'Avionics Bay', url: '/images/drone-station-2.webp' },
                      { label: 'Flight Ops', url: '/images/discussion-room.webp' },
                      { label: 'Drone Fleet', url: '/images/drone-library.webp' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewGalleryForm(prev => ({ ...prev, image: preset.url }))}
                        className="cursor-pointer text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinathukadavu Airfield Flight Operations"
                  value={newGalleryForm.name}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Subtitle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15+ Acres Approved Green Zone Airspace"
                  value={newGalleryForm.subtitle}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Dedicated private flying field in Kinathukadavu with uninterrupted Green Zone airspace, geo-fenced safety boundaries, and live telemetry instrumentation."
                  value={newGalleryForm.description}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Filter Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newGalleryForm.category}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Training">Training (Simulators, Pilot Training, Ground Class)</option>
                  <option value="Events">Events (Convocations, Airshows, Drone Expos, Ceremonies)</option>
                  <option value="Industrial">Industrial (Solar/Wind Inspection, Assembly & Avionics Bays)</option>
                  <option value="Facilities">Facilities (Airfield, Runways, RPTO Campus, Flight Ops)</option>
                </select>
              </div>

              {/* Tag / Badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Category Tag / Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15+ Acres • Active Airfield"
                  value={newGalleryForm.stats}
                  onChange={(e) => setNewGalleryForm({ ...newGalleryForm, stats: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="cursor-pointer px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-5 py-2.5 text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] rounded-xl shadow-xs flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. EDIT GALLERY PHOTO MODAL */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08245F] uppercase">Edit Gallery Photo</h3>
                  <p className="text-[11px] text-slate-500">Update photo details and description</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingGalleryItem.name.trim() || !editingGalleryItem.image.trim()) {
                  showToast('Photo and title are required', 'error');
                  return;
                }
                updateGalleryItem(editingGalleryItem);
                setEditingGalleryItem(null);
              }}
              className="space-y-3.5"
            >
              {/* Photo Preview & Edit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Photo</label>
                <div className="relative aspect-video w-full rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
                  <img
                    src={editingGalleryItem.image}
                    alt={editingGalleryItem.name}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16 / 9' }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = '/images/airfield.webp';
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingGalleryItem.image}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, image: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 text-xs font-bold text-[#08245F] bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setEditingGalleryItem(prev => prev ? ({ ...prev, image: result }) : null);
                              showToast('Image uploaded successfully', 'success');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Title</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.name}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Subtitle</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.subtitle || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editingGalleryItem.description || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingGalleryItem.category || 'Training'}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Training">Training (Simulators, Pilot Training, Ground Class)</option>
                  <option value="Events">Events (Convocations, Airshows, Drone Expos, Ceremonies)</option>
                  <option value="Industrial">Industrial (Solar/Wind Inspection, Assembly & Avionics Bays)</option>
                  <option value="Facilities">Facilities (Airfield, Runways, RPTO Campus, Flight Ops)</option>
                </select>
              </div>

              {/* Tag */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Tag / Badge</label>
                <input
                  type="text"
                  value={editingGalleryItem.stats || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, stats: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGalleryItem(null)}
                  className="cursor-pointer px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

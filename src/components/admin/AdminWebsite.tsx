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
  AlertCircle,
  FileSpreadsheet,
  LogOut,
  Search,
  Plus,
  Edit2,
  X,
  Activity,
  Layers,
  Phone,
  Mail,
  Filter,
  ShieldCheck,
  TrendingUp,
  Clock,
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
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { Course, Batch, NewsItem, Enquiry } from '../../types';

export const AdminWebsite: React.FC = () => {
  const {
    courses,
    updateCourse,
    batches,
    updateBatch,
    addBatch,
    news,
    updateNews,
    addNewsItem,
    deleteNewsItem,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'courses' | 'batches' | 'news' | 'integrations'>('overview');

  // Integrations state
  const [sheetsUrlInput, setSheetsUrlInput] = useState('');
  const [sheetsConfigured, setSheetsConfigured] = useState(false);
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [testSyncResult, setTestSyncResult] = useState<any>(null);
  const [isSavingSheetsUrl, setIsSavingSheetsUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Load integration status
  React.useEffect(() => {
    fetch('/api/integrations/google-sheets')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSheetsConfigured(data.configured);
          setSheetsUrlInput(data.url || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveGoogleSheetsUrl = async (testPing = false) => {
    if (testPing) setIsTestingSync(true);
    else setIsSavingSheetsUrl(true);

    try {
      const res = await fetch('/api/integrations/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sheetsUrlInput, testPing })
      });
      const data = await res.json();
      if (data.success) {
        setSheetsConfigured(Boolean(sheetsUrlInput.trim()));
        if (testPing) {
          setTestSyncResult(data.testResult);
          showToast(
            data.testResult?.synced
              ? 'Test row appended to Google Sheets successfully!'
              : `Sync test: ${data.testResult?.message || 'Check URL'}`,
            data.testResult?.synced ? 'success' : 'info'
          );
        } else {
          showToast('Google Sheets Webhook URL saved successfully!', 'success');
        }
      }
    } catch {
      showToast('Failed to save Google Sheets settings', 'error');
    } finally {
      setIsSavingSheetsUrl(false);
      setIsTestingSync(false);
    }
  };

  // Enquiry filters, track filter and candidate message modal
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trackFilter, setTrackFilter] = useState<'all' | 'dgca' | 'glider' | 'drone-design' | 'repair' | 'internship' | 'solar-inspection'>('all');
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
        icon: '☀️',
        bg: 'bg-amber-100 text-amber-950 border-amber-300 font-black'
      };
    }
    if (cId.includes('glider') || cName.includes('glider') || msg.includes('glider')) {
      return {
        type: 'glider' as const,
        label: 'Track 1 · Glider Design',
        icon: '🛩️',
        bg: 'bg-blue-50 text-blue-900 border-blue-200'
      };
    }
    if (cId.includes('drone-design') || cName.includes('drone design') || msg.includes('drone design')) {
      return {
        type: 'drone-design' as const,
        label: 'Track 2 · Drone Design & Dev',
        icon: '🚁',
        bg: 'bg-red-50 text-red-900 border-red-200'
      };
    }
    if (cId.includes('repair') || cName.includes('repair') || cName.includes('maintenance') || msg.includes('repair')) {
      return {
        type: 'repair' as const,
        label: 'Track 3 · Drone Repair & Maint',
        icon: '🔧',
        bg: 'bg-amber-50 text-amber-900 border-amber-200'
      };
    }
    if (cId.includes('intern') || cName.includes('intern') || msg.includes('intern')) {
      return {
        type: 'internship' as const,
        label: 'Track 4 · Internship (2 Weeks)',
        icon: '🎓',
        bg: 'bg-purple-50 text-purple-900 border-purple-200'
      };
    }
    return {
      type: 'dgca' as const,
      label: 'DGCA Commercial Pilot RPC',
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

  // Filtered courses
  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.weightClass.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATION LOCK SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full bg-[#071D4A] flex flex-col justify-between text-slate-100 font-sans p-4 sm:p-6 select-text overflow-y-auto">
        {/* Header */}
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#08245F] flex items-center justify-center font-black text-sm shadow-md">
              RPTO
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Sri Eshwar Drone Tech Pvt Ltd
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                DGCA Authorized Remote Pilot Training Organization · TN 21/2024
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExitAdmin}
            className="cursor-pointer text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>

        {/* Login Box */}
        <div className="max-w-md w-full mx-auto my-auto bg-[#08245F] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800]">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              RPTO Management Console
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your authorized administrative passcode to manage student admissions, flight batches, and course schedules.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Administrative Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter passcode (admin123)"
                  className="w-full bg-[#071D4A] border border-slate-600 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1"
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 font-semibold mt-2 flex items-center gap-1.5 bg-red-950/40 p-2 rounded-lg border border-red-800/60">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-3 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] text-[#08245F] font-black text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Access RPTO Console
            </button>

            {/* Quick Demo Key autofill button */}
            <button
              type="button"
              onClick={() => {
                setPasscode('admin123');
                setErrorMsg('');
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-[#FFB800] py-1 cursor-pointer transition-colors"
            >
              Click to autofill authorized demo key: <span className="font-mono font-bold text-[#FFB800]">admin123</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={handleExitAdmin}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-5xl w-full mx-auto text-center py-2 text-[11px] text-slate-400">
          Sri Eshwar Drone Tech Pvt Ltd · DGCA/RPTO-TN 21/2024 · Kinathukadavu Airfield, Coimbatore
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED STANDALONE ADMIN WEBSITE DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col font-sans text-slate-800 overflow-hidden select-text">
      {/* 1. TOP BAR */}
      <header className="bg-[#08245F] text-white px-3 sm:px-6 py-2.5 shrink-0 flex items-center justify-between shadow-md z-20 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFB800] text-[#08245F] font-black flex items-center justify-center text-xs shadow-xs">
            RPTO
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Sri Eshwar RPTO Portal
              </h1>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Authorization: DGCA/RPTO-TN 21/2024 · Kinathukadavu Airfield
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Live Database Sync Indicator */}
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

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5"
            title="Force immediate synchronization with server database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Sync DB</span>
          </button>

          <button
            type="button"
            onClick={exportFullDatabaseJSON}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5 hidden md:flex"
            title="Download full database JSON backup"
          >
            <Database className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Backup DB</span>
          </button>

          <button
            type="button"
            onClick={handleExitAdmin}
            className="cursor-pointer text-xs font-bold text-sky-200 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Website</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-600 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 hidden xl:flex"
            title="Open Live Public Website in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
            <span>New Tab</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-xs font-bold text-slate-200 hover:text-white bg-red-950/70 hover:bg-red-900 border border-red-800/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 w-full relative">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between hidden md:flex min-h-0 overflow-y-auto">
          <div className="p-3 space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#FFB800]" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'enquiries'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Admissions & Enquiries</span>
              </div>
              {newCount > 0 ? (
                <span className="bg-[#d71920] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {newCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold">{enquiries.length}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('courses')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'courses'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Courses & Fee Matrix</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{courses.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('batches')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'batches'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Flight Batches</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{batches.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'news'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Announcements & News</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{news.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('integrations')}
              className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'integrations'
                  ? 'bg-[#08245F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Google Sheets & Email</span>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                sheetsConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {sheetsConfigured ? 'Active' : 'Setup'}
              </span>
            </button>
          </div>

          {/* Sidebar Footer Operations */}
          <div className="p-3 border-t border-slate-200 space-y-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#08245F]">
                <span>Storage Target:</span>
                <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">rpto-db.json</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Full two-way persistence active for all registrations and course fee updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="w-full cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset System Data
            </button>
          </div>
        </aside>

        {/* Top Mobile Subnav */}
        <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center space-x-2 overflow-x-auto shrink-0 shadow-2xs">
          {(
            [
              { id: 'overview', label: 'Overview', badge: null },
              { id: 'enquiries', label: 'Admissions', badge: newCount > 0 ? newCount : null },
              { id: 'courses', label: 'Courses', badge: courses.length },
              { id: 'batches', label: 'Batches', badge: batches.length },
              { id: 'news', label: 'News', badge: news.length },
              { id: 'integrations', label: 'Sheets & Email', badge: sheetsConfigured ? '✓' : '!' }
            ] as const
          ).map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id ? 'bg-[#08245F] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    tab.id === 'enquiries' && newCount > 0
                      ? 'bg-red-600 text-white'
                      : activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <main
          id="admin-main-scrollable"
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Admissions & Operations Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Real-time synchronization for candidate applications and airfield flight batches.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isRefreshing}
                    className="cursor-pointer text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Sync Live Data</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => {
                    setActiveTab('enquiries');
                    setStatusFilter('All');
                    setTrackFilter('all');
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Total Applications</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-[#08245F]">{enquiries.length}</div>
                  <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {newCount} pending review
                  </p>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('enquiries');
                    setStatusFilter('Enrolled');
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Enrolled Candidates</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700">{enrolledCount}</div>
                  <p className="text-[11px] text-slate-500">
                    {enquiries.length > 0 ? `${Math.round((enrolledCount / enquiries.length) * 100)}% conversion rate` : '0%'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('batches')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Active Flight Batches</span>
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-[#08245F]">{batches.length}</div>
                  <p className="text-[11px] text-slate-500">{seatsAvailable} of {totalSlots} seats open</p>
                </div>

                <div
                  onClick={() => setActiveTab('courses')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-red-400 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Course Catalog</span>
                    <Award className="w-4 h-4 text-[#d71920]" />
                  </div>
                  <div className="text-2xl font-black text-[#08245F]">{courses.length}</div>
                  <p className="text-[11px] text-slate-500">DGCA RPC & Technical Tracks</p>
                </div>
              </div>

              {/* Google Sheets & Email Automated Pipeline Status Bar */}
              <div
                onClick={() => setActiveTab('integrations')}
                className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                        Live Auto-Sync Active
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        → dronetech@sece.ac.in
                      </span>
                    </div>
                    <p className="text-xs font-black text-[#08245F] mt-0.5">
                      {sheetsConfigured
                        ? 'Google Sheets Webhook Connected · Every new enroll & enquiry is recorded live'
                        : 'Google Sheets link ready to connect · Click to paste your Sheet Webhook URL'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                    sheetsConfigured ? 'bg-emerald-200/80 text-emerald-900' : 'bg-amber-200/80 text-amber-900'
                  }`}>
                    {sheetsConfigured ? '✓ Connected' : 'Configure Sheet'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Technical Tracks Breakdown Mini Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                      Applications by Specialization Track
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Click any track to filter the candidate management table directly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('all');
                    }}
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('dgca');
                    }}
                    className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-all"
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
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="text-base">🛩️</div>
                    <div className="text-lg font-black text-blue-950 mt-1">{gliderCount}</div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase leading-tight">Track 1 · Glider</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('drone-design');
                    }}
                    className="p-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-all"
                  >
                    <div className="text-base">🚁</div>
                    <div className="text-lg font-black text-red-950 mt-1">{droneDesignCount}</div>
                    <div className="text-[10px] font-bold text-red-700 uppercase leading-tight">Track 2 · Drone Dev</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('repair');
                    }}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-all"
                  >
                    <div className="text-base">🔧</div>
                    <div className="text-lg font-black text-amber-950 mt-1">{repairCount}</div>
                    <div className="text-[10px] font-bold text-amber-700 uppercase leading-tight">Track 3 · Repair</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('enquiries');
                      setTrackFilter('internship');
                    }}
                    className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 cursor-pointer transition-all"
                  >
                    <div className="text-base">🎓</div>
                    <div className="text-lg font-black text-purple-950 mt-1">{internshipCount}</div>
                    <div className="text-[10px] font-bold text-purple-700 uppercase leading-tight">Track 4 · Internship</div>
                  </div>
                </div>
              </div>

              {/* Central Database Linkage & Two-Way Sync Banner */}
              <div className="bg-gradient-to-r from-[#08245F] via-[#073B8F] to-[#08245F] rounded-2xl p-4 sm:p-5 text-white shadow-md border border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FFB800]/20 border border-[#FFB800]/40 text-[#FFB800] shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black uppercase tracking-wide text-white">
                        RPTO Central Database Linked & Active
                      </h3>
                      <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        2-Way Live Sync
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Every candidate submission on the public website saves to <code className="text-[#FFB800] bg-black/30 px-1.5 py-0.5 rounded font-mono text-[11px]">/api/enquiries</code> & the server database. Course fees, batch seat adjustments, and announcements edited here update live across the public site.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isRefreshing}
                    className="cursor-pointer text-xs font-bold text-slate-900 bg-[#FFB800] hover:bg-[#FFB800] px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Sync Now
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                    Open Live Site
                  </a>
                </div>
              </div>

              {/* Quick Table: Recent Candidate Inquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
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
                    className="cursor-pointer text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    View All Enquiries <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
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
                                className="cursor-pointer text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
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

          {/* TAB 2: ENQUIRIES & ADMISSIONS */}
          {activeTab === 'enquiries' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Candidate Applications & Admissions Desk
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage enquiries, candidate contact status, and enrolled student records with live database synchronization.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={exportEnquiriesCSV}
                    className="cursor-pointer text-xs font-bold text-[#08245F] bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Top Track & Volume Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div
                  onClick={() => {
                    setTrackFilter('all');
                    setStatusFilter('All');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    trackFilter === 'all'
                      ? 'bg-white border-[#08245F] shadow-xs ring-1 ring-[#08245F]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Bookings</p>
                  <p className="text-xl font-black text-[#08245F] mt-0.5">{enquiries.length}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{newCount} pending response</p>
                </div>

                <div
                  onClick={() => setTrackFilter('solar-inspection')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    trackFilter === 'solar-inspection'
                      ? 'bg-amber-50 border-amber-600 shadow-xs ring-1 ring-amber-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                    <span>☀️</span> Solar Inspections
                  </p>
                  <p className="text-xl font-black text-amber-950 mt-0.5">{solarInspectionCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">PV Plant Thermography</p>
                </div>

                <div
                  onClick={() => setTrackFilter('dgca')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    trackFilter === 'dgca'
                      ? 'bg-indigo-50/50 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                    <span>🪪</span> DGCA RPC Pilots
                  </p>
                  <p className="text-xl font-black text-indigo-950 mt-0.5">{dgcaCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Commercial 2-150kg</p>
                </div>

                <div
                  onClick={() => setTrackFilter('drone-design')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    trackFilter === 'drone-design' || trackFilter === 'glider' || trackFilter === 'repair'
                      ? 'bg-red-50/50 border-red-600 shadow-xs ring-1 ring-red-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1">
                    <span>🛠️</span> Tech Tracks (1-3)
                  </p>
                  <p className="text-xl font-black text-[#08245F] mt-0.5">
                    {gliderCount + droneDesignCount + repairCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Glider, Drone Dev, Repair</p>
                </div>

                <div
                  onClick={() => setTrackFilter('internship')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    trackFilter === 'internship'
                      ? 'bg-purple-50/50 border-purple-600 shadow-xs ring-1 ring-purple-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                    <span>🎓</span> Internships (2 Wks)
                  </p>
                  <p className="text-xl font-black text-purple-950 mt-0.5">{internshipCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Project & R&D cohort</p>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search candidate, phone, message text..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#08245F] focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
                    <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Status:</span>
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
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
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Track:</span>
                  {[
                    { id: 'all', label: `All Tracks (${enquiries.length})` },
                    { id: 'solar-inspection', label: `☀️ Solar Inspections (${solarInspectionCount})` },
                    { id: 'dgca', label: `🪪 DGCA Licenses (${dgcaCount})` },
                    { id: 'glider', label: `🛩️ Glider Design (${gliderCount})` },
                    { id: 'drone-design', label: `🚁 Drone Design (${droneDesignCount})` },
                    { id: 'repair', label: `🔧 Repair & Maint (${repairCount})` },
                    { id: 'internship', label: `🎓 2-Wk Internship (${internshipCount})` }
                  ].map((track) => (
                    <button
                      type="button"
                      key={track.id}
                      onClick={() => setTrackFilter(track.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
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
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Showing <span className="font-bold text-[#08245F]">{filteredEnquiries.length}</span> of {enquiries.length} candidate applications
                </div>
              </div>

              {/* Table of Enquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                            <div className="space-y-1">
                              <p>No applications or messages found matching your criteria.</p>
                              {(searchQuery || statusFilter !== 'All' || trackFilter !== 'all') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('All');
                                    setTrackFilter('all');
                                  }}
                                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                                >
                                  Clear all filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enq) => {
                          const badge = getEnquiryTrackBadge(enq);

                          return (
                            <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Candidate & Track */}
                              <td className="py-3 px-4">
                                <div className="font-black text-[#08245F] text-sm flex items-center gap-1.5">
                                  <span>{enq.fullName}</span>
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
                                  className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border cursor-pointer focus:outline-hidden ${
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
                                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hello ${enq.fullName}, greetings from Sri Eshwar Drone Tech Pvt Ltd (DGCA RPTO). We received your application for ${enq.courseName}.`
                                    )}`}
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

              {/* MODAL: Full Registration Message & Candidate Management Dialog */}
              {selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-4">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5 ${getEnquiryTrackBadge(selectedEnquiry).bg}`}>
                          <span>{getEnquiryTrackBadge(selectedEnquiry).icon}</span>
                          <span>{getEnquiryTrackBadge(selectedEnquiry).label}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          ID: {selectedEnquiry.id}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Synced with live DB
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[#08245F]">
                        {selectedEnquiry.fullName}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        Registered on {selectedEnquiry.createdAt} for <span className="text-[#08245F] font-bold">{selectedEnquiry.courseName}</span>
                      </p>
                    </div>

                    {/* Quick Communication Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <a
                        href={`tel:${selectedEnquiry.phone}`}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>{selectedEnquiry.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedEnquiry.fullName}, greetings from Sri Eshwar Drone Tech Pvt Ltd (DGCA RPTO). We received your application for ${selectedEnquiry.courseName}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        <span>Send WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-indigo-600" />
                        <span>Email Candidate</span>
                      </a>
                    </div>

                    {/* Program & Batch Info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Selected Program</p>
                        <p className="font-black text-[#08245F] mt-0.5">{selectedEnquiry.courseName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Batch / Duration</p>
                        <p className="font-black text-slate-700 mt-0.5">{selectedEnquiry.preferredBatch || 'Standard Batch'}</p>
                      </div>
                    </div>

                    {/* Parsed Applicant Attributes if available */}
                    {(() => {
                      const details = parseApplicantDetails(selectedEnquiry.message);
                      if (!details) return null;
                      return (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Candidate Profile Details:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {details.map((item, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">{item.label}</span>
                                <span className="font-semibold text-slate-800">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Full Candidate Registration Message */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                          Full Registration Notes & Inquiries
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
                            className="text-[11px] text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === selectedEnquiry.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-800 shadow-inner">
                        {selectedEnquiry.message || 'No additional message was provided by the applicant.'}
                      </div>
                    </div>

                    {/* Admin Status & Notes Editor */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                          Application Status
                        </label>
                        <div className="flex items-center gap-1.5">
                          {(['New', 'Contacted', 'Enrolled', 'Archived'] as const).map((st) => (
                            <button
                              type="button"
                              key={st}
                              onClick={() => {
                                updateEnquiryStatus(selectedEnquiry.id, st, adminNoteInput);
                                setSelectedEnquiry((prev) => (prev ? { ...prev, status: st } : null));
                              }}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
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
                        <label className="text-xs font-bold text-slate-700 block">
                          Internal Admin Notes (Coordinator Remarks)
                        </label>
                        <textarea
                          rows={2}
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          placeholder="e.g. Called candidate on 10:30 AM, batch confirmed for next Monday cohort..."
                          className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, adminNoteInput);
                            }}
                            className="px-4 py-2 text-xs font-black bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
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
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(null)}
                          className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                        >
                          Close Viewer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COURSES & FEE MATRIX */}
          {activeTab === 'courses' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
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
                    placeholder="Search courses or weight class..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#08245F]"
                  />
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map((course) => {
                  const isEditing = editingCourse?.id === course.id;

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
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
                                className="font-black text-sm text-[#08245F] border border-slate-300 rounded-lg p-1.5 w-full"
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
                                className="font-black text-sm text-[#08245F] border border-slate-300 rounded-lg p-1 w-full mt-0.5"
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
                                className="font-bold text-xs text-slate-800 border border-slate-300 rounded-lg p-1 w-full mt-0.5"
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
                                className="font-bold text-xs text-slate-800 border border-slate-300 rounded-lg p-1 w-full mt-0.5"
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
                                  className="w-14 text-xs font-bold border border-slate-300 rounded p-1"
                                />
                                <span>/</span>
                                <input
                                  type="number"
                                  value={editingCourse.totalSeats}
                                  onChange={(e) =>
                                    setEditingCourse({ ...editingCourse, totalSeats: parseInt(e.target.value) || 0 })
                                  }
                                  className="w-14 text-xs font-bold border border-slate-300 rounded p-1"
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
                              className="cursor-pointer text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateCourse(editingCourse);
                                setEditingCourse(null);
                              }}
                              className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Changes
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingCourse({ ...course })}
                            className="cursor-pointer text-xs font-bold text-[#08245F] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
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

          {/* TAB 4: FLIGHT BATCHES */}
          {activeTab === 'batches' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Airfield Flight Batches & Capacity
                  </h2>
                  <p className="text-xs text-slate-500">
                    Schedule upcoming cohorts, set seat quotas, and manage pilot availability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(true)}
                  className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#16357d] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  Schedule New Batch
                </button>
              </div>

              {/* Add New Batch Modal */}
              {showAddBatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-[#08245F] uppercase">Schedule New Flight Batch</h3>
                        <p className="text-xs text-slate-500">Create a new training cohort linked to central database.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddBatchModal(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
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
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Batch Title *</label>
                        <input
                          type="text"
                          required
                          value={newBatchForm.name}
                          onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                          placeholder="e.g. Small RPC Weekday Cohort #15"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Schedule Type</label>
                          <select
                            value={newBatchForm.type}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, type: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
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
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Start Date *</label>
                          <input
                            type="text"
                            required
                            value={newBatchForm.startDate}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, startDate: e.target.value })}
                            placeholder="e.g. 14 Apr 2026"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">End Date</label>
                          <input
                            type="text"
                            value={newBatchForm.endDate}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, endDate: e.target.value })}
                            placeholder="e.g. 18 Apr 2026"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
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
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Seats Left</label>
                          <input
                            type="number"
                            min={0}
                            value={newBatchForm.seatsLeft}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, seatsLeft: parseInt(e.target.value) || 0 })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">Status</label>
                          <select
                            value={newBatchForm.status}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, status: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
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
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Publish Batch</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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

          {/* TAB 5: NEWS & ANNOUNCEMENTS */}
          {activeTab === 'news' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
                    RPTO News & Notice Board
                  </h2>
                  <p className="text-xs text-slate-500">
                    Publish official announcements, DGCA regulatory circulars, and placement updates to public website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddNews(true)}
                  className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#16357d] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  New Announcement
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
                      className="text-slate-400 hover:text-slate-600 p-1"
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
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select
                        value={newAnnouncement.category}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                        className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-bold"
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
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="text-xs font-bold text-slate-500 px-3 py-1.5 hover:text-slate-700 cursor-pointer"
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
                      }}
                      className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      Publish
                    </button>
                  </div>
                </div>
              )}

              {/* News List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
                {news.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#08245F] border border-blue-200">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      {item.summary && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.summary}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete announcement "${item.title}"?`)) {
                          deleteNewsItem(item.id);
                        }
                      }}
                      className="cursor-pointer p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-3"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. GOOGLE SHEETS & EMAIL INTEGRATION TAB */}
          {activeTab === 'integrations' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Automated Pipeline
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Direct Email & Live Cloud Spreadsheet
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#08245F] tracking-tight uppercase">
                    Google Sheets & Admissions Email Integration
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Whenever any candidate submits an enrollment or enquiry, it automatically forwards to Google Sheets and dispatches to dronetech@sece.ac.in.
                  </p>
                </div>
              </div>

              {/* CARD 1: OFFICIAL EMAIL RECIPIENT */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-[#087FE5] border border-blue-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                        Official Admissions Destination
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#08245F]">
                        dronetech@sece.ac.in
                      </h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Configured</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  All candidate enrollment forms across the website (DGCA Courses, Technical Internships, Contact Desk, and Solar/Wind Audits) are formatted and addressed directly to <strong className="text-slate-900">dronetech@sece.ac.in</strong>. Applicants are also given a one-click mail client button to dispatch their application directly from their personal email inbox.
                </p>
              </div>

              {/* CARD 2: GOOGLE SHEETS LIVE HOOK */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-[#08245F]">
                        Google Sheets Webhook URL
                      </h3>
                      <p className="text-xs text-slate-500">
                        Paste your Google Sheet Webhook or Google Apps Script Web App URL below or in <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded font-mono">src/config/integrations.ts</code>.
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    sheetsConfigured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {sheetsConfigured ? '🟢 Connected' : '⚪ Waiting for Sheet URL'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Google Apps Script Web App / Webhook Endpoint
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec (or SheetDB/sheet.best URL)"
                      value={sheetsUrlInput}
                      onChange={(e) => setSheetsUrlInput(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#087FE5] outline-none font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveGoogleSheetsUrl(false)}
                        disabled={isSavingSheetsUrl}
                        className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#0057B8] px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingSheetsUrl ? 'Saving...' : 'Save URL'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveGoogleSheetsUrl(true)}
                        disabled={isTestingSync || !sheetsUrlInput.trim()}
                        className="cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isTestingSync ? 'Sending...' : 'Test Row Sync'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Test Result Message */}
                {testSyncResult && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testSyncResult.synced
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Sync Test Response:</p>
                      <p className="font-mono text-[11px] mt-0.5">{testSyncResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: 1-MINUTE GOOGLE APPS SCRIPT SETUP GUIDE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#FFB800]" />
                    <h3 className="text-xs sm:text-sm font-black text-[#08245F] uppercase tracking-wide">
                      60-Second Google Apps Script Setup (Copy &amp; Paste)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = `function doPost(e) {\\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\\n  if (sheet.getLastRow() === 0) {\\n    sheet.appendRow(["Time", "Ref ID", "Name", "Phone", "Email", "Course", "Batch", "Message", "Status", "Target Email"]);\\n  }\\n  var data = JSON.parse(e.postData.contents);\\n  sheet.appendRow([new Date(), data.id, data.fullName, data.phone, data.email, data.courseName, data.preferredBatch, data.message, data.status, "dronetech@sece.ac.in"]);\\n  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);\\n}`;
                      navigator.clipboard.writeText(scriptText);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                      showToast('Google Apps Script copied to clipboard!', 'success');
                    }}
                    className="cursor-pointer text-xs font-bold text-[#08245F] hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Script Code'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                    <li>Create your Google Sheet at <strong>sheets.new</strong>.</li>
                    <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
                    <li>Paste the code snippet into the editor.</li>
                    <li>Click <strong>Deploy &gt; New deployment</strong> &gt; Select type: <strong>Web App</strong>.</li>
                    <li>Set <em>Execute as: "Me"</em> and <em>Who has access: "Anyone"</em>.</li>
                    <li>Copy the generated <strong>Web app URL</strong> and paste it into the box above (or in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">src/config/integrations.ts</code>)!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FACTORY RESET CONFIRMATION MODAL */}
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
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
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
                className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

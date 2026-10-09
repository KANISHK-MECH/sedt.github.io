import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TabType, Course, Batch, NewsItem, Enquiry } from '../types';
import { INITIAL_COURSES, INITIAL_BATCHES, INITIAL_NEWS, INITIAL_ENQUIRIES } from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Data
  courses: Course[];
  batches: Batch[];
  news: NewsItem[];
  enquiries: Enquiry[];
  
  // Database status
  dbStatus: 'connected' | 'syncing' | 'offline';
  lastDbSync: string | null;
  refreshDatabase: () => Promise<void>;
  
  // Data actions
  updateCourse: (updated: Course) => Promise<void>;
  updateBatch: (updated: Batch) => Promise<void>;
  addBatch: (batch: Omit<Batch, 'id'>) => Promise<void>;
  updateNews: (updated: NewsItem[]) => Promise<void>;
  addNewsItem: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  deleteNewsItem: (id: string) => Promise<void>;
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; enquiry?: Enquiry; googleSheetsSynced?: boolean; recipientEmail?: string }>;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], notes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  resetAllDataToDefaults: () => Promise<void>;

  // Modal states
  isEnrollOpen: boolean;
  enrollCourseId: string | null;
  openEnrollModal: (courseId?: string) => void;
  closeEnrollModal: () => void;

  isDetailsOpen: boolean;
  selectedCourseForDetails: Course | null;
  openDetailsModal: (course: Course) => void;
  closeDetailsModal: () => void;

  isBrochureOpen: boolean;
  openBrochureModal: () => void;
  closeBrochureModal: () => void;

  isSolarBookingOpen: boolean;
  openSolarBookingModal: () => void;
  closeSolarBookingModal: () => void;

  isTourOpen: boolean;
  openTourModal: () => void;
  closeTourModal: () => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  lightboxData: { isOpen: boolean; image: string; title: string; desc?: string };
  openLightbox: (image: string, title: string, desc?: string) => void;
  closeLightbox: () => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'sri_eshwar_courses_v3',
  BATCHES: 'sri_eshwar_batches_v2',
  NEWS: 'sri_eshwar_news_v2',
  ENQUIRIES: 'sri_eshwar_enquiries_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Persistence loaded state
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      const list = saved ? JSON.parse(saved) : INITIAL_COURSES;
      return list.map((c: Course) => {
        if (c.id === 'small-rpc' || c.id === 'small-upgrade') {
          return { ...c, image: '/images/small class drone.webp' };
        }
        if (c.id === 'medium-rpc' || c.id === 'medium-upgrade') {
          return { ...c, image: '/images/medium class drone.webp' };
        }
        if (c.id === 'combo-package') {
          return { ...c, image: '/images/small-medium-class.webp' };
        }
        return c;
      });
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
      return saved ? JSON.parse(saved) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  // DB Connection & Sync state
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [lastDbSync, setLastDbSync] = useState<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const prevEnquiryCountRef = useRef<number>(enquiries.length);

  // Modal States
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState<string | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isSolarBookingOpen, setIsSolarBookingOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; image: string; title: string; desc?: string }>({
    isOpen: false,
    image: '',
    title: '',
    desc: ''
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync to local storage as client backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error('Local storage backup error:', e);
    }
  }, [courses, batches, news, enquiries]);

  // Sync from Server Database
  const refreshDatabase = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!isSilent) setDbStatus('syncing');

    try {
      const response = await fetch('/api/data', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.courses && Array.isArray(data.courses)) {
          const mapped = data.courses.map((c: Course) => {
            if (c.id === 'small-rpc' || c.id === 'small-upgrade') {
              return { ...c, image: '/images/small class drone.webp' };
            }
            if (c.id === 'medium-rpc' || c.id === 'medium-upgrade') {
              return { ...c, image: '/images/medium class drone.webp' };
            }
            if (c.id === 'combo-package') {
              return { ...c, image: '/images/small-medium-class.webp' };
            }
            return c;
          });
          setCourses(mapped);
        }
        if (data.batches && Array.isArray(data.batches)) setBatches(data.batches);
        if (data.news && Array.isArray(data.news)) setNews(data.news);
        if (data.enquiries && Array.isArray(data.enquiries)) {
          // If we detect a new enquiry from website, notify if count grew
          if (data.enquiries.length > prevEnquiryCountRef.current && prevEnquiryCountRef.current > 0) {
            const latest = data.enquiries[0];
            showToast(`New Candidate Registration: ${latest.fullName} for ${latest.courseName}`, 'info');
          }
          prevEnquiryCountRef.current = data.enquiries.length;
          setEnquiries(data.enquiries);
        }
        setDbStatus('connected');
        setLastDbSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setDbStatus('offline');
      }
    } catch (err) {
      console.warn('Backend database sync warning (running local mode):', err);
      setDbStatus('offline');
    } finally {
      isFetchingRef.current = false;
    }
  }, [showToast]);

  // Initial sync & recurring polling (every 4 seconds) to keep website & admin panel in sync
  useEffect(() => {
    refreshDatabase(false);

    const interval = setInterval(() => {
      refreshDatabase(true);
    }, 4000);

    const handleFocus = () => {
      refreshDatabase(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshDatabase]);

  // -------------------------------------------------------------
  // MUTATION ACTIONS WITH DATABASE PERSISTENCE
  // -------------------------------------------------------------

  // Update Course in Database
  const updateCourse = async (updated: Course) => {
    // Optimistic local update
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`Updated course: ${updated.name}`);

    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to update course on server DB:', err);
    }
  };

  // Update Batch in Database
  const updateBatch = async (updated: Batch) => {
    // Optimistic local update
    setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
    showToast(`Updated batch: ${updated.name}`);

    try {
      const res = await fetch(`/api/batches/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to update batch on server DB:', err);
    }
  };

  // Add new Batch to Database
  const addBatch = async (batchData: Omit<Batch, 'id'>) => {
    const tempId = `batch-${Date.now()}`;
    const newBatch: Batch = { id: tempId, ...batchData };
    setBatches(prev => [...prev, newBatch]);
    showToast(`Added new batch: ${batchData.name}`);

    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.batch) {
          setBatches(prev => prev.map(b => b.id === tempId ? json.batch : b));
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to add batch to server DB:', err);
    }
  };

  // Update Announcements in Database
  const updateNews = async (updatedList: NewsItem[]) => {
    setNews(updatedList);
    showToast('News & Announcements updated');
  };

  const addNewsItem = async (itemData: Omit<NewsItem, 'id'>) => {
    const tempId = `news-${Date.now()}`;
    const newItem: NewsItem = { id: tempId, ...itemData };
    setNews(prev => [newItem, ...prev]);
    showToast(`Published: ${itemData.title}`);

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.news) {
          setNews(prev => prev.map(n => n.id === tempId ? json.news : n));
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to add news to server DB:', err);
    }
  };

  const deleteNewsItem = async (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
    showToast('Announcement removed');

    try {
      await fetch(`/api/news/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setDbStatus('connected');
    } catch (err) {
      console.error('Failed to delete news from server DB:', err);
    }
  };

  // Add Enquiry from Public Website Form into Database & Google Sheets
  const addEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; enquiry?: Enquiry; googleSheetsSynced?: boolean; recipientEmail?: string }> => {
    const tempEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'New',
      notes: 'Submitted via official website portal'
    };

    // Optimistic state update
    setEnquiries(prev => [tempEnquiry, ...prev]);
    prevEnquiryCountRef.current += 1;
    showToast('Enquiry sent directly to dronetech@sece.ac.in & recorded!', 'success');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.enquiry) {
          setEnquiries(prev => prev.map(e => e.id === tempEnquiry.id ? json.enquiry : e));
          return {
            success: true,
            enquiry: json.enquiry,
            googleSheetsSynced: json.googleSheetsSynced,
            recipientEmail: json.recipientEmail || 'dronetech@sece.ac.in'
          };
        }
        setDbStatus('connected');
        return {
          success: true,
          enquiry: tempEnquiry,
          googleSheetsSynced: json.googleSheetsSynced,
          recipientEmail: json.recipientEmail || 'dronetech@sece.ac.in'
        };
      }
    } catch (err) {
      console.error('Failed to save enquiry to server DB:', err);
    }

    return {
      success: true,
      enquiry: tempEnquiry,
      googleSheetsSynced: false,
      recipientEmail: 'dronetech@sece.ac.in'
    };
  };

  // Update Enquiry Status in Database (from Admin Panel)
  const updateEnquiryStatus = async (id: string, status: Enquiry['status'], notes?: string) => {
    // Optimistic update
    setEnquiries(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          notes: notes !== undefined ? notes : e.notes
        };
      }
      return e;
    }));
    showToast(`Candidate status updated to: ${status}`);

    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to update enquiry status in server DB:', err);
    }
  };

  // Delete Enquiry from Database (from Admin Panel)
  const deleteEnquiry = async (id: string) => {
    // Optimistic update
    setEnquiries(prev => prev.filter(e => e.id !== id));
    prevEnquiryCountRef.current = Math.max(0, prevEnquiryCountRef.current - 1);
    showToast('Candidate application removed from database', 'info');

    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to delete enquiry from server DB:', err);
    }
  };

  // Reset entire database to factory defaults
  const resetAllDataToDefaults = async () => {
    setCourses(INITIAL_COURSES);
    setBatches(INITIAL_BATCHES);
    setNews(INITIAL_NEWS);
    setEnquiries(INITIAL_ENQUIRIES);
    prevEnquiryCountRef.current = INITIAL_ENQUIRIES.length;

    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);

    showToast('Database reset to factory default state', 'info');

    try {
      await fetch('/api/reset', { method: 'POST' });
      setDbStatus('connected');
    } catch (err) {
      console.error('Failed to reset server DB:', err);
    }
  };

  // Modal open/close handlers
  const openEnrollModal = (courseId?: string) => {
    setEnrollCourseId(courseId || null);
    setIsEnrollOpen(true);
  };
  const closeEnrollModal = () => {
    setIsEnrollOpen(false);
    setEnrollCourseId(null);
  };

  const openDetailsModal = (course: Course) => {
    setSelectedCourseForDetails(course);
    setIsDetailsOpen(true);
  };
  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedCourseForDetails(null);
  };

  const openBrochureModal = () => setIsBrochureOpen(true);
  const closeBrochureModal = () => setIsBrochureOpen(false);

  const openSolarBookingModal = () => setIsSolarBookingOpen(true);
  const closeSolarBookingModal = () => setIsSolarBookingOpen(false);

  const openTourModal = () => setIsTourOpen(true);
  const closeTourModal = () => setIsTourOpen(false);

  const openLightbox = (image: string, title: string, desc?: string) => {
    setLightboxData({ isOpen: true, image, title, desc });
  };
  const closeLightbox = () => {
    setLightboxData({ isOpen: false, image: '', title: '', desc: '' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        courses,
        batches,
        news,
        enquiries,
        dbStatus,
        lastDbSync,
        refreshDatabase,
        updateCourse,
        updateBatch,
        addBatch,
        updateNews,
        addNewsItem,
        deleteNewsItem,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetAllDataToDefaults,
        isEnrollOpen,
        enrollCourseId,
        openEnrollModal,
        closeEnrollModal,
        isDetailsOpen,
        selectedCourseForDetails,
        openDetailsModal,
        closeDetailsModal,
        isBrochureOpen,
        openBrochureModal,
        closeBrochureModal,
        isSolarBookingOpen,
        openSolarBookingModal,
        closeSolarBookingModal,
        isTourOpen,
        openTourModal,
        closeTourModal,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        lightboxData,
        openLightbox,
        closeLightbox,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

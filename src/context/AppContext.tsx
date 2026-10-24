import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TabType, Course, Batch, NewsItem, Enquiry, GalleryItem, RpcHolder } from '../types';
import { INITIAL_COURSES, INITIAL_BATCHES, INITIAL_NEWS, INITIAL_ENQUIRIES, INITIAL_GALLERY } from '../data/mockData';
import { INITIAL_RPC_HOLDERS } from '../data/rpcHoldersData';

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
  gallery: GalleryItem[];
  rpcHolders: RpcHolder[];
  
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
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  addRpcHolder: (holder: Omit<RpcHolder, 'id'>) => Promise<void>;
  updateRpcHolder: (holder: RpcHolder) => Promise<void>;
  deleteRpcHolder: (id: string) => Promise<void>;
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; enquiry?: Enquiry }>;
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

  isWindBookingOpen: boolean;
  openWindBookingModal: () => void;
  closeWindBookingModal: () => void;

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
  ENQUIRIES: 'sri_eshwar_enquiries_v2',
  GALLERY: 'sri_eshwar_gallery_v2',
  RPC_HOLDERS: 'sri_eshwar_rpc_holders_v1'
};

const isCurrentRouteAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
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

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
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

  const [rpcHolders, setRpcHolders] = useState<RpcHolder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RPC_HOLDERS);
      return saved ? JSON.parse(saved) : INITIAL_RPC_HOLDERS;
    } catch {
      return INITIAL_RPC_HOLDERS;
    }
  });

  // DB Connection & Sync state
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [lastDbSync, setLastDbSync] = useState<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const isFirstFetchRef = useRef<boolean>(true);
  const prevEnquiryCountRef = useRef<number>(enquiries.length);
  const deletedGalleryIdsRef = useRef<Set<string>>(new Set());
  const deletedRpcIdsRef = useRef<Set<string>>(new Set());

  // Modal States
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState<string | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isSolarBookingOpen, setIsSolarBookingOpen] = useState(false);
  const [isWindBookingOpen, setIsWindBookingOpen] = useState(false);
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
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
      localStorage.setItem(STORAGE_KEYS.RPC_HOLDERS, JSON.stringify(rpcHolders));
    } catch (e) {
      console.error('Local storage backup error:', e);
    }
  }, [courses, batches, news, enquiries, gallery, rpcHolders]);

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
        if (data.gallery && Array.isArray(data.gallery)) {
          // Never resurrect photos currently marked as deleted
          const filteredGallery = data.gallery.filter((g: GalleryItem) => !deletedGalleryIdsRef.current.has(g.id));
          setGallery(filteredGallery);
        }
        if (data.rpcHolders && Array.isArray(data.rpcHolders)) {
          const filteredRpc = data.rpcHolders.filter((r: RpcHolder) => !deletedRpcIdsRef.current.has(r.id));
          setRpcHolders(filteredRpc);
        }
        if (data.enquiries && Array.isArray(data.enquiries)) {
          // If we detect a new enquiry from website, notify ONLY when active on the admin panel (never on public website / mobile)
          if (
            isCurrentRouteAdmin() &&
            !isFirstFetchRef.current &&
            data.enquiries.length > prevEnquiryCountRef.current &&
            prevEnquiryCountRef.current > 0
          ) {
            const latest = data.enquiries[0];
            showToast(`New Candidate Registration: ${latest.fullName} for ${latest.courseName}`, 'info');
          }
          isFirstFetchRef.current = false;
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

  // Add Gallery Photo (from Admin Panel)
  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id'>) => {
    const tempId = `gallery-${Date.now()}`;
    const newItem: GalleryItem = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...itemData
    };
    setGallery(prev => [newItem, ...prev]);
    showToast(`Added photo to gallery: ${itemData.name}`);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemData, id: tempId })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.gallery && Array.isArray(json.gallery)) {
          setGallery(json.gallery);
          try {
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(json.gallery));
          } catch {}
        } else if (json.item) {
          setGallery(prev => prev.map(g => g.id === tempId ? json.item : g));
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to add photo to server DB:', err);
    }
  };

  // Update Gallery Photo
  const updateGalleryItem = async (updated: GalleryItem) => {
    setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
    showToast(`Updated photo: ${updated.name}`);

    try {
      const res = await fetch(`/api/gallery/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.gallery && Array.isArray(json.gallery)) {
          setGallery(json.gallery);
          try {
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(json.gallery));
          } catch {}
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to update photo on server DB:', err);
    }
  };

  // Delete Gallery Photo
  const deleteGalleryItem = async (id: string) => {
    const toDelete = gallery.find(g => g.id === id);
    // Mark ID as pending deletion so background polling never restores it
    deletedGalleryIdsRef.current.add(id);

    setGallery(prev => prev.filter(g => g.id !== id));
    showToast(`Removed photo: ${toDelete?.name || 'Photo'}`, 'info');

    try {
      const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        if (json.gallery && Array.isArray(json.gallery)) {
          setGallery(json.gallery);
          try {
            localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(json.gallery));
          } catch {}
        }
        setDbStatus('connected');
        // Retain for 12 seconds to guarantee any in-flight /api/data requests won't resurrect this item
        setTimeout(() => {
          deletedGalleryIdsRef.current.delete(id);
        }, 12000);
      } else {
        deletedGalleryIdsRef.current.delete(id);
        showToast('Failed to delete photo from server database', 'error');
      }
    } catch (err) {
      console.error('Failed to delete photo from server DB:', err);
      deletedGalleryIdsRef.current.delete(id);
    }
  };

  // Add RPC Holder
  const addRpcHolder = async (holderData: Omit<RpcHolder, 'id'>) => {
    let year = holderData.issueYear;
    if (!year && holderData.serialNo) {
      const m = holderData.serialNo.match(/202[0-9]/);
      year = m ? m[0] : '2026';
    }
    const tempHolder: RpcHolder = {
      ...holderData,
      id: `rpc-${Date.now().toString().slice(-6)}`,
      serialNo: holderData.serialNo.trim(),
      certificateNo: holderData.certificateNo.trim(),
      rpcNo: holderData.rpcNo.trim(),
      name: holderData.name.trim().toUpperCase(),
      issueYear: year,
      category: holderData.category || 'Small Category (Multirotor)',
      status: holderData.status || 'Verified'
    };

    setRpcHolders(prev => [tempHolder, ...prev]);
    showToast(`Added RPC Holder: ${tempHolder.name}`);

    try {
      const res = await fetch('/api/rpc-holders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holderData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.item) {
          setRpcHolders(prev => prev.map(h => h.id === tempHolder.id ? json.item : h));
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to add RPC holder to server DB:', err);
    }
  };

  // Update RPC Holder
  const updateRpcHolder = async (updated: RpcHolder) => {
    setRpcHolders(prev => prev.map(h => h.id === updated.id ? updated : h));
    showToast(`Updated RPC record: ${updated.name}`);

    try {
      const res = await fetch(`/api/rpc-holders/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.rpcHolders && Array.isArray(json.rpcHolders)) {
          setRpcHolders(json.rpcHolders);
          try {
            localStorage.setItem(STORAGE_KEYS.RPC_HOLDERS, JSON.stringify(json.rpcHolders));
          } catch {}
        }
        setDbStatus('connected');
      }
    } catch (err) {
      console.error('Failed to update RPC holder on server DB:', err);
    }
  };

  // Delete RPC Holder
  const deleteRpcHolder = async (id: string) => {
    const toDelete = rpcHolders.find(h => h.id === id);
    deletedRpcIdsRef.current.add(id);

    setRpcHolders(prev => prev.filter(h => h.id !== id));
    showToast(`Removed RPC Record: ${toDelete?.name || 'Pilot'}`, 'info');

    try {
      const res = await fetch(`/api/rpc-holders/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        if (json.rpcHolders && Array.isArray(json.rpcHolders)) {
          setRpcHolders(json.rpcHolders);
          try {
            localStorage.setItem(STORAGE_KEYS.RPC_HOLDERS, JSON.stringify(json.rpcHolders));
          } catch {}
        }
        setDbStatus('connected');
        setTimeout(() => {
          deletedRpcIdsRef.current.delete(id);
        }, 12000);
      } else {
        deletedRpcIdsRef.current.delete(id);
        showToast('Failed to delete RPC record from server database', 'error');
      }
    } catch (err) {
      console.error('Failed to delete RPC holder from server DB:', err);
      deletedRpcIdsRef.current.delete(id);
    }
  };

  // Add Enquiry from Public Website Form into Database
  const addEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; enquiry?: Enquiry }> => {
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
    if (isCurrentRouteAdmin()) {
      showToast('Enquiry received & synced to central database!', 'success');
    }

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
          return { success: true, enquiry: json.enquiry };
        }
        setDbStatus('connected');
        return { success: true, enquiry: tempEnquiry };
      }
    } catch (err) {
      console.error('Failed to save enquiry to server DB:', err);
    }

    return { success: true, enquiry: tempEnquiry };
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
    setGallery(INITIAL_GALLERY);
    setRpcHolders(INITIAL_RPC_HOLDERS);
    prevEnquiryCountRef.current = INITIAL_ENQUIRIES.length;

    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.RPC_HOLDERS);

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

  const openWindBookingModal = () => setIsWindBookingOpen(true);
  const closeWindBookingModal = () => setIsWindBookingOpen(false);

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
        gallery,
        dbStatus,
        lastDbSync,
        refreshDatabase,
        updateCourse,
        updateBatch,
        addBatch,
        updateNews,
        addNewsItem,
        deleteNewsItem,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        rpcHolders,
        addRpcHolder,
        updateRpcHolder,
        deleteRpcHolder,
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
        isWindBookingOpen,
        openWindBookingModal,
        closeWindBookingModal,
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

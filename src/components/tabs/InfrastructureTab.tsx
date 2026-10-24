import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ZoomIn,
  Camera,
  Search,
  X,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Wrench,
  Building2,
  Images,
  CheckCircle2
} from 'lucide-react';
import { GalleryItem } from '../../types';

export const InfrastructureTab: React.FC = () => {
  const { gallery, openLightbox } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za'>('default');

  // Category definitions with icons and descriptions
  const categories = [
    { id: 'all', label: 'All Photos', icon: Images, desc: 'Complete visual archive' },
    { id: 'training', label: 'Training', icon: GraduationCap, desc: 'Flight simulators & ground classes' },
    { id: 'events', label: 'Events', icon: Sparkles, desc: 'Convocations, airshows & expos' },
    { id: 'industrial', label: 'Industrial', icon: Wrench, desc: 'Inspection, assembly & avionics labs' },
    { id: 'facilities', label: 'Facilities', icon: Building2, desc: 'Airfield, turf & campus infrastructure' }
  ];

  // Helper to determine category of any item (with fallback)
  const getItemCategory = (item: GalleryItem): 'Training' | 'Events' | 'Industrial' | 'Facilities' => {
    if (item.category) {
      const c = item.category.trim().toLowerCase();
      if (c === 'training') return 'Training';
      if (c === 'events' || c === 'event') return 'Events';
      if (c === 'industrial') return 'Industrial';
      if (c === 'facilities' || c === 'facility' || c === 'campus') return 'Facilities';
    }
    const text = `${item.name} ${item.subtitle || ''} ${item.description || ''} ${item.stats || ''}`.toLowerCase();
    if (text.includes('event') || text.includes('ceremony') || text.includes('expo') || text.includes('convocation') || text.includes('wings')) {
      return 'Events';
    }
    if (text.includes('simulator') || text.includes('ground class') || text.includes('theory') || text.includes('flight ops') || text.includes('pilot')) {
      return 'Training';
    }
    if (text.includes('station') || text.includes('assembly') || text.includes('avionics') || text.includes('solar') || text.includes('inspection') || text.includes('diagnostics') || text.includes('library')) {
      return 'Industrial';
    }
    return 'Facilities';
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: gallery.length,
      training: 0,
      events: 0,
      industrial: 0,
      facilities: 0
    };
    gallery.forEach((item) => {
      const cat = getItemCategory(item).toLowerCase();
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, [gallery]);

  // Filter & sort gallery items
  const filteredGallery = useMemo(() => {
    let list = gallery.filter((item: GalleryItem) => {
      // Category match
      if (selectedCategory !== 'all') {
        const itemCat = getItemCategory(item).toLowerCase();
        if (itemCat !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchTarget = `${item.name} ${item.subtitle || ''} ${item.description || ''} ${item.stats || ''} ${item.category || ''}`.toLowerCase();
        if (!searchTarget.includes(q)) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === 'az') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [gallery, selectedCategory, searchQuery, sortBy]);

  // Badge styling per category
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Training':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'Events':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
      case 'Industrial':
        return 'bg-blue-950/80 text-cyan-300 border-cyan-500/30';
      case 'Facilities':
      default:
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-4 sm:space-y-5 lg:space-y-6 min-h-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CFEAFF] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F4FAFF] text-[#08245F] border border-[#CFEAFF] flex items-center gap-1.5 shadow-2xs">
                <Camera className="w-3 h-3 text-[#FFB800]" />
                Visual Campus & Flight Operations
              </span>
              <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                Sri Eshwar Drone Tech RPTO · Kinathukadavu
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] mt-1 tracking-tight uppercase"
              style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
            >
              Campus & Drone Tech Gallery
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-[#08245F]">
              {gallery.length} Photos in Database
            </span>
          </div>
        </div>

        {/* Gallery Overview Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs hover:border-[#38BDF8] transition-colors">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">15+ Acres</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">DGCA Airfield Turf</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs hover:border-[#38BDF8] transition-colors">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">Multi-Storey</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">RPTO Headquarters</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs hover:border-[#38BDF8] transition-colors">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">12 Simulators</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">PX4 Digital Flight Lab</p>
          </div>
          <div className="bg-white border border-[#CFEAFF] rounded-xl p-2.5 shadow-2xs hover:border-[#38BDF8] transition-colors">
            <span className="text-sm 2xl:text-base font-black text-[#08245F]">2 Drone Stations</span>
            <p className="text-[10px] 2xl:text-xs font-semibold text-slate-500">Assembly & Avionics Bays</p>
          </div>
        </div>

        {/* Filter Controls Bar: Category Buttons + Search + Sort */}
        <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                      isSelected
                        ? 'bg-[#08245F] text-white shadow-xs ring-2 ring-[#08245F]/20'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-[#08245F] hover:border-sky-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:shrink-0">
              {/* Search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="default">Default Order</option>
                  <option value="az">Title A to Z</option>
                  <option value="za">Title Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Summary if filtered */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-medium">
                Showing <strong className="text-[#08245F]">{filteredGallery.length}</strong> of {gallery.length} photos
                {selectedCategory !== 'all' && (
                  <> in <span className="font-bold text-[#08245F] capitalize">"{selectedCategory}"</span></>
                )}
                {searchQuery && (
                  <> matching <span className="font-bold text-[#08245F]">"{searchQuery}"</span></>
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="cursor-pointer text-[11px] font-bold text-blue-600 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 2xl:gap-4 flex-1 min-h-0">
          {filteredGallery.map((facility) => {
            const categoryName = getItemCategory(facility);
            return (
              <div
                key={facility.id}
                className="bg-white border border-[#CFEAFF] rounded-2xl p-3 sm:p-3.5 2xl:p-4 shadow-sm hover:shadow-md hover:border-[#8CCCF5] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* Photo Banner with Clickable Lightbox - Locked 16:9 aspect ratio */}
                  <div
                    onClick={() => openLightbox(facility.image, facility.name, facility.description)}
                    className="cursor-pointer relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200"
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    <img
                      src={facility.image}
                      alt={facility.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ aspectRatio: '16 / 9' }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = '1';
                          target.src = '/images/airfield.webp';
                        } else {
                          target.onerror = null;
                          target.src = '/images/drone-infra-building.webp';
                        }
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5 text-[#FFB800]" />
                        View Full HD
                      </span>
                    </div>

                    {/* Category Pill Tag (Top Left) */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span
                        className={`text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase backdrop-blur-xs shadow-2xs ${getCategoryBadgeClass(
                          categoryName
                        )}`}
                      >
                        {categoryName}
                      </span>
                    </div>

                    {/* Stats Badge Tag (Bottom Right) */}
                    {facility.stats && (
                      <div className="absolute bottom-2 right-2 bg-[#071D4A]/90 text-[#FFB800] text-[9px] 2xl:text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-white/10 uppercase backdrop-blur-xs">
                        {facility.stats}
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle & Description */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#08245F] line-clamp-1 group-hover:text-[#087FE5] transition-colors">
                      {facility.name}
                    </h3>
                    {facility.subtitle && (
                      <p className="text-[10px] 2xl:text-xs font-bold text-[#d71920] mt-0.5 truncate">
                        {facility.subtitle}
                      </p>
                    )}
                    {facility.description && (
                      <p className="text-[11px] 2xl:text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                        {facility.description}
                      </p>
                    )}
                  </div>

                  {/* Optional Bullet highlights */}
                  {facility.highlights && facility.highlights.length > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 2xl:p-2.5 space-y-1">
                      {facility.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] 2xl:text-xs text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGallery.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-[#CFEAFF] p-8 sm:p-12 text-center space-y-3 my-6">
            <Camera className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-700">No photos match your current filter</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Try selecting "All Photos" or clearing your search term to see other photos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] transition-colors"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

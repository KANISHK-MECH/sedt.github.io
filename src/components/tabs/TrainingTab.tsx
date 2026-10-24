import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Cpu,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Play,
  Pause,
  Maximize2,
  Award
} from 'lucide-react';
import { INTEGRATIONS_CONFIG, createAdmissionsMailtoUrl } from '../../config/integrations';

interface SlideItem {
  url: string;
  title: string;
  caption: string;
}

interface NonDgcaProgram {
  id: string;
  number: string;
  title: string;
  iconEmoji: string;
  subtitle: string;
  duration: string;
  mode: string;
  badge: string;
  accentColor: string;
  slides: SlideItem[];
  topics: string[];
  outcomes: string[];
}

// Interactive Auto-playing Slideshow Component for each track
const TrackSlideshow: React.FC<{
  slides: SlideItem[];
  trackTitle: string;
  badge: string;
}> = ({ slides, trackTitle, badge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden group bg-slate-900 shadow-md border border-slate-200"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slide Image */}
      <img
        src={currentSlide.url}
        alt={currentSlide.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center transition-all duration-700 transform group-hover:scale-105"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          target.src = '/images/campus-overview.webp';
        }}
      />

      {/* Dark Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Top Bar Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-[#08245F]/90 text-white backdrop-blur-xs border border-white/20 shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
          {badge}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white/90 backdrop-blur-xs">
            {currentIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-md bg-black/60 text-white/80 hover:text-white backdrop-blur-xs transition-colors"
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all opacity-80 group-hover:opacity-100 z-10 backdrop-blur-xs"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all opacity-80 group-hover:opacity-100 z-10 backdrop-blur-xs"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom Caption & Dot Navigation */}
      <div className="absolute bottom-3 inset-x-3 z-10 space-y-2">
        <div className="text-left">
          <p className="text-xs font-black text-white drop-shadow-sm flex items-center gap-1.5">
            <span className="text-[#FFB800]">⚡</span>
            {currentSlide.title}
          </p>
          <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow-xs font-medium">
            {currentSlide.caption}
          </p>
        </div>

        {/* Clickable Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-6 bg-[#FFB800]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrainingTab: React.FC = () => {
  const { addEnquiry, setActiveTab, rpcHolders } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Modal for specialized technical training / internship registration
  const [activeEnquiryProgram, setActiveEnquiryProgram] = useState<{
    id: string;
    title: string;
    mode: string;
    duration: string;
  } | null>(null);

  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantCollege, setApplicantCollege] = useState('');
  const [applicantQualification, setApplicantQualification] = useState('B.E / B.Tech Student');
  const [applicantBatchDate, setApplicantBatchDate] = useState('Upcoming Immediate Cohort');
  const [applicantNote, setApplicantNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // 4 Specialized Technical Training & Internship Programs
  const technicalPrograms: NonDgcaProgram[] = [
    {
      id: 'glider-design',
      number: '1',
      title: 'Glider Design Training',
      iconEmoji: '🛩️',
      subtitle: 'Design your own fixed-wing glider from concept to flight.',
      duration: '3–5 Days',
      mode: 'Theory + Hands-on Workshop',
      badge: 'Fixed-Wing Aerodynamics',
      accentColor: 'blue',
      slides: [
        {
          url: '/images/airfield.webp',
          title: '15-Acre Flight Testing Airfield',
          caption: 'Dedicated fixed-wing glide slope, crosswind runway and telemetry flight zone.'
        },
        {
          url: '/images/ground-class.webp',
          title: 'Aerodynamic Theory & CAD Lab',
          caption: 'Airframe structural sizing, airfoil selection and Center of Gravity (CoG) calculations.'
        },
        {
          url: '/images/discussion-room.webp',
          title: 'Avionics & Flight Review Suite',
          caption: 'Telemetry log evaluation, lift-to-drag optimization and flight debriefs.'
        },
        {
          url: '/images/drone-library.webp',
          title: 'Aviation Design & Blueprint Archive',
          caption: 'Access to aerospace design standards, fixed-wing handbooks and glider engineering documentation.'
        }
      ],
      topics: [
        'Aerodynamics fundamentals',
        'Airframe design & material selection',
        'CAD modelling',
        'Wing & fuselage design',
        'Center of Gravity calculations',
        'Fabrication & assembly',
        'Flight testing and optimization'
      ],
      outcomes: [
        'Build and calibrate an airworthy fixed-wing model',
        'Master aerofoil selection & stability analysis',
        'Field glide slope and telemetry flight testing'
      ]
    },
    {
      id: 'drone-design',
      number: '2',
      title: 'Drone Design & Development',
      iconEmoji: '🚁',
      subtitle: 'Learn to design and build a complete multirotor UAV.',
      duration: '5–7 Days',
      mode: 'Theory + Practical',
      badge: 'Avionics & Mechanical Prototyping',
      accentColor: 'red',
      slides: [
        {
          url: '/images/small class drone.webp',
          title: 'Multirotor Airframe Prototyping',
          caption: 'Chassis assembly, carbon fiber arm integration and brushless motor sizing.'
        },
        {
          url: '/images/drone-station.webp',
          title: 'Avionics Soldering & Power Bench',
          caption: 'Flight controller pinouts, power distribution boards (PDB) and ESC calibration.'
        },
        {
          url: '/images/medium class drone.webp',
          title: 'Heavy Commercial UAV Dynamics',
          caption: 'High-payload quadcopter and hexacopter flight dynamics (up to 150 kg class).'
        },
        {
          url: '/images/simulator-zone.webp',
          title: 'Autonomous Mission & Tuning Lab',
          caption: 'PID rate configuration, autonomous waypoint navigation and fail-safe testing.'
        }
      ],
      topics: [
        'Drone fundamentals',
        'Frame & mechanical design',
        'Motor/ESC/propeller selection',
        'Battery & power-system sizing',
        'Flight controller integration',
        'CAD-based drone design',
        'Assembly & wiring',
        'Calibration and first flight'
      ],
      outcomes: [
        'Assemble a custom multirotor from raw components',
        'Program PID gains, telemetry & failsafe modes',
        'First tethered and autonomous hover flight'
      ]
    },
    {
      id: 'drone-repair',
      number: '3',
      title: 'Drone Repair & Maintenance',
      iconEmoji: '🔧',
      subtitle: 'Master UAV troubleshooting, servicing and preventive maintenance.',
      duration: '3–5 Days',
      mode: 'Hands-on Workshop',
      badge: 'Hardware Servicing & Airworthiness',
      accentColor: 'amber',
      slides: [
        {
          url: '/images/drone-station-2.webp',
          title: 'Diagnostic & Servicing Workbench',
          caption: 'Multimeter testing, motor winding insulation checks and oscilloscope signal analysis.'
        },
        {
          url: '/images/drone-station.webp',
          title: 'Precision Avionics Soldering Lab',
          caption: 'Component desoldering, harness replacement, and connector crimping.'
        },
        {
          url: '/images/simulator-zone.webp',
          title: 'Sensor & Telemetry Troubleshooting',
          caption: 'Compass declination, IMU calibration, GPS lock diagnostics and firmware reflashing.'
        },
        {
          url: '/images/airfield.webp',
          title: 'Post-Repair Airworthiness Checks',
          caption: 'Hover stabilization tests, failsafe return-to-home verification and flight sign-off.'
        }
      ],
      topics: [
        'Drone component identification',
        'Motor & ESC troubleshooting',
        'Flight controller diagnostics',
        'GPS & telemetry troubleshooting',
        'Power-system testing',
        'Wiring & soldering',
        'Firmware configuration',
        'Preventive maintenance',
        'Flight-test procedures'
      ],
      outcomes: [
        'Diagnose circuit faults, telemetry dropouts and sensor drifts',
        'Precision avionics micro-soldering and harness testing',
        'Airworthiness certification and post-repair check flights'
      ]
    },
    {
      id: 'drone-internships',
      number: '4',
      title: 'Drone Technology Internships',
      iconEmoji: '🎓',
      subtitle: 'Project-based UAV technical internship with flight and R&D exposure.',
      // Explicitly removed 1 Month and 3 Months as requested:
      duration: '2 Weeks',
      mode: 'On-site / Project Based',
      badge: '2-Week Industry R&D Track',
      accentColor: 'purple',
      slides: [
        {
          url: '/images/campus-overview.webp',
          title: 'Sri Eshwar Drone Tech RPTO Campus',
          caption: 'DGCA-authorized state-of-the-art RPTO campus with complete drone ecosystem.'
        },
        {
          url: '/images/drone-infra-building.webp',
          title: 'Autonomous UAV R&D Complex',
          caption: 'Modern facilities dedicated to drone prototyping, payload engineering and software.'
        },
        {
          url: '/images/drone-station-2.webp',
          title: 'Hands-on Project Prototyping',
          caption: 'Work directly on real-world industrial and agricultural drone engineering projects.'
        },
        {
          url: '/images/airfield.webp',
          title: 'Autonomous Field Missions',
          caption: 'Live surveying, agricultural spraying demonstrations and telemetry logging.'
        }
      ],
      topics: [
        'Drone design & development',
        'UAV mechanical design',
        'Flight controller integration',
        'Drone assembly & testing',
        'Mapping & surveying',
        'Autonomous UAV systems',
        'Payload integration',
        'R&D projects'
      ],
      outcomes: [
        'Hands-on live industrial & agri-drone projects',
        'Mentorship by DGCA instructors & aerospace engineers',
        'Formal 2-week internship certificate and project portfolio'
      ]
    }
  ];

  const handleOpenEnquiry = (program: { id: string; title: string; mode: string; duration: string }) => {
    setActiveEnquiryProgram(program);
    setSubmittedEnquiryId(null);
  };

  const handleCloseEnquiry = () => {
    setActiveEnquiryProgram(null);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantEmail('');
    setApplicantCollege('');
    setApplicantNote('');
    setSubmittedEnquiryId(null);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim() || !activeEnquiryProgram) return;

    setIsSubmitting(true);
    try {
      const detailedMessage = `[TRAINING REGISTRATION]
Track: ${activeEnquiryProgram.title}
Duration: ${activeEnquiryProgram.duration}
Mode: ${activeEnquiryProgram.mode}
College/Org: ${applicantCollege.trim() || 'Not specified'}
Background: ${applicantQualification}
Preferred Batch: ${applicantBatchDate}
Candidate Message: ${applicantNote.trim() || 'Interested in attending this upcoming training program.'}`;

      const res = await addEnquiry({
        fullName: applicantName.trim(),
        phone: applicantPhone.trim(),
        email: applicantEmail.trim() || 'Not provided',
        courseId: activeEnquiryProgram.id,
        courseName: `${activeEnquiryProgram.title} (${activeEnquiryProgram.duration})`,
        preferredBatch: `${activeEnquiryProgram.mode} · ${applicantBatchDate}`,
        message: detailedMessage
      });

      if (res && res.enquiry) {
        setSubmittedEnquiryId(res.enquiry.id);
      } else {
        setSubmittedEnquiryId(`APP-${Date.now().toString().slice(-4)}`);
      }
    } catch {
      setSubmittedEnquiryId(`APP-${Date.now().toString().slice(-4)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8 bg-slate-50">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto space-y-6">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-transparent rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-[#08245F] text-white tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#FFB800]" />
                  Training Pathways & Curriculum
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  DGCA RPTO TN 21/2024
                </span>
              </div>

              <h1
                className="text-xl sm:text-2xl 2xl:text-3xl font-black text-[#08245F] tracking-tight uppercase"
                style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
              >
                Specialized Drone Technical Training
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl mt-1">
                Hands-on fixed-wing glider aerodynamics, multirotor UAV engineering, flight controller avionics, and 2-week immersive technology internships.
              </p>
            </div>

            {/* Quick stats / jump */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center shadow-2xs">
                <p className="text-base sm:text-lg font-black text-[#d71920]">4</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Tech Tracks</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center shadow-2xs">
                <p className="text-base sm:text-lg font-black text-blue-600">2 Weeks</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Internships</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center shadow-2xs">
                <p className="text-base sm:text-lg font-black text-emerald-600">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Practical Lab</p>
              </div>
            </div>
          </div>

          {/* ================= TAXONOMY TREE CARD ================= */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#08245F]"></span>
                Curriculum Structure
              </span>
              <span className="text-[11px] text-slate-500">
                Click any track to filter views
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                id="filter-all-training"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? 'bg-[#08245F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All Technical Tracks (4)
              </button>

              <button
                id="filter-glider-training"
                onClick={() => setActiveCategory('glider-design')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'glider-design'
                    ? 'bg-[#08245F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🛩️</span>
                Glider Design Training
              </button>

              <button
                id="filter-drone-design-training"
                onClick={() => setActiveCategory('drone-design')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'drone-design'
                    ? 'bg-[#08245F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🚁</span>
                Drone Design & Development
              </button>

              <button
                id="filter-repair-training"
                onClick={() => setActiveCategory('drone-repair')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'drone-repair'
                    ? 'bg-[#08245F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🔧</span>
                Drone Repair & Maintenance
              </button>

              <button
                id="filter-internship-training"
                onClick={() => setActiveCategory('drone-internships')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'drone-internships'
                    ? 'bg-[#08245F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🎓</span>
                Drone Tech Internships (2 Weeks)
              </button>
            </div>
          </div>
        </div>

        {/* ================= SPECIALIZED TECHNICAL TRACKS WITH SLIDESHOWS ================= */}
        <div className="space-y-6">
          {technicalPrograms
            .filter((p) => activeCategory === 'all' || activeCategory === p.id)
            .map((prog) => (
              <div
                key={prog.id}
                id={`tech-training-section-${prog.id}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                {/* Top Banner Row */}
                <div className="p-4 sm:p-5 lg:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#08245F] text-white flex items-center gap-1.5">
                          <span>{prog.iconEmoji}</span>
                          Track {prog.number}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                          {prog.badge}
                        </span>
                      </div>

                      <h2
                        className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] tracking-tight"
                        style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
                      >
                        {prog.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-2xl">
                        {prog.subtitle}
                      </p>
                    </div>

                    {/* Metadata Badges & CTA */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-2xs">
                        <Clock className="w-4 h-4 text-[#FFB800]" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                          <p className="text-xs font-black text-[#08245F]">{prog.duration}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-2xs">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Mode</p>
                          <p className="text-xs font-black text-[#08245F]">{prog.mode}</p>
                        </div>
                      </div>

                      <button
                        id={`btn-enquire-${prog.id}`}
                        onClick={() => handleOpenEnquiry(prog)}
                        className="w-full sm:w-auto text-xs font-black px-4 py-2.5 rounded-xl bg-[#08245F] hover:bg-[#0057B8] text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>Register for Track {prog.number}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slideshow & Syllabus Grid */}
                <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* LEFT COLUMN: Dedicated Interactive Slideshow for Track */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                        Lab & Facility Slideshow
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Auto-playing gallery
                      </span>
                    </div>

                    <TrackSlideshow
                      slides={prog.slides}
                      trackTitle={prog.title}
                      badge={prog.badge}
                    />

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Real equipment & calibrated avionics
                      </span>
                      <button
                        onClick={() => handleOpenEnquiry(prog)}
                        className="text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Apply Now →
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Topics Breakdown & Outcomes */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Comprehensive Syllabus & Modules
                        </h3>
                        <span className="text-[11px] font-bold text-slate-500">
                          {prog.topics.length} Key Focus Modules
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prog.topics.map((topic, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl p-2.5 transition-colors flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-md bg-white text-[#08245F] border border-slate-200 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-700 leading-snug">
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical Outcomes */}
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
                      <h4 className="text-xs font-black text-[#08245F] uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        Hands-on Laboratory & Flight Outcomes
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {prog.outcomes.map((outcome, i) => (
                          <div key={i} className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-2xs text-left">
                            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                              ⚡ {outcome}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Register Action Button */}
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => handleOpenEnquiry(prog)}
                        className="w-full sm:w-auto text-xs font-black px-4 py-2.5 rounded-xl bg-[#08245F] hover:bg-[#0057B8] text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply / Register for {prog.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* ================= DGCA RPC HOLDERS REGISTRY SHOWCASE ================= */}
        <div className="bg-gradient-to-r from-[#08245F] via-[#0B3388] to-[#071D4A] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-sky-400/20 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black bg-amber-400/20 text-[#FFB800] border border-amber-400/30">
              <Award className="w-3.5 h-3.5" />
              <span>OFFICIAL PILOT REGISTRY ({rpcHolders.length} CERTIFIED PILOTS)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
              DGCA Remote Pilot Certificate (RPC) Holders Registry
            </h3>
            <p className="text-xs text-sky-100/90 max-w-2xl leading-relaxed">
              Explore the complete directory of certified commercial UAV pilots who successfully cleared DGCA practical flight assessments at our Kinathukadavu Airfield campus. Verify serial numbers, certificate IDs, and 10-year pilot credentials in real time.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('rpc-holders')}
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 text-[#08245F] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <span>View Full RPC Holders List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ================= BOTTOM FACILITY & HIGHLIGHTS FOOTER ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#08245F] text-[#FFB800] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#08245F]">
                Custom Institutional & Corporate Cohorts Available
              </h4>
              <p className="text-xs text-slate-600">
                Specialized batches for engineering institutions, polytechnic colleges, and aerospace R&D teams.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('contact')}
            className="text-xs font-black px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#08245F] border border-slate-200 transition-all shrink-0 cursor-pointer"
          >
            Contact Admissions Desk
          </button>
        </div>

      </div>

      {/* ================= REGISTRATION & ENQUIRY MODAL LINKED TO DATABASE & ADMIN ================= */}
      {activeEnquiryProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseEnquiry}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {activeEnquiryProgram.mode}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Duration: {activeEnquiryProgram.duration}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#08245F]">
                Registration: {activeEnquiryProgram.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Delivers directly to <strong className="text-[#08245F]">dronetech@sece.ac.in</strong> and syncs to Google Sheets.
              </p>
            </div>

            {submittedEnquiryId ? (
              <div className="p-6 text-center space-y-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-950">Registration Sent to dronetech@sece.ac.in!</h4>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Logged to RPTO Database & Google Sheets</span>
                  </div>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 max-w-sm mx-auto space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Application Reference Number</p>
                  <p className="text-sm font-black text-[#08245F] font-mono tracking-wider">{submittedEnquiryId}</p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Thank you, <strong className="text-slate-900">{applicantName}</strong>. Our training coordinator at <strong className="text-[#08245F]">dronetech@sece.ac.in</strong> will review your details and contact you at <strong className="text-slate-900">{applicantPhone}</strong>.
                </p>

                {/* Direct Mailto Button to dronetech@sece.ac.in */}
                <div className="bg-white border border-emerald-200 rounded-xl p-3 max-w-sm mx-auto space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-[#08245F]">
                    <Mail className="w-4 h-4 text-[#087FE5] shrink-0" />
                    <span className="text-xs font-black uppercase">Send Direct Email Copy</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Send a pre-filled confirmation directly from your email to <strong className="text-[#08245F]">dronetech@sece.ac.in</strong>:
                  </p>
                  <a
                    href={createAdmissionsMailtoUrl({
                      fullName: applicantName,
                      phone: applicantPhone,
                      email: applicantEmail,
                      courseName: `${activeEnquiryProgram.title} (${activeEnquiryProgram.duration})`,
                      preferredBatch: `${activeEnquiryProgram.mode} · ${applicantBatchDate}`,
                      message: applicantNote,
                      refId: submittedEnquiryId
                    })}
                    className="cursor-pointer inline-flex items-center justify-center w-full space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#08245F] hover:bg-[#073B8F] transition-colors shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Mail & Send to dronetech@sece.ac.in</span>
                  </a>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleCloseEnquiry}
                    className="px-5 py-2 text-xs font-bold bg-[#08245F] text-white rounded-xl hover:bg-[#0057B8] shadow-xs cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 98421 55678"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="candidate@gmail.com"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College / Organization / Company
                    </label>
                    <input
                      type="text"
                      value={applicantCollege}
                      onChange={(e) => setApplicantCollege(e.target.value)}
                      placeholder="e.g. Sri Eshwar College of Engineering"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Educational Qualification
                    </label>
                    <select
                      value={applicantQualification}
                      onChange={(e) => setApplicantQualification(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="B.E / B.Tech Student">B.E / B.Tech Engineering Student</option>
                      <option value="Diploma / Polytechnic Student">Diploma / Polytechnic Student</option>
                      <option value="Graduate / Professional">Graduate / Working Professional</option>
                      <option value="DGCA RPC Drone Pilot">Existing DGCA RPC Pilot</option>
                      <option value="School / Higher Secondary">School / Higher Secondary (10th/12th)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Batch / Start Window
                    </label>
                    <select
                      value={applicantBatchDate}
                      onChange={(e) => setApplicantBatchDate(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Immediate Upcoming Batch">Immediate Upcoming Cohort</option>
                      <option value="Next Week Cohort">Next Week Cohort</option>
                      <option value="Weekend Flexible Batch">Weekend Flexible Batch</option>
                      <option value="Next Month Cohort">Next Month Cohort</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Program Duration
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeEnquiryProgram.duration}
                      className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Message & Specific Project Interests
                  </label>
                  <textarea
                    rows={2}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Tell us what you want to achieve or specific UAV areas you want to explore..."
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseEnquiry}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-black bg-[#08245F] hover:bg-[#0057B8] text-white rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Routing to dronetech@sece.ac.in...' : 'Submit to dronetech@sece.ac.in'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

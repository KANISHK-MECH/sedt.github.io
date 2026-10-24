import { Course, Batch, NewsItem, Instructor, Facility, InspectionCard, Enquiry, RpcHolder } from '../types';
import { INITIAL_RPC_HOLDERS } from './rpcHoldersData';
export { INITIAL_RPC_HOLDERS };
import windBladeErosionImg from '../assets/images/regenerated_image_1791793784107.webp';
import windLightningReceptorImg from '../assets/images/regenerated_image_1791793780339.webp';
import windNacelleThermalImg from '../assets/images/regenerated_image_1791793774311.webp';

// Preload high-priority inspection images into browser cache immediately
if (typeof window !== 'undefined') {
  [windBladeErosionImg, windLightningReceptorImg, windNacelleThermalImg].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'small-rpc',
    name: 'Small Category RPC (2–25 kg)',
    category: 'small',
    weightClass: '2 kg – 25 kg Payload Weight',
    price: 23000,
    originalPrice: 28000,
    duration: '5 Days',
    image: '/images/small class drone.webp',
    badge: 'DGCA Certified Standard',
    shortDesc: 'Complete commercial remote pilot certification for standard multirotor and aerial survey drones.',
    description: 'The foundational commercial drone pilot license certified by the Directorate General of Civil Aviation (DGCA). Covers micro to small category UAVs (up to 25 kg), flight mechanics, airspace management, and mission planning.',
    seatsLeft: 4,
    totalSeats: 12,
    objectFit: 'cover',
    highlights: [
      '5 Days Intensive DGCA Syllabus',
      'Dual-Control Simulator & Airfield Training',
      'DGCA Authorized Remote Pilot Certificate (RPC)',
      '10-Year Digital Sky License Validity',
      'Hands-on Ground Control Station (GCS) operations'
    ],
    syllabus: [
      'Day 1: DGCA Drone Rules 2021, Airspace, ATC Protocols & Meteorology',
      'Day 2: Simulator Cockpit Sessions & Emergency Fail-Safe Scenarios',
      'Day 3: Drone Sub-systems, Battery Safety & Pre-flight Inspection SOPs',
      'Day 4: Solo Flight Maneuvers, Figure of 8 & Payload Simulation',
      'Day 5: DGCA Skill Test, Practical Flight Exam & Viva Voce'
    ],
    prerequisites: [
      'Minimum Age: 18 Years',
      '10th Standard Pass from a recognized board',
      'Valid Indian Passport / Aadhaar Card',
      'Class 2 Medical Fitness Certificate'
    ]
  },
  {
    id: 'medium-rpc',
    name: 'Medium Category RPC (25–150 kg)',
    category: 'medium',
    weightClass: '25 kg – 150 kg Heavy & Agri Drones',
    price: 27500,
    originalPrice: 35000,
    duration: '5 Days',
    image: '/images/medium class drone.webp',
    badge: 'Agri & Logistics Specialized',
    shortDesc: 'Specialized commercial training for heavy agricultural spraying and cargo delivery drones.',
    description: 'Comprehensive DGCA certification for operating heavy-lift and agricultural drones (25 kg to 150 kg). Training includes automated precision spraying calibrations, radar obstacle avoidance, and battery swarm logistics.',
    seatsLeft: 3,
    totalSeats: 10,
    objectFit: 'contain',
    highlights: [
      'Heavy Agri Sprayer (10L–30L Payload) Flight Practice',
      'Terrain Following Radar & Swath Calibration',
      'Digital Sky RPTO Authorization for Medium Class',
      'Pesticide & Fertilizer Dispersion Protocols',
      'High Current LiPo Fast-Charging & Safety'
    ],
    syllabus: [
      'Day 1: Heavy UAV Dynamics, DGCA Weight Classification & Regulations',
      'Day 2: Medium Category Simulator Labs with Wind Drift & Payload Shift',
      'Day 3: Agri-Payload Calibration, Nozzle Flow Rates & RTK Setup',
      'Day 4: Field Spraying Missions, Waypoint Flight & Obstacle Evasion',
      'Day 5: Practical DGCA Flying Assessment & Medium Category RPC Issue'
    ],
    prerequisites: [
      'Minimum Age: 18 Years',
      '10th Standard Pass (Science/Technical background preferred)',
      'Valid Indian Passport / Government ID',
      'Medical Fitness Certificate (General Physician)'
    ]
  },
  {
    id: 'small-upgrade',
    name: 'Small Category Upgrade (RPC)',
    category: 'upgrade-small',
    weightClass: 'For Existing Micro / Basic Pilot Holders',
    price: 20500,
    originalPrice: 24000,
    duration: '3 Days',
    image: '/images/small class drone.webp',
    badge: 'Fast Track Upgrade',
    shortDesc: 'Bridge course for existing micro category pilots upgrading to official Small Category RPC.',
    description: 'Accelerated 3-day conversion program for pilots who already possess basic UAV training or micro category credentials, fast-tracking to a full Small Category DGCA commercial license.',
    seatsLeft: 6,
    totalSeats: 12,
    objectFit: 'cover',
    highlights: [
      '3-Day Fast-Track Modular Schedule',
      'Targeted Heavy Payload Simulator Drills',
      'Airspace Clearance & Digital Sky Upgrade',
      'Focus on Commercial Industrial Applications'
    ],
    syllabus: [
      'Day 1: Advanced DGCA Airspace Directives & 25kg Aerodynamics',
      'Day 2: Complex Flight Simulations & Cross-Wind Hover Exercises',
      'Day 3: DGCA Flight Skill Evaluation & Certificate Endorsement'
    ],
    prerequisites: [
      'Valid Micro Category or Prior Flight Logbook',
      '10th Standard Pass',
      'Medical Fitness Certificate'
    ]
  },
  {
    id: 'medium-upgrade',
    name: 'Medium Category Upgrade (RPC)',
    category: 'upgrade-medium',
    weightClass: 'For Small RPC License Holders',
    price: 24000,
    originalPrice: 29000,
    duration: '3 Days',
    image: '/images/medium class drone.webp',
    badge: 'Category Elevation',
    shortDesc: 'Direct qualification upgrade for Small RPC holders entering heavy agriculture & cargo sectors.',
    description: 'Specialized 3-day bridge training designed for certified Small Category pilots wishing to command medium category UAVs (25kg - 150kg) for agribusiness and infrastructure contracts.',
    seatsLeft: 5,
    totalSeats: 10,
    objectFit: 'cover',
    highlights: [
      '3 Days Targeted Field Flight on Heavy Hexacopters',
      'Agri Spraying & Liquid Slosh Dynamics Management',
      'Immediate License Category Endorsement on Digital Sky'
    ],
    syllabus: [
      'Day 1: Heavy Class Systems, Fail-safes & Payload Physics',
      'Day 2: 30L Agri Drone Flight Operations & RTK Auto-Mission',
      'Day 3: Practical Exam & Medium Category License Endorsement'
    ],
    prerequisites: [
      'Active Small Category DGCA RPC License',
      'Valid Medical Fitness Certificate'
    ]
  },
  {
    id: 'combo-package',
    name: 'Small + Medium Category Combo',
    category: 'combo',
    weightClass: 'Dual Certification (2 kg to 150 kg)',
    price: 42500,
    originalPrice: 55000,
    duration: '7 Days',
    image: '/images/small-medium-class.webp',
    badge: 'Best Value • Complete Mastery',
    isPopular: true,
    shortDesc: 'Ultimate dual-category master program certifying you for both standard commercial UAVs and heavy agricultural aircraft.',
    description: 'The premier career launchpad at Sri Eshwar Drone Tech. In 7 intensive days, obtain dual DGCA Remote Pilot Certificates for both Small (2–25 kg) and Medium (25–150 kg) categories. Save ₹8,000+ with bundled training, simulator access, and industrial field attachments.',
    seatsLeft: 2,
    totalSeats: 8,
    objectFit: 'cover',
    highlights: [
      'Dual DGCA Pilot Licenses in One Program',
      'Certified for Surveying, Mapping & Agri Spraying',
      'Unlimited Simulator Flight Lab Access',
      'Priority Placement Assistance with Drone Ecosystem Partners',
      'Includes Drone Pilot Kit & Logbook'
    ],
    syllabus: [
      'Days 1–3: Complete Small Category Ground School, Simulator & Solo Flight',
      'Days 4–5: Medium Category Dynamics, Agri Payloads, RTK & Spraying Lab',
      'Day 6: Advanced Industrial Scenarios (Solar/Wind Surveying demo)',
      'Day 7: Dual DGCA Practical Examinations & License Submission'
    ],
    prerequisites: [
      'Minimum Age: 18 Years',
      '10th Standard Pass (any stream)',
      'Valid Passport or Aadhaar Card',
      'Medical Fitness Certificate'
    ]
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-regular-01',
    name: 'Weekday Fast-Track Regular',
    type: 'weekday',
    startDate: 'Monday, Sep 8, 2026',
    endDate: 'Friday, Sep 12, 2026',
    timing: '08:30 AM – 04:30 PM (Daily)',
    duration: '5 Days (40 Hours)',
    seatsTotal: 12,
    seatsLeft: 3,
    status: 'Filling Fast',
    badgeColor: '#d71920'
  },
  {
    id: 'batch-weekend-01',
    name: 'Weekend Executive Batch',
    type: 'weekend',
    startDate: 'Saturday, Sep 13, 2026',
    endDate: 'Sunday, Sep 28, 2026',
    timing: '09:00 AM – 05:00 PM (Sat & Sun)',
    duration: '2 Weekends (4 Days + Exam)',
    seatsTotal: 10,
    seatsLeft: 4,
    status: 'Open',
    badgeColor: '#FFB800'
  },
  {
    id: 'batch-agri-special',
    name: 'Medium Agri-Drone Special',
    type: 'weekday',
    startDate: 'Monday, Sep 22, 2026',
    endDate: 'Friday, Sep 26, 2026',
    timing: '08:30 AM – 05:00 PM (Daily)',
    duration: '5 Days Specialized',
    seatsTotal: 10,
    seatsLeft: 2,
    status: 'Filling Fast',
    badgeColor: '#d71920'
  },
  {
    id: 'batch-corporate',
    name: 'Custom Corporate / Institutional',
    type: 'custom',
    startDate: 'Flexible On-Demand',
    endDate: 'Tailored Schedule',
    timing: 'Customizable Timings',
    duration: 'Custom Duration',
    seatsTotal: 25,
    seatsLeft: 15,
    status: 'Open',
    badgeColor: '#08245F'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: '100% Pass Rate in DGCA August Batch',
    date: 'Aug 28, 2026',
    category: 'Exam Milestone',
    isLive: true,
    summary: 'All 24 student candidates successfully cleared their practical skill test and theoretical DGCA exam on their first attempt.',
    linkText: 'View Hall of Fame'
  },
  {
    id: 'news-2',
    title: 'New Agri-Drone Spraying Specialization Wing Launched',
    date: 'Aug 20, 2026',
    category: 'Curriculum',
    isLive: false,
    summary: 'State-of-the-art 25L automated hexacopters added for precision farming training at Kinathukadavu campus.',
    linkText: 'Learn More'
  },
  {
    id: 'news-3',
    title: 'Visit Our Booth at Tamil Nadu Drone Expo 2026',
    date: 'Aug 15, 2026',
    category: 'Exhibition',
    isLive: false,
    summary: 'Meet chief instructors, test our flight simulator, and get instant ₹2,500 course vouchers at Stall A-14, CODISSIA Coimbatore.',
    linkText: 'Get Free Pass'
  }
];

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Lt. M. Mahaboob',
    role: 'Accountable Manager',
    dgcaNumber: 'Sri Eshwar Drone Tech',
    experience: '12+ Years Aviation & UAV',
    flightHours: 3200,
    phone: '+91 95006 35060',
    specialization: 'RPTO Governance & Flight Safety Systems',
    image: '/images/Mr.M.Mahaboob.webp',
    imagePosition: 'top',
    bio: 'Accountable Manager of Sri Eshwar Drone Tech, overseeing DGCA RPTO regulatory compliance, flight training operations, pilot licensing, and safety governance.'
  },
  {
    id: 'inst-2',
    name: 'Mr. E. Venugopal',
    role: 'Chief Instructor',
    dgcaNumber: 'Sri Eshwar Drone Tech',
    experience: '10+ Years Aerospace & UAV',
    flightHours: 2800,
    phone: '+91 98947 43267',
    specialization: 'Small, Medium Class Instructor (2- 150kg)',
    image: '/images/Mr.E.Venugopal.webp',
    imagePosition: 'top',
    bio: 'Chief Instructor & Small, Medium Class Trainer at Sri Eshwar Drone Tech, supervising remote pilot flight training, simulator instruction, DGCA examination evaluations, and airworthiness safety.'
  },
  {
    id: 'inst-3',
    name: 'Dr. S. Sampath Kumar',
    role: 'Instructor',
    dgcaNumber: 'Sri Eshwar Drone Tech',
    experience: '8+ Years UAV & Flight Systems',
    flightHours: 2100,
    specialization: 'Small Class Multirotors (2 - 25 kg)',
    image: '/images/Sampath.webp',
    imagePosition: 'top',
    bio: 'Small Class Instructor upto 2-25kg at Sri Eshwar Drone Tech, specializing in multirotor pilot training, simulator coaching, flight safety, and DGCA remote pilot syllabus instruction.'
  },
  {
    id: 'inst-4',
    name: 'Mr. R. Hariharan',
    role: 'Instructor',
    dgcaNumber: 'Sri Eshwar Drone Tech',
    experience: '7+ Years Medium UAV Systems',
    flightHours: 1950,
    specialization: 'Medium Class Instructor (25 - 150 kg)',
    image: '/images/Mr.R.Hariharan.webp',
    imagePosition: 'top',
    bio: 'Medium Class Instructor (25 - 150 kg) at Sri Eshwar Drone Tech, specializing in medium category remote pilot flight training, heavy multirotor maneuvers, payload logistics, and DGCA air safety compliance.'
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'DGCA Kinathukadavu Airfield & Drone Fly Area',
    subtitle: '15+ Acres Approved Green Zone Airspace',
    description: 'Dedicated private flying field in Kinathukadavu, Coimbatore, with uninterrupted Green Zone airspace, geo-fenced safety boundaries, calibrated helipads, and full weather telemetry instrumentation.',
    image: '/images/airfield.webp',
    category: 'Facilities',
    stats: '15+ Acres • Active Airfield',
    highlights: [
      'Dual active paved runways & soft-landing turf',
      'Live ultrasonic weather station & windsock array',
      'First-aid & safety shelter with live telemetry monitors',
      'High-resolution aerial telemetry tracking for flight exams'
    ]
  },
  {
    id: 'fac-2',
    name: 'Sri Eshwar Drone Tech RPTO Headquarters',
    subtitle: 'Signature Multi-Storey Aviation & Flight Center',
    description: 'Modern multi-storey headquarters facility housing DGCA administration, academic faculty offices, trainee lounge, and direct access to 15+ acres of certified training grounds.',
    image: '/images/drone-infra-building.webp',
    category: 'Facilities',
    stats: 'Multi-Storey • DGCA Center',
    highlights: [
      'Integrated DGCA registration & compliance desk',
      'Air-conditioned faculty & trainee academic wings',
      'Rooftop anemometer & aviation telemetry mast',
      'Full security, biometric access & conference facilities'
    ]
  },
  {
    id: 'fac-3',
    name: 'High-Fidelity UAV Flight Simulator Zone',
    subtitle: 'Dual-Seat Digital Flight Simulator Stations',
    description: 'Advanced computer flight simulator laboratory equipped with RealFlight & custom PX4 cockpits simulating Tamil Nadu topography, high gusts, emergency battery drops, and motor failure recoveries.',
    image: '/images/simulator-zone.webp',
    category: 'Training',
    stats: '12 Simulator Stations • VR Ready',
    highlights: [
      'Exact transmitter mapping with dual-trainer link',
      'Simulated rain, wind shear, and magnetic interference',
      'GCS mission planning & automatic waypoint creation',
      'Automated error logs for instructor debriefing'
    ]
  },
  {
    id: 'fac-4',
    name: 'Smart Ground Class & Aviation Lecture Hall',
    subtitle: 'Interactive Aviation Theory Classroom',
    description: 'Air-conditioned digital classroom with high-resolution projection, interactive 3D aerodynamics demonstrations, Digital Sky portal tutorials, and DGCA question bank mock assessment stations.',
    image: '/images/ground-class.webp',
    category: 'Training',
    stats: '40 Seat Capacity • Smart AV',
    highlights: [
      'Interactive 3D airspace map visualizations',
      'Digital mock exam terminals for instant scoring',
      'Full Digital Sky portal registration guidance',
      'Audio-visual case studies of industrial drone flights'
    ]
  },
  {
    id: 'fac-5',
    name: 'Drone Station 1 - Assembly & Multirotor Rig',
    subtitle: 'Hardware Assembly, Propeller Balancing & Test Bench',
    description: 'Industrial assembly workbench area where trainees gain hands-on experience assembling airframes, balancing carbon fiber propellers, and testing brushless propulsion systems.',
    image: '/images/drone-station.webp',
    category: 'Industrial',
    stats: 'Industrial Lab • Multirotor Rig',
    highlights: [
      'Heavy multirotor carbon-fiber chassis assembly jigs',
      'Propeller dynamic balancing & vibration sensors',
      'ESC calibration & brushless motor thrust benches',
      'Hardware toolkits & torque-calibrated drivers'
    ]
  },
  {
    id: 'fac-6',
    name: 'Drone Station 2 - Avionics & Diagnostics Workshop',
    subtitle: 'Electronics, Telemetry & LiPo Battery Safety Bay',
    description: 'Specialized electronics repair and diagnostics workbench equipped with oscilloscopes, spectrum analyzers, smart multi-channel LiPo balance charging bays, and payload integration rigs.',
    image: '/images/drone-station-2.webp',
    category: 'Industrial',
    stats: 'Avionics Lab • LiPo Bunkers',
    highlights: [
      'Digital oscilloscopes & RF spectrum analyzers',
      'Smart multi-channel LiPo balance charging stations',
      'RTK GNSS module calibration & compass tuning',
      'Fail-safe parachute & return-to-home testing rigs'
    ]
  },
  {
    id: 'fac-7',
    name: 'Flight Operations & Crew Discussion Room',
    subtitle: 'Mission Planning & Post-Flight Debriefing Suite',
    description: 'Dedicated flight crew discussion room designed for pre-flight weather assessments, NOTAM analysis, emergency contingency reviews, and mission route deconfliction.',
    image: '/images/discussion-room.webp',
    category: 'Training',
    stats: 'Briefing Suite • Mission Control',
    highlights: [
      'Interactive flight planning digital display screens',
      'NOTAM, METAR weather & Green Zone airspace charts',
      'Crew Resource Management (CRM) collaborative seating',
      'Post-flight telemetry playback & critique stations'
    ]
  },
  {
    id: 'fac-8',
    name: 'Drone Library & UAV Research Innovation Hub',
    subtitle: 'Comprehensive UAV Fleet & Component Archive',
    description: 'Dedicated technology archive featuring a wide spectrum of multirotors, agricultural sprayers, survey sensors, thermal cameras, and technical manuals for hands-on exploration.',
    image: '/images/drone-library.webp',
    category: 'Industrial',
    stats: 'Research Hub • Fleet Archive',
    highlights: [
      'Showcase of diverse commercial UAV models & payloads',
      'Agricultural spray nozzles & centrifugal atomizers',
      'Multispectral, LiDAR & radiometric thermal sensors',
      'Aviation reference library & DGCA manuals'
    ]
  },
  {
    id: 'event-1',
    name: 'DGCA Remote Pilot Wings & License Convocation Ceremony',
    subtitle: 'Official Wings Badge & Digital Sky Certification Distribution',
    description: 'Graduating remote pilot cohort ceremony awarding official DGCA certification with chief flight instructors, DGCA examiners, and industrial UAV placement partners.',
    image: '/images/ground-class.webp',
    category: 'Events',
    stats: 'Annual Convocation • Batch 24',
    highlights: [
      'Official DGCA Wings badge conferment',
      'Trainee solo flight showcase & certificate handover',
      'Industry placement recruiter interaction'
    ]
  },
  {
    id: 'event-2',
    name: 'Tamil Nadu Drone Tech Expo & Airfield Flight Showcase',
    subtitle: 'Precision Flight Formations & Real-Time Aerial Survey Demo',
    description: 'Live field demonstrations featuring automated waypoint mapping, precision agricultural spraying, and high-resolution thermal solar panel inspection over Kinathukadavu airfield.',
    image: '/images/airfield.webp',
    category: 'Events',
    stats: 'Live Expo • Flight Demonstrations',
    highlights: [
      'Live telemetry broadcast on ground control station',
      'Precision thermal sensor payload test runs',
      'Multi-drone obstacle avoidance maneuvers'
    ]
  }
];

export const INITIAL_GALLERY = FACILITIES;

export const SOLAR_INSPECTIONS: InspectionCard[] = [
  {
    id: 'solar-1',
    title: 'Radiometric Thermal String Mapping',
    sector: 'solar',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=700&q=80',
    thermalImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=700&q=80',
    faultType: 'Bypass Diode Failure & Hotspots',
    resolution: '640x512 Radiometric Thermal @ 2.5cm/px',
    efficiencyImpact: '+8.4% Output Recovery',
    standard: 'IEC 62446-3 Compliant Thermography',
    description: 'High-altitude autonomous flights detect defective PV cells, damaged bypass diodes, and cracked glass before thermal runaway occurs.'
  },
  {
    id: 'solar-2',
    title: 'Soiling & Vegetation Shadow Analysis',
    sector: 'solar',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=700&q=80',
    faultType: 'Localized Dust Accumulation & Shading',
    resolution: '48MP RGB High-Definition Orthomosaic',
    efficiencyImpact: '+5.2% Generation Boost',
    standard: 'Automated AI Defect Tagging',
    description: 'High-resolution RGB mapping pinpoints high-dirt accumulation zones to optimize cleaning robotic schedules and vegetation trimming.'
  },
  {
    id: 'solar-3',
    title: 'Substation & Inverter Junction Inspection',
    sector: 'solar',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=700&q=80',
    faultType: 'High-Resistance Connector Overheating',
    resolution: 'Dual Thermal + Visual Telephoto',
    efficiencyImpact: 'Prevents Critical Outage',
    standard: 'NFPA 70B Electrical Safety Audits',
    description: 'Inspects combiner boxes, central inverters, and high-voltage step-up transformers from safe distances without plant shutdowns.'
  }
];

export const WIND_INSPECTIONS: InspectionCard[] = [
  {
    id: 'wind-1',
    title: 'Blade Leading Edge Erosion Audit',
    sector: 'wind',
    image: windBladeErosionImg,
    faultType: 'Category 3 Leading Edge Pitting & Delamination',
    resolution: '100MP High-Magnification Zoom & Thermal',
    efficiencyImpact: '+4.8% AEP (Annual Energy Production)',
    standard: 'DNV-GL Blade Integrity Standard',
    description: 'Automated waypoint inspection captures sub-millimeter cracks and aerodynamic drag pitting along 70m turbine blades without rope access.'
  },
  {
    id: 'wind-2',
    title: 'Lightning Receptor & Conductor Continuity',
    sector: 'wind',
    image: windLightningReceptorImg,
    faultType: 'Lightning Strike Carbonization & Surface Rupture',
    resolution: 'Thermal Gradient & Ultra-HD Visual',
    efficiencyImpact: 'Catastrophic Delamination Prevention',
    standard: 'IEC 61400-24 Lightning Protection',
    description: 'Detects microscopic flashover damage, damaged receptor discs, and hidden interior carbon tracks caused by thunderstorm strikes.'
  },
  {
    id: 'wind-3',
    title: 'Nacelle & Yaw Mechanism Thermal Survey',
    sector: 'wind',
    image: windNacelleThermalImg,
    faultType: 'Gearbox Bearing Friction & Hydraulic Leakage',
    resolution: 'Radiometric Thermal Radiance Profile',
    efficiencyImpact: 'Predictive Maintenance Alert',
    standard: 'ISO 18436 Condition Monitoring',
    description: 'Safely inspects 120m nacelle generators, hydraulic yaw brakes, and gearbox bearings for abnormal thermal spikes during full-load rotation.'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    fullName: 'Praveen Kumar S',
    email: 'praveen.k@gmail.com',
    phone: '+91 98421 55678',
    courseId: 'small-rpc',
    courseName: 'Small Category RPC (2–25 kg)',
    preferredBatch: 'Weekday Fast-Track (Sep 8)',
    message: 'I want to obtain the commercial pilot license for real estate and aerial survey projects.',
    createdAt: '2026-08-31 10:24 AM',
    status: 'New',
    notes: 'Interested in accommodation nearby campus.'
  },
  {
    id: 'enq-102',
    fullName: 'Ananya Ramesh',
    email: 'ananya.ramesh@outlook.com',
    phone: '+91 94432 10987',
    courseId: 'combo-package',
    courseName: 'Small + Medium Category Combo',
    preferredBatch: 'Weekend Executive (Sep 13)',
    message: 'Looking for dual certification for agricultural spraying startup in Pollachi.',
    createdAt: '2026-08-30 04:15 PM',
    status: 'Contacted',
    notes: 'Sent brochure via WhatsApp. Callback scheduled.'
  },
  {
    id: 'enq-103',
    fullName: 'S. Manikandan',
    email: 'mani.agritech@yahoo.com',
    phone: '+91 97890 33421',
    courseId: 'medium-rpc',
    courseName: 'Medium Category RPC (25–150 kg)',
    preferredBatch: 'Medium Agri-Drone Special (Sep 22)',
    message: 'Already operating small drones, need medium certification for 25L agricultural hexacopter.',
    createdAt: '2026-08-29 02:40 PM',
    status: 'Enrolled',
    notes: 'Payment confirmed. Batch 3 slot allotted.'
  },
  {
    id: 'solar-req-201',
    fullName: 'K. Vignesh (SunPower Solar EPC Ltd)',
    email: 'vignesh@sunpowerepc.com',
    phone: '+91 98432 77120',
    courseId: 'solar-inspection',
    courseName: 'Solar PV Plant Drone Inspection & Aerial Thermography',
    preferredBatch: '25 MW Utility Solar Park · Kinathukadavu',
    message: 'Plant: 25 MW Ground-Mounted Solar Park | Location: Kinathukadavu, Coimbatore | Scope: IEC 62446-3 Radiometric Thermal IR, Hotspot Mapping, 3D Orthomosaic | Desired Date: Next Tuesday',
    createdAt: '2026-09-02 11:15 AM',
    status: 'New',
    notes: 'Site visit coordination requested for next Tuesday. Thermography calibration required.'
  },
  {
    id: 'wind-req-202',
    fullName: 'M. Senthil Kumar (Muppandal Wind Power Assets)',
    email: 'senthil.k@muppandalwind.in',
    phone: '+91 98944 68231',
    courseId: 'wind-inspection',
    courseName: 'Wind Turbine Blade & Nacelle Drone UAV Survey',
    preferredBatch: '15 Turbines (Vestas V110) · Udumalpet Wind Corridor',
    message: 'Wind Farm: 15 Turbines (Vestas V110, 120m Hub Height) | Location: Udumalpet / Muppandal Pass | Scope: DNV-GL Blade Surface 0.1mm Crack Scan, Leading Edge Erosion, Lightning Receptor Conductivity, Nacelle Thermal IR | Target Schedule: Pre-Monsoon Audit',
    createdAt: '2026-09-03 09:30 AM',
    status: 'New',
    notes: 'Requested autonomous UAV blade inspection before peak southwest monsoon wind season.'
  }
];

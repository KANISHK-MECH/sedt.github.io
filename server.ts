import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INTEGRATIONS_CONFIG } from './src/config/integrations';

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.json());

// Database storage file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rpto-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default data schema
const INITIAL_COURSES = [
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
      'Free Industrial Thermography & GIS Overview Module',
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

const INITIAL_BATCHES = [
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
    badgeColor: '#f5b400'
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
    badgeColor: '#0b1f4d'
  }
];

const INITIAL_NEWS = [
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
    title: 'Government Subsidy Support for Agriculture Drone Pilots',
    date: 'Aug 14, 2026',
    category: 'DGCA & Subsidies',
    isLive: false,
    summary: 'Special financial assistance schemes explained for rural youth and agricultural entrepreneurs enrolling in Medium RPC.',
    linkText: 'Read Guidelines'
  }
];

const INITIAL_ENQUIRIES = [
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
  }
];

interface DatabaseSchema {
  courses: typeof INITIAL_COURSES;
  batches: typeof INITIAL_BATCHES;
  news: typeof INITIAL_NEWS;
  enquiries: typeof INITIAL_ENQUIRIES;
  settings?: {
    googleSheetsUrl?: string;
    lastSyncTime?: string;
    lastSyncStatus?: string;
  };
  lastUpdated: string;
}

// Helper to push enquiry to Google Sheets
async function syncToGoogleSheets(enquiry: any): Promise<{ synced: boolean; message: string }> {
  const db = readDatabase();
  const webhookUrl = 
    db.settings?.googleSheetsUrl?.trim() ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
    process.env.GOOGLE_SHEETS_URL?.trim() ||
    INTEGRATIONS_CONFIG.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  const recipient = INTEGRATIONS_CONFIG.ADMISSIONS_EMAIL || 'dronetech@sece.ac.in';

  console.log(`\n========================================================================`);
  console.log(`[OFFICIAL DISPATCH -> ${recipient}]`);
  console.log(`New Admission Application Received:`);
  console.log(`• Reference ID: ${enquiry.id}`);
  console.log(`• Candidate Name: ${enquiry.fullName}`);
  console.log(`• Phone: ${enquiry.phone}`);
  console.log(`• Email: ${enquiry.email || 'Not provided'}`);
  console.log(`• Course / Program: ${enquiry.courseName}`);
  console.log(`• Preferred Batch: ${enquiry.preferredBatch}`);
  console.log(`• Timestamp: ${enquiry.createdAt}`);
  console.log(`• Message: ${enquiry.message}`);
  console.log(`========================================================================\n`);

  if (!webhookUrl) {
    console.log(`[Google Sheets] Webhook URL is not configured yet. To automatically record every enrollment in Google Sheets, paste your Google Sheet Webhook / Apps Script Web App URL into 'src/config/integrations.ts' or through Admin Settings.`);
    return { synced: false, message: 'Google Sheets URL not configured' };
  }

  try {
    const payload = {
      id: enquiry.id,
      timestamp: enquiry.createdAt || new Date().toISOString(),
      fullName: enquiry.fullName,
      phone: enquiry.phone,
      email: enquiry.email || 'Not provided',
      courseId: enquiry.courseId || '',
      courseName: enquiry.courseName || '',
      preferredBatch: enquiry.preferredBatch || '',
      message: enquiry.message || '',
      status: enquiry.status || 'New',
      targetEmail: recipient
    };

    console.log(`[Google Sheets] Forwarding enquiry ${enquiry.id} to Google Sheets endpoint...`);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`[Google Sheets] Successfully posted enquiry ${enquiry.id} to Google Sheets! HTTP Status: ${response.status}`);
      if (!db.settings) db.settings = {};
      db.settings.lastSyncTime = new Date().toISOString();
      db.settings.lastSyncStatus = 'success';
      writeDatabase(db);
      return { synced: true, message: 'Synced to Google Sheets successfully' };
    } else {
      console.warn(`[Google Sheets] Received HTTP ${response.status}: ${response.statusText}`);
      if (!db.settings) db.settings = {};
      db.settings.lastSyncTime = new Date().toISOString();
      db.settings.lastSyncStatus = `HTTP ${response.status}`;
      writeDatabase(db);
      return { synced: false, message: `HTTP ${response.status}` };
    }
  } catch (err: any) {
    console.error(`[Google Sheets] Sync failed:`, err?.message || err);
    if (!db.settings) db.settings = {};
    db.settings.lastSyncTime = new Date().toISOString();
    db.settings.lastSyncStatus = `Error: ${err?.message || 'Network error'}`;
    writeDatabase(db);
    return { synced: false, message: err?.message || 'Network error' };
  }
}

// Helper to read database
function readDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(data);
      let changed = false;
      if (parsed.courses && Array.isArray(parsed.courses)) {
        parsed.courses = parsed.courses.map((c: any) => {
          if ((c.id === 'small-rpc' || c.id === 'small-upgrade') && c.image !== '/images/small class drone.png') {
            changed = true;
            return { ...c, image: '/images/small class drone.png' };
          }
          if ((c.id === 'medium-rpc' || c.id === 'medium-upgrade') && c.image !== '/images/medium class drone.png') {
            changed = true;
            return { ...c, image: '/images/medium class drone.png' };
          }
          if (c.id === 'combo-package' && c.image !== '/images/small + medium class.PNG') {
            changed = true;
            return { ...c, image: '/images/small + medium class.PNG' };
          }
          return c;
        });
      }
      if (changed) {
        writeDatabase(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // If not exists or error, create default
  const defaultDb: DatabaseSchema = {
    courses: INITIAL_COURSES,
    batches: INITIAL_BATCHES,
    news: INITIAL_NEWS,
    enquiries: INITIAL_ENQUIRIES,
    lastUpdated: new Date().toISOString()
  };
  writeDatabase(defaultDb);
  return defaultDb;
}

// Helper to write database
function writeDatabase(data: DatabaseSchema): boolean {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Initialize database on start
readDatabase();

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    rpto: 'Sri Eshwar Drone Tech Pvt Ltd',
    dgcaAuth: 'DGCA/RPTO-TN 21/2024',
    timestamp: new Date().toISOString()
  });
});

// Full Data Sync (both website & admin panel load / poll this)
app.get('/api/data', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// GET Courses
app.get('/api/courses', (req, res) => {
  const db = readDatabase();
  res.json(db.courses);
});

// UPDATE Course
app.put('/api/courses/:id', (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const updatedCourse = req.body;
  const index = db.courses.findIndex((c) => c.id === id);

  if (index !== -1) {
    db.courses[index] = { ...db.courses[index], ...updatedCourse };
    writeDatabase(db);
    res.json({ success: true, course: db.courses[index] });
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// GET Batches
app.get('/api/batches', (req, res) => {
  const db = readDatabase();
  res.json(db.batches);
});

// UPDATE Batch
app.put('/api/batches/:id', (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const updatedBatch = req.body;
  const index = db.batches.findIndex((b) => b.id === id);

  if (index !== -1) {
    db.batches[index] = { ...db.batches[index], ...updatedBatch };
    writeDatabase(db);
    res.json({ success: true, batch: db.batches[index] });
  } else {
    res.status(404).json({ error: 'Batch not found' });
  }
});

// CREATE Batch
app.post('/api/batches', (req, res) => {
  const db = readDatabase();
  const newBatch = {
    id: `batch-${Date.now()}`,
    ...req.body
  };
  db.batches.push(newBatch);
  writeDatabase(db);
  res.status(201).json({ success: true, batch: newBatch });
});

// GET News
app.get('/api/news', (req, res) => {
  const db = readDatabase();
  res.json(db.news);
});

// CREATE News
app.post('/api/news', (req, res) => {
  const db = readDatabase();
  const newItem = {
    id: `news-${Date.now()}`,
    ...req.body
  };
  db.news.unshift(newItem);
  writeDatabase(db);
  res.status(201).json({ success: true, news: newItem });
});

// DELETE News
app.delete('/api/news/:id', (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  db.news = db.news.filter((n) => n.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// GET Enquiries
app.get('/api/enquiries', (req, res) => {
  const db = readDatabase();
  res.json(db.enquiries);
});

// CREATE Enquiry (from Public Website Registration Form)
app.post('/api/enquiries', async (req, res) => {
  const db = readDatabase();
  const { fullName, email, phone, courseId, courseName, preferredBatch, message } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Full name and phone number are required' });
  }

  const now = new Date();
  const formattedDate = now.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const newEnquiry = {
    id: `enq-${Date.now().toString().slice(-5)}`,
    fullName,
    email: email || '',
    phone,
    courseId: courseId || 'general',
    courseName: courseName || 'General Enquiry / RPC Training',
    preferredBatch: preferredBatch || 'Upcoming Batch',
    message: message || '',
    createdAt: formattedDate,
    status: 'New' as const,
    notes: 'Submitted via official website portal'
  };

  db.enquiries.unshift(newEnquiry);
  writeDatabase(db);

  // Trigger Google Sheets synchronization and email routing
  let syncResult = { synced: false, message: 'Pending' };
  try {
    syncResult = await syncToGoogleSheets(newEnquiry);
  } catch (err: any) {
    console.error('Sync error in enquiry route:', err?.message || err);
  }

  res.status(201).json({
    success: true,
    enquiry: newEnquiry,
    googleSheetsSynced: syncResult.synced,
    recipientEmail: INTEGRATIONS_CONFIG.ADMISSIONS_EMAIL,
    message: `Application recorded and routed to ${INTEGRATIONS_CONFIG.ADMISSIONS_EMAIL}`
  });
});

// GET Integration Settings Status
app.get('/api/integrations/google-sheets', (req, res) => {
  const db = readDatabase();
  const url =
    db.settings?.googleSheetsUrl ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_URL ||
    INTEGRATIONS_CONFIG.GOOGLE_SHEETS_WEBHOOK_URL ||
    '';

  res.json({
    configured: Boolean(url && url.trim().length > 0),
    url: url || '',
    recipientEmail: INTEGRATIONS_CONFIG.ADMISSIONS_EMAIL || 'dronetech@sece.ac.in',
    lastSyncTime: db.settings?.lastSyncTime || null,
    lastSyncStatus: db.settings?.lastSyncStatus || null
  });
});

// UPDATE / SAVE Google Sheets Webhook URL & Optional Test Ping
app.post('/api/integrations/google-sheets', async (req, res) => {
  const db = readDatabase();
  const { url, testPing } = req.body;

  if (typeof url === 'string') {
    if (!db.settings) db.settings = {};
    db.settings.googleSheetsUrl = url.trim();
    writeDatabase(db);
  }

  if (testPing && (url || db.settings?.googleSheetsUrl)) {
    const testEnquiry = {
      id: `TEST-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString('en-IN'),
      fullName: 'Sri Eshwar Test Candidate',
      phone: '+91 95006 35060',
      email: 'dronetech@sece.ac.in',
      courseName: 'Google Sheets Connection Test',
      preferredBatch: 'Verification Ping',
      message: 'Automated test payload sent from Sri Eshwar Drone Tech RPTO.',
      status: 'Test'
    };
    const syncRes = await syncToGoogleSheets(testEnquiry);
    return res.json({ success: true, testResult: syncRes, settings: db.settings });
  }

  res.json({ success: true, settings: db.settings });
});

// UPDATE Enquiry Status & Notes (from Admin Panel)
app.patch('/api/enquiries/:id/status', (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  const { status, notes } = req.body;

  const index = db.enquiries.findIndex((e) => e.id === id);
  if (index !== -1) {
    if (status) db.enquiries[index].status = status;
    if (notes !== undefined) db.enquiries[index].notes = notes;
    writeDatabase(db);
    res.json({ success: true, enquiry: db.enquiries[index] });
  } else {
    res.status(404).json({ error: 'Enquiry not found' });
  }
});

// DELETE Enquiry
app.delete('/api/enquiries/:id', (req, res) => {
  const db = readDatabase();
  const { id } = req.params;
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  writeDatabase(db);
  res.json({ success: true });
});

// RESET Database to Factory Defaults
app.post('/api/reset', (req, res) => {
  const defaultDb: DatabaseSchema = {
    courses: INITIAL_COURSES,
    batches: INITIAL_BATCHES,
    news: INITIAL_NEWS,
    enquiries: INITIAL_ENQUIRIES,
    lastUpdated: new Date().toISOString()
  };
  writeDatabase(defaultDb);
  res.json({ success: true, data: defaultDb });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------

async function startServer() {
  // Directly serve public images with WebP content-negotiation and long-term cache headers
  const publicImagesPath = path.join(process.cwd(), 'public', 'images');
  if (fs.existsSync(publicImagesPath)) {
    app.use('/images', (req, res, next) => {
      // 30-day browser caching for static image assets
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');

      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('image/webp')) {
        const parsed = path.parse(req.path);
        if (parsed.ext && parsed.ext.toLowerCase() !== '.webp') {
          const webpName = `${parsed.name}.webp`;
          const webpFullPath = path.join(publicImagesPath, webpName);
          if (fs.existsSync(webpFullPath)) {
            res.type('image/webp');
            return res.sendFile(webpFullPath);
          }
        }
      }
      next();
    }, express.static(publicImagesPath, {
      maxAge: '30d',
      immutable: true,
      etag: true
    }));
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RPTO Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

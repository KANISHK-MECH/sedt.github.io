export type TabType = 
  | 'home'
  | 'about'
  | 'courses'
  | 'training'
  | 'inspections'
  | 'solar'
  | 'wind'
  | 'infrastructure'
  | 'gallery'
  | 'rpc-holders'
  | 'contact';

export interface RpcHolder {
  id: string;
  serialNo: string;
  certificateNo: string;
  rpcNo: string;
  name: string;
  issueYear?: string;
  category?: string;
  status?: 'Active' | 'Verified' | 'Issued';
}


export interface Course {
  id: string;
  name: string;
  category: 'small' | 'medium' | 'upgrade-small' | 'upgrade-medium' | 'combo';
  weightClass: string;
  price: number;
  originalPrice?: number;
  duration: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
  shortDesc: string;
  description: string;
  seatsLeft: number;
  totalSeats: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  highlights: string[];
  syllabus: string[];
  prerequisites: string[];
}

export interface Batch {
  id: string;
  name: string;
  type: 'weekday' | 'weekend' | 'custom';
  startDate: string;
  endDate: string;
  timing: string;
  duration: string;
  seatsTotal: number;
  seatsLeft: number;
  status: 'Open' | 'Filling Fast' | 'Sold Out';
  badgeColor: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  isLive?: boolean;
  summary: string;
  linkText?: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  preferredBatch?: string;
  message?: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Archived';
  notes?: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  dgcaNumber: string;
  experience: string;
  flightHours: number;
  specialization: string;
  image: string;
  imagePosition?: string;
  bio: string;
  phone?: string;
}

export type GalleryCategory = 'Training' | 'Events' | 'Industrial' | 'Facilities' | string;

export interface GalleryItem {
  id: string;
  name: string; // Photo Title
  subtitle: string; // Photo Subtitle
  description: string; // Photo Description
  image: string; // Image URL or Base64 Data URL
  category?: string; // Filter Category: 'Training' | 'Events' | 'Industrial' | 'Facilities'
  stats?: string; // Tag or category badge
  highlights?: string[];
  createdAt?: string;
}

export type Facility = GalleryItem;

export interface InspectionCard {
  id: string;
  title: string;
  sector: 'solar' | 'wind';
  image: string;
  thermalImage?: string;
  faultType: string;
  resolution: string;
  efficiencyImpact: string;
  standard: string;
  description: string;
}

export type TabType = 
  | 'home'
  | 'about'
  | 'courses'
  | 'training'
  | 'inspections'
  | 'solar'
  | 'wind'
  | 'infrastructure'
  | 'contact';

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

export interface Facility {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  stats: string;
  highlights: string[];
}

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

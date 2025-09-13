export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  role: 'USER' | 'ADMIN';
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destination?: string;
  budget?: number;
  isPublic: boolean;
  coverImageUrl?: string;
  owner: User;
  tags: Tag[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  category?: ActivityCategory;
  bookingUrl?: string;
  notes?: string;
  isCompleted: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategory = 
  | 'TRANSPORTATION'
  | 'ACCOMMODATION'
  | 'DINING'
  | 'SIGHTSEEING'
  | 'ENTERTAINMENT'
  | 'SHOPPING'
  | 'OUTDOOR'
  | 'CULTURAL'
  | 'RELAXATION'
  | 'BUSINESS'
  | 'OTHER';

export interface DayPlan {
  id: string;
  date: string;
  notes?: string;
  activities: Activity[];
}

export interface CostBreakdown {
  totalCost: number;
  costByCategory: Record<ActivityCategory, number>;
  costByDay: Record<string, number>;
  totalActivities: number;
  activitiesWithCost: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface TripCreateRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destination?: string;
  budget?: number;
  isPublic?: boolean;
  coverImageUrl?: string;
  tagNames?: string[];
}

export interface ActivityCreateRequest {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  category?: ActivityCategory;
  bookingUrl?: string;
  notes?: string;
  tagNames?: string[];
}

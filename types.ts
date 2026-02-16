
export type UserRole = 'user' | 'admin' | 'guest';
export type Language = 'en' | 'bn' | 'hi' | 'ur' | 'ar';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppAnalytics {
  totalInstalls: number;
  views: number;
  lastMonthInstalls: number;
  growthRate: number;
  dailyActiveUsers: number[];
}

export interface UpdateRequest {
  version: string;
  releaseNotes: string;
  date: string;
}

export interface AppData {
  id: string;
  name: string;
  developer: string;
  icon: string;
  banner: string;
  screenshots?: string[];
  description: string;
  category: string;
  rating: number;
  downloads: string;
  size: string;
  version: string;
  releaseNotes?: string;
  reviews?: Review[];
  isFeatured?: boolean;
  status: 'published' | 'pending' | 'rejected';
  apkFileName?: string;
  submittedBy?: string;
  hasUpdate?: boolean; 
  newVersion?: string; 
  analytics?: AppAnalytics;
  pendingUpdate?: UpdateRequest;
}

export type ViewState = 'home' | 'details' | 'ai-studio' | 'installed' | 'admin-portal' | 'submit-app' | 'auth' | 'security' | 'hosting';

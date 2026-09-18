export type TabType = 'home' | 'booking' | 'nezhity' | 'club' | 'profile' | 'admin';

export type VisitAtmosphere = 'talk' | 'series' | 'silence';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ServiceItem {
  id: string;
  category: 'manicure' | 'pedicure' | 'combos';
  name: string;
  badge?: string;
  badgeType?: 'hit' | 'art' | 'save' | 'all-inclusive';
  duration: string;
  price: number;
  pricePrefix?: string;
  description: string;
  featureText?: string;
  featureIcon?: string;
}

export interface BookingSlot {
  date: string;
  dayOfWeek: string;
  dayNum: string;
  time: string;
  master: string;
  masterRole: string;
  masterRating: string;
}

export interface ActiveBooking {
  id: string;
  service: string;
  master: string;
  date: string;
  time: string;
  status: string;
  bookingStatus?: BookingStatus;
  platform: string;
  targetTimestamp?: number;
  price?: number;
  gift?: string;
  clientName?: string;
  clientPhone?: string;
  atmosphere?: VisitAtmosphere;
  comments?: string;
  referralCode?: string;
  createdAt?: string;
  cancellationReason?: string;
}

export interface WheelSegment {
  id: number;
  label: string;
  sublabel: string;
  type: 'discount' | 'points' | 'bonus' | 'vip';
  value: number | string;
  icon: string;
  color: string;
  textColor: string;
}

export interface NailDiaryItem {
  id: string;
  title: string;
  date: string;
  master: string;
  shape: string;
  length: string;
  imageUrl: string;
  notes: string;
}

export interface GallerySet {
  id: string;
  title: string;
  category: 'goth' | 'neon' | 'cyber' | 'minimal';
  price: number;
  imageUrl: string;
  tags: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nezhity';
  text: string;
  time: string;
  suggestions?: string[];
}

export interface MascotReactionEvent {
  id: string;
  type: 'points' | 'quest' | 'streak' | 'cheer';
  amount?: number;
  label: string;
  sublabel?: string;
  timestamp: number;
}

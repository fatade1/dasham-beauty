// ─── Enums ────────────────────────────────────────────────────────────────────

export type PricingType = 'fixed' | 'range' | 'custom';
export type ServiceStatus = 'active' | 'inactive' | 'hidden';

export type BookingStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentStatus =
  | 'not_paid'
  | 'awaiting_confirmation'
  | 'part_payment_confirmed'
  | 'full_payment_confirmed'
  | 'rejected';

export type ServiceCategory =
  | 'Pedicure'
  | 'Massage'
  | 'Facials'
  | 'Lash Extensions'
  | 'Nails'
  | 'Body Treatments'
  | 'Waxing';

export type GalleryCategory =
  | 'Nails'
  | 'Lashes'
  | 'Facials'
  | 'Pedicure'
  | 'Spa'
  | 'Waxing'
  | 'Other';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  pricingType: PricingType;
  price?: number;           // for fixed-price
  minPrice?: number;        // for range
  maxPrice?: number;        // for range
  depositPercent: number;   // 50 for flexible, 100 for fixed
  status: ServiceStatus;
  imageUrl?: string;        // custom preview image (base64 data URL)
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string; // e.g. "10:00", "11:00"
  label: string; // e.g. "10:00 AM"
}

export interface Booking {
  id: string;
  // Customer
  customerName: string;
  phone: string;
  email: string;
  // Service
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  // Appointment
  preferredDate: string;   // ISO date string YYYY-MM-DD
  preferredTime: string;   // e.g. "10:00"
  notes: string;
  // Payment
  totalAmount: number;
  depositAmount: number;
  pricingType: PricingType;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentProof?: string;          // base64 data URL
  paymentProofName?: string;      // original filename
  transactionReference?: string;
  nameUsedForTransfer?: string;
  // Admin
  adminNote?: string;
  agreedToTerms: boolean;
  selectedServices?: {
    id: string;
    name: string;
    category: ServiceCategory;
    price: number;
    pricingType: PricingType;
    depositPercent: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  src: string;   // base64 data URL
  status: 'active' | 'inactive' | 'hidden';
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  address: string;
  phones: string[];
  whatsappNumbers: string[];
  instagram: string;
  tiktok: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  openingHours: string;
  adminPasswordHash: string;
}

// Flat settings shape used by admin settings page
export interface SiteSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  whatsappNumber: string;
  whatsappNumber2?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  adminPasswordHash: string;
}

export interface Availability {
  workingDays: number[];        // 0=Sun, 1=Mon, ... 6=Sat
  openTime: string;             // "10:00"
  closeTime: string;            // "19:00"
  slotDurationMinutes: number;  // 60
  blockedDates: string[];       // ["2024-12-25", ...]
  maxBookingsPerSlot: number;   // 1
}

export interface TermsContent {
  content: string;
  updatedAt: string;
}

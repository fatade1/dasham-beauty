import { PricingType, BookingStatus, PaymentStatus } from './types';

/**
 * Format a number as Nigerian Naira.
 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Format a price display string from a service's pricing data.
 */
export function formatPrice(
  pricingType: PricingType,
  price?: number,
  minPrice?: number,
  maxPrice?: number
): string {
  if (pricingType === 'fixed' && price != null) {
    return formatNaira(price);
  }
  if (pricingType === 'range' && minPrice != null && maxPrice != null) {
    return `${formatNaira(minPrice)} – ${formatNaira(maxPrice)}`;
  }
  return 'Price on consultation';
}

/**
 * Calculate deposit amount.
 */
export function calculateDeposit(total: number, depositPercent: number): number {
  return Math.round(total * (depositPercent / 100));
}

/**
 * Format a date string like "Tuesday, 3 June 2025".
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a time string like "10:00" → "10:00 AM".
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Generate a WhatsApp URL with a pre-filled message.
 */
export function whatsappUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  // Nigerian numbers need country code 234
  const intl = cleaned.startsWith('0') ? '234' + cleaned.slice(1) : cleaned;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

/**
 * Booking status display config.
 */
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; bg: string }
> = {
  pending_payment: {
    label: 'Pending Payment',
    color: '#92400e',
    bg: '#fef3c7',
  },
  payment_submitted: {
    label: 'Payment Submitted',
    color: '#1e40af',
    bg: '#dbeafe',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#065f46',
    bg: '#d1fae5',
  },
  completed: {
    label: 'Completed',
    color: '#374151',
    bg: '#f3f4f6',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#6b7280',
    bg: '#f9fafb',
  },
  rejected: {
    label: 'Rejected',
    color: '#991b1b',
    bg: '#fee2e2',
  },
};

/**
 * Payment status display config.
 */
export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string; bg: string }
> = {
  not_paid: { label: 'Not Paid', color: '#92400e', bg: '#fef3c7' },
  awaiting_confirmation: {
    label: 'Awaiting Confirmation',
    color: '#1e40af',
    bg: '#dbeafe',
  },
  part_payment_confirmed: {
    label: 'Part Payment Confirmed',
    color: '#065f46',
    bg: '#d1fae5',
  },
  full_payment_confirmed: {
    label: 'Full Payment Confirmed',
    color: '#064e3b',
    bg: '#a7f3d0',
  },
  rejected: { label: 'Rejected', color: '#991b1b', bg: '#fee2e2' },
};

/**
 * Service category icons mapping (emoji fallback for now).
 */
export const CATEGORY_ICONS: Record<string, string> = {
  Pedicure: '💅',
  Massage: '🤲',
  Facials: '✨',
  'Lash Extensions': '👁️',
  Nails: '💎',
  'Body Treatments': '🧖‍♀️',
  Waxing: '🌸',
};

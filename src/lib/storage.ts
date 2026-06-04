import {
  Service,
  Booking,
  GalleryImage,
  BusinessSettings,
  SiteSettings,
  Availability,
  TermsContent,
} from './types';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  SERVICES: 'dasham_services',
  BOOKINGS: 'dasham_bookings',
  GALLERY: 'dasham_gallery',
  SETTINGS: 'dasham_settings',
  AVAILABILITY: 'dasham_availability',
  TERMS: 'dasham_terms',
  INITIALIZED: 'dasham_initialized',
  AUTH: 'dasham_admin_auth',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Services ─────────────────────────────────────────────────────────────────
export function getServices(): Service[] {
  return getItem<Service[]>(KEYS.SERVICES) ?? [];
}

export function saveServices(services: Service[]): void {
  setItem(KEYS.SERVICES, services);
}

export function saveService(service: Service): void {
  const all = getServices();
  const idx = all.findIndex((s) => s.id === service.id);
  if (idx >= 0) {
    all[idx] = service;
  } else {
    all.push(service);
  }
  saveServices(all);
}

export function deleteService(id: string): void {
  saveServices(getServices().filter((s) => s.id !== id));
}

export function updateService(id: string, updates: Partial<Service>): void {
  const all = getServices();
  const idx = all.findIndex((s) => s.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    saveServices(all);
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export function getBookings(): Booking[] {
  return getItem<Booking[]>(KEYS.BOOKINGS) ?? [];
}

export function saveBookings(bookings: Booking[]): void {
  setItem(KEYS.BOOKINGS, bookings);
}

export function saveBooking(booking: Booking): void {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    all[idx] = booking;
  } else {
    all.push(booking);
  }
  saveBookings(all);
}

export function getBookingById(id: string): Booking | null {
  return getBookings().find((b) => b.id === id) ?? null;
}

export function updateBooking(id: string, updates: Partial<Booking>): void {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    saveBookings(all);
  }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export function getGallery(): GalleryImage[] {
  return getItem<GalleryImage[]>(KEYS.GALLERY) ?? [];
}

export function saveGallery(images: GalleryImage[]): void {
  setItem(KEYS.GALLERY, images);
}

export function saveGalleryImage(image: GalleryImage): void {
  const all = getGallery();
  all.push(image);
  saveGallery(all);
}

export function deleteGalleryImage(id: string): void {
  saveGallery(getGallery().filter((img) => img.id !== id));
}

export function updateGalleryImage(id: string, updates: Partial<GalleryImage>): void {
  const all = getGallery();
  const idx = all.findIndex((img) => img.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates };
    saveGallery(all);
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export function getSettings(): BusinessSettings {
  return (
    getItem<BusinessSettings>(KEYS.SETTINGS) ?? {
      businessName: 'Dasham Beauty Lounge',
      address: 'Opposite Kilimanjaro, Samonda, First Floor, Ibadan',
      phones: ['08143137185', '09027714768'],
      whatsappNumbers: ['08143137185', '09027714768'],
      instagram: 'dasham_beauty_lounge_',
      tiktok: 'dashambeautylounge_',
      bankName: 'Access Bank',
      accountName: 'Dasham Beauty Lounge',
      accountNumber: '0000000000',
      openingHours: 'Monday – Saturday: 10:00 AM – 7:00 PM',
      adminPasswordHash: 'dasham2024',
    }
  );
}

export function saveSettings(settings: BusinessSettings | SiteSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// Flat SiteSettings accessor for admin settings page
export function getSiteSettings(): SiteSettings {
  const raw = getItem<Record<string, unknown>>(KEYS.SETTINGS);
  return {
    bankName: (raw?.bankName as string) ?? 'Access Bank',
    accountName: (raw?.accountName as string) ?? 'Dasham Beauty Lounge',
    accountNumber: (raw?.accountNumber as string) ?? '0000000000',
    whatsappNumber: (raw?.whatsappNumber as string) ?? (Array.isArray(raw?.whatsappNumbers) ? raw!.whatsappNumbers[0] as string : '08143137185'),
    whatsappNumber2: (raw?.whatsappNumber2 as string) ?? (Array.isArray(raw?.whatsappNumbers) ? raw!.whatsappNumbers[1] as string : '09027714768'),
    instagramHandle: (raw?.instagramHandle as string) ?? (raw?.instagram as string) ?? 'dasham_beauty_lounge_',
    tiktokHandle: (raw?.tiktokHandle as string) ?? (raw?.tiktok as string) ?? 'dashambeautylounge_',
    adminPasswordHash: (raw?.adminPasswordHash as string) ?? 'dasham2024',
  };
}

// ─── Availability ─────────────────────────────────────────────────────────────
export function getAvailability(): Availability {
  return (
    getItem<Availability>(KEYS.AVAILABILITY) ?? {
      workingDays: [1, 2, 3, 4, 5, 6], // Mon–Sat
      openTime: '10:00',
      closeTime: '19:00',
      slotDurationMinutes: 60,
      blockedDates: [],
      maxBookingsPerSlot: 3,
    }
  );
}

export function saveAvailability(availability: Availability): void {
  setItem(KEYS.AVAILABILITY, availability);
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function getTerms(): TermsContent {
  return (
    getItem<TermsContent>(KEYS.TERMS) ?? {
      content: DEFAULT_TERMS,
      updatedAt: new Date().toISOString(),
    }
  );
}

export function saveTerms(content: string): void {
  setItem(KEYS.TERMS, { content, updatedAt: new Date().toISOString() });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export function setAdminAuth(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    sessionStorage.setItem(KEYS.AUTH, '1');
  } else {
    sessionStorage.removeItem(KEYS.AUTH);
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(KEYS.AUTH) === '1';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
export function isInitialized(): boolean {
  return getItem<boolean>(KEYS.INITIALIZED) === true;
}

export function markInitialized(): void {
  setItem(KEYS.INITIALIZED, true);
}

// ─── ID generator ─────────────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Time Slots ───────────────────────────────────────────────────────────────
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  durationMinutes: number
): { time: string; label: string }[] {
  const slots: { time: string; label: string }[] = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  let totalMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  while (totalMinutes + durationMinutes <= closeMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const period = h < 12 ? 'AM' : 'PM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const label = `${displayH}:${String(m).padStart(2, '0')} ${period}`;
    slots.push({ time, label });
    totalMinutes += durationMinutes;
  }
  return slots;
}

// ─── Default Terms ────────────────────────────────────────────────────────────
const DEFAULT_TERMS = `1. Appointments are strictly by booking only.

2. A 50% upfront payment is required to secure every appointment. Your booking will not be confirmed until payment has been received and verified.

3. Arriving 30 minutes late attracts an additional 10% fee on your total service cost.

4. Refunds are not offered for cancelled appointments. Your deposit is non-refundable.

5. If you will be late, please call at least 1 hour ahead so we can make arrangements.

6. If you cannot make your appointment, please inform us at least 24 hours in advance. Failure to do so will result in the loss of your deposit.

7. Dasham Beauty Lounge reserves the right to reschedule or cancel appointments at any time. In such cases, customers will be offered an alternative date.

8. All prices shown are subject to change. Final prices for flexible-price services will be confirmed at the lounge after consultation.

9. By booking an appointment, you confirm that you have read, understood, and agreed to these Terms & Conditions.`;

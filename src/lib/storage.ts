import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  Service,
  Booking,
  GalleryImage,
  BusinessSettings,
  SiteSettings,
  Availability,
  TermsContent,
} from './types';
import { DEFAULT_SERVICES } from './data/defaultServices';

// ─── Services ─────────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const services: Service[] = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() } as Service);
    });
    if (services.length === 0) {
      return DEFAULT_SERVICES;
    }
    return services;
  } catch (err) {
    console.error('Error getting services:', err);
    return DEFAULT_SERVICES;
  }
}

export async function saveServices(services: Service[]): Promise<void> {
  for (const s of services) {
    await saveService(s);
  }
}

export async function saveService(service: Service): Promise<void> {
  try {
    await setDoc(doc(db, 'services', service.id), service);
  } catch (err) {
    console.error('Error saving service:', err);
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (err) {
    console.error('Error deleting service:', err);
  }
}

export async function updateService(id: string, updates: Partial<Service>): Promise<void> {
  try {
    await updateDoc(doc(db, 'services', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error updating service:', err);
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export async function getBookings(): Promise<Booking[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    console.error('Error getting bookings:', err);
    return [];
  }
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  for (const b of bookings) {
    await saveBooking(b);
  }
}

export async function saveBooking(booking: Booking): Promise<void> {
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  } catch (err) {
    console.error('Error saving booking:', err);
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const docSnap = await getDoc(doc(db, 'bookings', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Booking;
    }
    return null;
  } catch (err) {
    console.error('Error getting booking by id:', err);
    return null;
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
  try {
    await updateDoc(doc(db, 'bookings', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error updating booking:', err);
  }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryImage[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const images: GalleryImage[] = [];
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() } as GalleryImage);
    });
    return images;
  } catch (err) {
    console.error('Error getting gallery:', err);
    return [];
  }
}

export async function saveGallery(images: GalleryImage[]): Promise<void> {
  for (const img of images) {
    await saveGalleryImage(img);
  }
}

export async function saveGalleryImage(image: GalleryImage): Promise<void> {
  try {
    await setDoc(doc(db, 'gallery', image.id), image);
  } catch (err) {
    console.error('Error saving gallery image:', err);
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (err) {
    console.error('Error deleting gallery image:', err);
  }
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<void> {
  try {
    await updateDoc(doc(db, 'gallery', id), updates);
  } catch (err) {
    console.error('Error updating gallery image:', err);
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: BusinessSettings = {
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
};

export async function getSettings(): Promise<BusinessSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'business'));
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as BusinessSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Error getting settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: BusinessSettings | SiteSettings): Promise<void> {
  try {
    const current = await getSettings();
    const merged = { ...current, ...settings };
    await setDoc(doc(db, 'settings', 'business'), merged);
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSettings();
  return {
    bankName: settings.bankName,
    accountName: settings.accountName,
    accountNumber: settings.accountNumber,
    whatsappNumber: settings.whatsappNumbers[0] || '08143137185',
    whatsappNumber2: settings.whatsappNumbers[1] || '09027714768',
    instagramHandle: settings.instagram,
    tiktokHandle: settings.tiktok,
    adminPasswordHash: settings.adminPasswordHash,
  };
}

// ─── Availability ─────────────────────────────────────────────────────────────
const DEFAULT_AVAILABILITY: Availability = {
  workingDays: [1, 2, 3, 4, 5, 6], // Mon–Sat
  openTime: '10:00',
  closeTime: '19:00',
  slotDurationMinutes: 60,
  blockedDates: [],
  maxBookingsPerSlot: 3,
};

export async function getAvailability(): Promise<Availability> {
  try {
    const docSnap = await getDoc(doc(db, 'availability', 'schedule'));
    if (docSnap.exists()) {
      return { ...DEFAULT_AVAILABILITY, ...docSnap.data() } as Availability;
    }
    return DEFAULT_AVAILABILITY;
  } catch (err) {
    console.error('Error getting availability:', err);
    return DEFAULT_AVAILABILITY;
  }
}

export async function saveAvailability(availability: Availability): Promise<void> {
  try {
    await setDoc(doc(db, 'availability', 'schedule'), availability);
  } catch (err) {
    console.error('Error saving availability:', err);
  }
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export async function getTerms(): Promise<TermsContent> {
  try {
    const docSnap = await getDoc(doc(db, 'terms', 'terms'));
    if (docSnap.exists()) {
      return docSnap.data() as TermsContent;
    }
    return {
      content: DEFAULT_TERMS,
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error getting terms:', err);
    return {
      content: DEFAULT_TERMS,
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function saveTerms(content: string): Promise<void> {
  try {
    await setDoc(doc(db, 'terms', 'terms'), {
      content,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error saving terms:', err);
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export function setAdminAuth(value: boolean): void {
  if (!value) {
    auth.signOut().catch((err) => console.error('Error signing out:', err));
  }
}

export function isAdminAuthenticated(): boolean {
  return auth.currentUser !== null && auth.currentUser.email === 'dashambeautylounge@gmail.com';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
export async function isInitialized(): Promise<boolean> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'init'));
    return docSnap.exists() && docSnap.data()?.initialized === true;
  } catch {
    return false;
  }
}

export async function markInitialized(): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'init'), { initialized: true });
  } catch (err) {
    console.error('Error marking initialized:', err);
  }
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

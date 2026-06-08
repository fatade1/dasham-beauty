import {
  getServices,
  saveServices,
  isInitialized,
  markInitialized,
} from './storage';
import { DEFAULT_SERVICES } from './data/defaultServices';

/**
 * Called on first app load to seed default data in Firestore.
 */
export async function initializeDefaultData(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const initialized = await isInitialized();
    if (initialized) return;

    // Only seed services if none exist in Firestore
    const currentServices = await getServices();
    if (currentServices.length === 0) {
      await saveServices(DEFAULT_SERVICES);
    }

    await markInitialized();
  } catch (err) {
    console.error('Error initializing default data in Firestore:', err);
  }
}

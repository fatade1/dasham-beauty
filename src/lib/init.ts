import {
  getServices,
  saveServices,
  isInitialized,
  markInitialized,
} from './storage';
import { DEFAULT_SERVICES } from './data/defaultServices';

/**
 * Called once on first app load to seed default data.
 */
export function initializeDefaultData(): void {
  if (typeof window === 'undefined') return;
  if (isInitialized()) return;

  // Only seed services if none exist
  if (getServices().length === 0) {
    saveServices(DEFAULT_SERVICES);
  }

  markInitialized();
}

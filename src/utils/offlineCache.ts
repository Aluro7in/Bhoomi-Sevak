/**
 * Bhoomi Sevak - Offline Storage & Cache Manager
 * Provides reliable, low-bandwidth & offline caching of Land Records,
 * Cadastral Parcels, Mutation Cases, and Document Locker items.
 */

const CACHE_KEYS = {
  LAND_RECORDS: 'bhoomi_cache_land_records',
  PARCELS: 'bhoomi_cache_parcels',
  MUTATIONS: 'bhoomi_cache_mutations',
  LOCKER_DOCS: 'bhoomi_cache_locker_docs',
  LAST_SYNC: 'bhoomi_cache_last_sync_timestamp',
  APP_METRICS: 'bhoomi_cache_app_metrics',
};

export interface CacheMetadata {
  lastSyncTime: string;
  totalRecordsCached: number;
  totalParcelsCached: number;
  totalMutationsCached: number;
  totalDocsCached: number;
  isOfflineMode: boolean;
}

export function saveToOfflineCache(key: keyof typeof CACHE_KEYS, data: any): void {
  try {
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify(data));
    localStorage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.warn('[OfflineCache] Failed to save key to localStorage:', key, err);
  }
}

export function getFromOfflineCache<T>(key: keyof typeof CACHE_KEYS, fallback: T): T {
  try {
    const raw = localStorage.getItem(CACHE_KEYS[key]);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn('[OfflineCache] Failed to read key from localStorage:', key, err);
    return fallback;
  }
}

export function getOfflineCacheMetadata(): CacheMetadata {
  const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
  const records = getFromOfflineCache<any[]>(CACHE_KEYS.LAND_RECORDS as any, []);
  const parcels = getFromOfflineCache<any[]>(CACHE_KEYS.PARCELS as any, []);
  const mutations = getFromOfflineCache<any[]>(CACHE_KEYS.MUTATIONS as any, []);
  const docs = getFromOfflineCache<any[]>(CACHE_KEYS.LOCKER_DOCS as any, []);

  return {
    lastSyncTime: lastSync ? new Date(lastSync).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'उपलब्ध नहीं',
    totalRecordsCached: records.length,
    totalParcelsCached: parcels.length,
    totalMutationsCached: mutations.length,
    totalDocsCached: docs.length,
    isOfflineMode: !navigator.onLine,
  };
}

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[ServiceWorker] Registered successfully with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[ServiceWorker] Registration failed (safe fallback to client cache):', err);
        });
    });
  }
}

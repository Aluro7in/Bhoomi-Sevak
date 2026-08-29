import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LandRecord, Citizen, LockerDocument, MutationApplication, CadastralParcel, TaskBundle } from '../types';
import {
  saveToOfflineCache,
  getFromOfflineCache,
  getOfflineCacheMetadata,
  registerServiceWorker,
  CacheMetadata,
} from '../utils/offlineCache';

export type Language = 'hi' | 'en';
export type ActiveTab = 'meri_zameen' | 'land_record' | 'cadastral_map' | 'bhulekh_locker' | 'document_intel' | 'mutation';
export type ThemeMode = 'light' | 'dark';
export type PublicPage = 'home' | 'about' | 'services' | 'how_it_works' | 'citizen_guide' | 'faq' | 'trust' | 'login';
export type ViewMode = 'public' | 'app';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (hi: string, en: string) => string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  // View & Public Routing
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  navigateToPublic: (page?: PublicPage) => void;
  navigateToApp: (tab?: ActiveTab, recordId?: string) => void;
  // Authenticated App Tabs
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: Citizen | null;
  setCurrentUser: (user: Citizen | null) => void;
  selectedRecord: LandRecord | null;
  setSelectedRecord: (record: LandRecord | null) => void;
  selectRecordById: (id: string) => Promise<LandRecord | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: LandRecord[];
  setSearchResults: (results: LandRecord[]) => void;
  isSearching: boolean;
  executeSearch: (query: string) => Promise<void>;
  parcels: CadastralParcel[];
  selectedParcel: CadastralParcel | null;
  setSelectedParcel: (parcel: CadastralParcel | null) => void;
  lockerDocs: LockerDocument[];
  addLockerDoc: (doc: LockerDocument) => void;
  mutations: MutationApplication[];
  selectedMutation: MutationApplication | null;
  setSelectedMutation: (mut: MutationApplication | null) => void;
  taskBundles: TaskBundle[];
  // Accessibility & Modes
  textSizeMultiplier: number;
  setTextSizeMultiplier: (val: number) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  showDisclaimer: boolean;
  setShowDisclaimer: (val: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (val: boolean) => void;
  // Offline & Caching Status
  isOffline: boolean;
  isUsingCachedData: boolean;
  cacheMetadata: CacheMetadata;
  syncCache: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('bhoomi_sevak_theme') as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // ignore
    }
    return 'light';
  });

  // Public Marketing Layer vs Authenticated Citizen App
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash.startsWith('#app') || params.get('tab') || params.get('record')) {
        return 'app';
      }
    } catch (e) {
      // fallback
    }
    return 'public';
  });

  const [publicPage, setPublicPage] = useState<PublicPage>(() => {
    try {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['about', 'services', 'how_it_works', 'how-it-works', 'citizen_guide', 'citizen-guide', 'faq', 'trust', 'login'].includes(hash)) {
        if (hash === 'how-it-works') return 'how_it_works';
        if (hash === 'citizen-guide') return 'citizen_guide';
        return hash as PublicPage;
      }
    } catch (e) {
      // fallback
    }
    return 'home';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('meri_zameen');
  const [currentUser, setCurrentUser] = useState<Citizen | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LandRecord[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [lockerDocs, setLockerDocs] = useState<LockerDocument[]>([]);
  const [mutations, setMutations] = useState<MutationApplication[]>([]);
  const [selectedMutation, setSelectedMutation] = useState<MutationApplication | null>(null);
  const [taskBundles, setTaskBundles] = useState<TaskBundle[]>([]);

  // Accessibility
  const [textSizeMultiplier, setTextSizeMultiplier] = useState<number>(1);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

  // Offline and Cache state
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isUsingCachedData, setIsUsingCachedData] = useState<boolean>(false);
  const [cacheMetadata, setCacheMetadata] = useState<CacheMetadata>(getOfflineCacheMetadata());

  // Helper bilingual translator
  const t = (hi: string, en: string) => (language === 'hi' ? hi : en);

  // Fetch record by ID
  const selectRecordById = useCallback(async (id: string): Promise<LandRecord | null> => {
    try {
      const res = await fetch(`/api/land-records/${id}`);
      if (!res.ok) throw new Error('Record not found');
      const data = await res.json();
      setSelectedRecord(data.record);
      if (data.relatedParcels?.length > 0) {
        setSelectedParcel(data.relatedParcels[0]);
      }
      return data.record;
    } catch (err) {
      console.error('Error fetching record, searching offline cache:', err);
      const cached = getFromOfflineCache<LandRecord[]>('LAND_RECORDS', []);
      const found = cached.find(r => r.id === id);
      if (found) {
        setSelectedRecord(found);
        setIsUsingCachedData(true);
        return found;
      }
      return null;
    }
  }, []);

  // Navigation router methods
  const navigateToPublic = useCallback((page: PublicPage = 'home') => {
    setViewMode('public');
    setPublicPage(page);
    try {
      window.history.pushState(null, '', page === 'home' ? '#' : `#${page}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // fallback
    }
  }, []);

  const navigateToApp = useCallback((tab?: ActiveTab, recordId?: string) => {
    setViewMode('app');
    if (tab) {
      setActiveTab(tab);
    }
    if (recordId) {
      selectRecordById(recordId);
    }
    try {
      const targetHash = tab ? `#app?tab=${tab}` : '#app';
      window.history.pushState(null, '', targetHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // fallback
    }
  }, [selectRecordById]);

  // Listen for browser back / forward buttons (popstate & hashchange)
  useEffect(() => {
    const handleHashOrPopState = () => {
      try {
        const hash = window.location.hash.toLowerCase().replace('#', '');
        if (hash.startsWith('app')) {
          setViewMode('app');
          const tabParamMatch = hash.match(/tab=([a-z_]+)/);
          if (tabParamMatch && tabParamMatch[1]) {
            setActiveTab(tabParamMatch[1] as ActiveTab);
          }
        } else {
          setViewMode('public');
          if (['about', 'services', 'how_it_works', 'how-it-works', 'citizen_guide', 'citizen-guide', 'faq', 'trust', 'login'].includes(hash)) {
            if (hash === 'how-it-works') setPublicPage('how_it_works');
            else if (hash === 'citizen-guide') setPublicPage('citizen_guide');
            else setPublicPage(hash as PublicPage);
          } else {
            setPublicPage('home');
          }
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('popstate', handleHashOrPopState);
    window.addEventListener('hashchange', handleHashOrPopState);
    return () => {
      window.removeEventListener('popstate', handleHashOrPopState);
      window.removeEventListener('hashchange', handleHashOrPopState);
    };
  }, []);

  // Sync cache function
  const syncCache = useCallback(async () => {
    try {
      const [userRes, recRes, parcRes, lockRes, mutRes, bunRes] = await Promise.allSettled([
        fetch('/api/citizens/current').then(r => r.json()),
        fetch('/api/land-records/search?q=Ramnagar').then(r => r.json()),
        fetch('/api/cadastral/parcels').then(r => r.json()),
        fetch('/api/locker/documents').then(r => r.json()),
        fetch('/api/mutations').then(r => r.json()),
        fetch('/api/bundles').then(r => r.json()),
      ]);

      if (userRes.status === 'fulfilled' && userRes.value) {
        setCurrentUser(userRes.value);
        saveToOfflineCache('APP_METRICS', { user: userRes.value });
      }
      if (recRes.status === 'fulfilled' && recRes.value?.records) {
        setSearchResults(recRes.value.records);
        saveToOfflineCache('LAND_RECORDS', recRes.value.records);
      }
      if (parcRes.status === 'fulfilled' && parcRes.value?.parcels) {
        setParcels(parcRes.value.parcels);
        saveToOfflineCache('PARCELS', parcRes.value.parcels);
      }
      if (lockRes.status === 'fulfilled' && lockRes.value?.documents) {
        setLockerDocs(lockRes.value.documents);
        saveToOfflineCache('LOCKER_DOCS', lockRes.value.documents);
      }
      if (mutRes.status === 'fulfilled' && mutRes.value?.applications) {
        setMutations(mutRes.value.applications);
        saveToOfflineCache('MUTATIONS', mutRes.value.applications);
      }
      if (bunRes.status === 'fulfilled' && bunRes.value?.bundles) {
        setTaskBundles(bunRes.value.bundles);
      }

      setIsUsingCachedData(false);
      setCacheMetadata(getOfflineCacheMetadata());
    } catch (err) {
      console.warn('[CacheSync] Failed network sync, reading cached fallback:', err);
      setIsUsingCachedData(true);
    }
  }, []);

  // Initial Data Fetch & Offline Listeners
  useEffect(() => {
    registerServiceWorker();

    const handleOnline = () => {
      setIsOffline(false);
      syncCache();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsUsingCachedData(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Deep link query parser
    const queryParams = new URLSearchParams(window.location.search);
    const linkedRecordId = queryParams.get('record');
    const linkedTab = queryParams.get('tab') as ActiveTab | null;
    const linkedMutationId = queryParams.get('mutation');

    if (linkedTab) {
      setActiveTab(linkedTab);
    }

    // Attempt initial loads with offline fallback
    // Current citizen
    fetch('/api/citizens/current')
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
      })
      .catch(err => {
        console.warn('Network issue loading citizen, using fallback', err);
        setIsUsingCachedData(true);
      });

    // Land records
    fetch('/api/land-records/search?q=Ramnagar')
      .then(res => res.json())
      .then(data => {
        if (data.records && data.records.length > 0) {
          saveToOfflineCache('LAND_RECORDS', data.records);
          setSearchResults(data.records);

          if (linkedRecordId) {
            const matched = data.records.find((r: LandRecord) => r.id === linkedRecordId);
            if (matched) {
              setSelectedRecord(matched);
              setActiveTab('land_record');
            } else {
              setSelectedRecord(data.records[0]);
            }
          } else {
            setSelectedRecord(data.records[0]);
          }
        }
      })
      .catch(err => {
        console.warn('Network issue loading records, loading offline cache', err);
        const cached = getFromOfflineCache<LandRecord[]>('LAND_RECORDS', []);
        if (cached.length > 0) {
          setSearchResults(cached);
          setSelectedRecord(cached[0]);
          setIsUsingCachedData(true);
        }
      });

    // Cadastral parcels
    fetch('/api/cadastral/parcels')
      .then(res => res.json())
      .then(data => {
        if (data.parcels) {
          saveToOfflineCache('PARCELS', data.parcels);
          setParcels(data.parcels);
          const defaultUserParcel = data.parcels.find((p: CadastralParcel) => p.isUserParcel);
          if (defaultUserParcel) setSelectedParcel(defaultUserParcel);
        }
      })
      .catch(err => {
        console.warn('Network issue loading parcels, loading offline cache', err);
        const cached = getFromOfflineCache<CadastralParcel[]>('PARCELS', []);
        if (cached.length > 0) {
          setParcels(cached);
          const defaultUserParcel = cached.find((p: CadastralParcel) => p.isUserParcel);
          if (defaultUserParcel) setSelectedParcel(defaultUserParcel);
          setIsUsingCachedData(true);
        }
      });

    // Locker documents
    fetch('/api/locker/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          saveToOfflineCache('LOCKER_DOCS', data.documents);
          setLockerDocs(data.documents);
        }
      })
      .catch(err => {
        console.warn('Network issue loading locker docs, loading offline cache', err);
        const cached = getFromOfflineCache<LockerDocument[]>('LOCKER_DOCS', []);
        if (cached.length > 0) {
          setLockerDocs(cached);
          setIsUsingCachedData(true);
        }
      });

    // Mutations
    fetch('/api/mutations')
      .then(res => res.json())
      .then(data => {
        if (data.applications) {
          saveToOfflineCache('MUTATIONS', data.applications);
          setMutations(data.applications);
          if (linkedMutationId) {
            const foundMut = data.applications.find((m: MutationApplication) => m.id === linkedMutationId);
            if (foundMut) {
              setSelectedMutation(foundMut);
              setActiveTab('mutation');
            } else if (data.applications.length > 0) {
              setSelectedMutation(data.applications[0]);
            }
          } else if (data.applications.length > 0) {
            setSelectedMutation(data.applications[0]);
          }
        }
      })
      .catch(err => {
        console.warn('Network issue loading mutations, loading offline cache', err);
        const cached = getFromOfflineCache<MutationApplication[]>('MUTATIONS', []);
        if (cached.length > 0) {
          setMutations(cached);
          setSelectedMutation(cached[0]);
          setIsUsingCachedData(true);
        }
      });

    // Task Bundles
    fetch('/api/bundles')
      .then(res => res.json())
      .then(data => setTaskBundles(data.bundles || []))
      .catch(err => console.error('Failed to load bundles', err));

    setCacheMetadata(getOfflineCacheMetadata());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncCache]);

  // Search Land Records
  const executeSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Step 1: AI Intent Parsing
      const intentRes = await fetch('/api/ai/search-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      const intentData = await intentRes.json();

      // Step 2: Deterministic Database Lookup
      const params = new URLSearchParams();
      if (intentData.extractedEntities?.ownerName) params.append('owner', intentData.extractedEntities.ownerName);
      if (intentData.extractedEntities?.village) params.append('village', intentData.extractedEntities.village);
      if (intentData.extractedEntities?.tehsil) params.append('tehsil', intentData.extractedEntities.tehsil);
      if (intentData.extractedEntities?.khasraNumber) params.append('khasra', intentData.extractedEntities.khasraNumber);
      if (intentData.extractedEntities?.khataNumber) params.append('khata', intentData.extractedEntities.khataNumber);

      // Fallback query if entities are sparse
      if (Array.from(params.keys()).length === 0) {
        params.append('q', query);
      }

      const searchRes = await fetch(`/api/land-records/search?${params.toString()}`);
      const searchData = await searchRes.json();
      setSearchResults(searchData.records || []);

      if (searchData.records?.length > 0) {
        setSelectedRecord(searchData.records[0]);
        saveToOfflineCache('LAND_RECORDS', searchData.records);
      }

      if (intentData.intent === 'mutation_status') {
        setActiveTab('mutation');
      } else if (intentData.intent === 'document_query') {
        setActiveTab('bhulekh_locker');
      } else {
        setActiveTab('land_record');
      }
    } catch (err) {
      console.error('Search execution failed, checking offline records:', err);
      const cached = getFromOfflineCache<LandRecord[]>('LAND_RECORDS', []);
      const qLower = query.toLowerCase();
      const filtered = cached.filter(
        r =>
          r.village.toLowerCase().includes(qLower) ||
          r.villageHi.includes(query) ||
          r.khasraNumbers.some(k => k.includes(query)) ||
          r.khataNumber.includes(query) ||
          r.owners.some(o => o.name.toLowerCase().includes(qLower) || o.nameHi.includes(query))
      );
      if (filtered.length > 0) {
        setSearchResults(filtered);
        setSelectedRecord(filtered[0]);
        setActiveTab('land_record');
        setIsUsingCachedData(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const addLockerDoc = (doc: LockerDocument) => {
    setLockerDocs(prev => {
      const updated = [doc, ...prev];
      saveToOfflineCache('LOCKER_DOCS', updated);
      return updated;
    });
  };

  // Web Speech synthesis for accessibility / citizen read-out
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Slightly slower for clear rural comprehension
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Theme synchronization effect
  useEffect(() => {
    try {
      localStorage.setItem('bhoomi_sevak_theme', theme);
    } catch (e) {
      // ignore
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        // Public Routing & App View Modes
        viewMode,
        setViewMode,
        publicPage,
        setPublicPage,
        navigateToPublic,
        navigateToApp,
        // Authenticated App States
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        selectedRecord,
        setSelectedRecord,
        selectRecordById,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        executeSearch,
        parcels,
        selectedParcel,
        setSelectedParcel,
        lockerDocs,
        addLockerDoc,
        mutations,
        selectedMutation,
        setSelectedMutation,
        taskBundles,
        textSizeMultiplier,
        setTextSizeMultiplier,
        highContrast,
        setHighContrast,
        lowDataMode,
        setLowDataMode,
        isSpeaking,
        speakText,
        stopSpeaking,
        showDisclaimer,
        setShowDisclaimer,
        showLoginModal,
        setShowLoginModal,
        isVoiceActive,
        setIsVoiceActive,
        isOffline,
        isUsingCachedData,
        cacheMetadata,
        syncCache,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


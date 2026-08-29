import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MeriZameenHome } from './components/MeriZameenHome';
import { LandRecordDetail } from './components/LandRecordDetail';
import { CadastralMapView } from './components/CadastralMapView';
import { BhulekhLocker } from './components/BhulekhLocker';
import { DocumentIntelligence } from './components/DocumentIntelligence';
import { MutationTracker } from './components/MutationTracker';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { UserSwitchModal } from './components/UserSwitchModal';
import { PublicPortal } from './components/public/PublicPortal';
import { ShieldCheck, Info, Sparkles, MapPin, FileText, Database, WifiOff, Wifi, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    viewMode,
    activeTab,
    t,
    setShowDisclaimer,
    language,
    theme,
    isOffline,
    isUsingCachedData,
    cacheMetadata,
    syncCache,
  } = useApp();

  // If currently in Public Information / Marketing Portal mode
  if (viewMode === 'public') {
    return (
      <div data-theme={theme} className="min-h-screen">
        <PublicPortal />
        <VoiceSearchModal />
        <DisclaimerModal />
        <UserSwitchModal />
      </div>
    );
  }

  // Authenticated Citizen Application Mode
  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-150 ${
        theme === 'dark' ? 'bg-[#0c0e14] text-[#f4f4f6] dark' : 'bg-[#f7f5f0] text-[#1c1917]'
      }`}
    >
      {/* Top Civic Navigation & Accessibility Header */}
      <Header />

      {/* Offline Alert Banner if offline */}
      {isOffline && (
        <div className="bg-[#fff7ed] border-b border-[#fed7aa] px-4 py-2 text-xs text-[#9a3412] flex items-center justify-between font-medium">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span>
                {t(
                  'आप वर्तमान में ऑफ़लाइन मोड में हैं। सहेजे गए भू-अभिलेख स्थानीय कैश से प्रदर्शित हो रहे हैं।',
                  'You are currently in offline mode. Land records are being served from local offline cache.'
                )}
              </span>
            </div>
            <button
              onClick={() => syncCache()}
              className="px-2.5 py-1 rounded bg-[#ea580c] text-white text-[11px] font-bold uppercase tracking-wider shrink-0 hover:bg-[#c2410c]"
            >
              {t('पुनः प्रयास', 'Retry')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5">
        {activeTab === 'meri_zameen' && <MeriZameenHome />}
        {activeTab === 'land_record' && <LandRecordDetail />}
        {activeTab === 'cadastral_map' && <CadastralMapView />}
        {activeTab === 'bhulekh_locker' && <BhulekhLocker />}
        {activeTab === 'document_intel' && <DocumentIntelligence />}
        {activeTab === 'mutation' && <MutationTracker />}
      </main>

      {/* Modals & Voice Portals */}
      <VoiceSearchModal />
      <DisclaimerModal />
      <UserSwitchModal />

      {/* Trust & Civic Verification Footer */}
      <footer className="mt-auto bg-[#eee9dc] border-t border-[#dfd8c7] py-6 px-4 sm:px-6 text-xs text-[#57534e]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <div className="w-7 h-7 rounded-md bg-[#143d2b] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                भू
              </div>
              <div>
                <div className="font-bold text-[#1c1917] flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>भूमि सेवक (Bhoomi Sevak)</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#e2dcce] text-[#143d2b]">
                    नागरिक सहायता
                  </span>
                </div>
                <p className="text-[11px] text-[#78716c] mt-0.5">
                  {t('नागरिक केंद्रित भू-अभिलेख इंटरफेस • उत्तर प्रदेश भूलेख प्रारूप संगत', 'Citizen-Centric Land Records Interface • UP Bhulekh Format Compliant')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center text-[#57534e]">
              <button
                onClick={() => setShowDisclaimer(true)}
                className="hover:text-[#143d2b] underline font-semibold transition-colors flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-[#143d2b]" />
                <span>{t('सिंथेटिक डेटा प्रकटीकरण एवं सुरक्षा', 'Synthetic Data Disclosure & Trust')}</span>
              </button>
              <span className="text-[#cfc7b4]">•</span>
              <span className="text-[#143d2b] font-bold text-[11px] uppercase tracking-wider bg-[#e2dcce] px-2 py-0.5 rounded">
                Build What Moves India
              </span>
            </div>
          </div>

          {/* Cached Data & Network Health Bar */}
          <div className="pt-3 border-t border-[#dfd8c7] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#78716c]">
            <div className="flex items-center gap-2">
              {isUsingCachedData || isOffline ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold">
                  <Database className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>
                    {t('कैश्ड डेटा सक्रिय (Offline Cached Data Active)', 'Cached Data Mode Active')}
                  </span>
                  {cacheMetadata.lastUpdated && (
                    <span className="font-mono text-[10px] text-[#b45309]">
                      • {new Date(cacheMetadata.lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eef6f0] text-[#166534] border border-[#d1e7dd] font-semibold">
                  <Wifi className="w-3.5 h-3.5 text-[#166534]" />
                  <span>{t('लाइव डेटा सिंक सक्रिय • ऑफ़लाइन कैश सुरक्षित', 'Live Sync Active • Offline Cache Ready')}</span>
                </div>
              )}

              <span className="hidden sm:inline text-[#a8a29e]">|</span>
              <span className="hidden sm:inline">
                {t('लोकल स्टोरेज में सहेजे गए रिकॉर्ड: ', 'Locally Cached Records: ')}
                <strong className="text-[#1c1917]">{cacheMetadata.recordCount}</strong>
              </span>
            </div>

            <button
              onClick={() => syncCache()}
              className="flex items-center gap-1 text-[#143d2b] hover:underline font-semibold"
              title="कैश डेटा रीफ्रेश करें (Refresh Cache)"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('डेटा पुनः सिंक करें', 'Sync Data Cache')}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

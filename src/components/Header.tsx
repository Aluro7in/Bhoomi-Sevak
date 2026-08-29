import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BhoomiSevakLogo } from './BhoomiSevakLogo';
import { HelpModal } from './HelpModal';
import {
  FileText,
  MapPin,
  FolderLock,
  VolumeX,
  Languages,
  Info,
  Activity,
  Sparkles,
  WifiOff,
  Eye,
  Sliders,
  ChevronDown,
  Sun,
  Moon,
  Home,
  User,
  Settings,
  X,
  HelpCircle,
  Check,
  Globe,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    navigateToPublic,
    currentUser,
    selectedRecord,
    isSpeaking,
    stopSpeaking,
    highContrast,
    setHighContrast,
    lowDataMode,
    setLowDataMode,
    textSizeMultiplier,
    setTextSizeMultiplier,
    setShowDisclaimer,
    setShowLoginModal,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const cycleTextSize = () => {
    if (textSizeMultiplier === 1) setTextSizeMultiplier(1.15);
    else if (textSizeMultiplier === 1.15) setTextSizeMultiplier(1.25);
    else setTextSizeMultiplier(1);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e7e2d8] shadow-2xs select-none">
      {/* 1. Main Header Row: Brand Identity & Unified Menu */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('meri_zameen')}
          id="header-brand-logo"
        >
          <BhoomiSevakLogo size="sm" variant="color" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#1e212b] leading-none">
                {language === 'hi' ? 'भूमि सेवक' : 'Bhoomi Sevak'}
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2]">
                {t('नागरिक सेवा', 'Citizen Portal')}
              </span>
            </div>
            <p className="text-[11px] text-[#767d8f] font-medium mt-0.5">
              {t('आपकी जमीन, आपकी भाषा में • उत्तर प्रदेश राजस्व सेवा', 'Land records in simple natural language • UP Revenue Services')}
            </p>
          </div>
        </div>

        {/* Right Utility Group: Quick Language Switch, Audio Alert, & Unified Menu */}
        <div className="flex items-center gap-2">
          {/* Audio Stop Button (active only during TTS) */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse shadow-xs cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>{t('आवाज रोकें', 'Stop Voice')}</span>
            </button>
          )}

          {/* Quick Return to Public Information Portal */}
          <button
            onClick={() => navigateToPublic('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-[#faf9f6] hover:bg-[#f4f2f9] text-[#4b5162] hover:text-[#5e4db2] border border-[#e7e2d8] transition-all cursor-pointer shadow-2xs"
            title={t('मुख्य पोर्टल व नागरिक मार्गदर्शिका', 'Public Information Portal & Guides')}
          >
            <Globe className="w-3.5 h-3.5 text-[#5e4db2]" />
            <span>{t('मुख्य पोर्टल', 'Public Portal')}</span>
          </button>

          {/* Quick Bilingual Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-[#f4f2f9] hover:bg-[#ebe6f7] text-[#5e4db2] border border-[#e5dff2] transition-all cursor-pointer"
            title={t('भाषा बदलें (Switch Language)', 'Switch Language')}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Unified Utility & Profile Menu */}
          <div className="relative" ref={menuRef}>
            <button
              id="btn-unified-user-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                menuOpen
                  ? 'bg-[#5e4db2] text-white border-[#5e4db2] shadow-xs'
                  : 'bg-[#faf9f6] hover:bg-[#f5f3fa] text-[#1e212b] border-[#e7e2d8]'
              }`}
              title={t('सेटिंग्स व नागरिक प्रोफ़ाइल', 'Settings & Citizen Profile')}
            >
              <div
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                  menuOpen
                    ? 'bg-white/20 text-white'
                    : 'bg-[#5e4db2] text-white'
                }`}
              >
                {currentUser?.name ? currentUser.name[0] : 'R'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold flex items-center gap-1">
                  <span>{language === 'hi' ? currentUser?.nameHi || 'राम कुमार सिंह' : currentUser?.name || 'Ram Kumar Singh'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <Settings className="w-4 h-4 sm:hidden" />
            </button>

            {/* Unified Menu Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#ffffff] rounded-2xl border border-[#e7e2d8] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                {/* 1. Citizen Profile Section */}
                <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d8]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#5e4db2] text-white font-bold flex items-center justify-center text-sm">
                      {currentUser?.name ? currentUser.name[0] : 'R'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e212b]">
                        {language === 'hi' ? currentUser?.nameHi || 'राम कुमार सिंह' : currentUser?.name || 'Ram Kumar Singh'}
                      </div>
                      <div className="text-[11px] text-[#767d8f]">
                        {language === 'hi' ? 'ग्राम रामनगर, तहसील बिलारी' : 'Village Ramnagar, Bilari'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="text-xs text-[#5e4db2] font-semibold hover:underline bg-[#f4f2f9] px-2.5 py-1 rounded-lg border border-[#e5dff2]"
                  >
                    {t('बदलें', 'Switch')}
                  </button>
                </div>

                {/* 2. Preferences & Accessibility Group */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#767d8f] block">
                    {t('प्रदर्शन व सुगमता (Preferences)', 'Display & Accessibility')}
                  </span>

                  {/* Theme Switcher */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-[#1e212b] flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d97706]" /> : <Moon className="w-4 h-4 text-[#5e4db2]" />}
                      <span>{t('थीम (Theme)', 'App Theme')}</span>
                    </span>
                    <button
                      onClick={toggleTheme}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#faf9f6] hover:bg-[#f4f2f9] border border-[#e7e2d8] text-[#1e212b]"
                    >
                      {theme === 'dark' ? t('लाइट मोड', 'Light Mode') : t('डार्क मोड', 'Dark Mode')}
                    </button>
                  </div>

                  {/* Text Size Multiplier */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-[#1e212b] flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('अक्षर का आकार', 'Text Size')}</span>
                    </span>
                    <button
                      onClick={cycleTextSize}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#faf9f6] hover:bg-[#f4f2f9] border border-[#e7e2d8] text-[#5e4db2]"
                    >
                      {textSizeMultiplier === 1 ? '1x (सामान्य)' : `${textSizeMultiplier}x`}
                    </button>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-[#1e212b] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('उच्च कंट्रास्ट', 'High Contrast')}</span>
                    </span>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        highContrast
                          ? 'bg-[#facc15] text-black border-[#facc15]'
                          : 'bg-[#faf9f6] text-[#1e212b] border-[#e7e2d8]'
                      }`}
                    >
                      {highContrast ? t('चालू (ON)', 'ON') : t('बंद (OFF)', 'OFF')}
                    </button>
                  </div>

                  {/* Low Data Mode */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-[#1e212b] flex items-center gap-2">
                      <WifiOff className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('लो-डेटा मोड', 'Low Data Mode')}</span>
                    </span>
                    <button
                      onClick={() => setLowDataMode(!lowDataMode)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        lowDataMode
                          ? 'bg-[#c2410c] text-white border-[#c2410c]'
                          : 'bg-[#faf9f6] text-[#1e212b] border-[#e7e2d8]'
                      }`}
                    >
                      {lowDataMode ? t('चालू (ON)', 'ON') : t('बंद (OFF)', 'OFF')}
                    </button>
                  </div>
                </div>

                {/* 3. Help & Privacy Section */}
                <div className="pt-2 border-t border-[#e7e2d8] space-y-1.5">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setHelpModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-[#1e212b] hover:bg-[#f4f2f9] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#5e4db2] font-semibold">
                      <HelpCircle className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('सहायता व राजस्व संपर्क निर्देशिका', 'Help & Revenue Directory')}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#767d8f]" />
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigateToPublic('home');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-[#1e212b] hover:bg-[#f4f2f9] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#555968] font-medium">
                      <Globe className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('सार्वजनिक पोर्टल व नागरिक गाइड', 'Public Portal & Citizen Guides')}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#767d8f]" />
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDisclaimer(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-[#1e212b] hover:bg-[#faf9f6] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#555968]">
                      <Info className="w-4 h-4 text-[#5e4db2]" />
                      <span>{t('सिंथेटिक डेटा व गोपनीयता सूचना', 'Synthetic Data & Privacy Notice')}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#767d8f]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Primary Civic Navigation Bar: Home, My Land, Documents, Map, Applications */}
      <nav className="bg-[#faf9f6] border-t border-[#e7e2d8] px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1.5 no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* 1. Home */}
            <button
              id="nav-home"
              onClick={() => setActiveTab('meri_zameen')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'meri_zameen'
                  ? 'bg-[#5e4db2] text-white shadow-xs font-semibold'
                  : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5] font-medium'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('होम', 'Home')}</span>
            </button>

            {/* 2. My Land / Land Record */}
            <button
              id="nav-my-land"
              onClick={() => setActiveTab('land_record')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'land_record'
                  ? 'bg-[#5e4db2] text-white shadow-xs font-semibold'
                  : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5] font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('मेरी ज़मीन', 'My Land')}</span>
              {selectedRecord && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    activeTab === 'land_record'
                      ? 'bg-[#4a3b8e] text-[#f4f2f9]'
                      : 'bg-[#e7e2d8] text-[#5e4db2]'
                  }`}
                >
                  #{selectedRecord.khataNumber}
                </span>
              )}
            </button>

            {/* 3. Documents / Bhulekh Locker */}
            <button
              id="nav-documents"
              onClick={() => setActiveTab('bhulekh_locker')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'bhulekh_locker'
                  ? 'bg-[#5e4db2] text-white shadow-xs font-semibold'
                  : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5] font-medium'
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>{t('दस्तावेज़ (लॉकर)', 'Documents')}</span>
            </button>

            {/* 4. Cadastral Map */}
            <button
              id="nav-map"
              onClick={() => setActiveTab('cadastral_map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'cadastral_map'
                  ? 'bg-[#5e4db2] text-white shadow-xs font-semibold'
                  : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5] font-medium'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t('भू-नक्शा', 'Map')}</span>
            </button>

            {/* 5. Mutation / Applications */}
            <button
              id="nav-applications"
              onClick={() => setActiveTab('mutation')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'mutation'
                  ? 'bg-[#5e4db2] text-white shadow-xs font-semibold'
                  : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5] font-medium'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t('आवेदन स्थिति', 'Applications')}</span>
              <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
            </button>
          </div>

          {/* Quick OCR / Scan Action */}
          <button
            id="nav-scan-ocr"
            onClick={() => setActiveTab('document_intel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'document_intel'
                ? 'bg-[#5e4db2] text-white font-semibold'
                : 'text-[#5e4db2] bg-[#ffffff] border border-[#e7e2d8] hover:bg-[#f4f2f9] font-semibold'
            }`}
            title={t('कागज़ से जमीन खोजें (Document AI & OCR)', 'Document AI & OCR')}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{t('दस्तावेज़ स्कैन करें', 'Scan Document')}</span>
          </button>
        </div>
      </nav>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </header>
  );
};



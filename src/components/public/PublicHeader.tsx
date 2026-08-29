import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicPage } from '../../context/AppContext';
import { BhoomiSevakLogo } from '../BhoomiSevakLogo';
import { HelpModal } from '../HelpModal';
import {
  Globe,
  Languages,
  Eye,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  HelpCircle,
  BookOpen,
  LogIn,
  Sparkles,
  PhoneCall,
  Volume2,
  ZoomIn,
  Check,
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    publicPage,
    navigateToPublic,
    navigateToApp,
    textSizeMultiplier,
    setTextSizeMultiplier,
    highContrast,
    setHighContrast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const handleTextSize = (multiplier: number) => {
    setTextSizeMultiplier(multiplier);
  };

  const navItems: { id: PublicPage; labelHi: string; labelEn: string; icon: any }[] = [
    { id: 'home', labelHi: 'होम', labelEn: 'Home', icon: Globe },
    { id: 'about', labelHi: 'परिचय', labelEn: 'About', icon: Building2 },
    { id: 'services', labelHi: 'सेवाएं', labelEn: 'Services', icon: FileText },
    { id: 'how_it_works', labelHi: 'कार्यप्रणाली', labelEn: 'How It Works', icon: Sparkles },
    { id: 'citizen_guide', labelHi: 'नागरिक गाइड', labelEn: 'Citizen Guide', icon: BookOpen },
    { id: 'faq', labelHi: 'सहायता व प्रश्न', labelEn: 'FAQ & Help', icon: HelpCircle },
    { id: 'trust', labelHi: 'विश्वसनीयता', labelEn: 'Trust & Privacy', icon: ShieldCheck },
  ];

  const handleNavClick = (page: PublicPage) => {
    navigateToPublic(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e9e5f5] shadow-xs select-none">
      {/* 1. TOP UTILITY BAR (Formal Indian Civic Portal Styling) */}
      <div className="bg-[#1e1a34] text-[#f4f2f9] text-[11px] font-medium border-b border-[#2d284d] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Government Affiliation & State Banner */}
          <div className="flex items-center gap-2.5 truncate">
            <span className="font-bold tracking-wide text-amber-300">
              {language === 'hi' ? 'उत्तर प्रदेश सरकार' : 'Government of Uttar Pradesh'}
            </span>
            <span className="text-[#7c75a0] hidden sm:inline">•</span>
            <span className="text-[#d8d3ec] font-normal hidden sm:inline truncate">
              {language === 'hi'
                ? 'राजस्व परिषद • डिजिटल भू-अभिलेख नागरिक सेवा (प्रोटोटाइप)'
                : 'Board of Revenue • Digital Land Records Citizen Service (Prototype)'}
            </span>
          </div>

          {/* Utility Controls: Text Size, High Contrast, Help, Language */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Accessibility: Text Sizing (A- / A / A+) */}
            <div className="flex items-center bg-[#2b254a] rounded border border-[#3e3766] px-1 py-0.5 text-[10px]">
              <span className="text-[#a59ec7] mr-1 hidden md:inline">{t('अक्षर आकार', 'Text Size')}:</span>
              <button
                onClick={() => handleTextSize(0.9)}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
                  textSizeMultiplier === 0.9 ? 'bg-[#5e4db2] text-white font-bold' : 'text-[#d8d3ec]'
                }`}
                title={t('छोटा अक्षर (A-)', 'Smaller Text (A-)')}
              >
                A-
              </button>
              <button
                onClick={() => handleTextSize(1.0)}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
                  textSizeMultiplier === 1.0 ? 'bg-[#5e4db2] text-white font-bold' : 'text-[#d8d3ec]'
                }`}
                title={t('सामान्य अक्षर (A)', 'Default Text (A)')}
              >
                A
              </button>
              <button
                onClick={() => handleTextSize(1.15)}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
                  textSizeMultiplier === 1.15 ? 'bg-[#5e4db2] text-white font-bold' : 'text-[#d8d3ec]'
                }`}
                title={t('बड़ा अक्षर (A+)', 'Larger Text (A+)')}
              >
                A+
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                highContrast
                  ? 'bg-amber-400 text-black border-amber-400 font-bold'
                  : 'bg-[#2b254a] text-[#d8d3ec] border-[#3e3766] hover:text-white'
              }`}
              title={t('उच्च कंट्रास्ट मोड', 'High Contrast Mode')}
            >
              <Eye className="w-3 h-3" />
              <span>{highContrast ? 'HC ON' : 'HC'}</span>
            </button>

            {/* Help Quick Link (Opens Help Modal) */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="flex items-center gap-1 text-[#d8d3ec] hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#2b254a] text-[11px]"
              title={t('सहायता व संपर्क निर्देशिका (Help & Directory)', 'Help & Revenue Directory')}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold">{t('सहायता', 'Help')}</span>
            </button>

            <span className="w-px h-3.5 bg-[#3e3766]" />

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#f5f3fa] hover:bg-white text-[#1e1a34] font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
              title={t('भाषा बदलें (Switch Language)', 'Switch Language')}
            >
              <Languages className="w-3 h-3 text-[#5e4db2]" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW (White/Ivory Canvas, Bhoomi Sevak Branding, Dignitary Portrait Slots, Action CTAs) */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Left Side: Bhoomi Sevak Brand Mark & Citizen Tagline */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          id="public-header-logo"
        >
          <BhoomiSevakLogo size="md" variant="color" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                {language === 'hi' ? 'भूमि सेवक' : 'Bhoomi Sevak'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2] hidden sm:inline">
                {t('नागरिक भू-अभिलेख सेवा', 'Citizen Land Service')}
              </span>
            </div>
            <p className="text-xs text-[#52525b] font-medium mt-1">
              {language === 'hi'
                ? 'आपकी जमीन, आपकी भाषा में • सरल, पारदर्शी व सत्यापित भू-अभिलेख'
                : 'Your Land, In Your Language • Simple, Transparent & Verified Land Records'}
            </p>
          </div>
        </div>

        {/* Center / Right: Dignitary Portrait Slots (Small, Secondary, Dignified) */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6 border-l border-r border-[#ede9f7] px-4 lg:px-6">
          {/* Portrait 1: Prime Minister of India */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden ring-2 ring-[#e5dff2] shadow-2xs shrink-0 bg-[#faf9fc]">
              <img
                src="/images/portraits/pm_narendra_modi.png"
                alt="Shri Narendra Modi"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Clean fallback if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] font-bold text-slate-900 tracking-tight">
                {language === 'hi' ? 'श्री नरेन्द्र मोदी' : 'Shri Narendra Modi'}
              </div>
              <div className="text-[9.5px] font-medium text-[#64748b]">
                {language === 'hi' ? 'माननीय प्रधानमंत्री, भारत' : "Hon'ble Prime Minister, India"}
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-[#ede9f7]" />

          {/* Portrait 2: Chief Minister of Uttar Pradesh */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden ring-2 ring-[#e5dff2] shadow-2xs shrink-0 bg-[#faf9fc]">
              <img
                src="/images/portraits/cm_yogi_adityanath.jpg"
                alt="Shri Yogi Adityanath"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Clean fallback if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] font-bold text-slate-900 tracking-tight">
                {language === 'hi' ? 'श्री योगी आदित्यनाथ' : 'Shri Yogi Adityanath'}
              </div>
              <div className="text-[9.5px] font-medium text-[#64748b]">
                {language === 'hi' ? 'माननीय मुख्यमंत्री, उत्तर प्रदेश' : "Hon'ble Chief Minister, UP"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login & Get Started CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleNavClick('login')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              publicPage === 'login'
                ? 'bg-[#5e4db2] text-white shadow-xs'
                : 'bg-[#faf9fc] text-[#2e264f] border border-[#e5dff2] hover:bg-[#f4f2f9] hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#5e4db2]" />
            <span>{t('नागरिक लॉगिन', 'Citizen Login')}</span>
          </button>

          <button
            onClick={() => navigateToApp('meri_zameen')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4c3a9e] to-[#5e4db2] hover:from-[#3f2f8a] hover:to-[#50409c] text-white text-xs font-bold tracking-wide shadow-xs flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{t('शुरू करें', 'Get Started')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
          </button>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-xl bg-[#faf9fc] border border-[#e5dff2] text-slate-800 hover:bg-[#f4f2f9] cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
        </button>
      </div>

      {/* 3. PRIMARY CIVIC NAVIGATION TABS */}
      <nav className="hidden lg:block bg-[#faf9fc] border-t border-[#ede9f7] px-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 py-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = publicPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5e4db2] text-white shadow-xs'
                      : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#ede8f5]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-200' : 'text-[#767d8f]'}`} />
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#52525b]">
            <PhoneCall className="w-3.5 h-3.5 text-[#5e4db2]" />
            <span className="font-semibold text-slate-700">
              {t('नागरिक हेल्पलाइन: 1800-180-0111 (टोल-फ्री)', 'Citizen Helpline: 1800-180-0111 (Toll-Free)')}
            </span>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e9e5f5] p-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
          {/* Mobile Dignitary Mention */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#faf9fc] border border-[#ede9f7]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#e5dff2] shrink-0">
                <img
                  src="/images/portraits/pm_narendra_modi.png"
                  alt="Shri Narendra Modi"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-900 leading-tight">
                  {language === 'hi' ? 'श्री नरेन्द्र मोदी' : 'Shri Narendra Modi'}
                </div>
                <div className="text-[8.5px] text-[#64748b]">
                  {language === 'hi' ? 'माननीय प्रधानमंत्री' : "Hon'ble PM"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#e5dff2] shrink-0">
                <img
                  src="/images/portraits/cm_yogi_adityanath.jpg"
                  alt="Shri Yogi Adityanath"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-900 leading-tight">
                  {language === 'hi' ? 'श्री योगी आदित्यनाथ' : 'Shri Yogi Adityanath'}
                </div>
                <div className="text-[8.5px] text-[#64748b]">
                  {language === 'hi' ? 'माननीय मुख्यमंत्री' : "Hon'ble CM"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = publicPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#5e4db2] text-white'
                      : 'bg-[#faf9fc] text-[#1e212b] hover:bg-[#f4f2f9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-200' : 'text-[#5e4db2]'}`} />
                    <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#ede9f7] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2] flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#5e4db2]" />
              <span>{t('सहायता निर्देशिका', 'Help & Directory')}</span>
            </button>

            <button
              onClick={() => handleNavClick('login')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#faf9fc] text-slate-800 border border-[#e5dff2] flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#5e4db2]" />
              <span>{t('नागरिक लॉगिन', 'Login')}</span>
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateToApp('meri_zameen');
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4c3a9e] to-[#5e4db2] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>{t('शुरू करें', 'Get Started')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
          </button>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </header>
  );
};


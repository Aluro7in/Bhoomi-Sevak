import React from 'react';
import { useApp } from '../../context/AppContext';
import { PublicPage } from '../../context/AppContext';
import {
  Globe,
  ShieldCheck,
  Phone,
  HelpCircle,
  FileText,
  MapPin,
  FolderLock,
  Activity,
  ArrowRight,
  Info,
  ExternalLink,
  BookOpen,
  Lock,
  Landmark,
  Scale,
  Sparkles,
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { language, t, navigateToPublic, navigateToApp, setShowDisclaimer } = useApp();

  const handleNav = (page: PublicPage) => {
    navigateToPublic(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1329] text-[#cbd5e1] border-t border-sky-950 pt-12 pb-8 px-4 sm:px-6 select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top 4-Column Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-sky-900/40">
          {/* Column 1: Brand & Core Thesis */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex flex-col items-center justify-center font-bold shadow-xs">
                <span className="text-base font-black leading-none">भू</span>
                <span className="text-[9px] font-bold text-sky-200">सेवक</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {language === 'hi' ? 'भूमि सेवक' : 'Bhoomi Sevak'}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                  {t('नागरिक भू-अभिलेख इंटरफेस', 'Citizen Land Records AI')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                '"नागरिक को प्रशासनिक शब्दावली न सीखनी पड़े; सिस्टम नागरिक की भाषा समझे।" — उत्तर प्रदेश के 4.5+ करोड़ भू-स्वामियों के लिए सरल, पारदर्शी एवं एआई-सक्षम नागरिक सेवा।',
                '"Don\'t make citizens learn the bureaucracy. Make the system understand the citizen." — A natural-language citizen interaction layer for 4.5+ crore landowners in Uttar Pradesh.'
              )}
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-950/80 border border-sky-800/60 text-[11px] text-sky-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>{t('Build What Moves India पहल', 'Build What Moves India Initiative')}</span>
            </div>
          </div>

          {/* Column 2: Public Informational Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{t('पोर्टल सूचना एवं गाइड', 'Portal Information & Guides')}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('परिचय व मिशन (About Mission)', 'About Bhoomi Sevak')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('5 प्रमुख नागरिक सेवाएं (Citizen Services)', 'All 5 Citizen Services')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how_it_works')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('कार्यप्रणाली व एआई ढांचा (How It Works)', 'How It Works & Tech Flow')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('citizen_guide')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('राजस्व शब्दावली व नागरिक गाइड', 'Revenue Glossary & Guides')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('अक्सर पूछे जाने वाले प्रश्न (FAQ & Help)', 'Frequently Asked Questions')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('trust')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                  <span>{t('गोपनीयता व सुरक्षा प्रकटीकरण', 'Trust, Privacy & Disclosures')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Live Citizen Service Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-sky-400" />
              <span>{t('सीधे नागरिक सेवाएं (Direct App Services)', 'Direct Citizen Services')}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateToApp('meri_zameen')}
                  className="hover:text-sky-300 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-sky-400" />
                  <span>{t('खतौनी नकल व हिस्सेदारी जांचें', 'View RoR Khatauni & Shares')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToApp('cadastral_map')}
                  className="hover:text-sky-300 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>{t('भू-नक्शा गाटा व सीमांकन देखें', 'Cadastral Maps & Parcels')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToApp('mutation')}
                  className="hover:text-sky-300 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-sky-400" />
                  <span>{t('दाखिल-खारिज स्थिति ट्रैक करें (5 चरण)', 'Track Mutation Progress (5 Stages)')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToApp('document_intel')}
                  className="hover:text-sky-300 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>{t('कागजात विसंगति जांच (Document AI)', 'Document Intelligence & Verification')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToApp('bhulekh_locker')}
                  className="hover:text-sky-300 hover:underline transition-colors flex items-center gap-1.5"
                >
                  <FolderLock className="w-3 h-3 text-sky-400" />
                  <span>{t('भूलेख डिजिटल लॉकर (ऑफलाइन सिंक)', 'Citizen Bhulekh Locker')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Helplines & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400" />
              <span>{t('सरकारी हेल्पलाइन व सहायता', 'Public Helplines & Support')}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-800/60 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {t('मुख्यमंत्री जनसुनवाई पोर्टल', 'CM Jan Sunwai Helpline')}
                </span>
                <span className="font-mono text-white font-bold text-sm">☎ 1076 (Toll Free)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-800/60 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {t('राजस्व परिषद लखनऊ हेल्पलाइन', 'Revenue Board Lucknow')}
                </span>
                <span className="font-mono text-white font-bold text-sm">☎ 155261 / 0522-2217101</span>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-800/60 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {t('तहसील बिलारी, मुरादाबाद कंट्रोल रूम', 'Tehsil Bilari Control Room')}
                </span>
                <span className="font-mono text-white font-bold text-sm">☎ 05921-224012</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Notice Banner: Synthetic Disclosure & Trust */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 border border-sky-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">
                {t('सिंथेटिक डेटा एवं अनुसंधान प्रोटोटाइप प्रकटीकरण', 'Synthetic Demonstration Data Disclosure')}
              </strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {t(
                  'यह प्रोटोटाइप केवल परीक्षण व प्रदर्शन हेतु 100% सिंथेटिक रिकॉर्ड्स (ग्राम रामनगर, तहसील बिलारी) का उपयोग करता है। किसी भी वास्तविक नागरिक का व्यक्तिगत डेटा संग्रहित नहीं किया जाता।',
                  'This hackathon prototype operates strictly on 100% synthetic land records (e.g. Village Ramnagar, Bilari). Zero live PII is accessed or stored.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDisclaimer(true)}
            className="px-3.5 py-1.5 rounded-lg bg-sky-800/80 hover:bg-sky-700 text-sky-100 border border-sky-600/50 text-xs font-bold whitespace-nowrap transition-colors"
          >
            {t('विस्तृत विवरण पढ़ें', 'Read Disclosure')}
          </button>
        </div>

        {/* Bottom Copyright & Access Bar */}
        <div className="pt-6 border-t border-sky-900/40 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 {language === 'hi' ? 'भूमि सेवक (Bhoomi Sevak)' : 'Bhoomi Sevak'}. {t('सर्वाधिकार सुरक्षित। नागरिक-सशक्तिकरण हेतु समर्पित।', 'All rights reserved. Dedicated to citizen empowerment.')}
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => handleNav('trust')} className="hover:text-white hover:underline">
              {t('गोपनीयता नीति', 'Privacy Policy')}
            </button>
            <span>•</span>
            <button onClick={() => handleNav('trust')} className="hover:text-white hover:underline">
              {t('सेवा की शर्तें', 'Terms of Service')}
            </button>
            <span>•</span>
            <button onClick={() => handleNav('trust')} className="hover:text-white hover:underline">
              {t('सुगमता मानक (WCAG 2.1 AA)', 'Accessibility')}
            </button>
            <span>•</span>
            <button onClick={() => handleNav('login')} className="text-sky-400 font-bold hover:underline">
              {t('नागरिक लॉगिन / डेमो प्रवेश', 'Demo Profiles')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

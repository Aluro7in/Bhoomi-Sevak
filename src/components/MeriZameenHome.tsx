import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  MapPin,
  FolderLock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Layers,
  Activity,
  Search,
  CreditCard,
  Building,
} from 'lucide-react';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { LandRecord } from '../types';

export const MeriZameenHome: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    searchResults,
    setSelectedRecord,
    setSelectedParcel,
    setActiveTab,
    parcels,
    taskBundles,
    lockerDocs,
  } = useApp();

  const [showSecondaryMetrics, setShowSecondaryMetrics] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectRecord = (rec: LandRecord) => {
    setSelectedRecord(rec);
    setActiveTab('land_record');
  };

  const handleOpenMapForRecord = (rec: LandRecord) => {
    setSelectedRecord(rec);
    const matchedParcel = parcels.find(p => rec.khasraNumbers.some(k => p.khasraNumber.startsWith(k.split('/')[0])));
    if (matchedParcel) setSelectedParcel(matchedParcel);
    setActiveTab('cadastral_map');
  };

  const myRecords = searchResults.slice(0, 2);

  // 5 Clear Citizen Action Starting Points
  const citizenTasks = [
    {
      id: 'find_land',
      titleHi: 'जमीन खोजें व समझें',
      titleEn: 'Find & Understand Land',
      descHi: 'नाम, गांव या खसरा नंबर बोलकर या लिखकर अपनी खतौनी देखें',
      descEn: 'Search land record by voice, name, village or Khasra plot',
      icon: Search,
      action: () => {
        const input = document.getElementById('search-input-field');
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      badgeHi: 'बोलकर खोजें',
      badgeEn: 'Voice & Text',
    },
    {
      id: 'doc_intel',
      titleHi: 'कागज़ से जमीन जांचें',
      titleEn: 'Scan Document (OCR)',
      descHi: 'दस्तावेज़ की फोटो अपलोड करके जमीन की सच्चाई व मिलान समझें',
      descEn: 'Upload land deed or Khatauni photo for AI extraction & match',
      icon: Sparkles,
      action: () => setActiveTab('document_intel'),
      badgeHi: 'OCR व मिलान',
      badgeEn: 'OCR & Match',
    },
    {
      id: 'map_view',
      titleHi: 'नक्शे पर खेत देखें',
      titleEn: 'View Land on Map',
      descHi: 'भू-नक्शा, चकरोड, खेत की चौहद्दी व उपग्रह दृश्य देखें',
      descEn: 'Explore cadastral parcel boundaries, roads and satellite view',
      icon: MapPin,
      action: () => setActiveTab('cadastral_map'),
      badgeHi: 'भू-नक्शा',
      badgeEn: 'Cadastral Map',
    },
    {
      id: 'locker',
      titleHi: 'मेरे कागज़ात व लॉकर',
      titleEn: 'My Documents & Locker',
      descHi: 'प्रमाणित खतौनी, 13-साला व रजिस्ट्री प्रपत्र सुरक्षित डाउनलोड करें',
      descEn: 'Access certified copies, Form 45 Khatauni and registered deeds',
      icon: FolderLock,
      action: () => setActiveTab('bhulekh_locker'),
      badgeHi: `${lockerDocs.length} प्रपत्र`,
      badgeEn: `${lockerDocs.length} Docs`,
    },
    {
      id: 'mutation',
      titleHi: 'दाखिल-खारिज स्थिति',
      titleEn: 'Track Mutation (Dakhil-Kharij)',
      descHi: 'तहसीलदार समीक्षा व नामान्तरण की वर्तमान स्थिति ट्रैक करें',
      descEn: 'Track ongoing land title transfer and Tehsildar review stage',
      icon: Activity,
      action: () => setActiveTab('mutation'),
      badgeHi: '1 विचाराधीन',
      badgeEn: '1 In Progress',
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP HERO SECTION: Welcome & Prioritized Voice/Text Search Bar */}
      <div className="bg-[#ffffff] border border-[#e7e2d8] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Welcome Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ece6f6]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f2f9] border border-[#e5dff2] text-[11px] font-semibold text-[#5e4db2] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('उत्तर प्रदेश डिजिटल भूलेख नागरिक सेवा', 'UP Digital Land Records Citizen Service')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1e212b] tracking-tight">
              {t('नमस्ते,', 'Welcome,')}{' '}
              <span className="text-[#5e4db2]">
                {language === 'hi' ? currentUser?.nameHi || 'राम कुमार सिंह' : currentUser?.name || 'Ram Kumar Singh'}
              </span>
            </h2>
            <p className="text-xs text-[#555968] mt-0.5">
              {t('ग्राम रामनगर (115420), तहसील बिलारी, मुरादाबाद (उत्तर प्रदेश)', 'Village Ramnagar (115420), Tehsil Bilari, Moradabad (UP)')}
            </p>
          </div>

          {/* Active Mutation Notification Pill */}
          <button
            onClick={() => setActiveTab('mutation')}
            className="bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] text-[#b45309] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></span>
            <span>{t('दाखिल-खारिज वाद #8841 विचाराधीन', 'Active Mutation Case #8841')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority 1: Unified Voice/Text Search Bar right at top */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-[#1e212b] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#5e4db2]" />
              <span>{t('जमीन खोजें (बोलकर या लिखकर)', 'Search Land Records (Voice or Text)')}</span>
            </h3>
            <span className="text-[11px] text-[#767d8f]">
              {t('नाम, गांव या खसरा नंबर से खोजें', 'Search by name, village or plot number')}
            </span>
          </div>

          <UnifiedSearchBar />
        </div>
      </div>

      {/* 2. Priority 2: 5 Quick-Action Cards Immediately Below Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-[#1e212b]">
            {t('त्वरित नागरिक सेवाएं (Quick Citizen Actions)', 'Quick Citizen Actions')}
          </h3>
          <span className="text-xs text-[#767d8f]">
            {t('एक क्लिक में भूलेख सेवाएं', 'One-tap land services')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {citizenTasks.map((task) => {
            const Icon = task.icon;
            return (
              <button
                key={task.id}
                onClick={task.action}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group hover:shadow-xs cursor-pointer ${
                  task.highlight
                    ? 'bg-[#ffffff] border-[#fde68a] hover:border-[#d97706]'
                    : 'bg-[#ffffff] border-[#e7e2d8] hover:border-[#5e4db2] hover:bg-[#faf9f6]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                        task.highlight
                          ? 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
                          : 'bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        task.highlight
                          ? 'bg-[#fef3c7] text-[#92400e]'
                          : 'bg-[#faf9f6] text-[#5e4db2] border border-[#e7e2d8]'
                      }`}
                    >
                      {language === 'hi' ? task.badgeHi : task.badgeEn}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1e212b] group-hover:text-[#5e4db2] transition-colors leading-snug">
                    {language === 'hi' ? task.titleHi : task.titleEn}
                  </h4>
                  <p className="text-xs text-[#555968] mt-1 line-clamp-2 leading-relaxed">
                    {language === 'hi' ? task.descHi : task.descEn}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#f0ebd8] flex items-center justify-between text-xs font-semibold text-[#5e4db2]">
                  <span>{t('शुरू करें', 'Proceed')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Streamlined Land Overview & Holdings with Expandable Secondary Metrics */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs space-y-4">
        {/* Core High-Level Land Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1e212b] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5e4db2]" />
              <span>{t('आपके पंजीकृत भूमि खाते (Registered Land Holdings)', 'Your Registered Land Holdings')}</span>
            </h3>
            <p className="text-xs text-[#767d8f]">
              {t('सरकारी प्रारूप 45 खतौनी से सत्यापित प्रविष्टियां', 'Verified entries from Form 45 Khatauni')}
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-[#faf9f6] px-3 py-1.5 rounded-xl border border-[#e7e2d8]">
              <span className="text-[#767d8f] text-[11px] font-medium mr-1.5">{t('कुल रकबा:', 'Total Area:')}</span>
              <strong className="text-[#5e4db2] font-mono">0.438 Ha</strong>
              <span className="text-[#767d8f] ml-1">(1.73 {t('बीघा', 'Bigha')})</span>
            </div>

            <div className="bg-[#faf9f6] px-3 py-1.5 rounded-xl border border-[#e7e2d8]">
              <span className="text-[#767d8f] text-[11px] font-medium mr-1.5">{t('खाते:', 'Khatas:')}</span>
              <strong className="text-[#1e212b] font-mono">2</strong>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Toggle (KCC Loan, Vault Docs, Revenue Demand) */}
        <div className="border-t border-[#f0ebd8] pt-3">
          <button
            onClick={() => setShowSecondaryMetrics(!showSecondaryMetrics)}
            className="flex items-center justify-between w-full py-1.5 px-3 rounded-xl bg-[#faf9f6] hover:bg-[#f5f3fa] border border-[#e7e2d8] text-xs font-semibold text-[#5e4db2] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5e4db2]" />
              <span>
                {showSecondaryMetrics
                  ? t('अतिरिक्त वित्तीय व प्रशासनिक विवरण छिपाएं', 'Hide Financial & Secondary Metrics')
                  : t('अतिरिक्त विवरण देखें (KCC बैंक ऋण / लॉकर प्रपत्र स्थिति)', 'View More (KCC Bank Loan / Vault Documents)')}
              </span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSecondaryMetrics ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded Secondary Metrics Area */}
          {showSecondaryMetrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-1 animate-in fade-in duration-200">
              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8]">
                <div className="flex items-center justify-between text-[11px] text-[#767d8f] mb-1">
                  <span className="font-semibold">{t('बैंक बंधक (KCC Loan)', 'KCC Bank Mortgage')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#fffbeb] text-[#b45309] border border-[#fde68a] text-[10px] font-bold">
                    SBI Lien
                  </span>
                </div>
                <div className="text-base font-bold text-[#b45309] font-mono">
                  ₹1.50 Lakh
                </div>
                <div className="text-[11px] text-[#555968] mt-0.5">
                  {t('गाटा 142/1 पर भारतीय स्टेट बैंक बंधक प्रविष्टि', 'Active mortgage entry on plot 142/1')}
                </div>
              </div>

              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8]">
                <div className="flex items-center justify-between text-[11px] text-[#767d8f] mb-1">
                  <span className="font-semibold">{t('लॉकर में सुरक्षित प्रपत्र', 'Vault Documents')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] text-[10px] font-bold">
                    {lockerDocs.length} Docs
                  </span>
                </div>
                <div className="text-base font-bold text-[#1e212b] font-mono">
                  {lockerDocs.length} {t('दस्तावेज़', 'Documents')}
                </div>
                <div className="text-[11px] text-[#555968] mt-0.5">
                  {t('प्रमाणित खतौनी, 13-साला व विक्रय पत्र उपलब्ध', 'Certified ROR, 13-year & deed copies ready')}
                </div>
              </div>

              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8]">
                <div className="flex items-center justify-between text-[11px] text-[#767d8f] mb-1">
                  <span className="font-semibold">{t('भू-राजस्व (लगान) स्थिति', 'Land Revenue Cess')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] text-[10px] font-bold">
                    Paid
                  </span>
                </div>
                <div className="text-base font-bold text-[#16a34a] font-mono">
                  ₹42.50 / वर्ष
                </div>
                <div className="text-[11px] text-[#555968] mt-0.5">
                  {t('1432 फसली तक कोई राजस्व बकाया नहीं', 'No tax arrears up to Fasli 1432')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Streamlined Land-Holding Summary Cards (Core Fields + Expandable Area) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {myRecords.map((rec) => {
            const isExpanded = !!expandedCards[rec.id];
            return (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-[#e7e2d8] bg-[#faf9f6] hover:bg-[#f5f3fa] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Owner & Status Indicator */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#e7e2d8]">
                    <div>
                      <div className="font-bold text-sm sm:text-base text-[#1e212b]">
                        {language === 'hi' ? rec.owners[0]?.nameHi : rec.owners[0]?.name}
                        {rec.owners.length > 1 && (
                          <span className="text-xs font-normal text-[#767d8f] ml-1.5">
                            (+{rec.owners.length - 1} {t('सह-खातेदार', 'co-owners')})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#555968] mt-0.5">
                        {t('ग्राम:', 'Village:')} <strong className="text-[#1e212b]">{language === 'hi' ? rec.villageHi : rec.village}</strong>, {t('तहसील:', 'Tehsil:')} {language === 'hi' ? rec.tehsilHi : rec.tehsil}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shrink-0 ${
                        rec.indicator === 'green'
                          ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                          : rec.indicator === 'yellow'
                          ? 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                          : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rec.indicator === 'green'
                            ? 'bg-[#10b981]'
                            : rec.indicator === 'yellow'
                            ? 'bg-[#f59e0b]'
                            : 'bg-[#ef4444]'
                        }`}
                      ></span>
                      <span>
                        {rec.indicator === 'green'
                          ? t('शीर्षक स्पष्ट', 'Title Clear')
                          : rec.indicator === 'yellow'
                          ? t('समीक्षा नोट', 'Review Note')
                          : t('महत्वपूर्ण प्रविष्टि', 'Important Entry')}
                      </span>
                    </div>
                  </div>

                  {/* Core Fields Grid: Khasra, Khata, Area */}
                  <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#ffffff] border border-[#e7e2d8]">
                      <span className="text-[#767d8f] block text-[10px] font-semibold uppercase">{t('गाटा संख्या (Khasra)', 'Khasra Plot')}</span>
                      <span className="font-bold text-[#5e4db2] text-sm font-mono mt-0.5 block">
                        {rec.khasraNumbers.join(', ')}
                      </span>
                      <span className="text-[10px] text-[#767d8f] block mt-0.5">
                        {t('खाता सं:', 'Khata #')} {rec.khataNumber}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#ffffff] border border-[#e7e2d8]">
                      <span className="text-[#767d8f] block text-[10px] font-semibold uppercase">{t('कुल रकबा (Land Area)', 'Total Area')}</span>
                      <span className="font-bold text-[#1e212b] text-sm font-mono mt-0.5 block">
                        {rec.totalAreaHectare} Ha
                      </span>
                      <span className="text-[10px] text-[#555968] block mt-0.5">
                        ({rec.totalAreaBigha} {t('बीघा', 'Bigha')})
                      </span>
                    </div>
                  </div>

                  {/* Expandable Secondary Metadata Area */}
                  {isExpanded && (
                    <div className="space-y-2 mb-3 pt-2 border-t border-[#e7e2d8] text-xs animate-in fade-in duration-150">
                      {/* Share Breakdown */}
                      <div className="p-2.5 rounded-xl bg-[#ffffff] border border-[#e7e2d8]">
                        <span className="text-[#767d8f] block text-[10px] font-semibold uppercase">{t('स्वामित्व हिस्सा (Share)', 'Ownership Share')}</span>
                        <span className="font-bold text-[#5e4db2] font-mono mt-0.5 block">
                          {rec.owners[0]?.shareFraction} ({rec.owners[0]?.sharePercentage}%)
                        </span>
                        <span className="text-[11px] text-[#555968] block mt-0.5">
                          {t('दर्ज खातेदार:', 'Co-owners:')} {rec.owners.map(o => (language === 'hi' ? o.nameHi : o.name)).join(', ')}
                        </span>
                      </div>

                      {/* Indicator Explanation Note */}
                      <div className="p-2.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#d97706]" />
                        <span className="leading-relaxed">{language === 'hi' ? rec.indicatorReasonHi : rec.indicatorReason}</span>
                      </div>

                      {/* Fasli Year & Secondary Map Link */}
                      <div className="flex items-center justify-between text-[11px] text-[#767d8f] px-1">
                        <span>{t('फसली वर्ष:', 'Fasli Year:')} {rec.fasliYear}</span>
                        <button
                          onClick={() => handleOpenMapForRecord(rec)}
                          className="text-[#5e4db2] hover:underline font-semibold flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{t('नक्शे पर देखें', 'View Map')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Row: Single Primary Action + Details Toggle */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-[#e7e2d8]">
                  {/* Single Primary Action: View Record */}
                  <button
                    onClick={() => handleSelectRecord(rec)}
                    className="flex-1 bg-[#5e4db2] hover:bg-[#50409c] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t('खतौनी नकल व AI समझ देखें', 'View Record & AI Explanation')}</span>
                  </button>

                  {/* Secondary Details Toggle */}
                  <button
                    onClick={() => toggleCardExpansion(rec.id)}
                    className="px-3 py-2.5 rounded-xl border border-[#e7e2d8] bg-[#ffffff] hover:bg-[#ede8f5] text-[#5e4db2] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title={isExpanded ? t('कम विवरण', 'Less info') : t('और विवरण', 'More info')}
                  >
                    <span>{isExpanded ? t('कम', 'Less') : t('विवरण', 'Details')}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Task-Based Document Packages (Bank Loan, Sale, PM-Kisan) */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
        <div className="mb-3.5">
          <h3 className="text-sm sm:text-base font-bold text-[#1e212b] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#5e4db2]" />
            <span>{t('कार्य-आधारित दस्तावेज़ बंडल (Task Bundles)', 'Task-Based Document Bundles')}</span>
          </h3>
          <p className="text-xs text-[#767d8f]">
            {t(
              'बैंक ऋण, रजिस्ट्री अथवा सरकारी योजनाओं के लिए आवश्यक सत्यापित कागज़ात एक क्लिक में तैयार करें:',
              'Ready verified document packages for bank loan, registry or govt schemes:'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {taskBundles.map(bundle => (
            <div
              key={bundle.id}
              className="p-4 rounded-2xl border border-[#e7e2d8] bg-[#faf9f6] hover:bg-[#f5f3fa] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1e212b] leading-tight">
                    {language === 'hi' ? bundle.titleHi : bundle.title}
                  </h4>
                </div>

                <p className="text-xs text-[#555968] mb-3 leading-relaxed">
                  {language === 'hi' ? bundle.descriptionHi : bundle.description}
                </p>

                <div className="space-y-1.5 mb-3.5">
                  <span className="text-[10px] font-semibold text-[#767d8f] uppercase tracking-wider block">
                    {t('शामिल कागज़ात:', 'Included Documents:')}
                  </span>
                  {bundle.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="text-xs text-[#555968] flex items-center gap-1.5">
                      {doc.isAvailableInLocker ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#fef3c7] text-[#b45309] flex items-center justify-center text-[9px] font-bold">!</span>
                      )}
                      <span className={doc.isAvailableInLocker ? 'font-medium text-[#1e212b]' : 'text-[#767d8f]'}>
                        {language === 'hi' ? doc.titleHi : doc.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('bhulekh_locker')}
                className="w-full py-2 px-3 rounded-xl bg-[#ffffff] hover:bg-[#5e4db2] hover:text-white border border-[#e7e2d8] text-xs font-semibold text-[#5e4db2] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <span>{t('बंडल देखें व डाउनलोड करें', 'View / Download Bundle')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



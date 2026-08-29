import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  MapPin,
  FolderLock,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Phone,
  AlertTriangle,
  Award,
  Zap,
  Globe,
  Landmark,
  UserCheck,
  Layers,
  Cpu,
  Scale,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Share2,
  Building,
  Compass,
  FileCheck,
} from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  const { language, t, navigateToApp, navigateToPublic, selectRecordById } = useApp();

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const heroSlides = [
    {
      id: 1,
      imageSrc: '/images/hero/hero_1_citizen_document.svg',
      imageAltHi: 'भारतीय किसान खेत में खतौनी और स्मार्टफोन के साथ',
      imageAltEn: 'Indian farmer in field holding Khatauni land record and smartphone',
      tagHi: 'नागरिक सेवा • आसान भाषा',
      tagEn: 'Citizen Service • Plain Language',
      titleHi: 'आपकी जमीन, आपकी भाषा में',
      titleEn: 'Your Land, In Your Language',
      subtitleHi: 'जमीन की खतौनी, हिस्सेदारी और रिकॉर्ड को बोलचाल की भाषा में समझें — बिना किसी बिचौलिए या उलझन के।',
      subtitleEn: 'Understand your land title, co-sharer shares, and registry records in simple language without bureaucratic friction.',
      ctaTextHi: 'अपनी जमीन देखें',
      ctaTextEn: 'View My Land',
      ctaTarget: 'meri_zameen',
      secondaryTextHi: 'कैसे काम करता है',
      secondaryTextEn: 'How It Works',
      secondaryTarget: 'how_it_works',
      badgeBg: 'bg-sky-900/90 text-white border-sky-700/60',
      icon: Landmark,
    },
    {
      id: 2,
      imageSrc: '/images/hero/hero_2_document_search.svg',
      imageAltHi: 'पुराने कागज़ और स्मार्टफोन से भूलेख खोज',
      imageAltEn: 'Document search using paper Khatauni and smartphone cadastral viewer',
      tagHi: 'दस्तावेज़ से खोज',
      tagEn: 'Document-First Search',
      titleHi: 'खसरा नंबर याद नहीं है?',
      titleEn: 'Don\'t Remember Your Khasra Number?',
      subtitleHi: 'अपने पुराने कागज़ या बैनामे की फोटो अपलोड करें। एआई जरूरी जानकारी व खसरा स्वतः पहचान लेगा।',
      subtitleEn: 'Upload a photo of your deed or tax receipt. AI extracts the exact Khasra and Khata automatically.',
      ctaTextHi: 'कागज़ से खोजें',
      ctaTextEn: 'Upload Land Deed',
      ctaTarget: 'document_intel',
      secondaryTextHi: 'दस्तावेज़ गाइड',
      secondaryTextEn: 'Citizen Guide',
      secondaryTarget: 'citizen_guide',
      badgeBg: 'bg-indigo-900/90 text-white border-indigo-700/60',
      icon: FileText,
    },
    {
      id: 3,
      imageSrc: '/images/hero/hero_3_land_map.svg',
      imageAltHi: 'हवाई सर्वेक्षण एवं डिजिटल भू-नक्शा गाटा सीमाएं',
      imageAltEn: 'Aerial cadastral farmland map showing highlighted parcel and pin marker',
      tagHi: 'डिजिटल भू-नक्शा',
      tagEn: 'Cadastral GIS Map',
      titleHi: 'अपनी जमीन नक्शे पर देखें',
      titleEn: 'See Your Land on the Cadastral Map',
      subtitleHi: 'खेत का गाटा नक्शे पर पहचानें, मेड़ की सीमाएं देखें और आसपास के चकरोड व रास्तों की स्थिति जानें।',
      subtitleEn: 'Locate your exact agricultural parcel on the map, inspect plot boundaries, and check road access.',
      ctaTextHi: 'नक्शा खोलें',
      ctaTextEn: 'Open Cadastral Map',
      ctaTarget: 'cadastral_map',
      secondaryTextHi: 'सभी सेवाएं',
      secondaryTextEn: 'All Services',
      secondaryTarget: 'services',
      badgeBg: 'bg-emerald-900/90 text-white border-emerald-700/60',
      icon: MapPin,
    },
    {
      id: 4,
      imageSrc: '/images/hero/hero_4_bhulekh_locker.svg',
      imageAltHi: 'डिजिटल भूलेख लॉकर और सुरक्षित दस्तावेज़ फोल्डर',
      imageAltEn: 'Organized land document file tabs and smartphone digital locker',
      tagHi: 'सुरक्षित डिजिटल लॉकर',
      tagEn: 'Bhulekh Digital Locker',
      titleHi: 'जमीन के दस्तावेज़ एक जगह',
      titleEn: 'All Your Land Documents in One Safe Locker',
      subtitleHi: 'प्रमाणित खतौनी, बैनामा, लगान रसीद और केसीसी प्रपत्रों को डिजिटल लॉकर में सुरक्षित रखें — बिना इंटरनेट भी उपलब्ध।',
      subtitleEn: 'Keep certified RORs, sale deeds, tax receipts, and loan records safely organized offline.',
      ctaTextHi: 'भूलेख लॉकर खोलें',
      ctaTextEn: 'Open Bhulekh Locker',
      ctaTarget: 'bhulekh_locker',
      secondaryTextHi: 'सुरक्षा नीति',
      secondaryTextEn: 'Trust & Privacy',
      secondaryTarget: 'trust',
      badgeBg: 'bg-slate-900/90 text-white border-slate-700/60',
      icon: FolderLock,
    },
    {
      id: 5,
      imageSrc: '/images/hero/hero_5_document_verification.svg',
      imageAltHi: 'दस्तावेज़ सत्यापन एवं सरकारी रिकॉर्ड मिलान',
      imageAltEn: 'Cross-referencing paper land document with official digital registry records',
      tagHi: 'रिकॉर्ड सत्यापन',
      tagEn: 'Record Verification',
      titleHi: 'अपने कागज़ और रिकॉर्ड को समझें',
      titleEn: 'Compare Your Deed with Official Registry',
      subtitleHi: 'कागज़ के रकबे और नाम की सरकारी खतौनी से तुलना करें और संभावित विसंगतियों की तत्काल चेतावनी पाएं।',
      subtitleEn: 'Cross-reference uploaded deeds with registry records to detect discrepancies or hidden encumbrances.',
      ctaTextHi: 'दस्तावेज़ सत्यापित करें',
      ctaTextEn: 'Verify Land Document',
      ctaTarget: 'document_intel',
      secondaryTextHi: 'नागरिक चेकलिस्ट',
      secondaryTextEn: 'Citizen Checklist',
      secondaryTarget: 'citizen_guide',
      badgeBg: 'bg-amber-900/90 text-white border-amber-700/60',
      icon: Sparkles,
    },
    {
      id: 6,
      imageSrc: '/images/hero/hero_6_mutation_tracking.svg',
      imageAltHi: 'दाखिल-खारिज 5-चरणीय प्रगति ट्रैकर',
      imageAltEn: 'Citizen tracking mutation application across 5 statutory stages',
      tagHi: 'नामांतरण स्थिति',
      tagEn: 'Mutation Stage Tracker',
      titleHi: 'दाखिल-खारिज की स्थिति समझें',
      titleEn: 'Track Mutation Status in 5 Clear Stages',
      subtitleHi: 'आवेदन से लेकर लेखपाल जांच, तहसीलदार आदेश और खतौनी अपडेशन तक — हर चरण की सटीक प्रगति देखें।',
      subtitleEn: 'Follow your application across 5 statutory stages with clear timelines and next steps.',
      ctaTextHi: 'दाखिल-खारिज ट्रैक करें',
      ctaTextEn: 'Track Mutation',
      ctaTarget: 'mutation',
      secondaryTextHi: 'सहायता व प्रश्न',
      secondaryTextEn: 'Help & FAQs',
      secondaryTarget: 'faq',
      badgeBg: 'bg-sky-900/90 text-white border-sky-700/60',
      icon: Activity,
    },
  ];

  // Auto-advance carousel every 6 seconds unless paused or hovered
  useEffect(() => {
    if (isPaused || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isHovered, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const sampleQueries = [
    { hi: 'बिलारी में राम कुमार की जमीन दिखाओ', en: 'Show Ram Kumar\'s land in Bilari' },
    { hi: 'खसरा 452 पर कोई बैंक बंधक या विवाद है?', en: 'Is there any mortgage or dispute on Khasra 452?' },
    { hi: 'दाखिल-खारिज आवेदन का क्या स्टेटस है?', en: 'What is the status of mutation application?' },
    { hi: 'जमीन खरीदने के बाद वरासत कैसे दर्ज होगी?', en: 'How to register succession after property sale?' },
  ];

  const currentHero = heroSlides[currentSlide];
  const HeroIcon = currentHero.icon;

  return (
    <div className="space-y-12 py-3 select-none">
      {/* 1. Government-Style Announcement / Information Strip (Light Blue civic tone) */}
      {!announcementDismissed && (
        <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-sky-700 text-white font-bold text-[10px] uppercase tracking-wide">
              {t('सूचना', 'Notice')}
            </span>
            <p className="text-slate-800 font-medium truncate">
              {t(
                'खसरा नंबर याद नहीं है? अपना कागज़ अपलोड करके शुरुआत करें • बोलकर खोजने की सुविधा उपलब्ध',
                'Don\'t remember your Khasra number? Start by uploading your land document • Voice search enabled'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigateToApp('document_intel')}
              className="font-bold text-sky-700 hover:text-sky-900 hover:underline hidden sm:inline text-xs"
            >
              {t('कागज़ से खोजें →', 'Upload Deed →')}
            </button>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="text-slate-400 hover:text-slate-700 p-1 text-sm leading-none"
              title={t('बंद करें', 'Dismiss')}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section: 6-Slide Full-Width Image Rotating Carousel with Subtle Readability Overlay */}
      <section
        className="relative overflow-hidden rounded-3xl border border-sky-200/80 shadow-lg bg-slate-900 focus:outline-hidden min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] flex items-center transition-all"
        aria-roledescription="carousel"
        aria-label={t('भूमि सेवक नागरिक सेवाएं कैरोसेल', 'Bhoomi Sevak Services Carousel')}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Full-Width Hero Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={currentHero.imageSrc}
            alt={language === 'hi' ? currentHero.imageAltHi : currentHero.imageAltEn}
            className="w-full h-full object-cover object-center lg:object-right select-none transition-opacity duration-700 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Subtle Readability Overlay: Desktop (Left gradient wash) & Mobile (Bottom gradient wash) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-3/4 lg:w-3/5 pointer-events-none transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/85 to-transparent sm:hidden pointer-events-none"></div>

        {/* Text Block Content Area */}
        <div className="relative z-10 w-full px-6 py-8 sm:px-10 lg:px-12 max-w-xl lg:max-w-2xl text-left space-y-4">
          {/* Top Row: Service Category Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-xs backdrop-blur-xs ${currentHero.badgeBg}`}>
              <HeroIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? currentHero.tagHi : currentHero.tagEn}</span>
            </div>
          </div>

          {/* Slide Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900 drop-shadow-2xs">
            {language === 'hi' ? currentHero.titleHi : currentHero.titleEn}
          </h1>

          {/* Slide Description */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-medium leading-relaxed max-w-lg">
            {language === 'hi' ? currentHero.subtitleHi : currentHero.subtitleEn}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateToApp(currentHero.ctaTarget as any)}
              className="px-6 py-3 rounded-xl bg-sky-800 hover:bg-sky-900 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{language === 'hi' ? currentHero.ctaTextHi : currentHero.ctaTextEn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (currentHero.secondaryTarget === 'how_it_works') navigateToPublic('how_it_works');
                else if (currentHero.secondaryTarget === 'citizen_guide') navigateToPublic('citizen_guide');
                else if (currentHero.secondaryTarget === 'services') navigateToPublic('services');
                else if (currentHero.secondaryTarget === 'trust') navigateToPublic('trust');
                else if (currentHero.secondaryTarget === 'faq') navigateToPublic('faq');
                else navigateToApp('meri_zameen');
              }}
              className="px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <span>{language === 'hi' ? currentHero.secondaryTextHi : currentHero.secondaryTextEn}</span>
            </button>
          </div>
        </div>

        {/* Top-Right Control Pod (Previous, Next, Counter, Pause/Play) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-md text-xs">
          <button
            onClick={prevSlide}
            className="p-1 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
            title={t('पिछली स्लाइड', 'Previous slide')}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono px-1 font-bold text-slate-800">
            {currentSlide + 1} / {heroSlides.length}
          </span>

          <button
            onClick={nextSlide}
            className="p-1 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
            title={t('अगली स्लाइड', 'Next slide')}
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-3 bg-slate-300 mx-0.5" />

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
            title={isPaused ? t('कैरोसेल चलाएं', 'Resume auto-play') : t('कैरोसेल रोकें', 'Pause auto-play')}
            aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-sky-700" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Slide Indicators (Pills) */}
        <div className="absolute bottom-4 left-6 sm:left-10 lg:left-12 z-20 flex items-center gap-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-sky-800' : 'w-2 bg-slate-400/60 hover:bg-slate-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. Homepage Natural Search & Direct Citizen Entry Points with Blueprint Grid Texture */}
      <section className="bg-gradient-to-b from-white to-sky-50/50 rounded-3xl p-6 sm:p-8 border border-sky-200/80 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-30 pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t('अपनी जमीन खोजें — सीधे शुरुआत करें', 'Find Your Land — Start Instantly')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'नाम, गांव, खसरा संख्या बोलें या अपना पुराना कागज़ अपलोड करें।',
              'Speak or type your village name, citizen name, or upload a paper deed.'
            )}
          </p>
        </div>

        {/* Search Input Box Teaser */}
        <div className="relative z-10 bg-white text-slate-900 p-2.5 sm:p-3 rounded-2xl border border-sky-200 max-w-2xl mx-auto space-y-2 text-left shadow-xs">
          <div className="flex items-center gap-2 px-2">
            <Search className="w-5 h-5 text-sky-600 shrink-0" />
            <input
              type="text"
              readOnly
              value={language === 'hi' ? 'बिलारी में राम कुमार की जमीन दिखाओ...' : 'Show Ram Kumar\'s land in Bilari...'}
              onClick={() => navigateToApp('meri_zameen')}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 font-medium outline-none cursor-pointer placeholder:text-slate-400"
            />
            <button
              onClick={() => navigateToApp('meri_zameen')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">{t('बोलकर खोजें', 'Voice Search')}</span>
            </button>
          </div>

          {/* Sample Query Chips */}
          <div className="pt-2 border-t border-sky-100 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 px-1">{t('उदाहरण:', 'Try:')}</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => navigateToApp('meri_zameen')}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 hover:text-sky-900 text-slate-700 text-[11px] font-medium transition-colors border border-sky-200/70 cursor-pointer"
              >
                "{language === 'hi' ? q.hi : q.en}"
              </button>
            ))}
          </div>
        </div>

        {/* 3 Direct Entry Buttons */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-1">
          <button
            onClick={() => navigateToApp('meri_zameen')}
            className="p-3.5 rounded-xl bg-sky-100/80 hover:bg-sky-200/80 text-sky-900 border border-sky-300/80 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-4 h-4 text-sky-700" />
            <span>{t('जमीन खोजें (बोलकर/लिखकर)', 'Search Land (Voice/Text)')}</span>
          </button>

          <button
            onClick={() => navigateToApp('document_intel')}
            className="p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span>{t('कागज़ से खोजें (Upload Deed)', 'Search via Document')}</span>
          </button>

          <button
            onClick={() => navigateToApp('cadastral_map')}
            className="p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <MapPin className="w-4 h-4 text-indigo-700" />
            <span>{t('नक्शे पर देखें (Cadastral Map)', 'View on Cadastral Map')}</span>
          </button>
        </div>
      </section>

      {/* 4. Core Citizen Services Gateway (6 Pillars) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            <Layers className="w-3.5 h-3.5 text-sky-700" />
            <span>{t('नागरिक सशक्तिकरण सेवाएं', 'Core Citizen Services')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('6 प्रमुख नागरिक सुविधाएं — एक ही स्थान पर', '6 Core Land Services — In One Integrated Portal')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'जमीन की जानकारी से लेकर दाखिल-खारिज और नक्शा सीमांकन तक, हर काम के लिए सरल डिजिटल व्यवस्था।',
              'From title understanding to mutation tracking and cadastral demarcations, transparent digital tools designed for everyone.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: RoR Khatauni */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  {t('अधिकार अभिलेख', 'Record of Rights')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('खतौनी नकल व हिस्सेदारी समझें', 'Khatauni Intelligence & Shares')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'जटिल राजस्व प्रविष्टियों को अपनी भाषा में पढ़ें। कुल रकबा (हेक्टेयर/बीघा), सह-खातेदारों के हिस्से और बैंक बंधक/ऋण की सटीक स्थिति बिना लेखपाल के जानें।',
                  'Translate complex Khatauni rows into plain language. Understand exact land shares, co-owners, and active bank mortgages instantly.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('land_record', 'rec-001')}
              className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-800 hover:text-white border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('खतौनी देखें व समझें', 'View & Explain Khatauni')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Cadastral Map */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  {t('डिजिटल भू-नक्शा', 'Cadastral Mapping')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('भू-नक्शा, गाटा व चौहद्दी सीमांकन', 'Cadastral Map & Demarcation')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'अपने खेत का नक्शा (गाटा संख्या 452), पड़ोसी सीमाएं, चक रोड और चकरोड की चौहद्दी देखें। निकटतम तहसील, उप-निबंधक कार्यालय और सीएससी केंद्र की दूरी भी मापें।',
                  'Inspect parcel boundaries, neighboring plots, chak roads, and nearby administrative centers like Tehsil Bilari and Lekhpal Seva Kendra.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('cadastral_map')}
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('भू-नक्शा पोर्टल खोलें', 'Open Cadastral Map')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Document AI */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                  {t('दस्तावेज़ एआई', 'Document Intelligence')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('कागजात विसंगति जांच (Document AI)', 'Document Mismatch Detector')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'बैनामा या पुरानी खतौनी की फोटो अपलोड करें। एआई मॉडल नाम, रकबा और गाटा संख्या का मिलान सरकारी रिकॉर्ड से करके विसंगतियों व धोखाधड़ी की तुरंत चेतावनी देगा।',
                  'Upload paper deeds or receipts. AI extracts structured text and verifies names and areas against the registry database to prevent land fraud.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('document_intel')}
              className="w-full py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-600 text-cyan-800 hover:text-white border border-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('दस्तावेज़ स्कैन करें', 'Scan & Verify Document')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Mutation Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                  {t('दाखिल-खारिज', 'Mutation Workflow')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('दाखिल-खारिज ट्रैकर (5 चरण)', '5-Stage Mutation Tracker')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'आवेदन से लेकर आदेश तक: आवेदन दर्ज → लेखपाल सत्यापन → स्थल निरीक्षण → तहसीलदार सुनवाई → खतौनी अद्यतन। 35 दिवसीय वैधानिक समय-सीमा की निगरानी रखें।',
                  'Track statutory Section 34/35 mutation through 5 clear stages: Application → Lekhpal → Inspection → Tehsildar → Final Record Update.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('mutation')}
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-800 hover:text-white border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('दाखिल-खारिज ट्रैक करें', 'Track Mutation Status')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Bhulekh Digital Locker */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <FolderLock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  {t('डिजिटल भू-तिजोरी', 'Citizen Vault')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('भूलेख डिजिटल लॉकर एवं ऑफ़लाइन सुरक्षा', 'Bhulekh Digital Locker & Offline Sync')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'अपनी सभी प्रमाणित खतौनी, बैनामा, लगान रसीद और किसान क्रेडिट कार्ड प्रपत्रों को एक सुरक्षित डिजिटल वॉल्ट में रखें। बिना इंटरनेट भी आपके सभी रिकॉर्ड्स सुरक्षित रहते हैं।',
                  'Store certified ROR copies, deeds, land tax receipts, and KCC certificates safely in your personal offline vault with QR verification.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('bhulekh_locker')}
              className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-700 text-sky-800 hover:text-white border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('डिजिटल लॉकर खोलें', 'Open Digital Locker')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Citizen Assistance & Voice AI */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  {t('आवाज़ व संदर्भ एआई', 'Voice & AI Assistance')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {t('जमीन से जुड़े प्रश्न पूछें (AI Sahayak)', 'Ask Contextual Land Questions')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'खतौनी देखते समय सीधे पूछें: "क्या इस जमीन पर लोन लिया जा सकता है?" या "मेरे हिस्से का रकबा कितना है?"। एआई बिना किसी अनुमान के सीधे रिकॉर्ड से उत्तर देगा।',
                  'Ask directly while viewing any record: "Can I take a KCC loan?" or "What is my share in Bigha?". AI answers strictly grounded in registry data.'
                )}
              </p>
            </div>
            <button
              onClick={() => navigateToApp('meri_zameen')}
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-700 text-blue-800 hover:text-white border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('सहायक से पूछें', 'Ask Assistant')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. The Citizen Challenge vs Bhoomi Sevak Transformation */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-200/80 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {t('प्रशासनिक बदलाव', 'Systemic Transformation')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('पारंपरिक व्यवस्था बनाम भूमि सेवक', 'Traditional Portal vs Bhoomi Sevak')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'क्यों आम किसान व ग्रामीण नागरिक सरकारी पोर्टल्स पर असहज महसूस करते हैं और भूमि सेवक इसे कैसे बदलता है।',
              'Why rural landowners struggle with legacy interfaces and how Bhoomi Sevak eliminates friction.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Legacy Friction */}
          <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-300/80 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="text-base font-bold">
                {t('पारंपरिक व्यवस्था की समस्याएं', 'Legacy Citizen Experience')}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✗</span>
                <span>{t('कठिन औपनिवेशिक व प्रशासनिक शब्दावली (संक्रमणीय भूमिधर, फांक, बिला मुआवजा)।', 'Archaic legal jargon unreadable to average landowners.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✗</span>
                <span>{t('खतौनी की कॉलम 7-12 में छिपे बैंक बंधक व न्यायालयी स्थगनादेश का न समझ आना।', 'Hidden mortgage entries and court stays missed during land purchase.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✗</span>
                <span>{t('दाखिल-खारिज की प्रक्रिया में अस्पष्टता और बार-बार तहसील के चक्कर।', 'Opaque mutation stages forcing repeated physical trips to Tehsil.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✗</span>
                <span>{t('बिचौलियों और अनाधिकृत एजेंटों पर निर्भरता व अतिरिक्त व्यय।', 'Heavy reliance on intermediaries and risk of financial fraud.')}</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Bhoomi Sevak AI Resolution */}
          <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 space-y-4">
            <div className="flex items-center gap-2.5 text-sky-950">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <h3 className="text-base font-bold">
                {t('भूमि सेवक का समाधान', 'The Bhoomi Sevak Experience')}
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-sky-950">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">✓</span>
                <span>{t('अपनी बोलचाल की भाषा में सरल अनुवाद और हिस्सेदारी का स्पष्ट पाई-चार्ट।', 'Natural language explanations with visual share breakdowns.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">✓</span>
                <span>{t('सक्रिय बैंक बंधक और अदालती विवादों की प्रमुख चेतावनी (नीली/लाल हाइलाइट)।', 'Proactive blue/red alerts for active loans and litigations.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">✓</span>
                <span>{t('5-चरणीय लाइव दाखिल-खारिज ट्रैकर व संबंधित लेखपाल का संपर्क विवरण।', 'Transparent 5-stage mutation tracker with officer contact details.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">✓</span>
                <span>{t('आवाज़ से खोजें (Voice Search) और कमजोर 2G/3G नेटवर्क पर भी ऑफ़लाइन काम।', 'Voice-first interaction and offline cache for rural connectivity.')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Grounded AI & Zero Hallucination Guarantee with Light Blue Mesh Texture */}
      <section className="civic-mesh-texture rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>{t('सत्यनिष्ठा व सुरक्षा सिद्धांत', 'Grounded AI Principle')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('डेटाबेस ही परम सत्य है — एआई कभी तथ्य नहीं बनाता', 'The Database is the Source of Truth — Zero AI Fabrication')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'भूमि सेवक में एआई का उपयोग केवल भाषा को सरल बनाने और कागजात को पढ़ने के लिए किया जाता है। स्वामित्व, रकबा, गाटा संख्या और कानूनी स्थिति सदैव आधिकारिक डेटाबेस से ही निर्धारित होती है। किसी भी भ्रम की स्थिति में सिस्टम स्पष्ट रूप से नागरिक को सूचित करता है।',
                'In Bhoomi Sevak, AI strictly acts as an interactive comprehension layer. Ownership, plot area, and legal status are determined deterministically from verified registry databases. The AI never guesses or invents facts.'
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-sky-200 text-xs space-y-1 shadow-2xs">
                <strong className="text-sky-900 block font-bold">
                  {t('1. संदर्भ साक्ष्य (Evidence Citation)', '1. Direct Evidence Citation')}
                </strong>
                <span className="text-slate-600">
                  {t('प्रत्येक उत्तर के साथ खतौनी के मूल कॉलम का सटीक संदर्भ।', 'Every AI explanation cites the exact row in the official Khatauni.')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-sky-200 text-xs space-y-1 shadow-2xs">
                <strong className="text-sky-900 block font-bold">
                  {t('2. अनिश्चितता का प्रकटीकरण', '2. Explicit Ambiguity Handling')}
                </strong>
                <span className="text-slate-600">
                  {t('अस्पष्ट कागजात होने पर गलत निष्कर्ष के बजाय स्पष्ट पुनः प्रयास की सलाह।', 'If a document is blurry, the AI prompts for a clearer photo rather than guessing.')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Pillar Badge */}
          <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white mx-auto flex items-center justify-center shadow-md">
              <Scale className="w-8 h-8 text-sky-200" />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900">
                {t('नागरिक विश्वास मानक', 'Citizen Trust Standard')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('पारदर्शिता • सुरक्षा • सटीक जानकारी', 'Transparency • Security • Accuracy')}
              </p>
            </div>
            <button
              onClick={() => navigateToPublic('trust')}
              className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 text-xs font-bold text-sky-800 transition-colors cursor-pointer"
            >
              {t('विश्वसनीयता नीति पढ़ें', 'Read Trust Disclosures')}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Citizen Personas & Demonstration Scenarios */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {t('वास्तविक उपयोग परिदृश्य', 'Demonstration Scenarios')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('किस प्रकार नागरिक भूमि सेवक से लाभान्वित होते हैं', 'How Real Citizens Experience Bhoomi Sevak')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Story 1 */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                R
              </div>
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  {language === 'hi' ? 'राम कुमार सिंह' : 'Ram Kumar Singh'}
                </strong>
                <span className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'किसान, ग्राम रामनगर, बिलारी' : 'Farmer, Ramnagar, Bilari'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                '"बैंक में केसीसी लोन के लिए मुझे खतौनी में पुराना बंधक हटा या नहीं देखना था। भूमि सेवक ने तुरंत बोलकर बता दिया कि पीएनबी का पुराना बंधक निरस्त हो चुका है।"',
                '"I needed to confirm if my old PNB loan mortgage was cleared from the Khatauni. Bhoomi Sevak verified the order sheet in 5 seconds without traveling to Tehsil."'
              )}
            </p>
            <button
              onClick={() => {
                selectRecordById('rec-001');
                navigateToApp('land_record');
              }}
              className="w-full py-2 rounded-lg bg-sky-50 text-sky-800 text-xs font-bold hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
            >
              {t('राम कुमार का रिकॉर्ड देखें →', 'View Ram Kumar\'s Record →')}
            </button>
          </div>

          {/* Story 2 */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                S
              </div>
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  {language === 'hi' ? 'सुमित्रा देवी' : 'Sumitra Devi'}
                </strong>
                <span className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'खातेदार, ग्राम रामनगर' : 'Landholder, Ramnagar'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                '"मुझे खसरा नंबर याद नहीं था। मैंने केवल अपने पुराने कागज़ की फोटो खींची। सिस्टम ने तुरंत मेरा 1/3 हिस्सा और 0.4047 हेक्टेयर रकबा दिखा दिया।"',
                '"I didn\'t know my Khasra number. I just photographed my old paper receipt. The AI instantly identified my 1/3 share and exact parcel dimensions."'
              )}
            </p>
            <button
              onClick={() => {
                selectRecordById('rec-002');
                navigateToApp('land_record');
              }}
              className="w-full py-2 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              {t('सुमित्रा देवी का रिकॉर्ड देखें →', 'View Sumitra Devi\'s Record →')}
            </button>
          </div>

          {/* Story 3 */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                V
              </div>
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  {language === 'hi' ? 'विजय प्रकाश' : 'Vijay Prakash'}
                </strong>
                <span className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'क्रेता, मुरादाबाद' : 'Property Buyer, Moradabad'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                '"जमीन खरीदने से पहले मैंने बैनामा अपलोड करके सरकारी खतौनी से मिलाया। सिस्टम ने तुरंत सावधान किया कि विक्रेता का हिस्सा कागज़ से कम है।"',
                '"Before buying land, I scanned the seller\'s deed. Document AI immediately warned that the registered ownership share had a discrepancy."'
              )}
            </p>
            <button
              onClick={() => navigateToApp('document_intel')}
              className="w-full py-2 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              {t('कागजात सत्यापन जांचें →', 'Test Document Verification →')}
            </button>
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action Section with Radiant Light Blue Gradient */}
      <section className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-sky-200 border border-white/25 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 text-sky-300" />
            <span>{t('सीधे सेवा का उपयोग करें', 'Instant Access')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('अपनी जमीन की जानकारी आज ही अपनी भाषा में समझें', 'Understand Your Land Records In Your Language Today')}
          </h2>

          <p className="text-xs sm:text-base text-sky-100 max-w-xl mx-auto leading-relaxed">
            {t(
              'कोई जटिल फॉर्म नहीं, कोई प्रशासनिक शब्दावली का डर नहीं। केवल बोलकर या अपना पुराना कागज़ दिखाकर शुरुआत करें।',
              'No complex registration forms or bureaucratic anxiety. Start by speaking or uploading a document photo.'
            )}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateToApp('meri_zameen')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-sky-50 text-sky-950 text-sm font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t('अपनी जमीन देखें (Get Started)', 'Enter Citizen App (Get Started)')}</span>
              <ArrowRight className="w-4 h-4 text-sky-700" />
            </button>

            <button
              onClick={() => navigateToPublic('citizen_guide')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 text-white text-sm font-bold border border-sky-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>{t('नागरिक गाइड पढ़ें', 'Read Citizen Guide')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

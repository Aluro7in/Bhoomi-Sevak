import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderLock,
  FileText,
  Upload,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  ArrowRight,
  Eye,
  Calendar,
  Building,
  ShieldCheck,
  Filter,
  Layers,
  FileCheck,
  X,
  Lock,
  MapPin,
  HelpCircle,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Printer,
  FileStack,
  Check,
  Landmark,
  BadgeAlert,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { LockerDocument, TaskBundle } from '../types';

interface PropertyFilter {
  id: string;
  name: string;
  nameHi: string;
  khasra: string;
  village: string;
  villageHi: string;
  tehsil: string;
  tehsilHi: string;
  areaHa: number;
  areaBigha: number;
  ownership: string;
  ownershipHi: string;
  docCount: number;
  status: 'clear' | 'mortgaged' | 'mutation_pending';
  statusReasonHi: string;
}

export const BhulekhLocker: React.FC = () => {
  const {
    t,
    language,
    lockerDocs,
    taskBundles,
    setActiveTab,
    selectRecordById,
    setSelectedParcel,
    setSelectedMutation,
    parcels,
    mutations,
    speakText,
    stopSpeaking,
    isSpeaking,
  } = useApp();

  // Local States
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [provenanceFilter, setProvenanceFilter] = useState<'all' | 'official_issued' | 'citizen_uploaded' | 'ai_analysis'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<LockerDocument | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<TaskBundle | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTabInModal, setActiveTabInModal] = useState<'preview' | 'ai_explanation' | 'evidence' | 'comparison' | 'timeline' | 'versions'>('preview');
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string>('');

  // Grounded Natural Language Document Q&A States
  const [nlQuery, setNlQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<{
    query: string;
    answer: string;
    answerHi: string;
    matchedDocIds: string[];
    groundedEvidence: string[];
  } | null>(null);

  // Pre-defined Properties
  const properties: PropertyFilter[] = [
    {
      id: 'prop-452',
      name: 'Khasra 452, 453/1 (Ramnagar)',
      nameHi: 'गाटा संख्या 452, 453/1 (रामनगर)',
      khasra: '452, 453/1',
      village: 'Ramnagar',
      villageHi: 'रामनगर',
      tehsil: 'Bilari',
      tehsilHi: 'बिलारी',
      areaHa: 0.258,
      areaBigha: 1.02,
      ownership: 'Joint 50% Share (Ram Kumar & Shyam Kumar)',
      ownershipHi: 'सह-खातेदारी (50% हिस्सा - राम कुमार व श्याम कुमार)',
      docCount: 5,
      status: 'mortgaged',
      statusReasonHi: 'एसबीआई बिलारी शाखा का ₹1,50,000 केसीसी ऋण बंधक दर्ज',
    },
    {
      id: 'prop-218',
      name: 'Khasra 218 (Ramnagar)',
      nameHi: 'गाटा संख्या 218 (रामनगर)',
      khasra: '218',
      village: 'Ramnagar',
      villageHi: 'रामनगर',
      tehsil: 'Bilari',
      tehsilHi: 'बिलारी',
      areaHa: 0.180,
      areaBigha: 0.71,
      ownership: 'Single Owner 100% (Ram Kumar Singh)',
      ownershipHi: 'एकल स्वामित्व (100% - राम कुमार सिंह)',
      docCount: 1,
      status: 'clear',
      statusReasonHi: 'पंजीकृत बैनामा 2018 - शून्य विवाद व स्वच्छ शीर्षक',
    },
    {
      id: 'prop-109',
      name: 'Khasra 109 (Hasanpur)',
      nameHi: 'गाटा संख्या 109 (हसनपुर)',
      khasra: '109',
      village: 'Hasanpur',
      villageHi: 'हसनपुर',
      tehsil: 'Bilari',
      tehsilHi: 'बिलारी',
      areaHa: 0.350,
      areaBigha: 1.38,
      ownership: 'Ancestral Title (Ram Kumar Singh)',
      ownershipHi: 'पुश्तैनी भूमि (राम कुमार सिंह)',
      docCount: 1,
      status: 'clear',
      statusReasonHi: 'पुश्तैनी खतौनी खाता 00045 - शून्य बंधक',
    },
  ];

  const activeProperty = properties.find(p => p.id === selectedPropertyId);

  // Category list
  const categories = [
    { id: 'all', title: 'सभी प्रकार', en: 'All Types' },
    { id: 'ror', title: 'खतौनी (ROR)', en: 'Khatauni' },
    { id: 'registry', title: 'बैनामा (Registry)', en: 'Sale Deeds' },
    { id: 'mutation', title: 'दाखिल-खारिज आदेश', en: 'Mutation Orders' },
    { id: 'uploaded', title: 'नागरिक पर्चा', en: 'Citizen Papers' },
    { id: 'ai_report', title: 'एआई ऑडिट रिपोर्ट', en: 'AI Reports' },
  ];

  // Quick NL Citizen Questions
  const quickQuestions = [
    {
      q: 'मेरी Bilari वाली Khatauni दिखाओ',
      qEn: 'Show my Bilari Khatauni',
      answer: 'Here is your certified Khatauni Form 45 for Khasra 452, 453/1 in Village Ramnagar, Tehsil Bilari. It shows 50% co-tenancy with Shyam Kumar Singh and an active SBI KCC loan of ₹1,50,000.',
      answerHi: 'यह रही आपकी तहसील बिलारी के ग्राम रामनगर स्थित गाटा 452, 453/1 की प्रमाणित खतौनी (फॉर्म 45)। इसमें आपका 50% हिस्सा (0.129 हे.) दर्ज है तथा एसबीआई बिलारी का ₹1,50,000 का केसीसी ऋण बंधक दर्ज है।',
      docIds: ['doc-001'],
      evidence: ['Khasra: 452, 453/1', 'Khata: 00142', 'SBI Bilari Mortgage: ₹1,50,000'],
    },
    {
      q: 'Mere kis document mein difference mila?',
      qEn: 'In which document was a difference detected?',
      answer: 'A difference of 0.005 Hectare (approx 20 sq meters) was detected in your "Uploaded Field Receipt / Old Stamp Paper" (doc-004) where area is stated as 0.124 Ha versus official Khatauni share of 0.129 Ha.',
      answerHi: 'आपके "अपलोड किए गए पुराने पर्चे / स्टाम्प रसीद" (गाटा 452) में 0.005 हेक्टेयर (लगभग 20 वर्ग मीटर) का अंतर मिला। पर्चे में 0.124 हे. लिखा है जबकि सरकारी खतौनी में आपका हिस्सा 0.129 हे. है।',
      docIds: ['doc-004'],
      evidence: ['Uploaded Paper: 0.124 Ha', 'Official Khatauni: 0.129 Ha', 'Variance: -0.005 Ha'],
    },
    {
      q: 'Is document mein owner ka naam kya hai?',
      qEn: 'What are the owner names in these documents?',
      answer: 'In Khata 00142 (Khasra 452), the registered co-tenants are Ram Kumar Singh and Shyam Kumar Singh, sons of Late Harpal Singh. In Khasra 218, the sole registered owner is Ram Kumar Singh.',
      answerHi: 'खाता संख्या 00142 (गाटा 452) में दर्ज खातेदार राम कुमार सिंह व श्याम कुमार सिंह (पिसरान स्व. हरपाल सिंह) हैं। गाटा 218 में पंजीकृत एकल स्वामी राम कुमार सिंह हैं।',
      docIds: ['doc-001', 'doc-002'],
      evidence: ['Khata 00142: Ram Kumar & Shyam Kumar (1/2 each)', 'Khata 00089: Ram Kumar Singh (Sole)'],
    },
    {
      q: 'बैनामा रजिस्ट्री 2018 दिखाओ',
      qEn: 'Show 2018 Sale Deed Registry',
      answer: 'Registered Sale Deed #1109/2018 for Khasra 218 (0.180 Hectare) purchased from Jagdish Prasad for ₹8,50,000 with e-stamp duty ₹42,500.',
      answerHi: 'गाटा संख्या 218 (0.180 हेक्टेयर) का पंजीकृत बैनामा विलेख #1109/2018 जो जगदीश प्रसाद से ₹8,50,000 में क्रय किया गया था (ई-स्टाम्प ₹42,500)।',
      docIds: ['doc-002'],
      evidence: ['Deed #1109/2018', 'Area: 0.180 Ha', 'Stamp Duty: ₹42,500'],
    },
    {
      q: 'KCC लोन के लिए कौन से कागज़ लगेंगे?',
      qEn: 'Which documents are needed for KCC Loan?',
      answer: 'For Kisan Credit Card (KCC) loan: Certified Khatauni (doc-001), Cadastral Map (doc-005), and 12-Year Search Report are ready in your locker. Primary Agricultural Society No-Dues Certificate is required.',
      answerHi: 'किसान क्रेडिट कार्ड (KCC) ऋण हेतु: प्रमाणित खतौनी (उपलब्ध), भू-नक्शा उद्धरण (उपलब्ध), व 12-साला आख्या आपके लॉकर में तैयार हैं। केवल समिति अदेयता प्रमाण पत्र शेष है।',
      docIds: ['doc-001', 'doc-005'],
      evidence: ['3 of 4 KCC Documents Ready in Locker', 'Bundle: bundle-kcc'],
    },
  ];

  // Handle Natural Language Query
  const handleNLSubmit = (queryText: string) => {
    const q = queryText.trim().toLowerCase();
    if (!q) return;

    // Check pre-built match or calculate matching
    const foundPreset = quickQuestions.find(
      preset =>
        preset.q.toLowerCase().includes(q) ||
        preset.qEn.toLowerCase().includes(q) ||
        q.includes(preset.q.toLowerCase().slice(0, 10))
    );

    if (foundPreset) {
      setAiAnswer({
        query: queryText,
        answer: foundPreset.answer,
        answerHi: foundPreset.answerHi,
        matchedDocIds: foundPreset.docIds,
        groundedEvidence: foundPreset.evidence,
      });
      return;
    }

    // Dynamic keyword match
    if (q.includes('difference') || q.includes('अंतर') || q.includes('गलती') || q.includes('mismatch')) {
      setAiAnswer({
        query: queryText,
        answer: 'Discrepancy found in Document #doc-004: Uploaded paper records 0.124 Ha vs Official Khatauni share 0.129 Ha (-0.005 Ha).',
        answerHi: 'दस्तावेज सं. doc-004 में अंतर मिला: पुराने पर्चे में 0.124 हे. दर्ज है जबकि सरकारी खतौनी में आपका हिस्सा 0.129 हे. है (0.005 हे. का अंतर)।',
        matchedDocIds: ['doc-004'],
        groundedEvidence: ['Discrepancy in Khasra 452: 0.005 Hectare variance'],
      });
    } else if (q.includes('deed') || q.includes('बैनामा') || q.includes('registry') || q.includes('रजिस्ट्री')) {
      setAiAnswer({
        query: queryText,
        answer: 'Found Registered Sale Deed #1109/2018 for Khasra 218 (0.180 Ha) in Village Ramnagar.',
        answerHi: 'गाटा 218 (0.180 हे.) का पंजीकृत बैनामा विलेख #1109/2018 (उप-निबंधक बिलारी) लॉकर में उपलब्ध है।',
        matchedDocIds: ['doc-002'],
        groundedEvidence: ['Sale Deed #1109/2018', 'Area: 0.180 Ha'],
      });
    } else if (q.includes('parwana') || q.includes('mutation') || q.includes('दाखिल') || q.includes('खारिज') || q.includes('वरासत')) {
      setAiAnswer({
        query: queryText,
        answer: 'Found Mutation Parwana Order #402/2020 confirming inheritance succession for Khasra 452.',
        answerHi: 'गाटा संख्या 452 का दाखिल-खारिज परवाना आदेश #402/2020 (तहसीलदार बिलारी) उपलब्ध है।',
        matchedDocIds: ['doc-003'],
        groundedEvidence: ['Mutation Order #402/2020', 'Status: Implemented in ROR'],
      });
    } else {
      setAiAnswer({
        query: queryText,
        answer: `Searched 7 digital documents for "${queryText}". Found matching certified land records in Bilari tehsil.`,
        answerHi: `"${queryText}" हेतु लॉकर के 7 दस्तावेजों की खोज की गई। संबंधित प्रमाणित राजस्व अभिलेख नीचे प्रदर्शित हैं।`,
        matchedDocIds: ['doc-001', 'doc-002'],
        groundedEvidence: ['UP Bhulekh Verified Records', 'Chain of Title 2018-2025'],
      });
    }
  };

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return lockerDocs.filter(doc => {
      // Property match
      const matchesProperty =
        selectedPropertyId === 'all' ||
        doc.propertyId === selectedPropertyId ||
        (selectedPropertyId === 'prop-452' && doc.khasraNumber?.includes('452')) ||
        (selectedPropertyId === 'prop-218' && doc.khasraNumber?.includes('218')) ||
        (selectedPropertyId === 'prop-109' && doc.khasraNumber?.includes('109'));

      // Category match
      const matchesCat = activeCategory === 'all' || doc.category === activeCategory;

      // Provenance match
      const matchesProvenance =
        provenanceFilter === 'all' ||
        doc.provenance === provenanceFilter ||
        (provenanceFilter === 'official_issued' && doc.isRecordLinked) ||
        (provenanceFilter === 'citizen_uploaded' && doc.category === 'uploaded') ||
        (provenanceFilter === 'ai_analysis' && doc.category === 'ai_report');

      // AI Answer match (if active)
      const matchesAiAnswer = !aiAnswer || aiAnswer.matchedDocIds.includes(doc.id);

      // Search text match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.titleHi.includes(q) ||
        doc.khasraNumber?.includes(q) ||
        doc.khataNumber?.includes(q) ||
        doc.issuingAuthority.toLowerCase().includes(q) ||
        doc.issuingAuthorityHi.includes(q);

      return matchesProperty && matchesCat && matchesProvenance && matchesAiAnswer && matchesSearch;
    });
  }, [lockerDocs, selectedPropertyId, activeCategory, provenanceFilter, aiAnswer, searchQuery]);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Copy share link
  const handleCopyShareLink = (docTitle: string) => {
    setCopiedLink(true);
    showToast(
      t(
        `"${docTitle}" का सुरक्षित 24-घंटे सत्यापन लिंक कॉपी कर लिया गया है।`,
        `Secure 24-hour verification link for "${docTitle}" copied to clipboard.`
      )
    );
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Download Bundle simulation
  const handleDownloadBundle = (bundle: TaskBundle) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(
        t(
          `दस्तावेज बंडल "${language === 'hi' ? bundle.titleHi : bundle.title}" डाउनलोड हो गया है।`,
          `Document bundle "${bundle.title}" has been prepared and downloaded.`
        )
      );
    }, 1200);
  };

  // Direct parcel navigation
  const handleOpenOnMap = (khasra: string) => {
    const targetParcel = parcels.find(p => p.khasraNumber === khasra || p.khasraNumber.includes(khasra));
    if (targetParcel) {
      setSelectedParcel(targetParcel);
    }
    setActiveTab('cadastral_map');
  };

  // Direct mutation navigation
  const handleOpenMutation = (mutationId?: string) => {
    if (mutationId) {
      const targetMut = mutations.find(m => m.id === mutationId || m.applicationNumber === mutationId);
      if (targetMut) {
        setSelectedMutation(targetMut);
      }
    }
    setActiveTab('mutation');
  };

  return (
    <div className="space-y-6 pb-16" id="bhulekh-locker-container">
      {/* 1. TOP HEADER & PROVENANCE TRUST BANNER */}
      <div className="bg-[#09090b] rounded-2xl p-5 sm:p-6 border border-[#1a1a1a] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#143d2b]/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                {t('भूलेख डिजिटल लॉकर', 'Bhulekh Digital Locker')}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>256-bit Encrypted</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-widest font-mono">
                UP Bhulekh Synced
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl leading-relaxed">
              {t(
                'आपकी सभी संपत्तियों की प्रमाणित खतौनी, बैनामा विलेख, दाखिल-खारिज आदेश व नक्शे एक सुरक्षित, AI-सत्यापित डिजिटल वॉल्ट में।',
                'Your certified Khatauni ROR, Sale Deeds, mutation parwana decrees and map excerpts in one AI-audited digital vault.'
              )}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-upload-new-doc"
            onClick={() => setActiveTab('document_intel')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>{t('नया कागज़ अपलोड व मिलान', 'Upload & Compare Doc')}</span>
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. PROPERTY SELECTOR TABS & ACTIVE PROPERTY CONTEXT BANNER */}
      <div className="bg-[#09090b] rounded-2xl p-4 sm:p-5 border border-[#1a1a1a] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#71717a]">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>{t('संपत्ति अनुसार दस्तावेज संगठन (Property Context)', 'Organize by Property')}</span>
          </div>
          <span className="text-[11px] text-[#71717a] font-mono">
            {properties.length} {t('पंजीकृत संपत्तियां', 'Properties Registered')}
          </span>
        </div>

        {/* Property Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedPropertyId('all');
              setAiAnswer(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedPropertyId === 'all'
                ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                : 'bg-[#141417] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#1f1f23]'
            }`}
          >
            <span>{t('सभी संपत्तियां', 'All Properties')}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${selectedPropertyId === 'all' ? 'bg-black/20 text-black' : 'bg-[#27272a] text-zinc-300'}`}>
              {lockerDocs.length}
            </span>
          </button>

          {properties.map(prop => (
            <button
              key={prop.id}
              onClick={() => {
                setSelectedPropertyId(prop.id);
                setAiAnswer(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedPropertyId === prop.id
                  ? 'bg-white text-black shadow-md font-extrabold'
                  : 'bg-[#141417] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#1f1f23]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? prop.nameHi : prop.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${selectedPropertyId === prop.id ? 'bg-black text-white' : 'bg-[#27272a] text-zinc-300'}`}>
                {prop.docCount}
              </span>
            </button>
          ))}
        </div>

        {/* Active Property Context Header Banner */}
        {activeProperty && (
          <div className="p-4 rounded-xl bg-[#121214] border border-[#27272a] text-xs flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {language === 'hi' ? activeProperty.nameHi : activeProperty.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {activeProperty.areaHa} Ha ({activeProperty.areaBigha} Bigha)
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeProperty.status === 'mortgaged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {language === 'hi' ? activeProperty.statusReasonHi : activeProperty.status}
                </span>
              </div>
              <p className="text-[#a1a1aa] text-[11px]">
                {t('स्वामित्व विवरण: ', 'Ownership Details: ')}
                <strong className="text-zinc-200">{language === 'hi' ? activeProperty.ownershipHi : activeProperty.ownership}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenOnMap(activeProperty.khasra.split(',')[0].trim())}
                className="px-3 py-1.5 rounded-lg bg-[#1c1c20] hover:bg-[#27272a] border border-[#333] text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('भू-नक्शा देखें', 'View Map')}</span>
              </button>
              <button
                onClick={() => {
                  selectRecordById('rec-001');
                  setActiveTab('land_record');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1c1c20] hover:bg-[#27272a] border border-[#333] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('खतौनी उद्धरण', 'View Khatauni')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. "ASK YOUR DOCUMENTS" NATURAL LANGUAGE SEARCH & Q&A */}
      <div className="bg-[#09090b] rounded-2xl p-5 border border-[#1a1a1a] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>{t('कागज़ों से सीधे पूछें (Ask Your Documents)', 'Ask Your Documents')}</span>
          </div>
          <span className="text-[11px] text-[#71717a]">
            {t('भूमि सेवक एआई द्वारा ग्राउंडेड उत्तर', 'Grounded AI Answers')}
          </span>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 3) {
                handleNLSubmit(e.target.value);
              } else if (e.target.value === '') {
                setAiAnswer(null);
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleNLSubmit(searchQuery);
              }
            }}
            placeholder={t(
              'प्राकृतिक भाषा में पूछें: जैसे "मेरी Bilari वाली Khatauni", "किस document में अंतर मिला?", "बैनामा 2018"...',
              'Ask naturally: e.g. "Show Bilari Khatauni", "Where is the discrepancy?", "Sale deed 2018"...'
            )}
            className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm rounded-xl bg-[#121214] border border-[#27272a] text-white placeholder-[#71717a] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setAiAnswer(null);
              }}
              className="absolute right-12 text-[#71717a] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleNLSubmit(searchQuery)}
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider"
          >
            {t('खोजें', 'Ask')}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] text-[#71717a] font-semibold shrink-0 mr-1">{t('सुझाव:', 'Try:')}</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(language === 'hi' ? q.q : q.qEn);
                handleNLSubmit(language === 'hi' ? q.q : q.qEn);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#141417] hover:bg-[#202024] border border-[#27272a] text-[11px] text-[#d4d4d8] hover:text-white whitespace-nowrap transition-colors"
            >
              {language === 'hi' ? q.q : q.qEn}
            </button>
          ))}
        </div>

        {/* Grounded AI Answer Banner */}
        {aiAnswer && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2.5 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <strong className="text-emerald-300 font-bold">
                  {t('एआई दस्तावेज विश्लेषण उत्तर:', 'AI Document Intelligence Insight:')}
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const textToRead = language === 'hi' ? aiAnswer.answerHi : aiAnswer.answer;
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(textToRead);
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-bold uppercase tracking-wider"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isSpeaking ? t('रोकें', 'Stop') : t('बोलकर सुनें', 'Listen')}</span>
                </button>
                <button onClick={() => setAiAnswer(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-zinc-100 leading-relaxed text-xs sm:text-sm">
              {language === 'hi' ? aiAnswer.answerHi : aiAnswer.answer}
            </p>

            {aiAnswer.groundedEvidence.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 font-semibold">{t('आधारित साक्ष्य:', 'Grounded in:')}</span>
                {aiAnswer.groundedEvidence.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#09090b] text-emerald-200 border border-emerald-500/20 font-mono text-[10px]">
                    {ev}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. PROVENANCE & CATEGORY FILTERS */}
      <div className="bg-[#09090b] rounded-2xl p-4 border border-[#1a1a1a] shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Provenance Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-[#71717a] font-bold uppercase tracking-wider mr-1 shrink-0">
            {t('स्रोत:', 'Source:')}
          </span>
          <button
            onClick={() => setProvenanceFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
              provenanceFilter === 'all'
                ? 'bg-zinc-200 text-black shadow-xs'
                : 'bg-[#141417] text-[#a1a1aa] hover:text-white border border-[#27272a]'
            }`}
          >
            {t('सभी स्रोत', 'All Sources')}
          </button>
          <button
            onClick={() => setProvenanceFilter('official_issued')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
              provenanceFilter === 'official_issued'
                ? 'bg-emerald-500 text-black shadow-xs'
                : 'bg-[#141417] text-emerald-400 hover:text-white border border-emerald-500/20'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{t('🏛️ सरकारी प्रमाणित', 'Certified Official')}</span>
          </button>
          <button
            onClick={() => setProvenanceFilter('citizen_uploaded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
              provenanceFilter === 'citizen_uploaded'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'bg-[#141417] text-amber-400 hover:text-white border border-amber-500/20'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('📄 नागरिक अपलोड', 'Citizen Uploaded')}</span>
          </button>
          <button
            onClick={() => setProvenanceFilter('ai_analysis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
              provenanceFilter === 'ai_analysis'
                ? 'bg-purple-500 text-black shadow-xs'
                : 'bg-[#141417] text-purple-400 hover:text-white border border-purple-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('✨ एआई ऑडिट रिपोर्ट', 'AI Audit Report')}</span>
          </button>
        </div>

        {/* Category Pills & Version History Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
              showVersionHistory
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                : 'bg-[#141417] text-blue-400 hover:text-white border border-blue-500/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('वर्शन इतिहास (Version History)', 'Version History')}</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#141417] text-[#71717a] hover:text-white border border-[#27272a]'
              }`}
            >
              {language === 'hi' ? cat.title : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* 4.5 VERSION HISTORY EXPANDED AUDIT VIEW */}
      {showVersionHistory && (
        <div className="bg-[#09090b] rounded-2xl p-5 border border-blue-500/30 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#27272a]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {t('दस्तावेज संस्करण इतिहास एवं अखंडता ऑडिट', 'Document Version History & Integrity Audit')}
                </h3>
                <span className="text-xs text-[#71717a]">
                  {t('प्रत्येक अपलोड, अद्यतन व राजस्व मुहर का अपरिवर्तनीय डिजिटल टाइमस्टैम्प', 'Immutable audit trail with SHA-256 cryptographic hashes for past uploads & revenue seals')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowVersionHistory(false)}
              className="p-1.5 text-[#71717a] hover:text-white rounded-lg hover:bg-[#18181b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs
              .filter(d => d.versionHistory && d.versionHistory.length > 0)
              .map(doc => (
                <div key={doc.id} className="p-4 rounded-xl bg-[#121214] border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-white">
                      {language === 'hi' ? doc.titleHi : doc.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      {doc.versionHistory?.length} {t('संस्करण', 'Versions')}
                    </span>
                  </div>

                  <div className="space-y-2 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-500/20">
                    {doc.versionHistory?.map(v => (
                      <div key={v.versionId} className="relative text-xs space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-bold font-mono text-[11px] ${v.isCurrent ? 'text-emerald-400' : 'text-zinc-400'}`}>
                            {v.versionNumber}
                          </span>
                          <span className="text-[10px] text-[#71717a] font-mono">{v.timestamp}</span>
                        </div>
                        <p className="text-[#a1a1aa] text-[11px]">
                          {language === 'hi' ? v.changeSummaryHi : v.changeSummary}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#71717a] font-mono pt-0.5">
                          <span className="truncate max-w-[200px]">SHA256: {v.sha256Hash.substring(0, 12)}...</span>
                          <span className="text-zinc-400">{v.fileSize}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setActiveTabInModal('versions');
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#1a1a1e] hover:bg-[#25252b] text-blue-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>{t('पूर्ण संस्करण विवरण देखें', 'Inspect Full Version Audit')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. DOCUMENT GRID (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => {
          const isOfficial = doc.provenance === 'official_issued' || doc.isRecordLinked;
          const isCitizenUpload = doc.provenance === 'citizen_uploaded' || doc.category === 'uploaded';
          const isAiReport = doc.provenance === 'ai_analysis' || doc.category === 'ai_report';

          return (
            <div
              key={doc.id}
              className="bg-[#09090b] rounded-2xl p-5 border border-[#1a1a1a] hover:border-[#27272a] shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header: Title, Provenance & Verification Badge */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1f1f23]">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                        isOfficial
                          ? 'bg-[#143d2b]/60 border-emerald-500/30 text-emerald-400'
                          : isCitizenUpload
                          ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                          : 'bg-purple-950/40 border-purple-500/30 text-purple-400'
                      }`}
                    >
                      {isOfficial && <Landmark className="w-5 h-5" />}
                      {isCitizenUpload && <Upload className="w-5 h-5" />}
                      {isAiReport && <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider font-mono ${
                            isOfficial
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isCitizenUpload
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {isOfficial && t('सरकारी प्रमाणित', 'Official Issued')}
                          {isCitizenUpload && t('नागरिक अपलोड', 'Citizen Uploaded')}
                          {isAiReport && t('एआई विश्लेषण', 'AI Analysis')}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mt-1 group-hover:text-emerald-300 transition-colors leading-snug">
                        {language === 'hi' ? doc.titleHi : doc.title}
                      </h3>
                      <span className="text-[11px] text-[#71717a] mt-0.5 block">
                        {language === 'hi' ? doc.issuingAuthorityHi : doc.issuingAuthority}
                      </span>
                    </div>
                  </div>

                  {/* Verification Pill */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 uppercase tracking-wider font-mono ${
                      doc.verificationStatus === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : doc.verificationStatus === 'discrepancy_detected'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {doc.verificationStatus === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                    {doc.verificationStatus === 'discrepancy_detected' && <AlertTriangle className="w-3 h-3" />}
                    <span>
                      {doc.verificationStatus === 'verified'
                        ? t('सत्यापित', 'Verified')
                        : doc.verificationStatus === 'discrepancy_detected'
                        ? t('अंतर चिह्नित', 'Difference')
                        : t('समीक्षा अधीन', 'Review')}
                    </span>
                  </span>
                </div>

                {/* Property & Document Meta Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#121214] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[9px] uppercase tracking-wider font-semibold">
                      {t('गाटा / खाता', 'Khasra / Khata')}
                    </span>
                    <span className="font-bold text-emerald-400 font-mono text-xs">
                      {doc.khasraNumber || doc.khataNumber || '452'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#121214] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[9px] uppercase tracking-wider font-semibold">
                      {t('ग्राम व तहसील', 'Village & Tehsil')}
                    </span>
                    <span className="font-semibold text-white text-xs truncate block">
                      {language === 'hi' ? doc.villageHi || 'रामनगर' : doc.village || 'Ramnagar'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#121214] border border-[#27272a]">
                    <span className="text-[#71717a] block text-[9px] uppercase tracking-wider font-semibold">
                      {t('दिनांक व आकार', 'Date & Size')}
                    </span>
                    <span className="font-semibold text-zinc-300 text-xs">
                      {doc.issueDate}
                    </span>
                  </div>
                </div>

                {/* AI Explanation Snippet */}
                {doc.aiExplanation && (
                  <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a] text-xs text-[#d4d4d8] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 text-[11px] leading-relaxed">
                      {language === 'hi' ? doc.aiExplanationHi : doc.aiExplanation}
                    </p>
                  </div>
                )}

                {/* Discrepancy Highlight if any */}
                {doc.comparisonResult && doc.comparisonResult.mismatches.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px]">
                      {language === 'hi' ? doc.comparisonResult.summaryHi : doc.comparisonResult.summary}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions Footer */}
              <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-[#1f1f23]">
                <button
                  onClick={() => {
                    setSelectedDoc(doc);
                    setActiveTabInModal('preview');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#27272a] uppercase tracking-wider"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('खोलें व समझें', 'Inspect & Read')}</span>
                </button>

                {doc.linkedMapParcelId && (
                  <button
                    onClick={() => handleOpenOnMap(doc.khasraNumber?.split(',')[0].trim() || '452')}
                    className="p-2 rounded-xl border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-emerald-400 text-xs font-semibold transition-colors flex items-center gap-1"
                    title={t('भू-नक्शे पर देखें', 'View on Cadastral Map')}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{t('नक्शा', 'Map')}</span>
                  </button>
                )}

                {doc.linkedMutationId && (
                  <button
                    onClick={() => handleOpenMutation(doc.linkedMutationId)}
                    className="p-2 rounded-xl border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    title={t('दाखिल-खारिज स्थिति देखें', 'Track Mutation')}
                  >
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline text-[11px]">{t('दाखिल-खारिज', 'Mutation')}</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopyShareLink(language === 'hi' ? doc.titleHi : doc.title)}
                  className="p-2 rounded-xl border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs transition-colors"
                  title={t('सुरक्षित लिंक साझा करें', 'Share Secure Link')}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-[#09090b] rounded-2xl p-12 border border-[#1a1a1a] text-center space-y-3">
          <FolderLock className="w-12 h-12 text-[#71717a] mx-auto opacity-50" />
          <h4 className="text-base font-bold text-white">
            {t('कोई दस्तावेज नहीं मिला', 'No Documents Found')}
          </h4>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto">
            {t(
              'चुने गए फ़िल्टर या खोज मानदंड के अनुसार कोई दस्तावेज़ उपलब्ध नहीं है। कृपया फ़िल्टर रीसेट करें।',
              'No documents match your active filters. Try clearing search or selecting all properties.'
            )}
          </p>
          <button
            onClick={() => {
              setSelectedPropertyId('all');
              setActiveCategory('all');
              setProvenanceFilter('all');
              setSearchQuery('');
              setAiAnswer(null);
            }}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider"
          >
            {t('सभी फ़िल्टर रीसेट करें', 'Reset All Filters')}
          </button>
        </div>
      )}

      {/* 6. TASK-BASED DOCUMENT BUNDLES (कार्यानुसार दस्तावेज बंडल) */}
      <div className="bg-[#09090b] rounded-2xl p-5 sm:p-6 border border-[#1a1a1a] shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <FileStack className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t('कार्यानुसार दस्तावेज बंडल (Task Bundles)', 'Task-Based Document Bundles')}
              </h3>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              {t(
                'बैंक लोन, जमीन बिक्री या सरकारी योजनाओं हेतु तैयार 1-क्लिक प्रमाणित दस्तावेज पैकेज:',
                'Pre-compiled, ready-to-share document packages for loans, land sale and government schemes:'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskBundles.map(bundle => {
            const availableCount = bundle.requiredDocs.filter(d => d.isAvailableInLocker).length;
            const totalCount = bundle.requiredDocs.length;
            const isReady = availableCount === totalCount;

            return (
              <div
                key={bundle.id}
                className="bg-[#121214] rounded-xl p-4 border border-[#27272a] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono">
                      {availableCount}/{totalCount} {t('दस्तावेज तैयार', 'Ready')}
                    </span>
                    {isReady ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" /> {t('पूर्ण बंडल', 'Complete')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 font-mono">
                        {t('1 शेष', '1 Pending')}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white mt-2 leading-snug">
                    {language === 'hi' ? bundle.titleHi : bundle.title}
                  </h4>
                  <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2 leading-relaxed">
                    {language === 'hi' ? bundle.descriptionHi : bundle.description}
                  </p>

                  {/* Checklist */}
                  <div className="mt-3 space-y-1.5 border-t border-[#1f1f23] pt-2">
                    {bundle.requiredDocs.map((docItem, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {docItem.isAvailableInLocker ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-amber-500/50 flex items-center justify-center shrink-0 text-[9px] text-amber-400 font-bold">
                            !
                          </div>
                        )}
                        <span className={docItem.isAvailableInLocker ? 'text-zinc-200' : 'text-zinc-400'}>
                          {language === 'hi' ? docItem.titleHi : docItem.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-[#1f1f23]">
                  <button
                    onClick={() => handleDownloadBundle(bundle)}
                    disabled={isExporting}
                    className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? t('तैयार हो रहा है...', 'Generating...') : t('बंडल डाउनलोड करें', 'Download Bundle')}</span>
                  </button>

                  <button
                    onClick={() => setSelectedBundle(bundle)}
                    className="p-2 rounded-lg border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white text-xs"
                    title={t('बंडल विवरण देखें', 'View Bundle Details')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. 13-YEAR CHAIN OF TITLE & HISTORICAL EVOLUTION */}
      <div className="bg-[#09090b] rounded-2xl p-5 sm:p-6 border border-[#1a1a1a] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t('जमीन मालिकाना श्रृंखला व कालक्रम (Chain of Title Timeline)', 'Chain of Title Timeline')}
            </h3>
            <p className="text-xs text-[#71717a]">
              {t('गाटा संख्या 452 व 218 के पंजीकरण, दाखिल-खारिज व खतौनी का कानूनी अनुक्रम:', 'Legal sequence connecting purchase, mutation, and current computerized records:')}
            </p>
          </div>
        </div>

        <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-6 space-y-6 pt-2">
          {/* Event 1: Registry 2018 */}
          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#09090b] shadow-sm"></span>
            <div className="text-xs font-mono font-bold text-emerald-400">18-Nov-2018 (पंजीकरण)</div>
            <h4 className="font-bold text-sm text-white mt-0.5">
              {t('पंजीकृत बैनामा विलेख #1109/2018 (रजिस्ट्री)', 'Registered Sale Deed #1109/2018')}
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              {t(
                'उप-निबंधक कार्यालय बिलारी में जगदीश प्रसाद द्वारा 0.180 हे. (गाटा 218) राम कुमार सिंह के पक्ष में पूर्ण प्रतिफल ₹8.50 लाख पर निष्पादित किया गया।',
                'Registered before Sub-Registrar Bilari by Jagdish Prasad in favour of Ram Kumar Singh for consideration of ₹8.50 Lakh.'
              )}
            </p>
          </div>

          {/* Event 2: Virasat Mutation 2020 */}
          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#09090b] shadow-sm"></span>
            <div className="text-xs font-mono font-bold text-emerald-400">10-Aug-2020 (नामान्तरण)</div>
            <h4 className="font-bold text-sm text-white mt-0.5">
              {t('दाखिल-खारिज परवाना आदेश #402/2020 (वरासत)', 'Dakhil-Kharij Parwana Order #402/2020')}
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              {t(
                'स्व. हरपाल सिंह के निधनोपरांत तहसीलदार (न्यायिक) बिलारी द्वारा निर्विरोध वरासत आदेश पारित कर दोनों पुत्रों (राम कुमार व श्याम कुमार) के नाम 50-50% हिस्सा दर्ज हुआ।',
                'Tehsildar Bilari passed judicial succession decree transferring ancestral land equally to Ram Kumar Singh & Shyam Kumar Singh.'
              )}
            </p>
          </div>

          {/* Event 3: Current Computerized Khatauni 2025 */}
          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#09090b] shadow-sm ring-4 ring-emerald-500/20"></span>
            <div className="text-xs font-mono font-bold text-emerald-400">2025 (वर्तमान अद्यतन)</div>
            <h4 className="font-bold text-sm text-white mt-0.5">
              {t('अद्यतन कंप्यूटरीकृत खतौनी (1430-1435 फसली)', 'Computerized Live Khatauni Form 45')}
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              {t(
                'राजस्व परिषद उ.प्र. के सर्वर पर डिजिटल हस्ताक्षरित खतौनी। एसबीआई बिलारी का ₹1,50,000 केसीसी फसल ऋण दर्ज है।',
                'Digitally signed Form 45 extract from UP Bhulekh server confirming active SBI Bilari crop loan.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 8. DOCUMENT DETAIL & INSPECTION MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#09090b] rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-[#27272a] relative animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#27272a]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                        selectedDoc.provenance === 'official_issued' || selectedDoc.isRecordLinked
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : selectedDoc.provenance === 'citizen_uploaded'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {language === 'hi' ? selectedDoc.provenanceHi || selectedDoc.categoryHi : selectedDoc.category}
                    </span>
                    <span className="text-xs text-[#71717a] font-mono">
                      {selectedDoc.fileSize} • {selectedDoc.fileType.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {language === 'hi' ? selectedDoc.titleHi : selectedDoc.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa]">
                    {t('जारीकर्ता: ', 'Authority: ')}
                    <strong className="text-zinc-200">
                      {language === 'hi' ? selectedDoc.issuingAuthorityHi : selectedDoc.issuingAuthority}
                    </strong>{' '}
                    ({selectedDoc.issueDate})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-[#71717a] hover:text-white rounded-xl hover:bg-[#18181b] border border-transparent hover:border-[#27272a] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 mt-4 border-b border-[#27272a] pb-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTabInModal('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    activeTabInModal === 'preview'
                      ? 'bg-white text-black font-extrabold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {t('दस्तावेज उद्धरण (Preview)', 'Document Excerpt')}
                </button>
                <button
                  onClick={() => setActiveTabInModal('ai_explanation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1 ${
                    activeTabInModal === 'ai_explanation'
                      ? 'bg-emerald-500 text-black font-extrabold'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('एआई व्याख्या (AI Insights)', 'AI Explanation')}</span>
                </button>
                <button
                  onClick={() => setActiveTabInModal('evidence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    activeTabInModal === 'evidence'
                      ? 'bg-white text-black font-extrabold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {t('सत्यापित तथ्य (Facts)', 'Extracted Facts')}
                </button>
                {selectedDoc.comparisonResult && (
                  <button
                    onClick={() => setActiveTabInModal('comparison')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1 ${
                      activeTabInModal === 'comparison'
                        ? 'bg-amber-500 text-black font-extrabold'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t('मिलान तुलना (Comparison)', 'Comparison')}</span>
                  </button>
                )}
                {selectedDoc.versionHistory && selectedDoc.versionHistory.length > 0 && (
                  <button
                    onClick={() => setActiveTabInModal('versions')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1 ${
                      activeTabInModal === 'versions'
                        ? 'bg-blue-600 text-white font-extrabold shadow-md'
                        : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('वर्शन इतिहास (Versions)', 'Version History')}</span>
                  </button>
                )}
                {selectedDoc.timelineHistory && (
                  <button
                    onClick={() => setActiveTabInModal('timeline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                      activeTabInModal === 'timeline'
                        ? 'bg-white text-black font-extrabold'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                  >
                    {t('कालक्रम (History)', 'Timeline')}
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="overflow-y-auto my-4 space-y-4 max-h-[52vh] pr-1">
              {/* 1. DOCUMENT PREVIEW TAB */}
              {activeTabInModal === 'preview' && (
                <div className="space-y-4">
                  {/* Simulated Revenue Document Header Seal */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#121214] border border-[#27272a] text-xs space-y-3 relative overflow-hidden">
                    <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
                      <Landmark className="w-32 h-32 text-emerald-400" />
                    </div>

                    <div className="text-center pb-3 border-b border-[#27272a]">
                      <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-bold block">
                        Government of Uttar Pradesh • Revenue Department
                      </span>
                      <h4 className="font-bold text-sm text-white mt-0.5">
                        {language === 'hi' ? selectedDoc.titleHi : selectedDoc.title}
                      </h4>
                      <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
                        {language === 'hi' ? selectedDoc.issuingAuthorityHi : selectedDoc.issuingAuthority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#71717a] text-[10px] block font-semibold">{t('गाटा / खसरा:', 'Khasra:')}</span>
                        <strong className="text-white font-mono">{selectedDoc.khasraNumber || '452, 453/1'}</strong>
                      </div>
                      <div>
                        <span className="text-[#71717a] text-[10px] block font-semibold">{t('खाता संख्या:', 'Khata No:')}</span>
                        <strong className="text-white font-mono">{selectedDoc.khataNumber || '00142'}</strong>
                      </div>
                      <div>
                        <span className="text-[#71717a] text-[10px] block font-semibold">{t('ग्राम व तहसील:', 'Village & Tehsil:')}</span>
                        <strong className="text-white">
                          {language === 'hi' ? selectedDoc.villageHi || 'रामनगर' : selectedDoc.village || 'Ramnagar'},{' '}
                          {language === 'hi' ? selectedDoc.tehsilHi || 'बिलारी' : selectedDoc.tehsil || 'Bilari'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#71717a] text-[10px] block font-semibold">{t('जारी तिथि:', 'Issued On:')}</span>
                        <strong className="text-white">{selectedDoc.issueDate}</strong>
                      </div>
                    </div>

                    {selectedDoc.sampleContent && (
                      <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f23] text-xs text-zinc-300 font-mono">
                        {selectedDoc.sampleContent}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. AI EXPLANATION TAB */}
              {activeTabInModal === 'ai_explanation' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <strong className="text-emerald-300 font-bold">
                          {t('सरल भाषा में समझें (Plain Language AI Summary):', 'Plain Language AI Summary:')}
                        </strong>
                      </div>
                      <button
                        onClick={() => {
                          const textToRead = language === 'hi' ? selectedDoc.aiExplanationHi : selectedDoc.aiExplanation;
                          if (textToRead) {
                            if (isSpeaking) stopSpeaking();
                            else speakText(textToRead);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? t('रोकें', 'Stop') : t('बोलकर समझें', 'Read Aloud')}</span>
                      </button>
                    </div>

                    <p className="text-zinc-100 text-xs sm:text-sm leading-relaxed">
                      {language === 'hi'
                        ? selectedDoc.aiExplanationHi || selectedDoc.aiExplanation
                        : selectedDoc.aiExplanation || selectedDoc.aiExplanationHi}
                    </p>
                  </div>

                  {selectedDoc.evidencePoints && selectedDoc.evidencePoints.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider">
                        {t('दस्तावेज से प्राप्त प्रमुख साक्ष्य (Grounded Citations):', 'Grounded Citations & Evidence:')}
                      </h4>
                      <div className="space-y-2">
                        {selectedDoc.evidencePoints.map((ev, i) => (
                          <div key={i} className="p-3 rounded-xl bg-[#121214] border border-[#27272a] text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{language === 'hi' ? ev.labelHi : ev.label}</span>
                              <span className="text-[10px] font-mono text-emerald-400">
                                {ev.confidence ? `${Math.round(ev.confidence * 100)}% Match` : 'Verified'}
                              </span>
                            </div>
                            <div className="font-semibold text-emerald-300">{ev.value}</div>
                            {ev.evidenceSnippet && (
                              <p className="text-[11px] text-[#71717a] font-mono italic">"{ev.evidenceSnippet}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. EXTRACTED FACTS TAB */}
              {activeTabInModal === 'evidence' && selectedDoc.extractedFields && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider">
                    {t('सत्यापित आंकड़े व फील्ड (Structured Fields):', 'Structured Fields & Values:')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedDoc.extractedFields).map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl bg-[#121214] border border-[#27272a]">
                        <span className="text-[10px] text-[#71717a] uppercase block font-semibold">{k}</span>
                        <span className="font-bold text-white text-xs mt-0.5 block">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. COMPARISON TAB */}
              {activeTabInModal === 'comparison' && selectedDoc.comparisonResult && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <strong className="text-amber-300 font-bold">
                        {t('सरकारी खतौनी बनाम अपलोड दस्तावेज तुलना:', 'Official Khatauni vs Uploaded Paper Comparison:')}
                      </strong>
                    </div>
                    <p className="text-zinc-200">
                      {language === 'hi'
                        ? selectedDoc.comparisonResult.summaryHi
                        : selectedDoc.comparisonResult.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {selectedDoc.comparisonResult.mismatches.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#121214] border border-[#27272a] text-xs space-y-2">
                        <span className="font-bold text-white block">
                          {language === 'hi' ? m.fieldHi : m.field}
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                            <span className="text-[9px] block text-emerald-400 uppercase font-semibold">
                              {t('सरकारी खतौनी (Official)', 'Official Record')}
                            </span>
                            <strong>{m.recordValue}</strong>
                          </div>
                          <div className="p-2 rounded bg-amber-950/30 border border-amber-500/20 text-amber-300">
                            <span className="text-[9px] block text-amber-400 uppercase font-semibold">
                              {t('अपलोड कागज़ (Uploaded)', 'Uploaded Doc')}
                            </span>
                            <strong>{m.documentValue}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5.5 VERSION HISTORY TAB */}
              {activeTabInModal === 'versions' && selectedDoc.versionHistory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('अपरिवर्तनीय संस्करण इतिहास व क्रिप्टोग्राफिक हैश', 'Immutable Version History & Integrity Hashes')}</span>
                    </h4>
                    <span className="text-[10px] text-[#71717a] font-mono">
                      {selectedDoc.versionHistory.length} {t('रिकॉर्ड प्रविष्टियां', 'Recorded Versions')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedDoc.versionHistory.map((ver, vIdx) => (
                      <div
                        key={ver.versionId}
                        className={`p-4 rounded-xl border transition-all ${
                          ver.isCurrent
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                            : 'bg-[#121214] border-[#27272a]'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-[#27272a]/60">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                ver.isCurrent
                                  ? 'bg-emerald-500 text-black font-extrabold'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {ver.versionNumber}
                            </span>
                            {ver.isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                                {t('● वर्तमान सक्रिय प्रति', '● Current Active Copy')}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#71717a]" />
                            {ver.timestamp}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2.5">
                          <div>
                            <span className="text-[#71717a] text-[10px] uppercase block font-semibold">
                              {t('अपलोडर / जारीकर्ता:', 'Uploaded By / Authority:')}
                            </span>
                            <span className="text-zinc-200 font-medium">
                              {language === 'hi' ? ver.uploadedByHi : ver.uploadedBy}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#71717a] text-[10px] uppercase block font-semibold">
                              {t('प्रस्थिति / स्थिति:', 'Status & Life-cycle:')}
                            </span>
                            <span className="text-zinc-200 font-medium">
                              {language === 'hi' ? ver.statusHi : ver.status}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs">
                          <span className="text-[#71717a] text-[10px] uppercase block font-semibold">
                            {t('बदलाव सारांश:', 'Change Summary:')}
                          </span>
                          <p className="text-zinc-300 mt-0.5 leading-relaxed">
                            {language === 'hi' ? ver.changeSummaryHi : ver.changeSummary}
                          </p>
                        </div>

                        <div className="mt-3 p-2 rounded-lg bg-[#09090b] border border-[#1f1f23] flex items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 text-zinc-400 truncate">
                            <Lock className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="text-[#71717a] shrink-0">SHA256:</span>
                            <span className="text-zinc-200 truncate">{ver.sha256Hash}</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ver.sha256Hash);
                              setCopiedHash(ver.versionId);
                              showToast(t('SHA-256 हैश क्लिपबोर्ड पर कॉपी किया गया', 'SHA-256 Hash copied to clipboard'));
                              setTimeout(() => setCopiedHash(''), 2500);
                            }}
                            className="px-2 py-0.5 rounded bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white shrink-0 flex items-center gap-1 text-[10px]"
                          >
                            {copiedHash === ver.versionId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedHash === ver.versionId ? t('कॉपी हुआ', 'Copied') : t('हैश कॉपी', 'Copy')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. TIMELINE TAB */}
              {activeTabInModal === 'timeline' && selectedDoc.timelineHistory && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider">
                    {t('दस्तावेज का ऐतिहासिक अनुक्रम (History):', 'Document Historical Sequence:')}
                  </h4>
                  <div className="relative border-l-2 border-emerald-500/30 ml-4 space-y-4 pt-1">
                    {selectedDoc.timelineHistory.map((hist, idx) => (
                      <div key={idx} className="relative pl-5">
                        <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#09090b]"></span>
                        <div className="text-[11px] font-mono font-bold text-emerald-400">{hist.date}</div>
                        <h5 className="font-bold text-xs text-white">
                          {language === 'hi' ? hist.titleHi : hist.title}
                        </h5>
                        <p className="text-xs text-[#a1a1aa] mt-0.5">
                          {language === 'hi' ? hist.descHi : hist.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#27272a]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyShareLink(language === 'hi' ? selectedDoc.titleHi : selectedDoc.title)}
                  className="px-3 py-2 rounded-xl bg-[#141417] hover:bg-[#1f1f23] text-zinc-200 hover:text-white border border-[#27272a] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? t('लिंक कॉपी हुआ!', 'Copied!') : t('सुरक्षित शेयर करें', 'Share Link')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedDoc.linkedMapParcelId && (
                  <button
                    onClick={() => {
                      setSelectedDoc(null);
                      handleOpenOnMap(selectedDoc.khasraNumber?.split(',')[0].trim() || '452');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('भू-नक्शा देखें', 'View Map')}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    selectRecordById('rec-001');
                    setActiveTab('land_record');
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider"
                >
                  {t('खतौनी रिकॉर्ड पर जाएं', 'View Land Record')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. TASK BUNDLE DETAIL MODAL */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09090b] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#27272a] relative animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#27272a]">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
                  Task Document Bundle
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {language === 'hi' ? selectedBundle.titleHi : selectedBundle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBundle(null)}
                className="p-1.5 text-[#71717a] hover:text-white rounded-lg hover:bg-[#18181b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {language === 'hi' ? selectedBundle.descriptionHi : selectedBundle.description}
            </p>

            <div className="space-y-2 border-t border-b border-[#27272a] py-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('आवश्यक दस्तावेजों की सूची:', 'Required Documents Checklist:')}
              </h4>
              <div className="space-y-2">
                {selectedBundle.requiredDocs.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#121214] border border-[#27272a] text-xs">
                    <div className="flex items-center gap-2">
                      {item.isAvailableInLocker ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="font-semibold text-zinc-200">
                        {language === 'hi' ? item.titleHi : item.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold font-mono ${item.isAvailableInLocker ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.isAvailableInLocker ? t('उपलब्ध', 'Available') : t('आवेदन करें', 'Missing')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBundle(null)}
                className="px-4 py-2 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a]"
              >
                {t('बंद करें', 'Close')}
              </button>
              <button
                onClick={() => {
                  handleDownloadBundle(selectedBundle);
                  setSelectedBundle(null);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('पूरा बंडल डाउनलोड करें', 'Download Complete Bundle')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Landmark,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const PublicFAQPage: React.FC = () => {
  const { language, t, navigateToApp } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const categories = [
    { id: 'all', labelHi: 'सभी प्रश्न', labelEn: 'All Questions' },
    { id: 'general', labelHi: 'सामान्य (General)', labelEn: 'General' },
    { id: 'khatauni', labelHi: 'खतौनी व हिस्सेदारी', labelEn: 'Khatauni & Ownership' },
    { id: 'mutation', labelHi: 'दाखिल-खारिज', labelEn: 'Mutation' },
    { id: 'document_ai', labelHi: 'दस्तावेज़ एआई', labelEn: 'Document AI' },
    { id: 'offline', labelHi: 'मोबाइल व ऑफ़लाइन', labelEn: 'Mobile & Offline' },
  ];

  const faqs = [
    {
      category: 'general',
      qHi: 'भूमि सेवक क्या है और यह सामान्य यूपी भूलेख से कैसे अलग है?',
      qEn: 'What is Bhoomi Sevak and how is it different from UP Bhulekh?',
      aHi: 'भूमि सेवक यूपी भूलेख का एक नागरिक-केंद्रित एआई इंटरफेस है। सामान्य भूलेख में कठिन कानूनी सारणियां होती हैं जिन्हें समझना मुश्किल होता है; भूमि सेवक बोलचाल की भाषा व आवाज़ में आपकी खतौनी समझाता है, हिस्सेदारी का चार्ट दिखाता है, बैंक बंधक की चेतावनी देता है और दाखिल-खारिज को 5 पारदर्शी चरणों में ट्रैक करता है।',
      aEn: 'Bhoomi Sevak is an AI-native citizen interaction layer. Legacy Bhulekh delivers dense tables of colonial jargon; Bhoomi Sevak translates records into natural speech/text, generates visual share breakdowns, flags hidden mortgages, and tracks mutations through 5 clear stages.',
    },
    {
      category: 'khatauni',
      qHi: 'खतौनी में सह-खातेदारों के हिस्से की गणना कैसे की जाती है?',
      qEn: 'How are co-sharer land fractions calculated in the Khatauni?',
      aHi: 'खतौनी में जब एक ही खाते में कई काश्तकारों के नाम होते हैं, तो कुल रकबा और उनके हिस्सेदारी अनुपात के आधार पर भूमि सेवक नियतात्मक गणितीय नियमों से प्रत्येक सह-खातेदार का सटीक रकबा (हेक्टेयर व बीघा) में अलग-अलग परिकलित करके प्रदर्शित करता है।',
      aEn: 'When multiple co-owners are recorded in a single Khata, Bhoomi Sevak applies deterministic mathematical division to compute the exact acreage (Hectares and local Bighas) held by each individual shareholder.',
    },
    {
      category: 'khatauni',
      qHi: 'खतौनी में दर्ज बैंक बंधक (रहन) का क्या अर्थ है और यह कैसे हटता है?',
      qEn: 'What does a bank mortgage entry mean in Khatauni and how is it removed?',
      aHi: 'जब कोई किसान केसीसी या ट्रैक्टर ऋण लेता है, तो बैंक खतौनी के कॉलम 7-12 में अपना प्रभार दर्ज कराता है। ऋण पूरी तरह चुकता होने के बाद बैंक "अनापत्ति प्रमाण पत्र" (NOC) तहसीलदार कोर्ट को भेजता है, जिसके बाद आदेश पारित करके बंधक खारिज किया जाता है।',
      aEn: 'When a farmer pledges land for agricultural credit, the bank registers an encumbrance in Column 7-12. Once the loan is fully repaid, the bank issues an NOC to the Tehsildar court, which passes a discharge order.',
    },
    {
      category: 'mutation',
      qHi: 'दाखिल-खारिज (Mutation) कितने दिनों में पूरा होना चाहिए?',
      qEn: 'What is the statutory timeframe for Mutation (Dakhil-Kharij) completion?',
      aHi: 'उत्तर प्रदेश राजस्व संहिता के अनुसार, यदि बैनामे या वरासत में कोई आपत्ति नहीं आती (अविवादित मामला), तो 35 कार्यदिवसों के भीतर तहसीलदार द्वारा आदेश पारित होकर खतौनी अद्यतन हो जानी चाहिए। विवादित मामलों में अधिकतम 90 दिन निर्धारित हैं।',
      aEn: 'Under UP Revenue Code rules, undisputed mutation cases (Section 34/35) must be finalized within 35 statutory working days. Contested cases have a 90-day target timeline.',
    },
    {
      category: 'document_ai',
      qHi: 'दस्तावेज़ एआई (Document Intelligence) पर फोटो अपलोड करने पर क्या सुरक्षा है?',
      qEn: 'How is data secured when uploading photos to Document Intelligence?',
      aHi: 'अपलोड किए गए सभी कागजात सर्वर-साइड एन्क्रिप्शन के साथ प्रोसेस होते हैं। हम किसी भी नागरिक का वास्तविक व्यक्तिगत डेटा (Aadhaar/PAN) संग्रहित नहीं करते। एआई केवल विसंगति जांचने के लिए टेक्स्ट का तात्कालिक विश्लेषण करता है।',
      aEn: 'All uploaded deeds are analyzed securely server-side. Zero private citizen PII or Aadhaar data is persisted. The AI performs transient OCR strictly for cross-referencing names and areas against verified registry records.',
    },
    {
      category: 'offline',
      qHi: 'क्या कमजोर 2G इंटरनेट या बिना नेटवर्क के भी भूमि सेवक काम करता है?',
      qEn: 'Does Bhoomi Sevak function on low 2G networks or without internet?',
      aHi: 'हाँ, भूमि सेवक में "भूलेख डिजिटल लॉकर" की सुविधा है। एक बार देखी गई प्रमाणित खतौनी और रिकॉर्ड्स आपके मोबाइल के स्थानीय ब्राउज़र कैश में सुरक्षित रहते हैं, जिससे खेत में नेटवर्क न होने पर भी आप अपने रिकॉर्ड्स देख सकते हैं।',
      aEn: 'Yes, Bhoomi Sevak features offline Progressive Web Caching. Once opened, certified records are stored in your device\'s local encrypted vault, enabling offline access even in remote agricultural fields without internet.',
    },
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.qHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.qEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.aHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.aEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. Header */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <HelpCircle className="w-4 h-4 text-sky-700" />
            <span>{t('सहायता एवं अक्सर पूछे जाने वाले प्रश्न', 'Help & Frequently Asked Questions')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('नागरिक सहायता व समाधान केंद्र', 'Citizen Support & Knowledge Base')}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'भूलेख, खतौनी, दाखिल-खारिज, नक्शा और भूमि सेवक पोर्टल के उपयोग से जुड़े आम सवालों के प्रामाणिक उत्तर।',
              'Authoritative answers to common questions regarding land records, mutation workflows, maps, and using the Bhoomi Sevak portal.'
            )}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={language === 'hi' ? 'अपने प्रश्न के बारे में खोजें...' : 'Search your question...'}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-sky-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-sky-200 hover:bg-sky-50'
            }`}
          >
            {language === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* 3. Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = expandedFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left bg-sky-50/50 hover:bg-sky-100/60 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {language === 'hi' ? faq.qHi : faq.qEn}
                </span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-sky-700" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-6 border-t border-sky-200 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white">
                  <p>{language === 'hi' ? faq.aHi : faq.aEn}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Emergency Civic Helplines Box */}
      <section className="bg-gradient-to-r from-sky-100/60 via-blue-50 to-sky-100/60 rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-sky-700" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t('सरकारी हेल्पलाइन व जनशिकायत निवारण', 'Official Citizen Helplines & Grievance Redressal')}
            </h3>
            <span className="text-xs text-slate-600">
              {t('यदि आपकी समस्या का समाधान नहीं हो रहा है तो इन आधिकारिक नंबरों पर संपर्क करें।', 'Official state escalation channels.')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('मुख्यमंत्री हेल्पलाइन (CM Helpline)', 'CM Jan Sunwai')}</strong>
            <span className="text-lg font-mono font-bold text-slate-900">1076</span>
            <p className="text-[11px] text-slate-500">{t('निःशुल्क 24x7 जनसुनवाई सेवा', 'Toll-free 24x7 grievance cell')}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('राजस्व परिषद उत्तर प्रदेश', 'UP Board of Revenue')}</strong>
            <span className="text-lg font-mono font-bold text-slate-900">155261</span>
            <p className="text-[11px] text-slate-500">{t('लखनऊ राजस्व मुख्यालय सहायता', 'State revenue headquarters')}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('भ्रष्टाचार निवारण हेल्पलाइन', 'Anti-Corruption Helpline')}</strong>
            <span className="text-lg font-mono font-bold text-slate-900">1064</span>
            <p className="text-[11px] text-slate-500">{t('सतर्कता अधिष्ठान उत्तर प्रदेश', 'State vigilance bureau')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

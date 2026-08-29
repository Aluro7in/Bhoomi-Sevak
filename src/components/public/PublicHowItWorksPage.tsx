import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
  Mic,
  FileText,
  Activity,
  FolderLock,
  Lock,
  Scale,
} from 'lucide-react';

export const PublicHowItWorksPage: React.FC = () => {
  const { language, t, navigateToApp, navigateToPublic } = useApp();

  const workflowSteps = [
    {
      num: '01',
      titleHi: 'नागरिक इनपुट (आवाज़ या सामान्य पाठ)',
      titleEn: 'Citizen Input (Voice or Natural Text)',
      icon: Mic,
      color: '#0284c7',
      bg: '#e0f2fe',
      descHi: 'नागरिक अपनी साधारण हिंदी या स्थानीय बोली में अपनी आवश्यकता व्यक्त करता है (जैसे: "बिलारी में राम कुमार की जमीन दिखाओ" या "खसरा 452 का हिस्सा")।',
      descEn: 'The citizen speaks or types in everyday colloquial Hindi or English without needing to know formal administrative codes or complex search filters.',
      techNoteHi: 'एआई स्पीच-टू-टेक्स्ट और बहुभाषी टोकनाइज़ेशन।',
      techNoteEn: 'Speech-to-text audio transcription and multilingual intent tokenization.',
    },
    {
      num: '02',
      titleHi: 'इरादा समझ व संस्था निष्कर्षण (Entity Extraction)',
      titleEn: 'Intent Understanding & Entity Extraction',
      icon: Sparkles,
      color: '#4f46e5',
      bg: '#e0e7ff',
      descHi: 'एआई मॉडल नागरिक के वाक्य से जिले, तहसील, गांव, भू-स्वामी के नाम, खतौनी या गाटा संख्या की पहचान करता है। यदि अस्पष्टता हो तो तुरंत स्पष्टीकरण मांगता है।',
      descEn: 'AI parses key entities (district, tehsil, village, owner name, plot numbers). If ambiguity exists (e.g. two Ram Kumars), it prompts the user with verified choices.',
      techNoteHi: 'नेचुरल लैंग्वेज एंटिटी पार्सर व अस्पष्टता समाधान।',
      techNoteEn: 'Entity extraction with zero-hallucination disambiguation loop.',
    },
    {
      num: '03',
      titleHi: 'नियतात्मक डेटाबेस खोज (Deterministic Registry Query)',
      titleEn: 'Deterministic Database & Registry Query',
      icon: Database,
      color: '#0891b2',
      bg: '#cffafe',
      descHi: 'एआई कभी भी मनगढ़ंत रिकॉर्ड नहीं बनाता। सभी वास्तविक तथ्य सीधे पोस्टग्रेएसक्यूएल डेटाबेस और प्रमाणित भूलेख रजिस्ट्री से शत-प्रतिशत सटीकता से प्राप्त किए जाते हैं।',
      descEn: 'The AI is strictly barred from inventing facts. Structured database lookups fetch official land records, areas, co-sharers, and statutory order sheets.',
      techNoteHi: 'नियतात्मक एसक्यूएल/रजिस्ट्री लुकअप — डेटाबेस ही एकमात्र सत्य।',
      techNoteEn: 'Deterministic SQL registry matching — the database is the sole truth.',
    },
    {
      num: '04',
      titleHi: 'सरल भाषा अनुवाद व साक्ष्य रेखांकन (Grounded AI)',
      titleEn: 'Plain Language Explanation & Evidence Grounding',
      icon: FileText,
      color: '#2563eb',
      bg: '#dbeafe',
      descHi: 'प्राप्त रिकॉर्ड को एआई सरल हिंदी में प्रस्तुत करता है। हिस्सेदारी का पाई-चार्ट बनाता है, बैंक बंधक की चेतावनी देता है और खतौनी के मूल कॉलम का संदर्भ देता है।',
      descEn: 'The structured record is translated into readable summaries, highlighting mortgages, disputes, and shares, with exact citations to the official Khatauni columns.',
      techNoteHi: 'संरचित डेटा-ग्राउंडेड भाषा अनुवाद एवं बाउंडिंग बॉक्स साक्ष्य।',
      techNoteEn: 'Strictly grounded structured summarization with visual citation.',
    },
    {
      num: '05',
      titleHi: 'कार्रवाई, ट्रैकिंग व ऑफ़लाइन सिंक (Action & Tracking)',
      titleEn: 'Action Bundles, Live Tracking & Offline Sync',
      icon: Activity,
      color: '#0369a1',
      bg: '#f0f9ff',
      descHi: 'नागरिक को अगले कानूनी कदम (वरासत आवेदन, मेड़बन्दी) बताए जाते हैं, दाखिल-खारिज के 5 चरणों की लाइव ट्रैकिंग होती है और रिकॉर्ड स्थानीय वॉल्ट में ऑफलाइन सुरक्षित हो जाता है।',
      descEn: 'Next legal steps are clearly laid out, mutation applications are tracked through 5 clear stages, and records are cached in the citizen\'s offline digital locker.',
      techNoteHi: 'प्रोग्रेसिव वेब कैश व 5-चरणीय वैधानिक वर्कफ़्लो इंजन।',
      techNoteEn: 'Progressive offline caching and statutory SLA workflow engine.',
    },
  ];

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <Cpu className="w-4 h-4 text-sky-700" />
            <span>{t('प्रणाली कार्यप्रणाली व एआई ढांचा', 'System Workflow & AI Architecture')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('भूमि सेवक कैसे काम करता है? (How It Works)', 'How Bhoomi Sevak Works: From Voice to Verified Truth')}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'पारंपरिक भूलेख प्रणालियों के विपरीत, भूमि सेवक प्राकृतिक मानव भाषा और एआई दृष्टि मॉडल का उपयोग केवल समझने और समझाने के लिए करता है। तथ्यात्मक डेटा सदैव आधिकारिक रिकॉर्ड से ही प्राप्त होता है।',
              'Unlike opaque legacy databases, Bhoomi Sevak leverages natural language AI and vision solely as an interactive bridge, while maintaining absolute deterministic truth for all ownership facts.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Visual 5-Step Architecture Workflow */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xs hover:border-sky-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs"
                    style={{ backgroundColor: step.bg, color: step.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
                      {t('चरण', 'Step')} {step.num}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {language === 'hi' ? step.titleHi : step.titleEn}
                    </h2>
                  </div>
                </div>

                {/* Explanation */}
                <div className="flex-1 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                  <p>{language === 'hi' ? step.descHi : step.descEn}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-[11px] font-mono text-sky-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                    <span>{language === 'hi' ? step.techNoteHi : step.techNoteEn}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Strict Boundary Matrix: AI vs Deterministic Software */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {t('सत्यनिष्ठा विभाजन', 'Architectural Boundary Matrix')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('एआई बनाम नियतात्मक सॉफ्टवेयर (Deterministic Software)', 'AI Layer vs Deterministic Source of Truth')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Zone */}
          <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sky-900">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <h3 className="text-base">{t('एआई की सीमाएं (What AI Does)', 'AI Interactive Layer')}</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t('नागरिक की क्षेत्रीय भाषा व आवाज़ को समझना।', 'Natural dialect and voice transcriptions.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t('राजस्व प्रविष्टियों की व्याख्या और सारांश तैयार करना।', 'Plain-language legal text explanation & summaries.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t('दस्तावेज़ की फोटो से पाठ पढ़ना व विसंगति चिन्हित करना।', 'Optical character recognition and document highlighting.')}</span>
              </li>
            </ul>
          </div>

          {/* Deterministic Zone */}
          <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-4">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Lock className="w-5 h-5 text-blue-700" />
              <h3 className="text-base">{t('सॉफ्टवेयर की सीमाएं (What Database Does)', 'Deterministic Core')}</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-blue-950">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t('स्वामित्व, रकबा और गाटा संख्या की प्रामाणिकता।', 'Ownership titles, plot areas, and cadastral boundaries.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t('हेक्टेयर, बीघा और बिस्वा का सटीक अंकगणित।', 'Mathematical area conversions and share fractions.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t('दाखिल-खारिज के 5 चरणों की समय-सीमा और स्थिति।', 'Mutation stage transitions, SLA dates, and case status.')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Bottom Action */}
      <section className="bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold">
          {t('इस कार्यप्रणाली का प्रत्यक्ष अनुभव करें', 'Experience the Live System Workflow')}
        </h2>
        <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
          {t('हमारे कार्यरत प्रोटोटाइप में प्रवेश करें और रामनगर ग्राम के सिंथेटिक रिकॉर्ड्स पर खोज करके देखें।', 'Enter our working prototype and test searches across synthetic village records.')}
        </p>
        <button
          onClick={() => navigateToApp('meri_zameen')}
          className="px-6 py-3 rounded-xl bg-sky-300 hover:bg-sky-200 text-sky-950 text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          {t('पोर्टल में प्रवेश करें (Enter App)', 'Enter Citizen App')}
        </button>
      </section>
    </div>
  );
};

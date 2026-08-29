import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Scale,
  Users,
  Compass,
  FileText,
  MapPin,
  Activity,
  Cpu,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const PublicAboutPage: React.FC = () => {
  const { language, t, navigateToApp, navigateToPublic } = useApp();

  const journeySteps = [
    {
      step: '1',
      titleHi: 'ASK (पूछें)',
      titleEn: 'ASK (Natural Input)',
      descHi: 'अपनी क्षेत्रीय बोली या आवाज़ में जो चाहिए वह कहें।',
      descEn: 'Speak or type in everyday dialect without formal jargon.',
    },
    {
      step: '2',
      titleHi: 'FIND (खोजें)',
      titleEn: 'FIND (Deterministic Match)',
      descHi: 'सटीक गांव, गाटा व खतौनी डेटाबेस से खोजी जाती है।',
      descEn: 'Exact village, plot, and registry match retrieved from database.',
    },
    {
      step: '3',
      titleHi: 'UNDERSTAND (समझें)',
      titleEn: 'UNDERSTAND (Plain Language)',
      descHi: 'जटिल राजस्व प्रविष्टियां सरल हिंदी में अनुवादित होती हैं।',
      descEn: 'Archaic legal rows translated to simple human terms.',
    },
    {
      step: '4',
      titleHi: 'VERIFY (सत्यापित करें)',
      titleEn: 'VERIFY (Doc Mismatch Check)',
      descHi: 'कागजात की फोटो से सरकारी रिकॉर्ड का मिलान होता है।',
      descEn: 'Paper deeds visually cross-referenced with live registry.',
    },
    {
      step: '5',
      titleHi: 'ACT (कार्रवाई करें)',
      titleEn: 'ACT (Statutory Steps)',
      descHi: 'वरासत, दाखिल-खारिज या मेड़बन्दी के अगले कदम समझें।',
      descEn: 'Actionable guidance on Section 34/24 forms, fees, and rules.',
    },
    {
      step: '6',
      titleHi: 'TRACK (ट्रैक करें)',
      titleEn: 'TRACK (Live Progress)',
      descHi: 'आवेदन के 5 चरणों की पारदर्शी वास्तविक स्थिति देखें।',
      descEn: 'Real-time 5-stage tracking with officer responsibility.',
    },
  ];

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. About Mission Hero Header */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <Building2 className="w-4 h-4 text-sky-700" />
            <span>{t('मिशन व परिचय', 'Mission & Vision')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? (
              <>
                भूमि सेवक का उद्देश्य: <br />
                <span className="text-sky-700">नागरिक को नहीं, सिस्टम को नागरिक की भाषा समझनी चाहिए।</span>
              </>
            ) : (
              <>
                The Bhoomi Sevak Thesis: <br />
                <span className="text-sky-700">"Don't make citizens learn the bureaucracy. Make the system understand the citizen."</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'भूमि सेवक उत्तर प्रदेश के 4.5+ करोड़ भू-स्वामियों और ग्रामीण नागरिकों के लिए तैयार किया गया एक एआई-सक्षम नागरिक सहभागिता इंटरफेस (AI-Native Citizen Interaction Layer) है। यह पारंपरिक भूलेख पोर्टलों का साधारण कॉस्मेटिक नया रूप नहीं है, बल्कि नागरिक और राजस्व प्रशासन के बीच की भाषा व समझ की खाई को पाटने वाला आधुनिक सेतु है।',
              'Bhoomi Sevak is an AI-native citizen interaction layer engineered for 4.5+ crore rural landowners and citizens in Uttar Pradesh. It is not a cosmetic redesign of legacy portals, but a structural bridge that translates complex land administration into intuitive, trustworthy citizen intelligence.'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateToApp('meri_zameen')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{t('नागरिक पोर्टल में प्रवेश करें', 'Enter Citizen Application')}</span>
              <ArrowRight className="w-4 h-4 text-sky-200" />
            </button>
            <button
              onClick={() => navigateToPublic('services')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-sky-50 text-slate-700 text-xs font-bold border border-sky-200 transition-all cursor-pointer shadow-2xs"
            >
              {t('सेवाओं का विवरण देखें', 'Explore Services')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. The Core 6-Step Citizen Journey */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {t('नागरिक यात्रा दर्शन', 'Primary Citizen Journey')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ASK → FIND → UNDERSTAND → VERIFY → ACT → TRACK
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t(
              'हर नागरिक को अपने भू-अधिकार को जानने और सुरक्षित रखने के लिए छह स्पष्ट चरणों से सशक्त बनाया जाता है।',
              'Every citizen is empowered through six structured milestones to inspect, comprehend, and protect their land.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journeySteps.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-2 hover:border-sky-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                  {item.step}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('चरण', 'Stage')} {item.step}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? item.titleHi : item.titleEn}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? item.descHi : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Structural Architectural Philosophy */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {t('तकनीकी दर्शन एवं सिद्धांत', 'Architectural Boundaries')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('एआई और नियतात्मक सॉफ्टवेयर (Deterministic Software) का संतुलन', 'Balancing AI Comprehension with Deterministic Truth')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Role */}
          <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
            <div className="flex items-center gap-2 text-sky-800 font-bold">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-bold">{t('एआई की भूमिका (AI Responsibility)', 'The Role of AI')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'एआई का उपयोग केवल उन कार्यों में किया जाता है जहां मानव भाषा और दृष्टि समझ आवश्यक है:',
                'AI is strictly deployed where natural language understanding and visual intelligence create value:'
              )}
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>{t('नागरिक की बोलचाल से इरादे व संस्थाओं (इकाई, गांव, नाम) की पहचान।', 'Intent understanding and entity extraction from conversational audio/text.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>{t('राजस्व प्रविष्टियों का सरल एवं सुगम भाषा में अनुवाद।', 'Translation of complex legal order sheets into understandable Hindi/English.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>{t('कागजात की फोटो से टेक्स्ट पढ़ना और विसंगतियों को रेखांकित करना।', 'Document optical character recognition and visual bounding box highlighting.')}</span>
              </li>
            </ul>
          </div>

          {/* Deterministic Software Role */}
          <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Scale className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold">{t('सॉफ्टवेयर की भूमिका (Deterministic Software)', 'Deterministic Truth Layer')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'तथ्य, अंकगणित और कानूनी स्थिति सदैव नियतात्मक नियमों से तय होती है:',
                'All facts, calculations, and registry state transitions are purely deterministic:'
              )}
            </p>
            <ul className="space-y-2 text-xs text-blue-950">
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>{t('डेटाबेस क्वेरी, सर्च और रिकॉर्ड्स का मिलान।', 'Database indexing, filtering, and exact Khata/Khasra lookups.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>{t('रकबा गणना, हेक्टेयर-बीघा रूपांतरण और हिस्सेदारी गणित।', 'Precise land area conversion arithmetic (Hectare to Bigha/Biswa).')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">•</span>
                <span>{t('दाखिल-खारिज के 5 चरणों की समय-सीमा व स्थिति संक्रमण।', 'Statutory 35-day mutation state transitions and fee schedules.')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Hackathon & Civic Context */}
      <section className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-sky-800 space-y-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-sky-300" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {t('Build What Moves India — हैकाथॉन पहल', 'Build What Moves India — Hackathon Initiative')}
            </h3>
            <span className="text-xs text-sky-300 font-semibold">
              {t('नागरिक समस्या समाधान प्रोटोटाइप', 'Citizen Problem-Solving Prototype')}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-3xl">
          {t(
            'यह परियोजना "Build What Moves India" चुनौती के अंतर्गत एक उच्च-गुणवत्ता वाले नागरिक प्रोटोटाइप के रूप में विकसित की गई है। इसका उद्देश्य भारत के ग्रामीण डिजिटल परिवर्तन में भाषा और डिजिटल साक्षरता की बाधा को समाप्त करना है।',
            'This project has been built as a high-quality civic prototype under the Build What Moves India challenge. It targets the elimination of linguistic and digital literacy barriers in rural land administration.'
          )}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => navigateToPublic('how_it_works')}
            className="px-5 py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-sky-950 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            {t('कार्यप्रणाली विवरण पढ़ें', 'Read How It Works')}
          </button>
          <button
            onClick={() => navigateToPublic('trust')}
            className="px-5 py-2.5 rounded-xl bg-sky-950/80 text-white hover:bg-sky-900 text-xs font-bold border border-sky-700/60 transition-colors cursor-pointer"
          >
            {t('प्रोटोटाइप प्रकटीकरण', 'Prototype Disclosures')}
          </button>
        </div>
      </section>
    </div>
  );
};

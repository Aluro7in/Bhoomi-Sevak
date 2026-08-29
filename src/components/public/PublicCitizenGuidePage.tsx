import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Scale,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

export const PublicCitizenGuidePage: React.FC = () => {
  const { language, t, navigateToApp } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeGuide, setActiveGuide] = useState<number | null>(0);

  const glossaryTerms = [
    {
      termHi: 'संक्रमणीय भूमिधर (Bhumidhar with Transferable Rights)',
      termEn: 'Bhumidhar with Transferable Rights',
      meaningHi: 'जमीन का पूर्ण व स्थायी स्वामी, जिसे जमीन बेचने, दान करने, बंधक रखने या वसीयत करने का पूर्ण कानूनी अधिकार होता है।',
      meaningEn: 'Absolute and permanent land owner with unrestricted rights to sell, gift, mortgage, or bequeath the property under UP Revenue Code.',
      tag: 'स्वामित्व (Ownership)',
    },
    {
      termHi: 'असंक्रमणीय भूमिधर (Bhumidhar with Non-Transferable Rights)',
      termEn: 'Bhumidhar with Non-Transferable Rights',
      meaningHi: 'पट्टाधारक जिन्हें 5 वर्षों तक जमीन पर खेती का अधिकार होता है परन्तु वे इसे बेच या वसीयत नहीं कर सकते। 5 वर्ष बाद वे स्वतः संक्रमणीय हो जाते हैं।',
      meaningEn: 'Allottee with cultivation rights who cannot sell or transfer the land for an initial 5-year statutory period.',
      tag: 'पट्टा (Lease)',
    },
    {
      termHi: 'गाटा / खसरा संख्या (Gata / Khasra Number)',
      termEn: 'Gata / Khasra (Plot) Number',
      meaningHi: 'भू-नक्शे पर खेत या भूखंड को दी गई विशिष्ट सर्वेक्षण संख्या (Plot Survey Number)।',
      meaningEn: 'The unique cadastral survey parcel number assigned to an individual plot on village map.',
      tag: 'भू-नक्शा (Map)',
    },
    {
      termHi: 'खाता संख्या (Khata Number)',
      termEn: 'Khata (Account) Number',
      meaningHi: 'खतौनी में एक या अधिक सह-खातेदारों के सामूहिक भू-स्वामित्व का रजिस्टर खाता क्रमांक।',
      meaningEn: 'The ledger account number in the Record of Rights grouping all co-sharers of specified plots.',
      tag: 'अभिलेख (Record)',
    },
    {
      termHi: 'दाखिल-खारिज / नामांतरण (Mutation)',
      termEn: 'Mutation (Dakhil-Kharij)',
      meaningHi: 'जमीन की बिक्री, दान या मृत्यु के बाद पुराने स्वामी का नाम हटाकर नए स्वामी का नाम खतौनी में आधिकारिक रूप से दर्ज करने की वैधानिक प्रक्रिया।',
      meaningEn: 'The formal administrative process of substituting the previous owner\'s name with the new owner\'s name in the land registry.',
      tag: 'प्रक्रिया (Workflow)',
    },
    {
      termHi: 'वरासत (Varasat / Undisputed Succession)',
      termEn: 'Varasat (Succession)',
      meaningHi: 'खातेदार के निधन के पश्चात उनके वैध वारिसों (पुत्र, पुत्री, विधवा पत्नी) का नाम खतौनी में दर्ज कराने का अविवादित ऑनलाइन प्रार्थना पत्र (धारा 33)।',
      meaningEn: 'Online registration of legal heirs (sons, daughters, widow) following the demise of a landowner without court litigation.',
      tag: 'उत्तराधिकार (Inheritance)',
    },
    {
      termHi: 'चौहद्दी (Chauhaddi / Boundary Coordinates)',
      termEn: 'Chauhaddi (Plot Boundaries)',
      meaningHi: 'खेत के चारों दिशाओं (उत्तर, दक्षिण, पूर्व, पश्चिम) में स्थित पड़ोसी किसानों के खेत या रास्तों का विवरण।',
      meaningEn: 'The four directional boundaries (North, South, East, West) describing adjacent plots, chak roads, or water channels.',
      tag: 'सीमा (Boundary)',
    },
    {
      termHi: 'मेड़बन्दी / सीमांकन (Demarcation - Sec 24)',
      termEn: 'Boundary Demarcation (Sec 24)',
      meaningHi: 'यदि पड़ोसी किसान खेत की मेड़ काट ले या विवाद हो, तो उप-जिलाधिकारी (SDM) द्वारा राजस्व टीम भेजकर खेत की सरकारी पैमाइश कराने की प्रक्रिया।',
      meaningEn: 'Statutory process under Section 24 of UP Revenue Code to re-survey and physically mark disputed plot boundaries.',
      tag: 'पैमाइश (Survey)',
    },
    {
      termHi: 'बंधक / रहन (Bank Mortgage / Encumbrance)',
      termEn: 'Bank Mortgage (Rahan / Bandhak)',
      meaningHi: 'किसान द्वारा बैंक से ऋण (KCC) लेने पर खतौनी के कॉलम 7-12 में बैंक का नाम दर्ज होना। ऋण चुकता होने पर ही यह प्रविष्टि हटती है।',
      meaningEn: 'Formal encumbrance recorded in Column 7-12 of Khatauni when land is pledged as collateral for agricultural loans.',
      tag: 'ऋण (Mortgage)',
    },
    {
      termHi: 'हेक्टेयर बनाम बीघा (Land Area Conversion)',
      termEn: 'Hectare vs Bigha Conversion',
      meaningHi: 'सरकारी खतौनी में रकबा सदैव हेक्टेयर में दर्ज होता है (1 हेक्टेयर = 10,000 वर्ग मीटर = लगभग 3.95 पक्का बीघा या 12.5 कच्चा बीघा)।',
      meaningEn: 'Official UP Khataunis record area strictly in Hectares (1 Hectare = 10,000 sq m ≈ 3.95 Pakka Bigha in Western UP).',
      tag: 'माप (Measurement)',
    },
  ];

  const practicalGuides = [
    {
      titleHi: 'गाइड 1: जमीन खरीदने से पहले 7 अनिवार्य जांचें (Pre-Purchase Checklist)',
      titleEn: 'Guide 1: 7 Crucial Checks Before Buying Agricultural Land',
      stepsHi: [
        'खतौनी में विक्रेता का नाम "संक्रमणीय भूमिधर" के रूप में सत्यापित करें।',
        'कॉलम 7-12 में जांचें कि किसी बैंक का सक्रिय बंधक या ऋण दर्ज तो नहीं है।',
        'भू-नक्शा पोर्टल पर गाटा संख्या का वास्तविक आकार और चकरोड का रास्ता देखें।',
        'राजस्व न्यायालय कंप्यूटरीकृत प्रबंधन प्रणाली (RCCMS) पर वाद (Litigation) जांचें।',
        'विक्रेता के सह-खातेदारों के आपसी हिस्से और भौतिक कब्जे की मौके पर पुष्टि करें।',
        'यदि भूमि एससी/एसटी वर्ग की है तो धारा 98 के तहत जिलाधिकारी की पूर्व अनुमति अनिवार्य है।',
        'भूमि सेवक डॉक्यूमेंट एआई पर पुराने बैनामे की फोटो अपलोड करके नाम-रकबा मिलान करें।',
      ],
      stepsEn: [
        'Verify the seller is categorized as "Bhumidhar with Transferable Rights".',
        'Check Column 7-12 for active bank mortgages or institutional charges.',
        'Inspect the plot on Cadastral Map for shape, area, and public chak-road access.',
        'Search UP RCCMS revenue court portal for pending litigations or stay orders.',
        'Physically verify field possession and ascertain co-sharer partition on ground.',
        'Ensure mandatory DM approval under Section 98 if seller belongs to SC/ST category.',
        'Scan seller\'s previous deed using Bhoomi Sevak Document AI to check area discrepancies.',
      ],
    },
    {
      titleHi: 'गाइड 2: वरासत (Undisputed Succession) कैसे दर्ज कराएं',
      titleEn: 'Guide 2: How to Register Undisputed Inheritance (Varasat)',
      stepsHi: [
        'खातेदार की मृत्यु के बाद ग्राम पंचायत या नगर निकाय से मृत्यु प्रमाण पत्र प्राप्त करें।',
        'उत्तर प्रदेश राजस्व परिषद पोर्टल पर ऑनलाइन वरासत (धारा 33) आवेदन भरें।',
        'सभी वैध वारिसों (पुत्र, पुत्री, पत्नी) के आधार व विवरण दर्ज करें।',
        'हल्का लेखपाल 15 दिनों के भीतर ग्राम में जांच करके अपनी संस्तुति आख्या लगाएगा।',
        'राजस्व निरीक्षक (RI) द्वारा आदेश पारित होते ही नई खतौनी में वारिसों के नाम दर्ज हो जाएंगे।',
      ],
      stepsEn: [
        'Obtain an official Death Certificate from the Gram Panchayat or Municipal body.',
        'Submit online Varasat Form under Section 33 on the UP Revenue Portal.',
        'List all statutory legal heirs (sons, daughters, surviving spouse) with ID proof.',
        'Field Lekhpal conducts village verification within 15 days and submits report.',
        'Revenue Inspector passes formal mutation order updating names in the live Khatauni.',
      ],
    },
    {
      titleHi: 'गाइड 3: खेत की मेड़ कटने पर धारा 24 मेड़बन्दी (Demarcation) कैसे कराएं',
      titleEn: 'Guide 3: Boundary Demarcation (Medbandi) under Section 24',
      stepsHi: [
        'उप-जिलाधिकारी (SDM) न्यायालय में धारा 24 के अंतर्गत मेड़बन्दी का प्रार्थना पत्र दें।',
        'राजस्व संहिता के अनुसार प्रति गाटा ₹1,000 सरकारी चालान कोषागार में जमा करें।',
        'एसडीएम द्वारा राजस्व निरीक्षक व लेखपाल की टीम गठित की जाएगी।',
        'पड़ोसी काश्तकारों को नोटिस देकर मौके पर जरीब/ईटीएस मशीन से सरकारी पैमाइश होगी।',
        'सीमांकन रिपोर्ट के आधार पर पक्के पत्थर (सीमेंटेड पिलर) गड़वाए जाएंगे।',
      ],
      stepsEn: [
        'File an application for boundary demarcation under Section 24 before the SDM Court.',
        'Deposit statutory treasury challan fee (₹1,000 per disputed plot number).',
        'SDM issues formal notice to field survey team (Revenue Inspector & Lekhpal).',
        'Official survey is conducted on-site with chain/ETS in presence of adjacent plot owners.',
        'Permanent boundary corner stones (seema stambh) are installed based on survey report.',
      ],
    },
  ];

  const filteredGlossary = glossaryTerms.filter(
    g =>
      g.termHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.meaningHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.meaningEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. Guide Header */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <BookOpen className="w-4 h-4 text-sky-700" />
            <span>{t('नागरिक शिक्षा व शब्दावली', 'Citizen Education & Legal Glossary')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('राजस्व शब्दावली एवं नागरिक अधिकार मार्गदर्शिका', 'Revenue Glossary & Citizen Action Guides')}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'उत्तर प्रदेश राजस्व संहिता (UP Revenue Code) के जटिल कानूनी शब्दों को सरल और बोलचाल की हिंदी में समझें। जमीन खरीदने, वरासत दर्ज कराने और सीमा विवाद सुलझाने की चरणबद्ध मार्गदर्शिका।',
              'Demystifying UP Revenue Code terminology into clear, accessible Hindi and English. Step-by-step citizen guides for property diligence, succession, and boundary resolution.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Revenue Glossary Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('राजस्व शब्दावली सरल भाषा में (Glossary)', 'Land Revenue Glossary in Plain Language')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('खतौनी में आने वाले सभी प्रमुख तकनीकी शब्दों का वास्तविक अर्थ।', 'Meaning of all key legal terms found in official Khataunis.')}
            </p>
          </div>

          {/* Search Box inside Glossary */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={language === 'hi' ? 'शब्दावली में खोजें...' : 'Search terms...'}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-sky-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-2 hover:border-sky-400 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-sky-800">
                  {language === 'hi' ? item.termHi : item.termEn}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? item.meaningHi : item.meaningEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Practical Citizen Action Guides */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('नागरिक व्यावहारिक मार्गदर्शिका (Step-by-Step Guides)', 'Practical Citizen Action Guides')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('जमीन से जुड़े महत्वपूर्ण कानूनी कार्यों को संपन्न करने की प्रामाणिक प्रक्रिया।', 'Clear procedural roadmaps for key land governance actions.')}
          </p>
        </div>

        <div className="space-y-4">
          {practicalGuides.map((guide, gIdx) => {
            const isOpen = activeGuide === gIdx;
            return (
              <div
                key={gIdx}
                className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setActiveGuide(isOpen ? null : gIdx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left bg-sky-50/50 hover:bg-sky-100/60 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {language === 'hi' ? guide.titleHi : guide.titleEn}
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-sky-700" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-6 border-t border-sky-200 space-y-3 bg-white">
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {(language === 'hi' ? guide.stepsHi : guide.stepsEn).map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-sky-100 flex justify-end">
                      <button
                        onClick={() => navigateToApp('meri_zameen')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>{t('पोर्टल पर लागू करें', 'Apply in Citizen Portal')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

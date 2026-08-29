import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../context/AppContext';
import {
  FileText,
  MapPin,
  FolderLock,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Landmark,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck,
  Scale,
  HelpCircle,
} from 'lucide-react';

export const PublicServicesPage: React.FC = () => {
  const { language, t, navigateToApp } = useApp();

  const services: {
    id: ActiveTab;
    titleHi: string;
    titleEn: string;
    categoryHi: string;
    categoryEn: string;
    icon: any;
    color: string;
    accentBg: string;
    accentText: string;
    descHi: string;
    descEn: string;
    audienceHi: string;
    audienceEn: string;
    documentsHi: string[];
    documentsEn: string[];
    timelineHi: string;
    timelineEn: string;
    feeHi: string;
    feeEn: string;
    officerHi: string;
    officerEn: string;
    benefitsHi: string[];
    benefitsEn: string[];
  }[] = [
    {
      id: 'land_record',
      titleHi: 'खतौनी नकल व अधिकार अभिलेख समझें (RoR Intelligence)',
      titleEn: 'Record of Rights (Khatauni) Comprehension',
      categoryHi: 'भू-अधिकार व स्वामित्व',
      categoryEn: 'Land Ownership & Rights',
      icon: FileText,
      color: '#0284c7',
      accentBg: '#e0f2fe',
      accentText: '#0369a1',
      descHi: 'उत्तर प्रदेश भूलेख की खतौनी प्रविष्टियों को अपनी सरल भाषा में समझें। इसमें सह-खातेदारों के हिस्से, कुल क्षेत्रफल (हेक्टेयर व बीघा), सक्रिय बैंक बंधक, न्यायालयी आदेश एवं उत्तराधिकार टिप्पणियों का स्वतः विश्लेषण प्राप्त होता है।',
      descEn: 'Instant natural-language explanation of UP Bhulekh Khatauni records. Automatically calculates exact co-ownership shares, converts land area to local units, and highlights active bank mortgages or court stays.',
      audienceHi: 'किसान, भू-स्वामी, खरीदार और बैंक ऋण आवेदक।',
      audienceEn: 'Farmers, land buyers, inheritors, and bank loan applicants.',
      documentsHi: ['खाता संख्या या खसरा (गाटा) संख्या', 'गांव का नाम व तहसील', 'भू-स्वामी का नाम'],
      documentsEn: ['Khata or Khasra (Gata) Number', 'Village and Tehsil Name', 'Landowner Name'],
      timelineHi: 'तत्काल (3 सेकंड के भीतर)',
      timelineEn: 'Instantaneous (< 3 seconds)',
      feeHi: 'निःशुल्क (प्रोटोटाइप स्तर पर)',
      feeEn: 'Free of Cost',
      officerHi: 'लेखपाल / राजस्व निरीक्षक',
      officerEn: 'Lekhpal / Revenue Inspector',
      benefitsHi: [
        'कठिन कानूनी शब्दों का सरल अर्थ।',
        'सह-खातेदारों के हिस्से का स्पष्ट विभाजन।',
        'कॉलम 7-12 में दर्ज बैंक बंधक की तत्काल चेतावनी।',
      ],
      benefitsEn: [
        'Zero jargon, simple regional language.',
        'Visual co-ownership share allocation.',
        'Immediate warning for active bank encumbrances.',
      ],
    },
    {
      id: 'cadastral_map',
      titleHi: 'डिजिटल भू-नक्शा, गाटा व चौहद्दी सीमांकन',
      titleEn: 'Cadastral Map & Parcel Boundary Demarcation',
      categoryHi: 'मानचित्र व सीमांकन',
      categoryEn: 'Maps & Spatial Intelligence',
      icon: MapPin,
      color: '#2563eb',
      accentBg: '#dbeafe',
      accentText: '#1d4ed8',
      descHi: 'राजस्व परिषद के भू-नक्शे पर अपने गाटा (खसरा) का वास्तविक आकार, चौहद्दी, चकरोड, पड़ोसी खेत और सरकारी नालियों की स्थिति देखें। साथ ही निकटतम तहसील व सेवा केंद्रों की दूरी व संपर्क विवरण प्राप्त करें।',
      descEn: 'Interactive cadastral map showing exact plot polygon boundaries, neighbor holdings, chak roads, irrigation canals, and local revenue centers (Tehsil, CSC, Sub-Registrar).',
      audienceHi: 'खेत सीमांकन (मेड़बन्दी) आवेदक, जमीन खरीदार, पैमाइश चाहने वाले।',
      audienceEn: 'Boundary demarcation applicants (Sec 24), land purchasers, survey officials.',
      documentsHi: ['गाटा (खसरा) संख्या', 'ग्राम का राजस्व कोड'],
      documentsEn: ['Gata (Khasra) Number', 'Village Revenue Code'],
      timelineHi: 'रियल-टाइम इंटरेक्टिव नक्शा',
      timelineEn: 'Real-time interactive rendering',
      feeHi: 'निःशुल्क',
      feeEn: 'Free of Cost',
      officerHi: 'कानूनगो / तहसीलदार',
      officerEn: 'Revenue Inspector (Kanungo) / Tehsildar',
      benefitsHi: [
        'पड़ोसी गाटा संख्याओं की स्पष्ट चौहद्दी।',
        'चकरोड और रास्ते के विवादों की पहचान।',
        'निकटतम राजस्व केंद्रों का पता व हेल्पलाइन।',
      ],
      benefitsEn: [
        'Clear identification of neighboring plot boundaries.',
        'Verification of public roads and pathways.',
        'Direct directions to nearest Tehsil administrative offices.',
      ],
    },
    {
      id: 'document_intel',
      titleHi: 'कागजात विसंगति जांच (Document Intelligence & OCR)',
      titleEn: 'Document Intelligence & Registry Mismatch Detector',
      categoryHi: 'धोखाधड़ी रोकथाम',
      categoryEn: 'Fraud Prevention & Verification',
      icon: Sparkles,
      color: '#0891b2',
      accentBg: '#cffafe',
      accentText: '#0e7490',
      descHi: 'कागजी बैनामे, पुरानी खतौनी या लगान रसीद की फोटो खींचकर अपलोड करें। एआई दृष्टि मॉडल उसमें लिखे नाम, पिता का नाम, रकबा और गाटा संख्या को पढ़कर डिजिटल रिकॉर्ड से मिलान करेगा और किसी भी विसंगति पर लाल अलर्ट जारी करेगा।',
      descEn: 'Upload a smartphone photo of paper deeds or old Khatauni sheets. Vision models extract text and cross-reference buyer/seller names and land areas against live records to flag discrepancies.',
      audienceHi: 'जमीन खरीदने वाले नागरिक, वसीयत/रजिस्ट्री सत्यापनकर्ता।',
      audienceEn: 'Land buyers, legal advisors, title verification teams.',
      documentsHi: ['बैनामा या पुरानी खतौनी की फोटो / स्कैन'],
      documentsEn: ['Photo or PDF scan of Sale Deed / Khatauni'],
      timelineHi: '10-15 सेकंड में विस्तृत विश्लेषण',
      timelineEn: '10-15 seconds for full comparative audit',
      feeHi: 'निःशुल्क',
      feeEn: 'Free of Cost',
      officerHi: 'उप-निबंधक (Sub-Registrar)',
      officerEn: 'Sub-Registrar / Registration Office',
      benefitsHi: [
        'विक्रेता के नाम में वर्तनी या हिस्से के अंतर की तत्काल पहचान।',
        'खरीदने से पहले जाली या संशोधित दस्तावेजों से सुरक्षा।',
        'कस्टम बाउंडिंग बॉक्स में साक्ष्य हाइलाइटिंग।',
      ],
      benefitsEn: [
        'Detects spelling or share discrepancies instantly.',
        'Protects buyers against forged paper documents.',
        'Visual bounding box evidence highlighting on uploaded files.',
      ],
    },
    {
      id: 'mutation',
      titleHi: 'दाखिल-खारिज ट्रैकर (5-चरणीय पारदर्शी निगरानी)',
      titleEn: '5-Stage Mutation (Dakhil-Kharij) Workflow Tracker',
      categoryHi: 'प्रशासनिक प्रक्रिया',
      categoryEn: 'Statutory Workflow',
      icon: Activity,
      color: '#4f46e5',
      accentBg: '#e0e7ff',
      accentText: '#3730a3',
      descHi: 'उत्तर प्रदेश राजस्व संहिता की धारा 34 (बैनामा) व धारा 33 (वरासत) के तहत दाखिल-खारिज आवेदन के हर चरण की स्थिति देखें। लेखपाल रिपोर्ट, स्थल निरीक्षण, तहसीलदार कोर्ट सुनवाई और अंतिम खतौनी अद्यतन की लाइव प्रगति जानें।',
      descEn: 'Track statutory Section 34/35 mutation through 5 transparent stages: Application Filed → Lekhpal Verification → Field Inspection → Tehsildar Hearing → Registry Update.',
      audienceHi: 'हाल ही में जमीन खरीदने वाले, पैतृक संपत्ति के वारिस।',
      audienceEn: 'New property buyers, inheritors of ancestral land.',
      documentsHi: ['दाखिल-खारिज वाद संख्या (Case Number)', 'बैनामा पंजीकरण संख्या'],
      documentsEn: ['Mutation Case Number (Vaad Sankhya)', 'Registered Deed Number'],
      timelineHi: '35 दिन (अविवादित मामलों में)',
      timelineEn: '35 statutory days for undisputed cases',
      feeHi: 'राजस्व कोर्ट फीस नियमानुसार',
      feeEn: 'Statutory court fee as per state rules',
      officerHi: 'नायब तहसीलदार / तहसीलदार',
      officerEn: 'Naib Tehsildar / Tehsildar',
      benefitsHi: [
        'तहसीलदार न्यायालय की अगली तारीख का स्पष्ट प्रदर्शन।',
        'संबंधित हल्का लेखपाल का नाम व संपर्क।',
        'देरी होने पर वैधानिक शिकायत निवारण मार्गदर्शन।',
      ],
      benefitsEn: [
        'Exact next court hearing date and stage meaning.',
        'Assigned field Lekhpal details and SLA countdown.',
        'Guidance for statutory grievance escalation if delayed.',
      ],
    },
    {
      id: 'bhulekh_locker',
      titleHi: 'भूलेख डिजिटल लॉकर एवं प्रमाणित प्रति वॉल्ट',
      titleEn: 'Bhulekh Digital Locker & Offline Document Vault',
      categoryHi: 'दस्तावेज़ सुरक्षा',
      categoryEn: 'Document Security & Offline Sync',
      icon: FolderLock,
      color: '#0369a1',
      accentBg: '#f0f9ff',
      accentText: '#0284c7',
      descHi: 'अपनी सभी प्रमाणित खतौनी, बैनामा और केसीसी प्रपत्रों को एक सुरक्षित डिजिटल लॉकर में सुरक्षित रखें। क्यूआर कोड से सत्यापित प्रतियां डाउनलोड करें और इंटरनेट न होने पर भी अपने मोबाइल में हमेशा सुरक्षित पाएं।',
      descEn: 'Secure encrypted personal vault for verified Khatauni copies, sale deeds, tax receipts, and KCC certificates. Access documents offline on 2G networks with tamper-evident QR verification.',
      audienceHi: 'सभी पंजीकृत भू-स्वामी, किसान और परिवार के सदस्य।',
      audienceEn: 'All landowners, farmers, and family co-sharers.',
      documentsHi: ['डिजिटल रूप से प्रमाणित खतौनी व लॉकर पिन'],
      documentsEn: ['Digitally certified ROR and personal PIN'],
      timelineHi: '24x7 तत्काल उपलब्धता',
      timelineEn: '24x7 instant availability',
      feeHi: 'निःशुल्क',
      feeEn: 'Free of Cost',
      officerHi: 'राजस्व परिषद उत्तर प्रदेश',
      officerEn: 'UP Board of Revenue',
      benefitsHi: [
        'ऑफ़लाइन मोड में स्थानीय कैश में सुरक्षित।',
        'क्यूआर कोड युक्त डिजिटल प्रमाणीकरण।',
        'सरकारी योजनाओं व बैंक ऋण हेतु आसान साझाकरण।',
      ],
      benefitsEn: [
        'Offline cached storage for remote village usage.',
        'QR-code tamper-evident verification stamp.',
        'One-click export for bank credit or government subsidies.',
      ],
    },
  ];

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. Services Header Banner */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <FileCheck className="w-4 h-4 text-sky-700" />
            <span>{t('नागरिक सेवाएं कैटलॉग', 'Citizen Services Catalog')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('उत्तर प्रदेश के नागरिकों के लिए 5 प्रमुख राजस्व सेवाएं', '5 Core Revenue Services for UP Citizens')}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'भूमि सेवक आपको अपनी जमीन से जुड़े हर कार्य को स्वतंत्र रूप से, पारदर्शी तरीके से और अपनी मातृभाषा में समझने और पूरा करने की शक्ति प्रदान करता है। प्रत्येक सेवा सीधे हमारे कार्यरत प्रोटोटाइप से जुड़ी है।',
              'Bhoomi Sevak empowers you to independently inspect, verify, and track every land-related workflow in your native language. Each service is live and actionable in our working citizen portal.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Detailed Service Breakdown Cards */}
      <section className="space-y-8">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xs space-y-6 hover:border-sky-400 transition-all"
            >
              {/* Service Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-2xs shrink-0"
                    style={{ backgroundColor: srv.accentBg, color: srv.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: srv.accentBg, color: srv.accentText }}
                    >
                      {language === 'hi' ? srv.categoryHi : srv.categoryEn}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {language === 'hi' ? srv.titleHi : srv.titleEn}
                    </h2>
                  </div>
                </div>

                {/* Direct Action Launch Button */}
                <button
                  onClick={() => navigateToApp(srv.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <span>{t('इस सेवा का उपयोग करें', 'Launch Service')}</span>
                  <ArrowRight className="w-4 h-4 text-sky-200" />
                </button>
              </div>

              {/* Service Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'hi' ? srv.descHi : srv.descEn}
              </p>

              {/* Service Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
                {/* Target Audience */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t('किसके लिए उपयोगी', 'Target Audience')}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {language === 'hi' ? srv.audienceHi : srv.audienceEn}
                  </span>
                </div>

                {/* Timeline */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t('समय-सीमा', 'Turnaround Time')}
                  </span>
                  <span className="font-semibold text-sky-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? srv.timelineHi : srv.timelineEn}</span>
                  </span>
                </div>

                {/* Fee */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t('सरकारी शुल्क', 'Fee Structure')}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {language === 'hi' ? srv.feeHi : srv.feeEn}
                  </span>
                </div>

                {/* Responsible Officer */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {t('सक्षम अधिकारी', 'Competent Officer')}
                  </span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-sky-600" />
                    <span>{language === 'hi' ? srv.officerHi : srv.officerEn}</span>
                  </span>
                </div>
              </div>

              {/* Required Documents & Key Benefits Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Documents Needed */}
                <div className="p-4 rounded-xl bg-slate-50 border border-sky-200/70 space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                    {t('आवश्यक जानकारी व प्रपत्र (Required Info)', 'Required Info & Documents')}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {(language === 'hi' ? srv.documentsHi : srv.documentsEn).map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
                  <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                    {t('प्रमुख लाभ व विशेषताएं (Key Benefits)', 'Key Citizen Benefits')}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-sky-950">
                    {(language === 'hi' ? srv.benefitsHi : srv.benefitsEn).map((ben, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  BookOpen,
  Search,
  FileCheck2,
  GitBranch,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { language, t, navigateToApp } = useApp();
  const [activeTab, setActiveTab] = useState<'guide' | 'authorities' | 'helpline'>('guide');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      step: '01',
      titleHi: 'बोलकर या लिखकर खोजें (Natural Search)',
      titleEn: 'Natural Voice or Text Search',
      descHi: 'अपनी बोलचाल की भाषा में बोलें या लिखें, जैसे "बिलारी में राम कुमार की जमीन दिखाओ"। AI स्वचालित रूप से जिला, तहसील, गांव और खाता संख्या पहचान लेगा।',
      descEn: 'Type or speak naturally in Hindi or English (e.g., "Show land of Ram Kumar in Bilari"). The system automatically extracts district, tehsil, village, and owner names.',
      icon: Search,
      actionTarget: 'meri_zameen',
      actionLabelHi: 'खोज शुरू करें',
      actionLabelEn: 'Start Search',
    },
    {
      step: '02',
      titleHi: 'भूलेख अभिलेख समझें (AI Explanation)',
      titleEn: 'Understand Land Record (AI Explanation)',
      descHi: 'जटिल कानूनी शब्दों (खसरा, खतौनी, रकबा, हिस्सा, श्रेणी) को सरल बोलचाल भाषा में समझें। स्वामित्व, बैंक बंधक स्थिति और विवादों की स्पष्ट रिपोर्ट पाएं।',
      descEn: 'Decode complex revenue terms into plain citizen language. Review verified ownership shares, mortgage encumbrances, and dispute status.',
      icon: Sparkles,
      actionTarget: 'meri_zameen',
      actionLabelHi: 'अभिलेख देखें',
      actionLabelEn: 'View Records',
    },
    {
      step: '03',
      titleHi: 'दस्तावेज मिलान व सत्यापन (Document Intelligence)',
      titleEn: 'Document Verification & Intelligence',
      descHi: 'अपनी पुरानी रजिस्ट्री, खतौनी या बैनामा की फोटो/पीडीएफ अपलोड करें। सिस्टम सरकारी डेटाबेस से मिलान कर किसी भी विसंगति को तुरंत रेखांकित करेगा।',
      descEn: 'Upload a land deed, registry, or Khatauni copy. The AI compares it against official database records to highlight any discrepancies.',
      icon: FileCheck2,
      actionTarget: 'document_intel',
      actionLabelHi: 'दस्तावेज जांचें',
      actionLabelEn: 'Verify Document',
    },
    {
      step: '04',
      titleHi: 'दाखिल-खारिज स्थिति ट्रैक करें (Mutation Tracker)',
      titleEn: 'Track Mutation (Dakhil-Kharij)',
      descHi: 'आवेदन संख्या दर्ज कर 5-चरणीय नामांतरण प्रक्रिया (लेखपाल जांच, फील्ड निरीक्षण, तहसीलदार समीक्षा) की लाइव प्रगति देखें।',
      descEn: 'Track 5-stage mutation workflow from Lekhpal report to Tehsildar approval with clear stage-by-stage progress.',
      icon: GitBranch,
      actionTarget: 'mutation_tracker',
      actionLabelHi: 'ट्रैकर खोलें',
      actionLabelEn: 'Open Tracker',
    },
  ];

  const authorities = [
    {
      nameHi: 'राजस्व परिषद, उत्तर प्रदेश (Board of Revenue, UP)',
      nameEn: 'Board of Revenue, Uttar Pradesh',
      roleHi: 'राज्य-स्तरीय सर्वोच्च भू-अभिलेख एवं राजस्व नियंत्रण प्राधिकरण',
      roleEn: 'Apex State Authority for Land Records & Revenue Administration',
      addressHi: 'राजस्व भवन, विभूति खंड, गोमती नगर, लखनऊ - 226010',
      addressEn: 'Rajasva Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow - 226010',
      phone: '0522-2720814',
      tollFree: '1800-180-0111',
      email: 'bor-up@nic.in',
      web: 'http://bor.up.nic.in',
    },
    {
      nameHi: 'जिलाधिकारी / मुख्य राजस्व अधिकारी (DM / CRO Office)',
      nameEn: 'District Magistrate / Chief Revenue Officer (DM / CRO)',
      roleHi: 'जिला स्तर पर राजस्व प्रशासन, अपील एवं नामांतरण पर्यवेक्षण',
      roleEn: 'District-Level Revenue Administration, Appeals & Oversight',
      addressHi: 'संबंधित जिला कलेक्ट्रेट परिसर, उत्तर प्रदेश',
      addressEn: 'Respective District Collectorate Compound, Uttar Pradesh',
      phone: '1076 (CM Helpline)',
      tollFree: '1800-180-5145',
      email: 'dm-revenue@up.gov.in',
      web: 'http://up.gov.in',
    },
    {
      nameHi: 'उप-जिलाधिकारी / तहसीलदार न्यायालय (SDM / Tehsildar Court)',
      nameEn: 'Sub-Divisional Magistrate / Tehsildar Court',
      roleHi: 'तहसील स्तर पर दाखिल-खारिज (नामांतरण), सीमांकन व खतौनी संशोधन',
      roleEn: 'Tehsil-Level Mutation (Dakhil-Kharij), Demarcation & Khatauni Correction',
      addressHi: 'संबंधित तहसील कार्यालय (स्थानीय तहसील मुख्यालय)',
      addressEn: 'Respective Tehsil Office (Local Tehsil Headquarters)',
      phone: '1800-180-0111',
      tollFree: '0522-2238123',
      email: 'tehsildar-help@up.gov.in',
      web: 'http://upbhulekh.gov.in',
    },
    {
      nameHi: 'राजस्व निरीक्षक / क्षेत्रीय लेखपाल (Revenue Inspector & Lekhpal)',
      nameEn: 'Revenue Inspector (RI) & Lekhpal / Patwari',
      roleHi: 'ग्राम स्तर पर मौके का मुआयना, वरासत/नामांतरण आख्या व खसरा पड़ताल',
      roleEn: 'Village-level field verification, succession reports & crop survey',
      addressHi: 'संबंधित ग्राम पंचायत सचिवालय / स्थानीय लेखपाल कक्ष',
      addressEn: 'Respective Gram Panchayat Secretariat / Local Lekhpal Office',
      phone: '1076',
      tollFree: '1800-180-0111',
      email: 'lekhpal-portal@up.gov.in',
      web: 'http://upbhulekh.gov.in',
    },
  ];

  const emergencyHelplines = [
    {
      titleHi: 'मुख्यमंत्री जनसुनवाई / समाधान हेल्पलाइन',
      titleEn: 'CM Citizen Grievance & Jansunwai',
      number: '1076',
      descHi: 'भूमि विवाद, लेखपाल भ्रष्टाचार या राजस्व संबंधी शिकायतों के लिए',
      descEn: 'For land disputes, corruption complaints or pending revenue grievances',
      timing: '24x7 टोल-फ्री (Toll Free)',
    },
    {
      titleHi: 'उत्तर प्रदेश भूलेख व राजस्व हेल्पलाइन',
      titleEn: 'UP Bhulekh & Revenue Helpline',
      number: '1800-180-0111',
      descHi: 'खतौनी नकल, खसरा, वरासत व भू-अभिलेख पोर्टल सहायता',
      descEn: 'Khatauni copy, Khasra, succession & land portal assistance',
      timing: 'कार्यदिवस 9:30 AM - 6:00 PM',
    },
    {
      titleHi: 'आईजीआरएस (IGRS) संपत्ति पंजीकरण सहायता',
      titleEn: 'IGRS Property Registration Helpdesk',
      number: '0522-2238123',
      descHi: 'बैनामा, ई-स्टाम्प, रजिस्ट्री व भारमुक्त (Encumbrance) प्रमाणपत्र',
      descEn: 'Sale deeds, e-stamp, registry & encumbrance certificates',
      timing: '10:00 AM - 5:00 PM',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#e5dff2] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#241e45] via-[#352c66] to-[#4c3a9e] text-white px-6 py-4.5 flex items-center justify-between shrink-0 border-b border-[#433979]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="help-modal-title" className="text-lg sm:text-xl font-black tracking-tight">
                  {t('सहायता केंद्र व भू-राजस्व निर्देशिका', 'Help Center & Revenue Directory')}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  {t('नागरिक सहायता', 'Citizen Support')}
                </span>
              </div>
              <p className="text-xs text-purple-200/90 font-medium mt-0.5">
                {t(
                  'भूमि सेवक उपयोग निर्देश, राजस्व अधिकारी संपर्क एवं आपातकालीन हेल्पलाइन',
                  'Bhoomi Sevak usage guide, revenue authority contacts & helplines'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#faf9fc] border-b border-[#ede9f7] px-6 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#5e4db2] text-[#5e4db2] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('पोर्टल उपयोग निर्देश', 'How to Use Bhoomi Sevak')}</span>
          </button>

          <button
            onClick={() => setActiveTab('authorities')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'authorities'
                ? 'border-[#5e4db2] text-[#5e4db2] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('राजस्व प्राधिकरण निर्देशिका', 'Land Record Authorities')}</span>
          </button>

          <button
            onClick={() => setActiveTab('helpline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'helpline'
                ? 'border-[#5e4db2] text-[#5e4db2] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('हेल्पलाइन व समाधान', 'Helplines & Grievance')}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* TAB 1: HOW TO USE BHOOMI SEVAK */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#f4f2f9] to-[#ede9f7] border border-[#e5dff2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    {t(
                      'भूमि सेवक का उपयोग कैसे करें? (4 आसान चरण)',
                      'How to use Bhoomi Sevak in 4 simple steps'
                    )}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {t(
                      'बिना किसी बिचौलिए या तकनीकी ज्ञान के अपनी जमीन के पूरे रिकॉर्ड को समझें और सत्यापित करें।',
                      'Search, understand, and verify land records directly without middlemen or technical jargon.'
                    )}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigateToApp('meri_zameen');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#5e4db2] hover:bg-[#4c3a9e] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>{t('अभी आजमाएं', 'Try Live Now')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((item) => {
                  const StepIcon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="p-5 rounded-2xl bg-white border border-[#e9e5f5] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2]">
                            {t('चरण', 'Step')} {item.step}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5e4db2] flex items-center justify-center">
                            <StepIcon className="w-4 h-4" />
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {language === 'hi' ? item.titleHi : item.titleEn}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === 'hi' ? item.descHi : item.descEn}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          navigateToApp(item.actionTarget as any);
                        }}
                        className="pt-2 text-xs font-bold text-[#5e4db2] hover:text-[#413485] flex items-center gap-1 cursor-pointer transition-colors border-t border-slate-100"
                      >
                        <span>{language === 'hi' ? item.actionLabelHi : item.actionLabelEn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick AI Voice Assistance Tip */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-900">
                    {t('आवाज़ से खोजें (Voice-First Search)', 'Voice-First Search Assistance')}
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {t(
                      'यदि आपको खसरा या खाता संख्या याद नहीं है, तो आप सर्च बार में माइक आइकन दबाकर सीधे अपने किसान या गांव का नाम बोल सकते हैं।',
                      'If you do not remember your Khasra or Khata number, simply click the mic icon and speak the owner or village name naturally.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAND RECORD AUTHORITIES DIRECTORY */}
          {activeTab === 'authorities' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-[#e9e5f5]">
                {t(
                  'उत्तर प्रदेश राजस्व विभाग के स्तरवार सक्षम अधिकारी एवं संपर्क विवरण। किसी भी आधिकारिक संशोधन, विवाद या नकल हेतु अपने संबंधित स्तर के अधिकारी से संपर्क करें:',
                  'Hierarchy of competent land revenue authorities in Uttar Pradesh. Contact the respective level for official amendments, disputes, or certified copies:'
                )}
              </div>

              <div className="space-y-3.5">
                {authorities.map((auth, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#e9e5f5] shadow-xs hover:border-[#d5cbe9] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {language === 'hi' ? auth.nameHi : auth.nameEn}
                        </h4>
                        <p className="text-xs font-medium text-[#5e4db2] mt-0.5">
                          {language === 'hi' ? auth.roleHi : auth.roleEn}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
                        LEVEL 0{idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {/* Address */}
                      <div className="flex items-start gap-2 text-slate-600 sm:col-span-2 lg:col-span-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          {language === 'hi' ? auth.addressHi : auth.addressEn}
                        </span>
                      </div>

                      {/* Phone / Toll Free */}
                      <div className="flex items-center justify-between gap-2 bg-[#faf9fc] p-2 rounded-xl border border-[#ede9f7]">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-[#5e4db2]" />
                          <span className="font-mono font-semibold">{auth.phone}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(auth.phone, `phone-${idx}`)}
                          className="text-[10px] text-[#5e4db2] hover:text-[#382c7a] font-bold flex items-center gap-0.5 cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedText === `phone-${idx}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between gap-2 bg-[#faf9fc] p-2 rounded-xl border border-[#ede9f7]">
                        <div className="flex items-center gap-1.5 text-slate-700 truncate">
                          <Mail className="w-3.5 h-3.5 text-[#5e4db2] shrink-0" />
                          <span className="font-mono text-[11px] truncate">{auth.email}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(auth.email, `email-${idx}`)}
                          className="text-[10px] text-[#5e4db2] hover:text-[#382c7a] font-bold flex items-center gap-0.5 cursor-pointer shrink-0"
                          title="Copy email"
                        >
                          {copiedText === `email-${idx}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HELPLINES & CITIZEN GRIEVANCE */}
          {activeTab === 'helpline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {emergencyHelplines.map((help, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#e9e5f5] shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          {help.timing}
                        </span>
                        <PhoneCall className="w-4 h-4 text-[#5e4db2]" />
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === 'hi' ? help.titleHi : help.titleEn}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {language === 'hi' ? help.descHi : help.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-base font-black font-mono text-[#5e4db2]">
                        {help.number}
                      </div>
                      <button
                        onClick={() => handleCopy(help.number, `hl-${idx}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#f4f2f9] text-[#5e4db2] text-xs font-bold hover:bg-[#ede9f7] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedText === `hl-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{t('कॉपी हुआ', 'Copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t('कॉपी करें', 'Copy')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Online Grievance Redressal (Jansunwai Portal) Link Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#241e45] to-[#3f317e] text-white space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <h4 className="text-sm font-bold">
                        {t('जनसुनवाई - समाधान पोर्टल (Jansunwai UP)', 'Jansunwai - UP Grievance Portal')}
                      </h4>
                    </div>
                    <p className="text-xs text-purple-200 leading-relaxed max-w-xl">
                      {t(
                        'यदि आपकी जमीन पर अवैध कब्जा, लेखपाल द्वारा रिपोर्ट में देरी या नामांतरण में समस्या है, तो आप सीधे उत्तर प्रदेश सरकार के जनसुनवाई पोर्टल पर ऑनलाइन शिकायत दर्ज कर सकते हैं।',
                        'For illegal land encroachment, delayed succession reports, or corruption grievances, file a formal complaint directly on the UP Govt Jansunwai portal.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://jansunwai.up.nic.in"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{t('जनसुनवाई पोर्टल खोलें', 'Open Jansunwai Portal')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-xs text-purple-200 font-medium">
                    {t('आधिकारिक वेबसाइट: jansunwai.up.nic.in', 'Official website: jansunwai.up.nic.in')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#faf9fc] px-6 py-3.5 border-t border-[#ede9f7] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            {t(
              'भूमि सेवक • नागरिक भू-अभिलेख सहायता प्रकोष्ठ',
              'Bhoomi Sevak • Citizen Land Record Support Desk'
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5e4db2] hover:bg-[#4c3a9e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {t('समझ गया / बंद करें', 'Understood / Close')}
          </button>
        </div>
      </div>
    </div>
  );
};

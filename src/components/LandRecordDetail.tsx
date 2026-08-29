import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Volume2,
  VolumeX,
  Printer,
  Share2,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Building,
  Scale,
  Users,
  Info,
  Layers,
  FolderLock,
  Activity,
  User,
  QrCode,
  MessageSquare,
  Copy,
  Check,
  X,
  Smartphone,
  Download,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { LandRecord } from '../types';

export const LandRecordDetail: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    selectedRecord,
    setActiveTab,
    speakText,
    isSpeaking,
    stopSpeaking,
    setSelectedParcel,
    parcels,
    lockerDocs,
  } = useApp();

  const [activeDetailSection, setActiveDetailSection] = useState<'ai_summary' | 'official_ror' | 'property_area' | 'cadastral_map' | 'documents_mutation'>('ai_summary');
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string; answerHi: string }[]>([]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Modals for Share & QR
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedSms, setCopiedSms] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Deep link & SMS text generation
  const deepLinkUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?record=${selectedRecord?.id || 'rec-001'}&tab=land_record`
    : `https://bhulekh-saathi.up.gov.in/?record=${selectedRecord?.id || 'rec-001'}&tab=land_record`;

  const smsShareText = `भूलेख साथी भू-अभिलेख विवरण:
खाता सं: ${selectedRecord?.khataNumber}
गाटा सं: ${selectedRecord?.khasraNumbers.join(', ')}
ग्राम: ${language === 'hi' ? selectedRecord?.villageHi || selectedRecord?.village : selectedRecord?.village} (तहसील: ${language === 'hi' ? selectedRecord?.tehsilHi || selectedRecord?.tehsil : selectedRecord?.tehsil})
सत्यापन लिंक: ${deepLinkUrl}`;

  useEffect(() => {
    if (selectedRecord && showQrModal) {
      const qrPayload = JSON.stringify({
        portal: 'UP Bhoomi Sevak',
        khatauniId: selectedRecord.khatauniUniqueId || `UP-KH-${selectedRecord.khataNumber}-${selectedRecord.villageId}`,
        khata: selectedRecord.khataNumber,
        khasra: selectedRecord.khasraNumbers,
        village: selectedRecord.village,
        tehsil: selectedRecord.tehsil,
        fasli: selectedRecord.fasliYear,
        url: deepLinkUrl,
      });

      QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#5e4db2',
          light: '#ffffff',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR generation error', err));
    }
  }, [selectedRecord, showQrModal, deepLinkUrl]);

  // Load AI Explanation for the record
  useEffect(() => {
    if (!selectedRecord) return;
    setLoadingAi(true);
    fetch('/api/ai/explain-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId: selectedRecord.id, record: selectedRecord, language }),
    })
      .then(res => res.json())
      .then(data => setAiExplanation(data))
      .catch(err => console.error('Failed to get AI explanation', err))
      .finally(() => setLoadingAi(false));
  }, [selectedRecord?.id, language]);

  if (!selectedRecord) {
    return (
      <div className="bg-[#ffffff] rounded-2xl p-8 text-center border border-[#e7e2d8] shadow-xs">
        <FileText className="w-12 h-12 text-[#9fa6b2] mx-auto mb-3" />
        <h3 className="text-base sm:text-lg font-bold text-[#1e212b]">{t('कोई जमीन चयनित नहीं है', 'No Land Record Selected')}</h3>
        <p className="text-xs text-[#767d8f] mt-1">{t('कृपया खोज बॉक्स से कोई जमीन खोजें या चुनें।', 'Please search or select a record.')}</p>
      </div>
    );
  }

  const handleAskQuestion = async (qText?: string) => {
    const questionToAsk = qText || customQuestion;
    if (!questionToAsk.trim() || !selectedRecord) return;

    setIsAsking(true);
    try {
      // Build conversation history for multi-turn conversational AI
      const history = qaHistory.flatMap(item => [
        { role: 'user', content: item.question },
        { role: 'model', content: language === 'hi' ? item.answerHi : item.answer },
      ]);

      const res = await fetch('/api/ai/multi-turn-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: selectedRecord.id,
          message: questionToAsk,
          conversationHistory: history,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Multi-turn endpoint failed, trying fallback');
      }

      const data = await res.json();
      setQaHistory(prev => [
        ...prev,
        { question: questionToAsk, answer: data.reply, answerHi: data.replyHi || data.reply },
      ]);
      setCustomQuestion('');
    } catch (err) {
      console.warn('Falling back to context-qa:', err);
      try {
        const fallbackRes = await fetch('/api/ai/context-qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recordId: selectedRecord.id,
            question: questionToAsk,
            language,
          }),
        });
        const fallbackData = await fallbackRes.json();
        setQaHistory(prev => [
          ...prev,
          { question: questionToAsk, answer: fallbackData.answer, answerHi: fallbackData.answerHi },
        ]);
        setCustomQuestion('');
      } catch (fallbackErr) {
        console.error('All QA requests failed', fallbackErr);
      }
    } finally {
      setIsAsking(false);
    }
  };

  const handleOpenOnMap = () => {
    const matchedParcel = parcels.find(p => selectedRecord.khasraNumbers.some(k => p.khasraNumber.startsWith(k.split('/')[0])));
    if (matchedParcel) setSelectedParcel(matchedParcel);
    setActiveTab('cadastral_map');
  };

  // Convert area
  const areaHa = selectedRecord.totalAreaHectare;
  const areaBigha = (areaHa * 3.95).toFixed(2);
  const areaBiswa = (areaHa * 3.95 * 20).toFixed(1);
  const areaSqm = Math.round(areaHa * 10000).toLocaleString('en-IN');
  const areaAcre = (areaHa * 2.471).toFixed(2);

  const suggestedQuestions = [
    { hi: 'मेरा इस जमीन में कितना हिस्सा है?', en: 'What is my exact share in this land?' },
    { hi: 'क्या इस जमीन पर कोई बैंक लोन या बंधक है?', en: 'Is there any active bank loan or mortgage?' },
    { hi: 'क्या इस पर कोई न्यायालयी विवाद या रोक है?', en: 'Are there any court disputes or stay orders?' },
    { hi: 'संक्रमणीय भूमिधर का क्या अर्थ है?', en: 'What does Bhumidhar with Transferable Rights mean?' },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* 1. PERSISTENT PROPERTY IDENTITY CARD (PINNED AT THE TOP) */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e7e2d8] shadow-xs no-print">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#ece6f6]">
          {/* Identity Core */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2] text-xs font-bold font-mono">
                {t('खाता सं:', 'Khata #')} {selectedRecord.khataNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#faf9f6] text-[#1e212b] border border-[#e7e2d8] text-xs font-bold font-mono">
                {t('गाटा:', 'Khasra:')} {selectedRecord.khasraNumbers.join(', ')}
              </span>
              {/* Status Badge */}
              <div
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
                  selectedRecord.indicator === 'green'
                    ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                    : selectedRecord.indicator === 'yellow'
                    ? 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                    : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedRecord.indicator === 'green'
                      ? 'bg-[#10b981]'
                      : selectedRecord.indicator === 'yellow'
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#ef4444]'
                  }`}
                ></span>
                <span>
                  {selectedRecord.indicator === 'green'
                    ? t('शीर्षक स्पष्ट (Title Clear)', 'Title Clear')
                    : selectedRecord.indicator === 'yellow'
                    ? t('समीक्षा नोट', 'Review Note')
                    : t('महत्वपूर्ण प्रविष्टि', 'Important Entry')}
                </span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#1e212b] tracking-tight">
              {language === 'hi' ? selectedRecord.owners[0]?.nameHi : selectedRecord.owners[0]?.name}
              {selectedRecord.owners.length > 1 && (
                <span className="text-xs font-medium text-[#767d8f] ml-2">
                  (+{selectedRecord.owners.length - 1} {t('सह-खातेदार', 'co-owners')})
                </span>
              )}
            </h2>

            <p className="text-xs text-[#555968] mt-1">
              {t('ग्राम:', 'Village:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.villageHi : selectedRecord.village}</strong> ({selectedRecord.villageCensusCode}),{' '}
              {t('तहसील:', 'Tehsil:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.tehsilHi : selectedRecord.tehsil}</strong>,{' '}
              {t('जनपद:', 'District:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.districtHi : selectedRecord.district}</strong>
            </p>
          </div>

          {/* Quick Identity Actions (Audio / Share / QR / Print) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Read Out Loud Button */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else if (aiExplanation) {
                  speakText(language === 'hi' ? aiExplanation.explanationHi : aiExplanation.explanation);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]'
                  : 'bg-[#f4f2f9] hover:bg-[#eae6f5] text-[#5e4db2] border border-[#e5dff2]'
              }`}
              title={t('रिकॉर्ड बोलकर सुनें', 'Listen Audio Explanation')}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-[#991b1b] animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#5e4db2]" />}
              <span>{isSpeaking ? t('आवाज बंद करें', 'Stop Audio') : t('बोलकर सुनें', 'Listen')}</span>
            </button>

            {/* Share Record (SMS Deep Link) */}
            <button
              id="btn-share-record"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] hover:bg-[#f5f3fa] text-[#1e212b] border border-[#e7e2d8] text-xs font-semibold transition-colors cursor-pointer"
              title={t('एसएमएस व लिंक द्वारा शेयर करें', 'Share Record')}
            >
              <Share2 className="w-4 h-4 text-[#5e4db2]" />
              <span>{t('शेयर', 'Share')}</span>
            </button>

            {/* Field QR Code */}
            <button
              id="btn-generate-qr"
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f6] hover:bg-[#f5f3fa] text-[#1e212b] border border-[#e7e2d8] text-xs font-semibold transition-colors cursor-pointer"
              title={t('राजस्व सत्यापन क्यूआर कोड', 'QR Code')}
            >
              <QrCode className="w-4 h-4 text-[#5e4db2]" />
              <span>{t('क्यूआर कोड', 'QR')}</span>
            </button>

            {/* Print Official Report */}
            <button
              id="btn-print-official-report"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5e4db2] hover:bg-[#50409c] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title={t('प्रमाणित खतौनी नकल प्रिंट करें', 'Print Report')}
            >
              <Printer className="w-4 h-4 text-white" />
              <span>{t('प्रिंट नकल', 'Print')}</span>
            </button>
          </div>
        </div>

        {/* Quick Identity Bar Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 text-xs">
          <div className="bg-[#faf9f6] p-2.5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('कुल रकबा (Area)', 'Total Land Area')}</span>
            <strong className="text-[#5e4db2] font-mono text-sm block mt-0.5">
              {selectedRecord.totalAreaHectare} Ha ({areaBigha} {t('बीघा', 'Bigha')})
            </strong>
          </div>

          <div className="bg-[#faf9f6] p-2.5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('स्वामित्व हिस्सा', 'Primary Share')}</span>
            <strong className="text-[#1e212b] font-mono text-sm block mt-0.5">
              {selectedRecord.owners[0]?.shareFraction} ({selectedRecord.owners[0]?.sharePercentage}%)
            </strong>
          </div>

          <div className="bg-[#faf9f6] p-2.5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('भूमि श्रेणी (Rights)', 'Classification')}</span>
            <strong className="text-[#1e212b] text-xs block mt-0.5 truncate" title={selectedRecord.landClassification}>
              {language === 'hi' ? selectedRecord.landClassificationHi : selectedRecord.landClassification}
            </strong>
          </div>

          <div className="bg-[#faf9f6] p-2.5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('फसली वर्ष (Fasli)', 'Fasli Year')}</span>
            <strong className="text-[#1e212b] font-mono text-xs block mt-0.5">
              {selectedRecord.fasliYear}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. TAB-LIKE GROUPING NAVIGATION (Property, Record, Map, Documents, Mutation) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#ffffff] p-1.5 rounded-2xl border border-[#e7e2d8] shadow-2xs no-print">
        {/* Tab 1: AI Explanation & Q&A */}
        <button
          onClick={() => setActiveDetailSection('ai_summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDetailSection === 'ai_summary'
              ? 'bg-[#5e4db2] text-white shadow-xs'
              : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#faf9f6]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('AI सरल समझ व प्रश्न', 'AI Plain Explanation')}</span>
        </button>

        {/* Tab 2: Official ROR Form 45 */}
        <button
          onClick={() => setActiveDetailSection('official_ror')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDetailSection === 'official_ror'
              ? 'bg-[#5e4db2] text-white shadow-xs'
              : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#faf9f6]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('प्रमाणित खतौनी (प्रारूप 45)', 'Official ROR (Form 45)')}</span>
        </button>

        {/* Tab 3: Property Details & Area Converter */}
        <button
          onClick={() => setActiveDetailSection('property_area')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDetailSection === 'property_area'
              ? 'bg-[#5e4db2] text-white shadow-xs'
              : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#faf9f6]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t('क्षेत्रफल व अधिकार', 'Area & Legal Rights')}</span>
        </button>

        {/* Tab 4: Cadastral Map */}
        <button
          onClick={() => setActiveDetailSection('cadastral_map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDetailSection === 'cadastral_map'
              ? 'bg-[#5e4db2] text-white shadow-xs'
              : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#faf9f6]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('भू-नक्शा सीमाएं', 'Cadastral Map')}</span>
        </button>

        {/* Tab 5: Documents & Mutation Applications */}
        <button
          onClick={() => setActiveDetailSection('documents_mutation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeDetailSection === 'documents_mutation'
              ? 'bg-[#5e4db2] text-white shadow-xs'
              : 'text-[#4b5162] hover:text-[#1e212b] hover:bg-[#faf9f6]'
          }`}
        >
          <FolderLock className="w-3.5 h-3.5" />
          <span>{t('दस्तावेज़ व दाखिल-खारिज', 'Docs & Mutation')}</span>
          <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
        </button>
      </div>

      {/* 3. TAB CONTENT SECTIONS */}

      {/* SECTION A: AI PLAIN-LANGUAGE EXPLANATION & GROUNDED Q&A */}
      {activeDetailSection === 'ai_summary' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* AI Explanation Breakdown */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1e212b] flex items-center gap-2">
                  <span>{t('आसान भाषा में समझें (AI रिकॉर्ड सार)', 'Plain Language AI Explanation')}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                    {t('सत्यापित तथ्य', 'Grounded Facts')}
                  </span>
                </h3>
                <p className="text-xs text-[#767d8f]">
                  {t('राजस्व शब्दावली को आम नागरिक के लिए सरल भाषा में रूपांतरित किया गया:', 'Revenue terminology transformed into simple citizen terms:')}
                </p>
              </div>
            </div>

            {loadingAi ? (
              <div className="py-6 flex items-center justify-center gap-3 text-[#5e4db2] text-xs font-bold">
                <div className="w-4 h-4 border-2 border-[#5e4db2] border-t-transparent rounded-full animate-spin"></div>
                <span>{t('एआई सरकारी रिकॉर्ड का विश्लेषण कर रहा है...', 'AI is analyzing verified revenue records...')}</span>
              </div>
            ) : aiExplanation ? (
              <div className="space-y-3.5 text-xs sm:text-sm">
                <p className="text-[#1e212b] leading-relaxed font-normal bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8]">
                  {language === 'hi' ? aiExplanation.explanationHi : aiExplanation.explanation}
                </p>

                {/* Key Bullet Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(language === 'hi' ? aiExplanation.keyPointsHi : aiExplanation.keyPoints)?.map((pt: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 bg-[#faf9f6] p-3 rounded-xl border border-[#e7e2d8]">
                      <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                      <span className="text-[#1e212b] font-medium leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Actionable Advice */}
                <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase tracking-wider text-[#065f46]">{t('नागरिक सलाह:', 'Actionable Advice:')}</span>
                    <span className="text-xs font-normal leading-relaxed text-[#065f46] mt-0.5 block">
                      {language === 'hi' ? aiExplanation.actionableAdviceHi : aiExplanation.actionableAdvice}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Grounded Contextual AI Q&A */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1e212b]">
                  {t('इस जमीन के बारे में पूछें (Grounded AI Q&A)', 'Ask About This Land Record')}
                </h3>
                <p className="text-xs text-[#767d8f]">
                  {t('केवल चयनित भू-अभिलेख के आधार पर प्रमाणित उत्तर प्राप्त करें:', 'Answers grounded strictly in this verified record:')}
                </p>
              </div>
            </div>

            {/* Suggested One-Tap Questions */}
            <div className="flex flex-wrap gap-2 mb-3.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(language === 'hi' ? q.hi : q.en)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#faf9f6] hover:bg-[#f5f3fa] hover:border-[#5e4db2] border border-[#e7e2d8] text-[#1e212b] font-medium transition-all cursor-pointer"
                >
                  {language === 'hi' ? q.hi : q.en}
                </button>
              ))}
            </div>

            {/* QA Chat History */}
            {qaHistory.length > 0 && (
              <div className="space-y-3 mb-3.5 max-h-72 overflow-y-auto pr-1">
                {qaHistory.map((item, idx) => (
                  <div key={idx} className="space-y-2 text-xs">
                    <div className="bg-[#faf9f6] border border-[#e7e2d8] text-[#1e212b] p-3 rounded-xl max-w-[85%] font-medium">
                      <strong className="text-[#767d8f]">{t('प्रश्न: ', 'Q: ')}</strong> {item.question}
                    </div>
                    <div className="bg-[#f4f2f9] border border-[#e5dff2] text-[#1e212b] p-3.5 rounded-xl max-w-[95%] ml-auto leading-relaxed font-normal">
                      <div className="flex items-center gap-1.5 font-bold text-[#5e4db2] mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('भूमि सेवक उत्तर:', 'Bhoomi Sevak Answer:')}</span>
                      </div>
                      {language === 'hi' ? item.answerHi : item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskQuestion();
              }}
              className="flex items-center gap-2.5"
            >
              <input
                type="text"
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                placeholder={t(
                  'जैसे: "क्या इस गाटे पर कोई बंधक है?", "मेरा हिस्सा कितने बीघा हुआ?"...',
                  'E.g. "Is there any active mortgage?", "What is my share in Bigha?"...'
                )}
                className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm rounded-xl bg-[#ffffff] text-[#1e212b] border border-[#e7e2d8] focus:border-[#5e4db2] focus:ring-1 focus:ring-[#5e4db2] outline-none placeholder-[#767d8f]"
              />
              <button
                type="submit"
                disabled={isAsking || !customQuestion.trim()}
                className="bg-[#5e4db2] hover:bg-[#50409c] disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                {isAsking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t('पूछें', 'Ask')}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECTION B: OFFICIAL CERTIFIED ROR EXTRACT (FORM 45 KHATAUNI) */}
      {activeDetailSection === 'official_ror' && (
        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-7 border border-[#e7e2d8] shadow-xs official-report-page animate-in fade-in duration-200">
          {/* Official Header */}
          <div className="text-center pb-5 border-b border-[#ece7d9]">
            <div className="inline-block px-3 py-0.5 rounded-full bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] font-semibold text-xs mb-2">
              {t('उत्तर प्रदेश राजस्व परिषद - भूलेख कंप्यूटरीकृत प्रारूप 45', 'Board of Revenue UP - Computerized ROR (Form 45)')}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1e212b] tracking-tight">
              {t('उद्धरण खतौनी (1430-1435 फसली)', 'Extract of Khatauni (1430-1435 Fasli)')}
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#555968] font-medium">
              <span>
                {t('जनपद:', 'District:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.districtHi : selectedRecord.district}</strong>
              </span>
              <span>•</span>
              <span>
                {t('तहसील:', 'Tehsil:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.tehsilHi : selectedRecord.tehsil}</strong>
              </span>
              <span>•</span>
              <span>
                {t('ग्राम:', 'Village:')} <strong className="text-[#1e212b]">{language === 'hi' ? selectedRecord.villageHi : selectedRecord.village}</strong> ({selectedRecord.villageCensusCode})
              </span>
              <span>•</span>
              <span>
                {t('खाता सं:', 'Khata #')} <strong className="font-mono text-[#5e4db2]">{selectedRecord.khataNumber}</strong>
              </span>
            </div>
          </div>

          {/* Status Indicator Banner */}
          <div
            className={`mt-4 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
              selectedRecord.indicator === 'green'
                ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                : selectedRecord.indicator === 'yellow'
                ? 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                selectedRecord.indicator === 'green'
                  ? 'text-[#16a34a]'
                  : selectedRecord.indicator === 'yellow'
                  ? 'text-[#d97706]'
                  : 'text-[#ef4444]'
              }`}
            />
            <div>
              <span className="font-bold">
                {selectedRecord.indicator === 'green'
                  ? t('रिकॉर्ड स्थिति: शीर्षक स्पष्ट (कोई विवाद नहीं)', 'Status: Title Clear (Zero Legal Disputes)')
                  : selectedRecord.indicator === 'yellow'
                  ? t('रिकॉर्ड स्थिति: समीक्षा अनुशंसित (ऋण/नामान्तरण)', 'Status: Review Recommended (Mortgage Note)')
                  : t('रिकॉर्ड स्थिति: महत्वपूर्ण प्रविष्टि (विवाद)', 'Status: Important Entry (Active Demarcation Case)')}
              </span>
              <p className="mt-1 leading-relaxed text-[#555968]">
                {language === 'hi' ? selectedRecord.indicatorReasonHi : selectedRecord.indicatorReason}
              </p>
            </div>
          </div>

          {/* Khata Owners Table (खातेदारों का विवरण व हिस्सा) */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-[#555968] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#5e4db2]" />
              <span>{t('खातेदारों का विवरण एवं अंश (Ownership Shares)', 'Title Holders & Shares')}</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-[#e7e2d8]">
              <table className="w-full text-left text-xs border-collapse official-report-table">
                <thead>
                  <tr className="bg-[#faf9f6] text-[#555968] font-bold border-b border-[#e7e2d8]">
                    <th className="p-3">{t('क्र.सं.', 'S.No')}</th>
                    <th className="p-3">{t('खातेदार का नाम व पिता का नाम', 'Owner & Father Name')}</th>
                    <th className="p-3">{t('हिस्सा (अंश)', 'Share Fraction')}</th>
                    <th className="p-3">{t('प्रतिशत', 'Percentage')}</th>
                    <th className="p-3">{t('व्यक्तिगत रकबा', 'Owner Area')}</th>
                    <th className="p-3">{t('आधार प्रमाणीकरण', 'Aadhaar Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e2d8] bg-[#ffffff]">
                  {selectedRecord.owners.map((owner, idx) => (
                    <tr key={idx} className="hover:bg-[#faf9f6] font-medium text-[#1e212b]">
                      <td className="p-3 font-mono text-[#767d8f]">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-xs sm:text-sm text-[#1e212b]">
                          {language === 'hi' ? owner.nameHi : owner.name}
                        </div>
                        <div className="text-[11px] text-[#767d8f]">
                          {language === 'hi' ? owner.fatherNameHi : owner.fatherName}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#faf9f6] border border-[#e7e2d8] text-[#5e4db2] font-bold font-mono">
                          {owner.shareFraction}
                        </span>
                      </td>
                      <td className="p-3 font-bold font-mono text-[#5e4db2]">{owner.sharePercentage}%</td>
                      <td className="p-3 font-bold text-[#1e212b] font-mono">
                        {owner.areaHectare} Ha ({(owner.areaHectare * 3.95).toFixed(2)} {t('बीघा', 'Bigha')})
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-[#16a34a]" />
                          {t('सत्यापित', 'Verified')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks Column (कॉलम 12 - आदेश व टिप्पणी) */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
            <span className="text-[10px] font-bold text-[#767d8f] block uppercase tracking-wider mb-2">
              {t('कॉलम 12: आदेश एवं कैफियत (Official Orders & Remarks)', 'Column 12: Orders & Encumbrance Notes')}
            </span>
            <ul className="space-y-1.5 text-xs text-[#555968]">
              {(language === 'hi' ? selectedRecord.remarksHi : selectedRecord.remarks).map((rem, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#ffffff] p-3 rounded-lg border border-[#e7e2d8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e4db2] mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed text-[#1e212b]">{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Digital Certificate Seal & Stamp */}
          <div className="mt-5 pt-4 border-t border-[#e7e2d8] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#555968]">
            <div>
              <div className="font-bold text-[#5e4db2] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>{t('राजस्व परिषद उत्तर प्रदेश द्वारा डिजिटल रूप से सत्यापित', 'Digitally Verified by Board of Revenue UP')}</span>
              </div>
              <div className="text-[10px] text-[#767d8f] font-mono mt-0.5">
                प्रमाणपत्र संख्या (Ref ID): UP-REV-2026-BHU-4529184 • निर्गमन तिथि: {new Date().toLocaleDateString('hi-IN')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-bold text-[#1e212b] block">{t('तहसीलदार / उपजिलाधिकारी', 'Tehsildar / SDM')}</span>
                <span className="text-[10px] text-[#767d8f]">{t('तहसील बिलारी, मुरादाबाद', 'Tehsil Bilari, Moradabad')}</span>
              </div>
              <div className="w-12 h-12 rounded-xl border border-dashed border-[#5e4db2] flex items-center justify-center text-[9px] font-bold text-[#5e4db2] text-center p-1 uppercase">
                SEAL / मुहर
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: PROPERTY AREA CONVERTER & LEGAL RIGHTS CLASSIFICATION */}
      {activeDetailSection === 'property_area' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Interactive Area Converter Card */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#ece6f6] mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#5e4db2]" />
                <h3 className="font-bold text-sm sm:text-base text-[#1e212b]">
                  {t('रकबा व क्षेत्रफल कनवर्टर (Area Breakdown)', 'Land Area Breakdown & Conversions')}
                </h3>
              </div>
              <span className="font-mono font-bold text-sm text-[#5e4db2]">
                {selectedRecord.totalAreaHectare} {t('हेक्टेयर', 'Hectare')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8] text-center">
                <span className="text-[11px] text-[#767d8f] font-semibold block uppercase">{t('पक्का बीघा', 'Pukka Bigha')}</span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#5e4db2] mt-1 block">{areaBigha} {t('बीघा', 'Bigha')}</span>
                <span className="text-[10px] text-[#767d8f] mt-0.5 block">1 Bigha = 2530 m²</span>
              </div>

              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8] text-center">
                <span className="text-[11px] text-[#767d8f] font-semibold block uppercase">{t('बिस्वा', 'Biswa')}</span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#5e4db2] mt-1 block">{areaBiswa} {t('बिस्वा', 'Biswa')}</span>
                <span className="text-[10px] text-[#767d8f] mt-0.5 block">20 Biswa = 1 Bigha</span>
              </div>

              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8] text-center">
                <span className="text-[11px] text-[#767d8f] font-semibold block uppercase">{t('वर्ग मीटर', 'Sq. Meters')}</span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#5e4db2] mt-1 block">{areaSqm} m²</span>
                <span className="text-[10px] text-[#767d8f] mt-0.5 block">1 Ha = 10,000 m²</span>
              </div>

              <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-[#e7e2d8] text-center">
                <span className="text-[11px] text-[#767d8f] font-semibold block uppercase">{t('एकड़', 'Acres')}</span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#5e4db2] mt-1 block">{areaAcre} Acre</span>
                <span className="text-[10px] text-[#767d8f] mt-0.5 block">1 Ha = 2.471 Acre</span>
              </div>
            </div>
          </div>

          {/* Legal Rights & Classification Breakdown */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <h3 className="font-bold text-sm sm:text-base text-[#1e212b] mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#5e4db2]" />
              <span>{t('भूमि अधिकार एवं श्रेणी व्याख्या', 'Land Classification & Rights Explanation')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#767d8f] block">
                  {t('राजस्व श्रेणी (Revenue Classification)', 'Revenue Classification')}
                </span>
                <div className="font-bold text-sm text-[#5e4db2] mt-1">
                  {language === 'hi' ? selectedRecord.landClassificationHi : selectedRecord.landClassification}
                </div>
                <p className="text-xs text-[#555968] mt-2 leading-relaxed">
                  {t(
                    'संक्रमणीय भूमिधर: नागरिक को भूमि का पूर्ण कानूनी अधिकार प्राप्त है। भूमि को बिना पूर्व सरकारी अनुमति के विक्रय, दान, बंधक अथवा वसीयत किया जा सकता है।',
                    'Bhumidhar with Transferable Rights: Full legal rights to sell, gift, lease or transfer the parcel with complete ownership.'
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#767d8f] block">
                  {t('भू-उपयोग (Land Usage)', 'Land Usage & Soil Type')}
                </span>
                <div className="font-bold text-sm text-[#1e212b] mt-1">
                  {t('कृषि भूमि (दोफसली सिंचित)', 'Agricultural (Double-Cropped Irrigated)')}
                </div>
                <p className="text-xs text-[#555968] mt-2 leading-relaxed">
                  {t(
                    'नहर व निजी नलकूप द्वारा सिंचित। मुख्य फसलें: गेहूं, धान, गन्ना। गैर-कृषि उपयोग (धारा 80 / 143) अभी दर्ज नहीं है।',
                    'Irrigated agricultural land via canal and tube-well. Commercial 143 conversion not active.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: CADASTRAL MAP PREVIEW & BOUNDARIES */}
      {activeDetailSection === 'cadastral_map' && (
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#ece6f6]">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#1e212b] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5e4db2]" />
                <span>{t('भू-नक्शा गाटा सीमाएं (Cadastral Parcel Map)', 'Cadastral Parcel Map')}</span>
              </h3>
              <p className="text-xs text-[#767d8f]">
                {t('गाटा संख्या 142/1 व 142/2 की डिजिटल सीमाएं व चकरोड:', 'Digital boundary plot and access roads:')}
              </p>
            </div>

            <button
              onClick={handleOpenOnMap}
              className="px-3.5 py-2 rounded-xl bg-[#5e4db2] hover:bg-[#50409c] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('फुल स्क्रीन नक्शा खोलें', 'Open Full Cadastral Map')}</span>
            </button>
          </div>

          {/* Embedded Parcel Boundary Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-5 rounded-xl bg-[#faf9f6] border border-[#e7e2d8] flex flex-col justify-center items-center text-center min-h-48">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#1e212b]">
                {t('गाटा संख्या 142/1 - चकरोड व संपर्क मार्ग संलग्न', 'Khasra Plot 142/1 - Direct Chakroad Access')}
              </h4>
              <p className="text-xs text-[#555968] max-w-md mt-1 leading-relaxed">
                {t(
                  'उत्तर: गाटा 141 (सोमपाल), दक्षिण: 12 फीट चौड़ा चकरोड, पूर्व: गाटा 143 (सरकारी नाली), पश्चिम: गाटा 140।',
                  'North: Plot 141 (Sompal), South: 12ft Chakroad, East: Plot 143 (Water Canal), West: Plot 140.'
                )}
              </p>
              <button
                onClick={handleOpenOnMap}
                className="mt-4 px-4 py-2 rounded-xl bg-[#ffffff] hover:bg-[#5e4db2] hover:text-white border border-[#e7e2d8] text-xs font-semibold text-[#5e4db2] transition-all cursor-pointer shadow-2xs"
              >
                {t('इंटरैक्टिव भू-नक्शे पर देखें', 'View Interactive Cadastral Map')}
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
                <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('भू-सीमांकन (Demarcation)', 'Demarcation Status')}</span>
                <span className="font-bold text-[#16a34a] mt-0.5 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('पत्थर नसब सत्यापित', 'Boundary Pillars Verified')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
                <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('रास्ता / चकरोड', 'Road Connectivity')}</span>
                <span className="font-bold text-[#1e212b] mt-0.5 block">
                  {t('12 फीट सरकारी चकरोड उपलब्ध', '12ft Official Chakroad')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e7e2d8]">
                <span className="text-[#767d8f] block text-[10px] uppercase font-semibold">{t('सिंचाई स्रोत', 'Irrigation Source')}</span>
                <span className="font-bold text-[#5e4db2] mt-0.5 block">
                  {t('सरकारी माइनर नहर + नलकूप', 'Govt Canal Minor + Tubewell')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION E: ASSOCIATED VAULT DOCUMENTS & MUTATION PROGRESS */}
      {activeDetailSection === 'documents_mutation' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Related Documents */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <h3 className="font-bold text-sm sm:text-base text-[#1e212b] flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-[#5e4db2]" />
                <span>{t('इस खाते से संबंधित सुरक्षित प्रपत्र (Vault Documents)', 'Associated Vault Documents')}</span>
              </h3>
              <button
                onClick={() => setActiveTab('bhulekh_locker')}
                className="text-xs text-[#5e4db2] font-semibold hover:underline flex items-center gap-1"
              >
                <span>{t('लॉकर में जाएं', 'Go to Locker')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lockerDocs.slice(0, 2).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-[#e7e2d8] bg-[#faf9f6] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#f4f2f9] text-[#5e4db2] flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1e212b]">
                        {language === 'hi' ? doc.titleHi : doc.title}
                      </h4>
                      <p className="text-[11px] text-[#767d8f] mt-0.5">
                        {t('दिनांक:', 'Date:')} {doc.issuedDate} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('bhulekh_locker')}
                    className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#5e4db2] hover:text-white border border-[#e7e2d8] text-[#5e4db2] transition-colors cursor-pointer"
                    title={t('डाउनलोड', 'Download')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Mutation (Dakhil-Kharij) Status */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e2d8] shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <h3 className="font-bold text-sm sm:text-base text-[#1e212b] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#d97706]" />
                <span>{t('दाखिल-खारिज (नामान्तरण) स्थिति', 'Active Mutation Application Progress')}</span>
              </h3>
              <button
                onClick={() => setActiveTab('mutation')}
                className="text-xs text-[#5e4db2] font-semibold hover:underline flex items-center gap-1"
              >
                <span>{t('दाखिल-खारिज ट्रैकर', 'Mutation Tracker')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#b45309]">
                  {t('आवेदन संख्या: #MUT-2026-8841 (विरासत नामान्तरण)', 'Application #MUT-2026-8841 (Succession Mutation)')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-bold text-[10px]">
                  {t('चरण 4/5: तहसीलदार समीक्षा', 'Stage 4/5: Tehsildar Review')}
                </span>
              </div>

              <p className="text-[#92400e] leading-relaxed">
                {t(
                  'लेखपाल आख्या व 35-दिवसीय उद्घोषणा अवधि पूरी हो चुकी है। बिना किसी आपत्ति के पत्रावली तहसीलदार न्यायालय में अंतिम आदेश हेतु प्रस्तुत है।',
                  'Lekhpal inspection complete with zero objections filed during 35-day proclamation period. Awaiting final order.'
                )}
              </p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setActiveTab('mutation')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  {t('संपूर्ण टाइमलाइन देखें', 'View Detailed Timeline')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHARE RECORD MODAL (LOW-BANDWIDTH SMS & DEEP LINK OPTIMIZED) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e7e2d8] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e7e2d8]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1e212b]">
                    {t('भू-अभिलेख साझा करें (Share Land Record)', 'Share Land Record')}
                  </h3>
                  <span className="text-xs text-[#767d8f]">
                    {t('कम नेटवर्क / ग्रामीण क्षेत्रों हेतु एसएमएस डीप-लिंक अनुकूलित', 'SMS Deep-link optimized for rural mobile environments')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-[#767d8f] hover:text-[#1e212b] rounded-lg hover:bg-[#faf9f6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pre-filled SMS Preview */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#555968] uppercase tracking-wider block">
                {t('एसएमएस संदेश पूर्वावलोकन (Pre-filled SMS Text):', 'Pre-filled SMS Text:')}
              </label>
              <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#e7e2d8] text-xs font-mono text-[#1e212b] whitespace-pre-wrap leading-relaxed">
                {smsShareText}
              </div>
            </div>

            {/* Deep Link URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#555968] uppercase tracking-wider block">
                {t('सत्यापन डीप-लिंक यूआरएल (Deep Link URL):', 'Deep Link Verification URL:')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={deepLinkUrl}
                  className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-[#faf9f6] border border-[#e7e2d8] text-[#1e212b]"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deepLinkUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#f4f2f9] hover:bg-[#eae6f5] text-[#5e4db2] text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? t('कॉपी हुआ', 'Copied') : t('लिंक कॉपी', 'Copy Link')}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons: Native SMS / WhatsApp / Copy Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#e7e2d8]">
              <a
                href={`sms:?body=${encodeURIComponent(smsShareText)}`}
                className="py-2.5 px-4 rounded-xl bg-[#5e4db2] hover:bg-[#50409c] text-white text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('मोबाइल SMS ऐप खोलें', 'Open Native SMS App')}</span>
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(smsShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t('व्हाट्सएप पर भेजें', 'Share on WhatsApp')}</span>
              </a>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(smsShareText);
                  setCopiedSms(true);
                  setTimeout(() => setCopiedSms(false), 2500);
                }}
                className="text-xs text-[#5e4db2] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedSms ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSms ? t('एसएमएस संदेश कॉपी हुआ!', 'SMS Text copied!') : t('पूरा SMS संदेश क्लिपबोर्ड पर कॉपी करें', 'Copy full SMS text')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. GENERATE QR CODE MODAL (FIELD VERIFICATION BY REVENUE INSPECTORS) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e7e2d8] space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e7e2d8]">
              <div className="text-left">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f4f2f9] text-[#5e4db2] border border-[#e5dff2] uppercase tracking-widest font-mono">
                  Official Field QR Verification
                </span>
                <h3 className="font-bold text-base text-[#1e212b] mt-1">
                  {t('राजस्व सत्यापन क्यूआर कोड', 'Revenue Verification QR Code')}
                </h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 text-[#767d8f] hover:text-[#1e212b] rounded-lg hover:bg-[#faf9f6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#555968] text-left leading-relaxed">
              {t(
                'यह क्यूआर कोड राजस्व निरीक्षक, लेखपाल अथवा बैंक प्रबंधक द्वारा ऑन-फील्ड त्वरित सत्यापन हेतु स्कैन किया जा सकता है:',
                'Official high-density QR for on-field verification by Revenue Inspectors, Lekhpals or Banks:'
              )}
            </p>

            {/* Generated QR Canvas Display */}
            <div className="bg-[#faf9f6] p-5 rounded-2xl border-2 border-dashed border-[#e7e2d8] flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Land Record QR Code"
                  className="w-52 h-52 rounded-xl shadow-xs border border-[#ece6f6] bg-white p-2"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-[#767d8f]">
                  Generating QR...
                </div>
              )}
              <span className="font-mono text-[11px] text-[#5e4db2] font-bold mt-3">
                {selectedRecord.khatauniUniqueId || `UP-KH-${selectedRecord.khataNumber}-${selectedRecord.villageId}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#767d8f] pt-2 border-t border-[#e7e2d8]">
              <span>{t('खाता:', 'Khata:')} #{selectedRecord.khataNumber}</span>
              <span>{t('ग्राम:', 'Village:')} {language === 'hi' ? selectedRecord.villageHi : selectedRecord.village}</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-[#5e4db2] font-semibold hover:underline"
              >
                {t('बंद करें', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



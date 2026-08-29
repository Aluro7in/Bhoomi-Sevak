import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  Phone,
  Building,
  ShieldCheck,
  AlertCircle,
  FileText,
  Download,
  Share2,
  ArrowRight,
  ExternalLink,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  MapPin,
  FolderLock,
  Layers,
  Check,
  ChevronRight,
  Info,
  BadgeAlert,
  Loader2,
  Scale,
  X,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import {
  MutationApplication,
  MutationTimelineStage,
  MutationMilestoneExplanationResult,
  CadastralParcel,
} from '../types';

export const MutationTracker: React.FC = () => {
  const {
    t,
    language,
    mutations,
    setActiveTab,
    selectRecordById,
    setSelectedParcel,
    parcels,
    lockerDocs,
    setLockerDocs,
  } = useApp();

  const [selectedMutation, setSelectedMutation] = useState<MutationApplication>(
    mutations[0] || ({} as MutationApplication)
  );

  // Active Explainer Modal State
  const [activeExplainerStage, setActiveExplainerStage] = useState<MutationTimelineStage | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationResult, setExplanationResult] = useState<MutationMilestoneExplanationResult | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAskingQuestion, setIsAskingQuestion] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string; answerHi: string }[]>([]);

  // Text to Speech (TTS)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mutations && mutations.length > 0 && (!selectedMutation || !selectedMutation.id)) {
      setSelectedMutation(mutations[0]);
    }
  }, [mutations]);

  // Handle TTS
  const handleSpeak = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert(t('आपके ब्राउज़र में आवाज़ (TTS) उपलब्ध नहीं है', 'Text-to-speech not supported in this browser'));
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Open "इसका मतलब क्या है?" Explainer for a stage
  const handleOpenStageExplainer = async (stage: MutationTimelineStage, initialQuestion?: string) => {
    setActiveExplainerStage(stage);
    setIsExplaining(true);
    setQaHistory([]);
    setCustomQuestion('');

    try {
      const res = await fetch('/api/ai/explain-mutation-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mutationId: selectedMutation.id,
          stageId: stage.stageId,
          question: initialQuestion,
        }),
      });

      if (!res.ok) throw new Error('Explanation request failed');
      const data: MutationMilestoneExplanationResult = await res.json();
      setExplanationResult(data);
    } catch (err) {
      console.error('Failed to load mutation milestone explanation:', err);
      // Fallback local grounded explanation
      setExplanationResult({
        milestoneKey: stage.milestoneKey,
        milestoneName: stage.name,
        milestoneNameHi: stage.nameHi,
        status: stage.status,
        statusHi: stage.status === 'completed' ? 'पूर्ण' : stage.status === 'current' ? 'प्रक्रियाधीन' : 'प्रतीक्षारत',
        summary: `Milestone: ${stage.name} for Case #${selectedMutation.applicationNumber}.`,
        summaryHi: `दाखिल-खारिज वाद सं. ${selectedMutation.applicationNumber} का चरण: ${stage.nameHi}।`,
        whatThisMeans: stage.citizenExplanation || 'Official verification step in progress.',
        whatThisMeansHi: stage.citizenExplanationHi || 'राजस्व अभिलेखों एवं मौके के सत्यापन का आधिकारिक चरण।',
        whatHappened: stage.description || 'Verified via revenue records.',
        whatHappenedHi: stage.descriptionHi || 'राजस्व अभिलेखों द्वारा सत्यापित।',
        whatHappensNext: stage.stageId < 5 ? `Next step is Stage ${stage.stageId + 1}.` : 'Khatauni ROR permanently updated.',
        whatHappensNextHi: stage.stageId < 5 ? `इसके बाद चरण ${stage.stageId + 1} की प्रक्रिया प्रारंभ होगी।` : 'कंप्यूटरीकृत खतौनी में आपका नाम नए खातेदार के रूप में स्थायी रूप से दर्ज हो चुका है।',
        citizenAction: stage.citizenActionGuidance || 'No action needed from citizen.',
        citizenActionHi: stage.citizenActionGuidanceHi || 'वर्तमान में नागरिक को तहसील जाने या किसी से मिलने की आवश्यकता नहीं है।',
        feesAndBriberyGuidance: 'All processes are automated online. Never pay unofficial fees to intermediaries.',
        feesAndBriberyGuidanceHi: 'नामान्तरण की प्रक्रिया सरकारी नियमों के तहत ऑनलाइन होती है। किसी भी मध्यस्थ या दलाल को अनधिकृत शुल्क न दें।',
        groundedFacts: [
          `वाद संख्या: ${selectedMutation.applicationNumber}`,
          `गाटा सं.: ${selectedMutation.khasraNumber} (रकबा: ${selectedMutation.areaHectare} हे.)`,
          `पटल अधिकारी: ${stage.officerHi || stage.officer}`,
          `स्थिति: ${stage.timestampTextHi || stage.completedDate || 'प्रक्रियाधीन'}`,
        ],
        responsibleOfficer: stage.officer,
        responsibleOfficerHi: stage.officerHi,
        disclaimer: 'Prototype Demonstration: AI explanation strictly grounded in stored synthetic case records.',
        disclaimerHi: 'प्रोटोटाइप प्रदर्शन: यह एआई व्याख्या उपलब्ध सिंथेटिक वाद रिकॉर्ड पर आधारित है।',
      });
    } finally {
      setIsExplaining(false);
    }
  };

  // Submit contextual user question within the modal
  const handleAskContextualQuestion = async (questionText: string) => {
    if (!questionText.trim() || !activeExplainerStage) return;

    setIsAskingQuestion(true);
    try {
      const res = await fetch('/api/ai/explain-mutation-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mutationId: selectedMutation.id,
          stageId: activeExplainerStage.stageId,
          question: questionText,
        }),
      });

      if (!res.ok) throw new Error('Question failed');
      const data: MutationMilestoneExplanationResult = await res.json();
      setQaHistory(prev => [
        ...prev,
        {
          question: questionText,
          answer: data.whatThisMeans,
          answerHi: data.whatThisMeansHi,
        },
      ]);
      setCustomQuestion('');
    } catch (err) {
      console.error('QA failed:', err);
    } finally {
      setIsAskingQuestion(false);
    }
  };

  // Deep connection: Open linked Khatauni ROR
  const handleOpenLinkedRecord = () => {
    const recordId = selectedMutation.linkedRecordId || 'rec-004';
    selectRecordById(recordId);
    setActiveTab('land_record');
  };

  // Deep connection: Open Cadastral Map with linked parcel
  const handleOpenLinkedMap = () => {
    const targetParcel = parcels.find(
      p =>
        p.id === selectedMutation.linkedParcelId ||
        p.khasraNumber === selectedMutation.khasraNumber ||
        p.khasraNumber.includes(selectedMutation.khasraNumber)
    );
    if (targetParcel) {
      setSelectedParcel(targetParcel);
    }
    setActiveTab('cadastral_map');
  };

  // Save / View in Bhulekh Locker
  const handleSaveToLocker = () => {
    const alreadySaved = lockerDocs.some(d => d.khasraNumber === selectedMutation.khasraNumber && d.category === 'mutation');
    if (!alreadySaved) {
      const newLockerDoc = {
        id: `doc-mut-${Date.now()}`,
        title: `Mutation Docket #${selectedMutation.applicationNumber}`,
        titleHi: `दाखिल-खारिज वाद पत्रावली #${selectedMutation.applicationNumber}`,
        category: 'mutation' as const,
        categoryHi: 'दाखिल-खारिज आदेश व वाद',
        issueDate: selectedMutation.filingDate,
        issuingAuthority: selectedMutation.tehsildarCourt || 'Tehsildar Court Bilari',
        issuingAuthorityHi: selectedMutation.tehsildarCourtHi || 'तहसीलदार न्यायालय बिलारी',
        khasraNumber: selectedMutation.khasraNumber,
        village: selectedMutation.village,
        villageHi: selectedMutation.villageHi,
        fileSize: '410 KB',
        fileType: 'pdf' as const,
        isRecordLinked: true,
        verificationStatus: 'verified' as const,
        extractedFields: {
          applicationNumber: selectedMutation.applicationNumber,
          applicantName: selectedMutation.applicantNameHi || selectedMutation.applicantName,
          khasraNumber: selectedMutation.khasraNumber,
          currentStage: `${selectedMutation.currentStage} of 5`,
        },
      };
      setLockerDocs([newLockerDoc, ...lockerDocs]);
    }
    setToastMessage(t('दाखिल-खारिज वाद पत्रावली आपके भूलेख लॉकर में सुरक्षित कर दी गई है!', 'Mutation docket successfully saved into your Bhulekh Locker!'));
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!selectedMutation || !selectedMutation.stages) {
    return (
      <div className="p-12 text-center text-[#78716c]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#143d2b] mb-3" />
        <p>{t('दाखिल-खारिज वाद लोड हो रहे हैं...', 'Loading mutation records...')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#143d2b] text-white px-5 py-3 rounded-xl shadow-xl border border-[#23583f] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setActiveTab('bhulekh_locker')}
            className="ml-2 text-xs bg-white text-[#143d2b] font-bold px-2.5 py-1 rounded-md hover:bg-emerald-50 transition-colors"
          >
            {t('लॉकर देखें', 'View Locker')}
          </button>
        </div>
      )}

      {/* 1. Header Banner & Case Switcher */}
      <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 border border-[#dfd8c7] shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center font-bold shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-[#1c1917]">
                  {t('दाखिल-खारिज (नामान्तरण) स्थिति ट्रैकर', 'Dakhil-Kharij (Mutation) Status Tracker')}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#eef6f0] text-[#166534] border border-[#d1e7dd] uppercase tracking-wider">
                  UP Revenue Code 2006 (Sec 33/34)
                </span>
              </div>
              <p className="text-xs text-[#57534e] mt-1">
                {t(
                  'तहसीलदार न्यायालय में विचाराधीन बैनामा व वरासत नामांतरण वादों की पारदर्शी 5-चरणीय प्रगति',
                  'Transparent 5-stage milestone tracking for succession and sale deed mutation cases'
                )}
              </p>
            </div>
          </div>

          {/* Application Selector Pills */}
          <div className="flex items-center gap-2 bg-[#fbf9f4] p-1.5 rounded-xl border border-[#e8e2d4]">
            <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider px-2">
              {t('वाद चुनें:', 'Select Case:')}
            </span>
            {mutations.map(m => {
              const isSelected = selectedMutation.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMutation(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#143d2b] text-white shadow-xs'
                      : 'bg-transparent text-[#57534e] hover:bg-[#ece7d9] hover:text-[#1c1917]'
                  }`}
                >
                  <span>{m.applicationNumber}</span>
                  {m.overallStatus === 'approved' ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  ) : (
                    <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-amber-600'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Selected Case Summary Card */}
      <div className="bg-[#ffffff] rounded-xl p-5 sm:p-7 border border-[#dfd8c7] shadow-xs">
        {/* Case Meta Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#ece7d9]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#143d2b] bg-[#eef6f0] px-2.5 py-0.5 rounded border border-[#d1e7dd]">
                {language === 'hi' ? selectedMutation.typeHi || selectedMutation.type : selectedMutation.type}
              </span>
              <span className="text-xs text-[#57534e] font-mono">
                {t('वाद संख्या:', 'Case #')}{' '}
                <strong className="text-[#1c1917] font-mono">{selectedMutation.applicationNumber}</strong>
              </span>
              <span className="text-xs text-[#78716c] font-medium">
                • {t('पंजीकरण तिथि:', 'Filing Date:')} <strong className="text-[#1c1917]">{selectedMutation.filingDate}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight">
              {language === 'hi' ? selectedMutation.applicantNameHi : selectedMutation.applicantName}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#57534e] pt-0.5">
              <span>
                {t('पक्षकार / विक्रेता / मूल खातेदार:', 'From / Transferor:')}{' '}
                <strong className="text-[#1c1917]">
                  {language === 'hi' ? selectedMutation.transferorNameHi : selectedMutation.transferorName}
                </strong>
              </span>
              <span>•</span>
              <span>
                {t('ग्राम:', 'Village:')}{' '}
                <strong className="text-[#1c1917]">{language === 'hi' ? selectedMutation.villageHi : selectedMutation.village}</strong>,{' '}
                {t('तहसील:', 'Tehsil:')}{' '}
                <strong className="text-[#1c1917]">{language === 'hi' ? selectedMutation.tehsilHi : selectedMutation.tehsil}</strong>
              </span>
              <span>•</span>
              <span>
                {t('गाटा / खसरा सं.:', 'Khasra:')}{' '}
                <strong className="font-mono text-[#143d2b] font-bold">{selectedMutation.khasraNumber}</strong> (
                {selectedMutation.areaHectare} Ha / {(selectedMutation.areaHectare * 3.95).toFixed(2)} {t('बीघा', 'Bigha')})
              </span>
              <span>•</span>
              <span>
                {t('विलेख / संदर्भ:', 'Deed Ref:')}{' '}
                <strong className="text-[#1c1917]">{selectedMutation.deedRegistrationNo}</strong>
              </span>
            </div>
          </div>

          {/* Current Status Pill with Overall Status */}
          <div className="flex flex-col items-end gap-2">
            {selectedMutation.overallStatus === 'approved' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef6f0] text-[#166534] border border-[#d1e7dd] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? selectedMutation.statusLabelHi : selectedMutation.statusLabel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff7ed] text-[#9a3412] border border-[#ffedd5] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-pulse"></span>
                <span>{language === 'hi' ? selectedMutation.statusLabelHi : selectedMutation.statusLabel}</span>
              </div>
            )}

            {selectedMutation.nextHearingDate && (
              <div className="text-[11px] font-semibold text-[#78716c] flex items-center gap-1.5 bg-[#fbf9f4] px-2.5 py-1 rounded border border-[#e8e2d4]">
                <Calendar className="w-3.5 h-3.5 text-[#143d2b]" />
                <span>{t('आपत्ति पूर्ण / आदेश नियत तिथि:', 'Hearing / Notice Expiry:')}</span>
                <strong className="text-[#143d2b] font-mono">{selectedMutation.nextHearingDate}</strong>
              </div>
            )}
          </div>
        </div>

        {/* 3. Grounded Reassurance & Case Meaning Bar */}
        {selectedMutation.aiOverview && (
          <div className="my-5 p-4 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#143d2b] flex items-center gap-1.5">
                  <span>{t('नागरिक सारांश एवं कानूनी स्थिति (Plain Summary):', 'Citizen Overview & Status:')}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#1c1917] leading-relaxed">
                  {language === 'hi' ? selectedMutation.aiOverview.summaryHi : selectedMutation.aiOverview.summary}
                </p>
                <p className="text-[11px] text-[#57534e]">
                  💡 <strong>{t('नागरिक मार्गदर्शन:', 'Citizen Guidance:')}</strong>{' '}
                  {language === 'hi' ? selectedMutation.aiOverview.citizenGuidanceHi : selectedMutation.aiOverview.citizenGuidance}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  handleSpeak(
                    language === 'hi'
                      ? `${selectedMutation.aiOverview?.summaryHi} ${selectedMutation.aiOverview?.citizenGuidanceHi}`
                      : `${selectedMutation.aiOverview?.summary} ${selectedMutation.aiOverview?.citizenGuidance}`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ffffff] hover:bg-[#ece7d9] border border-[#dfd8c7] text-[#1c1917] text-xs font-bold shadow-2xs transition-colors"
                title={t('आवाज़ में सुनें', 'Listen')}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#143d2b]" />}
                <span>{isPlayingAudio ? t('रोकें', 'Stop') : t('आवाज़ में सुनें', 'Listen Audio')}</span>
              </button>

              <button
                onClick={() => {
                  const currentStageObj = selectedMutation.stages.find(s => s.stageId === selectedMutation.currentStage) || selectedMutation.stages[0];
                  handleOpenStageExplainer(currentStageObj);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#143d2b] hover:bg-[#1f543c] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-emerald-300" />
                <span>{t('इसका मतलब क्या है?', 'What does this mean?')}</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. The 5-Milestone Transparent Journey Timeline */}
        <div className="my-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#143d2b]" />
              <span>{t('5-चरणीय पारदर्शी दाखिल-खारिज समय-सारणी (5-Stage Milestone Timeline):', '5-Stage Milestone Timeline:')}</span>
            </h4>
            <span className="text-[11px] text-[#78716c]">
              {t('हर चरण पर क्लिक करके अर्थ समझें', 'Click any stage for grounded explanation')}
            </span>
          </div>

          <div className="space-y-3">
            {selectedMutation.stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'current' || stage.status === 'in_progress';
              const isPending = stage.status === 'pending';

              return (
                <div
                  key={stage.stageId}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isCompleted
                      ? 'bg-[#ffffff] border-[#d1e7dd] shadow-2xs hover:border-[#143d2b]'
                      : isCurrent
                      ? 'bg-[#fffdfa] border-[#ea580c] ring-1 ring-[#ea580c]/30 shadow-xs'
                      : 'bg-[#faf8f3] border-[#e8e2d4] opacity-75'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
                    {/* Left: Milestone Badge & Content */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-[260px]">
                      {/* Milestone Number & State Circle */}
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs border ${
                            isCompleted
                              ? 'bg-[#143d2b] border-[#143d2b] text-white'
                              : isCurrent
                              ? 'bg-[#ea580c] border-[#ea580c] text-white animate-pulse'
                              : 'bg-[#ece7d9] border-[#dfd8c7] text-[#78716c]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : isCurrent ? <Clock className="w-5 h-5" /> : idx + 1}
                        </div>
                        {idx < selectedMutation.stages.length - 1 && (
                          <div
                            className={`w-0.5 h-6 mt-2 hidden sm:block ${
                              isCompleted ? 'bg-[#143d2b]' : 'bg-[#e8e2d4]'
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Milestone Text Info */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              isCompleted
                                ? 'bg-[#eef6f0] text-[#166534] border-[#d1e7dd]'
                                : isCurrent
                                ? 'bg-[#fff7ed] text-[#9a3412] border-[#ffedd5]'
                                : 'bg-[#f5f2eb] text-[#78716c] border-[#dfd8c7]'
                            }`}
                          >
                            {t(`चरण ${idx + 1}`, `Milestone ${idx + 1}`)}: {language === 'hi' ? stage.shortLabelHi : stage.shortLabel}
                          </span>

                          <span className="text-[11px] font-semibold font-mono text-[#57534e]">
                            {stage.timestampTextHi || stage.timestampText || stage.completedDate || stage.expectedDate}
                          </span>
                        </div>

                        <h5 className="text-base font-bold text-[#1c1917] leading-tight">
                          {language === 'hi' ? stage.nameHi : stage.name}
                        </h5>

                        <p className="text-xs text-[#57534e] leading-relaxed">
                          {language === 'hi' ? stage.citizenExplanationHi || stage.descriptionHi : stage.citizenExplanation || stage.description}
                        </p>

                        {/* Officer & Report Snippet */}
                        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#78716c]">
                          <span className="flex items-center gap-1 font-medium text-[#143d2b]">
                            <Building className="w-3 h-3" />
                            <span>{language === 'hi' ? stage.officerHi : stage.officer}</span>
                          </span>

                          {(stage.reportSnippet || stage.reportSnippetHi) && (
                            <span className="bg-[#f5f2eb] px-2 py-0.5 rounded border border-[#e8e2d4] text-[#1c1917] italic">
                              "{language === 'hi' ? stage.reportSnippetHi : stage.reportSnippet}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: "इसका मतलब क्या है?" Button & Action State */}
                    <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#ece7d9]">
                      <button
                        onClick={() => handleOpenStageExplainer(stage)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ffffff] hover:bg-[#fbf9f4] border border-[#dfd8c7] text-[#143d2b] hover:border-[#143d2b] text-xs font-bold shadow-2xs transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#143d2b]" />
                        <span>{t('इसका मतलब क्या है?', 'What does this mean?')}</span>
                      </button>

                      <div className="text-[11px] font-semibold text-[#57534e]">
                        {isCompleted ? (
                          <span className="text-[#166534] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />
                            {t('सफलतापूर्वक पूर्ण', 'Completed')}
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[#9a3412] font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                            {t('प्रक्रियाधीन (कार्रवाई आवश्यक नहीं)', 'Active (No Action Needed)')}
                          </span>
                        ) : (
                          <span className="text-[#78716c]">{t('आगामी चरण', 'Upcoming Stage')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Deep Connections Bar: Property, Record, Map, Documents, Bhulekh Locker */}
        <div className="mt-8 pt-6 border-t border-[#ece7d9]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#143d2b]" />
            <span>{t('प्रणाली एकीकरण व संबंधित संसाधन (Integrated Systems & Evidence):', 'Connected Systems & Evidence:')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Linked Khatauni Record */}
            <button
              onClick={handleOpenLinkedRecord}
              className="p-3.5 rounded-xl bg-[#fbf9f4] hover:bg-[#f5f2eb] border border-[#e8e2d4] hover:border-[#143d2b] text-left transition-all group shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#143d2b] mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('अभिलेख (ROR)', 'Land Record')}</span>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#1c1917]">
                  {t('संबंधित खतौनी खाता', 'Linked Khatauni')} #{selectedMutation.khataNumber || '00054'}
                </div>
                <p className="text-[11px] text-[#57534e] mt-0.5">
                  {t('डिजिटल आर.ओ.आर नकल व अधिकार विवरण देखें', 'View computerized ROR extract')}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#e8e2d4] text-[11px] font-bold text-[#143d2b] flex items-center gap-1 group-hover:underline">
                <span>{t('खतौनी खोलें', 'Open Record')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* 2. Linked Cadastral Map Parcel */}
            <button
              onClick={handleOpenLinkedMap}
              className="p-3.5 rounded-xl bg-[#fbf9f4] hover:bg-[#f5f2eb] border border-[#e8e2d4] hover:border-[#143d2b] text-left transition-all group shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#143d2b] mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('भू-नक्शा (Map)', 'Cadastral Map')}</span>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#1c1917]">
                  {t('भू-नक्शे पर गाटा सं.', 'Map Parcel')} #{selectedMutation.khasraNumber}
                </div>
                <p className="text-[11px] text-[#57534e] mt-0.5">
                  {t('सीमांकन, पड़ोसी मेड़ व भू-स्थानिक निर्देशांक', 'Boundary, neighbor plots & coordinates')}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#e8e2d4] text-[11px] font-bold text-[#143d2b] flex items-center gap-1 group-hover:underline">
                <span>{t('भू-नक्शा देखें', 'View Map')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* 3. Document Intelligence & Verification */}
            <button
              onClick={() => setActiveTab('doc_intelligence')}
              className="p-3.5 rounded-xl bg-[#fbf9f4] hover:bg-[#f5f2eb] border border-[#e8e2d4] hover:border-[#143d2b] text-left transition-all group shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#143d2b] mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('दस्तावेज़ मिलान', 'Doc Intelligence')}</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#1c1917]">
                  {t('बैनामा विलेख #88/2025', 'Sale Deed #88/2025')}
                </div>
                <p className="text-[11px] text-[#57534e] mt-0.5">
                  {t('दस्तावेज ओसीआर व रिकॉर्ड मिलान रिपोर्ट', 'Deterministic OCR & field comparison')}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#e8e2d4] text-[11px] font-bold text-[#143d2b] flex items-center gap-1 group-hover:underline">
                <span>{t('दस्तावेज जांचें', 'Verify Document')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* 4. Bhulekh Locker Safe Storage */}
            <button
              onClick={handleSaveToLocker}
              className="p-3.5 rounded-xl bg-[#eef6f0] hover:bg-[#e1f0e5] border border-[#d1e7dd] hover:border-[#143d2b] text-left transition-all group shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#143d2b] mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('भूलेख लॉकर', 'Bhulekh Locker')}</span>
                  <FolderLock className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#143d2b]">
                  {t('लॉकर में वाद पत्रावली सहेजें', 'Save Docket to Locker')}
                </div>
                <p className="text-[11px] text-[#57534e] mt-0.5">
                  {t('प्रमाणित आदेश व रसीद डिजिटल वॉल्ट में सुरक्षित', 'Encrypted cloud vault storage')}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#d1e7dd] text-[11px] font-bold text-[#143d2b] flex items-center gap-1 group-hover:underline">
                <span>{t('लॉकर में जोड़ें', 'Save to Locker')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        {/* 6. Assigned Revenue Officials Contact Cards */}
        <div className="mt-8 pt-6 border-t border-[#ece7d9]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#143d2b]" />
            <span>{t('संबंधित राजस्व अधिकारी व सहायता पटल (Assigned Revenue Officials):', 'Assigned Officials:')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Lekhpal */}
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#143d2b] block">
                {t('क्षेत्रीय लेखपाल (हल्का रामनगर)', 'Field Lekhpal')}
              </span>
              <div className="font-bold text-sm text-[#1c1917] mt-0.5">
                {language === 'hi' ? selectedMutation.lekhpalNameHi : selectedMutation.lekhpalName}
              </div>
              <div className="text-[#57534e] text-[11px] mt-0.5">
                {t('हल्का कोड 115420, बिलारी', 'Halka Ramnagar, Bilari')}
              </div>
              <a
                href={`tel:${selectedMutation.lekhpalPhone}`}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[#143d2b] font-bold hover:underline font-mono bg-[#ffffff] px-2.5 py-1 rounded border border-[#dfd8c7]"
              >
                <Phone className="w-3 h-3 text-[#143d2b]" />
                <span>{selectedMutation.lekhpalPhone}</span>
              </a>
            </div>

            {/* Revenue Inspector */}
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#143d2b] block">
                {t('राजस्व निरीक्षक (कानूनगो)', 'Revenue Inspector')}
              </span>
              <div className="font-bold text-sm text-[#1c1917] mt-0.5">
                {language === 'hi' ? selectedMutation.revenueInspectorNameHi : selectedMutation.revenueInspectorName}
              </div>
              <div className="text-[#57534e] text-[11px] mt-0.5">{t('सर्किल बिलारी', 'Circle Bilari')}</div>
              <span className="mt-2.5 inline-flex items-center gap-1.5 text-[#57534e] font-semibold font-mono bg-[#ffffff] px-2.5 py-1 rounded border border-[#dfd8c7]">
                <Phone className="w-3 h-3" />
                <span>+91 94120 44812</span>
              </span>
            </div>

            {/* Tehsildar Court */}
            <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#143d2b] block">
                {t('तहसीलदार न्यायालय', 'Tehsildar Court')}
              </span>
              <div className="font-bold text-sm text-[#1c1917] mt-0.5">
                {language === 'hi' ? selectedMutation.tehsildarCourtHi : selectedMutation.tehsildarCourt}
              </div>
              <div className="text-[#57534e] text-[11px] mt-0.5">{t('कार्य दिवस: सोम-शनि 10:00 से 05:00', 'Mon-Sat 10AM-5PM')}</div>
              <span className="mt-2.5 inline-flex items-center gap-1.5 text-[#143d2b] font-bold bg-[#ffffff] px-2.5 py-1 rounded border border-[#dfd8c7]">
                <Building className="w-3 h-3" />
                <span>{t('न्यायालय कक्ष सं. 4', 'Court Room 4')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 7. Action Footer & Receipt Print */}
        <div className="mt-8 pt-5 border-t border-[#ece7d9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenLinkedRecord}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#1f543c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>
                {t(
                  `संबंधित जमीन (गाटा ${selectedMutation.khasraNumber}) खतौनी देखें`,
                  `View Linked Land Record (Khasra ${selectedMutation.khasraNumber})`
                )}
              </span>
            </button>

            <button
              onClick={handleOpenLinkedMap}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ffffff] hover:bg-[#fbf9f4] border border-[#dfd8c7] text-[#1c1917] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#143d2b]" />
              <span>{t('भू-नक्शा देखें', 'View Cadastral Map')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#dfd8c7] bg-[#ffffff] hover:bg-[#fbf9f4] text-[#1c1917] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Download className="w-4 h-4 text-[#57534e]" />
              <span>{t('आवेदन स्थिति रसीद प्रिंट करें', 'Print Case Receipt')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8. Dedicated "इसका मतलब क्या है?" (What does this mean?) Grounded AI Modal */}
      {activeExplainerStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#ffffff] rounded-2xl border border-[#dfd8c7] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#ece7d9] flex items-center justify-between sticky top-0 bg-[#ffffff] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#143d2b] text-white px-2 py-0.5 rounded">
                      {t(`चरण ${activeExplainerStage.stageId}`, `Stage ${activeExplainerStage.stageId}`)}
                    </span>
                    <span className="text-xs text-[#57534e] font-mono">
                      {selectedMutation.applicationNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1c1917] mt-0.5">
                    {language === 'hi' ? activeExplainerStage.nameHi : activeExplainerStage.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleSpeak(
                      language === 'hi'
                        ? `${explanationResult?.whatThisMeansHi || ''} ${explanationResult?.citizenActionHi || ''}`
                        : `${explanationResult?.whatThisMeans || ''} ${explanationResult?.citizenAction || ''}`
                    )
                  }
                  className="p-2 rounded-lg bg-[#fbf9f4] hover:bg-[#ece7d9] border border-[#dfd8c7] text-[#143d2b] transition-colors"
                  title={t('आवाज़ में सुनें', 'Listen Audio')}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setActiveExplainerStage(null);
                    setExplanationResult(null);
                    if (isPlayingAudio) {
                      window.speechSynthesis.cancel();
                      setIsPlayingAudio(false);
                    }
                  }}
                  className="p-2 rounded-lg bg-[#fbf9f4] hover:bg-[#ece7d9] border border-[#dfd8c7] text-[#57534e] hover:text-[#1c1917] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 flex-1">
              {isExplaining ? (
                <div className="py-12 text-center text-[#78716c] space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#143d2b]" />
                  <p className="text-sm font-semibold">{t('एआई व्याख्या तैयार हो रही है...', 'Generating grounded explanation...')}</p>
                </div>
              ) : explanationResult ? (
                <>
                  {/* Primary Meaning Card */}
                  <div className="p-4 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#143d2b] uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>{t('इसका सीधा और सरल मतलब क्या है?', 'What does this specifically mean for you?')}</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#1c1917] font-medium leading-relaxed">
                      {language === 'hi' ? explanationResult.whatThisMeansHi : explanationResult.whatThisMeans}
                    </p>
                  </div>

                  {/* 3 Step Statutory Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* What Took Place */}
                    <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#143d2b] block">
                        {t('1. क्या कार्य हो चुका है? (What took place)', '1. What already occurred')}
                      </span>
                      <p className="text-[#1c1917] leading-relaxed">
                        {language === 'hi' ? explanationResult.whatHappenedHi : explanationResult.whatHappened}
                      </p>
                    </div>

                    {/* What Happens Next */}
                    <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#143d2b] block">
                        {t('2. आगे क्या होगा? (What happens next)', '2. What happens next')}
                      </span>
                      <p className="text-[#1c1917] leading-relaxed">
                        {language === 'hi' ? explanationResult.whatHappensNextHi : explanationResult.whatHappensNext}
                      </p>
                    </div>
                  </div>

                  {/* Citizen Action Guidance */}
                  <div className="p-4 rounded-xl bg-[#ffffff] border border-[#dfd8c7] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1c1917] uppercase tracking-wider">
                      <Info className="w-4 h-4 text-[#143d2b]" />
                      <span>{t('नागरिक को क्या करना है? (Citizen Action):', 'What should the citizen do?:')}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4] text-xs text-[#1c1917] font-semibold">
                      {language === 'hi' ? explanationResult.citizenActionHi : explanationResult.citizenAction}
                    </div>
                  </div>

                  {/* Anti-Fraud & Fees Caution */}
                  <div className="p-3.5 rounded-xl bg-[#fff7ed] border border-[#ffedd5] flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <strong className="text-[#9a3412] font-bold block">
                        {t('दलाली व अनधिकृत शुल्क निषेध (No Intermediary Fees):', 'Statutory Fee Guidance:')}
                      </strong>
                      <p className="text-[#7c2d12] leading-relaxed">
                        {language === 'hi' ? explanationResult.feesAndBriberyGuidanceHi : explanationResult.feesAndBriberyGuidance}
                      </p>
                    </div>
                  </div>

                  {/* Grounded Facts Chips */}
                  <div className="space-y-2 pt-2 border-t border-[#ece7d9]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716c] block">
                      {t('प्रमाणित वाद तथ्य (Grounded Case Facts):', 'Grounded Facts from Case Record:')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {explanationResult.groundedFacts.map((fact, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[11px] font-mono bg-[#fbf9f4] border border-[#e8e2d4] text-[#1c1917] px-2.5 py-1 rounded-md"
                        >
                          ✓ {fact}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Quick FAQ Questions */}
                  <div className="space-y-3 pt-3 border-t border-[#ece7d9]">
                    <span className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#143d2b]" />
                      <span>{t('इस चरण के बारे में अक्सर पूछे जाने वाले सवाल:', 'Common questions regarding this stage:')}</span>
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {[
                        t('क्या मुझे तहसील जाना पड़ेगा?', 'Do I need to visit Tehsil office?'),
                        t('30-दिवसीय आपत्ति नियम क्या है?', 'What is the 30-day notice rule?'),
                        t('खतौनी में नाम कब तक चढ़ेगा?', 'When will my name be in Khatauni?'),
                      ].map((quickQ, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleAskContextualQuestion(quickQ)}
                          disabled={isAskingQuestion}
                          className="text-xs bg-[#fbf9f4] hover:bg-[#eef6f0] text-[#1c1917] hover:text-[#143d2b] border border-[#e8e2d4] hover:border-[#143d2b] px-3 py-1.5 rounded-lg transition-all text-left"
                        >
                          ❓ {quickQ}
                        </button>
                      ))}
                    </div>

                    {/* QA History */}
                    {qaHistory.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {qaHistory.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4] space-y-1 text-xs">
                            <div className="font-bold text-[#143d2b] flex items-center gap-1">
                              <span>❓ {item.question}</span>
                            </div>
                            <div className="text-[#1c1917] pl-4 border-l-2 border-[#143d2b] leading-relaxed">
                              {language === 'hi' ? item.answerHi : item.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Custom Question Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={customQuestion}
                        onChange={e => setCustomQuestion(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAskContextualQuestion(customQuestion)}
                        placeholder={t('इस चरण से जुड़ा अपना प्रश्न यहाँ लिखें...', 'Type your question about this stage...')}
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#dfd8c7] bg-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#143d2b]"
                      />
                      <button
                        onClick={() => handleAskContextualQuestion(customQuestion)}
                        disabled={!customQuestion.trim() || isAskingQuestion}
                        className="px-3.5 py-2 rounded-lg bg-[#143d2b] hover:bg-[#1f543c] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        {isAskingQuestion ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{t('पूछें', 'Ask')}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer with Honest Grounding Disclaimer */}
            <div className="p-4 bg-[#fbf9f4] border-t border-[#ece7d9] text-[11px] text-[#78716c] flex items-center justify-between">
              <span>
                🔒 {t('सिंथेटिक वाद डेटा पर आधारित प्रमाणित व्याख्या। कोई मनगढ़ंत सरकारी समय-सीमा नहीं।', 'Grounded in stored synthetic case record. No fabricated timelines.')}
              </span>
              <button
                onClick={() => setActiveExplainerStage(null)}
                className="px-4 py-1.5 rounded-lg bg-[#143d2b] text-white font-bold text-xs hover:bg-[#1f543c] transition-colors"
              >
                {t('समझ गया', 'Got it')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

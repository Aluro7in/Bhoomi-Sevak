import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Scale,
  Cpu,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Server,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

export const PublicTrustPage: React.FC = () => {
  const { language, t, navigateToApp } = useApp();

  return (
    <div className="space-y-12 py-4 select-none">
      {/* 1. Trust Header */}
      <section className="bg-gradient-to-br from-white via-sky-50/50 to-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 civic-blueprint-grid opacity-25 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>{t('सत्यनिष्ठा, सुरक्षा एवं प्रकटीकरण', 'Trust, Security & Privacy Disclosures')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('विश्वसनीयता, डेटा गोपनीयता एवं एआई नैतिकता नीति', 'Trust Standards, Data Privacy & AI Ethics')}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {t(
              'भूमि सेवक नागरिकों के अधिकारों, डेटा की गोपनीयता और एआई की सत्यनिष्ठा के प्रति पूरी तरह प्रतिबद्ध है। इस पृष्ठ पर हमारे प्रोटोटाइप की कार्यप्रणाली, सिंथेटिक डेटा उपयोग और नैतिक सीमाओं का पारदर्शी प्रकटीकरण दिया गया है।',
              'Bhoomi Sevak is deeply committed to citizen rights, data privacy, and ethical AI integrity. This page provides full transparent disclosures regarding prototype data, anti-hallucination guardrails, and privacy policies.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Synthetic Data Disclosure (Hackathon Compliance) */}
      <section className="bg-gradient-to-r from-sky-50 to-blue-50/70 border border-sky-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-3 text-sky-900">
          <AlertTriangle className="w-6 h-6 shrink-0 text-sky-600" />
          <h2 className="text-lg sm:text-xl font-bold">
            {t('सिंथेटिक डेटा प्रकटीकरण (Synthetic Demonstration Data Policy)', 'Synthetic Demonstration Data Disclosure')}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {t(
            'हैकाथॉन "Build What Moves India" के दिशा-निर्देशों के अनुसार, यह प्रोटोटाइप 100% सिंथेटिक और सुरक्षित मॉडल डेटा (ग्राम रामनगर, तहसील बिलारी, जिला मुरादाबाद) पर संचालित होता है। यह किसी भी लाइव सरकारी डेटाबेस, आधार, पैन या वास्तविक नागरिक के व्यक्तिगत डेटा से नहीं जुड़ता। सभी नाम, खाते और भूखंड संख्याएं पूर्णतः काल्पनिक हैं जिनका उपयोग केवल प्रणाली की कार्यप्रणाली के प्रदर्शन हेतु किया गया है।',
            'In strict compliance with the hackathon rules and civic data ethics, this prototype operates entirely on 100% synthetic demonstration data (e.g. Village Ramnagar, Tehsil Bilari). It does NOT connect to live government databases, Aadhaar, PAN, or real citizen PII. All landowner names and parcel records are synthetic demonstration models created to test edge cases safely.'
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('शून्य वास्तविक PII', 'Zero Real PII')}</strong>
            <span className="text-slate-600">{t('कोई वास्तविक व्यक्तिगत पहचान संग्रहित नहीं।', 'No real citizen identity data stored.')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('सुरक्षित आइसोलेशन', 'Sandboxed Environment')}</strong>
            <span className="text-slate-600">{t('सुरक्षित परीक्षण परिवेश में पूर्ण कार्यप्रणाली।', 'Full working flow within isolated sandbox.')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1 shadow-2xs">
            <strong className="text-sky-900 block font-bold">{t('सटीक प्रारूप', 'UP Bhulekh Standard')}</strong>
            <span className="text-slate-600">{t('आधिकारिक उत्तर प्रदेश भूलेख प्रारूप संगत।', 'Full fidelity to official UP Bhulekh schemas.')}</span>
          </div>
        </div>
      </section>

      {/* 3. The 4 Grounded AI Guarantees */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {t('एआई सत्यनिष्ठा व गैर-मनगढ़ंतता (Anti-Hallucination) के 4 स्तंभ', '4 Pillars of Anti-Hallucination & AI Integrity')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm sm:text-base font-bold">{t('1. डेटाबेस ही सर्वोच्च सत्य है', '1. Database as Sole Source of Truth')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'एआई कभी भी स्वामित्व, रकबा, गाटा संख्या या बैंक बंधक का अनुमान नहीं लगाता। सभी कानूनी तथ्य पोस्टग्रेएसक्यूएल डेटाबेस से ही प्राप्त होते हैं।',
                'AI never infers or fabricates land title, area, or mortgage details. All facts are strictly queried from deterministic databases.'
              )}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm sm:text-base font-bold">{t('2. कानूनी दावों का निषेध (No Legal Verdict Claims)', '2. No Definite Legal Claims')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'एआई कभी "पूर्णतः कानूनी रूप से सुरक्षित" (Legally Safe) जैसे निश्चित दावे नहीं करता, बल्कि "उपलब्ध रिकॉर्ड में कोई समस्या नहीं पाई गई" या "समीक्षा की अनुशंसा" जैसे प्रामाणिक शब्द प्रयोग करता है।',
                'AI avoids absolute verdicts like "Legally Safe", using responsible phrases such as "No issue found in available record" or "Review recommended".'
              )}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm sm:text-base font-bold">{t('3. अस्पष्टता पर नागरिक से संवाद', '3. Explicit Ambiguity Handling')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'यदि कोई दस्तावेज़ धुंधला या कटा हुआ हो, तो एआई गलत अनुमान लगाने के बजाय नागरिक से स्पष्ट फोटो दोबारा अपलोड करने का आग्रह करता है।',
                'If a paper document is unreadable or blurry, the AI explicitly requests a clearer photo rather than guessing missing numbers.'
              )}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm sm:text-base font-bold">{t('4. साक्ष्य रेखांकन व संदर्भ (Evidence Highlighting)', '4. Visual Evidence Grounding')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'हर सारांश और विसंगति चेतावनी के साथ खतौनी के मूल कॉलम व कागजात के दृश्य बाउंडिंग बॉक्स का साक्ष्य संदर्भ प्रस्तुत किया जाता है।',
                'Every summary cites the official column row and renders visual bounding box evidence over uploaded documents.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Production Roadmap */}
      <section className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-sky-800 space-y-6">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-sky-300" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {t('उत्पादन तत्परता एवं भविष्य का रोडमैप', 'Production Readiness & Future Integration')}
            </h3>
            <span className="text-xs text-sky-300 font-semibold">
              {t('राष्ट्रीय ई-गवर्नेंस एवं एग्रीस्टैक अनुकूलता', 'National E-Governance & AgriStack Compatible')}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-3xl">
          {t(
            'भूमि सेवक का आर्किटेक्चर इस प्रकार बनाया गया है कि भविष्य में राज्य सरकार के एनआईसी भूलेख एपीआई (State NIC Bhulekh APIs), एग्रीस्टैक (AgriStack Farmer ID) और राजस्व न्यायालय प्रणाली (RCCMS) को सिंथेटिक डेटा कनेक्टर के स्थान पर निर्बाध रूप से जोड़ा जा सके।',
            'Bhoomi Sevak is engineered with pluggable connector interfaces. In production, synthetic data connectors can be cleanly swapped for official State NIC Bhulekh APIs, AgriStack Farmer Registry, and RCCMS litigation endpoints.'
          )}
        </p>
      </section>
    </div>
  );
};

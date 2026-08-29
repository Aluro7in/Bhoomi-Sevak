import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Info, Database, Sparkles, X, CheckCircle2, Lock, Cpu } from 'lucide-react';

export const DisclaimerModal: React.FC = () => {
  const { showDisclaimer, setShowDisclaimer, t, language } = useApp();

  if (!showDisclaimer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#dfd8c7] relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowDisclaimer(false)}
          className="absolute top-5 right-5 p-2 text-[#78716c] hover:text-[#1c1917] rounded-full hover:bg-[#f3eedf] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#ece7d9]">
          <div className="w-10 h-10 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1c1917]">
              {t('सिंथेटिक डेटा एवं तकनीकी प्रकटीकरण', 'Synthetic Data & Architecture Disclosure')}
            </h3>
            <span className="text-xs text-[#166534] font-bold uppercase tracking-wider">
              {t('Build What Moves India — Hackathon Prototype Compliance', 'Build What Moves India — Hackathon Prototype Compliance')}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[#57534e] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4]">
            <h4 className="font-bold text-[#1c1917] mb-1 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#143d2b]" />
              <span>{t('1. कृत्रिम (Synthetic) डेटा का उपयोग:', '1. Synthetic Realistic Data:')}</span>
            </h4>
            <p className="text-[#57534e]">
              {t(
                'यह प्रोटोटाइप वास्तविक सरकारी पोर्टल (UP Bhulekh/Aadhaar) या नागरिकों के वास्तविक निजी डेटा से जुड़ा नहीं है। सभी नाम, खाता, खसरा, और बंधक विवरण यथार्थवादी सिंथेटिक डेटा के रूप में तैयार किए गए हैं ताकि कानूनी और सुरक्षा मानकों का पूर्ण पालन हो सके।',
                'This prototype does not connect to live government servers or real citizen PII. All village, Khata, Khasra, and loan records are realistic synthetic models adhering strictly to security guidelines.'
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4]">
            <h4 className="font-bold text-[#1c1917] mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#143d2b]" />
              <span>{t('2. AI एवं डिटरमिनिस्टिक आर्किटेक्चर का पृथक्करण:', '2. AI & Deterministic Software Boundary:')}</span>
            </h4>
            <p className="text-[#57534e]">
              {t(
                'भूमि सेवक में AI कभी भी कानूनी तथ्यों (स्वामित्व, रकबा, बंधक) का आविष्कार नहीं करता। डेटाबेस को सत्य का एकमात्र स्रोत माना गया है। AI का उपयोग केवल प्राकृतिक भाषा समझने, जटिल शब्दावली को सरल भाषा में समझाने और कागज़ात के विसंगति विश्लेषण के लिए किया जाता है।',
                'The AI never invents land records or legal facts. The deterministic database is the sole ground truth. AI is strictly leveraged for natural intent parsing, plain-language translation, and OCR discrepancy detection.'
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4]">
            <h4 className="font-bold text-[#1c1917] mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#143d2b]" />
              <span>{t('3. सर्वर-साइड सुरक्षा एवं API गोपनीयता:', '3. Server-Side Security & Privacy:')}</span>
            </h4>
            <p className="text-[#57534e]">
              {t(
                'सभी AI कॉल्स और डेटा सत्यापन पूर्णतः सर्वर-साइड (Express API Layer) के माध्यम से निष्पादित होते हैं। कोई भी API Key या संवेदनशील विन्यास ब्राउज़र पर प्रकट नहीं होता।',
                'All AI operations and data verifications are executed purely server-side via Express API proxy routes. Zero API credentials are exposed to the client.'
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setShowDisclaimer(false)}
            className="px-6 py-2.5 rounded-xl bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            {t('समझ गया (Dismiss)', 'Understood')}
          </button>
        </div>
      </div>
    </div>
  );
};

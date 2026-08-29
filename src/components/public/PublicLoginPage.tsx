import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogIn,
  Phone,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react';

export const PublicLoginPage: React.FC = () => {
  const {
    language,
    t,
    navigateToApp,
    currentUser,
    setCurrentUser,
    sampleUsers,
    selectRecordById,
  } = useApp();

  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrorMessage(t('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    setErrorMessage('');
    setOtpStep(true);
    setOtpValue('123456'); // Default simulated OTP for frictionless demo
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Log in with default persona (Ram Kumar Singh)
      if (sampleUsers && sampleUsers.length > 0) {
        setCurrentUser(sampleUsers[0]);
      }
      navigateToApp('meri_zameen');
    }, 400);
  };

  const handleSelectPersona = (user: any) => {
    setCurrentUser(user);
    if (user.primaryRecordId) {
      selectRecordById(user.primaryRecordId);
    }
    navigateToApp('meri_zameen');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 select-none">
      {/* 1. Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold uppercase tracking-wider border border-sky-200">
          <LogIn className="w-3.5 h-3.5 text-sky-700" />
          <span>{t('नागरिक प्रवेश एवं सत्यापन', 'Citizen Login & Demo Gateway')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('भूमि सेवक नागरिक पोर्टल में प्रवेश करें', 'Enter Bhoomi Sevak Citizen Application')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t(
            'अपने मोबाइल नंबर से ओटीपी द्वारा प्रवेश करें, अथवा नीचे दिए गए डेमो काश्तकार प्रोफाइलों में से किसी एक को चुनें।',
            'Login via mobile OTP verification or select one of the pre-configured demo citizen profiles below.'
          )}
        </p>
      </div>

      {/* 2. Login Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Mobile OTP Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Phone className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('मोबाइल नंबर व ओटीपी प्रवेश', 'Mobile OTP Login')}
              </h2>
              <span className="text-[11px] text-slate-500">
                {t('सिम्युलेटेड त्वरित सत्यापन', 'Simulated Instant Verification')}
              </span>
            </div>
          </div>

          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  {t('10 अंकों का मोबाइल नंबर', '10-Digit Mobile Number')}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-sky-50/50 border border-sky-200 text-sm font-mono text-slate-900 outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                  />
                </div>
                {errorMessage && <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>{t('ओटीपी प्राप्त करें (Get OTP)', 'Send OTP')}</span>
                <ArrowRight className="w-4 h-4 text-sky-200" />
              </button>

              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-[11px] text-sky-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-700 shrink-0" />
                <span>{t('प्रोटोटाइप परीक्षण हेतु कोई भी 10 अंकों का नंबर मान्य है।', 'Any 10-digit number works for demonstration.')}</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-900">{t('6 अंकों का ओटीपी', '6-Digit OTP')}</label>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-sky-700 font-semibold hover:underline"
                  >
                    {t('नंबर बदलें', 'Change Number')}
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl bg-sky-50/50 border border-sky-200 text-center text-lg font-mono tracking-widest text-slate-900 outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
                <span className="text-[11px] text-sky-700 block font-medium">
                  {t('डेमो कोड स्वतः भरा गया: 123456', 'Demo code auto-filled: 123456')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isVerifying ? (
                  <span>{t('सत्यापित हो रहा है...', 'Verifying...')}</span>
                ) : (
                  <>
                    <span>{t('ओटीपी सत्यापित कर प्रवेश करें', 'Verify & Enter Portal')}</span>
                    <ArrowRight className="w-4 h-4 text-sky-200" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Quick Demo Persona Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-xs">
              <UserCheck className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('1-क्लिक डेमो काश्तकार प्रोफाइल', '1-Click Demo Profiles')}
              </h2>
              <span className="text-[11px] text-slate-500">
                {t('जज व मूल्यांकनकर्ताओं हेतु त्वरित प्रवेश', 'Instant access for evaluation')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sampleUsers &&
              sampleUsers.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectPersona(user)}
                  className="p-4 rounded-2xl bg-sky-50/40 hover:bg-sky-100/70 border border-sky-200 hover:border-sky-400 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm group-hover:scale-105 transition-transform shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {language === 'hi' ? user.nameHi || user.name : user.name}
                      </strong>
                      <span className="text-[11px] text-slate-500 block">
                        {language === 'hi' ? user.villageHi || user.village : user.village}, {t('तहसील बिलारी', 'Tehsil Bilari')}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
          </div>

          {/* Guest Instant Access */}
          <div className="pt-2">
            <button
              onClick={() => navigateToApp('meri_zameen')}
              className="w-full py-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-sky-900 border border-sky-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('बिना लॉगिन अतिथि के रूप में प्रवेश करें', 'Continue as Instant Guest')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

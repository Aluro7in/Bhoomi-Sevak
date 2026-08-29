import React from 'react';
import { useApp } from '../context/AppContext';
import { User, CheckCircle2, X, MapPin, Layers } from 'lucide-react';
import { CitizenUser } from '../types';

export const UserSwitchModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, currentUser, setCurrentUser, selectRecordById, t, language } = useApp();

  if (!showLoginModal) return null;

  const demoUsers: CitizenUser[] = [
    {
      id: 'usr-001',
      name: 'Ram Kumar Singh',
      nameHi: 'राम कुमार सिंह',
      phone: '+91 98371 20491',
      village: 'Ramnagar',
      villageHi: 'रामनगर',
      tehsil: 'Bilari',
      tehsilHi: 'बिलारी',
      district: 'Moradabad',
      districtHi: 'मुरादाबाद',
      khataNumbers: ['142', '89'],
      khasraNumbers: ['452', '453/1', '218'],
      totalAreaHectare: 0.438,
      aadhaarLinked: true,
      hasActiveMutation: true,
    },
    {
      id: 'usr-002',
      name: 'Rameshwar Sharma',
      nameHi: 'रामेश्वर शर्मा',
      phone: '+91 94125 78192',
      village: 'Hasanpur',
      villageHi: 'हसनपुर',
      tehsil: 'Hasanpur',
      tehsilHi: 'हसनपुर',
      district: 'Amroha',
      districtHi: 'अमरोहा',
      khataNumbers: ['504'],
      khasraNumbers: ['109'],
      totalAreaHectare: 0.520,
      aadhaarLinked: true,
      hasActiveMutation: false,
    },
    {
      id: 'usr-003',
      name: 'Suresh Chandra',
      nameHi: 'सुरेश चन्द्र',
      phone: '+91 99170 33412',
      village: 'Fatehpur',
      villageHi: 'फतेहपुर',
      tehsil: 'Chandausi',
      tehsilHi: 'चन्दौसी',
      district: 'Sambhal',
      districtHi: 'सम्भल',
      khataNumbers: ['77'],
      khasraNumbers: ['312', '313'],
      totalAreaHectare: 0.610,
      aadhaarLinked: true,
      hasActiveMutation: false,
    },
  ];

  const handleSelectUser = (user: CitizenUser) => {
    setCurrentUser(user);
    if (user.id === 'usr-001') selectRecordById('rec-001');
    else if (user.id === 'usr-002') selectRecordById('rec-003');
    else selectRecordById('rec-004');
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfd8c7] relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 text-[#78716c] hover:text-[#1c1917] rounded-full hover:bg-[#f3eedf]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#ece7d9]">
          <div className="w-10 h-10 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1c1917]">
              {t('नागरिक प्रोफाइल स्विच करें (Demo Personas)', 'Switch Citizen Demo Profile')}
            </h3>
            <p className="text-xs text-[#57534e]">
              {t('विभिन्न परिदृश्यों (लोन, वरासत, बहु-खाता) का परीक्षण करें:', 'Test different scenarios (Loan, Mutation, Multi-Khata):')}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 my-3">
          {demoUsers.map(user => {
            const isSelected = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#143d2b] bg-[#eef6f0] ring-1 ring-[#143d2b]'
                    : 'border-[#dfd8c7] bg-[#fbf9f4] hover:border-[#143d2b] hover:bg-[#faf7ee]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1c1917]">
                      {language === 'hi' ? user.nameHi : user.name}
                    </span>
                    {user.hasActiveMutation && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#fff7ed] text-[#9a3412] border border-[#ffedd5] uppercase tracking-wider">
                        {t('दाखिल-खारिज सक्रिय', 'Active Mutation')}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#57534e] mt-1 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#78716c]" />
                      {language === 'hi' ? user.villageHi : user.village}, {language === 'hi' ? user.tehsilHi : user.tehsil}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#78716c]">{t('खाता:', 'Khata:')} <span className="text-[#1c1917] font-bold">{user.khataNumbers.join(', ')}</span></span>
                    <span>•</span>
                    <span className="font-mono text-[#143d2b] font-bold">{user.totalAreaHectare} Ha</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                  ) : (
                    <button className="px-3 py-1 bg-[#ffffff] border border-[#dfd8c7] hover:bg-[#143d2b] hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider text-[#143d2b] transition-colors shadow-2xs">
                      {t('चुनें', 'Select')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowLoginModal(false)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#78716c] hover:text-[#1c1917]"
          >
            {t('रद्द करें', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

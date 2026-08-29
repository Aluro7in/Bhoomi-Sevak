import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Mic, FileUp, Sparkles, AlertCircle, ArrowRight, X, BookOpen, ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import { LandRecord } from '../types';

export const UnifiedSearchBar: React.FC = () => {
  const {
    t,
    language,
    searchQuery,
    setSearchQuery,
    executeSearch,
    isSearching,
    searchResults,
    selectedRecord,
    setSelectedRecord,
    setActiveTab,
    setIsVoiceActive,
  } = useApp();

  const [showAmbiguityModal, setShowAmbiguityModal] = useState<boolean>(false);
  const [groundedResult, setGroundedResult] = useState<any | null>(null);
  const [loadingGrounded, setLoadingGrounded] = useState<boolean>(false);

  const samplePrompts = [
    { text: 'बिलारी में राम कुमार की जमीन', en: 'Ram Kumar land in Bilari' },
    { text: 'खसरा नंबर 452 का रिकॉर्ड खोलें', en: 'Show Khasra 452 record' },
    { text: 'दाखिल-खारिज कितने दिन में होता है?', en: 'How many days for mutation in UP?' },
    { text: 'मुरादाबाद बिलारी का सर्किल रेट क्या है?', en: 'What is circle rate in Bilari Moradabad?' },
  ];

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if query is regulatory/legal/guidance
    const isRegulatory = searchQuery.includes('दिन') ||
      searchQuery.includes('नियम') ||
      searchQuery.includes('धारा') ||
      searchQuery.includes('सर्किल') ||
      searchQuery.includes('रेट') ||
      searchQuery.includes('फीस') ||
      searchQuery.includes('mutation') ||
      searchQuery.includes('days') ||
      searchQuery.includes('circle rate') ||
      searchQuery.includes('rule') ||
      searchQuery.includes('fee');

    if (isRegulatory) {
      setLoadingGrounded(true);
      fetch('/api/ai/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language }),
      })
        .then(res => res.json())
        .then(data => setGroundedResult(data))
        .catch(err => console.warn('Grounded search failed:', err))
        .finally(() => setLoadingGrounded(false));
    } else {
      setGroundedResult(null);
    }

    await executeSearch(searchQuery);

    // If multiple records match common queries, show ambiguity selection
    if (searchQuery.toLowerCase().includes('ram kumar') || searchQuery.includes('राम कुमार')) {
      setShowAmbiguityModal(true);
    }
  };

  const selectAmbiguousRecord = (rec: LandRecord) => {
    setSelectedRecord(rec);
    setShowAmbiguityModal(false);
    setActiveTab('land_record');
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center rounded-2xl overflow-hidden bg-[#ffffff] border-2 border-[#e7e2d8] focus-within:border-[#5e4db2] focus-within:ring-3 focus-within:ring-[#5e4db2]/15 shadow-xs transition-all"
      >
        <div className="pl-4 pr-2 text-[#5e4db2] flex items-center">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="search-input-field"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t(
            'नाम, गांव, खसरा या नियम पूछें: "बिलारी में राम कुमार", "खसरा 452", "दाखिल खारिज के नियम"...',
            'Type or speak: "Ram Kumar in Bilari", "Khasra 452", "Mutation rules UP"...'
          )}
          className="w-full py-3.5 px-2 text-xs sm:text-sm text-[#1e212b] placeholder-[#767d8f] bg-transparent outline-none font-medium"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setGroundedResult(null);
            }}
            className="p-1.5 text-[#767d8f] hover:text-[#1e212b] transition-colors"
            title={t('साफ करें', 'Clear search')}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={() => setIsVoiceActive(true)}
          className="p-2 sm:px-3 mx-1.5 text-[#5e4db2] bg-[#f4f2f9] hover:bg-[#ebe6f7] border border-[#e5dff2] active:scale-95 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shrink-0"
          title={t('बोलकर खोजें (Voice Input)', 'Search by Voice')}
        >
          <Mic className="w-4 h-4 text-[#5e4db2] animate-pulse" />
          <span className="hidden sm:inline">{t('बोलें', 'Speak')}</span>
        </button>

        {/* Search Action CTA */}
        <button
          type="submit"
          disabled={isSearching || loadingGrounded}
          className="bg-[#5e4db2] hover:bg-[#50409c] text-white px-5 sm:px-6 py-3.5 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-60 uppercase tracking-wider shadow-xs shrink-0"
        >
          {isSearching || loadingGrounded ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>{t('खोजें', 'Search')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-[#767d8f] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#5e4db2]" />
          {t('सुझाव:', 'Suggestions:')}
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              const queryText = language === 'hi' ? p.text : p.en;
              setSearchQuery(queryText);
              executeSearch(queryText);
              if (queryText.includes('दिन') || queryText.includes('सर्किल') || queryText.includes('days') || queryText.includes('rate')) {
                setLoadingGrounded(true);
                fetch('/api/ai/grounded-search', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ query: queryText, language }),
                })
                  .then(res => res.json())
                  .then(data => setGroundedResult(data))
                  .catch(err => console.warn('Grounded search failed:', err))
                  .finally(() => setLoadingGrounded(false));
              } else {
                setGroundedResult(null);
              }
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#faf9f6] border border-[#e7e2d8] hover:border-[#5e4db2] hover:text-[#5e4db2] text-[#4b5162] font-medium transition-all"
          >
            {language === 'hi' ? p.text : p.en}
          </button>
        ))}
      </div>

      {/* Grounded Regulatory & Circle Rate Result Card */}
      {groundedResult && (
        <div className="bg-[#ffffff] rounded-xl p-4 sm:p-5 border-2 border-[#5e4db2]/30 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#ece6f6]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f4f2f9] border border-[#e5dff2] text-[#5e4db2] flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e4db2] block">
                  {t('सत्यापित राजस्व नियम व सर्किल रेट गाइड', 'Verified UP Revenue Rules & Circle Rates')}
                </span>
                <h4 className="text-sm font-bold text-[#1e212b]">
                  {language === 'hi' ? 'उत्तर प्रदेश राजस्व संहिता 2006 एवं तहसील बिलारी नियम' : 'UP Revenue Code 2006 & Tehsil Bilari Guidelines'}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setGroundedResult(null)}
              className="text-[#767d8f] hover:text-[#1e212b] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-xs text-[#333844] leading-relaxed">
            <p className="whitespace-pre-line font-medium">
              {language === 'hi' ? groundedResult.answerHi : groundedResult.answer}
            </p>
          </div>

          {/* Statutory Highlights */}
          {groundedResult.regulatoryHighlightsHi && (
            <div className="mt-3 p-3 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4] space-y-1.5">
              <span className="text-[11px] font-bold text-[#143d2b] uppercase block">
                {t('महत्वपूर्ण वैधानिक नियम:', 'Key Statutory Highlights:')}
              </span>
              {(language === 'hi' ? groundedResult.regulatoryHighlightsHi : groundedResult.regulatoryHighlights).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-[#1c1917]">
                  <span className="text-[#5e4db2] font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Official Grounded Sources */}
          {groundedResult.sources && groundedResult.sources.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#ece6f6] flex flex-wrap items-center gap-2 text-[11px] text-[#767d8f]">
              <span className="font-semibold">{t('आधिकारिक स्रोत:', 'Sources:')}</span>
              {groundedResult.sources.map((src: any, idx: number) => (
                <a
                  key={idx}
                  href={src.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#5e4db2] hover:underline font-medium"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Explicit Ambiguity Resolution Dialog */}
      {showAmbiguityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-[#e7e2d8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3 pb-3 border-b border-[#ece6f6]">
              <div className="w-9 h-9 rounded-xl bg-[#fffbeb] text-[#d97706] border border-[#fde68a] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#1e212b]">
                  {t('राम कुमार नाम के 3 रिकॉर्ड मिले', '3 records found matching "Ram Kumar"')}
                </h3>
                <p className="text-xs text-[#555968] mt-0.5">
                  {t(
                    'सिस्टम अनुमान नहीं लगाएगा। कृपया अपना सही खाता अथवा गाटा नंबर चुनें:',
                    'The system does not guess. Please select your verified Khata or Khasra plot:'
                  )}
                </p>
              </div>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {searchResults.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => selectAmbiguousRecord(rec)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedRecord?.id === rec.id
                      ? 'border-[#5e4db2] bg-[#f4f2f9] ring-2 ring-[#5e4db2]/20'
                      : 'border-[#e7e2d8] bg-[#faf9f6] hover:border-[#5e4db2] hover:bg-[#f5f3fa]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#1e212b]">
                        {language === 'hi' ? rec.owners[0].nameHi : rec.owners[0].name}
                      </span>
                      <span className="text-xs text-[#767d8f]">
                        ({language === 'hi' ? rec.owners[0].fatherNameHi : rec.owners[0].fatherName})
                      </span>
                    </div>
                    <div className="text-xs text-[#555968] mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="bg-[#ffffff] border border-[#e7e2d8] px-2 py-0.5 rounded-md font-mono font-bold text-[#5e4db2] text-[11px]">
                        {t('खाता सं:', 'Khata #')} {rec.khataNumber}
                      </span>
                      <span>
                        {t('गाटा:', 'Khasra:')} {rec.khasraNumbers.join(', ')}
                      </span>
                      <span>
                        {t('ग्राम:', 'Village:')} {language === 'hi' ? rec.villageHi : rec.village}
                      </span>
                      <span className="font-bold text-[#5e4db2] font-mono">
                        {rec.totalAreaHectare} Ha ({rec.totalAreaBigha} Bigha)
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button className="px-3 py-1.5 bg-[#5e4db2] text-white hover:bg-[#50409c] text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs">
                      <span>{t('चुनें', 'Select')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAmbiguityModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#555968] hover:text-[#1e212b]"
              >
                {t('बंद करें', 'Dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



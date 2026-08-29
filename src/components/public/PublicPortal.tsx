import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { PublicHomePage } from './PublicHomePage';
import { PublicAboutPage } from './PublicAboutPage';
import { PublicServicesPage } from './PublicServicesPage';
import { PublicHowItWorksPage } from './PublicHowItWorksPage';
import { PublicCitizenGuidePage } from './PublicCitizenGuidePage';
import { PublicFAQPage } from './PublicFAQPage';
import { PublicTrustPage } from './PublicTrustPage';
import { PublicLoginPage } from './PublicLoginPage';

export const PublicPortal: React.FC = () => {
  const { publicPage } = useApp();

  // Scroll to top whenever the active public page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [publicPage]);

  const renderActivePublicPage = () => {
    switch (publicPage) {
      case 'home':
        return <PublicHomePage />;
      case 'about':
        return <PublicAboutPage />;
      case 'services':
        return <PublicServicesPage />;
      case 'how_it_works':
        return <PublicHowItWorksPage />;
      case 'citizen_guide':
        return <PublicCitizenGuidePage />;
      case 'faq':
        return <PublicFAQPage />;
      case 'trust':
        return <PublicTrustPage />;
      case 'login':
        return <PublicLoginPage />;
      default:
        return <PublicHomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c1917] antialiased">
      <PublicHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-6" id="public-main-content">
        {renderActivePublicPage()}
      </main>
      <PublicFooter />
    </div>
  );
};

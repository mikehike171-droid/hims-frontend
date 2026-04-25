import React, { createContext, useContext, useEffect, useState } from 'react';

import { translations } from './translations';

// Supported languages for the dynamic tool
export type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Check for saved preference in localStorage
      const saved = localStorage.getItem('language') as Language | null;
      if (saved && ['en', 'hi', 'te'].includes(saved)) {
        setLanguageState(saved);
        return;
      }

      // 2. Detect language from browser
      const browserLangs = navigator.languages || [navigator.language];
      for (const lang of browserLangs) {
        const baseLang = lang.split('-')[0];
        if (baseLang === 'hi') { setLanguageState('hi'); return; }
        if (baseLang === 'te') { setLanguageState('te'); return; }
        if (baseLang === 'en') { setLanguageState('en'); return; }
      }
    }
  }, []);

  useEffect(() => {
    const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    if (isAdmin) {
      // Force English for admin pages by clearing the Google Translate cookie
      document.cookie = "googtrans=; path=/";
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}`;
      if (document.documentElement.lang !== 'en') {
        document.documentElement.lang = 'en';
      }
      return;
    }

    if (language) {
      // Save language to localStorage whenever it changes
      localStorage.setItem('language', language);

      // Set the Google Translate cookie
      const cookieValue = language === 'en' ? '' : `/en/${language}`;
      document.cookie = `googtrans=${cookieValue}; path=/`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;

      // Update HTML lang attribute
      if (document.documentElement.lang !== language) {
        document.documentElement.lang = language;
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // We reload to ensure Google Translate picks up the cookie change accurately
    window.location.reload();
  };

  // The 't' function checks our manual translation map first.
  // If not found, it returns the text directly, and Google Translate tool handles it.
  const t = (keyOrText: string): string => {
    if (translations[language] && translations[language][keyOrText]) {
      return translations[language][keyOrText];
    }
    return keyOrText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

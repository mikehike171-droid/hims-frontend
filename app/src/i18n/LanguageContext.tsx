import React, { createContext, useContext, useEffect, useState } from 'react';

// Supported languages for the dynamic tool
export type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // 1. Check for saved preference in localStorage
      const saved = localStorage.getItem('language') as Language | null;
      if (saved && ['en', 'hi', 'te'].includes(saved)) {
        return saved;
      }

      // 2. Detect language from browser
      const browserLangs = navigator.languages || [navigator.language];
      for (const lang of browserLangs) {
        const baseLang = lang.split('-')[0];
        if (baseLang === 'hi') return 'hi';
        if (baseLang === 'te') return 'te';
        if (baseLang === 'en') return 'en';
      }
    }

    return 'en';
  });

  useEffect(() => {
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
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // We reload to ensure Google Translate picks up the cookie change accurately
    window.location.reload();
  };

  // The 't' function now just returns the text directly,
  // as the Google Translate tool will handle the DOM translation.
  const t = (keyOrText: string): string => {
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

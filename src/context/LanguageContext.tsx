import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '@/translations/en.json';
import te from '@/translations/te.json';
import hi from '@/translations/hi.json';
import ta from '@/translations/ta.json';

type Language = 'en' | 'te' | 'hi' | 'ta';

const translations: Record<Language, typeof en> = { en, te, hi, ta };

export const languageNames: Record<Language, string> = {
  en: 'English',
  te: 'తెలుగు',
  hi: 'हिंदी',
  ta: 'தமிழ்',
};

export const speechLangCodes: Record<Language, string> = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

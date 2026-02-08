'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'language-preference';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('sv');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'sv') {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let value = translations[language]?.[key] ?? translations.en[key] ?? key;
      if (params) {
        for (const [param, replacement] of Object.entries(params)) {
          value = value.replace(`{${param}}`, replacement);
        }
      }
      return value;
    },
    [language]
  );

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

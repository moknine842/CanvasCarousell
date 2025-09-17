import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, languages, setLanguage, getCurrentLanguage, initializeLanguage, t } from './index';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<Language>(() => {
    // Initialize language synchronously during state initialization
    const saved = localStorage.getItem('game-language') as Language;
    const browserLang = navigator.language.substring(0, 2) as Language;
    const lang = saved || (Object.keys(languages).includes(browserLang) ? browserLang : 'en');
    setLanguage(lang); // Set it in the global state too
    return lang;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context) return context;
  
  // Fallback when context is undefined (e.g., duplicate module instances)
  return { 
    language: getCurrentLanguage(), 
    setLanguage, 
    t 
  };
};
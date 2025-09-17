import { translations } from './translations';

export type Language = 'en' | 'fr' | 'es' | 'it' | 'zh' | 'ar' | 'ru';

export const languages: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español', 
  it: 'Italiano',
  zh: '中文',
  ar: 'العربية',
  ru: 'Русский'
};

export const isRTL = (lang: Language): boolean => lang === 'ar';

let currentLanguage: Language = 'en';

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  localStorage.setItem('game-language', lang);
  
  // Update document direction for RTL languages
  document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const getCurrentLanguage = (): Language => currentLanguage;

export const initializeLanguage = (): void => {
  const saved = localStorage.getItem('game-language') as Language;
  const browserLang = navigator.language.substring(0, 2) as Language;
  
  const lang = saved || (Object.keys(languages).includes(browserLang) ? browserLang : 'en');
  setLanguage(lang);
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
    return key;
  }
  
  if (!params) return value;
  
  return value.replace(/\{(\w+)\}/g, (match, param) => {
    return params[param]?.toString() || match;
  });
};

export const translateWord = (word: string): string => {
  const langTranslations = translations[currentLanguage];
  const wordTranslations = (langTranslations as any)?.words;
  if (wordTranslations && wordTranslations[word]) {
    return wordTranslations[word];
  }
  // Fallback to original English word if no translation available
  return word;
};
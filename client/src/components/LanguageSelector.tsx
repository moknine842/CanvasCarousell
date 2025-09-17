import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../lib/i18n/context';
import { languages, Language } from '../lib/i18n/index';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = "absolute top-4 left-4 z-50" 
}) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 px-3 py-2">
        <Globe className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer min-w-0"
          style={{ minWidth: '80px' }}
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  const handleToggle = () => {
    console.log('Toggle button clicked, current language:', language);
    toggleLanguage();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg bg-green-800 hover:bg-green-900 text-white"
        title={language === 'en' ? 'Switch to Tagalog' : 'Switch to English'}
        aria-label={language === 'en' ? 'Switch to Tagalog' : 'Switch to English'}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-bold">
          {language === 'en' ? 'EN' : 'TL'}
        </span>
        <span className="text-xs">
          {language === 'en' ? '→ TL' : '→ EN'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
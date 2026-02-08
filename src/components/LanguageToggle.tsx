'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded-lg border border-gray-200 p-1 dark:border-gray-600">
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('sv')}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          language === 'sv'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        SV
      </button>
    </div>
  );
}

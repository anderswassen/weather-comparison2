'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const SECTION_COUNT = 6;

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t('guide.openAria')}
        title={t('guide.titleAttr')}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('guide.title')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('guide.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    aria-label={t('guide.closeAria')}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-4 text-left" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="space-y-6">
                {Array.from({ length: SECTION_COUNT }, (_, i) => i + 1).map((index) => (
                  <div key={index}>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {index}
                      </span>
                      {t(`guide.section${index}.title`)}
                    </h3>
                    <p className="whitespace-pre-line pl-8 text-left text-gray-600 dark:text-gray-300">
                      {t(`guide.section${index}.content`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                {t('guide.gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

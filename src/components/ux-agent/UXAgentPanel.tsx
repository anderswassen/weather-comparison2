'use client';

import { useUXAgentContext } from '@/context/UXAgentContext';
import { useLanguage } from '@/context/LanguageContext';
import { UXAgentChat } from './UXAgentChat';
import { UXAgentRecommendations } from './UXAgentRecommendations';
import { UXAgentKnowledgeBrowser } from './UXAgentKnowledgeBrowser';
import { ActiveTab } from '@/hooks/useUXAgent';

const TABS: { key: ActiveTab; labelKey: string }[] = [
  { key: 'chat', labelKey: 'uxAgent.tabChat' },
  { key: 'recommendations', labelKey: 'uxAgent.tabRecommendations' },
  { key: 'knowledge', labelKey: 'uxAgent.tabKnowledge' },
];

export function UXAgentPanel() {
  const { isOpen, closePanel, activeTab, setActiveTab } = useUXAgentContext();
  const { t } = useLanguage();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closePanel}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-900 sm:w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {t('uxAgent.panelTitle')}
            </h2>
          </div>
          <button
            onClick={closePanel}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label={t('uxAgent.close')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <UXAgentChat />}
          {activeTab === 'recommendations' && <UXAgentRecommendations />}
          {activeTab === 'knowledge' && <UXAgentKnowledgeBrowser />}
        </div>
      </div>
    </>
  );
}

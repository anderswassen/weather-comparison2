'use client';

import { useUXAgentContext } from '@/context/UXAgentContext';
import { useLanguage } from '@/context/LanguageContext';

export function UXAgentResearchStatus() {
  const { isAnalyzing, isResearching } = useUXAgentContext();
  const { t } = useLanguage();

  if (!isAnalyzing && !isResearching) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {isAnalyzing
          ? t('uxAgent.chat.analyzing')
          : t('uxAgent.chat.researching')}
      </span>
    </div>
  );
}

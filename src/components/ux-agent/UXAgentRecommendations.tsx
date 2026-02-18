'use client';

import { useUXAgentContext } from '@/context/UXAgentContext';
import { useLanguage } from '@/context/LanguageContext';
import { Severity, UXCategory } from '@/lib/ux-agent/types';

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; icon: string }> = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    icon: '!',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: '!',
  },
  suggestion: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'i',
  },
  info: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    icon: '\u2713',
  },
};

const CATEGORY_LABELS: Record<UXCategory, string> = {
  accessibility: 'uxAgent.cat.accessibility',
  navigation: 'uxAgent.cat.navigation',
  'visual-design': 'uxAgent.cat.visualDesign',
  performance: 'uxAgent.cat.performance',
  mobile: 'uxAgent.cat.mobile',
  'data-visualization': 'uxAgent.cat.dataViz',
};

export function UXAgentRecommendations() {
  const { recommendations, runAnalysis, isAnalyzing } = useUXAgentContext();
  const { t } = useLanguage();

  if (!recommendations) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-4xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('uxAgent.rec.noRecommendations')}
        </p>
        <button
          onClick={() => runAnalysis()}
          disabled={isAnalyzing}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isAnalyzing ? t('uxAgent.chat.analyzing') : t('uxAgent.rec.runAnalysis')}
        </button>
      </div>
    );
  }

  const { overallScore, scores, recommendations: recs } = recommendations;
  const issues = recs.filter((r) => !r.passed);
  const passes = recs.filter((r) => r.passed);

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Overall Score */}
      <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 p-4 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('uxAgent.rec.overallScore')}
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {overallScore}<span className="text-lg text-gray-400">/100</span>
            </p>
          </div>
          <button
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {t('uxAgent.rec.rerun')}
          </button>
        </div>

        {/* Category Scores */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.entries(scores) as [UXCategory, number][]).map(
            ([cat, score]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-1.5 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-gray-500 dark:text-gray-400">
                  {t(CATEGORY_LABELS[cat])}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('uxAgent.rec.issues')} ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.map((rec) => {
              const style = SEVERITY_STYLES[rec.severity];
              return (
                <div
                  key={rec.id}
                  className={`rounded-lg p-3 ${style.bg}`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.text} bg-white dark:bg-gray-900`}
                    >
                      {style.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${style.text}`}>
                          {t(rec.titleKey)}
                        </span>
                        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          {t(CATEGORY_LABELS[rec.category])}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {t(rec.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Passes */}
      {passes.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('uxAgent.rec.passes')} ({passes.length})
          </h3>
          <div className="space-y-1">
            {passes.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center gap-2 rounded-lg p-2"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  {'\u2713'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t(rec.titleKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

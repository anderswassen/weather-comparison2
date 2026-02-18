'use client';

import { useState, useMemo } from 'react';
import { useUXAgentContext } from '@/context/UXAgentContext';
import { useLanguage } from '@/context/LanguageContext';
import { UXCategory } from '@/lib/ux-agent/types';

const CATEGORIES: Array<{ key: string; labelKey: string }> = [
  { key: 'all', labelKey: 'uxAgent.kb.filterAll' },
  { key: 'navigation', labelKey: 'uxAgent.cat.navigation' },
  { key: 'accessibility', labelKey: 'uxAgent.cat.accessibility' },
  { key: 'visual-design', labelKey: 'uxAgent.cat.visualDesign' },
  { key: 'performance', labelKey: 'uxAgent.cat.performance' },
  { key: 'mobile', labelKey: 'uxAgent.cat.mobile' },
  { key: 'data-visualization', labelKey: 'uxAgent.cat.dataViz' },
];

const SOURCE_BADGES: Record<string, { label: string; className: string }> = {
  'built-in': {
    label: 'uxAgent.kb.source.builtIn',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  'web-research': {
    label: 'uxAgent.kb.source.webResearch',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  'app-analysis': {
    label: 'uxAgent.kb.source.appAnalysis',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
};

export function UXAgentKnowledgeBrowser() {
  const { knowledge, runResearch, isResearching } = useUXAgentContext();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return knowledge;
    return knowledge.filter((e) => e.category === selectedCategory);
  }, [knowledge, selectedCategory]);

  const webResearchCount = knowledge.filter(
    (e) => e.source === 'web-research',
  ).length;

  return (
    <div className="flex h-full flex-col">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 border-b border-gray-200 px-4 py-2.5 dark:border-gray-700">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Research Button */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} {t('uxAgent.kb.entries')}
          {webResearchCount > 0 && ` (${webResearchCount} ${t('uxAgent.kb.fromWeb')})`}
        </span>
        <button
          onClick={() =>
            runResearch(
              selectedCategory !== 'all' ? selectedCategory : undefined,
            )
          }
          disabled={isResearching}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isResearching ? t('uxAgent.chat.researching') : t('uxAgent.kb.researchMore')}
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('uxAgent.kb.empty')}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => {
              const isExpanded = expandedId === entry.id;
              const sourceBadge = SOURCE_BADGES[entry.source];

              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-gray-200 bg-white transition-colors dark:border-gray-700 dark:bg-gray-800"
                >
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : entry.id)
                    }
                    className="flex w-full items-start gap-2 p-3 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {entry.title}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${sourceBadge?.className || ''}`}
                        >
                          {sourceBadge ? t(sourceBadge.label) : entry.source}
                        </span>
                      </div>
                      {!isExpanded && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                          {entry.description}
                        </p>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-700">
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        {entry.description}
                      </p>
                      {entry.recommendation && (
                        <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {entry.recommendation}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {/* Confidence bar */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400">
                            {t('uxAgent.kb.confidence')}
                          </span>
                          <div className="h-1 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-1 rounded-full bg-blue-500"
                              style={{
                                width: `${entry.confidence * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Tags */}
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {/* Source URL */}
                        {entry.sourceUrl && (
                          <a
                            href={entry.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-500 hover:underline"
                          >
                            {t('uxAgent.kb.viewSource')}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

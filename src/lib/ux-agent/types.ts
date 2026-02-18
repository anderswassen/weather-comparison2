export type UXCategory =
  | 'navigation'
  | 'visual-design'
  | 'accessibility'
  | 'performance'
  | 'mobile'
  | 'data-visualization';

export type Severity = 'info' | 'suggestion' | 'warning' | 'critical';

// --- Knowledge Base ---

export interface UXKnowledgeEntry {
  id: string;
  category: UXCategory;
  title: string;
  description: string;
  source: 'built-in' | 'web-research' | 'app-analysis';
  sourceUrl?: string;
  confidence: number; // 0.0 to 1.0
  dateAdded: string; // ISO 8601
  tags: string[];
  actionable: boolean;
  recommendation?: string;
}

export interface UXKnowledgeFile {
  version: 1;
  lastUpdated: string;
  entries: UXKnowledgeEntry[];
}

// --- Analysis Engine ---

export interface AppContext {
  hasAriaLabels: boolean;
  hasDarkMode: boolean;
  hasKeyboardNav: boolean;
  hasFocusIndicators: boolean;
  hasLoadingStates: boolean;
  hasErrorStates: boolean;
  hasResponsiveLayout: boolean;
  hasLazyLoading: boolean;
  hasDebouncedSearch: boolean;
  hasParallelFetch: boolean;
  hasI18n: boolean;
  hasSkeletonLoading: boolean;
  hasTooltips: boolean;
  hasChartLegends: boolean;
  hasChartAxisLabels: boolean;
  hasTouchTargets: boolean;
  hasMobileLayout: boolean;
  hasShareFeature: boolean;
  hasUserGuide: boolean;
  hasConsistentSpacing: boolean;
  hasColorBlindSafePalette: boolean;
  hasAnimations: boolean;
  hasFeedbackStates: boolean;
  hasSemanticHTML: boolean;
  componentCount: number;
}

export interface AnalysisRule {
  id: string;
  category: UXCategory;
  name: string;
  evaluate: (appContext: AppContext) => RuleResult;
}

export interface RuleResult {
  passed: boolean;
  score: number; // 0-100
  severity: Severity;
  recommendationKey: string; // Translation key
  recommendationParams: Record<string, string>;
}

export interface AppAnalysisResult {
  timestamp: string;
  scores: Record<UXCategory, number>; // 0-100 per category
  overallScore: number;
  recommendations: UXRecommendation[];
}

export interface UXRecommendation {
  id: string;
  category: UXCategory;
  severity: Severity;
  titleKey: string;
  descriptionKey: string;
  passed: boolean;
  score: number;
}

// --- Chat Engine ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: string;
  relatedRecommendations?: string[];
}

export type UserIntent =
  | 'ask-accessibility'
  | 'ask-navigation'
  | 'ask-dark-mode'
  | 'ask-charts'
  | 'ask-mobile'
  | 'ask-performance'
  | 'ask-how-to-compare'
  | 'ask-how-to-share'
  | 'ask-how-to-favorites'
  | 'ask-how-to-historical'
  | 'ask-general-ux'
  | 'ask-what-is-this'
  | 'trigger-analysis'
  | 'trigger-research'
  | 'unknown';

// --- Web Research ---

export interface CuratedSource {
  name: string;
  baseUrl: string;
  rssUrl?: string;
  categories: UXCategory[];
  reliability: number; // 0.0-1.0
}

export interface ExtractedInsight {
  text: string;
  category: UXCategory;
  confidence: number;
  tags: string[];
  sourceUrl: string;
  title: string;
}

export interface WebResearchResult {
  source: string;
  insights: ExtractedInsight[];
  status: 'success' | 'failed';
  error?: string;
}

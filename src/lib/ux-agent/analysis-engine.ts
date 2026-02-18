import {
  AppContext,
  AppAnalysisResult,
  UXCategory,
  UXRecommendation,
} from './types';
import { ANALYSIS_RULES } from './analysis-rules';

const ALL_CATEGORIES: UXCategory[] = [
  'accessibility',
  'navigation',
  'visual-design',
  'performance',
  'mobile',
  'data-visualization',
];

/**
 * Build the app context based on known properties of the Weather Compare app.
 * This is a static analysis snapshot, not a runtime DOM inspection.
 */
export function buildAppContext(): AppContext {
  return {
    hasAriaLabels: true, // Buttons have aria-label and title attributes
    hasDarkMode: true, // Full dark mode via ThemeContext + dark: classes
    hasKeyboardNav: true, // Interactive elements are native buttons/inputs
    hasFocusIndicators: true, // focus:ring-2 on buttons and inputs
    hasLoadingStates: true, // Loading spinner + disabled state during fetch
    hasErrorStates: true, // Error banner with styled message
    hasResponsiveLayout: true, // md: and lg: breakpoints throughout
    hasLazyLoading: true, // LocationMap uses dynamic() import
    hasDebouncedSearch: true, // LocationAutocomplete has 300ms debounce
    hasParallelFetch: true, // useWeatherComparison uses Promise.all
    hasI18n: true, // LanguageContext with EN/SV translations
    hasSkeletonLoading: true, // ChartSkeletonGrid component
    hasTooltips: true, // Recharts Tooltip on all charts
    hasChartLegends: true, // Custom legend renderer in WeatherChart
    hasChartAxisLabels: true, // XAxis/YAxis with labels and units
    hasTouchTargets: true, // Buttons are py-3 px-8 (adequate size)
    hasMobileLayout: true, // Grid stacks to single column on small screens
    hasShareFeature: true, // URL-based sharing with copy button
    hasUserGuide: true, // UserGuide modal component
    hasConsistentSpacing: true, // Consistent Tailwind spacing scale
    hasColorBlindSafePalette: false, // Uses blue/red which is okay, but no pattern distinction
    hasAnimations: true, // animate-spin, animate-pulse, transition-colors
    hasFeedbackStates: true, // "Copied!" feedback, loading states
    hasSemanticHTML: true, // header, footer, main semantic elements
    componentCount: 11, // Number of component files
  };
}

/**
 * Run the UX analysis engine against the app context.
 * Returns scored results per category and individual recommendations.
 */
export function analyzeAppUX(
  appContext: AppContext = buildAppContext(),
): AppAnalysisResult {
  const recommendations: UXRecommendation[] = [];
  const categoryScores: Record<UXCategory, number[]> = {
    accessibility: [],
    navigation: [],
    'visual-design': [],
    performance: [],
    mobile: [],
    'data-visualization': [],
  };

  for (const rule of ANALYSIS_RULES) {
    const result = rule.evaluate(appContext);
    categoryScores[rule.category].push(result.score);

    recommendations.push({
      id: rule.id,
      category: rule.category,
      severity: result.severity,
      titleKey: `uxAgent.rule.${rule.id}.title`,
      descriptionKey: result.recommendationKey,
      passed: result.passed,
      score: result.score,
    });
  }

  // Compute average scores per category
  const scores = {} as Record<UXCategory, number>;
  for (const cat of ALL_CATEGORIES) {
    const catScores = categoryScores[cat];
    scores[cat] =
      catScores.length > 0
        ? Math.round(
            catScores.reduce((a, b) => a + b, 0) / catScores.length,
          )
        : 0;
  }

  // Overall score is weighted average of all categories
  const allScores = Object.values(scores);
  const overallScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

  return {
    timestamp: new Date().toISOString(),
    scores,
    overallScore,
    recommendations,
  };
}

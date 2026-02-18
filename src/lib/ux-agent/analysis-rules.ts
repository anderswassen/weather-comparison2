import { AnalysisRule } from './types';

/**
 * Rule-based UX analysis heuristics for the Weather Compare app.
 * Each rule evaluates a known property of the app and produces a
 * score + recommendation. Modeled after the insights.ts pattern.
 */
export const ANALYSIS_RULES: AnalysisRule[] = [
  // --- Accessibility ---
  {
    id: 'a11y-aria-labels',
    category: 'accessibility',
    name: 'ARIA Labels',
    evaluate: (ctx) => ({
      passed: ctx.hasAriaLabels,
      score: ctx.hasAriaLabels ? 100 : 30,
      severity: ctx.hasAriaLabels ? 'info' : 'warning',
      recommendationKey: ctx.hasAriaLabels
        ? 'uxAgent.rule.ariaLabels.pass'
        : 'uxAgent.rule.ariaLabels.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'a11y-focus-indicators',
    category: 'accessibility',
    name: 'Focus Indicators',
    evaluate: (ctx) => ({
      passed: ctx.hasFocusIndicators,
      score: ctx.hasFocusIndicators ? 100 : 20,
      severity: ctx.hasFocusIndicators ? 'info' : 'critical',
      recommendationKey: ctx.hasFocusIndicators
        ? 'uxAgent.rule.focusIndicators.pass'
        : 'uxAgent.rule.focusIndicators.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'a11y-keyboard-nav',
    category: 'accessibility',
    name: 'Keyboard Navigation',
    evaluate: (ctx) => ({
      passed: ctx.hasKeyboardNav,
      score: ctx.hasKeyboardNav ? 100 : 25,
      severity: ctx.hasKeyboardNav ? 'info' : 'warning',
      recommendationKey: ctx.hasKeyboardNav
        ? 'uxAgent.rule.keyboardNav.pass'
        : 'uxAgent.rule.keyboardNav.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'a11y-semantic-html',
    category: 'accessibility',
    name: 'Semantic HTML',
    evaluate: (ctx) => ({
      passed: ctx.hasSemanticHTML,
      score: ctx.hasSemanticHTML ? 100 : 40,
      severity: ctx.hasSemanticHTML ? 'info' : 'suggestion',
      recommendationKey: ctx.hasSemanticHTML
        ? 'uxAgent.rule.semanticHTML.pass'
        : 'uxAgent.rule.semanticHTML.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'a11y-color-blind',
    category: 'accessibility',
    name: 'Color-Blind Safe Palette',
    evaluate: (ctx) => ({
      passed: ctx.hasColorBlindSafePalette,
      score: ctx.hasColorBlindSafePalette ? 100 : 50,
      severity: ctx.hasColorBlindSafePalette ? 'info' : 'suggestion',
      recommendationKey: ctx.hasColorBlindSafePalette
        ? 'uxAgent.rule.colorBlind.pass'
        : 'uxAgent.rule.colorBlind.fail',
      recommendationParams: {},
    }),
  },

  // --- Navigation ---
  {
    id: 'nav-user-guide',
    category: 'navigation',
    name: 'User Guide Available',
    evaluate: (ctx) => ({
      passed: ctx.hasUserGuide,
      score: ctx.hasUserGuide ? 100 : 40,
      severity: ctx.hasUserGuide ? 'info' : 'suggestion',
      recommendationKey: ctx.hasUserGuide
        ? 'uxAgent.rule.userGuide.pass'
        : 'uxAgent.rule.userGuide.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'nav-share-feature',
    category: 'navigation',
    name: 'Share Feature',
    evaluate: (ctx) => ({
      passed: ctx.hasShareFeature,
      score: ctx.hasShareFeature ? 100 : 50,
      severity: ctx.hasShareFeature ? 'info' : 'suggestion',
      recommendationKey: ctx.hasShareFeature
        ? 'uxAgent.rule.shareFeature.pass'
        : 'uxAgent.rule.shareFeature.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'nav-i18n',
    category: 'navigation',
    name: 'Internationalization',
    evaluate: (ctx) => ({
      passed: ctx.hasI18n,
      score: ctx.hasI18n ? 100 : 30,
      severity: ctx.hasI18n ? 'info' : 'warning',
      recommendationKey: ctx.hasI18n
        ? 'uxAgent.rule.i18n.pass'
        : 'uxAgent.rule.i18n.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'nav-error-states',
    category: 'navigation',
    name: 'Error State Handling',
    evaluate: (ctx) => ({
      passed: ctx.hasErrorStates,
      score: ctx.hasErrorStates ? 100 : 20,
      severity: ctx.hasErrorStates ? 'info' : 'critical',
      recommendationKey: ctx.hasErrorStates
        ? 'uxAgent.rule.errorStates.pass'
        : 'uxAgent.rule.errorStates.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'nav-feedback-states',
    category: 'navigation',
    name: 'User Feedback States',
    evaluate: (ctx) => ({
      passed: ctx.hasFeedbackStates,
      score: ctx.hasFeedbackStates ? 100 : 40,
      severity: ctx.hasFeedbackStates ? 'info' : 'suggestion',
      recommendationKey: ctx.hasFeedbackStates
        ? 'uxAgent.rule.feedbackStates.pass'
        : 'uxAgent.rule.feedbackStates.fail',
      recommendationParams: {},
    }),
  },

  // --- Visual Design ---
  {
    id: 'vd-dark-mode',
    category: 'visual-design',
    name: 'Dark Mode Support',
    evaluate: (ctx) => ({
      passed: ctx.hasDarkMode,
      score: ctx.hasDarkMode ? 100 : 50,
      severity: ctx.hasDarkMode ? 'info' : 'suggestion',
      recommendationKey: ctx.hasDarkMode
        ? 'uxAgent.rule.darkMode.pass'
        : 'uxAgent.rule.darkMode.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'vd-consistent-spacing',
    category: 'visual-design',
    name: 'Consistent Spacing',
    evaluate: (ctx) => ({
      passed: ctx.hasConsistentSpacing,
      score: ctx.hasConsistentSpacing ? 100 : 60,
      severity: ctx.hasConsistentSpacing ? 'info' : 'suggestion',
      recommendationKey: ctx.hasConsistentSpacing
        ? 'uxAgent.rule.consistentSpacing.pass'
        : 'uxAgent.rule.consistentSpacing.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'vd-animations',
    category: 'visual-design',
    name: 'Animations and Transitions',
    evaluate: (ctx) => ({
      passed: ctx.hasAnimations,
      score: ctx.hasAnimations ? 100 : 70,
      severity: ctx.hasAnimations ? 'info' : 'info',
      recommendationKey: ctx.hasAnimations
        ? 'uxAgent.rule.animations.pass'
        : 'uxAgent.rule.animations.fail',
      recommendationParams: {},
    }),
  },

  // --- Performance ---
  {
    id: 'perf-lazy-loading',
    category: 'performance',
    name: 'Lazy Loading',
    evaluate: (ctx) => ({
      passed: ctx.hasLazyLoading,
      score: ctx.hasLazyLoading ? 100 : 40,
      severity: ctx.hasLazyLoading ? 'info' : 'warning',
      recommendationKey: ctx.hasLazyLoading
        ? 'uxAgent.rule.lazyLoading.pass'
        : 'uxAgent.rule.lazyLoading.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'perf-skeleton-loading',
    category: 'performance',
    name: 'Skeleton Loading States',
    evaluate: (ctx) => ({
      passed: ctx.hasSkeletonLoading,
      score: ctx.hasSkeletonLoading ? 100 : 50,
      severity: ctx.hasSkeletonLoading ? 'info' : 'suggestion',
      recommendationKey: ctx.hasSkeletonLoading
        ? 'uxAgent.rule.skeletonLoading.pass'
        : 'uxAgent.rule.skeletonLoading.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'perf-loading-states',
    category: 'performance',
    name: 'Loading Indicators',
    evaluate: (ctx) => ({
      passed: ctx.hasLoadingStates,
      score: ctx.hasLoadingStates ? 100 : 30,
      severity: ctx.hasLoadingStates ? 'info' : 'warning',
      recommendationKey: ctx.hasLoadingStates
        ? 'uxAgent.rule.loadingStates.pass'
        : 'uxAgent.rule.loadingStates.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'perf-debounced-search',
    category: 'performance',
    name: 'Debounced Search Input',
    evaluate: (ctx) => ({
      passed: ctx.hasDebouncedSearch,
      score: ctx.hasDebouncedSearch ? 100 : 40,
      severity: ctx.hasDebouncedSearch ? 'info' : 'warning',
      recommendationKey: ctx.hasDebouncedSearch
        ? 'uxAgent.rule.debouncedSearch.pass'
        : 'uxAgent.rule.debouncedSearch.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'perf-parallel-fetch',
    category: 'performance',
    name: 'Parallel Data Fetching',
    evaluate: (ctx) => ({
      passed: ctx.hasParallelFetch,
      score: ctx.hasParallelFetch ? 100 : 50,
      severity: ctx.hasParallelFetch ? 'info' : 'suggestion',
      recommendationKey: ctx.hasParallelFetch
        ? 'uxAgent.rule.parallelFetch.pass'
        : 'uxAgent.rule.parallelFetch.fail',
      recommendationParams: {},
    }),
  },

  // --- Mobile ---
  {
    id: 'mobile-responsive',
    category: 'mobile',
    name: 'Responsive Layout',
    evaluate: (ctx) => ({
      passed: ctx.hasResponsiveLayout,
      score: ctx.hasResponsiveLayout ? 100 : 20,
      severity: ctx.hasResponsiveLayout ? 'info' : 'critical',
      recommendationKey: ctx.hasResponsiveLayout
        ? 'uxAgent.rule.responsiveLayout.pass'
        : 'uxAgent.rule.responsiveLayout.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'mobile-touch-targets',
    category: 'mobile',
    name: 'Touch Target Size',
    evaluate: (ctx) => ({
      passed: ctx.hasTouchTargets,
      score: ctx.hasTouchTargets ? 100 : 40,
      severity: ctx.hasTouchTargets ? 'info' : 'warning',
      recommendationKey: ctx.hasTouchTargets
        ? 'uxAgent.rule.touchTargets.pass'
        : 'uxAgent.rule.touchTargets.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'mobile-layout',
    category: 'mobile',
    name: 'Mobile-Specific Layout',
    evaluate: (ctx) => ({
      passed: ctx.hasMobileLayout,
      score: ctx.hasMobileLayout ? 100 : 50,
      severity: ctx.hasMobileLayout ? 'info' : 'suggestion',
      recommendationKey: ctx.hasMobileLayout
        ? 'uxAgent.rule.mobileLayout.pass'
        : 'uxAgent.rule.mobileLayout.fail',
      recommendationParams: {},
    }),
  },

  // --- Data Visualization ---
  {
    id: 'dataviz-tooltips',
    category: 'data-visualization',
    name: 'Chart Tooltips',
    evaluate: (ctx) => ({
      passed: ctx.hasTooltips,
      score: ctx.hasTooltips ? 100 : 40,
      severity: ctx.hasTooltips ? 'info' : 'warning',
      recommendationKey: ctx.hasTooltips
        ? 'uxAgent.rule.tooltips.pass'
        : 'uxAgent.rule.tooltips.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'dataviz-legends',
    category: 'data-visualization',
    name: 'Chart Legends',
    evaluate: (ctx) => ({
      passed: ctx.hasChartLegends,
      score: ctx.hasChartLegends ? 100 : 30,
      severity: ctx.hasChartLegends ? 'info' : 'warning',
      recommendationKey: ctx.hasChartLegends
        ? 'uxAgent.rule.chartLegends.pass'
        : 'uxAgent.rule.chartLegends.fail',
      recommendationParams: {},
    }),
  },
  {
    id: 'dataviz-axis-labels',
    category: 'data-visualization',
    name: 'Chart Axis Labels',
    evaluate: (ctx) => ({
      passed: ctx.hasChartAxisLabels,
      score: ctx.hasChartAxisLabels ? 100 : 30,
      severity: ctx.hasChartAxisLabels ? 'info' : 'warning',
      recommendationKey: ctx.hasChartAxisLabels
        ? 'uxAgent.rule.axisLabels.pass'
        : 'uxAgent.rule.axisLabels.fail',
      recommendationParams: {},
    }),
  },
];

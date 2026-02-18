import { UXKnowledgeEntry } from '../types';

/**
 * WCAG 2.1 AA accessibility rules relevant to weather/data comparison apps.
 */
export const ACCESSIBILITY_RULES: UXKnowledgeEntry[] = [
  {
    id: 'a11y-color-contrast',
    category: 'accessibility',
    title: 'Color Contrast Ratios (WCAG 1.4.3)',
    description:
      'Text must have a contrast ratio of at least 4.5:1 against its background (3:1 for large text). This applies to both light and dark mode.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'contrast', 'color', 'aa'],
    actionable: true,
    recommendation:
      'Verify all text meets 4.5:1 contrast. Pay special attention to gray text on light backgrounds and chart labels in dark mode.',
  },
  {
    id: 'a11y-keyboard-navigation',
    category: 'accessibility',
    title: 'Keyboard Accessibility (WCAG 2.1.1)',
    description:
      'All functionality must be operable through a keyboard interface. Users must be able to navigate, interact, and submit forms using only the keyboard.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'keyboard', 'focus', 'tab-order'],
    actionable: true,
    recommendation:
      'Ensure tab order follows visual order. All buttons, inputs, and interactive elements must be keyboard-accessible.',
  },
  {
    id: 'a11y-focus-visible',
    category: 'accessibility',
    title: 'Focus Indicators (WCAG 2.4.7)',
    description:
      'Any keyboard-operable user interface must have a visible focus indicator. Users navigating with keyboard need to know which element is focused.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'focus', 'indicator', 'keyboard'],
    actionable: true,
    recommendation:
      'Use focus:ring-2 or similar visible focus styles on all interactive elements. Never use outline:none without an alternative.',
  },
  {
    id: 'a11y-aria-labels',
    category: 'accessibility',
    title: 'ARIA Labels for Interactive Elements (WCAG 4.1.2)',
    description:
      'All interactive UI components must have accessible names. Use aria-label, aria-labelledby, or visible labels for buttons, inputs, and controls.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'aria', 'labels', 'screen-reader'],
    actionable: true,
    recommendation:
      'Add aria-label to icon-only buttons (theme toggle, language toggle, close buttons). Ensure all form inputs have labels.',
  },
  {
    id: 'a11y-alt-text',
    category: 'accessibility',
    title: 'Alternative Text for Non-Text Content (WCAG 1.1.1)',
    description:
      'All non-text content (images, icons, charts, maps) must have text alternatives that describe their purpose or content.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'alt-text', 'images', 'screen-reader'],
    actionable: true,
    recommendation:
      'Add descriptive alt text to map component. Provide text summaries for chart data accessible to screen readers.',
  },
  {
    id: 'a11y-language',
    category: 'accessibility',
    title: 'Page Language (WCAG 3.1.1)',
    description:
      'The default human language of the page must be programmatically determinable via the lang attribute on the html element.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'language', 'i18n', 'html-lang'],
    actionable: true,
    recommendation:
      'Update the html lang attribute when the user switches language between EN and SV.',
  },
  {
    id: 'a11y-resize-text',
    category: 'accessibility',
    title: 'Resizable Text (WCAG 1.4.4)',
    description:
      'Text must be resizable up to 200% without loss of content or functionality. Use relative units (rem, em) rather than fixed pixels for font sizes.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'text', 'zoom', 'responsive'],
    actionable: true,
    recommendation:
      'Use rem/em units for font sizes. Test the app at 200% zoom to verify layout does not break.',
  },
  {
    id: 'a11y-color-not-only',
    category: 'accessibility',
    title: 'Use of Color (WCAG 1.4.1)',
    description:
      'Color must not be the only visual means of conveying information. Use patterns, shapes, or text labels alongside color.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'color', 'patterns', 'color-blind'],
    actionable: true,
    recommendation:
      'Add patterns or shapes to chart lines (dashed vs solid). Use labels alongside colored location dots.',
  },
  {
    id: 'a11y-motion-reduce',
    category: 'accessibility',
    title: 'Motion Preferences (WCAG 2.3.3)',
    description:
      'Respect the prefers-reduced-motion media query. Users with vestibular disorders may experience discomfort from animations.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'motion', 'animation', 'vestibular'],
    actionable: true,
    recommendation:
      'Wrap animations in a prefers-reduced-motion media query check. Provide static alternatives.',
  },
  {
    id: 'a11y-error-identification',
    category: 'accessibility',
    title: 'Error Identification (WCAG 3.3.1)',
    description:
      'If an input error is detected, the item in error must be identified and the error described in text. Do not rely only on color to indicate errors.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['wcag', 'errors', 'forms', 'validation'],
    actionable: true,
    recommendation:
      'Show descriptive error messages near the input field. Use icons alongside red text for error states.',
  },
];

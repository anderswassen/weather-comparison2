import { UXKnowledgeEntry } from '../types';

/**
 * UX patterns specific to weather apps, data dashboards,
 * and comparison interfaces.
 */
export const WEATHER_APP_RULES: UXKnowledgeEntry[] = [
  {
    id: 'weather-chart-readability',
    category: 'data-visualization',
    title: 'Chart Readability for Weather Data',
    description:
      'Weather charts should have clear axis labels with units, appropriate time intervals, and legible data point markers. Avoid overcrowding with too many data series.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'charts', 'readability', 'data-viz'],
    actionable: true,
    recommendation:
      'Label axes with units (°C, m/s, %, mm). Use distinct line styles for each location. Limit visible data series.',
  },
  {
    id: 'weather-color-blind-safe',
    category: 'data-visualization',
    title: 'Color-Blind Safe Chart Palettes',
    description:
      'Approximately 8% of men have some form of color vision deficiency. Use color palettes that are distinguishable by color-blind users (avoid red-green pairs).',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'color-blind', 'palette', 'accessibility'],
    actionable: true,
    recommendation:
      'Use blue and orange instead of red and green for comparison. Add line patterns (dashed, dotted) as secondary distinction.',
  },
  {
    id: 'weather-tooltip-design',
    category: 'data-visualization',
    title: 'Informative Chart Tooltips',
    description:
      'Tooltips on weather charts should show precise values, units, and dates. They should appear on hover/tap and not obscure important data.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'tooltips', 'interaction', 'data-viz'],
    actionable: true,
    recommendation:
      'Show both locations in a single tooltip when hovering a date. Include units and round to sensible precision.',
  },
  {
    id: 'weather-comparison-layout',
    category: 'visual-design',
    title: 'Side-by-Side Comparison Layout',
    description:
      'Comparison interfaces work best when items are placed side by side with clear visual distinction. Use consistent labeling and color coding to track which is which.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'comparison', 'layout', 'side-by-side'],
    actionable: true,
    recommendation:
      'Use consistent color indicators (e.g., blue dot and red dot) for locations throughout the entire interface.',
  },
  {
    id: 'weather-location-search',
    category: 'navigation',
    title: 'Location Search Best Practices',
    description:
      'Weather app location search should provide autocomplete, handle typos gracefully, show recent and saved locations, and give clear feedback when no results are found.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'search', 'autocomplete', 'location'],
    actionable: true,
    recommendation:
      'Debounce search input. Show recent searches first. Provide clear empty states when no location is found.',
  },
  {
    id: 'weather-units-clarity',
    category: 'data-visualization',
    title: 'Clear Units and Measurements',
    description:
      'Always display units alongside numerical weather data. Users should never have to guess whether temperature is in Celsius or Fahrenheit, or wind in m/s or km/h.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'units', 'clarity', 'data'],
    actionable: true,
    recommendation:
      'Show units in chart axis labels, tooltips, and summary cards. Consider offering unit preference settings.',
  },
  {
    id: 'weather-map-integration',
    category: 'navigation',
    title: 'Map as Spatial Context',
    description:
      'Interactive maps help users understand geographic context of weather comparisons. The map should clearly mark selected locations and optionally show weather overlays.',
    source: 'built-in',
    confidence: 0.80,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'map', 'geographic', 'context'],
    actionable: true,
    recommendation:
      'Show both locations on the map with distinct markers. Auto-zoom to fit both locations when comparing.',
  },
  {
    id: 'weather-data-freshness',
    category: 'performance',
    title: 'Indicate Data Freshness',
    description:
      'Users need to know how recent the weather data is. Show when data was last updated and whether it is a forecast or observation.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'freshness', 'timestamp', 'trust'],
    actionable: true,
    recommendation:
      'Display a "last updated" timestamp near the data. Distinguish between forecast and historical data visually.',
  },
  {
    id: 'weather-summary-first',
    category: 'navigation',
    title: 'Summary Before Detail',
    description:
      'Present key weather summary information (current temperature, general conditions) before showing detailed charts and forecasts. Users want the overview first.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'summary', 'progressive-disclosure', 'overview'],
    actionable: true,
    recommendation:
      'Show summary cards above detailed charts. Highlight the most important differences between locations.',
  },
  {
    id: 'weather-share-context',
    category: 'navigation',
    title: 'Shareable Weather Comparisons',
    description:
      'Allow users to easily share specific comparisons via URL. The shared link should reconstruct the exact same view including both locations.',
    source: 'built-in',
    confidence: 0.80,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['weather', 'sharing', 'url', 'social'],
    actionable: true,
    recommendation:
      'Encode location parameters in the URL. Provide a copy-to-clipboard button with visual feedback.',
  },
  {
    id: 'dashboard-responsive-charts',
    category: 'mobile',
    title: 'Responsive Chart Design',
    description:
      'Charts must be readable on all screen sizes. On mobile, consider stacking charts vertically, using swipe gestures, or simplifying axis labels.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['dashboard', 'charts', 'responsive', 'mobile'],
    actionable: true,
    recommendation:
      'Stack charts in a single column on mobile. Reduce tick count on small screens. Make tooltips touch-friendly.',
  },
  {
    id: 'dashboard-loading-sequence',
    category: 'performance',
    title: 'Graceful Loading Sequence',
    description:
      'Load and display data progressively rather than waiting for everything. Show the layout skeleton first, then populate sections as data arrives.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['dashboard', 'loading', 'skeleton', 'progressive'],
    actionable: true,
    recommendation:
      'Use skeleton screens matching chart dimensions. Load summary data before detailed charts if possible.',
  },
];

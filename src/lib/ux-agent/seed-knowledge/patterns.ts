import { UXKnowledgeEntry } from '../types';

/**
 * Built-in UX heuristics based on well-known principles.
 * These seed the knowledge base on first run.
 */
export const UX_PATTERNS: UXKnowledgeEntry[] = [
  // --- Nielsen's 10 Usability Heuristics ---
  {
    id: 'nielsen-visibility',
    category: 'navigation',
    title: 'Visibility of System Status',
    description:
      'The system should always keep users informed about what is going on, through appropriate feedback within reasonable time. Show loading indicators, progress bars, and confirmation messages.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'feedback', 'loading'],
    actionable: true,
    recommendation:
      'Ensure every async action (data fetching, form submission) shows a loading state and confirms completion.',
  },
  {
    id: 'nielsen-match-real-world',
    category: 'navigation',
    title: 'Match Between System and Real World',
    description:
      'The system should speak the user\'s language, using familiar words, phrases, and concepts. Follow real-world conventions, making information appear in a natural and logical order.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'language', 'conventions'],
    actionable: true,
    recommendation:
      'Use common weather terminology and intuitive location names. Avoid technical jargon.',
  },
  {
    id: 'nielsen-user-control',
    category: 'navigation',
    title: 'User Control and Freedom',
    description:
      'Users often perform actions by mistake. Provide a clearly marked "emergency exit" to leave unwanted states without going through extended processes. Support undo and redo.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'undo', 'control'],
    actionable: true,
    recommendation:
      'Allow users to clear selections, go back, and reset comparisons easily.',
  },
  {
    id: 'nielsen-consistency',
    category: 'visual-design',
    title: 'Consistency and Standards',
    description:
      'Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'consistency', 'standards'],
    actionable: true,
    recommendation:
      'Use consistent color coding, spacing, and typography across all components.',
  },
  {
    id: 'nielsen-error-prevention',
    category: 'navigation',
    title: 'Error Prevention',
    description:
      'Even better than good error messages is a careful design which prevents problems from occurring in the first place. Eliminate error-prone conditions or check for them.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'errors', 'prevention'],
    actionable: true,
    recommendation:
      'Disable the compare button when locations are not selected. Validate inputs before submission.',
  },
  {
    id: 'nielsen-recognition',
    category: 'navigation',
    title: 'Recognition Rather Than Recall',
    description:
      'Minimize the user\'s memory load by making objects, actions, and options visible. The user should not have to remember information from one part of the interface to another.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'recognition', 'memory'],
    actionable: true,
    recommendation:
      'Show recent and favorite locations. Display selected location names prominently in results.',
  },
  {
    id: 'nielsen-flexibility',
    category: 'navigation',
    title: 'Flexibility and Efficiency of Use',
    description:
      'Shortcuts and accelerators, unseen by novice users, can speed up interaction for expert users. Allow users to tailor frequent actions.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'shortcuts', 'efficiency'],
    actionable: true,
    recommendation:
      'Support URL sharing for quick comparisons. Provide favorites for frequently used locations.',
  },
  {
    id: 'nielsen-aesthetic',
    category: 'visual-design',
    title: 'Aesthetic and Minimalist Design',
    description:
      'Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with relevant information and diminishes visibility.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'minimalism', 'clean'],
    actionable: true,
    recommendation:
      'Keep the dashboard focused on essential weather metrics. Use progressive disclosure for detailed data.',
  },
  {
    id: 'nielsen-error-recovery',
    category: 'navigation',
    title: 'Help Users Recognize, Diagnose, and Recover From Errors',
    description:
      'Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'errors', 'recovery'],
    actionable: true,
    recommendation:
      'Show clear error messages when weather data cannot be fetched. Suggest alternatives like trying a nearby location.',
  },
  {
    id: 'nielsen-help',
    category: 'navigation',
    title: 'Help and Documentation',
    description:
      'Even though it is better if the system can be used without documentation, it may be necessary to provide help. Help should be easy to search, focused on the user\'s task, and concise.',
    source: 'built-in',
    confidence: 0.95,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['nielsen', 'heuristic', 'help', 'documentation'],
    actionable: true,
    recommendation:
      'Provide a user guide and contextual help. Consider tooltips for chart elements.',
  },

  // --- Cognitive Laws ---
  {
    id: 'fitts-law',
    category: 'mobile',
    title: "Fitts's Law",
    description:
      'The time to acquire a target is a function of the distance to and size of the target. Make important buttons large and easy to reach, especially on touch devices.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['cognitive', 'touch', 'targets', 'buttons'],
    actionable: true,
    recommendation:
      'Ensure all touch targets are at least 44x44px. Place primary actions within thumb reach on mobile.',
  },
  {
    id: 'hicks-law',
    category: 'navigation',
    title: "Hick's Law",
    description:
      'The time it takes to make a decision increases with the number and complexity of choices. Reduce options to minimize decision time.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['cognitive', 'choices', 'simplicity', 'decision'],
    actionable: true,
    recommendation:
      'Limit autocomplete results to a manageable number. Group related weather metrics logically.',
  },
  {
    id: 'millers-law',
    category: 'visual-design',
    title: "Miller's Law",
    description:
      'The average person can only keep 7 (plus or minus 2) items in working memory. Chunk information into digestible groups.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['cognitive', 'memory', 'chunking', 'groups'],
    actionable: true,
    recommendation:
      'Group weather data into clear categories (temperature, wind, humidity, precipitation) rather than showing all at once.',
  },
  {
    id: 'jakobs-law',
    category: 'navigation',
    title: "Jakob's Law",
    description:
      'Users spend most of their time on other sites. This means they prefer your site to work the same way as all the other sites they already know.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['cognitive', 'conventions', 'familiarity', 'expectations'],
    actionable: true,
    recommendation:
      'Follow common weather app patterns: location search at top, results below, charts for data visualization.',
  },
  {
    id: 'gestalt-proximity',
    category: 'visual-design',
    title: 'Gestalt Principle of Proximity',
    description:
      'Objects that are near each other tend to be grouped together. Use spacing to create visual relationships between related elements.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['gestalt', 'spacing', 'grouping', 'layout'],
    actionable: true,
    recommendation:
      'Keep related data points visually close. Use consistent gap spacing between unrelated sections.',
  },

  // --- Modern UX Patterns ---
  {
    id: 'progressive-disclosure',
    category: 'navigation',
    title: 'Progressive Disclosure',
    description:
      'Show only essential information upfront and reveal details on demand. Reduces cognitive load and makes interfaces more approachable.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['pattern', 'complexity', 'disclosure', 'simplicity'],
    actionable: true,
    recommendation:
      'Show summary cards first, let users expand to detailed charts. Hide historical data behind a toggle.',
  },
  {
    id: 'skeleton-screens',
    category: 'performance',
    title: 'Skeleton Screen Loading',
    description:
      'Show placeholder shapes while content loads instead of spinners. This makes the interface feel faster and reduces perceived wait time.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['pattern', 'loading', 'performance', 'perceived-speed'],
    actionable: true,
    recommendation:
      'Use skeleton screens that match the shape of the final content for all loading states.',
  },
  {
    id: 'responsive-design',
    category: 'mobile',
    title: 'Mobile-First Responsive Design',
    description:
      'Design for the smallest screen first, then progressively enhance for larger screens. This ensures the core experience works everywhere.',
    source: 'built-in',
    confidence: 0.90,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['pattern', 'responsive', 'mobile-first', 'breakpoints'],
    actionable: true,
    recommendation:
      'Ensure all charts are readable on mobile. Stack layouts vertically on small screens.',
  },
  {
    id: 'dark-mode-best-practices',
    category: 'visual-design',
    title: 'Dark Mode Best Practices',
    description:
      'Dark mode reduces eye strain in low-light conditions. Use desaturated colors, avoid pure black backgrounds (#000), and ensure sufficient contrast ratios.',
    source: 'built-in',
    confidence: 0.85,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['pattern', 'dark-mode', 'contrast', 'colors'],
    actionable: true,
    recommendation:
      'Use dark gray (not pure black) backgrounds. Reduce color saturation for dark mode. Test contrast ratios.',
  },
  {
    id: 'microinteractions',
    category: 'visual-design',
    title: 'Microinteractions',
    description:
      'Small, contained animations that provide feedback, guide tasks, or enhance delight. Examples: button hover effects, toggle animations, success confirmations.',
    source: 'built-in',
    confidence: 0.80,
    dateAdded: '2025-01-01T00:00:00Z',
    tags: ['pattern', 'animation', 'feedback', 'delight'],
    actionable: true,
    recommendation:
      'Add subtle transitions to buttons and toggles. Animate chart data appearing. Show copy-confirmation feedback.',
  },
];

export type Language = 'en' | 'sv';

type TranslationMap = Record<string, string>;

const en: TranslationMap = {
  // Page
  'page.title': 'Weather Compare',
  'page.subtitle': 'Compare weather forecasts for two Swedish locations',
  'page.firstLocation': 'First Location',
  'page.secondLocation': 'Second Location',
  'page.searchPlaceholder': 'Search for a location...',
  'page.loading': 'Loading...',
  'page.compareWeather': 'Compare Weather',
  'page.copied': 'Copied!',
  'page.share': 'Share',
  'page.fetchingWeather': 'Fetching weather data...',
  'page.footerWeatherData': 'Weather data provided by',
  'page.footerGeocoding': 'Geocoding by',

  // Comparison Dashboard
  'comparison.vs': 'vs',
  'comparison.temperature': 'Temperature',
  'comparison.windSpeed': 'Wind Speed',
  'comparison.humidity': 'Humidity',
  'comparison.precipitation': 'Precipitation',
  'comparison.windDirection': 'Wind Direction',
  'comparison.showHistorical': 'Show last year\'s weather',
  'comparison.loadingHistorical': 'Loading historical data...',

  // Compass
  'compass.N': 'N',
  'compass.NE': 'NE',
  'compass.E': 'E',
  'compass.SE': 'SE',
  'compass.S': 'S',
  'compass.SW': 'SW',
  'compass.W': 'W',
  'compass.NW': 'NW',

  // Summary Cards
  'summary.avgTemp': 'Avg Temp',
  'summary.maxWind': 'Max Wind',
  'summary.avgHumidity': 'Avg Humidity',
  'summary.totalPrecip': 'Total Precip',

  // Location Autocomplete
  'location.searchPlaceholder': 'Search for a Swedish location',
  'location.emptyState': 'Search for a location to get started',
  'location.favorites': 'Favorites',
  'location.recent': 'Recent',
  'location.done': 'Done',
  'location.edit': 'Edit',
  'location.multipleFound': 'Multiple locations found - please select one:',
  'location.removeFavoriteAria': 'Remove {name} from favorites',
  'location.addFavoriteAria': 'Add {name} to favorites',

  // Location Input (unused component)
  'locationInput.placeholder': 'Enter a Swedish location',

  // Map
  'map.emptyState': 'Select locations to see them on the map',

  // Theme Toggle
  'theme.switchToDark': 'Switch to dark mode',
  'theme.switchToLight': 'Switch to light mode',

  // Loading
  'loading.default': 'Loading...',

  // Error
  'error.unexpected': 'An unexpected error occurred',

  // User Guide
  'guide.openAria': 'Open user guide',
  'guide.title': 'User Guide',
  'guide.titleAttr': 'User Guide',
  'guide.subtitle': 'How to use Weather Compare',
  'guide.closeAria': 'Close',
  'guide.gotIt': 'Got it!',
  'guide.section1.title': 'Getting Started',
  'guide.section1.content': 'Weather Compare allows you to compare weather forecasts for two Swedish locations side by side. Simply search for locations, select them, and click "Compare Weather" to see the forecast comparison.',
  'guide.section2.title': 'Searching for Locations',
  'guide.section2.content': 'Click on either location input field and start typing the name of a Swedish city or town. As you type, suggestions will appear. Click on a suggestion to select it. The map will update to show your selected locations.',
  'guide.section3.title': 'Favorites',
  'guide.section3.content': `You can save your frequently used locations as favorites:
\u2022 When search results appear, click the star icon (\u2605) next to a location to add it to your favorites
\u2022 Click the star again to remove it from favorites
\u2022 Your favorites appear at the top of the dropdown when you click on an empty input field
\u2022 Click "Edit" to manage your favorites and remove locations you no longer need`,
  'guide.section4.title': 'Recent Locations',
  'guide.section4.content': `The app automatically remembers your recently selected locations:
\u2022 Up to 5 recent locations are saved
\u2022 They appear below your favorites when you click on an empty input field
\u2022 Simply click on a recent location to select it quickly`,
  'guide.section5.title': 'Comparing Weather',
  'guide.section5.content': `Once you've selected two locations:
1. Click the "Compare Weather" button
2. The app will fetch forecast data from SMHI (Swedish Meteorological and Hydrological Institute)
3. View temperature, wind speed, humidity, and precipitation comparisons
4. Use the interactive charts to explore the data`,
  'guide.section6.title': 'Dark Mode',
  'guide.section6.content': 'Click the sun/moon icon in the top right corner to switch between light and dark mode. Your preference is saved automatically.',

  // Tooltip comparisons
  'tooltip.warmer': 'warmer',
  'tooltip.cooler': 'cooler',
  'tooltip.stronger': 'stronger',
  'tooltip.weaker': 'weaker',
  'tooltip.higher': 'higher',
  'tooltip.lower': 'lower',
  'tooltip.more': 'more',
  'tooltip.less': 'less',
  'tooltip.thanYear': 'than {year}',

  // Insights
  'insights.title': 'Interesting Facts',
  'insights.tempDiff.headline': '{date}: {warmerLocation} is {diff}\u00B0C warmer',
  'insights.tempDiff.description': 'Biggest temperature gap between the locations',
  'insights.bestDay.headline': 'Best day out: {date} in {location}',
  'insights.bestDay.description': '{temperature}\u00B0C, {windDescription}, {rainDescription}',
  'insights.bestDay.lightWind': 'light wind',
  'insights.bestDay.moderateWind': 'moderate wind',
  'insights.bestDay.noRain': 'no rain',
  'insights.bestDay.someRain': 'some rain',
  'insights.tempTrend.headline': '{location} is {direction}',
  'insights.tempTrend.warming': 'Rising {change}\u00B0C over the forecast',
  'insights.tempTrend.cooling': 'Dropping {change}\u00B0C over the forecast',
  'insights.tempTrend.directionWarming': 'warming up',
  'insights.tempTrend.directionCooling': 'cooling down',
  'insights.windChill.headline': '{date}: {location} feels like {feelsLike}\u00B0C',
  'insights.windChill.description': 'Actual {actual}\u00B0C \u2014 wind makes it feel much colder',
  'insights.noInsights': 'No notable weather differences found',

  // UX Agent - Panel
  'uxAgent.toggle': 'UX Assistant',
  'uxAgent.panelTitle': 'UX Expert Agent',
  'uxAgent.tabChat': 'Chat',
  'uxAgent.tabRecommendations': 'Recommendations',
  'uxAgent.tabKnowledge': 'Knowledge',
  'uxAgent.close': 'Close',

  // UX Agent - Chat
  'uxAgent.chat.placeholder': 'Ask about UX...',
  'uxAgent.chat.send': 'Send',
  'uxAgent.chat.quickAnalyze': 'Analyze app',
  'uxAgent.chat.quickResearch': 'Research trends',
  'uxAgent.chat.quickHowCompare': 'How to compare?',
  'uxAgent.chat.quickAccessibility': 'Accessibility',
  'uxAgent.chat.analyzing': 'Analyzing...',
  'uxAgent.chat.researching': 'Researching...',

  // UX Agent - Recommendations
  'uxAgent.rec.noRecommendations': 'No recommendations yet. Run an analysis to get started!',
  'uxAgent.rec.runAnalysis': 'Run Analysis',
  'uxAgent.rec.rerun': 'Re-run',
  'uxAgent.rec.overallScore': 'UX Score',
  'uxAgent.rec.issues': 'Issues to address',
  'uxAgent.rec.passes': 'Passing checks',

  // UX Agent - Categories
  'uxAgent.cat.accessibility': 'Accessibility',
  'uxAgent.cat.navigation': 'Navigation',
  'uxAgent.cat.visualDesign': 'Visual Design',
  'uxAgent.cat.performance': 'Performance',
  'uxAgent.cat.mobile': 'Mobile',
  'uxAgent.cat.dataViz': 'Data Viz',

  // UX Agent - Knowledge Browser
  'uxAgent.kb.filterAll': 'All',
  'uxAgent.kb.entries': 'entries',
  'uxAgent.kb.fromWeb': 'from web',
  'uxAgent.kb.researchMore': 'Research',
  'uxAgent.kb.empty': 'No entries yet. Click Research to discover UX trends!',
  'uxAgent.kb.confidence': 'Confidence',
  'uxAgent.kb.viewSource': 'View source',
  'uxAgent.kb.source.builtIn': 'Built-in',
  'uxAgent.kb.source.webResearch': 'Web',
  'uxAgent.kb.source.appAnalysis': 'Analysis',

  // UX Agent - Analysis Rules
  'uxAgent.rule.a11y-aria-labels.title': 'ARIA Labels',
  'uxAgent.rule.ariaLabels.pass': 'Interactive elements have proper ARIA labels',
  'uxAgent.rule.ariaLabels.fail': 'Add ARIA labels to all interactive elements',
  'uxAgent.rule.a11y-focus-indicators.title': 'Focus Indicators',
  'uxAgent.rule.focusIndicators.pass': 'Focus indicators are visible on interactive elements',
  'uxAgent.rule.focusIndicators.fail': 'Add visible focus indicators (focus:ring) to interactive elements',
  'uxAgent.rule.a11y-keyboard-nav.title': 'Keyboard Navigation',
  'uxAgent.rule.keyboardNav.pass': 'All interactive elements are keyboard accessible',
  'uxAgent.rule.keyboardNav.fail': 'Ensure all interactive elements support keyboard navigation',
  'uxAgent.rule.a11y-semantic-html.title': 'Semantic HTML',
  'uxAgent.rule.semanticHTML.pass': 'Page uses semantic HTML elements (header, footer, main)',
  'uxAgent.rule.semanticHTML.fail': 'Use semantic HTML elements instead of generic divs',
  'uxAgent.rule.a11y-color-blind.title': 'Color-Blind Safety',
  'uxAgent.rule.colorBlind.pass': 'Chart colors are distinguishable for color-blind users',
  'uxAgent.rule.colorBlind.fail': 'Add patterns or shapes alongside colors in charts for color-blind users',
  'uxAgent.rule.nav-user-guide.title': 'User Guide',
  'uxAgent.rule.userGuide.pass': 'User guide is available and accessible',
  'uxAgent.rule.userGuide.fail': 'Add a user guide to help new users get started',
  'uxAgent.rule.nav-share-feature.title': 'Share Feature',
  'uxAgent.rule.shareFeature.pass': 'Comparisons can be shared via URL',
  'uxAgent.rule.shareFeature.fail': 'Add URL-based sharing for comparisons',
  'uxAgent.rule.nav-i18n.title': 'Internationalization',
  'uxAgent.rule.i18n.pass': 'App supports multiple languages (EN/SV)',
  'uxAgent.rule.i18n.fail': 'Add internationalization support for multiple languages',
  'uxAgent.rule.nav-error-states.title': 'Error Handling',
  'uxAgent.rule.errorStates.pass': 'Errors are displayed clearly with styled messages',
  'uxAgent.rule.errorStates.fail': 'Add clear error messages for failed operations',
  'uxAgent.rule.nav-feedback-states.title': 'User Feedback',
  'uxAgent.rule.feedbackStates.pass': 'User actions provide clear feedback (loading, copied, etc.)',
  'uxAgent.rule.feedbackStates.fail': 'Add feedback states for user actions (confirmations, loading)',
  'uxAgent.rule.vd-dark-mode.title': 'Dark Mode',
  'uxAgent.rule.darkMode.pass': 'Full dark mode support with proper styling',
  'uxAgent.rule.darkMode.fail': 'Add dark mode support to all components',
  'uxAgent.rule.vd-consistent-spacing.title': 'Consistent Spacing',
  'uxAgent.rule.consistentSpacing.pass': 'Consistent spacing scale used throughout',
  'uxAgent.rule.consistentSpacing.fail': 'Standardize spacing using a consistent scale',
  'uxAgent.rule.vd-animations.title': 'Animations',
  'uxAgent.rule.animations.pass': 'Smooth transitions and animations enhance the experience',
  'uxAgent.rule.animations.fail': 'Add subtle animations for better feedback and delight',
  'uxAgent.rule.perf-lazy-loading.title': 'Lazy Loading',
  'uxAgent.rule.lazyLoading.pass': 'Heavy components are lazy-loaded for faster initial render',
  'uxAgent.rule.lazyLoading.fail': 'Lazy-load heavy components like maps and charts',
  'uxAgent.rule.perf-skeleton-loading.title': 'Skeleton Loading',
  'uxAgent.rule.skeletonLoading.pass': 'Skeleton screens show during content loading',
  'uxAgent.rule.skeletonLoading.fail': 'Add skeleton screens to reduce perceived loading time',
  'uxAgent.rule.perf-loading-states.title': 'Loading Indicators',
  'uxAgent.rule.loadingStates.pass': 'Loading indicators shown during async operations',
  'uxAgent.rule.loadingStates.fail': 'Add loading indicators for all async operations',
  'uxAgent.rule.perf-debounced-search.title': 'Debounced Search',
  'uxAgent.rule.debouncedSearch.pass': 'Search input is debounced to avoid excessive API calls',
  'uxAgent.rule.debouncedSearch.fail': 'Add debounce to search input to reduce API calls',
  'uxAgent.rule.perf-parallel-fetch.title': 'Parallel Fetching',
  'uxAgent.rule.parallelFetch.pass': 'Data for both locations is fetched in parallel',
  'uxAgent.rule.parallelFetch.fail': 'Fetch data for both locations in parallel for faster results',
  'uxAgent.rule.mobile-responsive.title': 'Responsive Layout',
  'uxAgent.rule.responsiveLayout.pass': 'Layout adapts well to all screen sizes',
  'uxAgent.rule.responsiveLayout.fail': 'Add responsive breakpoints for mobile and tablet screens',
  'uxAgent.rule.mobile-touch-targets.title': 'Touch Targets',
  'uxAgent.rule.touchTargets.pass': 'Touch targets meet minimum size requirements (44x44px)',
  'uxAgent.rule.touchTargets.fail': 'Increase touch target sizes to at least 44x44px for mobile',
  'uxAgent.rule.mobile-layout.title': 'Mobile Layout',
  'uxAgent.rule.mobileLayout.pass': 'Mobile-specific layout adjustments are in place',
  'uxAgent.rule.mobileLayout.fail': 'Add mobile-specific layout optimizations',
  'uxAgent.rule.dataviz-tooltips.title': 'Chart Tooltips',
  'uxAgent.rule.tooltips.pass': 'Charts have informative tooltips on hover',
  'uxAgent.rule.tooltips.fail': 'Add tooltips to charts for detailed data inspection',
  'uxAgent.rule.dataviz-legends.title': 'Chart Legends',
  'uxAgent.rule.chartLegends.pass': 'Charts have clear legends identifying each data series',
  'uxAgent.rule.chartLegends.fail': 'Add legends to charts to identify data series',
  'uxAgent.rule.dataviz-axis-labels.title': 'Axis Labels',
  'uxAgent.rule.axisLabels.pass': 'Chart axes have clear labels with units',
  'uxAgent.rule.axisLabels.fail': 'Add axis labels with units to all charts',
};

const sv: TranslationMap = {
  // Page
  'page.title': 'Jämför Väder',
  'page.subtitle': 'Jämför väderprognoser för två svenska platser',
  'page.firstLocation': 'Första platsen',
  'page.secondLocation': 'Andra platsen',
  'page.searchPlaceholder': 'Sök efter en plats...',
  'page.loading': 'Laddar...',
  'page.compareWeather': 'Jämför väder',
  'page.copied': 'Kopierad!',
  'page.share': 'Dela',
  'page.fetchingWeather': 'Hämtar väderdata...',
  'page.footerWeatherData': 'Väderdata tillhandahålls av',
  'page.footerGeocoding': 'Geokodning av',

  // Comparison Dashboard
  'comparison.vs': 'mot',
  'comparison.temperature': 'Temperatur',
  'comparison.windSpeed': 'Vindhastighet',
  'comparison.humidity': 'Luftfuktighet',
  'comparison.precipitation': 'Nederbörd',
  'comparison.windDirection': 'Vindriktning',
  'comparison.showHistorical': 'Visa förra årets väder',
  'comparison.loadingHistorical': 'Laddar historisk data...',

  // Compass
  'compass.N': 'N',
  'compass.NE': 'NO',
  'compass.E': 'O',
  'compass.SE': 'SO',
  'compass.S': 'S',
  'compass.SW': 'SV',
  'compass.W': 'V',
  'compass.NW': 'NV',

  // Summary Cards
  'summary.avgTemp': 'Medeltemp',
  'summary.maxWind': 'Max vind',
  'summary.avgHumidity': 'Medelfuktighet',
  'summary.totalPrecip': 'Total nederbörd',

  // Location Autocomplete
  'location.searchPlaceholder': 'Sök efter en svensk plats',
  'location.emptyState': 'Sök efter en plats för att komma igång',
  'location.favorites': 'Favoriter',
  'location.recent': 'Senaste',
  'location.done': 'Klar',
  'location.edit': 'Redigera',
  'location.multipleFound': 'Flera platser hittades - välj en:',
  'location.removeFavoriteAria': 'Ta bort {name} från favoriter',
  'location.addFavoriteAria': 'Lägg till {name} i favoriter',

  // Location Input (unused component)
  'locationInput.placeholder': 'Ange en svensk plats',

  // Map
  'map.emptyState': 'Välj platser för att se dem på kartan',

  // Theme Toggle
  'theme.switchToDark': 'Byt till mörkt läge',
  'theme.switchToLight': 'Byt till ljust läge',

  // Loading
  'loading.default': 'Laddar...',

  // Error
  'error.unexpected': 'Ett oväntat fel inträffade',

  // User Guide
  'guide.openAria': 'Öppna användarguide',
  'guide.title': 'Användarguide',
  'guide.titleAttr': 'Användarguide',
  'guide.subtitle': 'Hur man använder Weather Compare',
  'guide.closeAria': 'Stäng',
  'guide.gotIt': 'Jag förstår!',
  'guide.section1.title': 'Komma igång',
  'guide.section1.content': 'Weather Compare låter dig jämföra väderprognoser för två svenska platser sida vid sida. Sök helt enkelt efter platser, välj dem och klicka på "Jämför väder" för att se prognosjämförelsen.',
  'guide.section2.title': 'Söka efter platser',
  'guide.section2.content': 'Klicka på något av platsfälten och börja skriva namnet på en svensk stad eller ort. När du skriver visas förslag. Klicka på ett förslag för att välja det. Kartan uppdateras för att visa dina valda platser.',
  'guide.section3.title': 'Favoriter',
  'guide.section3.content': `Du kan spara dina vanligaste platser som favoriter:
\u2022 När sökresultat visas, klicka på stjärnikonen (\u2605) bredvid en plats för att lägga till den i dina favoriter
\u2022 Klicka på stjärnan igen för att ta bort den från favoriter
\u2022 Dina favoriter visas högst upp i rullgardinsmenyn när du klickar på ett tomt inmatningsfält
\u2022 Klicka på "Redigera" för att hantera dina favoriter och ta bort platser du inte längre behöver`,
  'guide.section4.title': 'Senaste platser',
  'guide.section4.content': `Appen kommer automatiskt ihåg dina senast valda platser:
\u2022 Upp till 5 senaste platser sparas
\u2022 De visas under dina favoriter när du klickar på ett tomt inmatningsfält
\u2022 Klicka helt enkelt på en senaste plats för att snabbt välja den`,
  'guide.section5.title': 'Jämföra väder',
  'guide.section5.content': `När du har valt två platser:
1. Klicka på knappen "Jämför väder"
2. Appen hämtar prognosdata från SMHI (Sveriges meteorologiska och hydrologiska institut)
3. Se jämförelser av temperatur, vindhastighet, luftfuktighet och nederbörd
4. Använd de interaktiva diagrammen för att utforska datan`,
  'guide.section6.title': 'Mörkt läge',
  'guide.section6.content': 'Klicka på sol-/månikonen i det övre högra hörnet för att växla mellan ljust och mörkt läge. Din inställning sparas automatiskt.',

  // Tooltip comparisons
  'tooltip.warmer': 'varmare',
  'tooltip.cooler': 'kallare',
  'tooltip.stronger': 'starkare',
  'tooltip.weaker': 'svagare',
  'tooltip.higher': 'högre',
  'tooltip.lower': 'lägre',
  'tooltip.more': 'mer',
  'tooltip.less': 'mindre',
  'tooltip.thanYear': 'än {year}',

  // Insights
  'insights.title': 'Intressanta fakta',
  'insights.tempDiff.headline': '{date}: {warmerLocation} \u00E4r {diff}\u00B0C varmare',
  'insights.tempDiff.description': 'St\u00F6rsta temperaturskillnaden mellan platserna',
  'insights.bestDay.headline': 'B\u00E4sta utedagen: {date} i {location}',
  'insights.bestDay.description': '{temperature}\u00B0C, {windDescription}, {rainDescription}',
  'insights.bestDay.lightWind': 'l\u00E4tt vind',
  'insights.bestDay.moderateWind': 'm\u00E5ttlig vind',
  'insights.bestDay.noRain': 'inget regn',
  'insights.bestDay.someRain': 'lite regn',
  'insights.tempTrend.headline': '{location} {direction}',
  'insights.tempTrend.warming': 'Stiger {change}\u00B0C under prognosen',
  'insights.tempTrend.cooling': 'Sjunker {change}\u00B0C under prognosen',
  'insights.tempTrend.directionWarming': 'blir varmare',
  'insights.tempTrend.directionCooling': 'blir kallare',
  'insights.windChill.headline': '{date}: {location} k\u00E4nns som {feelsLike}\u00B0C',
  'insights.windChill.description': 'Faktiskt {actual}\u00B0C \u2014 vinden g\u00F6r att det k\u00E4nns mycket kallare',
  'insights.noInsights': 'Inga anm\u00E4rkningsv\u00E4rda v\u00E4derskillnader hittades',

  // UX Agent - Panel
  'uxAgent.toggle': 'UX-assistent',
  'uxAgent.panelTitle': 'UX Expert Agent',
  'uxAgent.tabChat': 'Chatt',
  'uxAgent.tabRecommendations': 'Rekommendationer',
  'uxAgent.tabKnowledge': 'Kunskap',
  'uxAgent.close': 'St\u00E4ng',

  // UX Agent - Chat
  'uxAgent.chat.placeholder': 'Fr\u00E5ga om UX...',
  'uxAgent.chat.send': 'Skicka',
  'uxAgent.chat.quickAnalyze': 'Analysera app',
  'uxAgent.chat.quickResearch': 'Forska trender',
  'uxAgent.chat.quickHowCompare': 'Hur j\u00E4mf\u00F6r jag?',
  'uxAgent.chat.quickAccessibility': 'Tillg\u00E4nglighet',
  'uxAgent.chat.analyzing': 'Analyserar...',
  'uxAgent.chat.researching': 'Forskar...',

  // UX Agent - Recommendations
  'uxAgent.rec.noRecommendations': 'Inga rekommendationer \u00E4nnu. K\u00F6r en analys f\u00F6r att komma ig\u00E5ng!',
  'uxAgent.rec.runAnalysis': 'K\u00F6r analys',
  'uxAgent.rec.rerun': 'K\u00F6r igen',
  'uxAgent.rec.overallScore': 'UX-po\u00E4ng',
  'uxAgent.rec.issues': 'Problem att \u00E5tg\u00E4rda',
  'uxAgent.rec.passes': 'Godk\u00E4nda kontroller',

  // UX Agent - Categories
  'uxAgent.cat.accessibility': 'Tillg\u00E4nglighet',
  'uxAgent.cat.navigation': 'Navigering',
  'uxAgent.cat.visualDesign': 'Visuell design',
  'uxAgent.cat.performance': 'Prestanda',
  'uxAgent.cat.mobile': 'Mobil',
  'uxAgent.cat.dataViz': 'Datavisualisering',

  // UX Agent - Knowledge Browser
  'uxAgent.kb.filterAll': 'Alla',
  'uxAgent.kb.entries': 'poster',
  'uxAgent.kb.fromWeb': 'fr\u00E5n webben',
  'uxAgent.kb.researchMore': 'Forska',
  'uxAgent.kb.empty': 'Inga poster \u00E4nnu. Klicka Forska f\u00F6r att uppt\u00E4cka UX-trender!',
  'uxAgent.kb.confidence': 'Konfidens',
  'uxAgent.kb.viewSource': 'Visa k\u00E4lla',
  'uxAgent.kb.source.builtIn': 'Inbyggd',
  'uxAgent.kb.source.webResearch': 'Webb',
  'uxAgent.kb.source.appAnalysis': 'Analys',

  // UX Agent - Analysis Rules
  'uxAgent.rule.a11y-aria-labels.title': 'ARIA-etiketter',
  'uxAgent.rule.ariaLabels.pass': 'Interaktiva element har korrekta ARIA-etiketter',
  'uxAgent.rule.ariaLabels.fail': 'L\u00E4gg till ARIA-etiketter p\u00E5 alla interaktiva element',
  'uxAgent.rule.a11y-focus-indicators.title': 'Fokusindikatorer',
  'uxAgent.rule.focusIndicators.pass': 'Fokusindikatorer \u00E4r synliga p\u00E5 interaktiva element',
  'uxAgent.rule.focusIndicators.fail': 'L\u00E4gg till synliga fokusindikatorer p\u00E5 interaktiva element',
  'uxAgent.rule.a11y-keyboard-nav.title': 'Tangentbordsnavigering',
  'uxAgent.rule.keyboardNav.pass': 'Alla interaktiva element \u00E4r tangentbordstillg\u00E4ngliga',
  'uxAgent.rule.keyboardNav.fail': 'S\u00E4kerst\u00E4ll att alla interaktiva element st\u00F6der tangentbordsnavigering',
  'uxAgent.rule.a11y-semantic-html.title': 'Semantisk HTML',
  'uxAgent.rule.semanticHTML.pass': 'Sidan anv\u00E4nder semantiska HTML-element (header, footer, main)',
  'uxAgent.rule.semanticHTML.fail': 'Anv\u00E4nd semantiska HTML-element ist\u00E4llet f\u00F6r generiska div:ar',
  'uxAgent.rule.a11y-color-blind.title': 'F\u00E4rgblindhetss\u00E4kerhet',
  'uxAgent.rule.colorBlind.pass': 'Diagramf\u00E4rger \u00E4r urskiljbara f\u00F6r f\u00E4rgblinda anv\u00E4ndare',
  'uxAgent.rule.colorBlind.fail': 'L\u00E4gg till m\u00F6nster eller former bredvid f\u00E4rger i diagram',
  'uxAgent.rule.nav-user-guide.title': 'Anv\u00E4ndarguide',
  'uxAgent.rule.userGuide.pass': 'Anv\u00E4ndarguide finns tillg\u00E4nglig',
  'uxAgent.rule.userGuide.fail': 'L\u00E4gg till en anv\u00E4ndarguide f\u00F6r nya anv\u00E4ndare',
  'uxAgent.rule.nav-share-feature.title': 'Delningsfunktion',
  'uxAgent.rule.shareFeature.pass': 'J\u00E4mf\u00F6relser kan delas via URL',
  'uxAgent.rule.shareFeature.fail': 'L\u00E4gg till URL-baserad delning f\u00F6r j\u00E4mf\u00F6relser',
  'uxAgent.rule.nav-i18n.title': 'Internationalisering',
  'uxAgent.rule.i18n.pass': 'Appen st\u00F6der flera spr\u00E5k (EN/SV)',
  'uxAgent.rule.i18n.fail': 'L\u00E4gg till spr\u00E5kst\u00F6d f\u00F6r flera spr\u00E5k',
  'uxAgent.rule.nav-error-states.title': 'Felhantering',
  'uxAgent.rule.errorStates.pass': 'Fel visas tydligt med stiliserade meddelanden',
  'uxAgent.rule.errorStates.fail': 'L\u00E4gg till tydliga felmeddelanden f\u00F6r misslyckade operationer',
  'uxAgent.rule.nav-feedback-states.title': 'Anv\u00E4ndar\u00E5terkoppling',
  'uxAgent.rule.feedbackStates.pass': 'Anv\u00E4ndaraktioner ger tydlig \u00E5terkoppling (laddning, kopierat, etc.)',
  'uxAgent.rule.feedbackStates.fail': 'L\u00E4gg till \u00E5terkopplingstillst\u00E5nd f\u00F6r anv\u00E4ndaraktioner',
  'uxAgent.rule.vd-dark-mode.title': 'M\u00F6rkt l\u00E4ge',
  'uxAgent.rule.darkMode.pass': 'Fullst\u00E4ndigt st\u00F6d f\u00F6r m\u00F6rkt l\u00E4ge',
  'uxAgent.rule.darkMode.fail': 'L\u00E4gg till st\u00F6d f\u00F6r m\u00F6rkt l\u00E4ge i alla komponenter',
  'uxAgent.rule.vd-consistent-spacing.title': 'Konsekvent avst\u00E5nd',
  'uxAgent.rule.consistentSpacing.pass': 'Konsekvent avst\u00E5ndsskala anv\u00E4nds genomg\u00E5ende',
  'uxAgent.rule.consistentSpacing.fail': 'Standardisera avst\u00E5nd med en konsekvent skala',
  'uxAgent.rule.vd-animations.title': 'Animationer',
  'uxAgent.rule.animations.pass': 'Mjuka \u00F6verg\u00E5ngar och animationer f\u00F6rb\u00E4ttrar upplevelsen',
  'uxAgent.rule.animations.fail': 'L\u00E4gg till subtila animationer f\u00F6r b\u00E4ttre \u00E5terkoppling',
  'uxAgent.rule.perf-lazy-loading.title': 'Lat laddning',
  'uxAgent.rule.lazyLoading.pass': 'Tunga komponenter laddas lat f\u00F6r snabbare f\u00F6rsta rendering',
  'uxAgent.rule.lazyLoading.fail': 'Lat-ladda tunga komponenter som kartor och diagram',
  'uxAgent.rule.perf-skeleton-loading.title': 'Skelettladdning',
  'uxAgent.rule.skeletonLoading.pass': 'Skelettsk\u00E4rmar visas under inneh\u00E5llsladdning',
  'uxAgent.rule.skeletonLoading.fail': 'L\u00E4gg till skelettsk\u00E4rmar f\u00F6r att minska upplevd laddningstid',
  'uxAgent.rule.perf-loading-states.title': 'Laddningsindikatorer',
  'uxAgent.rule.loadingStates.pass': 'Laddningsindikatorer visas under asynkrona operationer',
  'uxAgent.rule.loadingStates.fail': 'L\u00E4gg till laddningsindikatorer f\u00F6r alla asynkrona operationer',
  'uxAgent.rule.perf-debounced-search.title': 'F\u00F6rdr\u00F6jd s\u00F6kning',
  'uxAgent.rule.debouncedSearch.pass': 'S\u00F6kinmatning \u00E4r f\u00F6rdr\u00F6jd f\u00F6r att undvika \u00F6verdrivna API-anrop',
  'uxAgent.rule.debouncedSearch.fail': 'L\u00E4gg till f\u00F6rdr\u00F6jning p\u00E5 s\u00F6kinmatning f\u00F6r f\u00E4rre API-anrop',
  'uxAgent.rule.perf-parallel-fetch.title': 'Parallell h\u00E4mtning',
  'uxAgent.rule.parallelFetch.pass': 'Data f\u00F6r b\u00E5da platser h\u00E4mtas parallellt',
  'uxAgent.rule.parallelFetch.fail': 'H\u00E4mta data f\u00F6r b\u00E5da platser parallellt f\u00F6r snabbare resultat',
  'uxAgent.rule.mobile-responsive.title': 'Responsiv layout',
  'uxAgent.rule.responsiveLayout.pass': 'Layouten anpassar sig v\u00E4l till alla sk\u00E4rmstorlekar',
  'uxAgent.rule.responsiveLayout.fail': 'L\u00E4gg till responsiva brytpunkter f\u00F6r mobil och surfplatta',
  'uxAgent.rule.mobile-touch-targets.title': 'Tryckytor',
  'uxAgent.rule.touchTargets.pass': 'Tryckytor uppfyller minimikrav p\u00E5 storlek (44x44px)',
  'uxAgent.rule.touchTargets.fail': '\u00D6ka tryckytor till minst 44x44px f\u00F6r mobil',
  'uxAgent.rule.mobile-layout.title': 'Mobillayout',
  'uxAgent.rule.mobileLayout.pass': 'Mobilspecifika layoutjusteringar \u00E4r p\u00E5 plats',
  'uxAgent.rule.mobileLayout.fail': 'L\u00E4gg till mobilspecifika layoutoptimeringar',
  'uxAgent.rule.dataviz-tooltips.title': 'Diagramverktygtips',
  'uxAgent.rule.tooltips.pass': 'Diagram har informativa verktygstips vid hovring',
  'uxAgent.rule.tooltips.fail': 'L\u00E4gg till verktygstips p\u00E5 diagram f\u00F6r detaljerad datainspek',
  'uxAgent.rule.dataviz-legends.title': 'Diagramf\u00F6rklaringar',
  'uxAgent.rule.chartLegends.pass': 'Diagram har tydliga f\u00F6rklaringar som identifierar varje dataserie',
  'uxAgent.rule.chartLegends.fail': 'L\u00E4gg till f\u00F6rklaringar p\u00E5 diagram f\u00F6r att identifiera dataserier',
  'uxAgent.rule.dataviz-axis-labels.title': 'Axeletiketter',
  'uxAgent.rule.axisLabels.pass': 'Diagramaxlar har tydliga etiketter med enheter',
  'uxAgent.rule.axisLabels.fail': 'L\u00E4gg till axeletiketter med enheter p\u00E5 alla diagram',
};

export const translations: Record<Language, TranslationMap> = { en, sv };

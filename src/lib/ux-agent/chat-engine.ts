import { Language } from '../translations';
import {
  ChatMessage,
  UserIntent,
  UXKnowledgeEntry,
  AppAnalysisResult,
} from './types';

let messageCounter = 0;

function createMessage(
  role: 'user' | 'agent',
  text: string,
  related?: string[],
): ChatMessage {
  messageCounter++;
  return {
    id: `msg-${Date.now()}-${messageCounter}`,
    role,
    text,
    timestamp: new Date().toISOString(),
    relatedRecommendations: related,
  };
}

// --- Intent Classification ---

const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  'ask-accessibility': [
    'accessibility', 'a11y', 'screen reader', 'wcag', 'aria',
    'keyboard', 'contrast', 'blind', 'disability',
    'tillgänglighet', 'tillganglighet', 'skärmläsare', 'skarmlasare', 'kontrast',
  ],
  'ask-navigation': [
    'navigation', 'navigate', 'menu', 'find', 'where',
    'navigering', 'hitta', 'var',
  ],
  'ask-dark-mode': [
    'dark mode', 'dark theme', 'light mode', 'theme',
    'mörkt läge', 'morkt lage', 'mörkt tema', 'morkt tema', 'ljust', 'tema',
  ],
  'ask-charts': [
    'chart', 'graph', 'plot', 'visualization', 'data',
    'diagram', 'graf', 'visualisering',
  ],
  'ask-mobile': [
    'mobile', 'phone', 'responsive', 'touch', 'small screen',
    'mobil', 'telefon', 'responsiv',
  ],
  'ask-performance': [
    'performance', 'speed', 'slow', 'fast', 'loading', 'cache',
    'prestanda', 'snabb', 'långsam', 'langsam', 'laddning',
  ],
  'ask-how-to-compare': [
    'compare', 'how to', 'how do i', 'weather', 'locations',
    'jämför', 'jamfor', 'hur', 'väder', 'vader', 'platser',
  ],
  'ask-how-to-share': [
    'share', 'link', 'url', 'send',
    'dela', 'länk', 'lank', 'skicka',
  ],
  'ask-how-to-favorites': [
    'favorite', 'save', 'bookmark', 'recent',
    'favorit', 'spara', 'bokmärk', 'bokmark', 'senaste',
  ],
  'ask-how-to-historical': [
    'historical', 'last year', 'past', 'history',
    'historisk', 'förra året', 'forra aret', 'förr', 'forr', 'historik',
  ],
  'ask-general-ux': [
    'ux', 'user experience', 'design', 'usability', 'best practice',
    'användarupplevelse', 'anvandarupplevelse', 'design', 'användbarhet', 'anvandbarhet',
  ],
  'ask-what-is-this': [
    'what is this', 'help', 'who are you', 'what can you do',
    'vad är detta', 'vad ar detta', 'hjälp', 'hjalp', 'vem är du', 'vem ar du', 'vad kan du',
  ],
  'trigger-analysis': [
    'analyze', 'analysis', 'audit', 'check', 'evaluate', 'score',
    'analysera', 'analys', 'granska', 'utvärdera', 'utvardera', 'poängsätt', 'poangsatt',
  ],
  'trigger-research': [
    'research', 'search', 'find trends', 'web', 'learn', 'new ideas',
    'forskning', 'sök', 'sok', 'trender', 'lära', 'lara', 'nya idéer', 'nya ideer',
  ],
  unknown: [],
};

export function classifyIntent(input: string): UserIntent {
  const normalized = input.toLowerCase().trim();

  let bestIntent: UserIntent = 'unknown';
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (intent === 'unknown') continue;

    let score = 0;
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        // Longer keyword matches are more specific
        score += keyword.length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as UserIntent;
    }
  }

  return bestIntent;
}

// --- Response Templates ---

interface ResponseTemplates {
  [key: string]: { en: string; sv: string };
}

const RESPONSES: ResponseTemplates = {
  'ask-accessibility': {
    en: 'This app follows several accessibility best practices: ARIA labels on interactive elements, keyboard navigation support, focus indicators (ring styles), and semantic HTML structure. Some areas for improvement include adding pattern distinctions to chart lines for color-blind users and ensuring the html lang attribute updates when switching languages.',
    sv: 'Den här appen följer flera tillgänglighetsmetoder: ARIA-etiketter på interaktiva element, tangentbordsnavigering, fokusindikatorer och semantisk HTML-struktur. Förbättringsområden inkluderar att lägga till mönsterdistinktioner på diagramlinjer för färgblinda användare.',
  },
  'ask-navigation': {
    en: 'The app uses a simple, linear flow: 1) Search for two locations at the top, 2) Click "Compare Weather" to see results below, 3) Scroll down to see charts and insights. You can also toggle historical data, switch language, and share your comparison via URL.',
    sv: 'Appen använder ett enkelt, linjärt flöde: 1) Sök efter två platser längst upp, 2) Klicka "Jämför väder" för att se resultat nedan, 3) Scrolla ner för diagram och insikter. Du kan även visa historisk data, byta språk och dela din jämförelse via URL.',
  },
  'ask-dark-mode': {
    en: 'Dark mode is fully supported! Click the moon/sun icon in the top-right corner to toggle. The app uses desaturated dark grays (not pure black) for backgrounds, which is easier on the eyes. Your preference is saved in localStorage.',
    sv: 'Mörkt läge stöds fullt ut! Klicka på mån-/solikonen i övre högra hörnet för att växla. Appen använder avmättade mörka grå (inte helsvart) för bakgrunder, vilket är skonsammare för ögonen. Ditt val sparas i lokalt lagringsutrymme.',
  },
  'ask-charts': {
    en: 'The app shows four weather charts: Temperature (°C), Wind Speed (m/s) with direction arrows, Humidity (%), and Precipitation (mm). Each chart compares both locations with color-coded lines. Hover over data points for detailed tooltips. You can also overlay last year\'s data for comparison.',
    sv: 'Appen visar fyra väderdiagram: Temperatur (°C), Vindhastighet (m/s) med riktningspilar, Luftfuktighet (%) och Nederbörd (mm). Varje diagram jämför båda platser med färgkodade linjer. Hovra över datapunkter för detaljerade verktygstips.',
  },
  'ask-mobile': {
    en: 'The app is fully responsive. On mobile screens, the layout stacks vertically: location inputs appear above the map, and charts display in a single column. Buttons and touch targets are sized for comfortable tapping. Try rotating your device for a wider view of charts.',
    sv: 'Appen är fullt responsiv. På mobilskärmar staplas layouten vertikalt: platsinmatningar visas ovanför kartan och diagram visas i en enda kolumn. Knappar och tryckytor är dimensionerade för bekväm tryckning.',
  },
  'ask-performance': {
    en: 'The app optimizes performance in several ways: parallel data fetching for both locations, debounced search input (300ms), lazy-loaded map component, skeleton loading screens, and memoized computed values. The data comes from SMHI\'s API, which is fast for Swedish locations.',
    sv: 'Appen optimerar prestandan på flera sätt: parallell datahämtning för båda platser, fördröjd sökinmatning (300ms), lat-laddad kartkomponent, skelett-laddningsskärmar och memoiserade beräknade värden.',
  },
  'ask-how-to-compare': {
    en: 'To compare weather: 1) Type a Swedish city or town name in the first search field, 2) Select it from the dropdown, 3) Do the same for the second location, 4) Click the "Compare Weather" button. You\'ll see side-by-side charts comparing temperature, wind, humidity, and precipitation.',
    sv: 'För att jämföra väder: 1) Skriv ett svenskt stadsnamn i det första sökfältet, 2) Välj det från rullgardinsmenyn, 3) Gör samma sak för den andra platsen, 4) Klicka på "Jämför väder". Du ser diagram som jämför temperatur, vind, fuktighet och nederbörd sida vid sida.',
  },
  'ask-how-to-share': {
    en: 'After comparing two locations, a "Share" button appears next to the compare button. Click it to copy a URL to your clipboard. Anyone who opens that link will see the exact same comparison. The URL includes both location coordinates.',
    sv: 'Efter att ha jämfört två platser visas en "Dela"-knapp bredvid jämförelseknappen. Klicka på den för att kopiera en URL till ditt urklipp. Alla som öppnar länken ser exakt samma jämförelse.',
  },
  'ask-how-to-favorites': {
    en: 'When searching for locations, you\'ll see a star icon next to each result. Click it to save the location as a favorite. Your favorites and recent searches appear at the top of the search dropdown for quick access.',
    sv: 'När du söker efter platser ser du en stjärnikon bredvid varje resultat. Klicka på den för att spara platsen som favorit. Dina favoriter och senaste sökningar visas längst upp i sökrullgardinsmenyn.',
  },
  'ask-how-to-historical': {
    en: 'After comparing two locations, you\'ll see a "Show last year\'s weather" checkbox below the location names. Toggle it on to overlay dashed lines showing the same dates from the previous year on all charts. This helps identify unusual weather patterns.',
    sv: 'Efter att ha jämfört två platser ser du en kryssruta "Visa förra årets väder" under platsnamnen. Aktivera den för att visa streckade linjer från samma datum förra året på alla diagram.',
  },
  'ask-general-ux': {
    en: 'This app follows modern UX principles: progressive disclosure (summary first, details on demand), consistent visual language, responsive design, dark mode, internationalization (EN/SV), and helpful feedback states. Check the Recommendations tab for a detailed UX analysis.',
    sv: 'Denna app följer moderna UX-principer: progressiv avslöjning (sammanfattning först, detaljer på begäran), konsekvent visuellt språk, responsiv design, mörkt läge, internationalisering (EN/SV) och hjälpsamma återkopplingsstatus.',
  },
  'ask-what-is-this': {
    en: 'I\'m the UX Expert Agent! I can: 1) Analyze this app\'s UX and give recommendations, 2) Help you navigate and use features, 3) Research the latest UX trends from the web, 4) Build a growing knowledge base of UX best practices. Try asking about accessibility, charts, or say "analyze" to run an audit!',
    sv: 'Jag är UX Expert Agent! Jag kan: 1) Analysera denna apps UX och ge rekommendationer, 2) Hjälpa dig navigera och använda funktioner, 3) Forska om de senaste UX-trenderna från webben, 4) Bygga en växande kunskapsbas med UX-metoder. Fråga om tillgänglighet, diagram, eller säg "analysera" för att köra en granskning!',
  },
  'trigger-analysis': {
    en: 'Running UX analysis now! I\'ll evaluate the app across 6 categories: Accessibility, Navigation, Visual Design, Performance, Mobile, and Data Visualization. Check the Recommendations tab for results.',
    sv: 'Kör UX-analys nu! Jag utvärderar appen över 6 kategorier: Tillgänglighet, Navigering, Visuell Design, Prestanda, Mobil och Datavisualisering. Kolla fliken Rekommendationer för resultat.',
  },
  'trigger-research': {
    en: 'Starting web research! I\'ll fetch the latest UX articles and insights from trusted sources like Nielsen Norman Group, Smashing Magazine, web.dev, and more. New findings will appear in the Knowledge tab.',
    sv: 'Startar webbforskning! Jag hämtar de senaste UX-artiklarna och insikterna från pålitliga källor som Nielsen Norman Group, Smashing Magazine, web.dev med flera. Nya fynd visas i fliken Kunskap.',
  },
  unknown: {
    en: 'I\'m not sure I understand that. Here\'s what I can help with:\n- Ask about **accessibility**, **navigation**, **charts**, **dark mode**, or **mobile** design\n- Say **"how do I compare weather?"** for a feature walkthrough\n- Say **"analyze"** to run a UX audit\n- Say **"research"** to find the latest UX trends\n- Say **"what is this?"** to learn more about me',
    sv: 'Jag är inte säker på att jag förstår. Här är vad jag kan hjälpa till med:\n- Fråga om **tillgänglighet**, **navigering**, **diagram**, **mörkt läge** eller **mobil** design\n- Säg **"hur jämför jag väder?"** för en funktionsgenomgång\n- Säg **"analysera"** för att köra en UX-granskning\n- Säg **"forskning"** för att hitta de senaste UX-trenderna',
  },
};

/**
 * Generate a response to a user message, including relevant knowledge.
 */
export function generateResponse(
  intent: UserIntent,
  language: Language,
  knowledge: UXKnowledgeEntry[],
  _analysis: AppAnalysisResult | null,
): ChatMessage {
  const template = RESPONSES[intent] || RESPONSES.unknown;
  let text = language === 'sv' ? template.sv : template.en;

  // Augment with relevant knowledge entries for UX-topic intents
  const categoryMap: Partial<Record<UserIntent, string>> = {
    'ask-accessibility': 'accessibility',
    'ask-navigation': 'navigation',
    'ask-charts': 'data-visualization',
    'ask-mobile': 'mobile',
    'ask-performance': 'performance',
    'ask-dark-mode': 'visual-design',
    'ask-general-ux': 'general',
  };

  const relevantCategory = categoryMap[intent];
  if (relevantCategory && knowledge.length > 0) {
    const relevant = knowledge
      .filter((k) => k.category === relevantCategory && k.source === 'web-research')
      .slice(0, 2);

    if (relevant.length > 0) {
      const label = language === 'sv' ? '\n\nFrån kunskapsbasen:' : '\n\nFrom the knowledge base:';
      text += label;
      for (const entry of relevant) {
        text += `\n- **${entry.title}**: ${entry.description.slice(0, 120)}...`;
      }
    }
  }

  return createMessage('agent', text);
}

/**
 * Create a welcome message for new chat sessions.
 */
export function createWelcomeMessage(language: Language): ChatMessage {
  const text =
    language === 'sv'
      ? 'Hej! Jag är din UX-assistent. Jag kan analysera denna app, forska om UX-metoder och hjälpa dig navigera. Vad vill du veta?'
      : "Hello! I'm your UX assistant. I can analyze this app, research UX best practices, and help you navigate. What would you like to know?";
  return createMessage('agent', text);
}

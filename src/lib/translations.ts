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
  'comparison.showHistorical': 'Show last year\'s weather',
  'comparison.loadingHistorical': 'Loading historical data...',

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
  'comparison.showHistorical': 'Visa förra årets väder',
  'comparison.loadingHistorical': 'Laddar historisk data...',

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
};

export const translations: Record<Language, TranslationMap> = { en, sv };

'use client';

import { useState } from 'react';

type Language = 'en' | 'sv';

const content = {
  en: {
    title: 'User Guide',
    subtitle: 'How to use Weather Compare',
    sections: [
      {
        title: 'Getting Started',
        content: `Weather Compare allows you to compare weather forecasts for two Swedish locations side by side. Simply search for locations, select them, and click "Compare Weather" to see the forecast comparison.`,
      },
      {
        title: 'Searching for Locations',
        content: `Click on either location input field and start typing the name of a Swedish city or town. As you type, suggestions will appear. Click on a suggestion to select it. The map will update to show your selected locations.`,
      },
      {
        title: 'Favorites',
        content: `You can save your frequently used locations as favorites:
• When search results appear, click the star icon (★) next to a location to add it to your favorites
• Click the star again to remove it from favorites
• Your favorites appear at the top of the dropdown when you click on an empty input field
• Click "Edit" to manage your favorites and remove locations you no longer need`,
      },
      {
        title: 'Recent Locations',
        content: `The app automatically remembers your recently selected locations:
• Up to 5 recent locations are saved
• They appear below your favorites when you click on an empty input field
• Simply click on a recent location to select it quickly`,
      },
      {
        title: 'Comparing Weather',
        content: `Once you've selected two locations:
1. Click the "Compare Weather" button
2. The app will fetch forecast data from SMHI (Swedish Meteorological and Hydrological Institute)
3. View temperature, wind speed, humidity, and precipitation comparisons
4. Use the interactive charts to explore the data`,
      },
      {
        title: 'Dark Mode',
        content: `Click the sun/moon icon in the top right corner to switch between light and dark mode. Your preference is saved automatically.`,
      },
    ],
  },
  sv: {
    title: 'Användarguide',
    subtitle: 'Hur man använder Weather Compare',
    sections: [
      {
        title: 'Komma igång',
        content: `Weather Compare låter dig jämföra väderprognoser för två svenska platser sida vid sida. Sök helt enkelt efter platser, välj dem och klicka på "Compare Weather" för att se prognos­jämförelsen.`,
      },
      {
        title: 'Söka efter platser',
        content: `Klicka på något av platsfälten och börja skriva namnet på en svensk stad eller ort. När du skriver visas förslag. Klicka på ett förslag för att välja det. Kartan uppdateras för att visa dina valda platser.`,
      },
      {
        title: 'Favoriter',
        content: `Du kan spara dina vanligaste platser som favoriter:
• När sökresultat visas, klicka på stjärnikonen (★) bredvid en plats för att lägga till den i dina favoriter
• Klicka på stjärnan igen för att ta bort den från favoriter
• Dina favoriter visas högst upp i rullgardinsmenyn när du klickar på ett tomt inmatningsfält
• Klicka på "Edit" för att hantera dina favoriter och ta bort platser du inte längre behöver`,
      },
      {
        title: 'Senaste platser',
        content: `Appen kommer automatiskt ihåg dina senast valda platser:
• Upp till 5 senaste platser sparas
• De visas under dina favoriter när du klickar på ett tomt inmatningsfält
• Klicka helt enkelt på en senaste plats för att snabbt välja den`,
      },
      {
        title: 'Jämföra väder',
        content: `När du har valt två platser:
1. Klicka på knappen "Compare Weather"
2. Appen hämtar prognosdata från SMHI (Sveriges meteorologiska och hydrologiska institut)
3. Se jämförelser av temperatur, vindhastighet, luftfuktighet och nederbörd
4. Använd de interaktiva diagrammen för att utforska datan`,
      },
      {
        title: 'Mörkt läge',
        content: `Klicka på sol-/månikonen i det övre högra hörnet för att växla mellan ljust och mörkt läge. Din inställning sparas automatiskt.`,
      },
    ],
  },
};

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const t = content[language];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Open user guide"
        title="User Guide"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language toggle */}
                  <div className="flex rounded-lg border border-gray-200 p-1 dark:border-gray-600">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        language === 'en'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('sv')}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        language === 'sv'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      SV
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    aria-label="Close"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-4 text-left" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="space-y-6">
                {t.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {index + 1}
                      </span>
                      {section.title}
                    </h3>
                    <p className="whitespace-pre-line pl-8 text-left text-gray-600 dark:text-gray-300">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                {language === 'en' ? 'Got it!' : 'Jag förstår!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

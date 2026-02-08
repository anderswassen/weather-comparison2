import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserGuide } from './UserGuide';
import { LanguageProvider } from '@/context/LanguageContext';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

function renderWithProvider(presetLanguage?: string) {
  localStorageMock.clear();
  localStorageMock.getItem.mockReset();
  const lang = presetLanguage ?? 'sv';
  localStorageMock.getItem.mockImplementation((key: string) =>
    key === 'language-preference' ? lang : null
  );
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  return render(
    <LanguageProvider>
      <UserGuide />
    </LanguageProvider>
  );
}

describe('UserGuide', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockReset();
    localStorageMock.getItem.mockImplementation(() => null);
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders the help button', () => {
    renderWithProvider();

    expect(screen.getByLabelText('Öppna användarguide')).toBeInTheDocument();
  });

  it('opens modal when help button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));

    expect(screen.getByText('Användarguide')).toBeInTheDocument();
    expect(screen.getByText('Hur man använder Weather Compare')).toBeInTheDocument();
  });

  it('shows Swedish content by default', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));

    expect(screen.getByText('Komma igång')).toBeInTheDocument();
    expect(screen.getByText('Söka efter platser')).toBeInTheDocument();
    expect(screen.getByText('Favoriter')).toBeInTheDocument();
  });

  it('shows English content when language is en', async () => {
    const user = userEvent.setup();
    renderWithProvider('en');

    await user.click(screen.getByLabelText('Open user guide'));

    expect(screen.getByText('User Guide')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Searching for Locations')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));
    expect(screen.getByText('Användarguide')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Stäng'));

    expect(screen.queryByText('Användarguide')).not.toBeInTheDocument();
  });

  it('closes modal when "Jag förstår!" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));
    await user.click(screen.getByText('Jag förstår!'));

    expect(screen.queryByText('Användarguide')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));
    expect(screen.getByText('Användarguide')).toBeInTheDocument();

    // Click the backdrop (the blur overlay)
    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop!);

    expect(screen.queryByText('Användarguide')).not.toBeInTheDocument();
  });

  it('shows English close button text when language is en', async () => {
    const user = userEvent.setup();
    renderWithProvider('en');

    await user.click(screen.getByLabelText('Open user guide'));

    expect(screen.getByText('Got it!')).toBeInTheDocument();
  });

  it('displays all 6 sections', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Öppna användarguide'));

    // Check for numbered section badges (1-6)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});

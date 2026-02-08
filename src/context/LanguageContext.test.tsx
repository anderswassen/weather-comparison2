import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="translated">{t('page.title')}</span>
      <span data-testid="interpolated">{t('location.removeFavoriteAria', { name: 'Stockholm' })}</span>
      <span data-testid="missing-key">{t('nonexistent.key')}</span>
      <button onClick={() => setLanguage('sv')}>Switch to SV</button>
      <button onClick={() => setLanguage('en')}>Switch to EN</button>
    </div>
  );
}

describe('LanguageContext', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.getItem.mockImplementation((key: string) => null);
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to Swedish', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('sv');
  });

  it('uses stored preference from localStorage', () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === 'language-preference' ? 'en' : null
    );

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
  });

  it('persists language preference to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      screen.getByText('Switch to EN').click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('language-preference', 'en');
  });

  it('translates keys correctly in Swedish', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('translated')).toHaveTextContent('Weather Compare');
    expect(screen.getByTestId('interpolated')).toHaveTextContent('Ta bort Stockholm från favoriter');
  });

  it('translates keys correctly in English', () => {
    localStorageMock.getItem.mockImplementation((key: string) =>
      key === 'language-preference' ? 'en' : null
    );

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('translated')).toHaveTextContent('Weather Compare');
    expect(screen.getByTestId('interpolated')).toHaveTextContent('Remove Stockholm from favorites');
  });

  it('supports interpolation', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('interpolated')).toHaveTextContent('Ta bort Stockholm från favoriter');
  });

  it('falls back to key itself for missing keys', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('missing-key')).toHaveTextContent('nonexistent.key');
  });

  it('switches language dynamically', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('sv');

    act(() => {
      screen.getByText('Switch to EN').click();
    });

    expect(screen.getByTestId('language')).toHaveTextContent('en');

    act(() => {
      screen.getByText('Switch to SV').click();
    });

    expect(screen.getByTestId('language')).toHaveTextContent('sv');
  });

  it('updates document.documentElement.lang', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(document.documentElement.lang).toBe('sv');

    act(() => {
      screen.getByText('Switch to EN').click();
    });

    expect(document.documentElement.lang).toBe('en');
  });

  it('throws error when useLanguage is used outside LanguageProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useLanguage must be used within a LanguageProvider'
    );

    consoleError.mockRestore();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';
import { LanguageProvider } from '@/context/LanguageContext';

describe('LoadingSpinner', () => {
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
    localStorageMock.getItem.mockImplementation(() => null);
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders with default message', () => {
    render(
      <LanguageProvider>
        <LoadingSpinner />
      </LanguageProvider>
    );

    expect(screen.getByText('Laddar...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(
      <LanguageProvider>
        <LoadingSpinner message="Fetching weather data..." />
      </LanguageProvider>
    );

    expect(screen.getByText('Fetching weather data...')).toBeInTheDocument();
  });

  it('renders the spinning element', () => {
    render(
      <LanguageProvider>
        <LoadingSpinner />
      </LanguageProvider>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

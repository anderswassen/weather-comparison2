import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';

describe('ThemeToggle', () => {
  const matchMediaMock = (matches: boolean) =>
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

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
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    document.documentElement.classList.remove('dark');
  });

  it('renders a button', () => {
    window.matchMedia = matchMediaMock(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has correct aria-label in light mode', () => {
    window.matchMedia = matchMediaMock(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to dark mode'
    );
  });

  it('has correct aria-label in dark mode', () => {
    window.matchMedia = matchMediaMock(true);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to light mode'
    );
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    window.matchMedia = matchMediaMock(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    await user.click(button);

    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('renders moon icon in light mode', () => {
    window.matchMedia = matchMediaMock(false);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Moon icon has the specific path for the crescent shape
    expect(svg?.querySelector('path')?.getAttribute('d')).toContain('20.354');
  });

  it('renders sun icon in dark mode', () => {
    window.matchMedia = matchMediaMock(true);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Sun icon has the specific path with the circle and rays
    expect(svg?.querySelector('path')?.getAttribute('d')).toContain('12 3v1m0');
  });
});

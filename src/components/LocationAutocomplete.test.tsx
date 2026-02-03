import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationAutocomplete } from './LocationAutocomplete';
import { GeocodeResult } from '@/lib/types';

// Mock the nominatim module
vi.mock('@/lib/nominatim', () => ({
  searchLocations: vi.fn(),
}));

import { searchLocations } from '@/lib/nominatim';

const mockSearchLocations = vi.mocked(searchLocations);

const mockSuggestions: GeocodeResult[] = [
  {
    placeId: 1,
    name: 'Stockholm',
    displayName: 'Stockholm, Stockholms län, Sverige',
    coordinates: { lat: 59.3293, lon: 18.0686 },
  },
  {
    placeId: 2,
    name: 'Stockholms-Näs',
    displayName: 'Stockholms-Näs, Stockholms län, Sverige',
    coordinates: { lat: 59.4, lon: 18.1 },
  },
  {
    placeId: 3,
    name: 'Stockholm-Arlanda',
    displayName: 'Stockholm-Arlanda, Stockholms län, Sverige',
    coordinates: { lat: 59.6519, lon: 17.9186 },
  },
];

describe('LocationAutocomplete', () => {
  const defaultProps = {
    label: 'Location',
    selectedLocation: null,
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchLocations.mockResolvedValue(mockSuggestions);
  });

  it('renders with label and placeholder', () => {
    render(<LocationAutocomplete {...defaultProps} placeholder="Search location" />);

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search location')).toBeInTheDocument();
  });

  it('shows suggestions when typing', async () => {
    const user = userEvent.setup();
    render(<LocationAutocomplete {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stock');

    await waitFor(() => {
      expect(screen.getByText('Stockholm')).toBeInTheDocument();
    });
  });

  it('calls onSelect when clicking a suggestion', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stock');

    await waitFor(() => {
      expect(screen.getByText('Stockholm')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Stockholm'));

    expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  describe('keyboard navigation', () => {
    it('navigates down with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');

      // First item should be highlighted (has bg-blue-50 class)
      const firstButton = screen.getByText('Stockholm').closest('button');
      expect(firstButton).toHaveClass('bg-blue-50');
    });

    it('navigates up with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Navigate down twice then up once
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');

      const firstButton = screen.getByText('Stockholm').closest('button');
      expect(firstButton).toHaveClass('bg-blue-50');
    });

    it('selects highlighted item with Enter', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Navigate to second item and press Enter
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

      expect(onSelect).toHaveBeenCalledWith(mockSuggestions[1]);
    });

    it('selects first suggestion with Enter when none highlighted', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Press Enter without navigating - should select first item
      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0]);
    });

    it('closes dropdown with Escape', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      expect(screen.queryByText('Stockholm')).not.toBeInTheDocument();
    });
  });

  it('clears selection when user types after selecting', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <LocationAutocomplete
        {...defaultProps}
        onSelect={onSelect}
        selectedLocation={mockSuggestions[0]}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'G');

    // onSelect should be called with null to clear the selection
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('shows loading indicator while searching', async () => {
    const user = userEvent.setup();
    // Make search take longer
    mockSearchLocations.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockSuggestions), 500))
    );

    render(<LocationAutocomplete {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stock');

    // Check for the loading spinner (the spinning div)
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  it('shows multiple locations message when more than one result', async () => {
    const user = userEvent.setup();
    render(<LocationAutocomplete {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stock');

    await waitFor(() => {
      expect(screen.getByText('Multiple locations found - please select one:')).toBeInTheDocument();
    });
  });

  it('does not show multiple locations message for single result', async () => {
    const user = userEvent.setup();
    mockSearchLocations.mockResolvedValue([mockSuggestions[0]]);

    render(<LocationAutocomplete {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stock');

    await waitFor(() => {
      expect(screen.getByText('Stockholm')).toBeInTheDocument();
    });

    expect(screen.queryByText('Multiple locations found - please select one:')).not.toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<LocationAutocomplete {...defaultProps} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});

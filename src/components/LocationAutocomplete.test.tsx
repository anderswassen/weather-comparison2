import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

const mockGoteborg: GeocodeResult = {
  placeId: 100,
  name: 'Göteborg',
  displayName: 'Göteborg, Västra Götalands län, Sverige',
  coordinates: { lat: 57.7089, lon: 11.9746 },
};

const mockMalmo: GeocodeResult = {
  placeId: 101,
  name: 'Malmö',
  displayName: 'Malmö, Skåne län, Sverige',
  coordinates: { lat: 55.6050, lon: 13.0038 },
};

describe('LocationAutocomplete', () => {
  const defaultProps = {
    label: 'Location',
    selectedLocation: null,
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchLocations.mockResolvedValue(mockSuggestions);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
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
      const firstOption = screen.getByText('Stockholm').closest('[role="option"]');
      expect(firstOption).toHaveClass('bg-blue-50');
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

      const firstOption = screen.getByText('Stockholm').closest('[role="option"]');
      expect(firstOption).toHaveClass('bg-blue-50');
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

  describe('favorites and recent locations', () => {
    it('shows empty state message on focus when no favorites or recent', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Search for a location to get started')).toBeInTheDocument();
      });
    });

    it('shows favorites section when favorites exist', async () => {
      // Pre-populate localStorage with favorites
      localStorage.setItem('weather-favorites', JSON.stringify([mockGoteborg]));

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('Göteborg')).toBeInTheDocument();
      });
    });

    it('shows recent section when recent locations exist', async () => {
      // Pre-populate localStorage with recent
      localStorage.setItem('weather-recent', JSON.stringify([mockMalmo]));

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Recent')).toBeInTheDocument();
        expect(screen.getByText('Malmö')).toBeInTheDocument();
      });
    });

    it('adds location to favorites when clicking star button on search result', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Click the star button for Stockholm (first result)
      const starButton = screen.getByLabelText('Add Stockholm to favorites');
      await user.click(starButton);

      // Check localStorage was updated
      const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
      expect(favorites).toHaveLength(1);
      expect(favorites[0].name).toBe('Stockholm');
    });

    it('removes location from favorites when clicking filled star', async () => {
      // Pre-populate with a favorite
      localStorage.setItem('weather-favorites', JSON.stringify([mockSuggestions[0]]));

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Click the star button to remove from favorites
      const starButton = screen.getByLabelText('Remove Stockholm from favorites');
      await user.click(starButton);

      // Check localStorage was updated
      const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
      expect(favorites).toHaveLength(0);
    });

    it('clicking favorite selects it and calls onSelect', async () => {
      localStorage.setItem('weather-favorites', JSON.stringify([mockGoteborg]));

      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Göteborg')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Göteborg'));

      expect(onSelect).toHaveBeenCalledWith(mockGoteborg);
    });

    it('adds location to recent when selected from search results', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Stockholm'));

      // Check localStorage was updated with recent
      const recent = JSON.parse(localStorage.getItem('weather-recent') || '[]');
      expect(recent).toHaveLength(1);
      expect(recent[0].name).toBe('Stockholm');
    });

    it('does not show location in recent if it is also in favorites', async () => {
      // Add the same location to both favorites and recent
      localStorage.setItem('weather-favorites', JSON.stringify([mockGoteborg]));
      localStorage.setItem('weather-recent', JSON.stringify([mockGoteborg]));

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Favorites')).toBeInTheDocument();
      });

      // Should only appear once under favorites
      const goteborgs = screen.getAllByText('Göteborg');
      expect(goteborgs).toHaveLength(1);
    });

    it('shows Edit button for favorites and can remove favorites in edit mode', async () => {
      localStorage.setItem('weather-favorites', JSON.stringify([mockGoteborg]));

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });

      // Click Edit
      await user.click(screen.getByText('Edit'));

      // Should show Done button
      expect(screen.getByText('Done')).toBeInTheDocument();

      // Click remove button
      const removeButton = screen.getByLabelText('Remove Göteborg from favorites');
      await user.click(removeButton);

      // Favorites should be empty
      const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
      expect(favorites).toHaveLength(0);
    });

    it('keyboard navigation works across favorites and recent', async () => {
      localStorage.setItem('weather-favorites', JSON.stringify([mockGoteborg]));
      localStorage.setItem('weather-recent', JSON.stringify([mockMalmo]));

      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Göteborg')).toBeInTheDocument();
        expect(screen.getByText('Malmö')).toBeInTheDocument();
      });

      // Navigate down to highlight Göteborg (favorite)
      await user.keyboard('{ArrowDown}');
      const favoriteOption = screen.getByText('Göteborg').closest('[role="option"]');
      expect(favoriteOption).toHaveClass('bg-blue-50');

      // Navigate down again to highlight Malmö (recent)
      await user.keyboard('{ArrowDown}');
      const recentOption = screen.getByText('Malmö').closest('[role="option"]');
      expect(recentOption).toHaveClass('bg-blue-50');

      // Press Enter to select Malmö
      await user.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledWith(mockMalmo);
    });

    it('recent locations are limited to 5', async () => {
      // Add 5 locations to recent
      const locations: GeocodeResult[] = [];
      for (let i = 0; i < 5; i++) {
        locations.push({
          placeId: 200 + i,
          name: `Location ${i}`,
          displayName: `Location ${i}, Sverige`,
          coordinates: { lat: 59 + i * 0.1, lon: 18 + i * 0.1 },
        });
      }
      localStorage.setItem('weather-recent', JSON.stringify(locations));

      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<LocationAutocomplete {...defaultProps} onSelect={onSelect} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Stock');

      await waitFor(() => {
        expect(screen.getByText('Stockholm')).toBeInTheDocument();
      });

      // Select Stockholm - should be added to front of recent, pushing out the oldest
      await user.click(screen.getByText('Stockholm'));

      const recent = JSON.parse(localStorage.getItem('weather-recent') || '[]');
      expect(recent).toHaveLength(5);
      expect(recent[0].name).toBe('Stockholm'); // Newest is first
      expect(recent.some((r: GeocodeResult) => r.name === 'Location 4')).toBe(false); // Oldest (Location 4 was at end) pushed out
    });
  });
});

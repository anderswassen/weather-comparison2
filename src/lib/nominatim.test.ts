import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isWithinSweden, searchLocations, geocodeLocation } from './nominatim';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('nominatim', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isWithinSweden', () => {
    it('returns true for Stockholm coordinates', () => {
      expect(isWithinSweden({ lat: 59.3293, lon: 18.0686 })).toBe(true);
    });

    it('returns true for Gothenburg coordinates', () => {
      expect(isWithinSweden({ lat: 57.7089, lon: 11.9746 })).toBe(true);
    });

    it('returns true for Malmö coordinates', () => {
      expect(isWithinSweden({ lat: 55.6050, lon: 13.0038 })).toBe(true);
    });

    it('returns true for Kiruna coordinates (northern Sweden)', () => {
      expect(isWithinSweden({ lat: 67.8558, lon: 20.2253 })).toBe(true);
    });

    it('returns false for coordinates west of Sweden (Atlantic)', () => {
      expect(isWithinSweden({ lat: 59.0, lon: 5.0 })).toBe(false);
    });

    it('returns false for coordinates in central Europe', () => {
      expect(isWithinSweden({ lat: 52.52, lon: 13.405 })).toBe(false);
    });

    it('returns false for Helsinki coordinates (Finland)', () => {
      expect(isWithinSweden({ lat: 60.1699, lon: 24.9384 })).toBe(false);
    });

    it('returns false for coordinates far south of Sweden', () => {
      expect(isWithinSweden({ lat: 50.0, lon: 18.0 })).toBe(false);
    });

    it('returns false for coordinates far north of Sweden', () => {
      expect(isWithinSweden({ lat: 71.0, lon: 18.0 })).toBe(false);
    });

    it('returns true for coordinates at Sweden boundary (edge case)', () => {
      // Test exact boundary values
      expect(isWithinSweden({ lat: 55.0, lon: 10.5 })).toBe(true);
      expect(isWithinSweden({ lat: 69.5, lon: 24.5 })).toBe(true);
    });
  });

  describe('searchLocations', () => {
    const mockNominatimResponse = [
      {
        place_id: 123,
        licence: 'test',
        osm_type: 'node',
        osm_id: 456,
        lat: '59.3293',
        lon: '18.0686',
        class: 'place',
        type: 'city',
        place_rank: 16,
        importance: 0.8,
        addresstype: 'city',
        name: 'Stockholm',
        display_name: 'Stockholm, Stockholms län, Sverige',
        boundingbox: ['59.0', '59.5', '17.5', '18.5'],
      },
    ];

    it('returns empty array for empty query', async () => {
      const result = await searchLocations('');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns empty array for whitespace query', async () => {
      const result = await searchLocations('   ');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('calls fetch with correct parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockNominatimResponse),
      });

      await searchLocations('Stockholm');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/geocode?')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=Stockholm')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('countrycodes=se')
      );
    });

    it('transforms response correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockNominatimResponse),
      });

      const results = await searchLocations('Stockholm');

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        placeId: 123,
        name: 'Stockholm',
        displayName: 'Stockholm, Stockholms län, Sverige',
        coordinates: { lat: 59.3293, lon: 18.0686 },
      });
    });

    it('uses custom limit parameter', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await searchLocations('Stockholm', 5);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5')
      );
    });

    it('throws error on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(searchLocations('Stockholm')).rejects.toThrow(
        'Geocoding failed: Not Found'
      );
    });
  });

  describe('geocodeLocation', () => {
    it('returns first result when found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              place_id: 123,
              licence: 'test',
              osm_type: 'node',
              osm_id: 456,
              lat: '59.3293',
              lon: '18.0686',
              class: 'place',
              type: 'city',
              place_rank: 16,
              importance: 0.8,
              addresstype: 'city',
              name: 'Stockholm',
              display_name: 'Stockholm, Stockholms län, Sverige',
              boundingbox: [],
            },
          ]),
      });

      const result = await geocodeLocation('Stockholm');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Stockholm');
    });

    it('returns null when no results found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await geocodeLocation('NonexistentPlace');

      expect(result).toBeNull();
    });

    it('calls searchLocations with limit of 1', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await geocodeLocation('Stockholm');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=1')
      );
    });
  });
});

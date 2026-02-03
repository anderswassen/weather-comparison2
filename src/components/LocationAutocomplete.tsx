'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { GeocodeResult } from '@/lib/types';
import { searchLocations } from '@/lib/nominatim';

interface LocationAutocompleteProps {
  label: string;
  placeholder?: string;
  selectedLocation: GeocodeResult | null;
  onSelect: (location: GeocodeResult | null) => void;
  disabled?: boolean;
}

export function LocationAutocomplete({
  label,
  placeholder = 'Search for a Swedish location',
  selectedLocation,
  onSelect,
  disabled = false,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update input when selectedLocation changes externally
  useEffect(() => {
    if (selectedLocation) {
      setInputValue(selectedLocation.name);
    }
  }, [selectedLocation]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchLocations(query);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error('Search failed:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSelect(null); // Clear selection when user types

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (location: GeocodeResult) => {
    setInputValue(location.name);
    onSelect(location);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  const formatDisplayName = (displayName: string): string => {
    // Remove "Sverige" from the end as it's redundant
    const parts = displayName.split(', ');
    if (parts[parts.length - 1] === 'Sverige') {
      parts.pop();
    }
    return parts.join(', ');
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        )}
        {selectedLocation && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.length > 1 && (
            <div className="border-b border-gray-100 bg-amber-50 px-4 py-2 text-sm text-amber-700">
              Multiple locations found - please select one:
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-3 text-left transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{suggestion.name}</div>
              <div className="text-sm text-gray-500">
                {formatDisplayName(suggestion.displayName)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

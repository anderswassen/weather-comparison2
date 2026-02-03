'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { GeocodeResult } from '@/lib/types';
import { searchLocations } from '@/lib/nominatim';
import { useLocationStorage } from '@/hooks/useLocationStorage';

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
  const [editingFavorites, setEditingFavorites] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    favorites,
    recent,
    addFavorite,
    removeFavorite,
    isFavorite,
    addRecent,
  } = useLocationStorage();

  // Compute the items to show in favorites/recent view
  const showFavoritesRecent = showDropdown && inputValue.length === 0 && suggestions.length === 0;
  const favoritesRecentItems = showFavoritesRecent
    ? [...favorites, ...recent.filter((r) => !favorites.some((f) => f.placeId === r.placeId))]
    : [];

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
        setEditingFavorites(false);
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
    setEditingFavorites(false);

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length === 0) {
      setSuggestions([]);
      setShowDropdown(true); // Show favorites/recent when cleared
    } else {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    }
  };

  const handleSelect = (location: GeocodeResult) => {
    setInputValue(location.name);
    onSelect(location);
    addRecent(location);
    setShowDropdown(false);
    setSuggestions([]);
    setEditingFavorites(false);
  };

  const handleToggleFavorite = (location: GeocodeResult, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(location.placeId)) {
      removeFavorite(location.placeId);
    } else {
      addFavorite(location);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    const items = showFavoritesRecent ? favoritesRecentItems : suggestions;
    if (items.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < items.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          handleSelect(items[highlightedIndex]);
        } else if (items.length > 0) {
          handleSelect(items[0]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setEditingFavorites(false);
        break;
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const formatDisplayName = (displayName: string): string => {
    // Remove "Sverige" from the end as it's redundant
    const parts = displayName.split(', ');
    if (parts[parts.length - 1] === 'Sverige') {
      parts.pop();
    }
    return parts.join(', ');
  };

  const StarIcon = ({ filled, className = '' }: { filled: boolean; className?: string }) => (
    <svg
      className={`h-5 w-5 ${filled ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} ${className}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  const renderFavoritesRecentDropdown = () => {
    const hasFavorites = favorites.length > 0;
    const hasRecent = recent.length > 0;
    const isEmpty = !hasFavorites && !hasRecent;

    return (
      <div
        ref={dropdownRef}
        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      >
        {isEmpty && (
          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Search for a location to get started
          </div>
        )}

        {hasFavorites && (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span className="mr-1">★</span> Favorites
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFavorites(!editingFavorites);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {editingFavorites ? 'Done' : 'Edit'}
              </button>
            </div>
            {favorites.map((location, index) => (
              <div
                key={`fav-${location.placeId}`}
                onClick={() => !editingFavorites && handleSelect(location)}
                onMouseEnter={() => !editingFavorites && setHighlightedIndex(index)}
                role="option"
                aria-selected={!editingFavorites && index === highlightedIndex}
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                  !editingFavorites && index === highlightedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${editingFavorites ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2">
                  <StarIcon filled={true} />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {location.name}
                  </span>
                </div>
                {editingFavorites && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(location.placeId);
                    }}
                    className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                    aria-label={`Remove ${location.name} from favorites`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {hasRecent && (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span className="mr-1">↻</span> Recent
              </span>
            </div>
            {recent
              .filter((r) => !favorites.some((f) => f.placeId === r.placeId))
              .map((location, index) => {
                const itemIndex = favorites.length + index;
                return (
                  <div
                    key={`recent-${location.placeId}`}
                    onClick={() => handleSelect(location)}
                    onMouseEnter={() => setHighlightedIndex(itemIndex)}
                    role="option"
                    aria-selected={itemIndex === highlightedIndex}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors ${
                      itemIndex === highlightedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 pl-7">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {location.name}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  const renderSearchResultsDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
    >
      {suggestions.length > 1 && (
        <div className="border-b border-gray-100 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-gray-700 dark:bg-amber-900/30 dark:text-amber-400">
          Multiple locations found - please select one:
        </div>
      )}
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.placeId}
          onClick={() => handleSelect(suggestion)}
          onMouseEnter={() => setHighlightedIndex(index)}
          role="option"
          aria-selected={index === highlightedIndex}
          className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors ${
            index === highlightedIndex
              ? 'bg-blue-50 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">{suggestion.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDisplayName(suggestion.displayName)}
            </div>
          </div>
          <button
            onClick={(e) => handleToggleFavorite(suggestion, e)}
            className="ml-2 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-label={isFavorite(suggestion.placeId) ? `Remove ${suggestion.name} from favorites` : `Add ${suggestion.name} to favorites`}
          >
            <StarIcon filled={isFavorite(suggestion.placeId)} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-800 dark:disabled:bg-gray-800"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
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

      {showDropdown && showFavoritesRecent && renderFavoritesRecentDropdown()}
      {showDropdown && suggestions.length > 0 && renderSearchResultsDropdown()}
    </div>
  );
}

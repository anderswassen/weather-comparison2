'use client';

import { useState, useEffect, useCallback } from 'react';
import { GeocodeResult } from '@/lib/types';

const FAVORITES_KEY = 'weather-favorites';
const RECENT_KEY = 'weather-recent';
const MAX_RECENT = 5;

export interface UseLocationStorage {
  favorites: GeocodeResult[];
  recent: GeocodeResult[];
  addFavorite: (location: GeocodeResult) => void;
  removeFavorite: (placeId: number) => void;
  isFavorite: (placeId: number) => boolean;
  addRecent: (location: GeocodeResult) => void;
  clearRecent: () => void;
}

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage might be full or disabled
  }
}

export function useLocationStorage(): UseLocationStorage {
  const [favorites, setFavorites] = useState<GeocodeResult[]>([]);
  const [recent, setRecent] = useState<GeocodeResult[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setFavorites(getStorageItem<GeocodeResult[]>(FAVORITES_KEY, []));
    setRecent(getStorageItem<GeocodeResult[]>(RECENT_KEY, []));
  }, []);

  const addFavorite = useCallback((location: GeocodeResult) => {
    setFavorites((prev) => {
      // Don't add if already exists
      if (prev.some((fav) => fav.placeId === location.placeId)) {
        return prev;
      }
      const updated = [...prev, location];
      setStorageItem(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((placeId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.placeId !== placeId);
      setStorageItem(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (placeId: number) => {
      return favorites.some((fav) => fav.placeId === placeId);
    },
    [favorites]
  );

  const addRecent = useCallback((location: GeocodeResult) => {
    setRecent((prev) => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter((r) => r.placeId !== location.placeId);
      // Add to beginning and limit to MAX_RECENT
      const updated = [location, ...filtered].slice(0, MAX_RECENT);
      setStorageItem(RECENT_KEY, updated);
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    setStorageItem(RECENT_KEY, []);
  }, []);

  return {
    favorites,
    recent,
    addFavorite,
    removeFavorite,
    isFavorite,
    addRecent,
    clearRecent,
  };
}

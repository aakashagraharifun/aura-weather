import { useState, useEffect, useCallback } from 'react';
import type { FavoriteCity, WeatherCondition } from '@/types/weather';

const STORAGE_KEY = 'weather-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  }, [favorites]);

  const addFavorite = useCallback((city: Omit<FavoriteCity, 'id'>) => {
    setFavorites(prev => {
      // Check if already exists
      const exists = prev.some(
        f => f.name === city.name && f.country === city.country
      );
      if (exists) return prev;

      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.name}-${city.country}-${Date.now()}`,
      };
      return [...prev, newFavorite];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const isFavorite = useCallback((name: string, country: string) => {
    return favorites.some(f => f.name === name && f.country === country);
  }, [favorites]);

  const reorderFavorites = useCallback((newOrder: FavoriteCity[]) => {
    setFavorites(newOrder);
  }, []);

  const updateFavoriteCache = useCallback((name: string, country: string, temp: number, condition: WeatherCondition) => {
    setFavorites(prev => prev.map(f => 
      f.name === name && f.country === country
        ? { ...f, cachedTemp: temp, cachedCondition: condition }
        : f
    ));
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    reorderFavorites,
    updateFavoriteCache,
  };
};

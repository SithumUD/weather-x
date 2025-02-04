import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWeatherStore = create(
  persist(
    (set) => ({
      unit: 'celsius',
      recentSearches: [],
      favorites: [],
      toggleUnit: () =>
        set((state) => ({
          unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius',
        })),
      addRecentSearch: (location) =>
        set((state) => ({
          recentSearches: [
            location,
            ...state.recentSearches.filter((l) => l !== location),
          ].slice(0, 5),
        })),
      toggleFavorite: (location) =>
        set((state) => ({
          favorites: state.favorites.includes(location)
            ? state.favorites.filter((l) => l !== location)
            : [...state.favorites, location],
        })),
    }),
    {
      name: 'weather-store',
    }
  )
);

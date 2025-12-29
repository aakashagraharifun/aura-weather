import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherBackground from '@/components/weather/WeatherBackground';
import SearchBar from '@/components/weather/SearchBar';
import CurrentWeather from '@/components/weather/CurrentWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import ThemeToggle from '@/components/weather/ThemeToggle';
import UnitToggle from '@/components/weather/UnitToggle';
import LoadingSkeleton from '@/components/weather/LoadingSkeleton';
import ErrorDisplay from '@/components/weather/ErrorDisplay';
import FavoritesDrawer from '@/components/weather/FavoritesDrawer';
import FavoritesToggle from '@/components/weather/FavoritesToggle';
import LocationPrompt from '@/components/weather/LocationPrompt';
import LocationResetButton from '@/components/weather/LocationResetButton';
import { useWeather, useCitySearch } from '@/hooks/useWeather';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import type { TemperatureUnit, CitySearchResult, FavoriteCity } from '@/types/weather';
const LOCATION_PERMISSION_KEY = 'weather-location-permission';
const Index = () => {
  const {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchByCoords,
    fetchByLocation
  } = useWeather();
  const {
    suggestions,
    isSearching,
    searchCities,
    clearSuggestions
  } = useCitySearch();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    reorderFavorites,
    updateFavoriteCache
  } = useFavorites();
  const {
    isDark,
    toggleTheme
  } = useTheme();
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied' | 'unavailable'>('pending');
  const hasInitialized = useRef(false);

  // Auto-detect location on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const savedPermission = localStorage.getItem(LOCATION_PERMISSION_KEY);
    if (savedPermission === 'granted') {
      // User previously granted permission, try to get location
      attemptGeolocation();
    } else if (savedPermission === 'denied') {
      // User previously denied, use default
      setLocationStatus('denied');
      fetchWeather('Guwahati');
    } else {
      // First visit, show prompt
      setShowLocationPrompt(true);
    }
  }, []);
  const attemptGeolocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      fetchWeather('Guwahati');
      return;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });
      setLocationStatus('granted');
      localStorage.setItem(LOCATION_PERMISSION_KEY, 'granted');
      fetchByCoords(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      console.error('Geolocation error:', err);
      setLocationStatus('denied');
      localStorage.setItem(LOCATION_PERMISSION_KEY, 'denied');
      fetchWeather('Guwahati');
    }
  };
  const handleLocationPermission = (allowed: boolean) => {
    setShowLocationPrompt(false);
    if (allowed) {
      attemptGeolocation();
    } else {
      setLocationStatus('denied');
      localStorage.setItem(LOCATION_PERMISSION_KEY, 'denied');
      fetchWeather('Guwahati');
    }
  };

  const handleResetLocation = () => {
    localStorage.removeItem(LOCATION_PERMISSION_KEY);
    hasInitialized.current = false;
    setShowLocationPrompt(true);
  };

  const handleChangeDefaultCity = (city: string) => {
    localStorage.setItem(LOCATION_PERMISSION_KEY, 'denied');
    setLocationStatus('denied');
    fetchWeather(city);
  };

  // Update cached weather data for current city in favorites
  useEffect(() => {
    if (weather) {
      updateFavoriteCache(weather.current.location, weather.current.country, weather.current.temperature, weather.current.condition);
    }
  }, [weather, updateFavoriteCache]);
  const handleSearch = (city: string) => {
    fetchWeather(city);
    clearSuggestions();
  };
  const handleSelectCity = (city: CitySearchResult) => {
    fetchByCoords(city.lat, city.lon);
    clearSuggestions();
  };
  const handleSelectFavorite = (city: FavoriteCity) => {
    // Use coordinates if available, otherwise fall back to city name
    if (city.lat !== 0 || city.lon !== 0) {
      fetchByCoords(city.lat, city.lon);
    } else {
      fetchWeather(city.name);
    }
  };
  const handleLocationRequest = () => {
    fetchByLocation();
  };
  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };
  const handleToggleFavorite = () => {
    if (!weather) return;
    if (isFavorite(weather.current.location, weather.current.country)) {
      const fav = favorites.find(f => f.name === weather.current.location && f.country === weather.current.country);
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite({
        name: weather.current.location,
        country: weather.current.country,
        lat: weather.current.lat,
        lon: weather.current.lon,
        cachedTemp: weather.current.temperature,
        cachedCondition: weather.current.condition
      });
    }
  };

  // Default to sunny for initial background
  const condition = weather?.current.condition || 'sunny';
  const isDay = weather?.current.isDay ?? true;
  return <div className="min-h-screen relative overflow-hidden">
      {/* Location Permission Prompt */}
      {showLocationPrompt && <LocationPrompt onAllow={() => handleLocationPermission(true)} onDeny={() => handleLocationPermission(false)} />}

      {/* Animated Background */}
      <WeatherBackground condition={condition} isDay={isDay} />

      {/* Favorites Drawer */}
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} favorites={favorites} onSelectCity={handleSelectFavorite} onRemoveFavorite={removeFavorite} onReorderFavorites={reorderFavorites} currentCity={weather?.current.location} />

      {/* Main Content */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8
    }} className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <motion.h1 initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="text-xl font-semibold text-white text-shadow-soft">Sky Weather</motion.h1>
            
            {/* Favorites Toggle Button */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2
          }}>
              <FavoritesToggle onClick={() => setIsFavoritesOpen(true)} favoriteCount={favorites.length} />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-3">
            <LocationResetButton
              onResetLocation={handleResetLocation}
              onChangeDefault={handleChangeDefaultCity}
              currentCity={weather?.current.location}
            />
            <UnitToggle unit={unit} onToggle={toggleUnit} />
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 md:px-6 mb-6">
          <SearchBar onSearch={handleSearch} onSelectCity={handleSelectCity} onLocationRequest={handleLocationRequest} isLoading={isLoading} suggestions={suggestions} isSearching={isSearching} onQueryChange={searchCities} onClearSuggestions={clearSuggestions} />
        </div>

        {/* Content Area */}
        <main className="px-4 md:px-6 pb-12">
          <AnimatePresence mode="wait">
            {isLoading ? <LoadingSkeleton key="loading" /> : error ? <ErrorDisplay key="error" message={error} onRetry={() => fetchWeather('Guwahati')} /> : weather ? <motion.div key="weather" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="max-w-2xl mx-auto space-y-8">
                <CurrentWeather weather={weather.current} unit={unit} isFavorite={isFavorite(weather.current.location, weather.current.country)} onToggleFavorite={handleToggleFavorite} onOpenFavorites={() => setIsFavoritesOpen(true)} />
                <HourlyForecast forecast={weather.hourly} unit={unit} />
                <DailyForecast forecast={weather.daily} unit={unit} />
              </motion.div> : null}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>;
};
export default Index;
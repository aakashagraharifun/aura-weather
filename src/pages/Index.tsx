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
import { useWeather } from '@/hooks/useWeather';
import { useTheme } from '@/hooks/useTheme';
import type { TemperatureUnit } from '@/types/weather';

const Index = () => {
  const { weather, isLoading, error, fetchWeather, fetchByLocation } = useWeather();
  const { isDark, toggleTheme } = useTheme();
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const hasInitialized = useRef(false);

  // Load default city on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchWeather('San Francisco');
    }
  }, []);

  const handleSearch = (city: string) => {
    fetchWeather(city);
  };

  const handleLocationRequest = () => {
    fetchByLocation();
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  // Default to sunny for initial background
  const condition = weather?.current.condition || 'sunny';
  const isDay = weather?.current.isDay ?? true;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <WeatherBackground condition={condition} isDay={isDay} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 min-h-screen"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold text-white text-shadow-soft"
          >
            Weather
          </motion.h1>
          
          <div className="flex items-center gap-3">
            <UnitToggle unit={unit} onToggle={toggleUnit} />
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 md:px-6 mb-8">
          <SearchBar
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
            isLoading={isLoading}
          />
        </div>

        {/* Content Area */}
        <main className="px-4 md:px-6 pb-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton key="loading" />
            ) : error ? (
              <ErrorDisplay
                key="error"
                message={error}
                onRetry={() => fetchWeather('San Francisco')}
              />
            ) : weather ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <CurrentWeather weather={weather.current} unit={unit} />
                <HourlyForecast forecast={weather.hourly} unit={unit} />
                <DailyForecast forecast={weather.daily} unit={unit} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default Index;

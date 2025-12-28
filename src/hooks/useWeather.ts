import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { WeatherData, WeatherCondition, CitySearchResult } from '@/types/weather';

// Map OpenWeatherMap icon codes to our weather conditions
const mapWeatherCondition = (iconCode: string, weatherId: number): WeatherCondition => {
  const isNight = iconCode.endsWith('n');
  
  // Thunderstorm (200-299)
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
  // Drizzle & Rain (300-599)
  if (weatherId >= 300 && weatherId < 600) return 'rainy';
  // Snow (600-699)
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  // Atmosphere/Mist (700-799)
  if (weatherId >= 700 && weatherId < 800) return 'mist';
  // Clear (800)
  if (weatherId === 800) return isNight ? 'night' : 'sunny';
  // Clouds (801-804)
  if (weatherId > 800) return isNight ? 'night-cloudy' : 'cloudy';
  
  return isNight ? 'night' : 'sunny';
};

const parseWeatherData = (current: any, forecast: any): WeatherData => {
  const now = new Date();
  const isDay = current.weather[0].icon.endsWith('d');
  
  // Parse current weather
  const currentWeather = {
    location: current.name,
    country: current.sys.country,
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: mapWeatherCondition(current.weather[0].icon, current.weather[0].id),
    conditionText: current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1),
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
    pressure: current.main.pressure,
    visibility: Math.round((current.visibility || 10000) / 1000), // meters to km
    uvIndex: 0, // Not available in free API
    isDay,
    icon: current.weather[0].icon,
  };

  // Parse hourly forecast (3-hour intervals from forecast API)
  const hourlyData = forecast.list.slice(0, 8).map((item: any) => {
    const time = new Date(item.dt * 1000);
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature: Math.round(item.main.temp),
      condition: mapWeatherCondition(item.weather[0].icon, item.weather[0].id),
      conditionText: item.weather[0].description,
      precipChance: Math.round((item.pop || 0) * 100),
      icon: item.weather[0].icon,
    };
  });

  // Parse daily forecast (group by day)
  const dailyMap = new Map<string, any[]>();
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = now.toISOString().split('T')[0];
  
  const dailyData = Array.from(dailyMap.entries()).slice(0, 5).map(([date, items], index) => {
    const temps = items.map((i: any) => i.main.temp);
    const dateObj = new Date(date);
    // Get the most common weather condition for the day
    const midDayItem = items.find((i: any) => {
      const hour = new Date(i.dt * 1000).getHours();
      return hour >= 11 && hour <= 14;
    }) || items[Math.floor(items.length / 2)];
    
    return {
      date,
      dayName: date === todayStr ? 'Today' : days[dateObj.getDay()],
      tempMax: Math.round(Math.max(...temps)),
      tempMin: Math.round(Math.min(...temps)),
      condition: mapWeatherCondition(midDayItem.weather[0].icon, midDayItem.weather[0].id),
      conditionText: midDayItem.weather[0].description,
      precipChance: Math.round(Math.max(...items.map((i: any) => (i.pop || 0) * 100))),
      icon: midDayItem.weather[0].icon,
    };
  });

  return {
    current: currentWeather,
    hourly: hourlyData,
    daily: dailyData,
  };
};

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('weather', {
        body: { action: 'weather', city },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      const weatherData = parseWeatherData(data.current, data.forecast);
      setWeather(weatherData);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('weather', {
        body: { action: 'weather', lat, lon },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      const weatherData = parseWeatherData(data.current, data.forecast);
      setWeather(weatherData);
    } catch (err) {
      console.error('Failed to fetch weather by coords:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      await fetchByCoords(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      console.error('Location error:', err);
      setError('Unable to get your location. Please enable location services.');
      setIsLoading(false);
    }
  }, [fetchByCoords]);

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchByCoords,
    fetchByLocation,
  };
};

export const useCitySearch = () => {
  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('weather', {
        body: { action: 'search', city: query },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setSuggestions(data.cities || []);
    } catch (err) {
      console.error('City search error:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isSearching,
    searchCities,
    clearSuggestions,
  };
};

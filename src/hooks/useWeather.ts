import { useState, useCallback } from 'react';
import type { WeatherData, WeatherCondition } from '@/types/weather';

// Mock weather data generator
const generateMockWeather = (city: string): WeatherData => {
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'thunderstorm', 'snow'];
  const conditionTexts: Record<WeatherCondition, string> = {
    sunny: 'Clear Sky',
    cloudy: 'Partly Cloudy',
    rainy: 'Light Rain',
    thunderstorm: 'Thunderstorm',
    snow: 'Light Snow',
    night: 'Clear Night',
    'night-cloudy': 'Cloudy Night',
    mist: 'Misty',
  };

  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 20;
  
  // Randomize based on city name for variety
  const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const conditionIndex = seed % conditions.length;
  let condition = conditions[conditionIndex];
  
  // Adjust for night time
  if (!isDay && condition === 'sunny') {
    condition = 'night';
  } else if (!isDay && condition === 'cloudy') {
    condition = 'night-cloudy';
  }

  const baseTemp = 15 + (seed % 20);
  
  const hourlyData: WeatherData['hourly'] = Array.from({ length: 24 }, (_, i) => {
    const forecastHour = (hour + i) % 24;
    const isForecastDay = forecastHour >= 6 && forecastHour < 20;
    let hourCondition = conditions[(conditionIndex + Math.floor(i / 6)) % conditions.length];
    
    if (!isForecastDay && hourCondition === 'sunny') {
      hourCondition = 'night';
    }
    
    return {
      time: `${forecastHour.toString().padStart(2, '0')}:00`,
      temperature: Math.round(baseTemp + Math.sin(forecastHour / 3) * 5),
      condition: hourCondition,
      conditionText: conditionTexts[hourCondition],
      precipChance: Math.round(Math.random() * 100),
    };
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData: WeatherData['daily'] = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayCondition = conditions[(conditionIndex + i) % conditions.length];
    
    return {
      date: date.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : days[date.getDay()],
      tempMax: Math.round(baseTemp + 5 + Math.random() * 3),
      tempMin: Math.round(baseTemp - 3 - Math.random() * 3),
      condition: dayCondition,
      conditionText: conditionTexts[dayCondition],
      precipChance: Math.round(Math.random() * 100),
    };
  });

  return {
    current: {
      location: city,
      country: city === 'Tokyo' ? 'Japan' : city === 'Paris' ? 'France' : city === 'Sydney' ? 'Australia' : 'USA',
      temperature: baseTemp,
      feelsLike: baseTemp - 2 + Math.round(Math.random() * 4),
      condition,
      conditionText: conditionTexts[condition],
      humidity: 40 + Math.round(Math.random() * 40),
      windSpeed: 5 + Math.round(Math.random() * 20),
      pressure: 1010 + Math.round(Math.random() * 20),
      visibility: 8 + Math.round(Math.random() * 7),
      uvIndex: isDay ? 1 + Math.round(Math.random() * 10) : 0,
      isDay,
    },
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock error for unknown cities
    if (city.toLowerCase() === 'unknown' || city.length < 2) {
      setError('City not found. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const data = generateMockWeather(city);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data.');
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

      // In a real app, we'd reverse geocode. For demo, use a mock city
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCities = ['San Francisco', 'New York', 'London', 'Tokyo', 'Sydney'];
      const randomCity = mockCities[Math.floor(Math.random() * mockCities.length)];
      
      const data = generateMockWeather(randomCity);
      setWeather(data);
    } catch (err) {
      setError('Unable to get your location. Please enable location services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchByLocation,
  };
};

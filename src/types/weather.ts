export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'thunderstorm' 
  | 'snow' 
  | 'night' 
  | 'night-cloudy'
  | 'mist';

export interface CurrentWeather {
  location: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  conditionText: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  isDay: boolean;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  conditionText: string;
  precipChance: number;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  conditionText: string;
  precipChance: number;
  icon: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface CitySearchResult {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  cachedTemp?: number;
  cachedCondition?: WeatherCondition;
}

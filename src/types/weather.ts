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
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  conditionText: string;
  precipChance: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  conditionText: string;
  precipChance: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

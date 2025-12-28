import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Droplets, Wind, Gauge, Eye } from 'lucide-react';
import type { CurrentWeather as CurrentWeatherType, TemperatureUnit } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  unit: TemperatureUnit;
}

const convertTemp = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return temp;
};

const CurrentWeather = ({ weather, unit }: CurrentWeatherProps) => {
  const temp = convertTemp(weather.temperature, unit);
  const feelsLike = convertTemp(weather.feelsLike, unit);

  const stats = [
    { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${weather.windSpeed} km/h` },
    { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa` },
    { icon: Eye, label: 'Visibility', value: `${weather.visibility} km` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center text-white"
    >
      {/* Location */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-2"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-shadow-soft">
          {weather.location}
        </h1>
        <p className="text-white/70 text-sm">{weather.country}</p>
      </motion.div>

      {/* Main Temperature */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
        className="flex items-center justify-center gap-4 my-8"
      >
        <WeatherIcon condition={weather.condition} size="xl" />
        <div className="text-8xl md:text-9xl font-light tracking-tighter text-shadow-glow">
          <CountUp end={temp} duration={1.5} />°
        </div>
      </motion.div>

      {/* Condition & Feels Like */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <p className="text-xl md:text-2xl font-medium mb-1">{weather.conditionText}</p>
        <p className="text-white/70">
          Feels like <span className="font-medium">{feelsLike}°</span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="glass-card p-4"
          >
            <stat.icon className="w-5 h-5 text-white/70 mx-auto mb-2" />
            <p className="text-lg font-semibold">{stat.value}</p>
            <p className="text-xs text-white/60">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CurrentWeather;

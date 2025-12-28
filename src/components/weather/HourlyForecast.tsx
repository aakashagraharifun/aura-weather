import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { HourlyForecast as HourlyForecastType, TemperatureUnit } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
  unit: TemperatureUnit;
}

const convertTemp = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return temp;
};

const HourlyForecast = ({ forecast, unit }: HourlyForecastProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="w-full"
    >
      <h2 className="text-white/80 text-sm font-medium mb-3 px-1">HOURLY FORECAST</h2>
      
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        {forecast.slice(0, 24).map((hour, index) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.05 }}
            className="flex-shrink-0 glass-card p-4 min-w-[80px] text-center text-white"
          >
            <p className="text-xs text-white/60 mb-2">
              {index === 0 ? 'Now' : hour.time}
            </p>
            <div className="my-2">
              <WeatherIcon condition={hour.condition} size="sm" animated={false} />
            </div>
            <p className="text-lg font-semibold">
              {convertTemp(hour.temperature, unit)}°
            </p>
            {hour.precipChance > 30 && (
              <p className="text-xs text-blue-300 mt-1">{hour.precipChance}%</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;

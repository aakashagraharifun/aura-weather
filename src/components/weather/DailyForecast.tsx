import { motion } from 'framer-motion';
import type { DailyForecast as DailyForecastType, TemperatureUnit } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  forecast: DailyForecastType[];
  unit: TemperatureUnit;
}

const convertTemp = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return temp;
};

const DailyForecast = ({ forecast, unit }: DailyForecastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      className="w-full"
    >
      <h2 className="text-white/80 text-sm font-medium mb-3 px-1">5-DAY FORECAST</h2>
      
      <div className="glass-card divide-y divide-white/10">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="flex items-center justify-between p-4 text-white"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="w-12 text-sm font-medium">{day.dayName}</span>
              <div className="flex items-center gap-2">
                <WeatherIcon condition={day.condition} size="sm" animated={false} />
                {day.precipChance > 30 && (
                  <span className="text-xs text-blue-300">{day.precipChance}%</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm w-10 text-right">
                {convertTemp(day.tempMin, unit)}°
              </span>
              <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-300 to-orange-300 rounded-full"
                />
              </div>
              <span className="font-semibold w-10 text-right">
                {convertTemp(day.tempMax, unit)}°
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyForecast;

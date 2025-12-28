import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import type { WeatherCondition } from '@/types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
};

const WeatherIcon = ({ condition, size = 'md', animated = true }: WeatherIconProps) => {
  const iconSize = sizeMap[size];
  
  const getIcon = () => {
    switch (condition) {
      case 'sunny':
        return <Sun size={iconSize} className="text-yellow-300 drop-shadow-lg" />;
      case 'night':
        return <Moon size={iconSize} className="text-blue-100 drop-shadow-lg" />;
      case 'cloudy':
      case 'night-cloudy':
        return <Cloud size={iconSize} className="text-gray-200 drop-shadow-lg" />;
      case 'rainy':
        return <CloudRain size={iconSize} className="text-blue-200 drop-shadow-lg" />;
      case 'thunderstorm':
        return <CloudLightning size={iconSize} className="text-purple-200 drop-shadow-lg" />;
      case 'snow':
        return <CloudSnow size={iconSize} className="text-blue-100 drop-shadow-lg" />;
      case 'mist':
        return <CloudFog size={iconSize} className="text-gray-300 drop-shadow-lg" />;
      default:
        return <Sun size={iconSize} className="text-yellow-300 drop-shadow-lg" />;
    }
  };

  if (!animated) {
    return getIcon();
  }

  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: condition === 'sunny' ? [0, 5, 0, -5, 0] : 0,
      }}
      transition={{
        duration: condition === 'sunny' ? 6 : 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="inline-flex"
    >
      {getIcon()}
    </motion.div>
  );
};

export default WeatherIcon;

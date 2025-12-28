import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Cloud, Sun, CloudRain, Snowflake, CloudLightning, Moon } from 'lucide-react';
import type { FavoriteCity, WeatherCondition } from '@/types/weather';

interface FavoriteCityCardProps {
  city: FavoriteCity;
  isActive: boolean;
  index: number;
  onSelect: (city: FavoriteCity) => void;
  onRemove: (id: string) => void;
}

const getWeatherIcon = (condition?: WeatherCondition) => {
  const iconClass = "w-5 h-5";
  switch (condition) {
    case 'sunny': return <Sun className={iconClass} />;
    case 'cloudy': return <Cloud className={iconClass} />;
    case 'rainy': return <CloudRain className={iconClass} />;
    case 'snow': return <Snowflake className={iconClass} />;
    case 'thunderstorm': return <CloudLightning className={iconClass} />;
    case 'night': return <Moon className={iconClass} />;
    case 'night-cloudy': return <Cloud className={iconClass} />;
    default: return <Sun className={iconClass} />;
  }
};

const FavoriteCityCard = ({ city, isActive, index, onSelect, onRemove }: FavoriteCityCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: city.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isDragging ? 0.8 : 1, 
        x: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{ delay: index * 0.05 }}
      className={`
        group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
        transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-white/30 shadow-lg ring-2 ring-white/40' 
          : 'bg-white/10 hover:bg-white/20'
        }
        ${isDragging ? 'shadow-2xl z-50' : ''}
      `}
      onClick={() => onSelect(city)}
    >
      {/* Drag Handle */}
      <motion.button
        {...attributes}
        {...listeners}
        className="touch-none p-1 rounded hover:bg-white/20 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <GripVertical className="w-4 h-4 text-white/60" />
      </motion.button>

      {/* Weather Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white/80">
        {getWeatherIcon(city.cachedCondition)}
      </div>

      {/* City Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{city.name}</h4>
        <p className="text-xs text-white/60 truncate">{city.country}</p>
      </div>

      {/* Cached Temperature */}
      {city.cachedTemp !== undefined && (
        <div className="text-lg font-semibold text-white/90">
          {city.cachedTemp}°
        </div>
      )}

      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(city.id);
        }}
        className="absolute -top-1 -right-1 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <X className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
};

export default FavoriteCityCard;

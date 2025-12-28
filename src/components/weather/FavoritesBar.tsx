import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import type { FavoriteCity } from '@/types/weather';

interface FavoritesBarProps {
  favorites: FavoriteCity[];
  onSelectCity: (city: FavoriteCity) => void;
  onRemoveFavorite: (id: string) => void;
  currentCity?: string;
}

const FavoritesBar = ({ favorites, onSelectCity, onRemoveFavorite, currentCity }: FavoritesBarProps) => {
  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto mb-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-4 h-4 text-white/70" fill="currentColor" />
        <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Favorites</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
        {favorites.map((city, index) => (
          <motion.button
            key={city.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => onSelectCity(city)}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentCity === city.name
                ? 'bg-white/30 text-white'
                : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
            }`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <span className="whitespace-nowrap">{city.name}</span>
            <span className="text-white/50 text-xs">{city.country}</span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(city.id);
              }}
              className="ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
            >
              <X className="w-3 h-3" />
            </motion.button>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoritesBar;

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { FavoriteCity } from '@/types/weather';

interface FavoritesBarProps {
  favorites: FavoriteCity[];
  onSelectCity: (city: FavoriteCity) => void;
  onRemoveFavorite: (id: string) => void;
  currentCity?: string;
}

const FavoritesBar = ({ favorites, onSelectCity, onRemoveFavorite, currentCity }: FavoritesBarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div 
        className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        {/* Toggle Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
            <span className="text-white/80 text-sm font-medium">
              Favorites ({favorites.length})
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronUp className="w-4 h-4 text-white/60" />
          )}
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
                {favorites.map((city, index) => (
                  <motion.button
                    key={city.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => onSelectCity(city)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                      currentCity === city.name
                        ? 'bg-white/25 text-white ring-1 ring-white/30'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span className="whitespace-nowrap">{city.name}</span>
                    <span className="text-white/40 text-xs">{city.country}</span>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(city.id);
                      }}
                      className="ml-0.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FavoritesBar;

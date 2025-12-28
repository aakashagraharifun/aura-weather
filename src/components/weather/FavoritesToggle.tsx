import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FavoritesToggleProps {
  onClick: () => void;
  favoriteCount: number;
}

const FavoritesToggle = ({ onClick, favoriteCount }: FavoritesToggleProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all shadow-lg"
    >
      <motion.div
        animate={favoriteCount > 0 ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${favoriteCount > 0 ? 'text-red-400 fill-current' : 'text-white/80'}`} 
        />
      </motion.div>
      <span className="text-sm font-medium">Favorites</span>
      {favoriteCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full shadow-md"
        >
          {favoriteCount}
        </motion.span>
      )}
    </motion.button>
  );
};

export default FavoritesToggle;

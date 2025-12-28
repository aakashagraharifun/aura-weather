import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { X, Heart, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import FavoriteCityCard from './FavoriteCityCard';
import type { FavoriteCity } from '@/types/weather';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteCity[];
  onSelectCity: (city: FavoriteCity) => void;
  onRemoveFavorite: (id: string) => void;
  onReorderFavorites: (favorites: FavoriteCity[]) => void;
  currentCity?: string;
}

const FavoritesDrawer = ({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onReorderFavorites,
  currentCity,
}: FavoritesDrawerProps) => {
  const isMobile = useIsMobile();
  const drawerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex((item) => item.id === active.id);
      const newIndex = favorites.findIndex((item) => item.id === over.id);
      const newFavorites = arrayMove(favorites, oldIndex, newIndex);
      onReorderFavorites(newFavorites);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle swipe to close on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    let startY = 0;
    const drawer = drawerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const diff = endY - startY;
      if (diff > 100) {
        onClose();
      }
    };

    drawer?.addEventListener('touchstart', handleTouchStart);
    drawer?.addEventListener('touchend', handleTouchEnd);

    return () => {
      drawer?.removeEventListener('touchstart', handleTouchStart);
      drawer?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isOpen, onClose]);

  const desktopVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 400,
      }
    },
  };

  const mobileVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      }
    },
    exit: { 
      y: '100%', 
      opacity: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 400,
      }
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              fixed z-50 
              ${isMobile 
                ? 'bottom-0 left-0 right-0 max-h-[70vh] rounded-t-3xl' 
                : 'top-0 left-0 h-full w-80 max-w-[85vw]'
              }
            `}
          >
            {/* Glassmorphism Container */}
            <div className={`
              h-full flex flex-col
              backdrop-blur-2xl bg-white/10 
              border border-white/20
              shadow-2xl
              ${isMobile ? 'rounded-t-3xl' : 'rounded-r-3xl'}
            `}>
              {/* Mobile Drag Handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/40" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
                  <h2 className="text-lg font-semibold text-white">Favorites</h2>
                  {favorites.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-white/20 rounded-full text-white/80">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white/80" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {favorites.length === 0 ? (
                  <EmptyState />
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={favorites.map((f) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {favorites.map((city, index) => (
                        <FavoriteCityCard
                          key={city.id}
                          city={city}
                          index={index}
                          isActive={currentCity === city.name}
                          onSelect={(c) => {
                            onSelectCity(c);
                            onClose();
                          }}
                          onRemove={onRemoveFavorite}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {/* Footer Hint */}
              {favorites.length > 1 && (
                <div className="px-5 py-3 border-t border-white/10">
                  <p className="text-xs text-white/50 text-center">
                    Drag to reorder your favorites
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Empty state component with animation
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-12 px-4 text-center"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4"
    >
      <Sparkles className="w-8 h-8 text-white/60" />
    </motion.div>
    <h3 className="text-white/90 font-medium mb-1">No favorites yet</h3>
    <p className="text-white/50 text-sm max-w-[200px]">
      Tap the heart icon on a city to add it here
    </p>
  </motion.div>
);

export default FavoritesDrawer;

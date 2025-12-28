import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CitySearchResult } from '@/types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectCity: (city: CitySearchResult) => void;
  onLocationRequest: () => void;
  isLoading: boolean;
  suggestions: CitySearchResult[];
  isSearching: boolean;
  onQueryChange: (query: string) => void;
  onClearSuggestions: () => void;
}

const SearchBar = ({ 
  onSearch, 
  onSelectCity,
  onLocationRequest, 
  isLoading,
  suggestions,
  isSearching,
  onQueryChange,
  onClearSuggestions,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        onQueryChange(query);
        setShowSuggestions(true);
      } else {
        onClearSuggestions();
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onQueryChange, onClearSuggestions]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: CitySearchResult) => {
    setQuery(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
    onClearSuggestions();
    onSelectCity(city);
  };

  const clearSearch = () => {
    setQuery('');
    onClearSuggestions();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      <div ref={containerRef} className="relative flex items-center gap-2">
        <motion.div
          className="relative flex-1"
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
              isFocused ? 'bg-white/25 shadow-lg shadow-white/10' : 'bg-white/15'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
            }}
          />
          <div className="relative flex items-center">
            {isSearching ? (
              <Loader2 className="absolute left-4 w-5 h-5 text-white/60 animate-spin" />
            ) : (
              <Search className="absolute left-4 w-5 h-5 text-white/60" />
            )}
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              className="w-full h-14 pl-12 pr-10 bg-transparent border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                type="button"
                onClick={clearSearch}
                className="absolute right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </motion.button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {suggestions.map((city, index) => (
                  <motion.button
                    key={`${city.name}-${city.country}-${city.lat}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2 border-b border-white/10 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{city.name}</span>
                      {city.state && (
                        <span className="text-white/60">, {city.state}</span>
                      )}
                      <span className="text-white/50 text-sm ml-2">{city.country}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            onClick={onLocationRequest}
            disabled={isLoading}
            className="h-14 w-14 rounded-2xl bg-white/20 hover:bg-white/30 border-0 backdrop-blur-xl shadow-lg"
          >
            <MapPin className="w-5 h-5 text-white" />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SearchBar;

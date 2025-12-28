import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationRequest: () => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, onLocationRequest, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
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
      <div className="relative flex items-center gap-2">
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
            <Search className="absolute left-4 w-5 h-5 text-white/60" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
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

import { motion } from 'framer-motion';
import { MapPin, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LocationResetButtonProps {
  onResetLocation: () => void;
  onChangeDefault: (city: string) => void;
  currentCity?: string;
}

const LocationResetButton = ({ 
  onResetLocation, 
  onChangeDefault,
  currentCity 
}: LocationResetButtonProps) => {
  const popularCities = [
    { name: 'Guwahati', country: 'IN' },
    { name: 'New Delhi', country: 'IN' },
    { name: 'Mumbai', country: 'IN' },
    { name: 'London', country: 'GB' },
    { name: 'New York', country: 'US' },
    { name: 'Tokyo', country: 'JP' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm hover:bg-white/20 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Location</span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3 bg-background/95 backdrop-blur-md border-border/50"
        align="end"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="w-4 h-4" />
            Location Settings
          </div>
          
          {currentCity && (
            <div className="text-xs text-muted-foreground">
              Current: {currentCity}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onResetLocation}
          >
            <RotateCcw className="w-4 h-4" />
            Re-detect My Location
          </Button>
          
          <div className="border-t border-border/50 pt-3">
            <div className="text-xs text-muted-foreground mb-2">
              Or choose a default city:
            </div>
            <div className="grid grid-cols-2 gap-1">
              {popularCities.map((city) => (
                <Button
                  key={`${city.name}-${city.country}`}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => onChangeDefault(city.name)}
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationResetButton;

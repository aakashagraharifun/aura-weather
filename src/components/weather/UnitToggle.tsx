import { motion } from 'framer-motion';

interface UnitToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onToggle: () => void;
}

const UnitToggle = ({ unit, onToggle }: UnitToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="glass-card px-3 py-1.5 text-white text-sm font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={unit === 'celsius' ? 'opacity-100' : 'opacity-50'}>°C</span>
      <span className="mx-1 opacity-50">/</span>
      <span className={unit === 'fahrenheit' ? 'opacity-100' : 'opacity-50'}>°F</span>
    </motion.button>
  );
};

export default UnitToggle;

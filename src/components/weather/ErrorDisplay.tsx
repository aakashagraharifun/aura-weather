import { motion } from 'framer-motion';
import { CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center text-white py-12"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="inline-block mb-6"
      >
        <CloudOff className="w-20 h-20 text-white/60" />
      </motion.div>
      
      <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
      <p className="text-white/70 mb-6 max-w-sm mx-auto">{message}</p>
      
      {onRetry && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetry}
            className="glass-card-strong border-0 text-white hover:bg-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorDisplay;

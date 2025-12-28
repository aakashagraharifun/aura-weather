import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

interface LocationPromptProps {
  onAllow: () => void;
  onDeny: () => void;
}

const LocationPrompt = ({ onAllow, onDeny }: LocationPromptProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onDeny}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDeny}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </motion.button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <MapPin className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl font-semibold text-white mb-2"
            >
              Enable Location
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm mb-8"
            >
              Get accurate weather for your current location. You can always search for other cities.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAllow}
                className="w-full py-3 px-6 rounded-xl bg-white/25 hover:bg-white/35 text-white font-medium transition-colors border border-white/30"
              >
                Allow Location Access
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDeny}
                className="w-full py-3 px-6 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-medium transition-colors"
              >
                Not Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationPrompt;

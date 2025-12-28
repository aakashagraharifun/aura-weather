import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8 px-4"
    >
      {/* Location skeleton */}
      <div className="text-center">
        <div className="h-8 w-40 mx-auto rounded-lg bg-white/20 animate-pulse mb-2" />
        <div className="h-4 w-24 mx-auto rounded-lg bg-white/10 animate-pulse" />
      </div>

      {/* Temperature skeleton */}
      <div className="flex items-center justify-center gap-6 my-12">
        <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse" />
        <div className="h-32 w-48 rounded-2xl bg-white/20 animate-pulse" />
      </div>

      {/* Condition skeleton */}
      <div className="text-center space-y-2">
        <div className="h-6 w-32 mx-auto rounded-lg bg-white/20 animate-pulse" />
        <div className="h-4 w-24 mx-auto rounded-lg bg-white/10 animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="w-5 h-5 rounded-full bg-white/20 animate-pulse mx-auto mb-2" />
            <div className="h-5 w-12 mx-auto rounded bg-white/20 animate-pulse mb-1" />
            <div className="h-3 w-16 mx-auto rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Hourly forecast skeleton */}
      <div>
        <div className="h-4 w-32 rounded bg-white/20 animate-pulse mb-3" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 glass-card p-4 w-20">
              <div className="h-3 w-8 mx-auto rounded bg-white/20 animate-pulse mb-2" />
              <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse mx-auto my-2" />
              <div className="h-5 w-10 mx-auto rounded bg-white/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Daily forecast skeleton */}
      <div>
        <div className="h-4 w-32 rounded bg-white/20 animate-pulse mb-3" />
        <div className="glass-card divide-y divide-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="h-4 w-10 rounded bg-white/20 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-8 rounded bg-white/20 animate-pulse" />
                <div className="w-20 h-1 rounded-full bg-white/20 animate-pulse" />
                <div className="h-4 w-8 rounded bg-white/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSkeleton;

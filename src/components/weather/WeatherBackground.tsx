import type { WeatherCondition } from '@/types/weather';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

const WeatherBackground = ({ condition, isDay }: WeatherBackgroundProps) => {
  const getGradientClass = () => {
    if (!isDay) return 'weather-gradient-night';
    
    switch (condition) {
      case 'sunny':
        return 'weather-gradient-sunny';
      case 'rainy':
        return 'weather-gradient-rainy';
      case 'cloudy':
      case 'mist':
        return 'weather-gradient-cloudy';
      case 'snow':
        return 'weather-gradient-snow';
      case 'thunderstorm':
        return 'weather-gradient-thunderstorm';
      case 'night':
      case 'night-cloudy':
        return 'weather-gradient-night';
      default:
        return 'weather-gradient-sunny';
    }
  };

  return (
    <div className={`fixed inset-0 ${getGradientClass()} transition-all duration-1000`}>
      {/* Animated elements based on weather */}
      
      {/* Sunny - Sun rays */}
      {condition === 'sunny' && isDay && (
        <>
          <div className="absolute top-10 right-10 w-40 h-40 md:w-60 md:h-60">
            <div className="absolute inset-0 rounded-full bg-yellow-300/30 animate-sun-pulse blur-xl" />
            <div className="absolute inset-4 rounded-full bg-yellow-200/50 animate-sun-pulse blur-lg" />
            <div className="absolute inset-8 rounded-full bg-yellow-100/80 animate-sun-pulse" />
          </div>
          <div className="absolute top-10 right-10 w-40 h-40 md:w-60 md:h-60 animate-sun-rays opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-yellow-200 to-transparent origin-bottom"
                style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
        </>
      )}

      {/* Clouds */}
      {(condition === 'cloudy' || condition === 'rainy' || condition === 'thunderstorm') && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-drift opacity-30"
              style={{
                top: `${10 + i * 15}%`,
                left: `-20%`,
                animationDuration: `${25 + i * 10}s`,
                animationDelay: `${i * 5}s`,
              }}
            >
              <div className="flex">
                <div className="w-20 h-12 bg-white/40 rounded-full blur-sm" />
                <div className="w-16 h-10 bg-white/30 rounded-full blur-sm -ml-6 mt-2" />
                <div className="w-24 h-14 bg-white/35 rounded-full blur-sm -ml-8 -mt-1" />
              </div>
            </div>
          ))}
        </>
      )}

      {/* Rain drops */}
      {(condition === 'rainy' || condition === 'thunderstorm') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-200/60 to-transparent animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.8 + Math.random() * 0.7}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning */}
      {condition === 'thunderstorm' && (
        <div className="absolute inset-0 bg-white/0 animate-lightning pointer-events-none" />
      )}

      {/* Snow particles */}
      {condition === 'snow' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/80 rounded-full animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars for night */}
      {!isDay && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
    </div>
  );
};

export default WeatherBackground;

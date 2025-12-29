import { useState, useCallback } from 'react';

const RATE_LIMIT_KEY = 'weather-api-calls';
const MAX_CALLS = 10;
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitData {
  count: number;
  resetTime: number;
}

export const useRateLimit = () => {
  const [isLimited, setIsLimited] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(MAX_CALLS);

  const getRateLimitData = useCallback((): RateLimitData => {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) {
      return { count: 0, resetTime: Date.now() + RESET_INTERVAL_MS };
    }
    
    try {
      const data = JSON.parse(stored) as RateLimitData;
      
      // Reset if time has passed
      if (Date.now() > data.resetTime) {
        const newData = { count: 0, resetTime: Date.now() + RESET_INTERVAL_MS };
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData));
        return newData;
      }
      
      return data;
    } catch {
      return { count: 0, resetTime: Date.now() + RESET_INTERVAL_MS };
    }
  }, []);

  const checkRateLimit = useCallback((): boolean => {
    const data = getRateLimitData();
    const remaining = MAX_CALLS - data.count;
    setRemainingCalls(Math.max(0, remaining));
    setIsLimited(remaining <= 0);
    return remaining > 0;
  }, [getRateLimitData]);

  const consumeCall = useCallback((): boolean => {
    const data = getRateLimitData();
    
    if (data.count >= MAX_CALLS) {
      setIsLimited(true);
      setRemainingCalls(0);
      return false;
    }
    
    const newData = { ...data, count: data.count + 1 };
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData));
    
    const remaining = MAX_CALLS - newData.count;
    setRemainingCalls(remaining);
    setIsLimited(remaining <= 0);
    
    return true;
  }, [getRateLimitData]);

  const getResetTimeRemaining = useCallback((): string => {
    const data = getRateLimitData();
    const remaining = data.resetTime - Date.now();
    
    if (remaining <= 0) return 'now';
    
    const minutes = Math.ceil(remaining / (60 * 1000));
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }, [getRateLimitData]);

  return {
    isLimited,
    remainingCalls,
    maxCalls: MAX_CALLS,
    checkRateLimit,
    consumeCall,
    getResetTimeRemaining,
  };
};

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseOtpTimerOptions {
  initialSeconds?: number;
  onFinish?: () => void;
}

interface UseOtpTimerReturn {
  count: number;
  isFinished: boolean;
  reset: () => void;
  start: () => void;
}

export const useOtpTimer = ({
  initialSeconds = 60,
  onFinish,
}: UseOtpTimerOptions = {}): UseOtpTimerReturn => {
  const [count, setCount] = useState(initialSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setCount(initialSeconds);
    setIsFinished(false);

    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearTimer();
          setIsFinished(true);
          onFinishRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, initialSeconds]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    start();
    return clearTimer;
  }, [start, clearTimer]);

  return { count, isFinished, reset, start };
};

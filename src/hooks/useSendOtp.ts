import { useState, useCallback } from 'react';
import authService from '../services/auth.service';
import { SendOtpResponse, ServiceResult } from '../types/auth.types';

interface UseSendOtpReturn {
  sendOtp: (mobile: string) => Promise<ServiceResult<SendOtpResponse>>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useSendOtp = (): UseSendOtpReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(
    async (mobile: string): Promise<ServiceResult<SendOtpResponse>> => {
      setLoading(true);
      setError(null);

      const result = await authService.sendOtp(mobile);

      if (!result.success) {
        setError(result.error ?? null);
      }

      setLoading(false);
      return result;
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { sendOtp, loading, error, clearError };
};

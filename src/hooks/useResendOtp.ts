import { useState, useCallback } from 'react';
import authService from '../services/auth.service';
import { ResendOtpResponse, ServiceResult } from '../types/auth.types';

interface UseResendOtpReturn {
  resendOtp: (mobile: string) => Promise<ServiceResult<ResendOtpResponse>>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}


export const useResendOtp = (): UseResendOtpReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendOtp = useCallback(
    async (mobile: string): Promise<ServiceResult<ResendOtpResponse>> => {
      setLoading(true);
      setError(null);

      const result = await authService.resendOtp(mobile);

      if (!result.success) {
        setError(result.error ?? null);
      }

      setLoading(false);
      return result;
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { resendOtp, loading, error, clearError };
};

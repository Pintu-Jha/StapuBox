import { useState, useCallback } from 'react';
import authService from '../services/auth.service';
import { VerifyOtpResponse, ServiceResult } from '../types/auth.types';

interface UseVerifyOtpReturn {
  verifyOtp: (
    mobile: string,
    otp: string,
  ) => Promise<ServiceResult<VerifyOtpResponse>>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useVerifyOtp = (): UseVerifyOtpReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = useCallback(
    async (
      mobile: string,
      otp: string,
    ): Promise<ServiceResult<VerifyOtpResponse>> => {
      setLoading(true);
      setError(null);

      const result = await authService.verifyOtp(mobile, otp);

      if (!result.success) {
        setError(result.error ?? null);
      }

      setLoading(false);
      return result;
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { verifyOtp, loading, error, clearError };
};

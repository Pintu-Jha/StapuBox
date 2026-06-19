
export interface SendOtpRequest {
  mobile: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface ResendOtpRequest {
  mobile: string;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'failed';
  msg?: string;
  err?: string;
  data?: T;
}

export interface SendOtpResponse {
  mobile?: string;
  expiresAt?: string;
}

export interface VerifyOtpResponse {
  token: string;
  new_profile: boolean;
  mobile: string;
  message: string;
  sessionId: number;
  verified: boolean;
  pid: number;
  userType: string;
  channel: string;
  channelValue: string | null;
}

export interface ResendOtpResponse {
  mobile?: string;
  expiresAt?: string;
}

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthStore {
  mobile: string;
  setMobile: (value: string) => void;
  clearMobile: () => void;

  token: string | null;
  isAuthenticated: boolean;
  newProfile: boolean;
  setSession: (token: string, newProfile: boolean) => void;
  clearSession: () => void;
}

export interface LoginFormValues {
  mobile: string;
}

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'SERVER_ERROR'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INVALID_MOBILE'
  | 'UNKNOWN_ERROR';

export interface AppError {
  code: AppErrorCode;
  message: string;
}

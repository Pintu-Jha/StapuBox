import apiClient from './axios';
import {
  SendOtpRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ApiResponse,
  SendOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
} from '../types/auth.types';

// Raw API Calls
// These functions perform raw HTTP calls only.
// All business logic and error mapping lives in auth.service.ts

export const sendOtpApi = async (
  data: SendOtpRequest,
): Promise<ApiResponse<SendOtpResponse>> => {
  const res = await apiClient
    .post<ApiResponse<SendOtpResponse>>('/sendOtp', data);
  return res.data;
};

export const verifyOtpApi = async (
  data: VerifyOtpRequest,
): Promise<ApiResponse<VerifyOtpResponse>> => {
  const res = await apiClient
    .post<ApiResponse<VerifyOtpResponse>>(
      `/verifyOtp?mobile=${data.mobile}&otp=${data.otp}`);
  return res.data;
};

export const resendOtpApi = async (
  data: ResendOtpRequest,
): Promise<ApiResponse<ResendOtpResponse>> => {
  const res = await apiClient
    .post<ApiResponse<ResendOtpResponse>>(`/resendOtp?mobile=${data.mobile}`);
  return res.data;
};

import { AxiosError } from 'axios';
import { sendOtpApi, verifyOtpApi, resendOtpApi } from '../api/auth.api';
import {
  ServiceResult,
  SendOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
} from '../types/auth.types';
import { Strings } from '../constants/strings';
import { useAuthStore } from '../store/auth.store';

const mapApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const { response, code } = error;

    if (code === 'ECONNABORTED') {
      return Strings.errorTimeout;
    }
    if (!response) {
      return Strings.errorNoInternet;
    }

    const status = response.status;
    const serverMessage: string | undefined =
      response.data?.message || response.data?.error;

    if (status === 401 || status === 403) {
      return serverMessage || Strings.errorSomethingWrong;
    }
    if (status === 400) {
      return serverMessage || Strings.errorInvalidMobile;
    }
    if (status === 422) {
      return serverMessage || Strings.errorInvalidOtp;
    }
    if (status >= 500) {
      return Strings.errorServerError;
    }

    return serverMessage || Strings.errorSomethingWrong;
  }

  return Strings.errorSomethingWrong;
};

export const sendOtp = async (
  mobile: string,
): Promise<ServiceResult<SendOtpResponse>> => {
  try {
    const response = await sendOtpApi({ mobile });

    if (response && response.status === 'failed') {
      return {
        success: false,
        error: response.msg || Strings.errorSomethingWrong,
      };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: mapApiError(error) };
  }
};

export const verifyOtp = async (
  mobile: string,
  otp: string,
): Promise<ServiceResult<VerifyOtpResponse>> => {
  try {
    const response = await verifyOtpApi({ mobile, otp });

    if (response && response.status === 'failed') {
      return {
        success: false,
        error: Strings.errorInvalidOtp,
      };
    }

    const sessionData = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    if (sessionData?.token) {
      useAuthStore.getState().setSession(
        sessionData.token,
        sessionData.new_profile ?? false,
      );
    }

    return { success: true, data: sessionData };
  } catch (error) {
    return { success: false, error: mapApiError(error) };
  }
};

export const resendOtp = async (
  mobile: string,
): Promise<ServiceResult<ResendOtpResponse>> => {
  try {
    const response = await resendOtpApi({ mobile });

    if (response && response.status === 'failed') {
      return {
        success: false,
        error: response.msg || Strings.errorSomethingWrong,
      };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: mapApiError(error) };
  }
};

const authService = { sendOtp, verifyOtp, resendOtp };
export default authService;

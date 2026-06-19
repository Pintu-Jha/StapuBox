import { z } from 'zod';
import { Strings } from '../constants/strings';

export const mobileSchema = z.object({
  mobile: z
    .string()
    .min(1, Strings.errorRequired)
    .regex(/^[6-9]\d{9}$/, Strings.errorInvalidMobile),
});

export type MobileFormValues = z.infer<typeof mobileSchema>;

export const isValidOtp = (otp: string): boolean => {
  return /^\d{4}$/.test(otp);
};

export const isValidMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const filterNumeric = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

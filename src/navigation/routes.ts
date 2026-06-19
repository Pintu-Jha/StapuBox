export const Routes = {
  LOGIN: 'Login',
  VERIFY_OTP: 'VerifyOtp',
} as const;

export type RouteKey = (typeof Routes)[keyof typeof Routes];

export type RootStackParamList = {
  [Routes.LOGIN]: undefined;
  [Routes.VERIFY_OTP]: {
    mobile: string;
  };
};

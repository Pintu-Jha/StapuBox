export const Colors = {
  background: '#2D2E2F',
  backgroundCard: '#383A3B',
  backgroundElevated: '#424547',

  accent: '#2398FE',
  accentDark: '#1A7ED6',
  accentLight: 'rgba(35, 152, 254, 0.15)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.60)',
  textDisabled: 'rgba(255, 255, 255, 0.30)',
  textHint: 'rgba(255, 255, 255, 0.45)',

  inputBackground: 'transparent',
  inputBorder: 'rgba(255, 255, 255, 0.20)',
  inputBorderFocused: '#FFFFFF',
  inputBorderError: '#FF4D4D',

  buttonPrimary: '#2398FE',
  buttonPrimaryDisabled: 'rgba(255, 255, 255, 0.04)',
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryTextDisabled: 'rgba(255, 255, 255, 0.30)',

  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.15)',
  error: '#FF4D4D',
  errorLight: 'rgba(255, 77, 77, 0.12)',
  warning: '#FF9500',

  otpBoxBackground: 'rgba(255, 255, 255, 0.06)',
  otpBoxBorder: 'rgba(255, 255, 255, 0.20)',
  otpBoxBorderFocused: '#2398FE',
  otpBoxBorderError: '#FF4D4D',
  otpBoxBackgroundError: 'rgba(255, 77, 77, 0.08)',

  divider: 'rgba(255, 255, 255, 0.10)',
  overlay: 'rgba(0, 0, 0, 0.70)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;

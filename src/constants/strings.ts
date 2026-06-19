export const Strings = {
  appName: 'StapuBox',

  loginTitle: 'Login to Your Account',
  loginSubtitle: 'Enter your mobile number to continue',
  countryCode: '+91',
  mobilePlaceholder: 'Mobile Number',
  sendOtpButton: 'Send OTP',
  sendingOtp: 'Sending...',
  createAccountPrefix: "Don't have an account? ",
  createAccountLink: 'Create Account',

  otpTitle: 'Phone Verification',
  otpSubtitle: 'Enter 4 digit OTP sent to your phone number',
  otpResendPrefix: 'Resend OTP in ',
  otpResendButton: 'Resend OTP',
  otpResending: 'Resending...',
  changeNumber: 'Change Mobile Number',
  verifying: 'Verifying...',

  successTitle: 'Verified!',
  successSubtitle: "Your mobile number has been\nverified successfully.",
  successButton: 'Continue',

  errorRequired: 'This field is required',
  errorInvalidMobile: 'Enter a valid 10-digit mobile number',
  errorInvalidOtp: 'Wrong OTP Entered',
  errorSomethingWrong: 'Something went wrong. Please try again.',
  errorNoInternet: 'No internet connection. Check your connection.',
  errorTimeout: 'Request timed out. Please try again.',
  errorServerError: 'Server error. Please try again later.',
  errorOtpExpired: 'OTP has expired. Please request a new one.',
} as const;

export type StringKey = keyof typeof Strings;

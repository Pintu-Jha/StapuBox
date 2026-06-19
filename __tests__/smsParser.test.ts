import { extractOtpFromSms } from '../src/utils/smsParser';

describe('smsParser', () => {
  describe('extractOtpFromSms', () => {
    it('returns null for empty string', () => {
      expect(extractOtpFromSms('')).toBeNull();
    });

    it('returns null for null input', () => {
      expect(extractOtpFromSms(null as any)).toBeNull();
    });

    it('returns null for SMS with no 4-digit number', () => {
      expect(extractOtpFromSms('Welcome to StapuBox!')).toBeNull();
    });

    it('extracts OTP from "Your OTP is 1234" format', () => {
      expect(extractOtpFromSms('Your OTP is 1234 for StapuBox login.')).toBe('1234');
    });

    it('extracts OTP from "OTP: 5678" format', () => {
      expect(extractOtpFromSms('OTP: 5678 is your verification code.')).toBe('5678');
    });

    it('extracts OTP from "code is 9012" format', () => {
      expect(extractOtpFromSms('Your verification code is 9012.')).toBe('9012');
    });

    it('extracts OTP from SMS with OTP at start', () => {
      expect(extractOtpFromSms('3456 is your StapuBox OTP. Do not share.')).toBe('3456');
    });

    it('extracts OTP from "pin is 7890" format', () => {
      expect(extractOtpFromSms('Your pin is 7890, valid for 10 minutes.')).toBe('7890');
    });

    it('ignores 5+ digit numbers and finds 4-digit OTP', () => {
      expect(extractOtpFromSms('Ref: 99887 Your OTP is 4321 expires soon.')).toBe('4321');
    });

    it('returns first 4-digit number as fallback', () => {
      expect(extractOtpFromSms('Use 2468 to authenticate.')).toBe('2468');
    });
  });
});

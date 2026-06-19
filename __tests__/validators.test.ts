import { isValidMobile, isValidOtp, filterNumeric, mobileSchema } from '../src/utils/validators';

describe('validators', () => {
  // ── isValidMobile ──────────────────────────────────────────────────────────

  describe('isValidMobile', () => {
    it('returns false for empty string', () => {
      expect(isValidMobile('')).toBe(false);
    });

    it('returns false for less than 10 digits', () => {
      expect(isValidMobile('987654321')).toBe(false);
    });

    it('returns false for more than 10 digits', () => {
      expect(isValidMobile('98765432109')).toBe(false);
    });

    it('returns false for numbers starting with 0-5', () => {
      expect(isValidMobile('0987654321')).toBe(false);
      expect(isValidMobile('5987654321')).toBe(false);
    });

    it('returns true for valid mobile starting with 6', () => {
      expect(isValidMobile('6987654321')).toBe(true);
    });

    it('returns true for valid mobile starting with 7', () => {
      expect(isValidMobile('7987654321')).toBe(true);
    });

    it('returns true for valid mobile starting with 8', () => {
      expect(isValidMobile('8987654321')).toBe(true);
    });

    it('returns true for valid mobile starting with 9', () => {
      expect(isValidMobile('9876543210')).toBe(true);
    });

    it('returns false for alphabetic characters', () => {
      expect(isValidMobile('9876543abc')).toBe(false);
    });

    it('returns false for special characters', () => {
      expect(isValidMobile('9876543@10')).toBe(false);
    });
  });

  // ── isValidOtp ─────────────────────────────────────────────────────────────

  describe('isValidOtp', () => {
    it('returns false for empty string', () => {
      expect(isValidOtp('')).toBe(false);
    });

    it('returns false for less than 4 digits', () => {
      expect(isValidOtp('123')).toBe(false);
    });

    it('returns false for more than 4 digits', () => {
      expect(isValidOtp('12345')).toBe(false);
    });

    it('returns false for non-numeric characters', () => {
      expect(isValidOtp('12ab')).toBe(false);
    });

    it('returns true for valid 4-digit OTP', () => {
      expect(isValidOtp('1234')).toBe(true);
    });

    it('returns true for OTP with leading zero', () => {
      expect(isValidOtp('0123')).toBe(true);
    });
  });

  // ── filterNumeric ──────────────────────────────────────────────────────────

  describe('filterNumeric', () => {
    it('removes alphabetic characters', () => {
      expect(filterNumeric('abc123')).toBe('123');
    });

    it('removes special characters', () => {
      expect(filterNumeric('98@76#54')).toBe('987654');
    });

    it('returns empty string for non-numeric input', () => {
      expect(filterNumeric('abcdef')).toBe('');
    });

    it('keeps pure numeric input unchanged', () => {
      expect(filterNumeric('9876543210')).toBe('9876543210');
    });
  });

  // ── mobileSchema (Zod) ─────────────────────────────────────────────────────

  describe('mobileSchema', () => {
    it('fails for empty mobile', () => {
      const result = mobileSchema.safeParse({ mobile: '' });
      expect(result.success).toBe(false);
    });

    it('fails for invalid mobile', () => {
      const result = mobileSchema.safeParse({ mobile: '1234' });
      expect(result.success).toBe(false);
    });

    it('passes for valid mobile', () => {
      const result = mobileSchema.safeParse({ mobile: '9876543210' });
      expect(result.success).toBe(true);
    });
  });
});

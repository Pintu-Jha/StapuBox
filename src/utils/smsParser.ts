export const extractOtpFromSms = (smsBody: string): string | null => {
  if (!smsBody || typeof smsBody !== 'string') {
    return null;
  }

  const patterns = [
    /\botp\s+for\s+login\s+is\s+(\d{4})\b/i,
    /\b(?:otp|code|pin)\s*(?:is|:|-|–)?\s*(\d{4})\b/i,
    /\bis\s+(\d{4})\b/i,
    /\b(\d{4})\b/,
  ];

  for (const pattern of patterns) {
    const match = smsBody.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

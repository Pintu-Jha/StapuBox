import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },

  body: {
    paddingTop: Spacing.lg,
  },
  heading: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    marginBottom: Spacing['3xl'],
    lineHeight: 32,
  },

  otpWrapper: {
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },

  errorBox: {
    marginBottom: Spacing.sm,
  },
  errorBoxText: {
    ...Typography.captionMedium,
    color: Colors.error,
    textAlign: 'left',
  },

  resendContainer: {
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
  },
  timerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  timerCount: {
    color: Colors.accent,
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: Spacing.sm,
  },
  resendButtonText: {
    ...Typography.bodyMedium,
    color: Colors.accent,
  },
  resendButtonTextDisabled: {
    color: Colors.textDisabled,
  },
  resendLoading: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});


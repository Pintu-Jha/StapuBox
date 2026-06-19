import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    paddingBottom: Spacing['3xl'],
  },

  heading: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },

  formRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  mobileInput: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: Spacing.sm,
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

  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.captionMedium,
    color: Colors.accent,
  },


});

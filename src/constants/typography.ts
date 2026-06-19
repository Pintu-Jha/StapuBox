import { StyleSheet } from 'react-native';

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.6,
} as const;

export const Typography = StyleSheet.create({
  heading1: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  heading3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
  },
  body: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
  },
  bodyMedium: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  captionMedium: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.2,
  },
});

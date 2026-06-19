import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface CountryCodePickerProps {
  code?: string;
  onPress?: () => void;
  testID?: string;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  code = '+91',
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.container}
      disabled={!onPress}
      testID={testID}
      accessibilityLabel={`Country code ${code}`}
      accessibilityRole="button"
    >
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.chevron}>▼</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.md,
    height: 54,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  code: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 10,
    color: Colors.textPrimary,
    marginLeft: 2,
  },
});

export default React.memo(CountryCodePicker);

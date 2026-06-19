import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface AppHeaderProps {
  title: string;
  onBackPress?: () => void;
  style?: ViewStyle;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onBackPress, style }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        testID="app-header-back-button"
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <G clipPath="url(#clip0_0_1391)">
            <Path
              d="M11.0797 1.99333C10.7531 1.66666 10.2264 1.66666 9.89973 1.99333L4.35973 7.53333C4.09973 7.79333 4.09973 8.21333 4.35973 8.47333L9.89973 14.0133C10.2264 14.34 10.7531 14.34 11.0797 14.0133C11.4064 13.6867 11.4064 13.16 11.0797 12.8333L6.25307 8L11.0864 3.16666C11.4064 2.84666 11.4064 2.31333 11.0797 1.99333Z"
              fill="white"
            />
          </G>
          <Defs>
            <ClipPath id="clip0_0_1391">
              <Rect width="16" height="16" fill="white" />
            </ClipPath>
          </Defs>
        </Svg>
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, 
  },
  titleContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.base, 
    paddingBottom: Spacing.xl, 
    pointerEvents: 'none',
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
});

export default React.memo(AppHeader);

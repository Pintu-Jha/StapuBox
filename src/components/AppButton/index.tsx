import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius } from '../../constants/spacing';


const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        isDisabled ? styles.buttonDisabled : styles.buttonActive,
        animatedStyle,
        style,
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={loading ? 'Loading...' : title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.textDisabled}
          testID="button-loader"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isDisabled ? styles.textDisabled : styles.textActive,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.buttonPrimary,
  },
  buttonDisabled: {
    backgroundColor: Colors.buttonPrimaryDisabled,
  },
  text: {
    ...Typography.button,
  },
  textActive: {
    color: Colors.buttonPrimaryText,
  },
  textDisabled: {
    color: Colors.buttonPrimaryTextDisabled,
  },
});

export default React.memo(AppButton);

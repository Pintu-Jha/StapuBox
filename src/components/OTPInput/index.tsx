import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (otp: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  testID?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
  testID,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  useEffect(() => {
    if (error && value.length > 0) {
      shakeX.value = withSequence(
        withTiming(12, { duration: 55, easing: Easing.out(Easing.quad) }),
        withTiming(-12, { duration: 55, easing: Easing.inOut(Easing.quad) }),
        withTiming(9, { duration: 55, easing: Easing.inOut(Easing.quad) }),
        withTiming(-9, { duration: 55, easing: Easing.inOut(Easing.quad) }),
        withTiming(5, { duration: 45, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 45, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [error, shakeX, value.length]);

  const boxScales = Array.from({ length }, () => useSharedValue(1)); // eslint-disable-line react-hooks/rules-of-hooks

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [autoFocus]);

  useEffect(() => {
    const nextIndex = Math.min(value.length, length - 1);
    if (value.length < length) {
      inputRefs.current[nextIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.blur();
    }
  }, [value, length]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const cleaned = text.replace(/[^0-9]/g, '');

      if (cleaned.length > 1) {
        const pasted = cleaned.slice(0, length);
        onChange(pasted);
        if (pasted.length === length) {
          onComplete?.(pasted);
          inputRefs.current[length - 1]?.blur();
        }
        return;
      }

      const digits = value.split('');
      digits[index] = cleaned;
      const newValue = digits.slice(0, index + 1).join('').slice(0, length);
      onChange(newValue);

      if (cleaned) {
        boxScales[index].value = withSequence(
          withSpring(1.18, { damping: 6, stiffness: 260 }),
          withSpring(1, { damping: 10, stiffness: 200 }),
        );

        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }

      if (newValue.length === length) {
        onComplete?.(newValue);
        inputRefs.current[length - 1]?.blur();
      }
    },
    [value, length, onChange, onComplete, boxScales],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace') {
        if (value[index]) {
          onChange(value.slice(0, index));
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          onChange(value.slice(0, index - 1));
        }
      }
    },
    [value, onChange],
  );

  return (
    <Animated.View
      style={[styles.container, shakeStyle]}
      testID={testID}
    >
      {Array.from({ length }, (_, index) => {
        const digit = value[index] || '';

        const boxScaleStyle = useAnimatedStyle(() => ({ // eslint-disable-line react-hooks/rules-of-hooks
          transform: [{ scale: boxScales[index].value }],
        }));

        return (
          <Animated.View
            key={index}
            style={[
              styles.box,
              styles.boxEmpty,
              digit.length > 0 && styles.boxFilled,
              focusedIndex === index && styles.boxFocused,
              boxScaleStyle,
            ]}
          >
            <TextInput
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={styles.boxInput}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={Platform.OS === 'android' ? 2 : 1}
              textAlign="center"
              selectionColor={Colors.accent}
              cursorColor={Colors.accent}
              editable={!disabled}
              caretHidden={Platform.OS === 'android'}
              testID={`otp-box-${index}`}
              accessibilityLabel={`OTP digit ${index + 1}`}
            />
          </Animated.View>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  box: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  boxFocused: {
    borderColor: Colors.inputBorderFocused,
  },
  boxFilled: {
    borderColor: Colors.inputBorderFocused,
  },
  boxInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default React.memo(OTPInput);

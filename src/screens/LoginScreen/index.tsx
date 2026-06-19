import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/ScreenContainer';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import CountryCodePicker from '../../components/CountryCodePicker';
import { useSendOtp } from '../../hooks/useSendOtp';
import { useAuthStore } from '../../store/auth.store';
import { mobileSchema, MobileFormValues, filterNumeric } from '../../utils/validators';
import { Strings } from '../../constants/strings';
import { RootStackParamList, Routes } from '../../navigation/routes';
import { styles } from './styles';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof Routes.LOGIN
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const { setMobile } = useAuthStore();
  const { sendOtp, loading, error: apiError } = useSendOtp();

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-16);
  const headingOpacity = useSharedValue(0);
  const headingTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(28);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    headingOpacity.value = withTiming(1, { duration: 380 });
    headingTranslateY.value = withTiming(0, { duration: 380 });

    formOpacity.value = withDelay(280, withTiming(1, { duration: 380 }));
    formTranslateY.value = withDelay(
      280,
      withTiming(0, { duration: 380 }),
    );

    footerOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
  }, []);

  const headingStyle = useAnimatedStyle(() => ({
    opacity: headingOpacity.value,
    transform: [{ translateY: headingTranslateY.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MobileFormValues>({
    resolver: zodResolver(mobileSchema),
    mode: 'onChange',
    defaultValues: { mobile: '' },
  });

  const onSubmit = useCallback(
    async (values: MobileFormValues) => {
      const result = await sendOtp(values.mobile);
      if (result.success) {
        setMobile(values.mobile);
        navigation.navigate(Routes.VERIFY_OTP, { mobile: values.mobile });
      }
    },
    [sendOtp, setMobile, navigation],
  );

  return (
    <ScreenContainer scrollable padded={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={headingStyle}>
          <Text style={styles.heading}>{Strings.loginTitle}</Text>
        </Animated.View>

        <Animated.View style={formStyle}>
          <View style={styles.formRow}>
            <CountryCodePicker code={Strings.countryCode} testID="country-code-picker" />

            <Controller
              control={control}
              name="mobile"
              render={({ field: { onChange, value, onBlur } }) => (
                <AppInput
                  containerStyle={styles.mobileInput}
                  placeholder={Strings.mobilePlaceholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={value}
                  onChangeText={text => onChange(filterNumeric(text))}
                  onBlur={onBlur}
                  error={errors.mobile?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  testID="mobile-input"
                />
              )}
            />
          </View>

          {apiError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{apiError}</Text>
            </View>
          ) : null}

          <View style={styles.buttonWrapper}>
            <AppButton
              title={loading ? Strings.sendingOtp : Strings.sendOtpButton}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!isValid || loading}
              testID="send-otp-button"
            />
          </View>
        </Animated.View>


        <Animated.View style={[styles.footer, footerStyle]}>
          <Text style={styles.footerText}>
            {Strings.createAccountPrefix}
            <Text style={styles.footerLink}>{Strings.createAccountLink}</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default LoginScreen;

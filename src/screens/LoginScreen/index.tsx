import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
} from 'react-native';
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
    <ScreenContainer 
      scrollable 
      padded={false} 
      contentContainerStyle={styles.content}
    >
        <View>
          <Text style={styles.heading}>{Strings.loginTitle}</Text>
        </View>

        <View>
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
        </View>


        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {Strings.createAccountPrefix}
            <Text style={styles.footerLink}>{Strings.createAccountLink}</Text>
          </Text>
        </View>
    </ScreenContainer>
  );
};

export default LoginScreen;

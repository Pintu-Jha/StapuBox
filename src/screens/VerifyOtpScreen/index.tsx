import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import ScreenContainer from '../../components/ScreenContainer';
import OTPInput from '../../components/OTPInput';
import AppLoader from '../../components/AppLoader';
import { useVerifyOtp } from '../../hooks/useVerifyOtp';
import { useResendOtp } from '../../hooks/useResendOtp';
import { useOtpTimer } from '../../hooks/useOtpTimer';
import { useSmsRetriever } from '../../hooks/useSmsRetriever';
import { Strings } from '../../constants/strings';
import { RootStackParamList, Routes } from '../../navigation/routes';
import { styles } from './styles';

type VerifyOtpRouteProp = RouteProp<RootStackParamList, typeof Routes.VERIFY_OTP>;

const VerifyOtpScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<VerifyOtpRouteProp>();
  const { mobile } = route.params;

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  const { verifyOtp, loading: verifying, error: verifyError, clearError } = useVerifyOtp();
  const { resendOtp, loading: resending, error: resendError } = useResendOtp();
  const { count, isFinished: timerFinished, reset: resetTimer, start: startTimer } = useOtpTimer({
    initialSeconds: 60,
  });

  useFocusEffect(
    useCallback(() => {
      setOtp('');
      setOtpError(false);
      clearError();
      startTimer();
    }, [clearError, startTimer]),
  );

  const handleVerify = useCallback(
    async (enteredOtp: string) => {
      if (enteredOtp.length !== 4) {
        return;
      }
      const result = await verifyOtp(mobile, enteredOtp);
      if (!result.success) {
        setOtpError(true);
        setTimeout(() => {
          setOtp('');
          setOtpError(false);
        }, 1800);
      }
    },
    [verifyOtp, mobile],
  );

  const handleOtpFromSms = useCallback(
    (receivedOtp: string) => {
      setOtp(receivedOtp);
      setOtpError(false);
      clearError();
      if (receivedOtp.length === 4) {
        handleVerify(receivedOtp);
      }
    },
    [clearError, handleVerify],
  );

  useSmsRetriever({ onOtpReceived: handleOtpFromSms });

  const handleOtpChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (otpError) {
        setOtpError(false);
        clearError();
      }
    },
    [otpError, clearError],
  );



  const handleResend = useCallback(async () => {
    if (!timerFinished || resending) {
      return;
    }
    setOtp('');
    setOtpError(false);
    clearError();
    const result = await resendOtp(mobile);
    if (result.success) {
      resetTimer();
    }
  }, [timerFinished, resending, mobile, resendOtp, resetTimer, clearError]);

  const handleChangeNumber = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const displayError = verifyError || resendError;

  return (
    <ScreenContainer padded={false}>
      <AppLoader fullScreen visible={verifying} message={Strings.verifying} />

      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(350).springify()}>
          <AppHeader title={Strings.otpTitle} onBackPress={handleChangeNumber} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(380).springify()} style={styles.body}>
          <Text style={styles.heading}>{Strings.otpSubtitle}</Text>

          <View style={styles.otpWrapper}>
            <OTPInput
              length={4}
              value={otp}
              onChange={handleOtpChange}
              onComplete={handleVerify}
              error={otpError}
              autoFocus
              testID="otp-input"
            />
          </View>

          {displayError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{displayError}</Text>
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.resendContainer}>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={!timerFinished || resending}
            testID="resend-button"
            accessibilityLabel="Resend OTP"
            accessibilityRole="button"
            accessibilityState={{ disabled: !timerFinished || resending }}
          >
            {resending ? (
              <Text style={styles.resendLoading}>{Strings.otpResending}</Text>
            ) : !timerFinished ? (
              <Text style={[styles.resendButtonText, styles.resendButtonTextDisabled]}>
                {Strings.otpResendPrefix}
                <Text style={styles.timerCount}>
                  00:{count < 10 ? `0${count}` : count}
                </Text>
              </Text>
            ) : (
              <Text style={styles.resendButtonText}>
                {Strings.otpResendButton}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default VerifyOtpScreen;

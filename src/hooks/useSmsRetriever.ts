import { useEffect, useCallback } from 'react';
import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import { extractOtpFromSms } from '../utils/smsParser';

interface UseSmsRetrieverOptions {
  onOtpReceived: (otp: string) => void;
  enabled?: boolean;
}

const { SmsRetrieverModule } = NativeModules;

export const useSmsRetriever = ({
  onOtpReceived,
  enabled = true,
}: UseSmsRetrieverOptions): void => {
  const handleSmsReceived = useCallback(
    (sms: string) => {
      const otp = extractOtpFromSms(sms);
      if (otp) {
        onOtpReceived(otp);
      }
    },
    [onOtpReceived],
  );

  useEffect(() => {
    if (Platform.OS !== 'android' || !enabled || !SmsRetrieverModule) {
      return;
    }

    const emitter = new NativeEventEmitter(SmsRetrieverModule);
    const subscription = emitter.addListener('onSmsReceived', handleSmsReceived);

    SmsRetrieverModule.startListening().catch(() => {});

    return () => {
      subscription.remove();
      SmsRetrieverModule.stopListening();
    };
  }, [enabled, handleSmsReceived]);
};

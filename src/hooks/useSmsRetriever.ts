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
      console.log('[SMS Retriever] Raw SMS received:', sms);
      const otp = extractOtpFromSms(sms);
      console.log('[SMS Retriever] Extracted OTP:', otp);
      if (otp) {
        onOtpReceived(otp);
      } else {
        console.warn('[SMS Retriever] Failed to extract OTP from SMS');
      }
    },
    [onOtpReceived],
  );

  useEffect(() => {
    if (Platform.OS !== 'android' || !enabled || !SmsRetrieverModule) {
      console.log('[SMS Retriever] Disabled or not Android/Module missing.');
      return;
    }

    console.log('[SMS Retriever] Initializing...');

    // Log the exact hash the backend needs to append
    if (SmsRetrieverModule.getAppHash) {
      SmsRetrieverModule.getAppHash()
        .then((hash: string) => {
          console.log('\n=============================================');
          console.log('🚨 URGENT: SMS MUST CONTAIN THIS EXACT HASH 🚨');
          console.log(`App Hash String: ${hash}`);
          console.log('Backend MUST append this to the end of the SMS message!');
          console.log('Example: "... do not share this OTP. ' + hash + '"');
          console.log('=============================================\n');
        })
        .catch((e: any) => console.log('Could not generate App Hash:', e));
    }

    const emitter = new NativeEventEmitter(SmsRetrieverModule);
    const subscription = emitter.addListener('onSmsReceived', handleSmsReceived);

    SmsRetrieverModule.startListening()
      .then(() => console.log('[SMS Retriever] Started listening for SMS successfully (5-min window active)'))
      .catch((e: any) => console.warn('[SMS Retriever] Failed to start listening:', e));

    return () => {
      console.log('[SMS Retriever] Stopping listener');
      subscription.remove();
      SmsRetrieverModule.stopListening();
    };
  }, [enabled, handleSmsReceived]);
};

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import { RootStackParamList, Routes } from './routes';


const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.LOGIN}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#2D2E2F' },
      }}
    >
      <Stack.Screen
        name={Routes.LOGIN}
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={Routes.VERIFY_OTP}
        component={VerifyOtpScreen}
        options={{ gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

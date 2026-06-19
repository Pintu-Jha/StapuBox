import React from 'react';
import { useAuthStore } from '../store/auth.store';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';

const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <HomeNavigator /> : <AuthNavigator />;
};

export default AppNavigator;

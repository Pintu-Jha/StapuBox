import { create } from 'zustand';
import { AuthStore } from '../types/auth.types';

export const useAuthStore = create<AuthStore>(set => ({
  mobile: '',
  setMobile: (value: string) => set({ mobile: value }),
  clearMobile: () => set({ mobile: '' }),

  token: null,
  isAuthenticated: false,
  newProfile: false,
  setSession: (token: string, newProfile: boolean) =>
    set({ token, isAuthenticated: true, newProfile }),
  clearSession: () =>
    set({ token: null, isAuthenticated: false, newProfile: false, mobile: '' }),
}));

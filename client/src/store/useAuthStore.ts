import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import type { User } from '../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface AuthStore {
  authUser: User | null;

  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: User) => void;
  login: (data: User) => void;
  logout: () => void;
  updateProfile: ({ profilePic }: { profilePic: string }) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
    } catch (error) {
      console.error(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post('/auth/signup', data);
      set({ authUser: response.data });
      toast.success('Account created successfully');
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data.message || 'Something went wrong');
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post('/api/login', data);
      set({ authUser: response.data });
      toast.success('Logged in successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Something went wrong');
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data.message || 'Something went wrong');
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: response.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data.message || 'Something went wrong');
    }
  },
}));

export default useAuthStore;

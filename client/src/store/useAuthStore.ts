import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import type { User } from '../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type ProfilePicture = { profilePic: string };
interface HandleAuthRequest {
  method: 'get' | 'post' | 'put';
  endpoint: string;
  successMessage?: string | null;
  loadingState?:
    | 'isSigningUp'
    | 'isLoggingIn'
    | 'isUpdatingProfile'
    | 'isCheckingAuth'
    | null;
  data?: User | ProfilePicture;
  isLogout?: boolean;
}
interface AuthStore {
  authUser: User | null;

  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  isCheckingAuth: boolean;

  handleAuthRequest: ({
    loadingState,
    method,
    data,
    endpoint,
    successMessage,
    isLogout,
  }: HandleAuthRequest) => void;

  checkAuth: () => Promise<void>;
  signup: (data: User) => void;
  login: (data: User) => void;
  logout: () => void;
  updateProfile: ({ profilePic }: ProfilePicture) => void;
  connectSocket: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  socket: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  handleAuthRequest: async ({
    loadingState = null,
    method,
    data,
    endpoint,
    successMessage = null,
    isLogout = false,
  }) => {
    try {
      if (loadingState) set({ [`${loadingState}`]: true });

      if (isLogout) {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
      }
      if (method === 'post') {
        const response = await axiosInstance.post(endpoint, data);
        set({ authUser: !isLogout ? response.data : null });
        if (!isLogout) get().connectSocket();
      }
      if (method === 'put') {
        const response = await axiosInstance.put(endpoint, data);
        set({ authUser: !isLogout ? response.data : null });
      }
      if (method === 'get') {
        const response = await axiosInstance.get(endpoint);
        set({ authUser: response.data });
      }

      if (successMessage) toast.success(successMessage);
    } catch (error) {
      if (loadingState === 'isCheckingAuth') set({ authUser: null });
      if (error instanceof AxiosError)
        toast.error(error?.response?.data.message || 'Something went wrong');
    } finally {
      if (loadingState) set({ [`${loadingState}`]: false });
    }
  },

  checkAuth: async () => {
    const { handleAuthRequest } = get();

    handleAuthRequest({
      loadingState: 'isCheckingAuth',
      method: 'get',
      endpoint: '/auth/check',
    });
  },

  signup: async (data) => {
    const { handleAuthRequest } = get();

    handleAuthRequest({
      data,
      loadingState: 'isSigningUp',
      method: 'post',
      endpoint: '/auth/signup',
      successMessage: 'Account created successfully',
    });
  },

  login: async (data) => {
    const { handleAuthRequest } = get();

    handleAuthRequest({
      data,
      loadingState: 'isLoggingIn',
      method: 'post',
      endpoint: '/auth/login',
      successMessage: 'Logged in successfully',
    });
  },

  logout: async () => {
    const { handleAuthRequest } = get();

    handleAuthRequest({
      isLogout: true,
      method: 'post',
      endpoint: '/auth/logout',
      successMessage: 'Logged out successfully',
    });
  },

  updateProfile: async (data) => {
    const { handleAuthRequest } = get();
    handleAuthRequest({
      data,
      loadingState: 'isUpdatingProfile',
      method: 'put',
      endpoint: '/auth/update-profile',
      successMessage: 'Profile updated successfully',
    });
  },

  connectSocket: () => {},
}));

export default useAuthStore;

import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import type { User } from '../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

const BASE_URL: string = 'http://localhost:5010';

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
  socket: Socket | null;

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
  disconnectSocket: () => void;
  onlineUsers: (string | undefined)[];
}

const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  handleAuthRequest: async ({
    method,
    data,
    endpoint,
    loadingState = null,
    successMessage = null,
    isLogout = false,
  }) => {
    const { authUser } = get();
    try {
      if (loadingState) set({ [`${loadingState}`]: true });

      if (isLogout) {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null, socket: null });
      }
      if (method === 'post') {
        const response = await axiosInstance.post(endpoint, data);
        set({ authUser: !isLogout ? response.data : null });
      }
      if (method === 'put') {
        const response = await axiosInstance.put(endpoint, data);
        set({ authUser: !isLogout ? response.data : null });
      }
      if (method === 'get') {
        if (authUser) {
          const response = await axiosInstance.get(endpoint);
          set({ authUser: response.data });
        }
      }
      if (method === 'get' || method === 'post') {
        if (isLogout) {
          get().disconnectSocket();
        }
        if (!isLogout && get().authUser) {
          get().connectSocket();
        }
      }

      if (successMessage) toast.success(successMessage);
    } catch (error) {
      if (loadingState === 'isCheckingAuth') set({ authUser: null });
      if (error instanceof AxiosError)
        toast.error(error?.response?.data.error || 'Something went wrong');
    } finally {
      if (loadingState) set({ [`${loadingState}`]: false });
    }
  },

  checkAuth: async () => {
    const { handleAuthRequest } = get();
    await handleAuthRequest({
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

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const newSocket: Socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket?.on('getOnlineUsers', (usersIds: string[]) => {
      set({ onlineUsers: usersIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useAuthStore;

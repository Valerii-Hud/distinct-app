import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import type { User } from '../types';

type DataState = 'users' | 'messages';
type LoadingState = 'isUsersLoading' | 'isMessagesLoading';
interface LoadResource {
  loadingState: LoadingState;
  dataState: DataState;
  endpoint: string;
}

interface ChatStore {
  messages: [];
  users: User[] | [];
  selectedUser: User['_id'] | null;
  onlineUsers: (string | undefined)[];

  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  loadResource: ({ loadingState, endpoint, dataState }: LoadResource) => void;
  getUsers: () => void;
  getMessage: (userId: User['_id']) => void;
  setSelectedUser: (userId: User['_id']) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  onlineUsers: [],

  isUsersLoading: false,
  isMessagesLoading: false,

  loadResource: async ({ loadingState, endpoint, dataState }) => {
    set({ [`${loadingState}`]: true });
    try {
      const response = await axiosInstance.get(endpoint);
      set({ [`${dataState}`]: response.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Something went wrong');
      }
    } finally {
      set({ [`${loadingState}`]: false });
    }
  },

  getUsers: async () => {
    get().loadResource({
      loadingState: 'isUsersLoading',
      dataState: 'users',
      endpoint: '/messages/users',
    });
    // set({ isUsersLoading: true });
    // try {
    //   const response = await axiosInstance.get('/messages/users');
    //   set({ users: response.data });
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     toast.error(error.response?.data.message || 'Something went wrong');
    //   }
    // } finally {
    //   set({ isUsersLoading: false });
    // }
  },

  getMessage: async (userId) => {
    get().loadResource({
      loadingState: 'isMessagesLoading',
      dataState: 'messages',
      endpoint: `/messages/${userId}`,
    });
    // set({ isMessagesLoading: true });
    // try {
    //   const response = await axiosInstance.get(`/messages/${userId}`);
    //   set({ messages: response.data });
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     toast.error(error.response?.data.message || 'Something went wrong');
    //   }
    // } finally {
    //   set({ isMessagesLoading: false });
    // }
  },

  setSelectedUser: (userId) => set({ selectedUser: userId }),
}));

export default useChatStore;

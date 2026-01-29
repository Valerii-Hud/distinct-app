import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import type { User, Message } from '../types';
import useAuthStore from './useAuthStore';

type DataState = 'users' | 'messages' | 'selectedUser';
type LoadingState = 'isUsersLoading' | 'isMessagesLoading';
interface LoadResource {
  loadingState?: LoadingState;
  dataState: DataState;
  endpoint: string;
}

interface ChatStore {
  messages: Message[] | [];
  users: User[] | [];
  selectedUser: User | null;

  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  loadResource: ({ loadingState, endpoint, dataState }: LoadResource) => void;

  getMessages: (userId: string) => void;
  sendMessage: (messageData: {
    text: string;
    image: ArrayBuffer | string | null;
  }) => void;

  getUsers: () => void;
  setSelectedUser: (userId: string | undefined) => void;
  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  onlineUsers: [],

  isUsersLoading: false,
  isMessagesLoading: false,

  loadResource: async ({ loadingState = null, endpoint, dataState }) => {
    if (loadingState) {
      set({ [`${loadingState}`]: true });
    }
    try {
      const response = await axiosInstance.get(endpoint);
      set({ [`${dataState}`]: response.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Something went wrong');
      }
    } finally {
      if (loadingState) {
        set({ [`${loadingState}`]: false });
      }
    }
  },

  getMessages: async (userId) => {
    get().loadResource({
      loadingState: 'isMessagesLoading',
      dataState: 'messages',
      endpoint: `/messages/${userId}`,
    });
  },

  sendMessage: async (messageData) => {
    try {
      const { selectedUser, messages } = get();
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Something went wrong');
      }
    }
  },

  getUsers: async () => {
    get().loadResource({
      loadingState: 'isUsersLoading',
      dataState: 'users',
      endpoint: '/messages/users',
    });
  },

  setSelectedUser: (userId) => {
    get().loadResource({
      dataState: 'selectedUser',
      endpoint: `/messages/users/${userId}`,
    });
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const newSocket = useAuthStore.getState().socket;

    newSocket?.on('newMessage', (newMessage: Message) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeToMessages: () => {
    const newSocket = useAuthStore.getState().socket;
    newSocket?.off('newMessage');
  },
}));

export default useChatStore;

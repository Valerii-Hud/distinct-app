import { create } from 'zustand';
import type { Theme } from '../constants';

interface CreateStore {
  theme: Theme | string;
  setTheme: (newTheme: Theme | string) => void;
}

const useCreateStore = create<CreateStore>((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },
}));

export default useCreateStore;

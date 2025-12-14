import { create } from 'zustand';
import type { Sweet } from '../types';
import { sweetsService } from '../services/sweets.service';

interface SweetsState {
  sweets: Sweet[];
  isLoading: boolean;
  error: string | null;
  fetchSweets: () => Promise<void>;
  searchSweets: (params: any) => Promise<void>;
  purchaseSweet: (id: string, quantity: number) => Promise<void>;
}

export const useSweetsStore = create<SweetsState>((set) => ({
  sweets: [],
  isLoading: false,
  error: null,

  fetchSweets: async () => {
    set({ isLoading: true, error: null });
    try {
      const sweets = await sweetsService.getAll();
      set({ sweets, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchSweets: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const sweets = await sweetsService.search(params);
      set({ sweets, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  purchaseSweet: async (id, quantity) => {
    try {
      await sweetsService.purchase(id, quantity);
      // Refresh the list
      const sweets = await sweetsService.getAll();
      set({ sweets });
    } catch (error: any) {
      throw error;
    }
  },
}));
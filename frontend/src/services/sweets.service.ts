import api from './api';
import type { Sweet, CreateSweetDto, UpdateSweetDto, SearchParams } from '../types';

export const sweetsService = {
  // Fetch all sweets [cite: 741]
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets');
    return response.data;
  },

  // Search sweets with filters [cite: 743]
  search: async (params: SearchParams): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets/search', { params });
    return response.data;
  },

  // Purchase a sweet [cite: 758]
  purchase: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  // Admin: Create new sweet [cite: 740]
  create: async (data: CreateSweetDto): Promise<Sweet> => {
    const response = await api.post('/api/sweets', data);
    return response.data;
  },

  // Admin: Update existing sweet [cite: 754]
  update: async (id: string, data: UpdateSweetDto): Promise<Sweet> => {
    const response = await api.patch(`/api/sweets/${id}`, data);
    return response.data;
  },

  // Admin: Restock [cite: 763]
  restock: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
    return response.data;
  },

  // Admin: Delete sweet [cite: 757]
  remove: async (id: string): Promise<void> => {
    await api.delete(`/api/sweets/${id}`);
  }
};
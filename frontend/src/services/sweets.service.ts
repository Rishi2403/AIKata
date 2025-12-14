import api from './api';
import type { Sweet, CreateSweetDto, UpdateSweetDto, SearchParams } from '../types';

export const sweetsService = {
  async getAll(): Promise<Sweet[]> {
    const response = await api.get('/api/sweets');
    return response.data;
  },

  async search(params: SearchParams): Promise<Sweet[]> {
    const response = await api.get('/api/sweets/search', { params });
    return response.data;
  },

  async getOne(id: string): Promise<Sweet> {
    const response = await api.get(`/api/sweets/${id}`);
    return response.data;
  },

  async create(data: CreateSweetDto): Promise<Sweet> {
    const response = await api.post('/api/sweets', data);
    return response.data;
  },

  async update(id: string, data: UpdateSweetDto): Promise<Sweet> {
    const response = await api.patch(`/api/sweets/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/sweets/${id}`);
  },

  async purchase(id: string, quantity: number): Promise<Sweet> {
    const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  async restock(id: string, quantity: number): Promise<Sweet> {
    const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};
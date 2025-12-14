import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { email, password });
    
    // Backend returns user without accessToken on register
    // We need to login after registration
    const loginResponse = await api.post('/api/auth/login', { email, password });
    
    return {
      accessToken: loginResponse.data.accessToken,
      user: loginResponse.data.user || {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
      },
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    
    return {
      accessToken: response.data.accessToken,
      user: response.data.user || {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
      },
    };
  },

  logout() {
    localStorage.removeItem('sweet_shop_token');
    localStorage.removeItem('sweet_shop_user');
  },
};
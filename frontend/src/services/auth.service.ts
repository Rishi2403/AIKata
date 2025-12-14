import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    // Register returns just the user
    await api.post('/api/auth/register', { email, password });
    
    // Then login to get the token
    const loginResponse = await api.post('/api/auth/login', { email, password });
    
    // Backend returns { accessToken, user: { id, email, role } }
    return {
      accessToken: loginResponse.data.accessToken,
      user: loginResponse.data.user,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    
    console.log('Login response:', response.data); // Debug log
    
    // Backend returns { accessToken, user: { id, email, role } }
    return {
      accessToken: response.data.accessToken,
      user: response.data.user,
    };
  },

  logout() {
    localStorage.removeItem('sweet_shop_token');
    localStorage.removeItem('sweet_shop_user');
  },
};
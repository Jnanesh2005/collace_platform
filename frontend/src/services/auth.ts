import api from './api';
import { User, AuthResponse } from '../types';

export const authService = {
  async register(userData: {
    username: string;
    email: string;
    password: string;
    college: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile/update/', userData);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
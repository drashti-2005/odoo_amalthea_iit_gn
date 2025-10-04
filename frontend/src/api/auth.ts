import { apiClient } from './client';
import type { 
  LoginCredentials, 
  SignupData, 
  User, 
  ApiResponse 
} from '../types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string; passwordChangeRequired?: boolean }>> {
    return apiClient.post('/auth/login', credentials);
  },

  async signup(data: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post('/auth/signup', data);
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/logout');
  },

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/auth/refresh');
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    console.log('Calling reset password API with token:', token.substring(0, 10) + '...');
    return apiClient.post('/auth/reset-password', { token, password });
  },
};

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {AuthResponse} from "@/api/types/auth.ts";
import { useAuthStore } from '@/stores/auth.ts'

const AUTH_URL: string = import.meta.env.VITE_API_BASE_URL;

export class Auth {
  private apiClient: AxiosInstance;
  private authStore = useAuthStore();

  constructor() {
    this.apiClient = axios.create({
      baseURL: AUTH_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/api/login', { 'username': email, 'password': password });
      this.authStore.setToken(response.data.token);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Ошибка при авторизации. Попробуйте позже.');
      }
    }
  }
}


import axios from 'axios'
import apiClient from '@/api/axios'
import type { AuthResponse } from '@/api/types/auth.ts'
import { useAuthStore } from '@/stores/auth.ts'

interface LoginErrorDto {
  message?: string
}

export class Auth {
  private authStore = useAuthStore()

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/login', {
        email: email,
        password,
      })
      this.authStore.setToken(response.data.token)
    } catch (error) {
      const data = axios.isAxiosError<LoginErrorDto>(error) ? error.response?.data : undefined
      console.error('login error', data)
      if (data?.message) throw new Error(data.message)
      throw new Error('Ошибка при авторизации. Попробуйте позже.')
    }
  }
}


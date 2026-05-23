import apiClient from '@/api/axios'
import type { AuthResponse } from '@/api/types/auth.ts'
import { useAuthStore } from '@/stores/auth.ts'

export class Auth {
  private authStore = useAuthStore()

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/login', {
        email: email,
        password,
      })
      this.authStore.setToken(response.data.token)
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.error('login error', error.response?.data)
        throw new Error(error.response.data.message)
      } else {
        console.error('login error', error.response?.data)
        throw new Error('Ошибка при авторизации. Попробуйте позже.')
      }
    }
  }
}


import apiClient from '@/api/axios'
import type { User } from '@/api/types/user.ts'

export class UserApi {
  async fetchCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('api/v1/users/me')
    return response.data
  }
}

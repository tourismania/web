import apiClient from '@/api/axios'
import type { User } from '@/api/types/user.ts'

export class UserApi {
  async fetchCurrentUser(token: string): Promise<User> {
    const response = await apiClient.get<User>('api/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }
}

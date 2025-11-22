import axios from 'axios';
import type {AxiosInstance} from 'axios';
import type {User} from "@/api/types/user.ts";

const AUTH_URL: string = import.meta.env.VITE_API_BASE_URL;

export class UserApi {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: AUTH_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async fetchCurrentUser(token: string): Promise<User> {
    const response = await this.apiClient.get<User>('api/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

import { defineStore } from 'pinia';
import { UserApi } from '@/api/user';
import type { User } from "@/api/types/user";
import { useAuthStore } from './auth'; // предполагается, что у вас есть auth-store с токеном

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async loadCurrentUser() {
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.user = null;
        return;
      }

      const userApi = new UserApi();
      try {
        this.user = await userApi.fetchCurrentUser(authStore.token);
      } catch (error) {
        this.user = null;
        // обработка ошибок, например, очистка токена или вывод уведомления
        console.error('Ошибка загрузки пользователя:', error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.user !== null,
    isSuperAdmin: (state) => state.user?.rights?.isSuperAdmin || false,
  }
});

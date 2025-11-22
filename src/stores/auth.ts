// store/auth.ts
import { defineStore } from 'pinia';

interface AuthState {
  token: string | null;
}

const TOKEN_KEY = 'auth_token';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(TOKEN_KEY),
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem(TOKEN_KEY, token);
    },
  },
});

import { defineStore } from 'pinia'
import type { Client } from '@/api/types/offer'

const MOCK_CLIENTS: Client[] = [
  { name: 'Антон',     surname: 'Кирин',    email: 'a.kirin@gmail.com' },
  { name: 'Анастасия', surname: 'Шадрина',  email: 'a.shadrina@gmail.com' },
  { name: 'Стич',      surname: 'Кирин',    email: 's.kirin@gmail.com' },
]

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    clientByEmail: (state) => (email: string) =>
      state.clients.find((c) => c.email === email) ?? null,
  },

  actions: {
    async loadClients() {
      // TODO: подключить реальный API когда появится бэкенд
      this.loading = true
      this.error = null
      try {
        this.clients = MOCK_CLIENTS
      } catch {
        this.error = 'Не удалось загрузить клиентов'
      } finally {
        this.loading = false
      }
    },
  },
})

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { LOGIN_ROUTE_PATH } from '@/router/constants'

/**
 * Shared axios instance for all API calls.
 * Reads VITE_API_BASE_URL from the environment at module load time.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore().clearToken()
      if (window.location.pathname !== LOGIN_ROUTE_PATH) {
        const redirect = window.location.pathname + window.location.search
        window.location.href = `${LOGIN_ROUTE_PATH}?redirect=${encodeURIComponent(redirect)}`
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient

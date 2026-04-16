import axios from 'axios'

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

export default apiClient

import apiClient from './axios'
import type { AirportSearchResponse } from './types/airport'

export class AirportApi {
  /**
   * Full-text search over airports and cities.
   * Requires min 2 characters.
   */
  static async search(query: string, limit = 10): Promise<AirportSearchResponse> {
    const response = await apiClient.get<AirportSearchResponse>('/api/v1/airports', {
      params: { search: query, limit },
    })
    return response.data
  }
}

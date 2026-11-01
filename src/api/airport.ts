import apiClient from './axios'
import type { AirportSearchResult } from './types/airport'

interface AirportDto {
  icao: string
  iata: string | null
  name: string
  city: { name: string }
  country: { iso2: string; name: string }
}

interface AirportSearchResponseDto {
  data: AirportDto[]
  meta: { total: number; limit: number; offset: number }
}

export class AirportApi {
  /**
   * Full-text search over airports and cities.
   * Requires min 2 characters.
   */
  static async search(query: string, limit = 10): Promise<AirportSearchResult> {
    const response = await apiClient.get<AirportSearchResponseDto>('/api/v1/airports', {
      params: { search: query, limit },
    })
    return {
      data: response.data.data.map((dto) => ({
        icao: dto.icao,
        // Отсутствие кода в модели — всегда null, как в карточке оффера
        iata: dto.iata || null,
        name: dto.name,
        city: { name: dto.city.name },
        country: { iso2: dto.country.iso2, name: dto.country.name },
      })),
      meta: {
        total: response.data.meta.total,
        limit: response.data.meta.limit,
        offset: response.data.meta.offset,
      },
    }
  }
}

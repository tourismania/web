import apiClient from './axios'
import type { AirlineSearchResult } from './types/airline'

interface AirlineDto {
  id: number
  icao: string | null
  name: string
  name_ru: string
  country: { iso2: string; name: string } | null
  dissolved_on: string | null
}

interface AirlineSearchResponseDto {
  data: AirlineDto[]
  meta: { total: number; limit: number; offset: number }
}

export class AirlineApi {
  /** Поиск по справочнику авиакомпаний. Web ищет от 3 символов (см. AirlineSelect). */
  static async search(query: string, limit = 15): Promise<AirlineSearchResult> {
    const response = await apiClient.get<AirlineSearchResponseDto>('/api/v1/airlines', {
      params: { search: query, limit },
    })
    return {
      data: response.data.data.map((dto) => ({
        id: dto.id,
        icao: dto.icao,
        name: dto.name,
        nameRu: dto.name_ru,
        country: dto.country,
        dissolvedOn: dto.dissolved_on,
      })),
      meta: {
        total: response.data.meta.total,
        limit: response.data.meta.limit,
        offset: response.data.meta.offset,
      },
    }
  }
}

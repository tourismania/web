import apiClient from './axios'
import type { Offer, OfferStatus } from './types/offer'

/**
 * Wire-формат бэкенда (snake_case, числовой id). Бэкенд пока хранит только
 * базовые поля оффера — flights/hotels/итд туда не входят.
 */
interface OfferResponseDto {
  id: number
  uuid: string
  agency_id: number
  created_by: number
  created_at: string
  updated_at: string
  title: string
  description?: string
  status: OfferStatus
}

interface ListOffersResponseDto {
  data: OfferResponseDto[]
  meta: { limit: number; offset: number; total: number }
}

interface CreateOfferResponseDto {
  id: number
  uuid: string
}

export interface OfferListParams {
  status?: OfferStatus
  createdBy?: number
  limit?: number
  offset?: number
}

export interface OfferListResult {
  offers: Offer[]
  total: number
  limit: number
  offset: number
}

export interface OfferBasicFields {
  title: string
  description?: string
  status: OfferStatus
}

function mapOfferResponse(dto: OfferResponseDto): Offer {
  return {
    id: dto.uuid,
    numericId: dto.id,
    status: dto.status,
    description: dto.description,
    agencyId: dto.agency_id,
    createdBy: dto.created_by,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    title: dto.title,
    // Остальные доменные поля бэкенд ещё не хранит — заполняются из
    // localStorage-слоя в offer-сторе (см. issue #24).
    clients: [],
    welcomeText: '',
    startDate: '',
    endDate: '',
    flights: [],
    hotels: [],
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  }
}

export class OfferApi {
  static async getAll(params: OfferListParams = {}): Promise<OfferListResult> {
    const response = await apiClient.get<ListOffersResponseDto>('/api/v1/offers', {
      params: {
        status: params.status,
        created_by: params.createdBy,
        limit: params.limit,
        offset: params.offset,
      },
    })
    return {
      offers: response.data.data.map(mapOfferResponse),
      total: response.data.meta.total,
      limit: response.data.meta.limit,
      offset: response.data.meta.offset,
    }
  }

  static async getById(uuid: string): Promise<Offer> {
    const response = await apiClient.get<OfferResponseDto>(`/api/v1/offers/${uuid}`)
    return mapOfferResponse(response.data)
  }

  static async create(data: OfferBasicFields): Promise<Offer> {
    const response = await apiClient.post<CreateOfferResponseDto>('/api/v1/offers', {
      title: data.title,
      description: data.description,
      status: data.status,
    })
    // POST возвращает только { id, uuid } — дозапрашиваем полную запись
    return OfferApi.getById(response.data.uuid)
  }

  static async update(uuid: string, data: Partial<OfferBasicFields>): Promise<Offer> {
    await apiClient.patch(`/api/v1/offers/${uuid}`, {
      title: data.title,
      description: data.description,
      status: data.status,
    })
    // PATCH возвращает только { id, uuid } — дозапрашиваем полную запись
    return OfferApi.getById(uuid)
  }

  static async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/v1/offers/${uuid}`)
  }
}

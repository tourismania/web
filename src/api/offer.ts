import apiClient from './axios'
import type { Offer, OfferStatus } from './types/offer'

/**
 * Wire-формат бэкенда (snake_case, числовой id). Бэкенд пока хранит только
 * базовые поля оффера — flights/hotels/итд туда не входят.
 *
 * Соглашение об именовании: `*Dto` — приватные интерфейсы, повторяющие
 * сырой JSON бэкенда 1:1 (никогда не экспортируются за пределы файла);
 * `*Params`/`*Result` — публичные типы методов `OfferApi`, уже приведённые
 * к доменным конвенциям фронтенда (camelCase, дефолты, смёрженные с
 * пагинацией/метаданными значения).
 */
interface OfferResponseDto {
  id: number
  uuid: string
  agency_id: number
  created_by: number
  created_at: string
  updated_at: string
  title: string
  description: string
  status: OfferStatus
}

interface PublicOfferResponseDto {
  id: number
  uuid: string
  agency_id: number
  created_at: string
  updated_at: string
  title: string
  description: string
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
  description: string
  status: OfferStatus
}

function blankDomainFields() {
  return {
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

function mapOfferResponse(dto: OfferResponseDto): Offer {
  return {
    uuid: dto.uuid,
    id: dto.id,
    status: dto.status,
    description: dto.description,
    agencyId: dto.agency_id,
    createdBy: dto.created_by,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    title: dto.title,
    // Остальные доменные поля бэкенд ещё не хранит — заполняются из
    // localStorage-слоя в offer-сторе (см. issue #24).
    ...blankDomainFields(),
  }
}

function mapPublicOfferResponse(dto: PublicOfferResponseDto): Offer {
  return {
    uuid: dto.uuid,
    id: dto.id,
    // Публичный эндпоинт отдаёт только опубликованные офферы — status в
    // ответе бэкенда нет, но семантически это всегда 'published'.
    status: 'published',
    description: dto.description,
    agencyId: dto.agency_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    title: dto.title,
    ...blankDomainFields(),
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

  /**
   * Просмотр опубликованного оффера без авторизации — GET /api/v1/public/offers/{uuid}.
   * Черновики и офферы в статусе "ready" по этому пути недоступны (404).
   */
  static async getPublicById(uuid: string): Promise<Offer> {
    const response = await apiClient.get<PublicOfferResponseDto>(`/api/v1/public/offers/${uuid}`)
    return mapPublicOfferResponse(response.data)
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

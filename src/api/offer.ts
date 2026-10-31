import apiClient from './axios'
import type {
  Airline,
  Airport,
  CabinClass,
  Currency,
  Flight,
  FlightSegment,
  Offer,
  OfferStatus,
} from './types/offer'

/**
 * Wire-формат бэкенда (snake_case, числовой id). Бэкенд хранит базовые поля
 * оффера и перелёты — hotels/итд туда пока не входят.
 *
 * Соглашение об именовании: `*Dto` — приватные интерфейсы, повторяющие
 * сырой JSON бэкенда 1:1 (никогда не экспортируются за пределы файла);
 * `*Params`/`*Result` — публичные типы методов `OfferApi`, уже приведённые
 * к доменным конвенциям фронтенда (camelCase, дефолты, смёрженные с
 * пагинацией/метаданными значения).
 */
interface AirportDto {
  icao: string
  iata: string | null
  name: string
  city: { name: string; timezone: string | null }
  country: { iso2: string; name: string }
}

interface AirlineDto {
  id: number
  icao: string | null
  name: string
  name_ru: string
  dissolved_on: string | null
}

interface FlightSegmentDto {
  departure_airport: AirportDto
  arrival_airport: AirportDto
  departure_at: string
  arrival_at: string
  duration_seconds: number
  cabin_class: CabinClass
  flight_number: string
  airline: AirlineDto
}

interface LayoverDto {
  airport_icao: string
  duration_seconds: number
}

interface FlightDto {
  id: number
  price: string
  currency: Currency
  manager_comment: string
  total_duration_seconds: number
  segments: FlightSegmentDto[]
  layovers: LayoverDto[]
}

/** Сегмент в теле записи: только поля контракта, api отклоняет неизвестные. */
interface FlightSegmentInputDto {
  departure_airport_icao: string
  arrival_airport_icao: string
  departure_at: string
  arrival_at: string
  cabin_class: CabinClass
  airline_id: number
  flight_number: string
}

/** Перелёт в теле записи: только поля контракта, api отклоняет неизвестные. */
interface FlightInputDto {
  price: string
  currency: Currency
  manager_comment: string
  segments: FlightSegmentInputDto[]
}

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
  // Есть только в карточке: в списке GET /api/v1/offers перелётов нет.
  flights?: FlightDto[]
}

interface PublicOfferResponseDto {
  id: number
  uuid: string
  agency_id: number
  created_at: string
  updated_at: string
  title: string
  description: string
  flights?: FlightDto[]
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

/** Поля записи оффера: базовые и полный набор перелётов, который заменит сохранённый. */
export interface OfferCreateFields extends OfferBasicFields {
  flights: Flight[]
}

/**
 * `flights` обязателен намеренно: api заменяет весь набор перелётов, поэтому
 * вызывающий код должен передать его явно и не может стереть перелёты пропуском поля.
 */
export type OfferUpdateFields = Partial<OfferBasicFields> & Pick<OfferCreateFields, 'flights'>

function mapAirportResponse(dto: AirportDto): Airport {
  return {
    icao: dto.icao,
    iata: dto.iata,
    name: dto.name,
    city: { name: dto.city.name, timezone: dto.city.timezone },
    country: { iso2: dto.country.iso2, name: dto.country.name },
  }
}

function mapAirlineResponse(dto: AirlineDto): Airline {
  return {
    id: dto.id,
    icao: dto.icao,
    name: dto.name,
    nameRu: dto.name_ru,
    dissolvedOn: dto.dissolved_on,
  }
}

function mapFlightSegmentResponse(dto: FlightSegmentDto): FlightSegment {
  return {
    departureAirport: mapAirportResponse(dto.departure_airport),
    arrivalAirport: mapAirportResponse(dto.arrival_airport),
    // Местное время аэропорта берётся как есть, часовые пояса не участвуют.
    departureAt: dto.departure_at,
    arrivalAt: dto.arrival_at,
    cabinClass: dto.cabin_class,
    airline: mapAirlineResponse(dto.airline),
    flightNumber: dto.flight_number,
    durationSeconds: dto.duration_seconds,
  }
}

function mapFlightResponse(dto: FlightDto): Flight {
  return {
    id: dto.id,
    price: dto.price,
    currency: dto.currency,
    managerComment: dto.manager_comment,
    segments: dto.segments.map(mapFlightSegmentResponse),
    totalDurationSeconds: dto.total_duration_seconds,
    layovers: dto.layovers.map((layover) => ({
      airportIcao: layover.airport_icao,
      durationSeconds: layover.duration_seconds,
    })),
  }
}

// YYYY-MM-DDTHH:MM — время без секунд, api принимает только полный формат.
const DATE_TIME_WITHOUT_SECONDS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

function toLocalDateTimeInput(value: string): string {
  return DATE_TIME_WITHOUT_SECONDS.test(value) ? `${value}:00` : value
}

function toFlightSegmentInput(segment: FlightSegment): FlightSegmentInputDto {
  return {
    // Пустые значения в запись не попадают: их не пропускает диалог перелёта,
    // а если попадут в обход него — отклонит api.
    departure_airport_icao: segment.departureAirport?.icao ?? '',
    arrival_airport_icao: segment.arrivalAirport?.icao ?? '',
    departure_at: toLocalDateTimeInput(segment.departureAt),
    arrival_at: toLocalDateTimeInput(segment.arrivalAt),
    cabin_class: segment.cabinClass,
    airline_id: segment.airline?.id ?? 0,
    flight_number: segment.flightNumber.trim(),
  }
}

function toFlightInput(flight: Flight): FlightInputDto {
  return {
    price: flight.price.trim(),
    currency: flight.currency,
    manager_comment: flight.managerComment,
    segments: flight.segments.map(toFlightSegmentInput),
  }
}

function blankDomainFields() {
  return {
    clients: [],
    startDate: '',
    endDate: '',
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
    flights: (dto.flights ?? []).map(mapFlightResponse),
    // Остальные доменные поля бэкенд ещё не хранит (см. issue #24).
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
    flights: (dto.flights ?? []).map(mapFlightResponse),
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

  static async create(data: OfferCreateFields): Promise<Offer> {
    const response = await apiClient.post<CreateOfferResponseDto>('/api/v1/offers', {
      title: data.title,
      description: data.description,
      status: data.status,
      flights: data.flights.map(toFlightInput),
    })
    // POST возвращает только { id, uuid } — дозапрашиваем полную запись
    return OfferApi.getById(response.data.uuid)
  }

  static async update(uuid: string, data: OfferUpdateFields): Promise<Offer> {
    await apiClient.patch(`/api/v1/offers/${uuid}`, {
      title: data.title,
      description: data.description,
      status: data.status,
      flights: data.flights.map(toFlightInput),
    })
    // PATCH возвращает только { id, uuid } — дозапрашиваем полную запись
    return OfferApi.getById(uuid)
  }

  static async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/v1/offers/${uuid}`)
  }
}

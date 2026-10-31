import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from './axios'
import { OfferApi } from './offer'
import type { Flight } from './types/offer'

vi.mock('./axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedClient = vi.mocked(apiClient, true)

const baseOfferDto = {
  id: 1,
  uuid: 'uuid-1',
  agency_id: 7,
  created_by: 3,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
  title: 'Тур',
  description: '',
  status: 'draft',
}

const usseAirportDto = {
  icao: 'USSS',
  iata: 'SVX',
  name: 'Кольцово',
  city: { name: 'Екатеринбург', timezone: 'Asia/Yekaterinburg' },
  country: { iso2: 'RU', name: 'Россия' },
}

const uueeAirportDto = {
  icao: 'UUEE',
  iata: null,
  name: 'Шереметьево',
  city: { name: 'Москва', timezone: null },
  country: { iso2: 'RU', name: 'Россия' },
}

// Перелёт из карточки: все поля ответа, в том числе те, что при записи не отправляются.
const flightDto = {
  id: 11,
  price: '12345.50',
  currency: 'EUR',
  manager_comment: 'Багаж оплачивается отдельно',
  departure_airport_icao: 'USSS',
  arrival_airport_icao: 'UUEE',
  total_duration_seconds: 10800,
  segments: [
    {
      departure_airport_icao: 'USSS',
      arrival_airport_icao: 'UUEE',
      departure_airport: usseAirportDto,
      arrival_airport: uueeAirportDto,
      departure_at: '2026-05-14T10:00:00',
      arrival_at: '2026-05-14T11:00:00',
      duration_seconds: 10800,
      cabin_class: 'comfort_plus',
      flight_number: 'SU1234',
      airline_id: 42,
      airline: { id: 42, icao: 'AFL', name: 'Aeroflot', name_ru: 'Аэрофлот', dissolved_on: null },
    },
  ],
  layovers: [{ airport_icao: 'UUEE', duration_seconds: 9000 }],
}

const flightModel: Flight = {
  id: 11,
  price: ' 12345.5 ',
  currency: 'EUR',
  managerComment: '',
  totalDurationSeconds: 10800,
  layovers: [{ airportIcao: 'UUEE', durationSeconds: 9000 }],
  segments: [
    {
      departureAirport: {
        icao: 'USSS',
        iata: 'SVX',
        name: 'Кольцово',
        city: { name: 'Екатеринбург', timezone: 'Asia/Yekaterinburg' },
        country: { iso2: 'RU', name: 'Россия' },
      },
      arrivalAirport: {
        icao: 'UUEE',
        iata: null,
        name: 'Шереметьево',
        city: { name: 'Москва', timezone: null },
        country: { iso2: 'RU', name: 'Россия' },
      },
      departureAt: '2026-05-14T10:00:00',
      arrivalAt: '2026-05-14T11:00',
      cabinClass: '',
      airline: { id: 1, icao: null, name: 'Unknown', nameRu: 'Неизвестная', dissolvedOn: null },
      flightNumber: '  ',
      durationSeconds: 10800,
    },
  ],
}

// Тело записи flightModel: только поля контракта, цена и номер обрезаны, время полное.
const flightInput = {
  price: '12345.5',
  currency: 'EUR',
  manager_comment: '',
  segments: [
    {
      departure_airport_icao: 'USSS',
      arrival_airport_icao: 'UUEE',
      departure_at: '2026-05-14T10:00:00',
      arrival_at: '2026-05-14T11:00:00',
      cabin_class: '',
      airline_id: 1,
      flight_number: '',
    },
  ],
}

describe('OfferApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll maps list response to camelCase offers + meta', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            uuid: 'uuid-1',
            agency_id: 7,
            created_by: 3,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-02T00:00:00Z',
            title: 'Тур в Турцию',
            description: 'desc',
            status: 'draft',
          },
        ],
        meta: { limit: 20, offset: 0, total: 1 },
      },
    })

    const result = await OfferApi.getAll({ status: 'draft', createdBy: 3, limit: 20, offset: 0 })

    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/offers', {
      params: { status: 'draft', created_by: 3, limit: 20, offset: 0 },
    })
    expect(result.total).toBe(1)
    expect(result.limit).toBe(20)
    expect(result.offset).toBe(0)
    expect(result.offers).toHaveLength(1)
    expect(result.offers[0]).toMatchObject({
      uuid: 'uuid-1',
      id: 1,
      agencyId: 7,
      createdBy: 3,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      title: 'Тур в Турцию',
      description: 'desc',
      status: 'draft',
    })
    // в списке перелётов нет — разбор даёт пустой набор
    expect(result.offers[0].flights).toEqual([])
    // доменные поля, ещё не поддержанные бэкендом, приходят пустыми
    expect(result.offers[0].hotels).toEqual([])
  })

  it('getById requests /api/v1/offers/{uuid} and maps the response', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        uuid: 'uuid-1',
        agency_id: 7,
        created_by: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-02T00:00:00Z',
        title: 'Тур в Турцию',
        description: '',
        status: 'ready',
      },
    })

    const offer = await OfferApi.getById('uuid-1')

    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/offers/uuid-1')
    expect(offer.uuid).toBe('uuid-1')
    expect(offer.id).toBe(1)
    expect(offer.status).toBe('ready')
  })

  it('getPublicById requests /api/v1/public/offers/{uuid} and maps as published', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        uuid: 'uuid-1',
        agency_id: 7,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-02T00:00:00Z',
        title: 'Тур в Турцию',
        description: '',
      },
    })

    const offer = await OfferApi.getPublicById('uuid-1')

    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/public/offers/uuid-1')
    expect(offer.uuid).toBe('uuid-1')
    expect(offer.status).toBe('published')
  })

  it('create POSTs basic fields then re-fetches the full offer by uuid', async () => {
    mockedClient.post.mockResolvedValueOnce({ data: { id: 1, uuid: 'uuid-new' } })
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        uuid: 'uuid-new',
        agency_id: 7,
        created_by: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        title: 'Новый тур',
        description: '',
        status: 'draft',
      },
    })

    const offer = await OfferApi.create({ title: 'Новый тур', description: '', status: 'draft', flights: [] })

    // Пустой раздел перелётов всё равно отправляется
    expect(mockedClient.post).toHaveBeenCalledWith('/api/v1/offers', {
      title: 'Новый тур',
      description: '',
      status: 'draft',
      flights: [],
    })
    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/offers/uuid-new')
    expect(offer.uuid).toBe('uuid-new')
  })

  it('update PATCHes /api/v1/offers/{uuid} then re-fetches the full offer', async () => {
    mockedClient.patch.mockResolvedValueOnce({ data: { id: 1, uuid: 'uuid-1' } })
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        uuid: 'uuid-1',
        agency_id: 7,
        created_by: 3,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-03T00:00:00Z',
        title: 'Обновлённый тур',
        description: '',
        status: 'ready',
      },
    })

    const offer = await OfferApi.update('uuid-1', { title: 'Обновлённый тур', status: 'ready', flights: [] })

    // Удаление всех перелётов: "flights": [] обязательно попадает в тело
    expect(mockedClient.patch).toHaveBeenCalledWith('/api/v1/offers/uuid-1', {
      title: 'Обновлённый тур',
      description: undefined,
      status: 'ready',
      flights: [],
    })
    expect(offer.title).toBe('Обновлённый тур')
  })

  describe('flights', () => {
    it('POST body contains only contract fields', async () => {
      mockedClient.post.mockResolvedValueOnce({ data: { id: 1, uuid: 'uuid-1' } })
      mockedClient.get.mockResolvedValueOnce({ data: baseOfferDto })

      await OfferApi.create({ title: 'Тур', description: '', status: 'draft', flights: [flightModel] })

      const body = mockedClient.post.mock.calls[0][1] as { flights: unknown[] }
      // toEqual по всему объекту: id, длительности, объекты аэропортов и авиакомпании не проходят
      expect(body.flights).toEqual([flightInput])
    })

    it('PATCH body contains only contract fields', async () => {
      mockedClient.patch.mockResolvedValueOnce({ data: { id: 1, uuid: 'uuid-1' } })
      mockedClient.get.mockResolvedValueOnce({ data: baseOfferDto })

      await OfferApi.update('uuid-1', { flights: [flightModel] })

      const body = mockedClient.patch.mock.calls[0][1] as { flights: unknown[] }
      expect(body.flights).toEqual([flightInput])
    })

    it('getById parses the card response into the web model', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { ...baseOfferDto, flights: [flightDto] } })

      const offer = await OfferApi.getById('uuid-1')

      expect(offer.flights).toEqual([
        {
          id: 11,
          price: '12345.50',
          currency: 'EUR',
          managerComment: 'Багаж оплачивается отдельно',
          totalDurationSeconds: 10800,
          layovers: [{ airportIcao: 'UUEE', durationSeconds: 9000 }],
          segments: [
            {
              departureAirport: usseAirportDto,
              arrivalAirport: uueeAirportDto,
              departureAt: '2026-05-14T10:00:00',
              arrivalAt: '2026-05-14T11:00:00',
              cabinClass: 'comfort_plus',
              airline: { id: 42, icao: 'AFL', name: 'Aeroflot', nameRu: 'Аэрофлот', dissolvedOn: null },
              flightNumber: 'SU1234',
              durationSeconds: 10800,
            },
          ],
        },
      ])
    })

    it('getPublicById parses flights the same way', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { ...baseOfferDto, flights: [flightDto] } })

      const offer = await OfferApi.getPublicById('uuid-1')

      expect(offer.flights[0].segments[0].departureAirport?.icao).toBe('USSS')
      expect(offer.flights[0].totalDurationSeconds).toBe(10800)
    })

    it('card without flights gives an empty set', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { ...baseOfferDto, flights: [] } })

      const offer = await OfferApi.getById('uuid-1')

      expect(offer.flights).toEqual([])
    })

    it('round trip response → model → request keeps time, ICAO, price and airline_id', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { ...baseOfferDto, flights: [flightDto] } })
      const offer = await OfferApi.getById('uuid-1')

      mockedClient.patch.mockResolvedValueOnce({ data: { id: 1, uuid: 'uuid-1' } })
      mockedClient.get.mockResolvedValueOnce({ data: baseOfferDto })
      await OfferApi.update('uuid-1', { flights: offer.flights })

      const body = mockedClient.patch.mock.calls[0][1] as { flights: unknown[] }
      expect(body.flights).toEqual([
        {
          price: '12345.50',
          currency: 'EUR',
          manager_comment: 'Багаж оплачивается отдельно',
          segments: [
            {
              departure_airport_icao: 'USSS',
              arrival_airport_icao: 'UUEE',
              departure_at: '2026-05-14T10:00:00',
              arrival_at: '2026-05-14T11:00:00',
              cabin_class: 'comfort_plus',
              airline_id: 42,
              flight_number: 'SU1234',
            },
          ],
        },
      ])
    })
  })

  it('delete calls DELETE /api/v1/offers/{uuid}', async () => {
    mockedClient.delete.mockResolvedValueOnce({})

    await OfferApi.delete('uuid-1')

    expect(mockedClient.delete).toHaveBeenCalledWith('/api/v1/offers/uuid-1')
  })
})

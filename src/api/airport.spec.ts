import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from './axios'
import { AirportApi } from './airport'

vi.mock('./axios', () => ({
  default: { get: vi.fn() },
}))

const mockedClient = vi.mocked(apiClient, true)

// Полный ответ api: лишние для web поля в модель не попадают
function airportDto(iata: string | null) {
  return {
    icao: 'UUEE',
    iata,
    name: 'Шереметьево',
    location: { latitude: 55.97, longitude: 37.41, elevation_ft: 622 },
    city: { id: 7, name: 'Москва', state: null, timezone: 'Europe/Moscow' },
    country: { iso2: 'RU', name: 'Россия' },
  }
}

describe('AirportApi.search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('передаёт search и limit в GET /api/v1/airports', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: { data: [], meta: { total: 0, limit: 5, offset: 0, search: 'мос' } },
    })

    await AirportApi.search('мос', 5)

    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/airports', {
      params: { search: 'мос', limit: 5 },
    })
  })

  it('разбирает ответ в модель web только с нужными полями', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        data: [airportDto('SVO')],
        meta: { total: 1, limit: 15, offset: 0, search: 'мос' },
      },
    })

    const result = await AirportApi.search('мос', 15)

    expect(result.data).toEqual([
      {
        icao: 'UUEE',
        iata: 'SVO',
        name: 'Шереметьево',
        city: { name: 'Москва' },
        country: { iso2: 'RU', name: 'Россия' },
      },
    ])
    expect(result.meta).toEqual({ total: 1, limit: 15, offset: 0 })
  })

  it.each([[null], ['']])('iata %j в ответе → null в модели', async (iata) => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        data: [airportDto(iata)],
        meta: { total: 1, limit: 15, offset: 0, search: 'мос' },
      },
    })

    const result = await AirportApi.search('мос', 15)

    expect(result.data[0].iata).toBeNull()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from './axios'
import { AirlineApi } from './airline'

vi.mock('./axios', () => ({
  default: { get: vi.fn() },
}))

const mockedClient = vi.mocked(apiClient, true)

describe('AirlineApi.search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('передаёт search и limit в GET /api/v1/airlines', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: { data: [], meta: { total: 0, limit: 5, offset: 0 } },
    })

    await AirlineApi.search('аэрофл', 5)

    expect(mockedClient.get).toHaveBeenCalledWith('/api/v1/airlines', {
      params: { search: 'аэрофл', limit: 5 },
    })
  })

  it('разбирает ответ в модель web', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 42,
            icao: 'AFL',
            name: 'Аэрофлот',
            country: { iso2: 'RU', name: 'Россия' },
            dissolved_on: null,
          },
          {
            id: 1,
            icao: null,
            name: 'Неизвестная',
            country: null,
            dissolved_on: '2015-10-26',
          },
        ],
        meta: { total: 2, limit: 15, offset: 0, search: 'а', country: null, ids: null },
      },
    })

    const result = await AirlineApi.search('аэрофл')

    expect(result.data).toEqual([
      {
        id: 42,
        icao: 'AFL',
        name: 'Аэрофлот',
        country: { iso2: 'RU', name: 'Россия' },
        dissolvedOn: null,
      },
      {
        id: 1,
        icao: null,
        name: 'Неизвестная',
        country: null,
        dissolvedOn: '2015-10-26',
      },
    ])
    expect(result.meta).toEqual({ total: 2, limit: 15, offset: 0 })
  })
})

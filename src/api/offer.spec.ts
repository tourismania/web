import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient from './axios'
import { OfferApi } from './offer'

vi.mock('./axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedClient = vi.mocked(apiClient, true)

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
    // доменные поля, ещё не поддержанные бэкендом, приходят пустыми
    expect(result.offers[0].flights).toEqual([])
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

    const offer = await OfferApi.create({ title: 'Новый тур', description: '', status: 'draft' })

    expect(mockedClient.post).toHaveBeenCalledWith('/api/v1/offers', {
      title: 'Новый тур',
      description: '',
      status: 'draft',
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

    const offer = await OfferApi.update('uuid-1', { title: 'Обновлённый тур', status: 'ready' })

    expect(mockedClient.patch).toHaveBeenCalledWith('/api/v1/offers/uuid-1', {
      title: 'Обновлённый тур',
      description: undefined,
      status: 'ready',
    })
    expect(offer.title).toBe('Обновлённый тур')
  })

  it('delete calls DELETE /api/v1/offers/{uuid}', async () => {
    mockedClient.delete.mockResolvedValueOnce({})

    await OfferApi.delete('uuid-1')

    expect(mockedClient.delete).toHaveBeenCalledWith('/api/v1/offers/uuid-1')
  })
})

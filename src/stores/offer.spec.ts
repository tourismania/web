import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useOfferStore } from './offer'
import { OfferApi } from '@/api/offer'
import type { Offer } from '@/api/types/offer'

vi.mock('@/api/offer', () => ({
  OfferApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedOfferApi = vi.mocked(OfferApi, true)

function baseOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    uuid: 'uuid-1',
    id: 1,
    status: 'draft',
    title: 'Тур',
    description: '',
    agencyId: 7,
    createdBy: 3,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    clients: [],
    startDate: '',
    endDate: '',
    flights: [],
    hotels: [],
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
    ...overrides,
  }
}

describe('offer store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('loadOffers', () => {
    it('populates offers + meta on success', async () => {
      mockedOfferApi.getAll.mockResolvedValueOnce({
        offers: [baseOffer()],
        total: 1,
        limit: 20,
        offset: 0,
      })

      const store = useOfferStore()
      await store.loadOffers()

      expect(store.offers).toHaveLength(1)
      expect(store.offers[0].uuid).toBe('uuid-1')
      expect(store.meta).toEqual({ total: 1, limit: 20, offset: 0 })
      expect(store.error).toBeNull()
      expect(store.loading).toBe(false)
    })

    it('surfaces the error and leaves offers untouched on failure', async () => {
      mockedOfferApi.getAll.mockRejectedValueOnce(new Error('network down'))

      const store = useOfferStore()
      await store.loadOffers()

      expect(store.offers).toEqual([])
      expect(store.error).toBe('Не удалось загрузить список офферов')
      expect(store.loading).toBe(false)
      expect(console.error).toHaveBeenCalled()
    })

  })

  describe('loadOfferById', () => {
    it('sets currentOffer on success', async () => {
      mockedOfferApi.getById.mockResolvedValueOnce(baseOffer())

      const store = useOfferStore()
      await store.loadOfferById('uuid-1')

      expect(store.currentOffer?.uuid).toBe('uuid-1')
      expect(store.error).toBeNull()
    })

    it('sets error and null currentOffer on failure', async () => {
      mockedOfferApi.getById.mockRejectedValueOnce(new Error('not found'))

      const store = useOfferStore()
      await store.loadOfferById('missing')

      expect(store.currentOffer).toBeNull()
      expect(store.error).toBe('Не удалось загрузить оффер')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('createOffer', () => {
    it('creates via API and returns the created offer', async () => {
      mockedOfferApi.create.mockResolvedValueOnce(baseOffer({ uuid: 'uuid-new', title: 'Новый тур' }))

      const store = useOfferStore()
      const result = await store.createOffer({ title: 'Новый тур' })

      expect(mockedOfferApi.create).toHaveBeenCalledWith({
        title: 'Новый тур',
        description: '',
        status: 'draft',
      })
      expect(result?.uuid).toBe('uuid-new')
      expect(store.offers).toHaveLength(1)
    })

    it('returns null and sets error on API failure', async () => {
      mockedOfferApi.create.mockRejectedValueOnce(new Error('validation failed'))

      const store = useOfferStore()
      const result = await store.createOffer({ title: 'Тур' })

      expect(result).toBeNull()
      expect(store.error).toBe('Не удалось создать оффер')
      expect(store.offers).toHaveLength(0)
    })
  })

  describe('updateOffer', () => {
    it('updates via API and updates offers/currentOffer with the API response', async () => {
      mockedOfferApi.update.mockResolvedValueOnce(baseOffer({ title: 'Изменённый' }))

      const store = useOfferStore()
      store.offers = [baseOffer()]
      store.currentOffer = baseOffer()

      const result = await store.updateOffer('uuid-1', { title: 'Изменённый' })

      expect(mockedOfferApi.update).toHaveBeenCalledWith('uuid-1', {
        title: 'Изменённый',
        description: '',
        status: undefined,
      })
      expect(result?.title).toBe('Изменённый')
      expect(store.offers[0].title).toBe('Изменённый')
      expect(store.currentOffer?.title).toBe('Изменённый')
    })

    it('returns null and sets error on API failure', async () => {
      mockedOfferApi.update.mockRejectedValueOnce(new Error('forbidden'))

      const store = useOfferStore()
      const result = await store.updateOffer('uuid-1', { title: 'x' })

      expect(result).toBeNull()
      expect(store.error).toBe('Не удалось сохранить оффер')
    })
  })

  describe('deleteOffer', () => {
    it('removes the offer from state on success', async () => {
      mockedOfferApi.delete.mockResolvedValueOnce(undefined)

      const store = useOfferStore()
      store.offers = [baseOffer()]
      store.currentOffer = baseOffer()

      const success = await store.deleteOffer('uuid-1')

      expect(success).toBe(true)
      expect(store.offers).toHaveLength(0)
      expect(store.currentOffer).toBeNull()
    })

    it('returns false and sets error on API failure', async () => {
      mockedOfferApi.delete.mockRejectedValueOnce(new Error('forbidden'))

      const store = useOfferStore()
      store.offers = [baseOffer()]

      const success = await store.deleteOffer('uuid-1')

      expect(success).toBe(false)
      expect(store.error).toBe('Не удалось удалить оффер')
      expect(store.offers).toHaveLength(1)
    })
  })
})

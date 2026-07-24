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
    ...overrides,
  }
}

describe('offer store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
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

    it('merges local domain content (flights/hotels) into offers coming from the API', async () => {
      localStorage.setItem(
        'tourismania:offers',
        JSON.stringify({
          'uuid-1': {
            clients: [{ name: 'A', surname: 'B', email: 'a@b.com' }],
            welcomeText: 'Привет',
            startDate: '2026-05-01',
            endDate: '2026-05-10',
            flights: [{ segments: [], price: 100, currency: 'RUB' }],
            hotels: [],
            carRentals: [],
            cruises: [],
            excursions: [],
            transport: [],
            additionalServices: [],
          },
        }),
      )
      mockedOfferApi.getAll.mockResolvedValueOnce({
        offers: [baseOffer()],
        total: 1,
        limit: 20,
        offset: 0,
      })

      const store = useOfferStore()
      await store.loadOffers()

      expect(store.offers[0].welcomeText).toBe('Привет')
      expect(store.offers[0].flights).toHaveLength(1)
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
    it('creates via API, persists domain content locally and returns the merged offer', async () => {
      mockedOfferApi.create.mockResolvedValueOnce(baseOffer({ uuid: 'uuid-new', title: 'Новый тур' }))

      const store = useOfferStore()
      const result = await store.createOffer({
        title: 'Новый тур',
        clients: [],
        welcomeText: 'Добро пожаловать',
        startDate: '2026-06-01',
        endDate: '2026-06-05',
        flights: [],
        hotels: [{ name: 'Отель', stars: 4, address: '', description: '', roomType: '', occupancyType: '', price: 1000, currency: 'RUB', gallery: [], serviceFee: 0, checkIn: '', checkOut: '' }],
        carRentals: [],
        cruises: [],
        excursions: [],
        transport: [],
        additionalServices: [],
      })

      expect(mockedOfferApi.create).toHaveBeenCalledWith({
        title: 'Новый тур',
        description: '',
        status: 'draft',
      })
      expect(result?.uuid).toBe('uuid-new')
      expect(result?.hotels).toHaveLength(1)
      expect(store.offers).toHaveLength(1)

      const persisted = JSON.parse(localStorage.getItem('tourismania:offers') ?? '{}')
      expect(persisted['uuid-new'].hotels).toHaveLength(1)
      expect(persisted['uuid-new'].welcomeText).toBe('Добро пожаловать')
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
    it('updates via API, persists domain content and updates offers/currentOffer', async () => {
      mockedOfferApi.update.mockResolvedValueOnce(baseOffer({ title: 'Изменённый' }))

      const store = useOfferStore()
      store.offers = [baseOffer()]
      store.currentOffer = baseOffer()

      const result = await store.updateOffer('uuid-1', {
        title: 'Изменённый',
        clients: [],
        welcomeText: '',
        startDate: '',
        endDate: '',
        flights: [{ segments: [], price: 500, currency: 'RUB' }],
        hotels: [],
        carRentals: [],
        cruises: [],
        excursions: [],
        transport: [],
        additionalServices: [],
      })

      expect(mockedOfferApi.update).toHaveBeenCalledWith('uuid-1', {
        title: 'Изменённый',
        description: '',
        status: undefined,
      })
      expect(result?.flights).toHaveLength(1)
      expect(store.offers[0].flights).toHaveLength(1)
      expect(store.currentOffer?.flights).toHaveLength(1)
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
    it('removes the offer from state and local domain content on success', async () => {
      mockedOfferApi.delete.mockResolvedValueOnce(undefined)
      localStorage.setItem('tourismania:offers', JSON.stringify({ 'uuid-1': {} }))

      const store = useOfferStore()
      store.offers = [baseOffer()]
      store.currentOffer = baseOffer()

      const success = await store.deleteOffer('uuid-1')

      expect(success).toBe(true)
      expect(store.offers).toHaveLength(0)
      expect(store.currentOffer).toBeNull()
      const persisted = JSON.parse(localStorage.getItem('tourismania:offers') ?? '{}')
      expect(persisted['uuid-1']).toBeUndefined()
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

import { defineStore } from 'pinia'
import { OfferApi, type OfferListParams } from '@/api/offer'
import type { Offer } from '@/api/types/offer'

// ─── localStorage: доменный контент, которого ещё нет в реальном API ────────
//
// Бэкенд (issue #24, api/docs/swagger/swagger.json) хранит только базовые
// поля оффера: title, description, status, agencyId, createdBy, timestamps.
// Перелёты/отели/круизы/итд там пока не появились, поэтому эта часть модели
// временно живёт в localStorage и подмешивается к базовым полям, пришедшим
// с реального API, по uuid оффера (Offer.uuid).
const STORAGE_KEY = 'tourismania:offers'

type DomainContent = Pick<
  Offer,
  | 'clients'
  | 'welcomeText'
  | 'startDate'
  | 'endDate'
  | 'flights'
  | 'hotels'
  | 'carRentals'
  | 'cruises'
  | 'excursions'
  | 'transport'
  | 'additionalServices'
>

function blankDomainContent(): DomainContent {
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

function extractDomainContent(data: Partial<Offer>): DomainContent {
  const blank = blankDomainContent()
  return {
    clients: data.clients ?? blank.clients,
    welcomeText: data.welcomeText ?? blank.welcomeText,
    startDate: data.startDate ?? blank.startDate,
    endDate: data.endDate ?? blank.endDate,
    flights: data.flights ?? blank.flights,
    hotels: data.hotels ?? blank.hotels,
    carRentals: data.carRentals ?? blank.carRentals,
    cruises: data.cruises ?? blank.cruises,
    excursions: data.excursions ?? blank.excursions,
    transport: data.transport ?? blank.transport,
    additionalServices: data.additionalServices ?? blank.additionalServices,
  }
}

function readDomainContentMap(): Record<string, DomainContent> {
  try {
    if (typeof localStorage === 'undefined') return {}
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (e) {
    console.error('[offer-store] failed to read domain content from localStorage', e)
    return {}
  }
}

function writeDomainContentMap(map: Record<string, DomainContent>): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch (e) {
    console.error('[offer-store] failed to persist domain content to localStorage', e)
  }
}

function mergeWithDomainContent(base: Offer, map: Record<string, DomainContent>): Offer {
  const domain = base.uuid ? map[base.uuid] : undefined
  return domain ? { ...base, ...domain } : base
}

export const useOfferStore = defineStore('offer', {
  state: () => ({
    offers: [] as Offer[],
    currentOffer: null as Offer | null,
    loading: false,
    error: null as string | null,
    meta: { total: 0, limit: 20, offset: 0 },
  }),

  getters: {
    offerById: (state) => (uuid: string) => state.offers.find((o) => o.uuid === uuid) ?? null,
    offersCount: (state) => state.offers.length,
  },

  actions: {
    async loadOffers(params: OfferListParams = {}) {
      this.loading = true
      this.error = null
      try {
        const { offers, total, limit, offset } = await OfferApi.getAll(params)
        const domainMap = readDomainContentMap()
        this.offers = offers.map((o) => mergeWithDomainContent(o, domainMap))
        this.meta = { total, limit, offset }
      } catch (e) {
        console.error('[offer-store] failed to load offers', e)
        this.error = 'Не удалось загрузить список офферов'
      } finally {
        this.loading = false
      }
    },

    async loadOfferById(uuid: string) {
      this.loading = true
      this.error = null
      try {
        const base = await OfferApi.getById(uuid)
        const domainMap = readDomainContentMap()
        this.currentOffer = mergeWithDomainContent(base, domainMap)
      } catch (e) {
        console.error('[offer-store] failed to load offer', uuid, e)
        this.error = 'Не удалось загрузить оффер'
        this.currentOffer = null
      } finally {
        this.loading = false
      }
    },

    async createOffer(data: Partial<Offer>): Promise<Offer | null> {
      this.loading = true
      this.error = null
      try {
        const base = await OfferApi.create({
          title: data.title ?? '',
          description: data.description ?? '',
          status: data.status ?? 'draft',
        })
        const domainMap = readDomainContentMap()
        if (base.uuid) {
          domainMap[base.uuid] = extractDomainContent(data)
          writeDomainContentMap(domainMap)
        }
        const created = mergeWithDomainContent(base, domainMap)
        this.offers.push(created)
        return created
      } catch (e) {
        console.error('[offer-store] failed to create offer', e)
        this.error = 'Не удалось создать оффер'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateOffer(uuid: string, data: Partial<Offer>): Promise<Offer | null> {
      this.loading = true
      this.error = null
      try {
        const base = await OfferApi.update(uuid, {
          title: data.title,
          description: data.description ?? '',
          status: data.status,
        })
        const domainMap = readDomainContentMap()
        domainMap[uuid] = extractDomainContent(data)
        writeDomainContentMap(domainMap)
        const updated = mergeWithDomainContent(base, domainMap)
        const idx = this.offers.findIndex((o) => o.uuid === uuid)
        if (idx !== -1) this.offers[idx] = updated
        if (this.currentOffer?.uuid === uuid) this.currentOffer = updated
        return updated
      } catch (e) {
        console.error('[offer-store] failed to update offer', uuid, e)
        this.error = 'Не удалось сохранить оффер'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteOffer(uuid: string): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        await OfferApi.delete(uuid)
        const domainMap = readDomainContentMap()
        delete domainMap[uuid]
        writeDomainContentMap(domainMap)
        this.offers = this.offers.filter((o) => o.uuid !== uuid)
        if (this.currentOffer?.uuid === uuid) this.currentOffer = null
        return true
      } catch (e) {
        console.error('[offer-store] failed to delete offer', uuid, e)
        this.error = 'Не удалось удалить оффер'
        return false
      } finally {
        this.loading = false
      }
    },

    clearCurrentOffer() {
      this.currentOffer = null
      this.error = null
    },
  },
})

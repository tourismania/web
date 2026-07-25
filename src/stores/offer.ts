import { defineStore } from 'pinia'
import { OfferApi, type OfferListParams } from '@/api/offer'
import type { Offer } from '@/api/types/offer'

// ─── Доменный контент, которого ещё нет в реальном API ──────────────────────
//
// Бэкенд (issue #24, api/docs/swagger/swagger.json) хранит только базовые
// поля оффера: title, description, status, agencyId, createdBy, timestamps.
// Перелёты/отели/круизы/итд там пока не появились. localStorage-фолбэк для
// этих полей убран (см. ревью PR #25) — работу с ними переделаем целиком под
// реальный API отдельной задачей. Тип оставлен как документация структуры,
// которую предстоит перенести на бэкенд.
export type DomainContent = Pick<
  Offer,
  | 'clients'
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
        this.offers = offers
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
        this.currentOffer = await OfferApi.getById(uuid)
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
        const created = await OfferApi.create({
          title: data.title ?? '',
          description: data.description ?? '',
          status: data.status ?? 'draft',
        })
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
        const updated = await OfferApi.update(uuid, {
          title: data.title,
          description: data.description ?? '',
          status: data.status,
        })
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

import { defineStore } from 'pinia'
import type { PublicTransportLeg } from '@/types/voucher'

interface VoucherPublicTransportState {
  legs: PublicTransportLeg[]
  sectionTotal: string
}

export const useVoucherPublicTransportStore = defineStore('voucherPublicTransport', {
  state: (): VoucherPublicTransportState => ({
    sectionTotal: 'Итого: 545,00\u00a0$',
    legs: [
      {
        id: 'pt-1',
        date: '26 сентября',
        category: 'Такси / трансфер Аэропорт Стамбула - отель ',
        note: '41 км (≈50 минут)',
        cost: '150,00\u00a0$',
      },
      {
        id: 'pt-2',
        date: '27 сентября',
        category: 'Такси / трансфер Аэропорт Стамбула - отель ',
        note: '41 км (≈50 минут)',
        cost: '150,00\u00a0$',
      },
      {
        id: 'pt-3',
        date: '2 октября',
        category: 'Такси / Трансфер отель - Аэропорт НЙ ',
        note: '428 км (≈40 минут)',
        cost: '245,00\u00a0$',
      },
    ],
  }),
})

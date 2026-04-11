import { defineStore } from 'pinia'
import type { AccommodationStay } from '@/types/voucher'

interface VoucherAccommodationState {
  stays: AccommodationStay[]
  sectionTotal: string
}

export const useVoucherAccommodationStore = defineStore('voucherAccommodation', {
  state: (): VoucherAccommodationState => ({
    sectionTotal: 'Итого: 272\u00a0691,00\u00a0₽',
    stays: [
      {
        id: 'stay-1',
        date: '26 - 27 сентября',
        placement: 'The Haze Karaköy',
        nights: 1,
        cityAndAddress: 'TR, Istanbul, Necatibey Caddesi No:36-38, Karaköy',
        extraInfo:
          'Включены завтраки для взрослых, завтрак для ребенка оплачивается на месте (20 евро) ',
        cost: '17\u00a0766,00\u00a0₽',
      },
      {
        id: 'stay-2',
        date: '27 сентября - 2 октября',
        placement: 'The Fifty Sonesta Hotel New York 4*',
        nights: 5,
        cityAndAddress: '155 East 50th Street, New York, NY 10022',
        extraInfo:
          'Без завтраков, номер с мини-кухней. На месте оплачивается сбор 224 USD',
        cost: '254\u00a0709,00\u00a0₽',
      },
    ],
  }),
})

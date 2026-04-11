import { defineStore } from 'pinia'
import type { ExcursionItem } from '@/types/voucher'

interface VoucherExcursionState {
  items: ExcursionItem[]
  sectionTotal: string
}

export const useVoucherExcursionStore = defineStore('voucherExcursion', {
  state: (): VoucherExcursionState => ({
    sectionTotal: 'Итого: 2407,00\u00a0$',
    items: [
      {
        id: 'ex-1',
        date: '28 сентября - 1 октября',
        category: 'NewYork Pass',
        note: 'https://newyorkpass.com/en ',
        cost: '1762,00\u00a0$',
      },
      {
        id: 'ex-2',
        date: '-',
        category: 'Полет на Вертолете ',
        note: 'https://rsbtravel.com/excursion/obzornaya-ekskursiya-po-nyu-yorku ',
        cost: '645,00\u00a0$',
      },
    ],
  }),
})

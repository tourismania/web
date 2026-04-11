import { defineStore } from 'pinia'
import type { RouteSheetCategoryTotal, RouteSheetSummaryFooter, RouteSheetViewModel } from '@/types/voucher'
import { useVoucherAccommodationStore } from '@/stores/voucher-accommodation'
import { useVoucherPublicTransportStore } from '@/stores/voucher-public-transport'
import { useVoucherExcursionStore } from '@/stores/voucher-excursion'

interface VoucherRouteSheetState {
  summaryRows: RouteSheetCategoryTotal[]
  summaryFooter: RouteSheetSummaryFooter
}

export const useVoucherRouteSheetStore = defineStore('voucherRouteSheet', {
  state: (): VoucherRouteSheetState => ({
    summaryRows: [
      { category: 'ПЕРЕЛЕТ', cost: '432\u00a0530,00\u00a0₽' },
      { category: 'ЖИЛЬЕ', cost: '432\u00a0530,00\u00a0₽' },
      { category: 'НАЛОГИ', cost: '432\u00a0530,00\u00a0₽' },
    ],
    summaryFooter: {
      category: '',
      cost: 'Итого: 41214135,00\u00a0₽',
    },
  }),
  getters: {
    viewModel(): RouteSheetViewModel {
      const accommodation = useVoucherAccommodationStore()
      const publicTransport = useVoucherPublicTransportStore()
      const excursions = useVoucherExcursionStore()
      return {
        accommodations: accommodation.stays,
        accommodationSectionTotal: accommodation.sectionTotal,
        publicTransport: publicTransport.legs,
        publicTransportSectionTotal: publicTransport.sectionTotal,
        excursions: excursions.items,
        excursionSectionTotal: excursions.sectionTotal,
        summaryRows: this.summaryRows,
        summaryFooter: this.summaryFooter,
      }
    },
  },
})

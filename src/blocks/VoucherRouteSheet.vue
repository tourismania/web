<script setup lang="ts">
import type { RouteSheetViewModel } from '@/types/voucher'
import VoucherAccommodationTable from '@/components/voucher/VoucherAccommodationTable.vue'
import VoucherPublicTransportTable from '@/components/voucher/VoucherPublicTransportTable.vue'
import VoucherExcursionsTable from '@/components/voucher/VoucherExcursionsTable.vue'
import VoucherRouteSummaryTable from '@/components/voucher/VoucherRouteSummaryTable.vue'

defineProps<{
  model: RouteSheetViewModel
}>()
</script>

<template>
  <div class="voucher-route-sheet">
    <h2>Маршрутный лист с ценами</h2>
    <VoucherAccommodationTable
      :stays="model.accommodations"
      :section-total="model.accommodationSectionTotal"
    />
    <VoucherPublicTransportTable
      :legs="model.publicTransport"
      :section-total="model.publicTransportSectionTotal"
    />
    <VoucherExcursionsTable
      :items="model.excursions"
      :section-total="model.excursionSectionTotal"
    />
    <VoucherRouteSummaryTable :rows="model.summaryRows" :footer="model.summaryFooter" />
  </div>
</template>

<style scoped lang="scss">
.voucher-route-sheet h3 {
  margin-top: 15px;
}
</style>

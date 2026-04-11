<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVoucherRouteSheetStore } from '@/stores/voucher-route-sheet'
import { useVoucherFlightStore } from '@/stores/voucher-flight'
import { useVoucherProgramStore } from '@/stores/voucher-program'
import { useVoucherActivityStore } from '@/stores/voucher-activity'
import VoucherFlightCard from '@/components/voucher/VoucherFlightCard.vue'
import VoucherRouteSheet from '@/blocks/VoucherRouteSheet.vue'
import VoucherProgramPanel from '@/blocks/VoucherProgramPanel.vue'

const tab = ref<string | null>('one')

const routeSheetStore = useVoucherRouteSheetStore()
const flightStore = useVoucherFlightStore()
const programStore = useVoucherProgramStore()
const activityStore = useVoucherActivityStore()

const flightCostTotal = computed(() => flightStore.getCostTotal)
const { segments: flightSegments} = storeToRefs(flightStore)

const routeSheetModel = computed(() => routeSheetStore.viewModel)

function daysForProgram(programId: string) {
  return activityStore.daysForProgram(programId)
}
</script>

<template>
  <div class="voucher-preview">
    <v-card class="voucher-preview__card" variant="flat">
      <v-tabs v-model="tab" bg-color="transparent" color="primary">
        <v-tab value="one">Маршрутный лист с ценами</v-tab>
        <v-tab v-for="p in programStore.programs" :key="p.id" :value="p.tabValue">
          {{ p.title }}
        </v-tab>
      </v-tabs>

      <v-card-text class="voucher-preview__body">
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <div class="voucher-preview__tab-one">
              <section class="voucher-preview-flights" aria-label="Перелёт">
                <h2 class="voucher-preview-flights__title">Перелёт</h2>
                <div class="voucher-preview-flights__cards">
                  <VoucherFlightCard
                    v-for="segment in flightSegments"
                    :key="segment.id"
                    :flight="segment"
                  />
                </div>
                <p class="voucher-preview-flights__total">Общая стоимость: {{ flightCostTotal }}</p>
              </section>

              <VoucherRouteSheet :model="routeSheetModel" />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item
            v-for="p in programStore.programs"
            :key="p.id"
            :value="p.tabValue"
          >
            <VoucherProgramPanel :meta="p" :days="daysForProgram(p.id)" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.voucher-preview__card {
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.voucher-preview__body {
  padding-top: 8px;
}

.voucher-preview__tab-one {
  text-align: center;
}

.voucher-preview-flights {
  margin-bottom: 28px;
}

.voucher-preview-flights__title {
  margin: 0 0 12px;
  font-size: 1.35rem;
}

.voucher-preview-flights__cards {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.voucher-preview-flights__total {
  margin: 12px 0 0;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}
</style>

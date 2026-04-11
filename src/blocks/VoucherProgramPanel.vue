<script setup lang="ts">
import type { ProgramDay, ProgramMeta } from '@/types/voucher'
import VoucherProgramActivitiesTable from '@/components/voucher/VoucherProgramActivitiesTable.vue'

defineProps<{
  meta: ProgramMeta
  days: ProgramDay[]
}>()
</script>

<template>
  <div class="voucher-program-panel">
    <div v-if="meta.headerImageSrcs?.length" class="voucher-program-panel__gallery">
      <img
        v-for="(src, i) in meta.headerImageSrcs"
        :key="i"
        :src="src"
        alt=""
      />
    </div>

    <v-carousel v-if="meta.carouselSrcs?.length" class="voucher-program-panel__carousel">
      <v-carousel-item
        v-for="(src, i) in meta.carouselSrcs"
        :key="i"
        :src="src"
        cover
      />
    </v-carousel>

    <p v-if="meta.weatherNote" class="voucher-program-panel__note">
      {{ meta.weatherNote }}
    </p>

    <div class="voucher-program-panel__table">
      <VoucherProgramActivitiesTable :days="days" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.voucher-program-panel__gallery {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

.voucher-program-panel__note {
  padding: 20px 0;
}

.voucher-program-panel__table {
  padding-top: 8px;
}
</style>

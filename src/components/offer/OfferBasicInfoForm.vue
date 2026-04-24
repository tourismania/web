<script setup lang="ts">
import type { Offer } from '@/api/types/offer'

defineProps<{
  offer: Offer
}>()
</script>

<template>
  <v-card class="basic-info-card mb-3">
    <v-card-text class="pb-2">
      <div class="basic-info-card__label mb-2">Основное</div>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            :model-value="offer.title"
            @update:model-value="$emit('update:offer', { ...offer, title: $event })"
            label="Название"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="offer.startDate"
            @update:model-value="$emit('update:offer', { ...offer, startDate: $event })"
            label="Дата начала"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :model-value="offer.endDate"
            @update:model-value="$emit('update:offer', { ...offer, endDate: $event })"
            label="Дата окончания"
            type="date"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            :model-value="offer.welcomeText"
            @update:model-value="$emit('update:offer', { ...offer, welcomeText: $event })"
            label="Приветственный текст"
            density="compact"
            variant="outlined"
            rows="3"
            hide-details
            auto-grow
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.basic-info-card {
  background: rgba(0, 22, 21, 0.92) !important;
  border: 1px solid rgba(54, 170, 184, 0.2) !important;

  &__label {
    font-size: 0.7rem !important;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
  }
}

:deep(.v-field__input),
:deep(.v-field-label),
:deep(.v-label),
:deep(.v-select__selection-text) {
  font-size: 0.875rem !important;
}
</style>

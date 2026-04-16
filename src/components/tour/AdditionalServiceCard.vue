<script setup lang="ts">
import type { AdditionalService } from '@/api/types/tour'

defineProps<{ service: AdditionalService; index: number }>()

const currencySymbol: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  TRY: '₺',
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}
</script>

<template>
  <div class="service-card">
    <!-- Header row -->
    <div class="service-card__header">
      <!-- Icon + index -->
      <div class="service-card__icon-wrap">
        <v-icon icon="mdi-plus-circle" size="18" />
      </div>
      <div class="service-card__index">#{{ index + 1 }}</div>

      <!-- Name -->
      <div class="service-card__name">{{ service.name }}</div>

      <!-- Price -->
      <div class="service-card__price-block">
        <div class="service-card__price">
          {{ formatPrice(service.price, service.currency) }}
        </div>
        <div class="service-card__price-label">стоимость</div>
      </div>
    </div>

    <!-- Manager comment -->
    <div v-if="service.managerComment" class="service-card__comment">
      <v-icon
        icon="mdi-comment-text-outline"
        size="small"
        class="mr-2 service-card__comment-icon"
      />
      <span>{{ service.managerComment }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.service-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 14px;
  padding: 18px 22px;
  transition:
    border-color 0.25s,
    background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.5);
  }

  // ── Header ────────────────────────────────────────────────────────────────

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(239, 159, 59, 0.1);
    border: 1px solid rgba(239, 159, 59, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-yellow;
    flex-shrink: 0;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
    flex-shrink: 0;
  }

  &__name {
    flex: 1;
    font-size: 16px;
    font-weight: 700;
    color: variables.$color-yellow;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__price-block {
    text-align: right;
    flex-shrink: 0;
  }

  &__price {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  &__price-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 3px;
  }

  // ── Comment ───────────────────────────────────────────────────────────────

  &__comment {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    display: flex;
    align-items: flex-start;
    line-height: 1.6;
  }

  &__comment-icon {
    margin-top: 1px;
    flex-shrink: 0;
    color: variables.$color-blue !important;
    opacity: 0.7;
  }
}

@media (max-width: 600px) {
  .service-card {
    &__name {
      font-size: 14px;
    }
    &__price {
      font-size: 17px;
    }
  }
}
</style>

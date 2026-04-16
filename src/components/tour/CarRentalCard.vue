<script setup lang="ts">
import type { CarRental } from '@/api/types/tour'

defineProps<{ carRental: CarRental; index: number }>()

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
  <div class="car-rental-card">
    <div class="car-rental-card__header">
      <div class="car-rental-card__index">#{{ index + 1 }}</div>
      <div class="car-rental-card__title">
        <v-icon icon="mdi-car-outline" class="mr-2" color="teal-lighten-1" />
        {{ carRental.name }}
      </div>
    </div>

    <div class="car-rental-card__route">
      <div class="car-rental-card__location">
        <v-icon icon="mdi-map-marker" size="small" color="teal-lighten-1" />
        <span class="car-rental-card__location-label">Начало</span>
        <span class="car-rental-card__location-value">{{ carRental.startLocation }}</span>
      </div>
      <div class="car-rental-card__route-line">
        <div class="line"></div>
        <v-icon icon="mdi-arrow-right" size="small" color="rgba(255,255,255,0.3)" />
      </div>
      <div class="car-rental-card__location">
        <v-icon icon="mdi-map-marker-check" size="small" color="amber" />
        <span class="car-rental-card__location-label">Конец</span>
        <span class="car-rental-card__location-value">{{ carRental.endLocation }}</span>
      </div>
    </div>

    <div class="car-rental-card__vehicles">
      <div v-for="(vehicle, i) in carRental.vehicles" :key="i" class="car-rental-card__vehicle">
        <div class="car-rental-card__vehicle-info">
          <v-icon icon="mdi-car" size="small" class="mr-2" color="rgba(255,255,255,0.5)" />
          <span class="car-rental-card__vehicle-name">{{ vehicle.name }}</span>
          <span class="car-rental-card__vehicle-model">{{ vehicle.vehicle }}</span>
        </div>
        <div class="car-rental-card__vehicle-price">
          {{ formatPrice(vehicle.price, vehicle.currency) }}
        </div>
      </div>
    </div>

    <div v-if="carRental.managerComment" class="car-rental-card__comment">
      <v-icon icon="mdi-comment-text-outline" size="small" class="mr-1" />
      {{ carRental.managerComment }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.car-rental-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  padding: 24px;
  transition:
    border-color 0.25s,
    background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.45);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
  }

  &__route {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 14px;
    background: rgba(0, 10, 10, 0.6);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  &__location {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__location-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 20px;
  }

  &__location-value {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
    margin-left: 20px;
  }

  &__route-line {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;

    .line {
      width: 24px;
      height: 1px;
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &__vehicles {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__vehicle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(0, 10, 10, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(54, 170, 184, 0.1);
  }

  &__vehicle-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__vehicle-name {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
  }

  &__vehicle-model {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-left: 8px;
  }

  &__vehicle-price {
    font-size: 16px;
    font-weight: 700;
    color: variables.$color-yellow;
  }

  &__comment {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: flex-start;
  }
}
</style>

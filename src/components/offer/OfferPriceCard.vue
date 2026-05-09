<script setup lang="ts">
import { computed } from 'vue'
import type { Offer } from '@/api/types/offer'

const props = defineProps<{
  offer: Offer
}>()

const currencySymbol: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', TRY: '₺' }

function fmt(price: number, currency = 'RUB'): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

const carRentalMin = computed(() =>
  props.offer.carRentals.reduce((sum, cr) => {
    if (!cr.vehicles.length) return sum
    return sum + Math.min(...cr.vehicles.map((v) => v.price))
  }, 0),
)

const cruiseTotal = computed(() =>
  props.offer.cruises.reduce((sum, cr) => sum + cr.cabin.price, 0),
)

const excursionTotal = computed(() =>
  props.offer.excursions.reduce((sum, ex) => sum + ex.price, 0),
)

const transportTotal = computed(() =>
  props.offer.transport.reduce((sum, t) => sum + t.price, 0),
)

const additionalServicesTotal = computed(() =>
  props.offer.additionalServices.reduce((sum, s) => sum + s.price, 0),
)

const hotelTotal = computed(() => {
  return props.offer.hotels.reduce((sum, ex) => sum + ex.price, 0)
})

const flightTotal = computed(() => {
  return props.offer.flights.reduce((sum, ex) => sum + ex.price, 0)
})

const grandTotal = computed(
  () =>
    hotelTotal.value +
    flightTotal.value +
    carRentalMin.value +
    cruiseTotal.value +
    excursionTotal.value +
    transportTotal.value +
    additionalServicesTotal.value,
)
</script>

<template>
  <section class="price-card">
    <div class="price-card__title">Итоговая стоимость</div>
    <div class="price-card__rows">
      <div v-if="flightTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-airplane" size="16" class="mr-2" />Перелёты ({{ props.offer.flights.length }} рейсов)</span>
        <span>{{ fmt(flightTotal) }}</span>
      </div>
      <div v-if="hotelTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-bed-outline" size="16" class="mr-2" />Отели и жильё ({{ props.offer.hotels.length }} объектов)</span>
        <span>{{ fmt(hotelTotal) }}</span>
      </div>
      <div v-if="carRentalMin > 0" class="price-card__row">
        <span><v-icon icon="mdi-car-outline" size="16" class="mr-2" />Аренда авто (от)</span>
        <span>{{ fmt(carRentalMin) }}</span>
      </div>
      <div v-if="cruiseTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-ferry" size="16" class="mr-2" />Круиз</span>
        <span>{{ fmt(cruiseTotal) }}</span>
      </div>
      <div v-if="excursionTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-binoculars" size="16" class="mr-2" />Экскурсии ({{ props.offer.excursions.length }})</span>
        <span>{{ fmt(excursionTotal) }}</span>
      </div>
      <div v-if="transportTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-bus-clock" size="16" class="mr-2" />Транспорт ({{ props.offer.transport.length }} поездки)</span>
        <span>{{ fmt(transportTotal) }}</span>
      </div>
      <div v-if="additionalServicesTotal > 0" class="price-card__row">
        <span><v-icon icon="mdi-plus-box-multiple" size="16" class="mr-2" />Доп. услуги ({{ props.offer.additionalServices.length }})</span>
        <span>{{ fmt(additionalServicesTotal) }}</span>
      </div>
    </div>
    <div class="price-card__total">
      <span>Итого (от)</span>
      <span>{{ fmt(grandTotal) }}</span>
    </div>
    <div class="price-card__note">
      * Курс USD актуален на день получения предложения · 1 USD ≈ 85,74 ₽
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.price-card {
  background: rgba(0, 15, 14, 0.8);
  border: 1px solid rgba(54, 170, 184, 0.3);
  border-radius: 20px;
  padding: 28px 32px;

  &__title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 20px;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      border-bottom: none;
    }

    span:first-child {
      display: flex;
      align-items: center;
    }
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba(54, 170, 184, 0.25);
    margin-bottom: 12px;

    span:first-child {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    span:last-child {
      font-size: 30px;
      font-weight: 800;
      color: variables.$color-yellow;
      letter-spacing: -1px;
    }
  }

  &__note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.25);
  }
}
</style>

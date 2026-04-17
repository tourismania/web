<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTourStore } from '@/stores/tour'

import TourHeader from '@/components/tour/TourHeader.vue'
import TourSectionHeader from '@/components/tour/TourSectionHeader.vue'
import TourPriceCard from '@/components/tour/TourPriceCard.vue'
import FlightCard from '@/components/tour/FlightCard.vue'
import HotelCard from '@/components/tour/HotelCard.vue'
import CarRentalCard from '@/components/tour/CarRentalCard.vue'
import CruiseCard from '@/components/tour/CruiseCard.vue'
import ExcursionCard from '@/components/tour/ExcursionCard.vue'
import TransportCard from '@/components/tour/TransportCard.vue'
import AdditionalServiceCard from '@/components/tour/AdditionalServiceCard.vue'

const route = useRoute()
const router = useRouter()
const tourStore = useTourStore()

function navigateToEdit() {
  router.push({ name: 'tourEdit', params: { id: route.params.id } })
}

onMounted(() => {
  const id = route.params.id as string
  tourStore.loadTourById(id)
})

const tour = computed(() => tourStore.currentTour)

const currencySymbol: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', TRY: '₺' }

function fmt(price: number, currency = 'RUB'): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

const carRentalMin = computed(() => {
  if (!tour.value) return 0
  return tour.value.carRentals.reduce((sum, cr) => {
    if (!cr.vehicles.length) return sum
    return sum + Math.min(...cr.vehicles.map((v) => v.price))
  }, 0)
})

const cruiseTotal = computed(() => {
  if (!tour.value) return 0
  return tour.value.cruises.reduce((sum, cr) => sum + cr.cabins.reduce((s, c) => s + c.price, 0), 0)
})

const excursionTotal = computed(() => {
  if (!tour.value) return 0
  return tour.value.excursions.reduce((sum, ex) => sum + ex.price, 0)
})

const transportTotal = computed(() => {
  if (!tour.value) return 0
  return tour.value.transport.reduce((sum, t) => sum + t.price, 0)
})

const additionalServicesTotal = computed(() => {
  if (!tour.value) return 0
  return tour.value.additionalServices.reduce((sum, s) => sum + s.price, 0)
})
</script>

<template>
  <div class="voucher">
    <div v-if="tourStore.loading" class="voucher__loading">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else-if="tourStore.error || !tour" class="voucher__error">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-3" />
      <div>{{ tourStore.error ?? 'Тур не найден' }}</div>
    </div>

    <template v-else>
      <TourHeader :tour="tour" />

      <div class="voucher__toolbar">
        <v-btn
          prepend-icon="mdi-pencil-outline"
          variant="tonal"
          color="primary"
          size="small"
          @click="navigateToEdit"
        >
          Редактировать тур
        </v-btn>
      </div>

      <div class="voucher__body">
        <!-- Перелёты -->
        <section v-if="tour.flights.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-airplane"
            title="Перелёты"
            :count="`${tour.flights.length} рейсов в маршруте`"
            :total="fmt(tour.totalFlightsCost)"
          />
          <div class="voucher__cards">
            <FlightCard v-for="(flight, i) in tour.flights" :key="i" :flight="flight" :index="i" />
          </div>
        </section>

        <!-- Отели -->
        <section v-if="tour.hotels.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-bed-outline"
            title="Отели и жильё"
            :count="`${tour.hotels.length} объекта размещения`"
            :total="fmt(tour.totalHotelsCost)"
          />
          <div class="voucher__cards voucher__cards--grid">
            <HotelCard v-for="(hotel, i) in tour.hotels" :key="i" :hotel="hotel" :index="i" />
          </div>
        </section>

        <!-- Аренда авто -->
        <section v-if="tour.carRentals.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-car-outline"
            title="Аренда автомобилей"
            :total="`от ${fmt(carRentalMin)}`"
          />
          <div class="voucher__cards">
            <CarRentalCard
              v-for="(car, i) in tour.carRentals"
              :key="i"
              :car-rental="car"
              :index="i"
            />
          </div>
        </section>

        <!-- Круизы -->
        <section v-if="tour.cruises.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-ferry"
            title="Круиз"
            :total="fmt(cruiseTotal)"
          />
          <div class="voucher__cards voucher__cards--grid">
            <CruiseCard v-for="(cruise, i) in tour.cruises" :key="i" :cruise="cruise" :index="i" />
          </div>
        </section>

        <!-- Экскурсии -->
        <section v-if="tour.excursions.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-binoculars"
            title="Экскурсии"
            :count="`${tour.excursions.length} экскурсии в маршруте`"
            :total="fmt(excursionTotal)"
          />
          <div class="voucher__cards voucher__cards--grid">
            <ExcursionCard
              v-for="(excursion, i) in tour.excursions"
              :key="i"
              :excursion="excursion"
              :index="i"
            />
          </div>
        </section>

        <!-- Транспорт -->
        <section v-if="tour.transport.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-bus-clock"
            title="Транспорт"
            :count="`${tour.transport.length} поездки в маршруте`"
            :total="fmt(transportTotal)"
          />
          <div class="voucher__cards">
            <TransportCard
              v-for="(item, i) in tour.transport"
              :key="i"
              :transport="item"
              :index="i"
            />
          </div>
        </section>

        <!-- Дополнительные услуги -->
        <section v-if="tour.additionalServices.length > 0" class="voucher__section">
          <TourSectionHeader
            icon="mdi-plus-box-multiple"
            title="Дополнительные услуги"
            :count="`${tour.additionalServices.length} услуги в маршруте`"
            :total="fmt(additionalServicesTotal)"
          />
          <div class="voucher__cards">
            <AdditionalServiceCard
              v-for="(service, i) in tour.additionalServices"
              :key="i"
              :service="service"
              :index="i"
            />
          </div>
        </section>

        <!-- Итог -->
        <TourPriceCard :tour="tour" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.voucher {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.voucher__loading,
.voucher__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
}

.voucher__toolbar {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px 24px 0;
  display: flex;
  justify-content: flex-end;
}

.voucher__body {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.voucher__section {
  display: flex;
  flex-direction: column;
}

.voucher__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &--grid {
    @media (min-width: 660px) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
    }
  }
}
</style>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOfferStore } from '@/stores/offer'

import OfferHeader from '@/components/offer/OfferHeader.vue'
import OfferSectionHeader from '@/components/offer/OfferSectionHeader.vue'
import OfferPriceCard from '@/components/offer/OfferPriceCard.vue'
import FlightCard from '@/components/offer/FlightCard.vue'
import HotelCard from '@/components/offer/HotelCard.vue'
import CarRentalCard from '@/components/offer/CarRentalCard.vue'
import CruiseCard from '@/components/offer/CruiseCard.vue'
import ExcursionCard from '@/components/offer/ExcursionCard.vue'
import TransportCard from '@/components/offer/TransportCard.vue'
import AdditionalServiceCard from '@/components/offer/AdditionalServiceCard.vue'

const route = useRoute()
const router = useRouter()
const offerStore = useOfferStore()

function navigateToEdit() {
  router.push({ name: 'offerEdit', params: { id: route.params.id } })
}

function deleteOffer() {
  const id = route.params.id as string || ''
  if (id === '') return
  offerStore.deleteOffer(id)
  router.push({name: 'offers'})
}

onMounted(() => {
  const id = route.params.id as string
  offerStore.loadOfferById(id)
})

const offer = computed(() => offerStore.currentOffer)

const currencySymbol: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', TRY: '₺' }

function fmt(price: number, currency = 'RUB'): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

const carRentalMin = computed(() => {
  if (!offer.value) return 0
  return offer.value.carRentals.reduce((sum, cr) => {
    if (!cr.vehicles.length) return sum
    return sum + Math.min(...cr.vehicles.map((v) => v.price))
  }, 0)
})

const cruiseTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.cruises.reduce((sum, cr) => sum + cr.cabins.reduce((s, c) => s + c.price, 0), 0)
})

const hotelTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.hotels.reduce((sum, ex) => sum + ex.price, 0)
})

const flightTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.flights.reduce((sum, ex) => sum + ex.price, 0)
})

const excursionTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.excursions.reduce((sum, ex) => sum + ex.price, 0)
})

const transportTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.transport.reduce((sum, t) => sum + t.price, 0)
})

const additionalServicesTotal = computed(() => {
  if (!offer.value) return 0
  return offer.value.additionalServices.reduce((sum, s) => sum + s.price, 0)
})
</script>

<template>
  <div class="tour">
    <div v-if="offerStore.loading" class="offer__loading">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else-if="offerStore.error || !offer" class="offer__error">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-3" />
      <div>{{ offerStore.error ?? 'Предложение не найдено' }}</div>
    </div>

    <template v-else>

      <div class="offer__toolbar">
        <v-btn
            prepend-icon="mdi-pencil-outline"
            variant="tonal"
            color="primary"
            size="small"
            @click="navigateToEdit"
        >
          Редактировать
        </v-btn>
        <v-btn
            prepend-icon="mdi-trash-can"
            variant="tonal"
            color="error"
            size="small"
            @click="deleteOffer"
        >
          Удалить
        </v-btn>
      </div>

      <OfferHeader :offer="offer" />

      <div class="offer__body">
        <!-- Перелёты -->
        <section v-if="offer.flights.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-airplane"
            title="Перелёты"
            :count="`${offer.flights.length} рейсов в маршруте`"
            :total="fmt(flightTotal)"
          />
          <div class="offer__cards">
            <FlightCard v-for="(flight, i) in offer.flights" :key="i" :flight="flight" :index="i" />
          </div>
        </section>

        <!-- Отели -->
        <section v-if="offer.hotels.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-bed-outline"
            title="Отели и жильё"
            :count="`${offer.hotels.length} объекта размещения`"
            :total="fmt(hotelTotal)"
          />
          <div class="offer__cards offer__cards--grid">
            <HotelCard v-for="(hotel, i) in offer.hotels" :key="i" :hotel="hotel" :index="i" />
          </div>
        </section>

        <!-- Аренда авто -->
        <section v-if="offer.carRentals.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-car-outline"
            title="Аренда автомобилей"
            :total="`от ${fmt(carRentalMin)}`"
          />
          <div class="offer__cards">
            <CarRentalCard
              v-for="(car, i) in offer.carRentals"
              :key="i"
              :car-rental="car"
              :index="i"
            />
          </div>
        </section>

        <!-- Круизы -->
        <section v-if="offer.cruises.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-ferry"
            title="Круиз"
            :total="fmt(cruiseTotal)"
          />
          <div class="offer__cards offer__cards--grid">
            <CruiseCard v-for="(cruise, i) in offer.cruises" :key="i" :cruise="cruise" :index="i" />
          </div>
        </section>

        <!-- Экскурсии -->
        <section v-if="offer.excursions.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-binoculars"
            title="Экскурсии"
            :count="`${offer.excursions.length} экскурсии в маршруте`"
            :total="fmt(excursionTotal)"
          />
          <div class="offer__cards offer__cards--grid">
            <ExcursionCard
              v-for="(excursion, i) in offer.excursions"
              :key="i"
              :excursion="excursion"
              :index="i"
            />
          </div>
        </section>

        <!-- Транспорт -->
        <section v-if="offer.transport.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-bus-clock"
            title="Транспорт"
            :count="`${offer.transport.length} поездки в маршруте`"
            :total="fmt(transportTotal)"
          />
          <div class="offer__cards">
            <TransportCard
              v-for="(item, i) in offer.transport"
              :key="i"
              :transport="item"
              :index="i"
            />
          </div>
        </section>

        <!-- Дополнительные услуги -->
        <section v-if="offer.additionalServices.length > 0" class="offer__section">
          <OfferSectionHeader
            icon="mdi-plus-box-multiple"
            title="Дополнительные услуги"
            :count="`${offer.additionalServices.length} услуги в маршруте`"
            :total="fmt(additionalServicesTotal)"
          />
          <div class="offer__cards">
            <AdditionalServiceCard
              v-for="(service, i) in offer.additionalServices"
              :key="i"
              :service="service"
              :index="i"
            />
          </div>
        </section>

        <!-- Итог -->
        <OfferPriceCard :offer="offer" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.tour {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  background:
      radial-gradient(ellipse 80% 60% at 20% 40%, rgba(54, 170, 184, 0.1) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 80% 60%, rgba(239, 159, 59, 0.06) 0%, transparent 60%),
      linear-gradient(160deg, #002724 0%, #001d1b 45%, #00201e 100%);
}

.offer__loading,
.offer__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
}

.offer__toolbar {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;

  &  button {
    margin-right: 10px;
  }
}

.offer__body {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.offer__section {
  display: flex;
  flex-direction: column;
}

.offer__cards {
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

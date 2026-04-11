<script setup lang="ts">
import { computed } from 'vue'
import type { FlightSegment } from '@/types/voucher'

const props = defineProps<{
  flight: FlightSegment
}>()

const stopsText = computed(
  () => props.flight.stopsLabel ?? (props.flight.isDirect ? 'Без пересадок' : ''),
)
</script>

<template>
  <article class="flight-card">
    <header class="flight-card__header">
      <div class="flight-card__brand">
        <h3 class="flight-card__route">{{ flight.routeTitle }}</h3>
        <div class="flight-card__airline">
          <span class="flight-card__airline-name">{{ flight.airline.name }}</span>
        </div>
      </div>

      <div class="flight-card__specs">
        <p class="flight-card__flight-no">
          {{ flight.flightNumber }} / {{ flight.aircraftModel }}
        </p>
        <div class="flight-card__badges">
          <span class="flight-card__class">{{ flight.serviceClass }}</span>
          <div class="flight-card__baggage" aria-label="Багаж">
            <v-icon class="flight-card__baggage-icon" size="22" icon="mdi-bag-suitcase" />
            <span class="flight-card__baggage-label">{{ flight.hasBaggage ? 'Да' : 'NO' }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="flight-card__timeline">
      <div class="flight-card__point flight-card__point--dep">
        <p class="flight-card__label">Вылет: {{ flight.departure.date }}</p>
        <p class="flight-card__time">{{ flight.departure.time }}</p>
        <p class="flight-card__city">{{ flight.departure.city }}</p>
        <p class="flight-card__airport">
          {{ flight.departure.airportName }} / {{ flight.departure.airportCode }}
        </p>
      </div>

      <div class="flight-card__leg" role="presentation">
        <span class="flight-card__duration">{{ flight.duration }}</span>
        <div class="flight-card__arrow">
          <span class="flight-card__arrow-line" />
          <v-icon class="flight-card__arrow-head" size="20" icon="mdi-chevron-right" />
        </div>
        <span class="flight-card__stops">{{ stopsText }}</span>
      </div>

      <div class="flight-card__point flight-card__point--arr">
        <p class="flight-card__label">Прилет: {{ flight.arrival.date }}</p>
        <p class="flight-card__time">{{ flight.arrival.time }}</p>
        <p class="flight-card__city">{{ flight.arrival.city }}</p>
        <p class="flight-card__airport">
          {{ flight.arrival.airportName }} / {{ flight.arrival.airportCode }}
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
$teal: #00a896;
$muted: #757575;
$border: #e0e0e0;

.flight-card {
  background: #fff;
  color: #212121;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  text-align: left;
  padding: 20px 24px;
  border-bottom: 1px solid $border;

  &:last-of-type {
    border-bottom: none;
  }
}

.flight-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.flight-card__brand {
  min-width: 200px;
}

.flight-card__route {
  margin: 0 0 10px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.flight-card__airline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flight-card__logo {
  display: block;
  object-fit: contain;
}

.flight-card__airline-name {
  font-size: 0.875rem;
  color: $muted;
}

.flight-card__specs {
  text-align: right;
}

.flight-card__flight-no {
  margin: 0 0 8px;
  font-size: 0.9375rem;
  font-weight: 500;
}

.flight-card__badges {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.flight-card__class {
  font-size: 0.875rem;
  color: $muted;
}

.flight-card__baggage {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $teal;
}

.flight-card__baggage-icon {
  color: $teal !important;
  opacity: 1;
}

.flight-card__baggage-label {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.flight-card__timeline {
  display: grid;
  grid-template-columns: 1fr minmax(140px, 1.2fr) 1fr;
  gap: 12px 16px;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.flight-card__point--arr {
  text-align: right;

  @media (max-width: 720px) {
    text-align: left;
  }
}

.flight-card__label {
  margin: 0 0 6px;
  font-size: 0.8125rem;
  color: $muted;
}

.flight-card__time {
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
}

.flight-card__city {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 700;
}

.flight-card__airport {
  margin: 0;
  font-size: 0.8125rem;
  color: $muted;
  line-height: 1.35;
}

.flight-card__leg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  gap: 6px;

  @media (max-width: 720px) {
    order: -1;
    padding: 12px 0;
  }
}

.flight-card__duration {
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
}

.flight-card__arrow {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 180px;
}

.flight-card__arrow-line {
  flex: 1;
  height: 2px;
  background: $teal;
  border-radius: 1px;
}

.flight-card__arrow-head {
  color: $teal !important;
  margin-left: -6px;
}

.flight-card__stops {
  font-size: 0.8125rem;
  color: $muted;
  text-align: center;
}
</style>

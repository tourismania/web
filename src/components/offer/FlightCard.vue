<script setup lang="ts">
import { computed } from 'vue'
import type { Flight } from '@/api/types/offer'

const props = defineProps<{ flight: Flight; index: number }>()

const classLabel: Record<string, string> = {
  economy: 'Эконом',
  business: 'Бизнес',
  comfort: 'Комфорт',
}

const currencySymbol: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  TRY: '₺',
}

function formatDateTime(iso: string): { date: string; time: string; weekday: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
  const weekday = d.toLocaleDateString('ru-RU', { weekday: 'short' })
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return { date, time, weekday }
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

const departureFmt = computed(() => formatDateTime(props.flight.departure.dateTime))
const arrivalFmt = computed(() => formatDateTime(props.flight.arrival.dateTime))

const hasLayover = computed(
  () => props.flight.departure.hasLayovers || props.flight.arrival.hasLayovers,
)

const duration = computed(() => {
  const ms =
    new Date(props.flight.arrival.dateTime).getTime() -
    new Date(props.flight.departure.dateTime).getTime()
  if (!Number.isFinite(ms) || ms <= 0) return ''
  const totalMinutes = Math.round(ms / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}д ${hours}ч в пути`
  if (hours > 0) {
    return minutes > 0 ? `${hours}ч ${minutes}мин в пути` : `${hours}ч в пути`
  }
  return `${minutes} мин в пути`
})

const flightStatus = computed(() => (hasLayover.value ? '1 пересадка' : 'прямой'))
</script>

<template>
  <div class="flight-card">
    <!-- Top row: price + meta + index -->
    <div class="flight-card__top">
      <div class="flight-card__price-block">
        <div class="flight-card__price">
          {{ formatPrice(flight.departure.price, flight.departure.currency) }}
        </div>
        <div class="flight-card__meta">
          <span class="flight-card__meta-item">
            <v-icon icon="mdi-airplane" size="14" class="mr-1" />
            {{ flight.airline }}
          </span>
          <span class="flight-card__meta-sep">·</span>
          <span class="flight-card__meta-item flight-card__meta-item--accent">
            {{ classLabel[flight.departure.flightClass] ?? flight.departure.flightClass }}
          </span>
          <span class="flight-card__meta-sep">·</span>
          <span class="flight-card__meta-item">Рейс {{ flight.departure.flight }}</span>
        </div>
      </div>
      <div class="flight-card__index">#{{ index + 1 }}</div>
    </div>

    <!-- Route block -->
    <div class="flight-card__route">
      <!-- Departure -->
      <div class="flight-card__endpoint">
        <div class="flight-card__time">{{ departureFmt.time }}</div>
        <div class="flight-card__city">{{ flight.departure.city }}</div>
        <div class="flight-card__date">{{ departureFmt.date }}, {{ departureFmt.weekday }}</div>
      </div>

      <!-- Timeline in the middle -->
      <div class="flight-card__timeline">
        <div class="flight-card__duration">
          {{ duration }}<template v-if="duration">, </template>{{ flightStatus }}
        </div>

        <div class="flight-card__line">
          <v-icon class="flight-card__plane" icon="mdi-airplane-takeoff" size="18" />
          <div class="flight-card__line-track">
            <span v-if="hasLayover" class="flight-card__layover-dot" />
          </div>
          <v-icon class="flight-card__plane" icon="mdi-airplane-landing" size="18" />
        </div>

        <div class="flight-card__codes">
          <span class="flight-card__code">{{ flight.departure.airportCode }}</span>
          <span v-if="hasLayover" class="flight-card__code flight-card__code--layover">
            пересадка
          </span>
          <span class="flight-card__code">{{ flight.arrival.airportCode }}</span>
        </div>
      </div>

      <!-- Arrival -->
      <div class="flight-card__endpoint flight-card__endpoint--right">
        <div class="flight-card__time">{{ arrivalFmt.time }}</div>
        <div class="flight-card__city">{{ flight.arrival.city }}</div>
        <div class="flight-card__date">{{ arrivalFmt.date }}, {{ arrivalFmt.weekday }}</div>
      </div>
    </div>

    <div v-if="flight.managerComment" class="flight-card__comment">
      <v-icon icon="mdi-comment-text-outline" size="small" class="mr-2" />
      <span>{{ flight.managerComment }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.flight-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  padding: 24px 28px;
  transition:
    border-color 0.25s,
    background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.5);
  }

  // ---------- Top (price + meta + index) ----------
  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
  }

  &__price {
    font-size: 30px;
    font-weight: 800;
    color: variables.$color-yellow;
    line-height: 1.05;
    letter-spacing: -0.5px;
  }

  &__meta {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__meta-item {
    display: inline-flex;
    align-items: center;

    &--accent {
      color: variables.$color-blue;
      font-weight: 600;
    }
  }

  &__meta-sep {
    color: rgba(255, 255, 255, 0.2);
  }

  &__index {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 1.2px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 999px;
    flex-shrink: 0;
  }

  // ---------- Route ----------
  &__route {
    display: grid;
    grid-template-columns: minmax(90px, 1fr) minmax(200px, 2.4fr) minmax(90px, 1fr);
    align-items: start;
    gap: 24px;
  }

  &__endpoint {
    &--right {
      text-align: right;
    }
  }

  &__time {
    font-size: 34px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  &__city {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 6px;
  }

  &__date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 2px;
  }

  // ---------- Timeline ----------
  &__timeline {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding-top: 4px;
    min-width: 0;
  }

  &__duration {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
    text-align: center;
    letter-spacing: 0.2px;
  }

  &__line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__plane {
    color: variables.$color-blue;
    flex-shrink: 0;
    opacity: 0.9;
  }

  &__line-track {
    position: relative;
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(54, 170, 184, 0.6) 0%,
      rgba(54, 170, 184, 0.25) 50%,
      rgba(54, 170, 184, 0.6) 100%
    );

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 6px;
      height: 6px;
      background: variables.$color-blue;
      border-radius: 50%;
      transform: translateY(-50%);
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }

  &__layover-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: variables.$color-yellow;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 3px rgba(239, 159, 59, 0.18);
  }

  &__codes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  &__code {
    font-size: 13px;
    font-weight: 700;
    color: variables.$color-blue;
    letter-spacing: 1.2px;

    &--layover {
      color: variables.$color-yellow;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: lowercase;
      font-size: 11px;
    }
  }

  // ---------- Comment ----------
  &__comment {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: flex-start;
    line-height: 1.45;
  }
}

@media (max-width: 720px) {
  .flight-card {
    padding: 18px 20px;

    &__top {
      margin-bottom: 20px;
    }

    &__price {
      font-size: 24px;
    }

    &__route {
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
    }

    &__time {
      font-size: 24px;
    }

    &__city {
      font-size: 13px;
    }

    &__date {
      font-size: 11px;
    }

    &__timeline {
      padding-top: 6px;
      gap: 6px;
    }

    &__duration {
      font-size: 10px;
    }

    &__plane {
      font-size: 14px !important;
    }

    &__code {
      font-size: 11px;
      letter-spacing: 0.8px;
    }

    &__code--layover {
      font-size: 10px;
    }
  }
}
</style>

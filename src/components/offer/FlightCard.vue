<script setup lang="ts">
import type { Flight } from '@/api/types/offer'

defineProps<{ flight: Flight; index: number }>()

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

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}
</script>

<template>
  <div class="flight-card">
    <div class="flight-card__header">
      <div class="flight-card__index">#{{ index + 1 }}</div>
      <div class="flight-card__airline">
        <v-icon icon="mdi-airplane" class="mr-2" />
        {{ flight.airline }}
      </div>
      <div class="flight-card__price">
        {{ formatPrice(flight.departure.price, flight.departure.currency) }}
      </div>
    </div>

    <div class="flight-card__route">
      <!-- Departure -->
      <div class="flight-card__endpoint">
        <div class="flight-card__code">{{ flight.departure.airportCode }}</div>
        <div class="flight-card__city">{{ flight.departure.city }}</div>
        <div class="flight-card__airport">{{ flight.departure.airport }}</div>
        <div class="flight-card__time">{{ formatDateTime(flight.departure.dateTime).time }}</div>
        <div class="flight-card__date">{{ formatDateTime(flight.departure.dateTime).date }}</div>
        <div class="flight-card__flight-num">{{ flight.departure.flight }}</div>
        <div class="flight-card__badges">
          <v-chip size="x-small" color="teal-lighten-1" variant="tonal">
            {{ classLabel[flight.departure.flightClass] ?? flight.departure.flightClass }}
          </v-chip>
          <v-chip
            v-if="flight.departure.hasLayovers"
            size="x-small"
            color="amber"
            variant="tonal"
            class="ml-1"
          >
            Пересадка
          </v-chip>
        </div>
      </div>

      <!-- Arrow -->
      <div class="flight-card__arrow">
        <div class="flight-card__arrow-line"></div>
        <v-icon icon="mdi-airplane" class="flight-card__arrow-icon" />
      </div>

      <!-- Arrival -->
      <div class="flight-card__endpoint flight-card__endpoint--right">
        <div class="flight-card__code">{{ flight.arrival.airportCode }}</div>
        <div class="flight-card__city">{{ flight.arrival.city }}</div>
        <div class="flight-card__airport">{{ flight.arrival.airport }}</div>
        <div class="flight-card__time">{{ formatDateTime(flight.arrival.dateTime).time }}</div>
        <div class="flight-card__date">{{ formatDateTime(flight.arrival.dateTime).date }}</div>
        <div class="flight-card__flight-num">{{ flight.arrival.flight }}</div>
        <div class="flight-card__badges">
          <v-chip size="x-small" color="teal-lighten-1" variant="tonal">
            {{ classLabel[flight.arrival.flightClass] ?? flight.arrival.flightClass }}
          </v-chip>
          <v-chip
            v-if="flight.arrival.hasLayovers"
            size="x-small"
            color="amber"
            variant="tonal"
            class="ml-1"
          >
            Пересадка
          </v-chip>
        </div>
      </div>
    </div>

    <div v-if="flight.managerComment" class="flight-card__comment">
      <v-icon icon="mdi-comment-text-outline" size="small" class="mr-1" />
      {{ flight.managerComment }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.flight-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  padding: 24px;
  transition:
    border-color 0.25s,
    background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.5);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__index {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__airline {
    font-size: 16px;
    font-weight: 600;
    color: variables.$color-blue;
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__price {
    font-size: 18px;
    font-weight: 700;
    color: variables.$color-yellow;
  }

  &__route {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__endpoint {
    flex: 1;

    &--right {
      text-align: right;
    }
  }

  &__code {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
  }

  &__city {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 4px;
  }

  &__airport {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 2px;
  }

  &__time {
    font-size: 28px;
    font-weight: 700;
    color: variables.$color-blue;
    margin-top: 12px;
    line-height: 1;
  }

  &__date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4px;
  }

  &__flight-num {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    font-family: monospace;
    margin-top: 6px;
  }

  &__badges {
    margin-top: 8px;
    display: flex;
    align-items: center;

    .flight-card__endpoint--right & {
      justify-content: flex-end;
    }
  }

  &__arrow {
    flex: 0 0 auto;
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
  }

  &__arrow-line {
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(54, 170, 184, 0.2),
      variables.$color-blue,
      rgba(54, 170, 184, 0.2)
    );
  }

  &__arrow-icon {
    color: variables.$color-blue;
    font-size: 20px;
  }

  &__comment {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    display: flex;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .flight-card {
    &__code {
      font-size: 24px;
    }
    &__time {
      font-size: 20px;
    }
    &__arrow {
      width: 40px;
    }
  }
}
</style>

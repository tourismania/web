<script setup lang="ts">
import type { PublicTransport, TransportCategory } from '@/api/types/offer'

defineProps<{ transport: PublicTransport; index: number }>()

const currencySymbol: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  TRY: '₺',
}

const categoryConfig: Record<
  TransportCategory,
  { label: string; icon: string; color: string; chipColor: string }
> = {
  taxi: {
    label: 'Такси',
    icon: 'mdi-taxi',
    color: '#f59e0b',
    chipColor: 'amber',
  },
  bus: {
    label: 'Автобус',
    icon: 'mdi-bus',
    color: '#10b981',
    chipColor: 'green',
  },
  transfer: {
    label: 'Трансфер',
    icon: 'mdi-van-passenger',
    color: '#36aab8',
    chipColor: 'teal-lighten-1',
  },
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}
</script>

<template>
  <div class="transport-card">
    <!-- Header row -->
    <div class="transport-card__header">
      <div class="transport-card__index">#{{ index + 1 }}</div>

      <!-- Category chip -->
      <v-chip
        :color="categoryConfig[transport.category].chipColor"
        variant="tonal"
        size="small"
        :prepend-icon="categoryConfig[transport.category].icon"
        class="transport-card__category-chip"
      >
        {{ categoryConfig[transport.category].label }}
      </v-chip>

      <!-- Datetime -->
      <div class="transport-card__datetime">
        <v-icon icon="mdi-clock-outline" size="14" class="mr-1" />
        <span class="transport-card__time">{{ formatDateTime(transport.datetime).time }}</span>
        <span class="transport-card__date"
          >&nbsp;·&nbsp;{{ formatDateTime(transport.datetime).date }}</span
        >
      </div>

      <!-- Price -->
      <div class="transport-card__price">
        {{ formatPrice(transport.price, transport.currency) }}
      </div>
    </div>

    <!-- Route row -->
    <div class="transport-card__route">
      <!-- Pickup -->
      <div class="transport-card__location">
        <div class="transport-card__location-pin">
          <v-icon icon="mdi-map-marker" size="16" />
        </div>
        <div class="transport-card__location-text">
          <div class="transport-card__location-label">Посадка</div>
          <div class="transport-card__location-name">{{ transport.pickupLocation }}</div>
        </div>
      </div>

      <!-- Connector line -->
      <div class="transport-card__connector">
        <div class="transport-card__connector__body">
          <div class="transport-card__connector__body-line"></div>
          <v-icon
              :icon="categoryConfig[transport.category].icon"
              class="transport-card__connector__body-icon"
              :style="{ color: categoryConfig[transport.category].color }"
              size="20"
          />
          <div class="transport-card__connector__body-line"></div>
        </div>
        <div class="transport-card__connector__description">
          <div class="transport-card__connector__description__duration">
            {{ formatDuration(transport.duration) }}
          </div>
        </div>
      </div>

      <!-- Dropoff -->
      <div class="transport-card__location transport-card__location--right">
        <div class="transport-card__location-text transport-card__location-text--right">
          <div class="transport-card__location-label">Высадка</div>
          <div class="transport-card__location-name">{{ transport.dropoffLocation }}</div>
        </div>
        <div class="transport-card__location-pin transport-card__location-pin--end">
          <v-icon icon="mdi-map-marker-check" size="16" />
        </div>
      </div>
    </div>

    <!-- Manager comment -->
    <div v-if="transport.managerComment" class="transport-card__comment">
      <v-icon icon="mdi-comment-text-outline" size="small" class="mr-1" />
      {{ transport.managerComment }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.transport-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  padding: 20px 24px;
  transition:
    border-color 0.25s,
    background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.5);
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
    flex-shrink: 0;
  }

  &__category-chip {
    flex-shrink: 0;
  }

  &__datetime {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    flex: 1;
    min-width: 0;
  }

  &__time {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);
    white-space: nowrap;
  }

  &__date {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__price {
    font-size: 20px;
    font-weight: 700;
    color: variables.$color-yellow;
    flex-shrink: 0;
  }

  // ── Route ───────────────────────────────────────────────────────────────────

  &__route {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;

    &--right {
      justify-content: flex-end;
    }
  }

  &__location-pin {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-blue;
    flex-shrink: 0;

    &--end {
      background: rgba(239, 159, 59, 0.1);
      border-color: rgba(239, 159, 59, 0.3);
      color: variables.$color-yellow;
    }
  }

  &__location-text {
    min-width: 0;

    &--right {
      text-align: right;
    }
  }

  &__location-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 2px;
  }

  &__location-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // ── Connector ───────────────────────────────────────────────────────────────

  &__connector {

    &__body {
      flex: 0 0 auto;
      width: 160px;
      display: flex;
      align-items: center;
      gap: 4px;

      &-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, rgba(54, 170, 184, 0.15), rgba(54, 170, 184, 0.4));
      }

      &-icon {
        flex-shrink: 0;
      }
    }

    &__description {

      display: flex;
      align-items: center;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      justify-content: center;

      &__duration {

        .v-icon {
          color: variables.$color-blue;
          opacity: 0.8;
        }
      }

    }
  }

  // ── Footer ──────────────────────────────────────────────────────────────────

  &__footer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  // ── Comment ─────────────────────────────────────────────────────────────────

  &__comment {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    display: flex;
    align-items: flex-start;
    line-height: 1.6;

    .v-icon {
      color: variables.$color-blue;
      opacity: 0.7;
      flex-shrink: 0;
      margin-top: 1px;
    }
  }
}

@media (max-width: 600px) {
  .transport-card {
    &__connector {
      width: 48px;
    }
    &__price {
      font-size: 17px;
    }
    &__location-name {
      font-size: 13px;
    }
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Tour } from '@/api/types/tour'

const router = useRouter()

const tours: Tour[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    createdAt: '2025-01-15T10:30:00Z',
    title: 'Путешествие по США',
    startDate: '2025-09-26',
    endDate: '2025-10-28',
    welcomeText: '',
    flights: [],
    totalFlightsCost: 0,
    flightsCurrency: 'RUB',
    hotels: [],
    totalHotelsCost: 0,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    createdAt: '2025-02-03T08:00:00Z',
    title: 'Тур по Японии — Токио и Киото',
    startDate: '2025-11-05',
    endDate: '2025-11-22',
    welcomeText: '',
    flights: [],
    totalFlightsCost: 0,
    flightsCurrency: 'RUB',
    hotels: [],
    totalHotelsCost: 0,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-012345678902',
    createdAt: '2025-02-28T14:45:00Z',
    title: 'Круиз по Средиземноморью',
    startDate: '2025-07-10',
    endDate: '2025-07-24',
    welcomeText: '',
    flights: [],
    totalFlightsCost: 0,
    flightsCurrency: 'RUB',
    hotels: [],
    totalHotelsCost: 0,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-123456789003',
    createdAt: '2025-03-12T09:15:00Z',
    title: 'Дубай — золотой город',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    welcomeText: '',
    flights: [],
    totalFlightsCost: 0,
    flightsCurrency: 'RUB',
    hotels: [],
    totalHotelsCost: 0,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-234567890004',
    createdAt: '2025-04-01T11:00:00Z',
    title: 'Сафари в Кении',
    startDate: '2026-02-15',
    endDate: '2026-02-28',
    welcomeText: '',
    flights: [],
    totalFlightsCost: 0,
    flightsCurrency: 'RUB',
    hotels: [],
    totalHotelsCost: 0,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  },
]

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function navigateToTour(id: string | undefined) {
  if (id) {
    router.push({ name: 'tour', params: { id } })
  }
}
</script>

<template>
  <div class="tours-list">
    <div class="tours-list__container">
      <div class="tours-list__header">
        <div class="tours-list__header-icon">
          <v-icon icon="mdi-earth" size="28" />
        </div>
        <div>
          <h1 class="tours-list__title">Туры</h1>
          <p class="tours-list__subtitle">{{ tours.length }} туров в системе</p>
        </div>
      </div>

      <div class="tours-list__table-wrap">
        <v-table class="tours-list__table" density="comfortable">
          <thead>
            <tr>
              <th class="tours-list__th">Название</th>
              <th class="tours-list__th">Идентификатор</th>
              <th class="tours-list__th">Дата создания</th>
            </tr>
          </thead>
          <tbody v-if="tours.length > 0">
            <tr
              v-for="tour in tours"
              :key="tour.id"
              class="tours-list__row"
            >
              <td class="tours-list__td tours-list__td--name">{{ tour.title }}</td>
              <td class="tours-list__td">
                <span
                  class="tours-list__id-chip"
                  role="button"
                  tabindex="0"
                  @click="navigateToTour(tour.id)"
                  @keyup.enter="navigateToTour(tour.id)"
                >{{ tour.id }}</span>
              </td>
              <td class="tours-list__td tours-list__td--date">
                {{ tour.createdAt ? fmtDate(tour.createdAt) : '—' }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="tours-list__empty">
                <v-icon icon="mdi-compass-off-outline" size="40" class="mb-3" />
                <div>Туры не найдены</div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.tours-list {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  padding: 48px 24px 80px;

  &__container {
    max-width: 980px;
    margin: 0 auto;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(54, 170, 184, 0.15);
  }

  &__header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-blue;
    flex-shrink: 0;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  &__subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.35);
    margin: 4px 0 0;
  }

  &__table-wrap {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(54, 170, 184, 0.18);
    background: rgba(0, 15, 14, 0.6);
    backdrop-filter: blur(8px);
  }

  &__table {
    background: transparent !important;

    :deep(table) {
      border-collapse: collapse;
    }

    :deep(.v-table__wrapper) {
      background: transparent;
    }
  }

  &__th {
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    color: rgba(255, 255, 255, 0.3) !important;
    background: rgba(0, 0, 0, 0.25) !important;
    padding: 14px 20px !important;
    border-bottom: 1px solid rgba(54, 170, 184, 0.15) !important;
    white-space: nowrap;
  }

  &__row {
    transition: background-color 150ms ease, border-left-color 150ms ease;
    border-left: 3px solid transparent;
    cursor: default;

    &:hover {
      background: rgba(54, 170, 184, 0.06) !important;
      border-left-color: variables.$color-blue;
    }

    &:not(:last-child) td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
    }
  }

  &__td {
    padding: 16px 20px !important;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.75);
    vertical-align: middle;
    border-bottom: none !important;

    &--name {
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    &--date {
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.45);
      font-size: 13px;
    }
  }

  &__id-chip {
    display: inline-block;
    font-family: monospace;
    font-size: 12px;
    color: variables.$color-blue;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.25);
    border-radius: 6px;
    padding: 3px 10px;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
    outline: none;
    user-select: none;

    &:hover {
      background: rgba(54, 170, 184, 0.2);
      border-color: rgba(54, 170, 184, 0.5);
    }

    &:focus-visible {
      outline: 2px solid variables.$color-blue;
      outline-offset: 2px;
    }
  }

  &__empty {
    text-align: center !important;
    padding: 60px 20px !important;
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>

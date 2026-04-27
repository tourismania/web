<script setup lang="ts">
import { computed } from 'vue'
import type { Flight, FlightSegment } from '@/api/types/offer'

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

/**
 * Converts a naive local ISO datetime string (e.g. "2026-05-14T10:00:00",
 * without any TZ suffix) interpreted as wall-clock time in `timeZone` into
 * absolute UTC milliseconds. Uses Intl to resolve the zone's offset at that
 * instant, so it handles DST correctly.
 */
function zonedToUtcMs(localIso: string, timeZone: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(localIso)
  if (!match) {
    // Fall back to native parser when the string isn't the expected shape
    return new Date(localIso).getTime()
  }
  const [, y, mo, d, h, mi, s] = match
  // First, pretend the wall-clock components are UTC.
  const asIfUtc = Date.UTC(+y, +mo - 1, +d, +h, +mi, s ? +s : 0)
  // Now ask what those UTC ms look like rendered in `timeZone`.
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts: Record<string, string> = {}
  for (const p of dtf.formatToParts(new Date(asIfUtc))) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }
  const shownInTz = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second,
  )
  // Offset of the target zone from UTC at this moment (ms).
  const offset = shownInTz - asIfUtc
  // The true UTC ms for the local wall-clock time in that zone.
  return asIfUtc - offset
}

function formatDurationMs(ms: number): string {
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
}

/** Время ожидания между двумя соседними сегментами (в .layover-tooltip-row). */
function layoverWait(prev: FlightSegment, next: FlightSegment): string {
  const arrMs = zonedToUtcMs(prev.arrivalDateTime, prev.to.timezone)
  const depMs = zonedToUtcMs(next.departureDateTime, next.from.timezone)
  const waitMs = depMs - arrMs
  if (!Number.isFinite(waitMs) || waitMs <= 0) return ''
  const totalMinutes = Math.round(waitMs / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}д ${hours}ч`
  if (hours > 0) {
    return minutes > 0 ? `${hours}ч ${minutes}мин` : `${hours}ч`
  }
  return `${minutes} мин`
}

const firstSegment = computed<FlightSegment>(() => props.flight.segments[0])
const lastSegment = computed<FlightSegment>(
  () => props.flight.segments[props.flight.segments.length - 1],
)

const departureFmt = computed(() => formatDateTime(firstSegment.value.departureDateTime))
const arrivalFmt = computed(() => formatDateTime(lastSegment.value.arrivalDateTime))

const duration = computed(() => {
  const segments = props.flight.segments
  let totalMs = 0
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const depMs = zonedToUtcMs(seg.departureDateTime, seg.from.timezone)
    const arrMs = zonedToUtcMs(seg.arrivalDateTime, seg.to.timezone)
    if (Number.isFinite(arrMs - depMs) && arrMs > depMs) {
      totalMs += arrMs - depMs
    }
    if (i < segments.length - 1) {
      const next = segments[i + 1]
      const nextDepMs = zonedToUtcMs(next.departureDateTime, next.from.timezone)
      const waitMs = nextDepMs - arrMs
      if (Number.isFinite(waitMs) && waitMs > 0) {
        totalMs += waitMs
      }
    }
  }
  return formatDurationMs(totalMs)
})

const flightStatus = computed(() => {
  const n = props.flight.segments.length - 1
  if (n <= 0) return 'прямой'
  if (n === 1) return '1 пересадка'
  // 2..4 — пересадки, 5+ — пересадок (упрощённое русское склонение)
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} пересадки`
  }
  return `${n} пересадок`
})

/** Индексы стыков между сегментами: для перелёта из K сегментов это [0, K-2]. */
const layoverIndices = computed<number[]>(() => {
  const len = props.flight.segments.length
  const out: number[] = []
  for (let i = 0; i <= len - 2; i++) out.push(i)
  return out
})

const codes = computed<string[]>(() => {
  const segments = props.flight.segments
  const out: string[] = [segments[0].from.code]
  for (let i = 0; i <= segments.length - 2; i++) {
    out.push(segments[i].to.code)
  }
  out.push(segments[segments.length - 1].to.code)
  return out
})

function layoverPositionPercent(i: number): number {
  // Равномерно распределяем точки пересадок по линии; для одной пересадки — 50%.
  const total = layoverIndices.value.length
  if (total <= 0) return 50
  return ((i + 1) / (total + 1)) * 100
}
</script>

<template>
  <div class="flight-card">
    <!-- Top row: price + meta + index -->
    <div class="flight-card__top">
      <div class="flight-card__price-block">
        <div class="flight-card__price">
          {{ formatPrice(flight.price, flight.currency) }}
        </div>
        <div
          v-for="(segment, si) in flight.segments"
          :key="si"
          class="flight-card__meta"
        >
          <span v-if="segment.airline" class="flight-card__meta-item">
            <v-icon icon="mdi-airplane" size="14" class="mr-1" />
            {{ segment.airline }}
          </span>
          <span v-if="segment.airline" class="flight-card__meta-sep">·</span>
          <span class="flight-card__meta-item flight-card__meta-item--accent">
            {{ classLabel[segment.flightClass] ?? segment.flightClass }}
          </span>
          <template v-if="segment.flightNumber">
            <span class="flight-card__meta-sep">·</span>
            <span class="flight-card__meta-item">Рейс {{ segment.flightNumber }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Route block -->
    <div class="flight-card__route">
      <!-- Departure -->
      <div class="flight-card__endpoint">
        <div class="flight-card__time">{{ departureFmt.time }}</div>
        <div class="flight-card__city">{{ firstSegment.from.city }}</div>
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
            <v-tooltip
              v-for="i in layoverIndices"
              :key="i"
              location="top"
              interactive
            >
              <template #activator="{ props: tooltipProps }">
                <span
                  v-bind="tooltipProps"
                  class="flight-card__layover-dot"
                  :style="{ left: `${layoverPositionPercent(i)}%` }"
                />
              </template>
              <div class="layover-tooltip-content">
                <div class="layover-tooltip-row">
                  <span class="layover-tooltip-label">Аэропорт:</span>
                  {{ flight.segments[i].to.city }} ({{ flight.segments[i].to.code }}),
                  {{ flight.segments[i].to.name }}
                </div>
                <div class="layover-tooltip-row">
                  <span class="layover-tooltip-label">Прилёт:</span>
                  {{ formatDateTime(flight.segments[i].arrivalDateTime).time }},
                  {{ formatDateTime(flight.segments[i].arrivalDateTime).date }}
                </div>
                <div
                  v-if="layoverWait(flight.segments[i], flight.segments[i + 1])"
                  class="layover-tooltip-row layover-tooltip-row--wait"
                >
                  <span class="layover-tooltip-label">Ожидание:</span>
                  {{ layoverWait(flight.segments[i], flight.segments[i + 1]) }}
                </div>
                <div class="layover-tooltip-row">
                  <span class="layover-tooltip-label">Вылет:</span>
                  {{ formatDateTime(flight.segments[i + 1].departureDateTime).time }},
                  {{ formatDateTime(flight.segments[i + 1].departureDateTime).date }}
                </div>
                <div class="layover-tooltip-row">
                  <span class="layover-tooltip-label">Рейс:</span>
                  {{ flight.segments[i + 1].flightNumber }}
                </div>
              </div>
            </v-tooltip>
          </div>
          <v-icon class="flight-card__plane" icon="mdi-airplane-landing" size="18" />
        </div>

        <div class="flight-card__codes">
          <span
            v-for="(code, ci) in codes"
            :key="ci"
            class="flight-card__code"
            :class="{ 'flight-card__code--layover': ci > 0 && ci < codes.length - 1 }"
          >
            {{ code }}
          </span>
        </div>
      </div>

      <!-- Arrival -->
      <div class="flight-card__endpoint flight-card__endpoint--right">
        <div class="flight-card__time">{{ arrivalFmt.time }}</div>
        <div class="flight-card__city">{{ lastSegment.to.city }}</div>
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

    & + & {
      margin-top: 4px;
    }
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
    width: 8px;
    height: 8px;
    background: variables.$color-yellow;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 3px rgba(239, 159, 59, 0.18);
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    z-index: 2;

    &:hover {
      transform: translate(-50%, -50%) scale(1.25);
      box-shadow: 0 0 0 5px rgba(239, 159, 59, 0.28);
    }
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

// ---------- Layover tooltip ----------
.layover-tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  line-height: 1.4;
  min-width: 200px;
}

.layover-tooltip-row {
  display: flex;
  gap: 6px;

  &--wait {
    color: variables.$color-yellow;
    font-weight: 600;
  }
}

.layover-tooltip-label {
  flex-shrink: 0;
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

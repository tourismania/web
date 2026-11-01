import type { Airport } from '@/api/types/airport'
import type { CabinClass, Flight, FlightSegment } from '@/api/types/offer'
import type { FieldRule } from './rules'

const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR

// ─── Классы обслуживания ──────────────────────────────────────────────────────

export const CABIN_CLASS_OPTIONS: { value: CabinClass; title: string }[] = [
  { value: 'economy', title: 'Эконом' },
  { value: 'comfort', title: 'Комфорт' },
  { value: 'comfort_plus', title: 'Комфорт плюс' },
  { value: 'business', title: 'Бизнес' },
  { value: '', title: 'Не указан' },
]

/** Подпись класса для показа перелёта; у неизвестного класса подписи нет. */
export function cabinClassLabel(cabinClass: CabinClass): string {
  if (!cabinClass) return ''
  return CABIN_CLASS_OPTIONS.find((o) => o.value === cabinClass)?.title ?? cabinClass
}

// ─── Показ аэропорта ──────────────────────────────────────────────────────────

/** Код аэропорта для показа: IATA, а если его нет — ICAO. */
export function airportCode(airport: Airport | null | undefined): string {
  return airport ? (airport.iata ?? airport.icao) : ''
}

// ─── Длительности (их считает api, web только форматирует секунды) ────────────

function formatSpan(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) return ''
  const totalMinutes = Math.round(seconds / SECONDS_IN_MINUTE)
  const days = Math.floor(totalMinutes / MINUTES_IN_DAY)
  const hours = Math.floor((totalMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR)
  const minutes = totalMinutes % MINUTES_IN_HOUR
  if (days > 0) return `${days}д ${hours}ч`
  if (hours > 0) return minutes > 0 ? `${hours}ч ${minutes}мин` : `${hours}ч`
  return `${minutes} мин`
}

/** Общее время в пути; неположительное или неизвестное значение не показывается. */
export function formatFlightDuration(seconds: number | null | undefined): string {
  const span = formatSpan(seconds)
  return span && `${span} в пути`
}

/** Ожидание на пересадке; неположительное или неизвестное значение не показывается. */
export function formatLayoverWait(seconds: number | null | undefined): string {
  return formatSpan(seconds)
}

// ─── Местное время ────────────────────────────────────────────────────────────

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/

/**
 * Разбирает местное время сегмента для показа. Строка показывается как есть:
 * часы берутся из неё напрямую, а дата форматируется в UTC, поэтому часовой
 * пояс браузера на результат не влияет.
 */
export function formatLocalDateTime(value: string): { date: string; time: string; weekday: string } {
  const match = LOCAL_DATE_TIME.exec(value ?? '')
  if (!match) return { date: '', time: '', weekday: '' }
  const [, year, month, day, hour, minute] = match
  const calendarDay = new Date(Date.UTC(+year, +month - 1, +day))
  return {
    date: calendarDay.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
    weekday: calendarDay.toLocaleDateString('ru-RU', { weekday: 'short', timeZone: 'UTC' }),
    time: `${hour}:${minute}`,
  }
}

// ─── Цена ─────────────────────────────────────────────────────────────────────

const DECIMAL_PRICE = /^\d+(\.\d+)?$/

/** Цена — неотрицательная десятичная запись с точкой. Остальные ограничения проверяет api. */
export const priceRule: FieldRule = (value) =>
  DECIMAL_PRICE.test(String(value ?? '').trim()) || 'Укажите число с точкой, например 12345.50'

// ─── Черновики диалога ────────────────────────────────────────────────────────

export function blankSegment(): FlightSegment {
  return {
    departureAirport: null,
    arrivalAirport: null,
    departureAt: '',
    arrivalAt: '',
    cabinClass: '',
    airline: null,
    flightNumber: '',
  }
}

export function blankFlight(): Flight {
  return {
    price: '',
    currency: 'RUB',
    managerComment: '',
    segments: [blankSegment()],
  }
}

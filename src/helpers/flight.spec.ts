import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  airportCode,
  blankFlight,
  blankSegment,
  cabinClassLabel,
  CABIN_CLASS_OPTIONS,
  formatFlightDuration,
  formatLayoverWait,
  formatLocalDateTime,
  priceRule,
} from './flight'
import type { Airport } from '@/api/types/airport'

const airport: Airport = {
  icao: 'UUEE',
  iata: 'SVO',
  name: 'Шереметьево',
  city: { name: 'Москва' },
  country: { iso2: 'RU', name: 'Россия' },
}

describe('airportCode', () => {
  it('показывает IATA', () => expect(airportCode(airport)).toBe('SVO'))
  it('аэропорт без IATA — ICAO', () => expect(airportCode({ ...airport, iata: null })).toBe('UUEE'))
  it('нет аэропорта — пусто', () => {
    expect(airportCode(null)).toBe('')
    expect(airportCode(undefined)).toBe('')
  })
})

describe('cabinClassLabel', () => {
  it('подписи всех классов', () => {
    expect(cabinClassLabel('economy')).toBe('Эконом')
    expect(cabinClassLabel('comfort')).toBe('Комфорт')
    expect(cabinClassLabel('comfort_plus')).toBe('Комфорт плюс')
    expect(cabinClassLabel('business')).toBe('Бизнес')
  })
  it('неизвестный класс не показывается', () => expect(cabinClassLabel('')).toBe(''))
  it('в списке диалога пять значений, «Не указан» — пустой класс', () => {
    expect(CABIN_CLASS_OPTIONS.map((o) => o.value)).toEqual([
      'economy',
      'comfort',
      'comfort_plus',
      'business',
      '',
    ])
    expect(CABIN_CLASS_OPTIONS.find((o) => o.value === '')?.title).toBe('Не указан')
  })
})

describe('formatFlightDuration', () => {
  it('10800 → «3ч в пути»', () => expect(formatFlightDuration(10800)).toBe('3ч в пути'))
  it('часы и минуты', () => expect(formatFlightDuration(19500)).toBe('5ч 25мин в пути'))
  it('только минуты', () => expect(formatFlightDuration(1500)).toBe('25 мин в пути'))
  it('дни и часы', () => expect(formatFlightDuration(93600)).toBe('1д 2ч в пути'))
  it('0 — пусто', () => expect(formatFlightDuration(0)).toBe(''))
  it('отрицательное — пусто', () => expect(formatFlightDuration(-3600)).toBe(''))
  it('неизвестное — пусто', () => {
    expect(formatFlightDuration(undefined)).toBe('')
    expect(formatFlightDuration(null)).toBe('')
    expect(formatFlightDuration(NaN)).toBe('')
  })
})

describe('formatLayoverWait', () => {
  it('часы и минуты', () => expect(formatLayoverWait(9000)).toBe('2ч 30мин'))
  it('только часы', () => expect(formatLayoverWait(3600)).toBe('1ч'))
  it('только минуты', () => expect(formatLayoverWait(600)).toBe('10 мин'))
  it('0 — пусто', () => expect(formatLayoverWait(0)).toBe(''))
  it('отрицательное — пусто', () => expect(formatLayoverWait(-60)).toBe(''))
  it('неизвестное — пусто', () => expect(formatLayoverWait(undefined)).toBe(''))
})

describe('formatLocalDateTime', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it.each(['America/New_York', 'Asia/Tokyo', 'Pacific/Kiritimati'])(
    'браузер в поясе %s: показывается то же местное время и та же дата',
    (timeZone) => {
      vi.stubEnv('TZ', timeZone)
      const formatted = formatLocalDateTime('2026-05-14T23:30:00')
      expect(formatted.time).toBe('23:30')
      expect(formatted.date).toMatch(/^14\s/)
      expect(formatted.weekday).toBe('чт')
    },
  )

  it('неразобранная строка — пусто', () => {
    expect(formatLocalDateTime('')).toEqual({ date: '', time: '', weekday: '' })
    expect(formatLocalDateTime('не дата')).toEqual({ date: '', time: '', weekday: '' })
  })
})

describe('priceRule', () => {
  it.each(['0', '15000', '12345.5', '12345.50', ' 100 '])('%j — принимается', (value) => {
    expect(priceRule(value)).toBe(true)
  })

  it.each(['', '-1', '12345,50', '1e5', '12.', '.5', 'abc', null])('%j — отклоняется', (value) => {
    expect(priceRule(value)).toEqual(expect.any(String))
  })
})

describe('черновики', () => {
  it('новый сегмент: «Не указан» и пустая авиакомпания', () => {
    expect(blankSegment()).toMatchObject({ cabinClass: '', airline: null, flightNumber: '' })
  })

  it('новый перелёт — цена строкой, один пустой сегмент', () => {
    const flight = blankFlight()
    expect(flight.price).toBe('')
    expect(flight.managerComment).toBe('')
    expect(flight.segments).toHaveLength(1)
  })
})

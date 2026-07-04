import { describe, it, expect } from 'vitest'
import {
  zonedToUtcMs,
  formatDurationMs,
  computeFlightDurationMs,
  formatLayoverWait,
} from './flight'
import type { FlightSegment } from '@/api/types/offer'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seg(
  depDate: string,
  depTime: string,
  fromTz: string,
  arrDate: string,
  arrTime: string,
  toTz: string,
): FlightSegment {
  return {
    airline: '',
    flightNumber: '',
    flightClass: 'economy',
    from: { city: 'A', name: 'Airport A', code: 'AAA', timezone: fromTz },
    to: { city: 'B', name: 'Airport B', code: 'BBB', timezone: toTz },
    departureDateTime: `${depDate}T${depTime}:00`,
    arrivalDateTime: `${arrDate}T${arrTime}:00`,
  }
}

// ─── zonedToUtcMs ─────────────────────────────────────────────────────────────

describe('zonedToUtcMs', () => {
  it('handles ISO offset +03:00', () => {
    // 10:00 local UTC+3  =  07:00 UTC
    const ms = zonedToUtcMs('2026-01-01T10:00:00', '+03:00')
    expect(ms).toBe(Date.UTC(2026, 0, 1, 7, 0, 0))
  })

  it('handles ISO offset -05:00', () => {
    // 10:00 local UTC-5  =  15:00 UTC
    const ms = zonedToUtcMs('2026-01-01T10:00:00', '-05:00')
    expect(ms).toBe(Date.UTC(2026, 0, 1, 15, 0, 0))
  })

  it('handles IANA timezone Europe/Moscow (+03:00)', () => {
    const ms = zonedToUtcMs('2026-01-01T10:00:00', 'Europe/Moscow')
    // Moscow is UTC+3 in winter
    expect(ms).toBe(Date.UTC(2026, 0, 1, 7, 0, 0))
  })

  it('handles IANA timezone America/New_York (-05:00 in winter)', () => {
    const ms = zonedToUtcMs('2026-01-01T10:00:00', 'America/New_York')
    // New York is UTC-5 in winter
    expect(ms).toBe(Date.UTC(2026, 0, 1, 15, 0, 0))
  })

  // ── Bug cases ────────────────────────────────────────────────────────────────

  it('does NOT throw for empty timezone — treats local as UTC', () => {
    const ms = zonedToUtcMs('2026-01-01T10:00:00', '')
    expect(ms).toBe(Date.UTC(2026, 0, 1, 10, 0, 0))
  })

  it('does NOT throw for null timezone — treats local as UTC', () => {
    const ms = zonedToUtcMs('2026-01-01T14:00:00', null as unknown as string)
    expect(ms).toBe(Date.UTC(2026, 0, 1, 14, 0, 0))
  })

  it('does NOT throw for unknown IANA name — treats local as UTC', () => {
    expect(() => zonedToUtcMs('2026-01-01T10:00:00', 'Unknown/Zone')).not.toThrow()
    const ms = zonedToUtcMs('2026-01-01T10:00:00', 'Unknown/Zone')
    expect(ms).toBe(Date.UTC(2026, 0, 1, 10, 0, 0))
  })

  it('returns NaN for unparseable datetime string', () => {
    const ms = zonedToUtcMs('not-a-date', '+03:00')
    expect(Number.isNaN(ms)).toBe(true)
  })
})

// ─── formatDurationMs ─────────────────────────────────────────────────────────

describe('formatDurationMs', () => {
  it('returns empty string for 0', () => expect(formatDurationMs(0)).toBe(''))
  it('returns empty string for negative', () => expect(formatDurationMs(-1000)).toBe(''))
  it('returns empty string for NaN', () => expect(formatDurationMs(NaN)).toBe(''))
  it('formats minutes only', () => expect(formatDurationMs(25 * 60_000)).toBe('25 мин в пути'))
  it('formats hours only', () => expect(formatDurationMs(3 * 3600_000)).toBe('3ч в пути'))
  it('formats hours + minutes', () =>
    expect(formatDurationMs((5 * 60 + 25) * 60_000)).toBe('5ч 25мин в пути'))
  it('formats days + hours', () =>
    expect(formatDurationMs((1 * 24 * 60 + 2 * 60) * 60_000)).toBe('1д 2ч в пути'))
})

// ─── computeFlightDurationMs ──────────────────────────────────────────────────

describe('computeFlightDurationMs', () => {
  // ── Direct flights ────────────────────────────────────────────────────────

  it('direct flight — ISO offset same timezone', () => {
    // 10:00 → 14:00 both UTC+3  →  4h exactly
    const segments = [seg('2026-01-01', '10:00', '+03:00', '2026-01-01', '14:00', '+03:00')]
    expect(computeFlightDurationMs(segments)).toBe(4 * 3600_000)
  })

  it('direct flight — ISO offset cross-timezone (origin ahead)', () => {
    // SVX-style: dep 07:20 UTC+5 = 02:20 UTC; arr 10:45 UTC+3 = 07:45 UTC → 5h25m
    const segments = [seg('2026-01-01', '07:20', '+05:00', '2026-01-01', '10:45', '+03:00')]
    expect(computeFlightDurationMs(segments)).toBe((5 * 60 + 25) * 60_000)
  })

  it('direct flight — ISO offset cross-timezone (origin behind)', () => {
    // dep 23:00 UTC+8 = 15:00 UTC; arr 15:00 UTC-5 = 20:00 UTC → 5h
    // Without timezone handling, arr_naive (15:00) < dep_naive (23:00) → duration would be 0.
    // This is the core bug scenario.
    const segments = [seg('2026-01-01', '23:00', '+08:00', '2026-01-01', '15:00', '-05:00')]
    expect(computeFlightDurationMs(segments)).toBe(5 * 3600_000)
  })

  it('direct flight — IANA timezones', () => {
    // Europe/Moscow (UTC+3) → America/New_York (UTC-5) on same calendar date
    // dep 20:00 MSK = 17:00 UTC; arr 15:00 EST = 20:00 UTC → 3h
    const segments = [
      seg('2026-01-01', '20:00', 'Europe/Moscow', '2026-01-01', '15:00', 'America/New_York'),
    ]
    expect(computeFlightDurationMs(segments)).toBe(3 * 3600_000)
  })

  // ── Bug: empty / null timezone must not return 0 ─────────────────────────

  it('direct flight — empty timezone: returns positive duration (bug fix)', () => {
    // Previously: Intl.DateTimeFormat('en-US', { timeZone: '' }) throws → computed fails → 0
    const segments = [seg('2026-01-01', '10:00', '', '2026-01-01', '14:00', '')]
    expect(computeFlightDurationMs(segments)).toBeGreaterThan(0)
    expect(computeFlightDurationMs(segments)).toBe(4 * 3600_000)
  })

  it('direct flight — null timezone: returns positive duration (bug fix)', () => {
    const s = seg('2026-01-01', '10:00', '', '2026-01-01', '15:30', '')
    s.from.timezone = null as unknown as string
    s.to.timezone = null as unknown as string
    expect(computeFlightDurationMs([s])).toBe((5 * 60 + 30) * 60_000)
  })

  it('returns 0 for empty datetime strings', () => {
    const s = seg('2026-01-01', '10:00', '+03:00', '2026-01-01', '14:00', '+03:00')
    s.departureDateTime = ''
    expect(computeFlightDurationMs([s])).toBe(0)
  })

  // ── Transfer flights ──────────────────────────────────────────────────────

  it('transfer flight — sum of segment times + layover', () => {
    // Seg 0: 08:00 → 10:00 UTC+3 = 05:00 → 07:00 UTC → 2h flight
    // Layover: 10:00 → 12:00 UTC+3 = 07:00 → 09:00 UTC → 2h wait
    // Seg 1: 12:00 → 15:00 UTC+3 = 09:00 → 12:00 UTC → 3h flight
    // Total: 7h
    const transferTz = '+03:00'
    const seg0: FlightSegment = {
      airline: '',
      flightNumber: '',
      flightClass: 'economy',
      from: { city: 'A', name: 'Airport A', code: 'AAA', timezone: '+03:00' },
      to: { city: 'T', name: 'Transfer T', code: 'TTT', timezone: transferTz },
      departureDateTime: '2026-01-01T08:00:00',
      arrivalDateTime: '2026-01-01T10:00:00',
    }
    const seg1: FlightSegment = {
      airline: '',
      flightNumber: '',
      flightClass: 'economy',
      from: { city: 'T', name: 'Transfer T', code: 'TTT', timezone: transferTz },
      to: { city: 'B', name: 'Airport B', code: 'BBB', timezone: '+03:00' },
      departureDateTime: '2026-01-01T12:00:00',
      arrivalDateTime: '2026-01-01T15:00:00',
    }
    expect(computeFlightDurationMs([seg0, seg1])).toBe(7 * 3600_000)
  })
})

// ─── formatLayoverWait ────────────────────────────────────────────────────────

describe('formatLayoverWait', () => {
  it('formats layover duration between two segments', () => {
    const prev: FlightSegment = {
      airline: '',
      flightNumber: '',
      flightClass: 'economy',
      from: { city: '', name: '', code: '', timezone: '+03:00' },
      to: { city: '', name: '', code: '', timezone: '+03:00' },
      departureDateTime: '2026-01-01T08:00:00',
      arrivalDateTime: '2026-01-01T10:30:00',
    }
    const next: FlightSegment = {
      airline: '',
      flightNumber: '',
      flightClass: 'economy',
      from: { city: '', name: '', code: '', timezone: '+03:00' },
      to: { city: '', name: '', code: '', timezone: '+03:00' },
      departureDateTime: '2026-01-01T13:00:00',
      arrivalDateTime: '2026-01-01T16:00:00',
    }
    // 10:30 → 13:00 = 2h 30min layover
    expect(formatLayoverWait(prev, next)).toBe('2ч 30мин')
  })

  it('returns empty string when departure is before arrival', () => {
    const prev: FlightSegment = {
      airline: '',
      flightNumber: '',
      flightClass: 'economy',
      from: { city: '', name: '', code: '', timezone: '+03:00' },
      to: { city: '', name: '', code: '', timezone: '+03:00' },
      departureDateTime: '2026-01-01T10:00:00',
      arrivalDateTime: '2026-01-01T14:00:00',
    }
    const next: FlightSegment = {
      ...prev,
      departureDateTime: '2026-01-01T12:00:00',
    }
    expect(formatLayoverWait(prev, next)).toBe('')
  })
})

import type { FlightSegment } from '@/api/types/offer'

/**
 * Converts a naive local ISO datetime string (without TZ suffix) interpreted
 * as wall-clock time in `timeZone` into absolute UTC milliseconds.
 *
 * Supported `timeZone` formats:
 *   1. ISO offset — "+03:00", "-05:30".  No Intl dependency.
 *   2. IANA zone  — "Europe/Moscow".     Resolved via Intl (legacy compat).
 *   3. Null / empty / unknown            → treated as UTC (offset 0).
 */
export function zonedToUtcMs(localIso: string, timeZone: string | null | undefined): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(localIso ?? '')
  if (!match) {
    return new Date(localIso ?? '').getTime()
  }
  const [, y, mo, d, h, mi, s] = match
  // Treat the local time components as if they were UTC — we then subtract the
  // zone offset to recover the true UTC instant.
  const asIfUtc = Date.UTC(+y, +mo - 1, +d, +h, +mi, s ? +s : 0)

  const tz = (timeZone ?? '').trim()

  // Format 1: ISO offset designator like "+03:00" or "-05:30".
  const offsetMatch = /^([+-])(\d{2}):(\d{2})$/.exec(tz)
  if (offsetMatch) {
    const sign = offsetMatch[1] === '-' ? -1 : 1
    const offsetMs = sign * (+offsetMatch[2] * 60 + +offsetMatch[3]) * 60_000
    // Wall-clock = UTC + offset  →  UTC = asIfUtc − offset
    return asIfUtc - offsetMs
  }

  // Format 2: IANA zone name (legacy). Resolve offset via Intl.
  // Empty / null / invalid zone falls back to UTC (offset 0).
  if (!tz) return asIfUtc

  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
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
    // offset = how far ahead of UTC the zone is at this moment
    const offset = shownInTz - asIfUtc
    return asIfUtc - offset
  } catch {
    // Unknown or unsupported IANA name → treat local time as UTC
    return asIfUtc
  }
}

export function formatDurationMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return ''
  const totalMinutes = Math.round(ms / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}д ${hours}ч в пути`
  if (hours > 0) {
    return minutes > 0 ? `${hours}ч ${minutes}мин в пути` : `${hours}ч в пути`
  }
  return `${minutes} мин в пути`
}

/**
 * Total flight duration in ms: sum of all segment flight times + all layover
 * waiting times.  Returns 0 when there is insufficient data.
 */
export function computeFlightDurationMs(segments: FlightSegment[]): number {
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
  return totalMs
}

/** Human-readable layover wait between two adjacent segments. */
export function formatLayoverWait(prev: FlightSegment, next: FlightSegment): string {
  const arrMs = zonedToUtcMs(prev.arrivalDateTime, prev.to.timezone)
  const depMs = zonedToUtcMs(next.departureDateTime, next.from.timezone)
  const waitMs = depMs - arrMs
  if (!Number.isFinite(waitMs) || waitMs <= 0) return ''
  const totalMinutes = Math.round(waitMs / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}д ${hours}ч`
  if (hours > 0) return minutes > 0 ? `${hours}ч ${minutes}мин` : `${hours}ч`
  return `${minutes} мин`
}

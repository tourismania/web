/**
 * Считает количество ночей между датами заезда и выезда.
 *
 * Используем разницу календарных дат: при стандартной конвенции
 * "заезд в 14:00 / выезд в 12:00" количество ночей равно разнице дат,
 * потому что время заезда/выезда не пересекает границу очередных суток.
 *
 * Принимает строки в формате `YYYY-MM-DD`. Если строка содержит временную
 * часть — она игнорируется (берётся только дата).
 *
 * Возвращает 0, если даты не заданы, не парсятся или `checkOut <= checkIn`.
 */
export function computeNights(
  checkIn: string | null | undefined,
  checkOut: string | null | undefined,
): number {
  const a = parseDateOnly(checkIn)
  const b = parseDateOnly(checkOut)
  if (!a || !b) return 0
  const diffMs = b.getTime() - a.getTime()
  if (diffMs <= 0) return 0
  // Используем UTC при парсинге, поэтому получим целое число суток без
  // влияния переходов на летнее/зимнее время.
  return Math.round(diffMs / 86_400_000)
}

function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!m) return null
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
}

/**
 * Русское склонение слова "ночь" по числу.
 *   1, 21, 31, ...      → "ночь"
 *   2-4, 22-24, ...     → "ночи"
 *   0, 5-20, 25-30, ... → "ночей"
 */
export function pluralizeNights(n: number): string {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} ночь`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ночи`
  return `${n} ночей`
}

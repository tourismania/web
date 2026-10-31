import axios from 'axios'

interface ApiErrorDto {
  error?: unknown
  meta?: Record<string, unknown>
}

const VALIDATION_FAILED = 'validation failed'

/**
 * Текст ошибки запроса к api для показа пользователю: `<fallback>: <причина>`.
 * Причина берётся из `response.data.error`, для `validation failed` к ней
 * добавляются ключи `meta` (поля с ошибкой). Если причины в ответе нет
 * (сетевая ошибка, ответ без тела) — только `fallback`.
 */
export function apiErrorMessage(e: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorDto>(e)) return fallback
  const reason = e.response?.data?.error
  if (typeof reason !== 'string' || !reason) return fallback
  const fields = reason === VALIDATION_FAILED ? Object.keys(e.response?.data?.meta ?? {}) : []
  return fields.length > 0
    ? `${fallback}: ${reason} (${fields.join(', ')})`
    : `${fallback}: ${reason}`
}

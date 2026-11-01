import { describe, it, expect } from 'vitest'
import { apiErrorMessage } from './error'

function axiosError(data?: unknown) {
  return { isAxiosError: true, response: data === undefined ? undefined : { status: 400, data } }
}

describe('apiErrorMessage', () => {
  it('добавляет причину из response.data.error', () => {
    const e = axiosError({ error: 'flight segment arrival must be strictly after departure', code: 400 })
    expect(apiErrorMessage(e, 'Не удалось сохранить оффер')).toBe(
      'Не удалось сохранить оффер: flight segment arrival must be strictly after departure',
    )
  })

  it('для validation failed перечисляет ключи meta', () => {
    const e = axiosError({ error: 'validation failed', code: 400, meta: { Price: 'money', AirlineID: 'required' } })
    expect(apiErrorMessage(e, 'Не удалось сохранить оффер')).toBe(
      'Не удалось сохранить оффер: validation failed (Price, AirlineID)',
    )
  })

  it('validation failed без meta — только причина', () => {
    expect(apiErrorMessage(axiosError({ error: 'validation failed' }), 'Ошибка')).toBe(
      'Ошибка: validation failed',
    )
  })

  it('meta другой ошибки не показывается', () => {
    expect(apiErrorMessage(axiosError({ error: 'forbidden', meta: { Price: 'money' } }), 'Ошибка')).toBe(
      'Ошибка: forbidden',
    )
  })

  it.each([
    ['ответ без тела', axiosError('')],
    ['нет ответа', axiosError()],
    ['error не строка', axiosError({ error: { code: 'x' } })],
    ['не ошибка axios', new Error('network down')],
    ['не ошибка вообще', null],
  ])('%s — общая фраза', (_name, e) => {
    expect(apiErrorMessage(e, 'Не удалось сохранить оффер')).toBe('Не удалось сохранить оффер')
  })
})

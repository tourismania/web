import { describe, it, expect } from 'vitest'
import { required } from './rules'

describe('required', () => {
  it.each([['текст'], [0], [{ icao: 'UUEE' }]])('%j — заполнено', (value) => {
    expect(required(value)).toBe(true)
  })

  it.each([[''], ['   '], [null], [undefined]])('%j — не заполнено', (value) => {
    expect(required(value)).toBe('Обязательное поле')
  })
})

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import FlightEditDialog from './FlightEditDialog.vue'
import { blankFlight } from '@/helpers/flight'
import type { Airline, Airport, Flight } from '@/api/types/offer'

function airport(icao: string, iata: string | null, city: string): Airport {
  return {
    icao,
    iata,
    name: `Аэропорт ${icao}`,
    city: { name: city },
    country: { iso2: 'RU', name: 'Россия' },
  }
}

const unknownAirline: Airline = { id: 1, icao: null, name: 'Неизвестная', dissolvedOn: null }

// Сегмент «со старыми данными»: пустые класс и номер, авиакомпания «Неизвестная»
function savedFlight(): Flight {
  return {
    id: 11,
    price: '15000.00',
    currency: 'RUB',
    managerComment: '',
    totalDurationSeconds: 3600,
    layovers: [],
    segments: [
      {
        departureAirport: airport('USSS', 'SVX', 'Екатеринбург'),
        arrivalAirport: airport('UUEE', null, 'Москва'),
        departureAt: '2026-05-14T10:00:30',
        arrivalAt: '2026-05-14T11:00:00',
        cabinClass: '',
        airline: unknownAirline,
        flightNumber: '',
        durationSeconds: 3600,
      },
    ],
  }
}

function button(text: string): HTMLButtonElement {
  const found = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.trim() === text)
  if (!found) throw new Error(`кнопка «${text}» не найдена`)
  return found
}

describe('FlightEditDialog', () => {
  let wrapper: VueWrapper | null = null

  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.stubGlobal('visualViewport', new EventTarget())
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    document.body.innerHTML = ''
  })

  async function open(flight: Flight) {
    wrapper = mount(FlightEditDialog, {
      attachTo: document.body,
      props: { modelValue: true, flight, editingIndex: null },
      global: { plugins: [createVuetify({ components, directives })] },
    })
    await flushPromises()
    return wrapper
  }

  async function clickSave() {
    button('Сохранить').click()
    await flushPromises()
  }

  // Состояние диалога напрямую: выбор в v-autocomplete требует поиска и меню
  function draftOf(w: VueWrapper): Flight {
    return (w.vm as unknown as { draft: Flight }).draft
  }

  it('пустой перелёт не сохраняется, диалог остаётся открытым, поля отмечены', async () => {
    const w = await open(blankFlight())

    await clickSave()

    expect(w.emitted('save')).toBeUndefined()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(document.querySelectorAll('.v-input--error').length).toBeGreaterThanOrEqual(6)
    expect(document.body.textContent).toContain('Обязательное поле')
  })

  it('некорректная цена не сохраняется, остальные поля заполнены', async () => {
    const flight = savedFlight()
    flight.price = '-5'
    const w = await open(flight)

    await clickSave()

    expect(w.emitted('save')).toBeUndefined()
    expect(document.body.textContent).toContain('Укажите число с точкой')
  })

  it('сегмент со старыми данными сохраняется без правок и не меняется', async () => {
    const flight = savedFlight()
    const w = await open(flight)

    await clickSave()

    expect(w.emitted('save')?.[0]).toEqual([flight])
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('в поле класса «Не указан» у пустого класса', async () => {
    await open(savedFlight())

    expect(document.body.textContent).toContain('Не указан')
  })

  it('номер рейса ограничен 10 символами', async () => {
    await open(savedFlight())

    const limited = document.querySelectorAll('input[maxlength="10"]')
    expect(limited.length).toBe(1)
  })

  it('добавление пересадки: новый сегмент летит в прежний конечный аэропорт, класс и авиакомпания пустые', async () => {
    const flight = savedFlight()
    flight.segments[0].cabinClass = 'business'
    const w = await open(flight)

    button('Добавить пересадку').click()
    await flushPromises()

    const added = draftOf(w).segments[1]
    expect(added.arrivalAirport?.icao).toBe('UUEE')
    expect(added.departureAirport).toBeNull()
    expect(added.airline).toBeNull()
    expect(added.cabinClass).toBe('')
    expect(added.flightNumber).toBe('')

    // Новый сегмент не заполнен — сохранить нельзя
    await clickSave()
    expect(w.emitted('save')).toBeUndefined()
  })

  it('сохранение приравнивает аэропорт вылета следующего сегмента к прилёту предыдущего', async () => {
    const flight = savedFlight()
    flight.segments.push({
      ...flight.segments[0],
      departureAirport: airport('LTFM', 'IST', 'Стамбул'),
      arrivalAirport: airport('LTAI', 'AYT', 'Анталья'),
      departureAt: '2026-05-14T14:00:00',
      arrivalAt: '2026-05-14T16:00:00',
    })
    const w = await open(flight)

    await clickSave()

    const saved = w.emitted('save')?.[0]?.[0] as Flight
    expect(saved.segments[1].departureAirport?.icao).toBe('UUEE')
    expect(saved.segments[1].arrivalAirport?.icao).toBe('LTAI')
  })

  it('удаление пересадки сливает сегменты: вылет из первого, аэропорт и время прилёта из второго', async () => {
    const flight = savedFlight()
    flight.segments.push({
      ...flight.segments[0],
      departureAirport: airport('UUEE', null, 'Москва'),
      arrivalAirport: airport('LTFM', 'IST', 'Стамбул'),
      departureAt: '2026-05-14T14:00:00',
      arrivalAt: '2026-05-14T18:00:00',
    })
    const w = await open(flight)

    const removeButton = document.querySelector<HTMLButtonElement>('.transfer-card button')
    removeButton?.click()
    await flushPromises()

    const segments = draftOf(w).segments
    expect(segments).toHaveLength(1)
    expect(segments[0].departureAirport?.icao).toBe('USSS')
    expect(segments[0].departureAt).toBe('2026-05-14T10:00:30')
    expect(segments[0].arrivalAirport?.icao).toBe('LTFM')
    expect(segments[0].arrivalAt).toBe('2026-05-14T18:00:00')
  })
})

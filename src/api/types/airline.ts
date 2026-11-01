// Модель повторяет модель api в camelCase, без полей, которые web не использует.
export interface Airline {
  id: number                      // ключ авиакомпании, в api уходит как airline_id
  icao: string | null             // null только у служебной записи «Неизвестная»
  name: string                    // для показа: русское, если есть, иначе английское (выбирает api)
  dissolvedOn: string | null      // YYYY-MM-DD; null — действует
}

export interface AirlineCountry {
  iso2: string
  name: string
}

/** Авиакомпания из поиска: кроме данных сегмента перелёта содержит страну. */
export interface AirlineSearchItem extends Airline {
  country: AirlineCountry | null
}

export interface AirlineSearchMeta {
  total: number
  limit: number
  offset: number
}

export interface AirlineSearchResult {
  data: AirlineSearchItem[]
  meta: AirlineSearchMeta
}

import type { Airline } from './offer'

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

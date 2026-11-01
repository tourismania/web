// Модель повторяет модель api в camelCase, без полей, которые web не использует.
export interface Airport {
  icao: string                    // ключ аэропорта, e.g. "USSS"
  iata: string | null             // только для показа, e.g. "SVX"
  name: string                    // e.g. "Кольцово"
  city: {
    name: string
  }
  country: {
    iso2: string
    name: string
  }
}

export interface AirportSearchMeta {
  total: number
  limit: number
  offset: number
}

export interface AirportSearchResult {
  data: Airport[]
  meta: AirportSearchMeta
}

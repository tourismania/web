export interface AirportCity {
  id: number
  name: string
  state: string | null
  /** IANA timezone, e.g. "Europe/Moscow"; "" — не указан */
  timezone: string
}

export interface AirportCountry {
  iso2: string
  name: string
}

export interface AirportLocation {
  elevation_ft: number | null
  latitude: number
  longitude: number
}

export interface AirportResult {
  /** IATA code, e.g. "SVO"; null — кода нет */
  iata: string | null
  /** ICAO code, e.g. "UUEE" */
  icao: string
  /** Airport name, e.g. "Шереметьево" */
  name: string
  city: AirportCity
  country: AirportCountry
  location: AirportLocation
}

export interface AirportSearchMeta {
  limit: number
  offset: number
  search: string
  total: number
}

export interface AirportSearchResponse {
  data: AirportResult[]
  meta: AirportSearchMeta
}

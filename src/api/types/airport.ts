export interface AirportCity {
  id: number
  name: string
  state: string
  /** IANA timezone, e.g. "Europe/Moscow" */
  timezone: string
}

export interface AirportCountry {
  iso2: string
  name: string
}

export interface AirportLocation {
  elevation_ft: number
  latitude: number
  longitude: number
}

export interface AirportResult {
  /** IATA code, e.g. "SVO" */
  iata: string
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

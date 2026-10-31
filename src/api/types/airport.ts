import type { Airport } from './offer'

export interface AirportSearchMeta {
  total: number
  limit: number
  offset: number
}

export interface AirportSearchResult {
  data: Airport[]
  meta: AirportSearchMeta
}

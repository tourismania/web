// Класс обслуживания сегмента; '' — класс неизвестен («Не указан»).
export type CabinClass = 'economy' | 'comfort' | 'comfort_plus' | 'business' | ''
export type Currency = 'RUB' | 'USD' | 'EUR' | 'TRY'
export type OfferStatus = 'draft' | 'ready' | 'published'

// Модель перелёта повторяет модель api и отличается только регистром имён
// (camelCase вместо snake_case). Маппинг — в src/api/offer.ts.

export interface Airport {
  icao: string                    // ключ аэропорта, e.g. "USSS"
  iata: string | null             // только для показа, e.g. "SVX"
  name: string                    // e.g. "Кольцово"
  city: {
    name: string
    timezone: string | null       // IANA, e.g. "Asia/Yekaterinburg"; web по ней ничего не считает
  }
  country: {
    iso2: string
    name: string
  }
}

export interface Airline {
  id: number                      // ключ авиакомпании, в api уходит как airline_id
  icao: string | null             // null только у служебной записи «Неизвестная»
  name: string                    // английское название
  nameRu: string                  // '' — русского названия нет
  dissolvedOn: string | null      // YYYY-MM-DD; null — действует
}

export interface FlightSegment {
  departureAirport: Airport | null // null бывает только в черновике диалога
  arrivalAirport: Airport | null   // null бывает только в черновике диалога
  departureAt: string              // местное время аэропорта вылета без смещения, e.g. "2026-05-14T10:00:00"
  arrivalAt: string                // местное время аэропорта прилёта без смещения
  cabinClass: CabinClass
  airline: Airline | null          // null бывает только в черновике диалога
  flightNumber: string             // e.g. "U6773"; '' — номер неизвестен
  durationSeconds?: number         // вычисляет api; нет у сегмента, не сохранённого в api
}

export interface FlightLayover {
  airportIcao: string
  durationSeconds: number
}

export interface Flight {
  id?: number                     // присваивает api
  price: string                   // десятичная строка с точкой, как в api, e.g. "12345.50"
  currency: Currency
  managerComment: string          // '' — комментария нет
  segments: FlightSegment[]       // длина >= 1; перелёт с N пересадками = N+1 сегмент
  totalDurationSeconds?: number   // вычисляет api; нет у перелёта, не сохранённого в api
  layovers?: FlightLayover[]      // вычисляет api; нет у перелёта, не сохранённого в api
}

export interface Image {
  url: string
}

export interface Hotel {
  name: string
  managerComment?: string
  stars: number
  address: string
  description: string
  roomType: string
  roomDescription?: string
  occupancyType: string
  price: number
  currency: Currency
  gallery: Image[]
  serviceFee: number
  serviceFeeCurrency?: Currency
  checkIn: string   // ISO date string
  checkOut: string  // ISO date string
}

export interface CarRentalVehicle {
  vehicle: string
  name: string
  price: number
  currency: Currency
}

export interface CarRental {
  name: string
  startLocation: string
  endLocation: string
  vehicles: CarRentalVehicle[]
  managerComment?: string
}

export interface CruiseCabin {
  description: string
  price: number
  currency: Currency
  managerComment?: string
}

export interface Cruise {
  gallery: Image[]
  name: string
  managerComment?: string
  cabin: CruiseCabin
}

export interface Excursion {
  date?: Date | null
  city?: string | null
  name: string
  price: number
  currency: Currency
  managerComment: string
  gallery: Image[]
}

export type TransportCategory = 'taxi' | 'bus' | 'transfer'

export interface PublicTransport {
  datetime: string            // ISO datetime string
  category: TransportCategory
  pickupLocation: string      // место посадки
  dropoffLocation: string     // место высадки
  duration: number            // minutes
  price: number
  currency: Currency
  managerComment?: string
}

export interface AdditionalService {
  name: string
  managerComment?: string
  price: number
  currency: Currency
}

export interface Offer {
  // Идентификаторы и метаданные, которые присваивает бэкенд — отсутствуют,
  // пока оффер существует только как локальный черновик (blankOffer()) и ещё
  // не был сохранён через OfferApi.create.
  uuid?: string               // первичный идентификатор оффера в реальном API, используется для роутинга
  id?: number                 // числовой id из реального API (для фильтров вроде created_by)
  agencyId?: number
  createdBy?: number
  createdAt?: string
  updatedAt?: string
  // Всегда имеют значение — задаются дефолтом и в blankOffer(), и в offer-сторе
  // при create/update (см. OfferApi), поэтому не optional.
  status: OfferStatus
  description: string        // из реального API (максимум 5000 символов на бэкенде); приветственный текст для клиента
  clients: Client[]
  startDate: string
  endDate: string
  title: string
  flights: Flight[]
  hotels: Hotel[]
  carRentals: CarRental[]
  cruises: Cruise[]
  excursions: Excursion[]
  transport: PublicTransport[]
  additionalServices: AdditionalService[]
}

export interface Client {
  name: string,
  surname: string
  email: string
}

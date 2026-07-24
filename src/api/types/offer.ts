export type FlightClass = 'economy' | 'business' | 'comfort'
export type Currency = 'RUB' | 'USD' | 'EUR' | 'TRY'
export type OfferStatus = 'draft' | 'ready' | 'published'

export interface Airport {
  city: string
  name: string         // e.g. "Кольцово"
  code: string         // IATA, e.g. "SVX"
  timezone: string     // IANA, e.g. "Asia/Yekaterinburg"
}

export interface FlightSegment {
  airline: string                 // авиакомпания, выполняющая сегмент
  flightNumber: string            // e.g. "U6-773"
  flightClass: FlightClass        // класс перелёта на сегменте
  from: Airport
  to: Airport
  departureDateTime: string       // local wall-clock в from.timezone, e.g. "2026-05-14T10:00:00"
  arrivalDateTime: string         // local wall-clock в to.timezone
}

export interface Flight {
  managerComment?: string
  segments: FlightSegment[]       // длина >= 1; перелёт с N пересадками = N+1 сегмент
  price: number
  currency: Currency
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
  id?: string               // uuid — первичный идентификатор оффера в реальном API
  numericId?: number        // числовой id из реального API (для фильтров вроде created_by)
  status?: OfferStatus      // из реального API; отсутствует у офферов, ещё не синхронизированных с бэкендом
  description?: string      // из реального API (максимум 5000 символов на бэкенде)
  agencyId?: number
  createdBy?: number
  updatedAt?: string
  clients: Client[]
  createdAt?: string
  startDate: string
  endDate: string
  title: string
  welcomeText: string
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

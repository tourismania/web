export type FlightClass = 'economy' | 'business' | 'comfort'
export type Currency = 'RUB' | 'USD' | 'EUR' | 'TRY'

export interface FlightEndpoint {
  city: string
  dateTime: string         // local wall-clock datetime in the airport's timezone, e.g. "2026-05-14T10:00:00"
  timezone: string         // IANA timezone name of the airport, e.g. "Europe/Moscow", "Asia/Tokyo"
  flight: string           // e.g. "U6 773"
  airport: string          // e.g. "Кольцово"
  airportCode: string      // e.g. "SVX"
  hasLayovers: boolean
  flightClass: FlightClass
  price: number
  currency: Currency
}

export interface Flight {
  airline: string
  managerComment?: string
  departure: FlightEndpoint
  arrival: FlightEndpoint
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
  nights: number
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
}

export interface Cruise {
  gallery: Image[]
  name: string
  managerComment?: string
  cabins: CruiseCabin[]
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
  id?: string
  clients: Client[]
  createdAt?: string
  startDate: string
  endDate: string
  title: string
  welcomeText: string
  flights: Flight[]
  totalFlightsCost: number
  flightsCurrency: Currency
  hotels: Hotel[]
  totalHotelsCost: number
  hotelsCurrency: Currency
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

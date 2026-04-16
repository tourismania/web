export type FlightClass = 'economy' | 'business' | 'comfort'
export type Currency = 'RUB' | 'USD' | 'EUR' | 'TRY'

export interface FlightEndpoint {
  city: string
  dateTime: string         // ISO datetime string
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

export interface HotelImage {
  url: string
  alt?: string
}

export interface Hotel {
  name: string
  managerComment?: string
  stars: number
  address: string
  description: string
  roomType: string
  occupancyType: string
  price: number
  currency: Currency
  images: HotelImage[]
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
  gallery: string[]
  name: string
  managerComment?: string
  cabins: CruiseCabin[]
}

export interface Excursion {
  date?: Date | null
  city?: string | null
  price: number
  currency: Currency
  managerComment: string
  gallery: HotelImage[]
}

export interface Tour {
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
}

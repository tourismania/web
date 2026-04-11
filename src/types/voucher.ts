/** Авиакомпания (перелёт) */
export interface FlightAirline {
  name: string
}

/** Точка вылета / прилёта */
export interface FlightEndpoint {
  date: string
  time: string
  city: string
  airportName: string
  airportCode: string
}

/** Перелёт (сегмент маршрута) */
export interface FlightSegment {
  id: string
  /** Заголовок карточки, напр. «Стамбул — Нью-Йорк» */
  routeTitle: string
  airline: FlightAirline
  flightNumber: string
  aircraftModel: string
  serviceClass: string
  hasBaggage: boolean
  departure: FlightEndpoint
  arrival: FlightEndpoint
  duration: string
  /** Прямой рейс и т. п. */
  isDirect: boolean
  /** Подпись под стрелкой, напр. «Без пересадок» */
  stopsLabel?: string
  /** Стоимость сегмента (для сводок / таблиц) */
  cost: number
}

/** Жильё */
export interface AccommodationStay {
  id: string
  date: string
  placement: string
  nights: number
  cityAndAddress: string
  extraInfo: string
  cost: string
}

/** Общественный транспорт */
export interface PublicTransportLeg {
  id: string
  date: string
  category: string
  note: string
  cost: string
}

/** Экскурсии и развлечения */
export interface ExcursionItem {
  id: string
  date: string
  category: string
  note: string
  cost: string
}

export interface RouteSheetCategoryTotal {
  category: string
  cost: string
}

export interface RouteSheetSummaryFooter {
  category: string
  cost: string
}

/** Активность в дне программы */
export interface ProgramActivity {
  id: string
  title: string
  note: string
  route: string
}

/** День программы: несколько активностей, общие рестораны на дату (rowspan в таблице) */
export interface ProgramDay {
  id: string
  date: string
  restaurants: string
  activities: ProgramActivity[]
}

/** Мета программы (вкладка) */
export interface ProgramMeta {
  id: string
  tabValue: string
  title: string
  weatherNote?: string
  headerImageSrcs?: string[]
  carouselSrcs?: string[]
}

export interface RouteSheetViewModel {
  accommodations: AccommodationStay[]
  accommodationSectionTotal: string
  publicTransport: PublicTransportLeg[]
  publicTransportSectionTotal: string
  excursions: ExcursionItem[]
  excursionSectionTotal: string
  summaryRows: RouteSheetCategoryTotal[]
  summaryFooter: RouteSheetSummaryFooter
}

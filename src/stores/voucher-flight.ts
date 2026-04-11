import { defineStore } from 'pinia'
import type { FlightSegment } from '@/types/voucher'

interface VoucherFlightState {
  segments: FlightSegment[]
}

export const useVoucherFlightStore = defineStore('voucherFlight', {
  getters: {
    getCostTotal: (state) => {
      let total = 0;
      for (const segment of state.segments) {
        total = total + segment.cost;
      }
      return total;
    },
  },
  state: (): VoucherFlightState => ({
    segments: [
      {
        id: 'flight-ist-jfk',
        routeTitle: 'Стамбул — Нью-Йорк',
        airline: { name: 'Turkish Airlines'},
        flightNumber: 'TK-11',
        aircraftModel: 'Boeing 777-300ER',
        serviceClass: 'Эконом',
        hasBaggage: false,
        departure: {
          date: '27.09.2025',
          time: '18:45',
          city: 'Стамбул',
          airportName: 'ISTANBUL AIRPORT',
          airportCode: 'IST',
        },
        arrival: {
          date: '27.09.2025',
          time: '22:40',
          city: 'Нью-Йорк',
          airportName: 'Джон Ф. Кеннеди',
          airportCode: 'JFK',
        },
        duration: '10ч. 55м.',
        isDirect: true,
        stopsLabel: 'Без пересадок',
        cost: 272691,
      },
      {
        id: 'flight-mia-ist',
        routeTitle: 'Майами — Стамбул',
        airline: { name: 'Turkish Airlines'},
        flightNumber: 'TK-78',
        aircraftModel: 'Boeing 777-300ER',
        serviceClass: 'Эконом',
        hasBaggage: false,
        departure: {
          date: '26.10.2025',
          time: '23:30',
          city: 'Майами',
          airportName: 'Майами Интернешнл',
          airportCode: 'MIA',
        },
        arrival: {
          date: '27.10.2025',
          time: '18:05',
          city: 'Стамбул',
          airportName: 'ISTANBUL AIRPORT',
          airportCode: 'IST',
        },
        duration: '11ч. 35м.',
        isDirect: true,
        stopsLabel: 'Без пересадок',
        cost: 272691,
      },
    ],
  }),
})

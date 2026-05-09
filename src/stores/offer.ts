import { defineStore } from 'pinia'
import { OfferApi } from '@/api/offer'
import type {Client, Offer} from '@/api/types/offer'


const MOCK_CLIENTS: Client[] = [
  {
    name: "Антон",
    surname: "Кирин",
    email: "a.kirin@gmail.com"
  },
  {
    name: "Анастасия",
    surname: "Шадрина",
    email: "a.shadrina@gmail.com"
  },
  {
    name: "Стич",
    surname: "Кирин",
    email: "s.kirin@gmail.com"
  }
];

const MOCK_OFFERS: Offer[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    createdAt: '2025-01-15T10:30:00Z',
    clients: [
      MOCK_CLIENTS[0], MOCK_CLIENTS[1]
    ],
    title: 'Путешествие по США',
    startDate: '2025-09-26',
    endDate: '2025-10-28',
    welcomeText:
        'Уважаемые Сергей и Анастасия, рада предложить для вас расчёт по маршруту в США: ' +
        'Нью-Йорк, Орландо, Майами + круиз. ' +
        '* Стоимость в рублях актуальна на день получения предложения и зависит от курса доллара. ' +
        'Стоимость и наличие не гарантируются до момента бронирования. ' +
        'При изменении дат бронирования стоимость может меняться.',
    flights: [
      {
        managerComment: 'Группа 1 (туда-обратно): 129 692 ₽ · U6-773 / Airbus A319 · багаж 23 KG',
        price: 129692,
        currency: 'RUB',
        segments: [
          {
            airline: 'Ural Airlines',
            flightNumber: 'U6-773',
            flightClass: 'economy',
            from: {
              city: 'Екатеринбург',
              name: 'Кольцово',
              code: 'SVX',
              timezone: 'Asia/Yekaterinburg',
            },
            to: {
              city: 'Стамбул',
              name: 'Istanbul Airport',
              code: 'IST',
              timezone: 'Europe/Istanbul',
            },
            departureDateTime: '2025-09-26T07:20:00',
            arrivalDateTime: '2025-09-26T10:45:00',
          },
        ],
      },
      {
        managerComment:
            'Группа 2 (туда-обратно): 272 691 ₽ · TK-11 / Boeing 777-300ER · 10ч 55м · без багажа',
        price: 272691,
        currency: 'RUB',
        segments: [
          {
            airline: 'Yakutia',
            flightNumber: 'YK-11',
            flightClass: 'economy',
            from: {
              city: 'Yakutsk',
              name: 'Yakutsk Airport',
              code: 'YKT',
              timezone: 'Asia/Yakutsk',
            },
            to: {
              city: 'Стамбул',
              name: 'Istanbul Airport',
              code: 'IST',
              timezone: 'America/New_York',
            },
            departureDateTime: '2025-09-27T10:45:00',
            arrivalDateTime: '2025-09-27T18:40:00',
          },
          {
            airline: 'Turkish Airlines',
            flightNumber: 'TK-11',
            flightClass: 'economy',
            from: {
              city: 'Стамбул',
              name: 'Istanbul Airport',
              code: 'IST',
              timezone: 'Europe/Istanbul',
            },
            to: {
              city: 'Нью-Йорк',
              name: 'Джон Ф. Кеннеди',
              code: 'JFK',
              timezone: 'America/New_York',
            },
            departureDateTime: '2025-09-27T18:45:00',
            arrivalDateTime: '2025-09-27T22:40:00',
          },
        ],
      },
      {
        managerComment: 'NK-2819 · 18 KG багаж · Внимание: регистрация на рейс платная',
        price: 42273,
        currency: 'RUB',
        segments: [
          {
            airline: 'Spirit Airlines',
            flightNumber: 'NK-2819',
            flightClass: 'economy',
            from: {
              city: 'Нью-Йорк',
              name: 'Ньюарк Либерти Интернешнл',
              code: 'EWR',
              timezone: 'America/New_York',
            },
            to: {
              city: 'Орландо',
              name: 'Орландо Интернэшнл',
              code: 'MCO',
              timezone: 'America/New_York',
            },
            departureDateTime: '2025-10-02T14:00:00',
            arrivalDateTime: '2025-10-02T16:49:00',
          },
        ],
      },
    ],
    hotels: [
      {
        name: 'The Haze Karaköy',
        stars: 4,
        address: 'Karaköy, Istanbul, Турция',
        description:
            'Бутик-отель в историческом здании рядом с Галатской башней и набережной. ' +
            'Современный дизайн, уютные номера, вкусные завтраки.',
        roomType: 'Superior Room',
        roomDescription: 'Просторный номер с видом на Босфор, двуспальная кровать king-size.',
        occupancyType: 'Breakfast buffet',
        price: 17264,
        currency: 'RUB',
        gallery: [
          { url: '/images/examples/hotel_5.jpeg',},
          { url: '/images/examples/hotel_6.jpeg',},
        ],
        serviceFee: 200,
        serviceFeeCurrency: 'USD',
        checkIn: '2025-09-26',
        checkOut: '2025-09-27',
        managerComment: 'Breakfast buffet = 200 USD / 17 264 ₽',
      },
      {
        name: 'The Fifty Sonesta Hotel New York',
        stars: 4,
        address: '155 East 50th Street, New York, NY 10022',
        description:
            'Стильный бутик-отель в Мидтауне. Самый тихий и спокойный район из возможных.',
        roomType: 'Studio, 2 Queen Beds',
        roomDescription: 'Студия с двумя двуспальными кроватями, кухонным уголком.',
        occupancyType: 'RO — без питания',
        price: 254709,
        currency: 'RUB',
        gallery: [
          { url: '/images/examples/hotel_7.jpeg',},
          { url: '/images/examples/hotel_8.jpeg',},
        ],
        serviceFee: 19593,
        serviceFeeCurrency: 'RUB',
        checkIn: '2025-09-27',
        checkOut: '2025-10-02',
        managerComment: 'Обязательный сервисный сбор на месте: 224 $ / 19 593 ₽',
      },
    ],

    carRentals: [
      {
        name: 'Аренда автомобиля',
        startLocation: '5 октября — Орландо',
        endLocation: '15 октября — Майами',
        vehicles: [
          { vehicle: 'Nissan Rogue 2025', name: 'SUV — комфортный', price: 136755, currency: 'RUB' },
          { vehicle: 'Jeep Rubicon 2025', name: 'SUV — премиум', price: 188628, currency: 'RUB' },
        ],
        managerComment: 'Включено 250 миль в сутки и платные дороги · Страховка включена',
      },
    ],
    cruises: [
      {
        name: 'Icon of the Seas — New Ship 2024',
        gallery: [
          { url: '/images/examples/cruise_1.jpeg',},
          { url: '/images/examples/cruise_4.jpg',},
        ],
        managerComment:
            '18 октября — 25 октября 2025 · 7 ночей · Royal Caribbean · 5★ · Майами — Карибы — Майами',
        cabin: {
            description:
                'Каюта с балконом и видом на море · Тариф "Фортуна" · Питание "Всё включено" без алкоголя',
            price: 306774,
            currency: 'RUB',
          },
      },
    ],
    excursions: [
      {
        date: new Date('2025-10-01'),
        city: 'Нью-Йорк',
        price: 12900,
        currency: 'RUB',
        name: 'Обзорная экскурсия по Манхэттену',
        managerComment:
            'Обзорная экскурсия по Манхэттену: Статуя Свободы, Таймс-сквер, Центральный парк. ~8 часов · Гид на русском',
        gallery: [
          { url: '/images/examples/exc_1.jpeg',},
          { url: '/images/examples/exc_3.jpg',},
        ],
      },
      {
        date: new Date('2025-10-07'),
        city: 'Орландо',
        price: 34200,
        currency: 'RUB',
        name: 'Walt Disney World',
        managerComment:
            'Однодневный визит в Walt Disney World — Magic Kingdom и EPCOT. Park Hopper билеты.',
        gallery: [
          { url: '/images/examples/exc_5.jpeg',},
          { url: '/images/examples/exc_6.jpeg',},
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-09-27T23:15:00',
        category: 'taxi',
        pickupLocation: 'Аэропорт JFK — Терминал 1',
        dropoffLocation: 'The Fifty Sonesta Hotel, Мидтаун Манхэттен',
        duration: 55,
        price: 6800,
        currency: 'RUB',
        managerComment: 'Встреча по табличке · оплата водителю · ориентировочно 80 $',
      },
      {
        datetime: '2025-10-02T11:30:00',
        category: 'transfer',
        pickupLocation: 'The Fifty Sonesta Hotel, Нью-Йорк',
        dropoffLocation: 'Ньюарк Либерти Интернэшнл (EWR)',
        duration: 50,
        price: 7500,
        currency: 'RUB',
        managerComment: 'Трансфер в аэропорт · минивэн на 2 персоны с багажом',
      },
    ],
    additionalServices: [
      {
        name: 'Страховка туристическая',
        price: 18600,
        currency: 'RUB',
        managerComment:
            'Комплексная страховка для двух человек · Покрытие: медицина до $100 000, отмена поездки',
      },
      {
        name: 'SIM-карта США (T-Mobile)',
        price: 4300,
        currency: 'RUB',
        managerComment: 'Безлимитный интернет и звонки по всей территории США на 30 дней · 2 SIM-карты',
      },
    ],
  },
]

// ─── localStorage-персист (фолбэк, пока нет реального бэкенда) ───────────────
const STORAGE_KEY = 'tourismania:offers'

function readPersistedOffers(): Offer[] | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Offer[]) : null
  } catch (e) {
    console.error('[offer-store] failed to read offers from localStorage', e)
    return null
  }
}

function writePersistedOffers(offers: Offer[]): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers))
  } catch (e) {
    console.error('[offer-store] failed to persist offers to localStorage', e)
  }
}

/**
 * Возвращает список из localStorage; при первом запуске сидим mock-данными,
 * чтобы пользователь видел пример, но дальше данные живут только в storage.
 */
function ensureSeededOffers(): Offer[] {
  const existing = readPersistedOffers()
  if (existing !== null) return existing
  const seeded: Offer[] = JSON.parse(JSON.stringify(MOCK_OFFERS))
  writePersistedOffers(seeded)
  return seeded
}

function newOfferId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'offer-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

export const useOfferStore = defineStore('offer', {
  state: () => ({
    offers: [] as Offer[],
    currentOffer: null as Offer | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    offerById: (state) => (id: string) => state.offers.find((t) => t.id === id) ?? null,
    offersCount: (state) => state.offers.length,
  },

  actions: {
    async loadOffers() {
      this.loading = true
      this.error = null
      try {
        this.offers = await OfferApi.getAll()
      } catch {
        // API недоступен — берём данные из localStorage (или сидим mock'ом при первом запуске)
        this.offers = ensureSeededOffers()
      } finally {
        this.loading = false
      }
    },

    async loadOfferById(id: string) {
      this.loading = true
      this.error = null
      try {
        this.currentOffer = await OfferApi.getById(id)
      } catch {
        // Сначала ищем в локально сохранённых, потом — в дефолтном mock
        const local = readPersistedOffers() ?? MOCK_OFFERS
        this.currentOffer = local.find((o) => o.id === id) ?? null
        if (!this.currentOffer) {
          this.error = 'Оффер не найден'
        }
      } finally {
        this.loading = false
      }
    },

    async createOffer(data: Partial<Offer>): Promise<Offer | null> {
      this.loading = true
      this.error = null
      try {
        const created = await OfferApi.create(data)
        // Синхронизируем localStorage, чтобы offline-копия не разошлась
        const persisted = readPersistedOffers() ?? []
        writePersistedOffers([...persisted, created])
        this.offers.push(created)
        return created
      } catch {
        // Локальное создание: генерим id + createdAt и пишем в localStorage
        const created: Offer = {
          ...(data as Offer),
          id: data.id ?? newOfferId(),
          createdAt: data.createdAt ?? new Date().toISOString(),
        }
        const persisted = readPersistedOffers() ?? ensureSeededOffers()
        const next = [...persisted, created]
        writePersistedOffers(next)
        this.offers = next
        return created
      } finally {
        this.loading = false
      }
    },

    async updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
      this.loading = true
      this.error = null
      try {
        const updated = await OfferApi.update(id, data)
        const persisted = readPersistedOffers() ?? this.offers
        const next = persisted.map((o) => (o.id === id ? updated : o))
        writePersistedOffers(next)
        const idx = this.offers.findIndex((o) => o.id === id)
        if (idx !== -1) this.offers[idx] = updated
        if (this.currentOffer?.id === id) this.currentOffer = updated
        return updated
      } catch {
        // Локальное обновление
        const persisted = readPersistedOffers() ?? ensureSeededOffers()
        const idx = persisted.findIndex((o) => o.id === id)
        if (idx === -1) {
          this.error = 'Оффер не найден'
          return null
        }
        const updated: Offer = { ...persisted[idx], ...(data as Offer), id }
        persisted[idx] = updated
        writePersistedOffers(persisted)
        this.offers = [...persisted]
        if (this.currentOffer?.id === id) this.currentOffer = updated
        return updated
      } finally {
        this.loading = false
      }
    },

    async deleteOffer(id: string): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        await OfferApi.delete(id)
        const persisted = readPersistedOffers() ?? this.offers
        const next = persisted.filter((o) => o.id !== id)
        writePersistedOffers(next)
        this.offers = next
        if (this.currentOffer?.id === id) this.currentOffer = null
        return true
      } catch {
        // Локальное удаление (API недоступен)
        const persisted = readPersistedOffers() ?? ensureSeededOffers()
        const next = persisted.filter((o) => o.id !== id)
        writePersistedOffers(next)
        this.offers = next
        if (this.currentOffer?.id === id) this.currentOffer = null
        return true
      } finally {
        this.loading = false
      }
    },

    clearCurrentOffer() {
      this.currentOffer = null
      this.error = null
    },
  },
})

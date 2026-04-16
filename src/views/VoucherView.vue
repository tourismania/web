<script setup lang="ts">
import { computed } from 'vue'
import type { Tour } from '@/api/types/voucher'
import FlightCard from '@/components/voucher/FlightCard.vue'
import HotelCard from '@/components/voucher/HotelCard.vue'
import CarRentalCard from '@/components/voucher/CarRentalCard.vue'
import CruiseCard from '@/components/voucher/CruiseCard.vue'
import ExcursionCard from '@/components/voucher/ExcursionCard.vue'
import TransportCard from '@/components/voucher/TransportCard.vue'

// ---------------------------------------------------------------------------
// Данные тура "Путешествие по США" — Нью-Йорк, Орландо, Майами + круиз
// Источник: корпоративное предложение от менеджера
// ---------------------------------------------------------------------------
const tour: Tour = {
  title: 'Путешествие по США',
  startDate: '2025-09-26',
  endDate: '2025-10-28',
  welcomeText:
    'Уважаемые Сергей и Анастасия, рада предложить для вас расчёт по маршруту в США: ' +
    'Нью-Йорк, Орландо, Майами + круиз. ' +
    '* Стоимость в рублях актуальна на день получения предложения и зависит от курса доллара. ' +
    'Стоимость и наличие не гарантируются до момента бронирования. ' +
    'При изменении дат бронирования стоимость может меняться.',

  // ── Перелёты ─────────────────────────────────────────────────────────────
  // Группа 1: Екатеринбург ↔ Стамбул = 129 692 ₽ (перелёт туда и обратно)
  // Группа 2: Стамбул → Нью-Йорк + Майами → Стамбул = 272 691 ₽
  // Группа 3: Нью-Йорк → Орландо = 42 273 ₽
  flights: [
    {
      airline: 'Ural Airlines',
      managerComment: 'Группа 1 (туда-обратно): 129 692 ₽ · U6-773 / Airbus A319 · багаж 23 KG',
      departure: {
        city: 'Екатеринбург',
        dateTime: '2025-09-26T07:20:00',
        flight: 'U6-773',
        airport: 'Кольцово',
        airportCode: 'SVX',
        hasLayovers: false,
        flightClass: 'economy',
        price: 129692,
        currency: 'RUB',
      },
      arrival: {
        city: 'Стамбул',
        dateTime: '2025-09-26T10:45:00',
        flight: 'U6-773',
        airport: 'Istanbul Airport',
        airportCode: 'IST',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
    },
    {
      airline: 'Ural Airlines',
      managerComment: 'Обратный рейс · U6-814 / Airbus A319 · багаж 23 KG',
      departure: {
        city: 'Стамбул',
        dateTime: '2025-10-28T20:15:00',
        flight: 'U6-814',
        airport: 'Istanbul Airport',
        airportCode: 'IST',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
      arrival: {
        city: 'Екатеринбург',
        dateTime: '2025-10-29T03:15:00',
        flight: 'U6-814',
        airport: 'Кольцово',
        airportCode: 'SVX',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
    },
    {
      airline: 'Turkish Airlines',
      managerComment: 'Группа 2 (туда-обратно): 272 691 ₽ · TK-11 / Boeing 777-300ER · 10ч 55м · без багажа',
      departure: {
        city: 'Стамбул',
        dateTime: '2025-09-27T18:45:00',
        flight: 'TK-11',
        airport: 'Istanbul Airport',
        airportCode: 'IST',
        hasLayovers: false,
        flightClass: 'economy',
        price: 272691,
        currency: 'RUB',
      },
      arrival: {
        city: 'Нью-Йорк',
        dateTime: '2025-09-27T22:40:00',
        flight: 'TK-11',
        airport: 'Джон Ф. Кеннеди',
        airportCode: 'JFK',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
    },
    {
      airline: 'Turkish Airlines',
      managerComment: 'Обратный рейс · TK-78 / Boeing 777-300ER · 11ч 35м · без багажа',
      departure: {
        city: 'Майами',
        dateTime: '2025-10-26T23:30:00',
        flight: 'TK-78',
        airport: 'Майами Интернешнл',
        airportCode: 'MIA',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
      arrival: {
        city: 'Стамбул',
        dateTime: '2025-10-27T18:05:00',
        flight: 'TK-78',
        airport: 'Istanbul Airport',
        airportCode: 'IST',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
    },
    {
      airline: 'Spirit Airlines',
      managerComment: 'NK-2819 · 18 KG багаж · Внимание: регистрация на рейс платная',
      departure: {
        city: 'Нью-Йорк',
        dateTime: '2025-10-02T14:00:00',
        flight: 'NK-2819',
        airport: 'Ньюарк Либерти Интернешнл',
        airportCode: 'EWR',
        hasLayovers: false,
        flightClass: 'economy',
        price: 42273,
        currency: 'RUB',
      },
      arrival: {
        city: 'Орландо',
        dateTime: '2025-10-02T16:49:00',
        flight: 'NK-2819',
        airport: 'Орландо Интернэшнл',
        airportCode: 'MCO',
        hasLayovers: false,
        flightClass: 'economy',
        price: 0,
        currency: 'RUB',
      },
    },
  ],
  totalFlightsCost: 444656,
  flightsCurrency: 'RUB',

  // ── Отели ─────────────────────────────────────────────────────────────────
  hotels: [
    {
      name: 'The Haze Karaköy',
      stars: 4,
      address: 'Karaköy, Istanbul, Турция',
      description:
        'Бутик-отель в историческом здании рядом с Галатской башней и набережной. ' +
        'Современный дизайн, уютные номера, вкусные завтраки. ' +
        'В пешей доступности кафе, рестораны, магазины.',
      roomType: 'Superior Room',
      occupancyType: 'Breakfast buffet',
      price: 17264,
      currency: 'RUB',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format',
          alt: 'The Haze Karaköy — фасад',
        },
        {
          url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format',
          alt: 'The Haze Karaköy — номер',
        },
      ],
      serviceFee: 200,
      serviceFeeCurrency: 'USD',
      checkIn: '2025-09-26',
      checkOut: '2025-09-27',
      nights: 1,
      managerComment: 'Breakfast buffet = 200 USD / 17 264 ₽',
    },
    {
      name: 'The Fifty Sonesta Hotel New York',
      stars: 4,
      address: '155 East 50th Street, New York, NY 10022',
      description:
        'Стильный бутик-отель в Мидтауне. Самый тихий и спокойный район из возможных. ' +
        'Находится посередине Манхэттена, удобно добираться до любой точки, ' +
        'рядом метро, кафе, рестораны.',
      roomType: 'Studio, 2 Queen Beds',
      occupancyType: 'RO — без питания',
      price: 254709,
      currency: 'RUB',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format',
          alt: 'The Fifty Sonesta Hotel — интерьер',
        },
        {
          url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format',
          alt: 'The Fifty Sonesta Hotel — номер',
        },
      ],
      serviceFee: 19593,
      serviceFeeCurrency: 'RUB',
      checkIn: '2025-09-27',
      checkOut: '2025-10-02',
      nights: 5,
      managerComment: 'Обязательный сервисный сбор на месте: 224 $ / 19 593 ₽',
    },
    {
      name: 'Таунхаус Storey Lake Resort (AirBnb)',
      stars: 0,
      address: 'Storey Lake Resort, Kissimmee (Орландо), Florida',
      description:
        'Таунхаус: 4 спальни, 3 ванные, кухня-гостиная, Wi-Fi, парковка, частный бассейн. ' +
        'Курорт с аквапарком, бассейны с подогревом. ' +
        'До Disney 15 минут. Бесплатный курортный аквапарк.',
      roomType: 'Таунхаус целиком',
      occupancyType: 'Самостоятельное приготовление',
      price: 156957,
      currency: 'RUB',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format',
          alt: 'Storey Lake — вилла с бассейном',
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format',
          alt: 'Storey Lake — гостиная',
        },
      ],
      serviceFee: 0,
      checkIn: '2025-10-02',
      checkOut: '2025-10-12',
      nights: 10,
      managerComment: 'Вариант №3 · 1 830,62 $ / 156 957 ₽',
    },
    {
      name: 'Trump International Beach Resort Miami',
      stars: 5,
      address: 'Sunny Isles Beach, Miami, Florida',
      description:
        'Роскошный пляжный курорт на первой линии океана с бассейнами, спа и фитнес-центром. ' +
        'Рядом кафе, рестораны и магазины. До Майами-Бич 20 минут на машине.',
      roomType: 'Deluxe Studio Bay View (2 queen beds)',
      occupancyType: 'RO — без питания',
      price: 190257,
      currency: 'RUB',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format',
          alt: 'Trump Resort Miami — курорт',
        },
        {
          url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format',
          alt: 'Trump Resort Miami — бассейн и океан',
        },
      ],
      serviceFee: 30518,
      serviceFeeCurrency: 'RUB',
      checkIn: '2025-10-12',
      checkOut: '2025-10-18',
      nights: 6,
      managerComment:
        'Период 1 (15–18 окт): 1 893 $ / 162 305 ₽ · Период 2 (25–28 окт): 326 $ / 27 952 ₽ · ' +
        'Обязательный курортный сбор: 305,10 $ / 26 159 ₽ + 50,85 $ / 4 359 ₽',
    },
    {
      name: 'Heaven Inn Airport Hotel',
      stars: 3,
      address: 'Istanbul, рядом с аэропортом IST',
      description:
        'Удобный отель у аэропорта Стамбула для ночёвки перед вылетом. ' +
        'Оплата на месте при заселении.',
      roomType: 'Стандартный двухместный',
      occupancyType: 'BB — завтрак включён',
      price: 4140,
      currency: 'RUB',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format',
          alt: 'Heaven Inn — номер',
        },
      ],
      serviceFee: 0,
      checkIn: '2025-10-27',
      checkOut: '2025-10-28',
      nights: 1,
      managerComment: 'Оплата на месте · 4 140 ₽',
    },
  ],
  totalHotelsCost: 623327,
  hotelsCurrency: 'RUB',

  // ── Аренда авто ───────────────────────────────────────────────────────────
  carRentals: [
    {
      name: 'Аренда автомобиля',
      startLocation: '5 октября — Орландо (аэропорт/отель)',
      endLocation: '15 октября — Майами (отель)',
      vehicles: [
        {
          vehicle: 'Nissan Rogue 2025',
          name: 'SUV — комфортный',
          price: 136755,
          currency: 'RUB',
        },
        {
          vehicle: 'Jeep Rubicon 2025',
          name: 'SUV — премиум',
          price: 188628,
          currency: 'RUB',
        },
      ],
      managerComment:
        'Включено 250 миль в сутки и платные дороги · ' +
        'Страховка включена, франшиза $1 500 · Депозит $300',
    },
  ],

  // ── Круизы ────────────────────────────────────────────────────────────────
  cruises: [
    {
      name: 'Icon of the Seas — New Ship 2024',
      gallery: [
        'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&auto=format',
        'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&auto=format',
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format',
      ],
      managerComment:
        '18 октября — 25 октября 2025 · 7 ночей · Royal Caribbean · 5★ · ' +
        'Маршрут: Майами — Карибы — Майами',
      cabins: [
        {
          description:
            'Каюта с балконом и видом на море · Тариф "Фортуна" (номер каюты и вид определяет круизная компания) · Питание "Всё включено" без алкоголя',
          price: 306774,
          currency: 'RUB',
        },
      ],
    },
  ],

  // ── Экскурсии ─────────────────────────────────────────────────────────────
  excursions: [
    {
      date: new Date('2025-10-01'),
      city: 'Нью-Йорк',
      price: 12900,
      currency: 'RUB',
      managerComment:
        'Обзорная экскурсия по Манхэттену: Статуя Свободы (прогулка на пароме), ' +
        'Таймс-сквер, Центральный парк, Бруклинский мост, Рокфеллер-центр. ' +
        'Продолжительность: ~8 часов · Гид на русском · Трансфер включён',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&auto=format',
          alt: 'Нью-Йорк — Статуя Свободы',
        },
        {
          url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format',
          alt: 'Нью-Йорк — Центральный парк',
        },
        {
          url: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&auto=format',
          alt: 'Нью-Йорк — Бруклинский мост',
        },
      ],
    },
    {
      date: new Date('2025-10-07'),
      city: 'Орландо',
      price: 34200,
      currency: 'RUB',
      managerComment:
        'Однодневный визит в Walt Disney World — Magic Kingdom и EPCOT. ' +
        'Включено: Park Hopper билеты (2 парка), Fast Pass для 3 аттракционов, ' +
        'трансфер от отеля Storey Lake. Продолжительность: ~12 часов · без гида',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1594570085498-bcf7fc05ce7f?w=800&auto=format',
          alt: 'Орландо — Walt Disney World',
        },
        {
          url: 'https://images.unsplash.com/photo-1541300613939-71366aba2416?w=800&auto=format',
          alt: 'Орландо — тематический парк',
        },
      ],
    },
    {
      date: new Date('2025-10-11'),
      city: 'Орландо — Лос-Анджелес',
      price: 18500,
      currency: 'RUB',
      managerComment:
        'Экскурсия на Universal Studios Hollywood: прогулка по Голливуду, ' +
        'студийный тур Universal, тематические зоны Гарри Поттера и Jurassic World. ' +
        'Билеты Studio Tour (Express Pass) включены · Гид на русском · ~10 часов',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1576613109753-27804de2cba8?w=800&auto=format',
          alt: 'Голливуд — Universal Studios',
        },
        {
          url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format',
          alt: 'Голливуд — знак Hollywood',
        },
      ],
    },
  ],

  // ── Общественный транспорт ───────────────────────────────────────────────────
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
      datetime: '2025-10-01T09:00:00',
      category: 'bus',
      pickupLocation: 'The Fifty Sonesta Hotel, Нью-Йорк',
      dropoffLocation: 'Статуя Свободы — паром Battery Park',
      duration: 40,
      price: 3200,
      currency: 'RUB',
      managerComment: 'Групповой автобус экскурсионной программы · гид сопровождает',
    },
    {
      datetime: '2025-10-02T11:30:00',
      category: 'transfer',
      pickupLocation: 'The Fifty Sonesta Hotel, Нью-Йорк',
      dropoffLocation: 'Ньюарк Либерти Интернэшнл (EWR)',
      duration: 50,
      price: 7500,
      currency: 'RUB',
      managerComment: 'Трансфер в аэропорт · минивэн на 2 персоны с багажом · предоплата онлайн',
    },
    {
      datetime: '2025-10-18T14:00:00',
      category: 'transfer',
      pickupLocation: 'Trump International Beach Resort Miami',
      dropoffLocation: 'Порт Майами — причал Royal Caribbean',
      duration: 30,
      price: 4200,
      currency: 'RUB',
      managerComment: 'Трансфер на посадку на круизный лайнер Icon of the Seas',
    },
  ],
}

// ── Итоги ────────────────────────────────────────────────────────────────────
const carRentalMin = computed(() =>
  tour.carRentals.reduce((sum, cr) => {
    const minVehicle = Math.min(...cr.vehicles.map((v) => v.price))
    return sum + minVehicle
  }, 0),
)

const cruiseTotal = computed(() =>
  tour.cruises.reduce(
    (sum, cr) => sum + cr.cabins.reduce((s, c) => s + c.price, 0),
    0,
  ),
)

const excursionTotal = computed(() =>
  tour.excursions.reduce((sum, ex) => sum + ex.price, 0),
)

const transportTotal = computed(() =>
  tour.transport.reduce((sum, t) => sum + t.price, 0),
)

const grandTotal = computed(
  () =>
    tour.totalFlightsCost +
    tour.totalHotelsCost +
    carRentalMin.value +
    cruiseTotal.value +
    excursionTotal.value +
    transportTotal.value,
)

function fmt(price: number, currency: string = 'RUB'): string {
  const sym: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', TRY: '₺' }
  return `${price.toLocaleString('ru-RU')} ${sym[currency] ?? currency}`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="voucher">

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="voucher__hero">
      <!-- Decorative world-map SVG dots pattern -->
      <div class="voucher__hero-pattern" aria-hidden="true">
        <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <!-- Stylized continents as dot-clusters -->
          <g fill="rgba(54,170,184,0.18)" stroke="none">
            <!-- North America -->
            <circle cx="120" cy="90" r="2.5"/><circle cx="140" cy="80" r="2"/><circle cx="160" cy="88" r="2.5"/>
            <circle cx="130" cy="105" r="2"/><circle cx="150" cy="100" r="2.5"/><circle cx="170" cy="95" r="2"/>
            <circle cx="110" cy="115" r="2"/><circle cx="140" cy="118" r="2.5"/><circle cx="165" cy="112" r="2"/>
            <circle cx="125" cy="130" r="2"/><circle cx="148" cy="135" r="2.5"/>
            <!-- Europe -->
            <circle cx="360" cy="70" r="2"/><circle cx="375" cy="65" r="2.5"/><circle cx="390" cy="72" r="2"/>
            <circle cx="368" cy="82" r="2.5"/><circle cx="382" cy="78" r="2"/><circle cx="398" cy="68" r="2"/>
            <!-- Africa -->
            <circle cx="372" cy="130" r="2.5"/><circle cx="388" cy="125" r="2"/><circle cx="365" cy="148" r="2"/>
            <circle cx="382" cy="145" r="2.5"/><circle cx="395" cy="138" r="2"/>
            <!-- Asia -->
            <circle cx="520" cy="75" r="2.5"/><circle cx="545" cy="68" r="2"/><circle cx="565" cy="80" r="2.5"/>
            <circle cx="535" cy="88" r="2"/><circle cx="558" cy="92" r="2.5"/><circle cx="580" cy="78" r="2"/>
            <circle cx="510" cy="100" r="2"/><circle cx="548" cy="105" r="2.5"/><circle cx="572" cy="108" r="2"/>
            <!-- Australia -->
            <circle cx="620" cy="170" r="2.5"/><circle cx="638" cy="165" r="2"/><circle cx="630" cy="182" r="2.5"/>
            <circle cx="648" cy="178" r="2"/><circle cx="618" cy="188" r="2"/>
            <!-- South America -->
            <circle cx="200" cy="165" r="2.5"/><circle cx="215" cy="172" r="2"/><circle cx="208" cy="188" r="2.5"/>
            <circle cx="222" cy="182" r="2"/><circle cx="198" cy="200" r="2"/>
          </g>
          <!-- Flight path line SVX → IST → JFK -->
          <path
            d="M 155 100 Q 370 40 400 72 Q 430 105 260 160"
            fill="none"
            stroke="rgba(54,170,184,0.25)"
            stroke-width="1"
            stroke-dasharray="4 3"
          />
          <!-- Flight path JFK → MCO -->
          <path
            d="M 260 160 Q 250 195 245 200"
            fill="none"
            stroke="rgba(239,159,59,0.2)"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <!-- Plane icons -->
          <text x="268" y="118" font-size="10" fill="rgba(54,170,184,0.5)" transform="rotate(-30 268 118)">✈</text>
          <text x="246" y="175" font-size="8" fill="rgba(239,159,59,0.4)" transform="rotate(10 246 175)">✈</text>
        </svg>
      </div>

      <div class="voucher__hero-content">
        <div class="voucher__hero-label">Корпоративное туристическое предложение</div>
        <h1 class="voucher__hero-title">{{ tour.title }}</h1>
        <div class="voucher__hero-dates">
          <v-icon icon="mdi-calendar-range" size="18" class="mr-2" />
          {{ fmtDate(tour.startDate) }} — {{ fmtDate(tour.endDate) }}
        </div>
        <p class="voucher__hero-disclaimer">{{ tour.welcomeText }}</p>

        <!-- Quick stats -->
        <div class="voucher__hero-stats">
          <div class="voucher__hero-stat">
            <span class="stat-num">{{ tour.flights.length }}</span>
            <span class="stat-label">перелётов</span>
          </div>
          <div class="voucher__hero-stat-divider" />
          <div class="voucher__hero-stat">
            <span class="stat-num">{{ tour.hotels.length }}</span>
            <span class="stat-label">отелей</span>
          </div>
          <div class="voucher__hero-stat-divider" />
          <div class="voucher__hero-stat">
            <span class="stat-num">{{ tour.cruises.length }}</span>
            <span class="stat-label">круиз</span>
          </div>
          <div class="voucher__hero-stat-divider" />
          <div class="voucher__hero-stat">
            <span class="stat-num">{{ tour.excursions.length }}</span>
            <span class="stat-label">экскурсии</span>
          </div>
          <div class="voucher__hero-stat-divider" />
          <div class="voucher__hero-stat">
            <span class="stat-num">{{ tour.transport.length }}</span>
            <span class="stat-label">транспорт</span>
          </div>
          <div class="voucher__hero-stat-divider" />
          <div class="voucher__hero-stat">
            <span class="stat-num">32</span>
            <span class="stat-label">дня</span>
          </div>
        </div>
      </div>
    </section>

    <div class="voucher__body">

      <!-- ── Перелёты ────────────────────────────────────────────────────── -->
      <section class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-airplane" />
          </div>
          <div>
            <h2 class="voucher__section-title">Перелёты</h2>
            <div class="voucher__section-count">{{ tour.flights.length }} рейсов в маршруте</div>
          </div>
          <div class="voucher__section-total">{{ fmt(tour.totalFlightsCost) }}</div>
        </div>
        <div class="voucher__cards">
          <FlightCard
            v-for="(flight, i) in tour.flights"
            :key="i"
            :flight="flight"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Отели ───────────────────────────────────────────────────────── -->
      <section class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-bed-outline" />
          </div>
          <div>
            <h2 class="voucher__section-title">Отели и жильё</h2>
            <div class="voucher__section-count">{{ tour.hotels.length }} объекта размещения</div>
          </div>
          <div class="voucher__section-total">{{ fmt(tour.totalHotelsCost) }}</div>
        </div>
        <div class="voucher__cards voucher__cards--grid">
          <HotelCard
            v-for="(hotel, i) in tour.hotels"
            :key="i"
            :hotel="hotel"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Аренда авто ─────────────────────────────────────────────────── -->
      <section v-if="tour.carRentals.length > 0" class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-car-outline" />
          </div>
          <div>
            <h2 class="voucher__section-title">Аренда автомобилей</h2>
            <div class="voucher__section-count">Орландо → Майами · 10 дней</div>
          </div>
          <div class="voucher__section-total">от {{ fmt(carRentalMin) }}</div>
        </div>
        <div class="voucher__cards">
          <CarRentalCard
            v-for="(car, i) in tour.carRentals"
            :key="i"
            :car-rental="car"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Круизы ──────────────────────────────────────────────────────── -->
      <section v-if="tour.cruises.length > 0" class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-ferry" />
          </div>
          <div>
            <h2 class="voucher__section-title">Круиз</h2>
            <div class="voucher__section-count">18–25 октября · 7 ночей · Карибы</div>
          </div>
          <div class="voucher__section-total">{{ fmt(cruiseTotal) }}</div>
        </div>
        <div class="voucher__cards voucher__cards--grid">
          <CruiseCard
            v-for="(cruise, i) in tour.cruises"
            :key="i"
            :cruise="cruise"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Экскурсии ─────────────────────────────────────────────────────── -->
      <section v-if="tour.excursions.length > 0" class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-binoculars" />
          </div>
          <div>
            <h2 class="voucher__section-title">Экскурсии</h2>
            <div class="voucher__section-count">{{ tour.excursions.length }} экскурсии в маршруте</div>
          </div>
          <div class="voucher__section-total">{{ fmt(excursionTotal) }}</div>
        </div>
        <div class="voucher__cards voucher__cards--grid">
          <ExcursionCard
            v-for="(excursion, i) in tour.excursions"
            :key="i"
            :excursion="excursion"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Транспорт ───────────────────────────────────────────────────────── -->
      <section v-if="tour.transport.length > 0" class="voucher__section">
        <div class="voucher__section-header">
          <div class="voucher__section-icon">
            <v-icon icon="mdi-bus-clock" />
          </div>
          <div>
            <h2 class="voucher__section-title">Транспорт</h2>
            <div class="voucher__section-count">{{ tour.transport.length }} поездки в маршруте</div>
          </div>
          <div class="voucher__section-total">{{ fmt(transportTotal) }}</div>
        </div>
        <div class="voucher__cards">
          <TransportCard
            v-for="(item, i) in tour.transport"
            :key="i"
            :transport="item"
            :index="i"
          />
        </div>
      </section>

      <!-- ── Итог ────────────────────────────────────────────────────────── -->
      <section class="voucher__summary">
        <div class="voucher__summary-title">Итоговая стоимость</div>
        <div class="voucher__summary-rows">
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-airplane" size="16" class="mr-2" />Перелёты (5 рейсов)</span>
            <span>{{ fmt(tour.totalFlightsCost) }}</span>
          </div>
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-bed-outline" size="16" class="mr-2" />Отели и жильё (5 объектов)</span>
            <span>{{ fmt(tour.totalHotelsCost) }}</span>
          </div>
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-car-outline" size="16" class="mr-2" />Аренда авто (от Nissan Rogue)</span>
            <span>{{ fmt(carRentalMin) }}</span>
          </div>
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-ferry" size="16" class="mr-2" />Круиз Icon of the Seas</span>
            <span>{{ fmt(cruiseTotal) }}</span>
          </div>
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-binoculars" size="16" class="mr-2" />Экскурсии ({{ tour.excursions.length }})</span>
            <span>{{ fmt(excursionTotal) }}</span>
          </div>
          <div class="voucher__summary-row">
            <span><v-icon icon="mdi-bus-clock" size="16" class="mr-2" />Транспорт ({{ tour.transport.length }} поездки)</span>
            <span>{{ fmt(transportTotal) }}</span>
          </div>
        </div>
        <div class="voucher__summary-total">
          <span>Итого (от)</span>
          <span>{{ fmt(grandTotal) }}</span>
        </div>
        <div class="voucher__summary-note">
          * Курс USD актуален на день получения предложения · 1 USD ≈ 85,74 ₽
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.voucher {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

// ── Hero ─────────────────────────────────────────────────────────────────────
.voucher__hero {
  position: relative;
  padding: 72px 24px 56px;
  overflow: hidden;
  text-align: center;
  // Unique layered gradient — different from main app background
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(54, 170, 184, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 80% 60%, rgba(239, 159, 59, 0.06) 0%, transparent 60%),
    linear-gradient(160deg, #002724 0%, #001d1b 45%, #00201e 100%);

  // Top accent border
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, variables.$color-blue, variables.$color-yellow, variables.$color-blue, transparent);
  }

  &-pattern {
    position: absolute;
    inset: 0;
    pointer-events: none;
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-content {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
  }

  &-label {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: variables.$color-blue;
    border: 1px solid rgba(54, 170, 184, 0.35);
    border-radius: 20px;
    padding: 5px 18px;
    margin-bottom: 22px;
  }

  &-title {
    font-size: clamp(30px, 6vw, 52px);
    font-weight: 800;
    color: #fff;
    line-height: 1.08;
    margin-bottom: 14px;
    letter-spacing: -1px;
  }

  &-dates {
    font-size: 16px;
    color: variables.$color-yellow;
    font-weight: 600;
    margin-bottom: 20px;
    display: inline-flex;
    align-items: center;
    background: rgba(239, 159, 59, 0.08);
    border: 1px solid rgba(239, 159, 59, 0.2);
    border-radius: 24px;
    padding: 6px 18px;
  }

  &-disclaimer {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.38);
    max-width: 580px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  &-stats {
    display: inline-flex;
    align-items: center;
    gap: 0;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(54, 170, 184, 0.2);
    border-radius: 16px;
    padding: 16px 28px;
    gap: 24px;
  }

  &-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;

    .stat-num {
      font-size: 24px;
      font-weight: 800;
      color: variables.$color-blue;
      line-height: 1;
    }

    .stat-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &-stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
  }
}

// ── Body ─────────────────────────────────────────────────────────────────────
.voucher__body {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

// ── Section ──────────────────────────────────────────────────────────────────
.voucher__section {
  &-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(54, 170, 184, 0.12);
  }

  &-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-blue;
    flex-shrink: 0;
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  &-count {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 2px;
  }

  &-total {
    margin-left: auto;
    font-size: 18px;
    font-weight: 700;
    color: variables.$color-yellow;
  }
}

// ── Cards ─────────────────────────────────────────────────────────────────────
.voucher__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &--grid {
    @media (min-width: 660px) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
    }
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
.voucher__summary {
  background: rgba(0, 15, 14, 0.8);
  border: 1px solid rgba(54, 170, 184, 0.3);
  border-radius: 20px;
  padding: 28px 32px;

  &-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 20px;
  }

  &-rows {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 20px;
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child { border-bottom: none; }

    span:first-child {
      display: flex;
      align-items: center;
    }
  }

  &-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba(54, 170, 184, 0.25);
    margin-bottom: 12px;

    span:first-child {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    span:last-child {
      font-size: 30px;
      font-weight: 800;
      color: variables.$color-yellow;
      letter-spacing: -1px;
    }
  }

  &-note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.25);
  }
}
</style>

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
        airline: 'Turkish Airlines',
        managerComment:
          'Группа 2 (туда-обратно): 272 691 ₽ · TK-11 / Boeing 777-300ER · 10ч 55м · без багажа',
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
        images: [
          {
            url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format',
            alt: 'The Haze Karaköy — фасад',
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
          'Стильный бутик-отель в Мидтауне. Самый тихий и спокойный район из возможных.',
        roomType: 'Studio, 2 Queen Beds',
        roomDescription: 'Студия с двумя двуспальными кроватями, кухонным уголком.',
        occupancyType: 'RO — без питания',
        price: 254709,
        currency: 'RUB',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format',
            alt: 'The Fifty Sonesta Hotel — интерьер',
          },
        ],
        serviceFee: 19593,
        serviceFeeCurrency: 'RUB',
        checkIn: '2025-09-27',
        checkOut: '2025-10-02',
        nights: 5,
        managerComment: 'Обязательный сервисный сбор на месте: 224 $ / 19 593 ₽',
      },
    ],
    totalHotelsCost: 623327,
    hotelsCurrency: 'RUB',
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
          'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&auto=format',
          'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&auto=format',
        ],
        managerComment:
          '18 октября — 25 октября 2025 · 7 ночей · Royal Caribbean · 5★ · Майами — Карибы — Майами',
        cabins: [
          {
            description:
              'Каюта с балконом и видом на море · Тариф "Фортуна" · Питание "Всё включено" без алкоголя',
            price: 306774,
            currency: 'RUB',
          },
        ],
      },
    ],
    excursions: [
      {
        date: new Date('2025-10-01'),
        city: 'Нью-Йорк',
        price: 12900,
        currency: 'RUB',
        managerComment:
          'Обзорная экскурсия по Манхэттену: Статуя Свободы, Таймс-сквер, Центральный парк. ~8 часов · Гид на русском',
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&auto=format',
            alt: 'Нью-Йорк — Статуя Свободы',
          },
        ],
      },
      {
        date: new Date('2025-10-07'),
        city: 'Орландо',
        price: 34200,
        currency: 'RUB',
        managerComment:
          'Однодневный визит в Walt Disney World — Magic Kingdom и EPCOT. Park Hopper билеты.',
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1594570085498-bcf7fc05ce7f?w=800&auto=format',
            alt: 'Орландо — Walt Disney World',
          },
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
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    createdAt: '2025-02-03T08:00:00Z',
    clients: [],
    title: 'Тур по Японии — Токио и Киото',
    startDate: '2025-11-05',
    endDate: '2025-11-22',
    welcomeText:
      'Дорогие путешественники, представляю вам маршрут по Японии: Токио, Никко, Киото, Нара. ' +
      'Оптимальное время для посещения — сезон осенних кленов (момидзи). ' +
      'Стоимость актуальна на дату формирования предложения.',
    flights: [
      {
        airline: 'Japan Airlines',
        managerComment: 'JL-411 · Бизнес-класс · багаж 2×23 KG · питание на борту',
        departure: {
          city: 'Москва',
          dateTime: '2025-11-05T11:30:00',
          flight: 'JL-411',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'business',
          price: 398000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Токио',
          dateTime: '2025-11-06T10:25:00',
          flight: 'JL-411',
          airport: 'Нарита',
          airportCode: 'NRT',
          hasLayovers: false,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
      {
        airline: 'Japan Airlines',
        managerComment: 'JL-412 · обратный рейс · Бизнес-класс',
        departure: {
          city: 'Токио',
          dateTime: '2025-11-22T13:00:00',
          flight: 'JL-412',
          airport: 'Нарита',
          airportCode: 'NRT',
          hasLayovers: false,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
        arrival: {
          city: 'Москва',
          dateTime: '2025-11-22T18:45:00',
          flight: 'JL-412',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 398000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Shinjuku Granbell Hotel',
        stars: 4,
        address: '2-14-5 Kabukicho, Shinjuku, Tokyo',
        description: 'Дизайн-отель в самом сердце Синдзюку. Яркий интерьер, отличное расположение.',
        roomType: 'Deluxe Twin',
        roomDescription: 'Две раздельные кровати, панорамный вид на город.',
        occupancyType: 'BB',
        price: 142000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format', alt: 'Токио ночью' },
        ],
        serviceFee: 0,
        checkIn: '2025-11-06',
        checkOut: '2025-11-13',
        nights: 7,
      },
      {
        name: 'Hyatt Regency Kyoto',
        stars: 5,
        address: '644-2 Sanjusangendo-mawari, Higashiyama-ku, Kyoto',
        description: 'Роскошный отель рядом с Храмом Тысячи Будд. Японский сад, спа, традиционная кухня.',
        roomType: 'King Room Garden View',
        occupancyType: 'BB',
        price: 189000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format', alt: 'Киото' },
        ],
        serviceFee: 15000,
        serviceFeeCurrency: 'RUB',
        checkIn: '2025-11-13',
        checkOut: '2025-11-22',
        nights: 9,
        managerComment: 'Сервисный сбор включён в стоимость размещения',
      },
    ],
    totalHotelsCost: 346000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-11-08'),
        city: 'Токио',
        price: 18500,
        currency: 'RUB',
        managerComment: 'Обзорная экскурсия: Асакуса, Мейдзи, Харадзюку, Сибуя. ~9 часов. Русскоязычный гид.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format', alt: 'Асакуса' },
        ],
      },
      {
        date: new Date('2025-11-10'),
        city: 'Никко',
        price: 14200,
        currency: 'RUB',
        managerComment: 'День-поездка в Никко: святилище Тосёгу, водопад Кэгон. Трансфер включён.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format', alt: 'Никко' },
        ],
      },
      {
        date: new Date('2025-11-15'),
        city: 'Киото',
        price: 16800,
        currency: 'RUB',
        managerComment: 'Золотой павильон, Арасияма, бамбуковая роща, чайная церемония.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format', alt: 'Золотой павильон' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-11-06T11:30:00',
        category: 'transfer',
        pickupLocation: 'Аэропорт Нарита, Терминал 2',
        dropoffLocation: 'Shinjuku Granbell Hotel, Токио',
        duration: 90,
        price: 9800,
        currency: 'RUB',
        managerComment: 'Встреча по табличке, минивэн',
      },
      {
        datetime: '2025-11-13T09:00:00',
        category: 'transfer',
        pickupLocation: 'Shinjuku Granbell Hotel',
        dropoffLocation: 'Hyatt Regency Kyoto',
        duration: 140,
        price: 8500,
        currency: 'RUB',
        managerComment: 'Синкансэн Nozomi · Токио → Киото, 2ч 15м',
      },
    ],
    additionalServices: [
      {
        name: 'JR Pass (14 дней)',
        price: 58000,
        currency: 'RUB',
        managerComment: 'Неограниченный проезд на все поезда JR, включая Синкансэн',
      },
    ],
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-012345678902',
    createdAt: '2025-02-28T14:45:00Z',
    title: 'Круиз по Средиземноморью',
    clients: [],
    startDate: '2025-07-10',
    endDate: '2025-07-24',
    welcomeText:
      'Роскошный круиз по Средиземному морю с заходами в лучшие порты Европы: ' +
      'Барселона, Марсель, Генуя, Рим (Чивитавеккья), Неаполь, Валлетта (Мальта). ' +
      'Класс каюты можно обсудить индивидуально.',
    flights: [
      {
        airline: 'Аэрофлот',
        managerComment: 'SU-2130 · Эконом · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2025-07-10T07:00:00',
          flight: 'SU-2130',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'economy',
          price: 68500,
          currency: 'RUB',
        },
        arrival: {
          city: 'Барселона',
          dateTime: '2025-07-10T09:30:00',
          flight: 'SU-2130',
          airport: 'Эль-Прат',
          airportCode: 'BCN',
          hasLayovers: false,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 68500,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Hotel Arts Barcelona',
        stars: 5,
        address: 'Carrer de la Marina, 19-21, Barcelona',
        description: 'Иконический 5★ отель в башне на берегу моря. Бассейн на крыше, Michelin-ресторан.',
        roomType: 'Deluxe Sea View',
        occupancyType: 'BB',
        price: 62000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format', alt: 'Барселона' },
        ],
        serviceFee: 0,
        checkIn: '2025-07-10',
        checkOut: '2025-07-11',
        nights: 1,
      },
    ],
    totalHotelsCost: 62000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [
      {
        name: 'MSC Virtuosa — Mediterranean Grand Tour',
        gallery: [
          'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&auto=format',
          'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&auto=format',
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format',
        ],
        managerComment: '11 июля — 24 июля 2025 · 13 ночей · Барселона — Рим — Неаполь — Валлетта — Барселона',
        cabins: [
          { description: 'Балконная каюта · Тариф Classic · Всё включено', price: 248000, currency: 'RUB' },
          { description: 'Каюта Aurea Spa Suite · Приоритетная посадка · AI Premium', price: 389000, currency: 'RUB' },
        ],
      },
    ],
    excursions: [
      {
        date: new Date('2025-07-10'),
        city: 'Барселона',
        price: 11500,
        currency: 'RUB',
        managerComment: 'Пешая экскурсия по Готическому кварталу и Саграда Фамилия. 5 часов.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format', alt: 'Барселона — Саграда Фамилия' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-07-10T10:30:00',
        category: 'transfer',
        pickupLocation: 'Аэропорт Эль-Прат (BCN)',
        dropoffLocation: 'Hotel Arts Barcelona',
        duration: 30,
        price: 4200,
        currency: 'RUB',
        managerComment: 'Трансфер аэропорт → отель, такси-премиум',
      },
      {
        datetime: '2025-07-11T10:00:00',
        category: 'transfer',
        pickupLocation: 'Hotel Arts Barcelona',
        dropoffLocation: 'Порт Барселоны, Терминал C',
        duration: 20,
        price: 2500,
        currency: 'RUB',
        managerComment: 'Трансфер на посадку на круизный лайнер',
      },
    ],
    additionalServices: [
      {
        name: 'Страховка путешественника (EU)',
        price: 12800,
        currency: 'RUB',
        managerComment: 'На двух человек, покрытие €100 000, включая морские происшествия',
      },
      {
        name: 'Пакет интернета на борту MSC',
        price: 8400,
        currency: 'RUB',
        managerComment: 'Безлимитный интернет на весь круиз для 2 устройств',
      },
    ],
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-123456789003',
    createdAt: '2025-03-12T09:15:00Z',
    title: 'Дубай — золотой город',
    clients: [],
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    welcomeText:
      'Откройте для себя великолепие Дубая — города будущего на берегу Персидского залива. ' +
      'В программе: Бурдж-Халифа, пустынное сафари, шоппинг в Mall of the Emirates и Dubai Mall. ' +
      'Декабрь — лучший месяц: комфортные +28°C.',
    flights: [
      {
        airline: 'Emirates',
        managerComment: 'EK-131 · Комфорт-класс · багаж 30 KG · питание включено',
        departure: {
          city: 'Москва',
          dateTime: '2025-12-01T08:15:00',
          flight: 'EK-131',
          airport: 'Домодедово',
          airportCode: 'DME',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 112000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Дубай',
          dateTime: '2025-12-01T15:40:00',
          flight: 'EK-131',
          airport: 'Дубай Интернэшнл',
          airportCode: 'DXB',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 112000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Atlantis The Palm',
        stars: 5,
        address: 'Crescent Road, The Palm, Dubai',
        description:
          'Легендарный курортный отель на острове Пальм-Джумейра. Аквапарк Aquaventure, частный пляж, 17 ресторанов.',
        roomType: 'King Room Lagoon View',
        occupancyType: 'BB',
        price: 298000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format', alt: 'Атлантис Палм' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-01',
        checkOut: '2025-12-10',
        nights: 9,
        managerComment: 'Включён бесплатный доступ в аквапарк Aquaventure',
      },
    ],
    totalHotelsCost: 298000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-12-03'),
        city: 'Дубай',
        price: 9800,
        currency: 'RUB',
        managerComment: 'Пустынное сафари на джипах: закат, ужин в бедуинском лагере, шоу танца живота.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&auto=format', alt: 'Пустынное сафари' },
        ],
      },
      {
        date: new Date('2025-12-05'),
        city: 'Дубай',
        price: 7200,
        currency: 'RUB',
        managerComment: 'Посещение Бурдж-Халифа (уровень 124 + 125) + ужин в ресторане At.mosphere.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format', alt: 'Бурдж-Халифа' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-12-01T16:30:00',
        category: 'transfer',
        pickupLocation: 'Аэропорт DXB, Терминал 3',
        dropoffLocation: 'Atlantis The Palm',
        duration: 40,
        price: 5600,
        currency: 'RUB',
        managerComment: 'VIP-трансфер на Mercedes V-Class',
      },
    ],
    additionalServices: [
      {
        name: 'Dubai Pass (5 аттракционов)',
        price: 18500,
        currency: 'RUB',
        managerComment: 'На 2 человека: Dubai Frame, Miracle Garden, Global Village, Museum of the Future, Expo City',
      },
      {
        name: 'Страховка ОАЭ',
        price: 6400,
        currency: 'RUB',
        managerComment: 'Комплексная страховка на двух человек, медицина $50 000',
      },
    ],
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-234567890004',
    createdAt: '2025-04-01T11:00:00Z',
    title: 'Сафари в Кении',
    clients: [],
    startDate: '2026-02-15',
    endDate: '2026-02-28',
    welcomeText:
      'Уникальное сафари-приключение в сердце африканской дикой природы. ' +
      'Масаи-Мара, Амбосели у подножия Килиманджаро, озеро Найваша с фламинго. ' +
      'Февраль — сезон сухих трав, идеальная видимость для фотосафари.',
    flights: [
      {
        airline: 'Kenya Airways',
        managerComment: 'KQ-117 · Эконом · с пересадкой в Найроби · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-02-15T10:00:00',
          flight: 'KQ-117',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: true,
          flightClass: 'economy',
          price: 187000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Найроби',
          dateTime: '2026-02-15T21:30:00',
          flight: 'KQ-117',
          airport: 'Джомо Кениятта',
          airportCode: 'NBO',
          hasLayovers: true,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 187000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Angama Mara',
        stars: 5,
        address: 'Masai Mara, Kenya',
        description:
          'Роскошный лодж на краю Великой Рифтовой долины с видом на Масаи-Мара. Всё включено, сафари-джипы.',
        roomType: 'Tented Suite',
        occupancyType: 'All Inclusive',
        price: 425000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format', alt: 'Масаи-Мара' },
        ],
        serviceFee: 0,
        checkIn: '2026-02-16',
        checkOut: '2026-02-22',
        nights: 6,
        managerComment: 'Включено 2 сафари в день, все напитки и питание',
      },
      {
        name: 'Amboseli Serena Safari Lodge',
        stars: 4,
        address: 'Amboseli National Park, Kenya',
        description: 'Сафари-лодж в парке Амбосели с видом на Килиманджаро. Бассейн, рестораны, ночное сафари.',
        roomType: 'Standard Room',
        occupancyType: 'FB',
        price: 198000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format', alt: 'Амбосели' },
        ],
        serviceFee: 0,
        checkIn: '2026-02-22',
        checkOut: '2026-02-27',
        nights: 5,
      },
    ],
    totalHotelsCost: 623000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2026-02-17'),
        city: 'Масаи-Мара',
        price: 28500,
        currency: 'RUB',
        managerComment: 'Полёт на воздушном шаре над саванной на рассвете + шампанский завтрак под акацией.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=800&auto=format', alt: 'Воздушный шар' },
        ],
      },
      {
        date: new Date('2026-02-20'),
        city: 'Масаи-Мара',
        price: 14800,
        currency: 'RUB',
        managerComment: 'Визит в деревню масаев: традиционные танцы, демонстрация быта, ремёсла.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1484712401471-05c7215830eb?w=800&auto=format', alt: 'Деревня масаев' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2026-02-15T22:30:00',
        category: 'transfer',
        pickupLocation: 'Аэропорт Найроби (NBO)',
        dropoffLocation: 'Гостиница Nairobi Serena Hotel (ночёвка)',
        duration: 45,
        price: 7200,
        currency: 'RUB',
        managerComment: 'Встреча у выхода из таможни, минивэн',
      },
    ],
    additionalServices: [
      {
        name: 'Страховка — Африка / Экстрим',
        price: 22000,
        currency: 'RUB',
        managerComment: 'Расширенное покрытие для дикой природы, эвакуация вертолётом до $500 000',
      },
    ],
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-345678900005',
    createdAt: '2025-04-20T12:00:00Z',
    title: 'Париж — вечный город света',
    startDate: '2025-10-01',
    clients: [],
    endDate: '2025-10-08',
    welcomeText:
      'Классический тур в Париж: Эйфелева башня, Лувр, Версаль, романтические ужины на Сене. ' +
      'Октябрь — золотая осень, минимум туристов.',
    flights: [
      {
        airline: 'Air France',
        managerComment: 'AF-1145 · Эконом · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2025-10-01T09:30:00',
          flight: 'AF-1145',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'economy',
          price: 56000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Париж',
          dateTime: '2025-10-01T11:45:00',
          flight: 'AF-1145',
          airport: 'Шарль-де-Голль',
          airportCode: 'CDG',
          hasLayovers: false,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 56000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Hotel Le Marais Paris',
        stars: 4,
        address: '2 Rue de Bretagne, 75003 Paris',
        description: 'Бутик-отель в квартале Марэ, 5 минут пешком до Centre Pompidou.',
        roomType: 'Superior Double',
        occupancyType: 'BB',
        price: 148000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format', alt: 'Париж' },
        ],
        serviceFee: 0,
        checkIn: '2025-10-01',
        checkOut: '2025-10-08',
        nights: 7,
      },
    ],
    totalHotelsCost: 148000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-10-02'),
        city: 'Париж',
        price: 8500,
        currency: 'RUB',
        managerComment: 'Обзорная экскурсия: Нотр-Дам, Лувр, Елисейские поля. Русскоязычный гид.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format', alt: 'Эйфелева башня' },
        ],
      },
      {
        date: new Date('2025-10-04'),
        city: 'Версаль',
        price: 9200,
        currency: 'RUB',
        managerComment: 'Дворец и парк Версаля: дворцовые залы, Большой Трианон, Малый Трианон.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=800&auto=format', alt: 'Версаль' },
        ],
      },
      {
        date: new Date('2025-10-06'),
        city: 'Париж',
        price: 6800,
        currency: 'RUB',
        managerComment: 'Ужин на борту прогулочного катера по Сене с видом на Эйфелеву башню.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1499856844078-9b9da4128eb9?w=800&auto=format', alt: 'Сена ночью' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-456789000006',
    createdAt: '2025-05-05T10:30:00Z',
    title: 'Таиланд — Бангкок и острова',
    startDate: '2025-12-15',
    endDate: '2025-12-30',
    clients: [],
    welcomeText:
      'Двухнедельный тур по Таиланду: Бангкок, Чиангмай, острова Самуи. ' +
      'Декабрь — пик сезона, лучшее время для посещения.',
    flights: [
      {
        airline: 'Thai Airways',
        managerComment: 'TG-974 · Бизнес · багаж 2×32 KG · flat-bed кресло',
        departure: {
          city: 'Москва',
          dateTime: '2025-12-15T23:55:00',
          flight: 'TG-974',
          airport: 'Домодедово',
          airportCode: 'DME',
          hasLayovers: false,
          flightClass: 'business',
          price: 278000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Бангкок',
          dateTime: '2025-12-16T15:20:00',
          flight: 'TG-974',
          airport: 'Суварнабхуми',
          airportCode: 'BKK',
          hasLayovers: false,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 278000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Mandarin Oriental Bangkok',
        stars: 5,
        address: '48 Oriental Avenue, Bangkok 10500',
        description: 'Один из лучших отелей мира, основан в 1876 году. На берегу реки Чао-Прая.',
        roomType: 'Deluxe River View',
        occupancyType: 'BB',
        price: 168000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format', alt: 'Бангкок' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-16',
        checkOut: '2025-12-21',
        nights: 5,
      },
      {
        name: 'Samui Palm Beach Resort',
        stars: 4,
        address: 'Chaweng Beach, Ko Samui',
        description: 'Тропический курорт прямо на пляже Чавенг. Бассейны, спа, свежие морепродукты.',
        roomType: 'Beachfront Bungalow',
        occupancyType: 'BB',
        price: 124000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&auto=format', alt: 'Самуи' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-22',
        checkOut: '2025-12-30',
        nights: 8,
      },
    ],
    totalHotelsCost: 292000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-12-17'),
        city: 'Бангкок',
        price: 11800,
        currency: 'RUB',
        managerComment: 'Храмы Бангкока: Ват Пхо, Изумрудный Будда, Большой дворец. Лодочная прогулка.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format', alt: 'Бангкок храмы' },
        ],
      },
      {
        date: new Date('2025-12-24'),
        city: 'Самуи',
        price: 9400,
        currency: 'RUB',
        managerComment: 'Морская прогулка на яхте вокруг острова с остановкой на коралловом рифе, снорклинг.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format', alt: 'Самуи снорклинг' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-12-16T16:00:00',
        category: 'transfer',
        pickupLocation: 'Аэропорт Суварнабхуми (BKK)',
        dropoffLocation: 'Mandarin Oriental Bangkok',
        duration: 50,
        price: 5200,
        currency: 'RUB',
        managerComment: 'Трансфер на лимузине-минивэне',
      },
      {
        datetime: '2025-12-22T08:00:00',
        category: 'transfer',
        pickupLocation: 'Mandarin Oriental Bangkok',
        dropoffLocation: 'Аэропорт Самуи (USM)',
        duration: 75,
        price: 3800,
        currency: 'RUB',
        managerComment: 'Трансфер в аэропорт + внутренний перелёт Bangkok Airways включён',
      },
    ],
    additionalServices: [
      {
        name: 'SIM-карта Таиланд (30 дней)',
        price: 1800,
        currency: 'RUB',
        managerComment: 'DTAC Tourist SIM · 30 GB, безлимитные звонки внутри страны',
      },
    ],
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-567890000007',
    createdAt: '2025-05-18T14:00:00Z',
    title: 'Мальдивы — рай на земле',
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    clients: [],
    welcomeText:
      'Эксклюзивный отдых на Мальдивах: вилла над водой, приватный пляж, снорклинг прямо от ступенек. ' +
      'Январь — идеальный сезон, солнечно и безветренно.',
    flights: [
      {
        airline: 'Emirates',
        managerComment: 'EK-150 + EK-655 · Бизнес-класс · с пересадкой в Дубае · багаж 2×32 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-01-10T09:00:00',
          flight: 'EK-150',
          airport: 'Домодедово',
          airportCode: 'DME',
          hasLayovers: true,
          flightClass: 'business',
          price: 445000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Мале',
          dateTime: '2026-01-10T22:30:00',
          flight: 'EK-655',
          airport: 'Велана Интернэшнл',
          airportCode: 'MLE',
          hasLayovers: true,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 445000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'One&Only Reethi Rah',
        stars: 5,
        address: 'North Malé Atoll, Maldives',
        description:
          'Один из самых эксклюзивных курортов Мальдив. 130 вилл над водой и на берегу. 9 ресторанов.',
        roomType: 'Overwater Villa with Pool',
        occupancyType: 'AI',
        price: 1240000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&auto=format', alt: 'Мальдивы' },
        ],
        serviceFee: 0,
        checkIn: '2026-01-10',
        checkOut: '2026-01-20',
        nights: 10,
        managerComment: 'Включён трансфер на гидросамолёте Мале → курорт и обратно',
      },
    ],
    totalHotelsCost: 1240000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [
      {
        name: 'Подводная экскурсия с инструктором',
        price: 32000,
        currency: 'RUB',
        managerComment: 'Дайвинг PADI для начинающих + 2 погружения на коралловом рифе с оборудованием',
      },
      {
        name: 'Романтический ужин на пляже',
        price: 28000,
        currency: 'RUB',
        managerComment: 'Приватный ужин на отдельном пляже со свечами и шеф-поваром · Для двоих',
      },
      {
        name: 'Страховка — экзотика',
        price: 9800,
        currency: 'RUB',
        managerComment: 'Расширенная страховка с покрытием морских видов спорта',
      },
    ],
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-678900000008',
    createdAt: '2025-06-01T09:00:00Z',
    title: 'Италия — Рим, Флоренция, Венеция',
    startDate: '2025-09-12',
    endDate: '2025-09-26',
    clients: [],
    welcomeText:
      'Классический тур по Италии по маршруту Рим → Флоренция → Венеция. ' +
      'Сентябрь — лучшее время: жара спала, туристов меньше, виноградники золотые.',
    flights: [
      {
        airline: 'Alitalia',
        managerComment: 'AZ-703 · Комфорт · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2025-09-12T06:40:00',
          flight: 'AZ-703',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 78000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Рим',
          dateTime: '2025-09-12T09:00:00',
          flight: 'AZ-703',
          airport: 'Фьюмичино',
          airportCode: 'FCO',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 0,
          currency: 'RUB',
        },
      },
      {
        airline: 'Alitalia',
        managerComment: 'AZ-704 · обратный рейс из Венеции',
        departure: {
          city: 'Венеция',
          dateTime: '2025-09-26T18:00:00',
          flight: 'AZ-704',
          airport: 'Марко Поло',
          airportCode: 'VCE',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 0,
          currency: 'RUB',
        },
        arrival: {
          city: 'Москва',
          dateTime: '2025-09-26T22:30:00',
          flight: 'AZ-704',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 78000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Hotel de Russie, Rome',
        stars: 5,
        address: 'Via del Babuino 9, 00187 Rome',
        description: 'Легендарный отель 5★ в шаге от площади дель Пополо. Секретный сад, превосходная кухня.',
        roomType: 'Classic Room Garden View',
        occupancyType: 'BB',
        price: 212000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format', alt: 'Рим' },
        ],
        serviceFee: 0,
        checkIn: '2025-09-12',
        checkOut: '2025-09-17',
        nights: 5,
      },
      {
        name: 'Portrait Firenze',
        stars: 5,
        address: 'Lungarno Acciaiuoli 4, 50123 Florence',
        description: 'Бутик-апарт-отель на набережной Арно от Salvatore Ferragamo. Вид на Понте Веккьо.',
        roomType: 'Junior Suite Arno View',
        occupancyType: 'RO',
        price: 168000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1541370976299-4d24be43e455?w=800&auto=format', alt: 'Флоренция' },
        ],
        serviceFee: 0,
        checkIn: '2025-09-17',
        checkOut: '2025-09-22',
        nights: 5,
      },
      {
        name: 'Aman Venice',
        stars: 5,
        address: 'Calle Tiepolo 1364, Venice',
        description: 'Дворец XVI века на Гранд-канале. Частная гондола, Michelin-бар, старинные фрески.',
        roomType: 'Grand Canal Room',
        occupancyType: 'BB',
        price: 298000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format', alt: 'Венеция' },
        ],
        serviceFee: 0,
        checkIn: '2025-09-22',
        checkOut: '2025-09-26',
        nights: 4,
      },
    ],
    totalHotelsCost: 678000,
    hotelsCurrency: 'RUB',
    carRentals: [
      {
        name: 'Hertz Italy — Tuscany Drive',
        startLocation: 'Флоренция (аэропорт Перетола)',
        endLocation: 'Флоренция (аэропорт Перетола)',
        vehicles: [
          { vehicle: 'Fiat 500 Dolcevita', name: 'Компакт — романтичный', price: 32000, currency: 'RUB' },
          { vehicle: 'Alfa Romeo Giulia', name: 'Седан — стильный', price: 56000, currency: 'RUB' },
        ],
        managerComment: '2 дня по Тоскане: Сиена, Сан-Джиминьяно, виноградники Кьянти',
      },
    ],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-09-14'),
        city: 'Рим',
        price: 12500,
        currency: 'RUB',
        managerComment: 'Колизей (арена), Римский форум, Капитолийские музеи. Приоритетный вход.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&auto=format', alt: 'Колизей' },
        ],
      },
      {
        date: new Date('2025-09-23'),
        city: 'Венеция',
        price: 8900,
        currency: 'RUB',
        managerComment: 'Прогулка на гондоле по каналам, посещение мастерской стеклодувов на Мурано.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format', alt: 'Венеция гондола' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'd0e1f2a3-b4c5-6789-3456-789000000009',
    createdAt: '2025-06-15T16:00:00Z',
    title: 'Исландия — страна льда и огня',
    startDate: '2026-01-20',
    endDate: '2026-01-30',
    clients: [],
    welcomeText:
      'Зимний тур в Исландию: северное сияние, горячие гейзеры, ледниковые пещеры. ' +
      'Январь — наилучшие шансы увидеть Aurora Borealis.',
    flights: [
      {
        airline: 'Icelandair',
        managerComment: 'FI-317 · Эконом Comfort · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-01-20T08:00:00',
          flight: 'FI-317',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 94000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Рейкьявик',
          dateTime: '2026-01-20T10:45:00',
          flight: 'FI-317',
          airport: 'Кефлавик',
          airportCode: 'KEF',
          hasLayovers: false,
          flightClass: 'comfort',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 94000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Hotel Borg by Keahotels',
        stars: 4,
        address: 'Pósthússtræti 11, 101 Reykjavík',
        description: 'Исторический отель 1930-х на главной площади Рейкьявика. Art Deco интерьер, джазовый бар.',
        roomType: 'Superior Double',
        occupancyType: 'BB',
        price: 118000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&auto=format', alt: 'Рейкьявик' },
        ],
        serviceFee: 0,
        checkIn: '2026-01-20',
        checkOut: '2026-01-25',
        nights: 5,
      },
      {
        name: 'Fosshotel Glacier Lagoon',
        stars: 4,
        address: 'Öræfi, South Iceland',
        description: 'Отель у ледникового озера Йокульсарлон. Панорамные окна для наблюдения за северным сиянием.',
        roomType: 'Northern Lights Room',
        occupancyType: 'BB',
        price: 98000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format', alt: 'Северное сияние Исландия' },
        ],
        serviceFee: 0,
        checkIn: '2026-01-25',
        checkOut: '2026-01-30',
        nights: 5,
      },
    ],
    totalHotelsCost: 216000,
    hotelsCurrency: 'RUB',
    carRentals: [
      {
        name: 'Hertz Iceland — 4WD Package',
        startLocation: 'Аэропорт Кефлавик (KEF)',
        endLocation: 'Аэропорт Кефлавик (KEF)',
        vehicles: [
          { vehicle: 'Toyota RAV4 4WD', name: 'SUV с зимней резиной', price: 78000, currency: 'RUB' },
          { vehicle: 'Land Rover Defender', name: 'Экстрим-джип для F-Road', price: 124000, currency: 'RUB' },
        ],
        managerComment: 'Зимние дороги Исландии требуют 4WD. Страховка SCDW включена.',
      },
    ],
    cruises: [],
    excursions: [
      {
        date: new Date('2026-01-22'),
        city: 'Рейкьявик',
        price: 18500,
        currency: 'RUB',
        managerComment: 'Тур "Золотое кольцо": гейзер Гейсир, водопад Гюдльфосс, Тингвеллир.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format', alt: 'Исландия водопад' },
        ],
      },
      {
        date: new Date('2026-01-26'),
        city: 'Южная Исландия',
        price: 24000,
        currency: 'RUB',
        managerComment: 'Ледниковая пещера в Ватнайокутле + охота на северное сияние вечером.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format', alt: 'Ледниковая пещера' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'e1f2a3b4-c5d6-7890-4567-890000000010',
    createdAt: '2025-06-28T11:30:00Z',
    title: 'Индия — Золотой треугольник',
    startDate: '2025-11-28',
    endDate: '2025-12-12',
    clients: [],
    welcomeText:
      'Культурный тур по Золотому треугольнику: Дели → Агра → Джайпур. ' +
      'Тадж-Махал, форт Амбер, Хумаюнова гробница. ' +
      'Ноябрь–декабрь — идеальный климат, нет дождей.',
    flights: [
      {
        airline: 'IndiGo / Air India',
        managerComment: 'AI-120 · Эконом · с пересадкой в Дели · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2025-11-28T02:00:00',
          flight: 'AI-120',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: true,
          flightClass: 'economy',
          price: 89000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Дели',
          dateTime: '2025-11-28T14:30:00',
          flight: 'AI-120',
          airport: 'Индира Ганди',
          airportCode: 'DEL',
          hasLayovers: true,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 89000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'The Imperial New Delhi',
        stars: 5,
        address: 'Janpath Lane, New Delhi 110001',
        description: 'Легендарный колониальный отель 1936 года. 8 ресторанов, коллекция искусства, спа.',
        roomType: 'Heritage Room',
        occupancyType: 'BB',
        price: 138000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format', alt: 'Дели' },
        ],
        serviceFee: 0,
        checkIn: '2025-11-28',
        checkOut: '2025-12-03',
        nights: 5,
      },
      {
        name: 'Oberoi Amarvilas, Agra',
        stars: 5,
        address: 'Taj East Gate Road, Agra 282001',
        description: 'Лучший отель Агры — каждый номер с прямым видом на Тадж-Махал. 600 метров от мавзолея.',
        roomType: 'Premier Room Taj View',
        occupancyType: 'BB',
        price: 198000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format', alt: 'Тадж-Махал' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-03',
        checkOut: '2025-12-07',
        nights: 4,
        managerComment: 'Sunrise view of the Taj — рекомендуем встать в 5:30',
      },
    ],
    totalHotelsCost: 336000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-11-29'),
        city: 'Дели',
        price: 12000,
        currency: 'RUB',
        managerComment: 'Обзорная экскурсия: Хумаюнова гробница, Кутб-Минар, Красный форт, Старый Дели.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format', alt: 'Красный форт Дели' },
        ],
      },
      {
        date: new Date('2025-12-04'),
        city: 'Агра',
        price: 10500,
        currency: 'RUB',
        managerComment: 'Тадж-Махал на рассвете + Агрский форт. Приоритетный вход.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format', alt: 'Тадж-Махал рассвет' },
        ],
      },
      {
        date: new Date('2025-12-09'),
        city: 'Джайпур',
        price: 11800,
        currency: 'RUB',
        managerComment: 'Джайпур: форт Амбер на слонах, Хава-Махал, Джантар-Мантар, базар.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format', alt: 'Форт Амбер Джайпур' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-12-03T06:00:00',
        category: 'transfer',
        pickupLocation: 'The Imperial New Delhi',
        dropoffLocation: 'Oberoi Amarvilas, Agra',
        duration: 210,
        price: 14500,
        currency: 'RUB',
        managerComment: 'Личный водитель + кондиционированный автомобиль · ~3.5 ч по Yamuna Expressway',
      },
      {
        datetime: '2025-12-07T07:00:00',
        category: 'transfer',
        pickupLocation: 'Oberoi Amarvilas, Agra',
        dropoffLocation: 'Taj Hotel & Convention Centre, Agra → Jaipur',
        duration: 240,
        price: 16000,
        currency: 'RUB',
        managerComment: 'Трансфер Агра → Джайпур через Фатехпур-Сикри · остановка на осмотр',
      },
    ],
    additionalServices: [
      {
        name: 'Страховка Азия/Индия',
        price: 8900,
        currency: 'RUB',
        managerComment: 'Медицина $100 000, эвакуация, отмена поездки',
      },
      {
        name: 'Индийская SIM-карта Airtel',
        price: 1200,
        currency: 'RUB',
        managerComment: '2 GB в день · 14 дней · звонки включены',
      },
    ],
  },
  {
    id: 'f2a3b4c5-d6e7-8901-5678-900000000011',
    createdAt: '2025-07-10T08:00:00Z',
    title: 'Аргентина — Буэнос-Айрес и Патагония',
    startDate: '2026-03-05',
    endDate: '2026-03-20',
    clients: [],
    welcomeText:
      'Тур в Аргентину: столица танго Буэнос-Айрес и дикая Патагония (Эль-Калафате, ледник Перито-Морено). ' +
      'Март — конец аргентинского лета, лучшая погода для Патагонии.',
    flights: [
      {
        airline: 'Aerolíneas Argentinas',
        managerComment: 'AR-1162 · Бизнес · с пересадкой в Мадриде · baggage 2×32 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-03-05T14:00:00',
          flight: 'AR-1162',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: true,
          flightClass: 'business',
          price: 512000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Буэнос-Айрес',
          dateTime: '2026-03-06T11:00:00',
          flight: 'AR-1162',
          airport: 'Эсейса',
          airportCode: 'EZE',
          hasLayovers: true,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
      {
        airline: 'Aerolíneas Argentinas (внутренний)',
        managerComment: 'AR-1883 · Буэнос-Айрес → Эль-Калафате · Эконом',
        departure: {
          city: 'Буэнос-Айрес',
          dateTime: '2026-03-11T09:30:00',
          flight: 'AR-1883',
          airport: 'Аэропарке Хорхе Ньюбери',
          airportCode: 'AEP',
          hasLayovers: false,
          flightClass: 'economy',
          price: 28000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Эль-Калафате',
          dateTime: '2026-03-11T12:45:00',
          flight: 'AR-1883',
          airport: 'Командоро Аривалос',
          airportCode: 'FTE',
          hasLayovers: false,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 540000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Alvear Palace Hotel',
        stars: 5,
        address: 'Av. Alvear 1891, C1129 Buenos Aires',
        description: 'Символ роскоши Буэнос-Айреса с 1932 года. Belle Époque архитектура, легендарный ресторан.',
        roomType: 'Deluxe Room',
        occupancyType: 'BB',
        price: 178000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&auto=format', alt: 'Буэнос-Айрес' },
        ],
        serviceFee: 0,
        checkIn: '2026-03-06',
        checkOut: '2026-03-11',
        nights: 5,
      },
      {
        name: 'Xelena Hotel & Suites',
        stars: 5,
        address: 'Av. Lago Argentino 1922, El Calafate',
        description: 'Эко-бутик-отель с видом на озеро Аргентино. Дизайн в стиле пампасов, спа, ресторан.',
        roomType: 'Lake View Suite',
        occupancyType: 'BB',
        price: 142000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format', alt: 'Патагония' },
        ],
        serviceFee: 0,
        checkIn: '2026-03-11',
        checkOut: '2026-03-18',
        nights: 7,
      },
    ],
    totalHotelsCost: 320000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2026-03-08'),
        city: 'Буэнос-Айрес',
        price: 14500,
        currency: 'RUB',
        managerComment: 'Вечерний тур-танго: урок с мастером + шоу-ужин в легендарной Milonga.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1516893842223-30f4ef9b6f35?w=800&auto=format', alt: 'Танго Буэнос-Айрес' },
        ],
      },
      {
        date: new Date('2026-03-12'),
        city: 'Эль-Калафате',
        price: 18900,
        currency: 'RUB',
        managerComment: 'Треккинг по леднику Перито-Морено с ледоходами + переправа на лодке.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1543155225-c7e7be9dddb1?w=800&auto=format', alt: 'Ледник Перито-Морено' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'a3b4c5d6-e7f8-9012-6789-000000000012',
    createdAt: '2025-07-25T15:00:00Z',
    title: 'Австралия — Сидней и Большой Барьерный риф',
    startDate: '2026-04-01',
    endDate: '2026-04-16',
    clients: [],
    welcomeText:
      'Тур в Австралию: Сидней (Опера, Бонди-бич, Голубые горы) + дайвинг на Большом Барьерном рифе в Кэрнсе. ' +
      'Апрель — золотая осень в Австралии, +22–26°C.',
    flights: [
      {
        airline: 'Qantas',
        managerComment: 'QF-63 · Бизнес-класс · Москва → Лондон → Сидней · flat-bed · багаж 2×32 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-04-01T10:00:00',
          flight: 'QF-63',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: true,
          flightClass: 'business',
          price: 698000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Сидней',
          dateTime: '2026-04-02T21:00:00',
          flight: 'QF-63',
          airport: 'Кингсфорд Смит',
          airportCode: 'SYD',
          hasLayovers: true,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
      {
        airline: 'Qantas (внутренний)',
        managerComment: 'QF-948 · Сидней → Кэрнс · Эконом',
        departure: {
          city: 'Сидней',
          dateTime: '2026-04-08T07:00:00',
          flight: 'QF-948',
          airport: 'Кингсфорд Смит',
          airportCode: 'SYD',
          hasLayovers: false,
          flightClass: 'economy',
          price: 32000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Кэрнс',
          dateTime: '2026-04-08T09:30:00',
          flight: 'QF-948',
          airport: 'Кэрнс',
          airportCode: 'CNS',
          hasLayovers: false,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 730000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Park Hyatt Sydney',
        stars: 5,
        address: '7 Hickson Road, The Rocks, Sydney',
        description: 'Знаменитый вид на Оперный театр и мост Харбор-Бридж прямо из окна номера.',
        roomType: 'Opera House View Room',
        occupancyType: 'BB',
        price: 298000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format', alt: 'Сидней' },
        ],
        serviceFee: 0,
        checkIn: '2026-04-02',
        checkOut: '2026-04-08',
        nights: 6,
      },
      {
        name: 'Pullman Cairns International',
        stars: 5,
        address: '17 Abbott Street, Cairns',
        description: 'Лучший отель Кэрнса. Бассейн на крыше, рядом с Esplanade Lagoon. Рядом с портом для поездок на риф.',
        roomType: 'Deluxe King',
        occupancyType: 'BB',
        price: 168000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&auto=format', alt: 'Кэрнс' },
        ],
        serviceFee: 0,
        checkIn: '2026-04-08',
        checkOut: '2026-04-16',
        nights: 8,
      },
    ],
    totalHotelsCost: 466000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [
      {
        name: 'Reef Magic — Outer Great Barrier Reef',
        gallery: [
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format',
          'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&auto=format',
        ],
        managerComment: '10 апреля — дневной круиз до внешнего рифа · 5 часов · снорклинг + дайвинг включены',
        cabins: [
          { description: 'Дневной круиз с завтраком и обедом · Снаряжение для снорклинга включено', price: 28500, currency: 'RUB' },
          { description: 'Дайвинг-пакет (2 погружения) с инструктором', price: 46000, currency: 'RUB' },
        ],
      },
    ],
    excursions: [
      {
        date: new Date('2026-04-04'),
        city: 'Сидней',
        price: 16800,
        currency: 'RUB',
        managerComment: 'Обзор Сиднея: Опера (экскурсия внутри), Харбор-Бридж (пешеходная прогулка по мосту), Бонди-бич.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format', alt: 'Сиднейская опера' },
        ],
      },
      {
        date: new Date('2026-04-06'),
        city: 'Голубые горы',
        price: 12500,
        currency: 'RUB',
        managerComment: 'День-поездка в Голубые горы: Три сестры, эвкалиптовые леса, Scenic World.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1433838552652-f9a551b596d9?w=800&auto=format', alt: 'Голубые горы' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
  {
    id: 'b4c5d6e7-f8a9-0123-7890-000000000013',
    createdAt: '2025-08-05T10:00:00Z',
    title: 'Прага и Вена — сердце Европы',
    startDate: '2025-12-20',
    endDate: '2025-12-30',
    clients: [],
    welcomeText:
      'Рождественский тур: Прага со знаменитыми рождественскими ярмарками + Вена с балами и Штраусом. ' +
      'Снег, глинтвейн, старинные замки — идеально для Нового года!',
    flights: [
      {
        airline: 'Czech Airlines',
        managerComment: 'OK-701 · Эконом · Москва → Прага · багаж 23 KG',
        departure: {
          city: 'Москва',
          dateTime: '2025-12-20T08:00:00',
          flight: 'OK-701',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: false,
          flightClass: 'economy',
          price: 48000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Прага',
          dateTime: '2025-12-20T09:45:00',
          flight: 'OK-701',
          airport: 'Вацлав Гавел',
          airportCode: 'PRG',
          hasLayovers: false,
          flightClass: 'economy',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 48000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Four Seasons Hotel Prague',
        stars: 5,
        address: 'Veleslavínova 2a/1098, Prague 1',
        description: 'Исторический отель в трёх зданиях разных эпох, прямо у Карлова моста. Вид на Пражский Град.',
        roomType: 'Deluxe Room Vltava River View',
        occupancyType: 'BB',
        price: 198000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&auto=format', alt: 'Прага Карлов мост' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-20',
        checkOut: '2025-12-25',
        nights: 5,
      },
      {
        name: 'Hotel Sacher Wien',
        stars: 5,
        address: 'Philharmoniker Str. 4, 1010 Wien',
        description: 'Легендарный венский отель 1876 года, родина торта Захер. Напротив Венской оперы.',
        roomType: 'Classic Double',
        occupancyType: 'BB',
        price: 224000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1513805959324-96eb66ca8713?w=800&auto=format', alt: 'Вена' },
        ],
        serviceFee: 0,
        checkIn: '2025-12-25',
        checkOut: '2025-12-30',
        nights: 5,
      },
    ],
    totalHotelsCost: 422000,
    hotelsCurrency: 'RUB',
    carRentals: [],
    cruises: [],
    excursions: [
      {
        date: new Date('2025-12-21'),
        city: 'Прага',
        price: 10500,
        currency: 'RUB',
        managerComment: 'Пешая экскурсия: Пражский Град, Карлов мост, Старый город, Астрономические часы.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format', alt: 'Пражский Град' },
        ],
      },
      {
        date: new Date('2025-12-26'),
        city: 'Вена',
        price: 14800,
        currency: 'RUB',
        managerComment: 'Обзор Вены: Шёнбрунн, Бельведер, Хофбург, Ринг. Вечерний концерт Моцарта.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&auto=format', alt: 'Вена Шёнбрунн' },
        ],
      },
    ],
    transport: [
      {
        datetime: '2025-12-25T09:00:00',
        category: 'bus',
        pickupLocation: 'Four Seasons Hotel Prague',
        dropoffLocation: 'Hotel Sacher Wien',
        duration: 270,
        price: 7200,
        currency: 'RUB',
        managerComment: 'Комфортный автобус-экспресс Прага → Вена · 4.5 ч · кофе и вода включены',
      },
      {
        datetime: '2025-12-30T11:00:00',
        category: 'transfer',
        pickupLocation: 'Hotel Sacher Wien',
        dropoffLocation: 'Аэропорт Вена-Швехат (VIE)',
        duration: 30,
        price: 3800,
        currency: 'RUB',
        managerComment: 'Такси-премиум, заблаговременный заказ',
      },
    ],
    additionalServices: [
      {
        name: 'Страховка Шенген',
        price: 5400,
        currency: 'RUB',
        managerComment: 'На двух человек · медицина €50 000 · требуется для визы',
      },
    ],
  },
  {
    id: 'c5d6e7f8-a9b0-1234-8901-000000000014',
    createdAt: '2025-08-20T14:00:00Z',
    title: 'Канада — Ванкувер и Скалистые горы',
    startDate: '2026-06-15',
    endDate: '2026-06-30',
    clients: [],
    welcomeText:
      'Летний тур в Канаду: космополитичный Ванкувер + захватывающий роуд-трип по Скалистым горам (Банф, Джаспер, Йо-хо). ' +
      'Июнь — парки в полном цвету, минимум туристов.',
    flights: [
      {
        airline: 'Air Canada',
        managerComment: 'AC-856 · Бизнес-класс · Москва → Торонто → Ванкувер · flat-bed · багаж 2×32 KG',
        departure: {
          city: 'Москва',
          dateTime: '2026-06-15T11:00:00',
          flight: 'AC-856',
          airport: 'Шереметьево',
          airportCode: 'SVO',
          hasLayovers: true,
          flightClass: 'business',
          price: 580000,
          currency: 'RUB',
        },
        arrival: {
          city: 'Ванкувер',
          dateTime: '2026-06-15T20:30:00',
          flight: 'AC-856',
          airport: 'Ванкувер Интернэшнл',
          airportCode: 'YVR',
          hasLayovers: true,
          flightClass: 'business',
          price: 0,
          currency: 'RUB',
        },
      },
    ],
    totalFlightsCost: 580000,
    flightsCurrency: 'RUB',
    hotels: [
      {
        name: 'Fairmont Pacific Rim',
        stars: 5,
        address: '1038 Canada Place, Vancouver, BC',
        description: 'Современный 5★ отель прямо у угла угла круизного порта. Бассейн на крыше, Willow Stream Spa.',
        roomType: 'Deluxe Harbour View',
        occupancyType: 'BB',
        price: 214000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=800&auto=format', alt: 'Ванкувер' },
        ],
        serviceFee: 0,
        checkIn: '2026-06-15',
        checkOut: '2026-06-19',
        nights: 4,
      },
      {
        name: 'Fairmont Banff Springs',
        stars: 5,
        address: '405 Spray Avenue, Banff, AB',
        description: 'Замок среди гор — один из самых узнаваемых отелей Канады. Горнолыжный курорт, спа, верховая езда.',
        roomType: 'Mountain View Room',
        occupancyType: 'BB',
        price: 278000,
        currency: 'RUB',
        images: [
          { url: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&auto=format', alt: 'Банф Скалистые горы' },
        ],
        serviceFee: 0,
        checkIn: '2026-06-20',
        checkOut: '2026-06-30',
        nights: 10,
      },
    ],
    totalHotelsCost: 492000,
    hotelsCurrency: 'RUB',
    carRentals: [
      {
        name: 'Hertz Canada — Rocky Mountain Drive',
        startLocation: 'Ванкувер (аэропорт YVR)',
        endLocation: 'Калгари (аэропорт YYC)',
        vehicles: [
          { vehicle: 'Jeep Grand Cherokee 4WD', name: 'SUV — горный', price: 118000, currency: 'RUB' },
          { vehicle: 'Ford Mustang GT Convertible', name: 'Кабриолет — для шоссе', price: 142000, currency: 'RUB' },
        ],
        managerComment: '11 дней · маршрут Ванкувер → Уистлер → Банф → Джаспер → Калгари · включена навигация',
      },
    ],
    cruises: [],
    excursions: [
      {
        date: new Date('2026-06-16'),
        city: 'Ванкувер',
        price: 14200,
        currency: 'RUB',
        managerComment: 'Обзорная экскурсия: парк Стэнли, Гастаун, Грандвил-Айленд, подвесной мост Капилано.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=800&auto=format', alt: 'Ванкувер парк' },
        ],
      },
      {
        date: new Date('2026-06-22'),
        city: 'Банф',
        price: 19500,
        currency: 'RUB',
        managerComment: 'Каноэ на озере Луиз + поход на смотровую площадку Plain of Six Glaciers. Гид-натуралист.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1565473557054-c6e7e7d95e84?w=800&auto=format', alt: 'Озеро Луиз Банф' },
        ],
      },
    ],
    transport: [],
    additionalServices: [],
  },
]

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
        this.offers = MOCK_OFFERS
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
        this.currentOffer = MOCK_OFFERS.find((t) => t.id === id) ?? null
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
        this.offers.push(created)
        return created
      } catch {
        this.error = 'Не удалось создать оффер'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
      this.loading = true
      this.error = null
      try {
        const updated = await OfferApi.update(id, data)
        const idx = this.offers.findIndex((t) => t.id === id)
        if (idx !== -1) this.offers[idx] = updated
        if (this.currentOffer?.id === id) this.currentOffer = updated
        return updated
      } catch {
        this.error = 'Не удалось обновить оффер'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteOffer(id: string): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        // TODO: await OfferApi.delete(id)
        this.offers = this.offers.filter((t) => t.id !== id)
        if (this.currentOffer?.id === id) this.currentOffer = null
        return true
      } catch {
        this.error = 'Не удалось удалить оффер'
        return false
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

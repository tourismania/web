# Tourismania Web

SPA-интерфейс платформы **Tourismania** для менеджеров туристического агентства. Позволяет создавать, редактировать и просматривать туристические предложения (Offer): перелёты, отели, круизы, аренду авто, экскурсии, транспорт и дополнительные услуги.

## Технологии

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) — SPA на Composition API
- [TypeScript](https://www.typescriptlang.org/) — строгая типизация
- [Vuetify 3](https://vuetifyjs.com/) — UI-кит (тёмная тема)
- [Pinia](https://pinia.vuejs.org/) — стейт-менеджмент
- [Vue Router 4](https://router.vuejs.org/) — маршрутизация
- SCSS, `unplugin-icons` — стили и иконки
- [Vitest](https://vitest.dev/) + [Cypress](https://www.cypress.io/) — тестирование

## Требования

- Docker

Все команды по работе с приложением выполняются внутри Docker-контейнера, чтобы не влиять на локальную машину.

## Быстрый старт

```sh
# Собрать образ (стадия "local" — dev-сервер с HMR)
docker build --target local -t tourismania-web .

# Запустить dev-сервер
docker run --rm -it \
  -p 5173:5173 \
  -v "$(pwd)":/home/node/app \
  tourismania-web
```

Приложение поднимется на `http://localhost:5173`. Для production используется стадия `production` (nginx + статика из `dist/`, конфиг — `docker/nginx/conf.d/default.conf`), см. `Dockerfile`.

## Переменные окружения

| Файл | Назначение |
|---|---|
| `.env` | Dev-конфигурация |
| `.env.production` | Prod-конфигурация |

| Переменная | Описание |
|---|---|
| `VITE_API_BASE_URL` | Базовый URL бэкенд-API. Обязательна — без неё API-запросы упадут |

## Скрипты

```sh
npm run dev                  # Dev-сервер (HMR)
npm run build                # type-check + сборка (vite build)
npm run preview              # Предпросмотр prod-сборки
npm run type-check           # vue-tsc --build
npm run lint                 # ESLint --fix
npm run format                # Prettier (src/)

npm run test:unit             # Vitest (unit-тесты)
npm run test:e2e              # Cypress e2e против prod-сборки
npm run test:e2e:dev          # Cypress e2e против dev-сервера
npm run test:component:dev    # Cypress component tests
```

Все команды запускаются внутри контейнера.

## Структура проекта

```plain
src/
  api/
    axios.ts          # Общий экземпляр axios (VITE_API_BASE_URL + Content-Type JSON)
    auth.ts            # Auth — POST /api/login
    user.ts             # UserApi — GET /api/v1/me
    offer.ts             # OfferApi — CRUD /api/v1/offers
    airport.ts            # AirportApi — полнотекстовый поиск аэропортов/городов
    types/                # Доменные типы (offer, user, auth, airport)
  assets/                # SCSS-переменные, глобальные стили, шрифты
  blocks/                # Layout/chrome-компоненты с доступом к стору (AppBar, NavigationDrawer, LoginForm...)
  components/
    offer/               # Карточки и блоки сущности Offer (FlightCard, HotelCard, CruiseCard...)
    common/              # Переиспользуемые UI-компоненты ввода (DateField, AirportSelect...)
  helpers/               # Чистые функции (расчёт ночей в отеле, перевод локального времени рейса в UTC)
  layouts/               # MainLayout — обёртка всех страниц
  router/                # Маршруты + navigation guard
  stores/                # Pinia-сторы (auth, user, offer, client)
  views/                 # Страницы-маршруты
public/
  images/                # Статические ассеты, попадающие в prod-сборку без явного импорта
docker/
  nginx/                 # Конфигурация nginx для production-образа
```

## Маршруты

| Path | Auth | Описание |
|---|---|---|
| `/` | — | Главная |
| `/offers` | ✅ | Список предложений |
| `/offer/new` | ✅ | Создание предложения |
| `/offer/:id/edit` | ✅ | Редактирование предложения |
| `/offer/:id` | ✅ | Просмотр предложения |
| `/deals` | — | Сделки |
| `/login` | — | Вход |
| `*` | — | 404 |

Маршруты с `meta: { requiresAuth: true }` перенаправляют на `/login?redirect=...` при отсутствии JWT-токена.

## Домен Offer

Корневая сущность приложения (`src/api/types/offer.ts`): `title`, `clients`, `welcomeText`, `startDate`, `endDate` и массивы вложенных сущностей — `flights`, `hotels`, `carRentals`, `cruises`, `excursions`, `transport`, `additionalServices`.

- **`Flight`** — состоит из `segments: FlightSegment[]` (прямой рейс = 1 сегмент, N пересадок = N+1 сегмент). Каждый `Airport` хранит `timezone` как ISO-офсет (`+03:00`); для обратной совместимости `zonedToUtcMs` (`src/helpers/flight.ts`) также распознаёт legacy IANA-зоны (`Europe/Moscow`) через `Intl`.
- **`Hotel`** — количество ночей не хранится в модели, а считается на лету через `computeNights(checkIn, checkOut)` (`src/helpers/hotel.ts`).
- **`Cruise`** — одна каюта на круиз (`cabin: CruiseCabin`).
- **`Excursion`, `Cruise`** — галереи изображений (`gallery: Image[]`).

Полные определения — в `src/api/types/offer.ts`.

### Хранение данных

Стор `offer` (`src/stores/offer.ts`) сначала обращается к реальному API (`OfferApi`), а при ошибке использует фолбэк в `localStorage` (ключ `tourismania:offers`), чтобы создание/редактирование/удаление предложений переживало перезагрузку страницы даже без доступного бэкенда.

### Поиск аэропортов

`AirportSelect.vue` использует `AirportApi.search` (`GET /api/v1/airports`) для полнотекстового поиска по аэропортам и городам (мин. 2 символа) и сохраняет выбранный аэропорт в `Airport`-объект перелёта.

## Тестирование

- **Unit**: Vitest + `@vue/test-utils` + jsdom — тесты рядом с файлами (`*.spec.ts`)
- **E2E / Component**: Cypress — `cypress/e2e`, `cypress/support`

Все хелперы (`src/helpers/`) и критические пути (auth flow, Offer CRUD) — приоритет при написании тестов.

## Деплой

CI/CD через GitHub Actions (`.github/workflows/deploy.yml`), запуск вручную (`workflow_dispatch`). Деплой по SSH на prod-сервер командой `make deploy-web-tag TAG=<tag>`.

## Документация для разработки

Подробный контекст по архитектуре, конвенциям, доменным типам и процессу разработки — в [`CLAUDE.md`](./CLAUDE.md).

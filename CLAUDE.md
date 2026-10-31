# Agent Context — Tourismania Web

---

## Project Purpose

SPA-интерфейс платформы Tourismania для управления туристическими предложениями. Позволяет менеджерам создавать, редактировать и просматривать предложения (Offer), включая перелёты, отели, круизы, аренду авто, экскурсии и транспорт. Авторизация через JWT. Базовые поля оффера (`title`/`description`/`status`) и перелёты (`flights`) хранятся в реальном API; остальной доменный контент (`hotels`/итд) бэкенд пока не поддерживает и между перезагрузками не сохраняется (issue [#24](https://github.com/tourismania/web/issues/24)).

**Primary language:** TypeScript  
**Framework:** Vue 3 + Vite SPA  
**Key dependencies:** Vuetify 3 (тёмная тема), Pinia (state), Vue Router 4, SCSS, unplugin-icons, Vitest, Cypress

---

## General Rules

- Все команды по работе с приложением должны выполняться внутри docker-контейнера.
- Всегда используй Context7 (`npx ctx7@latest`) для актуальной документации по библиотекам — не полагайся на обучающие данные.
- Все задачи связанные с версткой, UX и так далее — делегируй агенту **UI Designer**.
- Все задачи на разработку — делегируй агенту **Frontend Developer**.
- **Статические ассеты** для prod: файлы из `src/assets/images/` без явного импорта или `public/` не попадают в `dist/`. Mock-изображения должны лежать в `public/images/`.
- **Не редактируй** `components.d.ts` вручную (если будет настроен `unplugin-vue-components`).
- **`unplugin-vue-components`** установлен, но не активен — auto-import компонентов не работает, импортируй явно.

---

## Environment

```env
VITE_API_BASE_URL=http://tourismania-api.localhost  # Dev default
```

`.env` хранит переменные для dev, `.env.production` — для prod. Переменная обязательна — без неё API-запросы упадут.

---

## Repository Structure

```plain
src/
  api/
    axios.ts              # Общий экземпляр axios (VITE_API_BASE_URL + Content-Type JSON)
    auth.ts               # Auth class — POST /api/login
    user.ts               # UserApi class — GET /api/v1/users/me
    offer.ts              # OfferApi class — CRUD /api/v1/offers, маппинг flights
    airport.ts            # AirportApi class — GET /api/v1/airports
    airline.ts            # AirlineApi class — GET /api/v1/airlines
    error.ts              # apiErrorMessage — текст ошибки api с причиной
    types/
      auth.ts             # AuthResponse: { token: string }
      user.ts             # User: id, email, phone, firstName, lastName, rights.isSuperAdmin
      offer.ts            # Offer + все вложенные типы
      airport.ts          # Ответ поиска аэропортов
      airline.ts          # Ответ поиска авиакомпаний
  assets/
    variables.scss        # Общие SCSS-токены ($color-blue, $color-blue-dark, $color-yellow, шрифты)
    main.scss             # Глобальные стили
    fonts/                # Шрифты Amatic SC, Comforter Brush
  blocks/                 # Layout/chrome компоненты с бизнес-логикой (могут обращаться к стору)
    AppBar.vue
    NavigationDrawer.vue
    SocialLinksFooter.vue # Импортирован в MainLayout, но не рендерится
    LoginForm.vue
  components/
    offer/                # Карточки и блоки доменной сущности Offer
    common/               # Переиспользуемые UI-компоненты ввода
  helpers/
    hotel.ts              # computeNights, pluralizeNights
    flight.ts             # Показ перелёта (airportCode, airlineName, длительности из секунд, местное время), priceRule, черновики
    rules.ts              # Правила полей форм Vuetify (FieldRule, required)
  layouts/
    MainLayout.vue        # Обёртка всех страниц: AppBar + NavigationDrawer + RouterView
  router/
    index.ts              # Маршруты + navigation guard (requiresAuth)
  stores/
    auth.ts               # JWT token (localStorage 'auth_token')
    user.ts               # Текущий пользователь (loadCurrentUser)
    offer.ts              # Offers CRUD (базовые поля через реальный API)
    client.ts             # Clients (mock, без API)
  views/                  # Страницы-маршруты
public/
  images/examples/        # Mock-изображения (статика для Vite prod build)
```

**Соглашение об именовании:**

| Тип файла | Формат | Пример |
|---|---|---|
| Vue-компоненты | PascalCase | `UserProfile.vue` |
| Классы TypeScript | PascalCase в имени класса | класс `UserAPI` в `user-api.ts` |
| Обычные `.ts` файлы | kebab-case | `user-api.ts`, `auth-store.ts` |
| Папки | kebab-case | `/components`, `/stores` |

---

## Architecture

### Entry Point

`src/main.ts` — регистрирует Vuetify (тёмная тема `myCustomDarkTheme`, surface `#001d1b`), Pinia, Router.

### Layout

Все страницы рендерятся внутри `src/layouts/MainLayout.vue`. При монтировании вызывает `userStore.loadCurrentUser()`. Состояние `drawer` (открыт/закрыт) управляется через `v-model`.

### Routing (`src/router/index.ts`)

| Path | Name | Component | Auth |
|---|---|---|---|
| `/` | `home` | `HomeView` | — |
| `/offers` | `offers` | `OffersListView` | ✅ |
| `/offer/new` | `offerNew` | `OfferEditView` | ✅ |
| `/offer/:uuid/edit` | `offerEdit` | `OfferEditView` | ✅ |
| `/offer/:uuid` | `offer` | `OfferView` | ✅ |
| `/deals` | `deals` | `DealView` | — |
| `/login` | `login` | `LoginView` | — |
| `/:any(.*)` | `notFound` | `NotFoundView` | — |

Navigation guard: маршруты с `meta: { requiresAuth: true }` перенаправляют на `/login?redirect=...` при отсутствии токена.

### State (Pinia stores)

Все сторы — options API style (`defineStore` с `state` / `actions` / `getters`).

- `src/stores/auth.ts` — JWT в `localStorage['auth_token']`; actions: `setToken`, `clearToken`
- `src/stores/user.ts` — `User | null`; `loadCurrentUser()` → `UserApi.fetchCurrentUser`; getters: `isAuthenticated`, `isSuperAdmin`
- `src/stores/offer.ts` — `offers`, `currentOffer`, `loading`, `error`, `meta: { total, limit, offset }`; actions: `loadOffers(params?)`, `loadOfferById`, `createOffer`, `updateOffer`, `deleteOffer`, `clearCurrentOffer`; getters: `offerById`, `offersCount`. Работает с базовыми полями и перелётами офферов через реальный API; остальной доменный контент (hotels/итд, которых в API ещё нет) нигде не персистится; при ошибке записи `error` содержит причину из ответа api (`apiErrorMessage`), см. [Offer Store: Basic Fields vs Domain Content](#offer-store-basic-fields-vs-domain-content)
- `src/stores/client.ts` — `clients: Client[]`, mock (реального API нет)

### API Layer (`src/api/`)

- `axios.ts` — **единственный** экземпляр axios. Все API-классы импортируют его. Содержит общий request-interceptor (проставляет `Authorization: Bearer <token>` из `useAuthStore()` для всех запросов) и response-interceptor (на `401` — `clearToken()` + редирект на `/login?redirect=...`). Отдельные API-классы **не должны** вручную добавлять заголовок `Authorization`.
- `auth.ts` — `Auth` class: `POST /api/login`
- `user.ts` — `UserApi` class: `GET /api/v1/users/me`
- `offer.ts` — `OfferApi` class: CRUD `/api/v1/offers` (см. `api/docs/swagger/swagger.json` в репозитории бэкенда); методы `getAll(params?)` (пагинация `limit`/`offset`, фильтры `status`/`createdBy`), `getById`, `getPublicById` (`GET /api/v1/public/offers/{uuid}`, без авторизации, только опубликованные — UI для неё пока не реализован, см. issue [#27](https://github.com/tourismania/web/issues/27)), `create`, `update` (PATCH, частичное обновление базовых полей), `delete`. `create`/`update` всегда отправляют полный набор `flights`, в том числе `[]`: api заменяет его целиком, поэтому в `update` поле `flights` обязательно по типу. Возвращает только те поля, которые реально хранит бэкенд; в списке `getAll` перелётов нет, у таких офферов `flights: []` — для записи используй оффер из `getById`. См. [Offer Store: Basic Fields vs Domain Content](#offer-store-basic-fields-vs-domain-content)
- `airport.ts` — `AirportApi` class: `GET /api/v1/airports` (полнотекстовый поиск)
- `airline.ts` — `AirlineApi` class: `GET /api/v1/airlines` (поиск по справочнику авиакомпаний)
- `error.ts` — `apiErrorMessage(e, fallback)`: `<fallback>: <причина из response.data.error>`, для `validation failed` — с ключами `meta`; без причины в ответе — `fallback`

---

## Offer Domain

Основная доменная сущность.

### Views

| Файл | Маршрут | Описание |
|---|---|---|
| `src/views/OffersListView.vue` | `/offers` | Список предложений; таблица с `OfferListItem` строками; кнопка «Создать» |
| `src/views/OfferView.vue` | `/offer/:uuid` | Просмотр предложения; загружает через `loadOfferById`; компоненты из `src/components/offer/` |
| `src/views/OfferEditView.vue` | `/offer/new`, `/offer/:uuid/edit` | Создание/редактирование; определяет режим по наличию `:uuid`; вызывает `createOffer` / `updateOffer`, редиректит на просмотр |
| `src/views/Deals/DealView.vue` | `/deals` | Старый OfferView из `/offers` — перемещён при рефакторинге |

### Components (`src/components/offer/`)

| Компонент | Назначение |
|---|---|
| `OfferHeader.vue` | Hero-блок: SVG-карта мира, название, даты, статистика |
| `OfferPriceCard.vue` | Итоговая стоимость + детализация по строкам |
| `OfferSectionHeader.vue` | Заголовок секции (иконка + название + счётчик + итог) |
| `OfferListItem.vue` | Строка таблицы; emits `click` с `id` |
| `OfferBasicInfoForm.vue` | Форма основных полей предложения |
| `FlightCard.vue` | Карточка перелёта: таймлайн сегментов, тултипы пересадок; время в пути и ожидание — из ответа api |
| `FlightEditDialog.vue` | Диалог перелёта: `v-form` с обязательными полями, пересадки; хронологию не проверяет — это делает api |
| `HotelCard.vue` | Карточка отеля с галереей; nights считает через `computeNights` |
| `CarRentalCard.vue` | Аренда авто |
| `CruiseCard.vue` | Круиз с галереей |
| `ExcursionCard.vue` | Экскурсия с галереей |
| `TransportCard.vue` | Общественный транспорт |
| `AdditionalServiceCard.vue` | Дополнительные услуги |

### Common Input Components (`src/components/common/`)

| Компонент | Назначение |
|---|---|
| `DateField.vue` | `v-text-field` (readonly) + `v-date-picker` в `v-menu`; принимает/возвращает `YYYY-MM-DD`; поддерживает `min`/`max` |
| `DateTimeField.vue` | Дата + время; принимает/возвращает `YYYY-MM-DDTHH:mm:ss`, секунды сохраняет; поддерживает `rules` |
| `AirportSelect.vue` | Поиск аэропорта (`AirportApi`, от 2 символов); значение — `Airport`, сопоставление по ICAO; поддерживает `rules` |
| `AirlineSelect.vue` | Поиск авиакомпании (`AirlineApi`, от 3 символов, дебаунс 300 мс); значение — `Airline`, сопоставление по `id`, текущее значение всегда среди вариантов (в том числе скрытая из поиска авиакомпания); поддерживает `rules` |
| `TimezoneOffsetSelect.vue` | Список UTC-смещений (UTC-12…+14); хранит `+HH:MM`/`-HH:MM`; нормализует legacy IANA через `Intl`. Нигде не используется |

---

## Types (`src/api/types/offer.ts`)

### Union-типы

| Тип | Значения |
|---|---|
| `CabinClass` | `'economy'` \| `'comfort'` \| `'comfort_plus'` \| `'business'` \| `''` (класс неизвестен, «Не указан») |
| `Currency` | `'RUB'` \| `'USD'` \| `'EUR'` \| `'TRY'` |
| `TransportCategory` | `'taxi'` \| `'bus'` \| `'transfer'` |

### Offer — корневая сущность

**Поля из реального API** (`OfferApi`, `/api/v1/offers`): `title`, `description`, `status: OfferStatus` (`'draft' | 'ready' | 'published'`) — не `optional`, у них всегда есть значение (дефолтятся и в `blankOffer()`, и в offer-сторе при create/update). `uuid?`, `id?`, `agencyId?`, `createdBy?`, `createdAt?`, `updatedAt?` — присваиваются бэкендом, поэтому `optional`: отсутствуют у локального черновика, пока оффер не сохранён через `OfferApi.create`.

**Перелёты** — `flights: Flight[]`, хранятся в реальном API.

**Доменные поля** (в бэкенде ещё не реализованы, между перезагрузками страницы не сохраняются — см. [Offer Store: Basic Fields vs Domain Content](#offer-store-basic-fields-vs-domain-content)): `clients: Client[]`, `startDate`, `endDate`, `hotels: Hotel[]`, `carRentals`, `cruises`, `excursions`, `transport`, `additionalServices`.

**Примечание:** отдельного поля `welcomeText` в модели нет — приветственный текст для клиента хранится в `description` (реальное поле API), эти два понятия были объединены по ревью PR #25.

### Flight — модель сегментов

Модель повторяет модель api и отличается только регистром имён (camelCase вместо snake_case); маппинг — в `src/api/offer.ts`.

`Flight { id?, price: string, currency, managerComment: string, segments: FlightSegment[], totalDurationSeconds?, layovers?: { airportIcao, durationSeconds }[] }`  
`FlightSegment { departureAirport, arrivalAirport: Airport | null, departureAt, arrivalAt: string, cabinClass: CabinClass, airline: Airline | null, flightNumber, durationSeconds? }`  
`Airport { icao, iata: string | null, name, city: { name, timezone: string | null }, country: { iso2, name } }`  
`Airline { id, icao: string | null, name, nameRu, dissolvedOn: string | null }`

**Правило:** прямой рейс = 1 сегмент, N пересадок = N+1 сегмент.  
**`null` в сегменте** бывает только в черновике диалога.  
**Время** — местное время аэропорта без смещения (`2026-05-14T10:00:00`). Web передаёт и показывает его как есть, не зависит от часового пояса браузера и часовые пояса не считает: время в пути и пересадки берутся из вычисленных api полей, неположительные значения не показываются. Вычисляемые поля (`id`, длительности, `layovers`) и объекты аэропорта и авиакомпании в тело записи не попадают: api отклоняет неизвестные поля.  
**Цена** — десятичная строка с точкой, как в api; в число приводится только для итога на странице оффера.  
**Показ:** код аэропорта — `airportCode` (`iata ?? icao`), авиакомпания — `airlineName` (`nameRu || name`).

### Hotel

`name`, `stars`, `address`, `description`, `roomType`, `roomDescription?`, `occupancyType`, `checkIn`, `checkOut`, `nights` (авто-расчёт через `computeNights` из `src/helpers/hotel.ts`), `price`, `currency`, `serviceFee`, `serviceFeeCurrency?`, `images: HotelImage[]`, `managerComment?`

### Client

`name`, `surname`, `email` (уникальный ключ для мультиселекта)

### Остальные типы

`CarRental`, `CarRentalVehicle`, `Cruise`, `CruiseCabin`, `Excursion`, `PublicTransport`, `AdditionalService` — см. `README.md` для полных таблиц полей.

---

## Offer Store: Basic Fields vs Domain Content

Реальный бэкенд (`/api/v1/offers`, см. `api/docs/swagger/swagger.json` в репозитории API) хранит **базовые поля** оффера (`title`, `description`, `status`, `agency_id`, `created_by`, `created_at`, `updated_at`) и **перелёты** (`flights`, только в карточке, в списке их нет). `description` используется на фронте и как приветственный текст для клиента (отдельного `welcomeText` в модели нет — эти два понятия объединены). Полей для остальной доменной модели (`hotels`, `carRentals`, `cruises`, `excursions`, `transport`, `additionalServices`, `clients`, `startDate`, `endDate`) в бэкенде пока нет (issue [#24](https://github.com/tourismania/web/issues/24)).

`src/stores/offer.ts` работает с базовыми полями и перелётами через `OfferApi` — реальный бэкенд, без фолбэка. Ошибки идут в `store.error` + `console.error`; при записи `store.error` содержит причину из ответа api, а редактор остаётся с введёнными данными. Если оффер не загрузился, сохранение в редакторе недоступно: иначе пустая форма заменила бы его поля и перелёты. localStorage-персистенция доменного контента, использовавшаяся ранее, убрана по ревью — остальные доменные поля (`hotels`/итд), приходящие из форм (`OfferEditView`), сейчас нигде не сохраняются между перезагрузками страницы; это осознанный и временный пробел, а не баг.

Тип `DomainContent` (в `offer.ts`) оставлен как документация структуры, которую предстоит перенести на бэкенд — сам по себе он больше ни для чего не используется.

**Когда переписывать:** когда бэкенд получит поля для остальной доменной модели — реализовать `hotels`/итд через реальный API целиком (отдельная задача, замена нынешнего пробела, а не текущей localStorage-схемы, которой больше нет).

---

## Styling

- **SCSS**: переменные в `src/assets/variables.scss` (`$color-blue`, `$color-blue-dark`, `$color-yellow`, font families)
- **Шрифты**: Amatic SC, Comforter Brush (SCSS-импорты в `src/assets/fonts/`)
- **Path alias**: `@` → `src/`
- **Icons**: `unplugin-icons` с `autoInstall: true`; коллекция `@iconify-json/circle-flags` предустановлена
- **Vuetify**: тёмная тема `myCustomDarkTheme`, surface `#001d1b`
- **`unplugin-vue-components`**: установлен в devDependencies, но **не сконфигурирован** в `vite.config.ts` — авто-импорт компонентов не активен

---

## Coding Conventions

### Vue Components

- Composition API с `<script setup lang="ts">` предпочтителен для новых компонентов; сторы используют options API.
- Props — через `defineProps<{...}>()` с TypeScript-типами.
- Emits — через `defineEmits<{...}>()`.
- Компоненты без бизнес-логики (`ui/`) — только props и events, без обращения к стору и роутеру.
- `blocks/` — могут иметь бизнес-логику, но остаются достаточно изолированными для переиспользования.
- `views/` — обращаются к стору, роутеру, вызывают API через сторы.

### TypeScript

- Строгая типизация; `any` запрещён кроме крайних случаев.
- Доменные типы — только в `src/api/types/`; компоненты импортируют оттуда через `import type`.
- Нет магических строк — используй union-типы и именованные константы.

**Именование wire-типов в API-классах** (`src/api/*.ts`, см. `offer.ts`):

| Суффикс | Назначение | Экспортируется? |
|---|---|---|
| `*Dto` | Сырой JSON бэкенда 1:1 (snake_case, как в swagger) | Нет, приватный тип файла |
| `*Params` | Входные параметры метода API-класса, во фронтовых конвенциях (camelCase) | Да |
| `*Result` | Возвращаемое значение метода, уже смёрженное с доменными полями/метаданными (не является буквальным ответом бэкенда) | Да |
| `*Fields` | Подмножество доменных полей, которое реально принимает эндпоинт на запись (create/update) | Да |

Домен (`src/api/types/offer.ts` и т.п.) от этих типов не зависит — `*Dto` мапится в доменный тип внутри API-класса, наружу утекает только домен.

### State Management

- Не вызывай API напрямую из компонентов — только через actions стора.
- Сторы — тонкий слой оркестрации; бизнес-логики в них минимум.

### Error Handling

- Обрабатывай ошибки API в actions стора; во view показывай `store.error`.
- Не поглощай ошибки молча — хотя бы `console.error` в dev.

---

## Tooling

### Build

```sh
pnpm run dev          # Dev-сервер (HMR, host mode для Docker)
pnpm run build        # type-check + vite build
pnpm run preview      # Предпросмотр prod-сборки
pnpm run type-check   # vue-tsc --build
pnpm run lint         # ESLint --fix
pnpm run format       # Prettier (src/)
```

### Tests

```sh
pnpm run test:unit              # Vitest (unit)
pnpm run test:e2e               # Cypress e2e против prod-сборки
pnpm run test:e2e:dev           # Cypress e2e против dev-сервера
pnpm run test:component:dev     # Cypress component tests
```

### Tooling Notes

- **TypeScript**: `tsconfig.app.json` расширяет `@vue/tsconfig/tsconfig.dom.json` — strict унаследован.
- **ESLint**: flat config (`eslint.config.ts`); `@vue/eslint-config-typescript` + `eslint-plugin-vue` (flat/essential) + Vitest + Cypress plugins.
- **Vite**: `vueDevTools` закомментирован; `allowedHosts: ['web']` для Docker HMR.
- **axios**: используется во всех API-классах, но **не объявлен** в `package.json` — резолвится транзитивно.

---

## Testing Strategy

### Tools

- **Unit**: Vitest + `@vue/test-utils` + jsdom
- **E2E / Component**: Cypress 14
- **Assertions**: стандартные Vitest matchers

### Test Organization

```
src/                         # Unit-тесты рядом с файлами (*.spec.ts)
cypress/
  e2e/                       # End-to-end тесты
  support/                   # Команды и фикстуры
```

### Coverage Expectations

- Все хелперы (`src/helpers/`) — 100% покрытие.
- Критические пути (auth flow, Offer CRUD) — приоритет при написании тестов.

---

## Development Process

### Workflow

```
Plan → Issue → Implement → Review → Merge → Docs
```

| Фаза | Описание |
|---|---|
| **Plan** | Определить scope, зависимые файлы, архитектурное решение |
| **Issue** | GitHub Issue с acceptance criteria |
| **Implement** | Feature branch, соблюдение конвенций |
| **Review** | Cоздание и проверка PR. В PR заполняются все доступные поля относительно задачи: ответственный, тип, labels и так далее. От reviewers - проверка корректности, типов, стилей и логики. Если были обнаружены замечания по коду, то отвечать необходимо ответом к добавленным комментариям |
| **Merge** | После апрува — merge в `main` |

### Branch Strategy

- **`main`** — стабильный production-ready код
- **Feature branches**: `feature/<N>` (по номеру issue)

### Issues-First Rule

Каждый запрос на работу — сначала GitHub Issue, потом реализация. Оригинальный промпт сохраняется в описании issue.

---

## Deployment

CI/CD через GitHub Actions (`.github/workflows/deploy.yml`):

- Триггер: `workflow_dispatch` (ручной запуск)
- Деплоит по SSH на prod-сервер: `make deploy-web-tag TAG=${{ github.ref_name }}`
- Секреты: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PATH_TO_APP`

Докер: dev-сервер поддерживает HMR через `allowedHosts: ['web']` в `vite.config.ts`.

---

## Validation Gates

Перед тем как PR считается готовым к merge:

- [ ] TypeScript без ошибок (`pnpm run type-check`)
- [ ] Линтер чист (`pnpm run lint`)
- [ ] Unit-тесты проходят (`pnpm run test:unit`)
- [ ] `README.md` обновлён при изменении доменных типов или маршрутов
- [ ] `CLAUDE.md` обновлен при изменении связанной информации, и наполнение той информацией, которая в дальнейшем необходимо для быстрого погружения
- [ ] PR ограничен scope issue — нет несвязанных изменений

---

## Code Review

- **Взаимодействие с техническим долгом:** при выявлении задачи на тех. долг, создавать отдельный issue

---

## Documentation Maintenance

| Документ | Обновлять при |
|---|---|
| `README.md` | Добавление/изменение маршрутов, доменных типов, компонентов |
| `CLAUDE.md` | Изменение архитектуры, процессов, конвенций |

---

## References

- Документация Vuetify 3: `https://vuetifyjs.com/`
- Документация Vue 3: `https://vuejs.org/`
- Документация Pinia: `https://pinia.vuejs.org/`
- Iconify (иконки): `https://iconify.design/`
- Vite: `https://vitejs.dev/`

# Agent Context — Tourismania Web

---

## Project Purpose

SPA-интерфейс платформы Tourismania для управления туристическими предложениями. Позволяет менеджерам создавать, редактировать и просматривать предложения (Offer), включая перелёты, отели, круизы, аренду авто, экскурсии и транспорт. Авторизация через JWT. Данные переживают перезагрузку через двухслойный механизм: реальный API → localStorage-фолбэк.

**Primary language:** TypeScript  
**Framework:** Vue 3 + Vite SPA  
**Key dependencies:** Vuetify 3 (тёмная тема), Pinia (state), Vue Router 4, SCSS, unplugin-icons, Vitest, Cypress

---

## General Rules

- **Никогда не запускай команды с `npm`.** Используй `pnpm` или другие способы через docker.
- Всегда используй Context7 (`npx ctx7@latest`) для актуальной документации по библиотекам — не полагайся на обучающие данные.
- Все задачи на дизайн — делегируй агенту **UI Designer**.
- Все задачи на реализацию — делегируй агенту **Frontend Developer**.
- Если обновляется информация о доменных сущностях — сразу актуализируй `./.claude/memory` и `./README.md`.
- **Никогда не запускай `npm`** — запрещено правилами проекта.
- **Статические ассеты** для prod: файлы из `src/assets/images/` без явного импорта или `public/` не попадают в `dist/`. Mock-изображения должны лежать в `public/images/`.
- **Не редактируй** `components.d.ts` вручную (если будет настроен `unplugin-vue-components`).
- **`unplugin-vue-components`** установлен, но не активен — auto-import компонентов не работает, импортируй явно.

### В начале каждой сессии подгружай

- `./CLAUDE.md`
- `./.claude/memory`

---

## Environment

```
VITE_API_BASE_URL=http://tourismania-api.localhost  # Dev default
```

`.env` хранит переменные для dev, `.env.production` — для prod. Переменная обязательна — без неё API-запросы упадут.

---

## Repository Structure

```
src/
  api/
    axios.ts              # Общий экземпляр axios (VITE_API_BASE_URL + Content-Type JSON)
    auth.ts               # Auth class — POST /api/login
    user.ts               # UserApi class — GET /api/v1/me
    offer.ts              # OfferApi class — CRUD /api/v1/offers
    types/
      auth.ts             # AuthResponse: { token: string }
      user.ts             # User: id, email, phone, firstName, lastName, rights.isSuperAdmin
      offer.ts            # Offer + все вложенные типы
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
  layouts/
    MainLayout.vue        # Обёртка всех страниц: AppBar + NavigationDrawer + RouterView
  router/
    index.ts              # Маршруты + navigation guard (requiresAuth)
  stores/
    auth.ts               # JWT token (localStorage 'auth_token')
    user.ts               # Текущий пользователь (loadCurrentUser)
    offer.ts              # Offers CRUD + localStorage fallback
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
| `/offer/:id/edit` | `offerEdit` | `OfferEditView` | ✅ |
| `/offer/:id` | `offer` | `OfferView` | ✅ |
| `/deals` | `deals` | `DealView` | — |
| `/login` | `login` | `LoginView` | — |
| `/:any(.*)` | `notFound` | `NotFoundView` | — |

Navigation guard: маршруты с `meta: { requiresAuth: true }` перенаправляют на `/login?redirect=...` при отсутствии токена.

### State (Pinia stores)

Все сторы — options API style (`defineStore` с `state` / `actions` / `getters`).

- `src/stores/auth.ts` — JWT в `localStorage['auth_token']`; actions: `setToken`, `clearToken`
- `src/stores/user.ts` — `User | null`; `loadCurrentUser()` → `UserApi.fetchCurrentUser`; getters: `isAuthenticated`, `isSuperAdmin`
- `src/stores/offer.ts` — `offers`, `currentOffer`, `loading`, `error`; actions: `loadOffers`, `loadOfferById`, `createOffer`, `updateOffer`, `deleteOffer`, `clearCurrentOffer`; getters: `offerById`, `offersCount`; localStorage-фолбэк под ключом `tourismania:offers`
- `src/stores/client.ts` — `clients: Client[]`, mock (реального API нет)

### API Layer (`src/api/`)

- `axios.ts` — **единственный** экземпляр axios. Все API-классы импортируют его.
- `auth.ts` — `Auth` class: `POST /api/login`
- `user.ts` — `UserApi` class: `GET /api/v1/me` с Bearer-токеном
- `offer.ts` — `OfferApi` class: CRUD `/api/v1/offers`; методы `getAll`, `getById`, `create`, `update`, `delete`

---

## Offer Domain

Основная доменная сущность.

### Views

| Файл | Маршрут | Описание |
|---|---|---|
| `src/views/OffersListView.vue` | `/offers` | Список предложений; таблица с `OfferListItem` строками; кнопка «Создать» |
| `src/views/OfferView.vue` | `/offer/:id` | Просмотр предложения; загружает через `loadOfferById`; компоненты из `src/components/offer/` |
| `src/views/OfferEditView.vue` | `/offer/new`, `/offer/:id/edit` | Создание/редактирование; определяет режим по наличию `:id`; вызывает `createOffer` / `updateOffer`, редиректит на просмотр |
| `src/views/Deals/DealView.vue` | `/deals` | Старый OfferView из `/offers` — перемещён при рефакторинге |

### Components (`src/components/offer/`)

| Компонент | Назначение |
|---|---|
| `OfferHeader.vue` | Hero-блок: SVG-карта мира, название, даты, статистика |
| `OfferPriceCard.vue` | Итоговая стоимость + детализация по строкам |
| `OfferSectionHeader.vue` | Заголовок секции (иконка + название + счётчик + итог) |
| `OfferListItem.vue` | Строка таблицы; emits `click` с `id` |
| `OfferBasicInfoForm.vue` | Форма основных полей предложения |
| `FlightCard.vue` | Карточка перелёта: таймлайн сегментов, тултипы пересадок, расчёт длительности |
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
| `DateTimeField.vue` | Дата + время; принимает/возвращает `YYYY-MM-DDTHH:mm:ss` |
| `TimezoneOffsetSelect.vue` | Список UTC-смещений (UTC-12…+14); хранит `+HH:MM`/`-HH:MM`; нормализует legacy IANA через `Intl` |

---

## Types (`src/api/types/offer.ts`)

### Union-типы

| Тип | Значения |
|---|---|
| `FlightClass` | `'economy'` \| `'business'` \| `'comfort'` |
| `Currency` | `'RUB'` \| `'USD'` \| `'EUR'` \| `'TRY'` |
| `TransportCategory` | `'taxi'` \| `'bus'` \| `'transfer'` |

### Offer — корневая сущность

`title`, `clients: Client[]`, `welcomeText`, `startDate`, `endDate`, `flights: Flight[]`, `totalFlightsCost`, `flightsCurrency`, `hotels: Hotel[]`, `totalHotelsCost`, `hotelsCurrency`, `carRentals`, `cruises`, `excursions`, `transport`, `additionalServices`

### Flight — модель сегментов

`Flight { managerComment?, segments: FlightSegment[], price, currency }`  
`FlightSegment { airline, flightNumber, flightClass, from: Airport, to: Airport, departureDateTime, arrivalDateTime }`  
`Airport { city, name, code, timezone: string }`

**Правило:** прямой рейс = 1 сегмент, N пересадок = N+1 сегмент.  
**`Airport.timezone`:** хранится как ISO-офсет (`+03:00`). Для обратной совместимости `FlightCard.zonedToUtcMs` поддерживает legacy IANA-зоны (`Europe/Moscow`).

### Hotel

`name`, `stars`, `address`, `description`, `roomType`, `roomDescription?`, `occupancyType`, `checkIn`, `checkOut`, `nights` (авто-расчёт через `computeNights` из `src/helpers/hotel.ts`), `price`, `currency`, `serviceFee`, `serviceFeeCurrency?`, `images: HotelImage[]`, `managerComment?`

### Client

`name`, `surname`, `email` (уникальный ключ для мультиселекта)

### Остальные типы

`CarRental`, `CarRentalVehicle`, `Cruise`, `CruiseCabin`, `Excursion`, `PublicTransport`, `AdditionalService` — см. `README.md` для полных таблиц полей.

---

## Offer Store: Persistence (localStorage)

Двухслойная архитектура:

1. Пытается вызвать `OfferApi` (реальный бэкенд)
2. При ошибке — фолбэк на `localStorage['tourismania:offers']`

При первом запуске `ensureSeededOffers()` сидит localStorage mock-данными. `newOfferId()` использует `crypto.randomUUID()`.

**Когда переписывать:** после появления стабильного бэкенда — решить, оставить localStorage как offline-кеш или удалить.

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
src/                         # Unit-тесты рядом с файлами (*.spec.ts) — пока не используется
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
| **Review** | PR. Проверка корректности, типов, стилей |
| **Merge** | После апрува — merge в `main` |
| **Docs** | Обновить `README.md`, `.claude/memory`, `CLAUDE.md` если нужно |

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
- [ ] `.claude/memory` актуализирована при изменении доменных сущностей
- [ ] PR ограничен scope issue — нет несвязанных изменений

---

## Code Review

- **Сохранять результат на русском языке.** После каждого code review создавать файл `.claude/code_reviews/{branch_name}_v{N}.md`, где `branch_name` — слэши заменяются на дефисы (`feature/19` → `feature-19`), `N` — порядковый номер ревью для этой ветки (начинается с 1). Файл содержит: дату, ветку, scope диффа, метод ревью, все находки с severity, failure scenario, resolve example и summary-таблицу.
- **Взаимодействие с техническим долгом:** при выявлении проблемы проверять, учтена ли она в `docs/tech_debt/tasks.md`. Если проблема уже описана — не добавлять в summary.

---

## Documentation Maintenance

| Документ | Обновлять при |
|---|---|
| `README.md` | Добавление/изменение маршрутов, доменных типов, компонентов |
| `CLAUDE.md` | Изменение архитектуры, процессов, конвенций |
| `.claude/memory/` | Изменение доменных сущностей, нетривиальных решений |
| `.claude/summary/` | После каждой рабочей сессии |

---

## References

- Документация Vuetify 3: `https://vuetifyjs.com/`
- Документация Vue 3: `https://vuejs.org/`
- Документация Pinia: `https://pinia.vuejs.org/`
- Iconify (иконки): `https://iconify.design/`
- Vite: `https://vitejs.dev/`

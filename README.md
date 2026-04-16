# web

This template should help get you started developing with Vue 3 in Vite.

## Правило наименования файлов

| Тип файла             | Рекомендуемый формат имени | Пример                                |
| --------------------- | -------------------------- | ------------------------------------- |
| Vue компоненты (.vue) | PascalCase                 | `UserProfile.vue`                     |
| Классы TypeScript     | PascalCase (для класса)    | Класс `UserAPI` в файле `user-api.ts` |
| Обычные TS файлы      | kebab-case                 | `user-api.ts`, `auth-store.ts`        |
| Папки                 | kebab-case                 | `/components`, `/api`, `/stores`      |

## Структура проекта

В папке src:

- **Assets**: здесь организуем хранение файлов CSS, шрифтов и изображений.

- **Components**: это автономные компоненты Vue, которые одновременно инкапсулируют структуру шаблона, логику JavaScript и представление CSS.

- **Router**: хранит все настройки роутинга и маршруты.

- **Store**: содержит конфиг и данные хранилища (Vuex, Pinia).

- **UI**. Здесь хранятся компоненты дизайн-системы. Это самые простые элементы интерфейса, которые часто переиспользуются. Обычно эти компоненты взаимодействуют с «внешним миром» через пропсы и события. Обращение из них к стору и роутингу будет лишним. Чаще всего они не отправляют запросов к серверу и не содержат сложной бизнес-логики. Примеры таких компонентов: инпуты, кнопки, алерты и другие UI-элементы.

- **Blocks**. Это компоненты блоков. Блок — небольшой кусок интерфейса, который состоит из компонентов и уже имеет бизнес-логику. Примером блока может служить карточка продукта. Важно также хранить блоки простыми, не обращаться из них к стору, к роуту, не делать лишних запросов. Чаще всего таким компонентам достаточно информации из пропсов. Это позволит переиспользовать один блок для нескольких страниц.

- **Views**. Страницы собираются из блоков и компонентов, но сами по себе являются более сложными компонентами, из которых мы обращаемся к стору, роутингу и т. д.

- **Layouts**. Хранит компоненты-макеты с данными, которые используются для нескольких страниц. На нем обычно присутствует Footer, Header, глобальный прелоадер и др. Например, может быть один макет для авторизованных пользователей, другой — для страницы авторизации.

- **Plugins**. В этой папке храним все сторонние библиотеки, там же их инициализируем и настраиваем.

- **Hooks**. Можно выделить отдельную папку для хранения кода, использующегося в Setup-компонентах (composition API).

- **Helpers**. Помощники будут содержать вспомогательные функции, которые вы хотели бы использовать в своем приложении. Например, функции форматирования, конвертирования данных или валидаторы.

- **API/services**. Папка содержит все функции вызова API.

- **Constants**. Всё, на что в приложении будут ссылаться глобально, но не хранится в .env, можно хранить здесь. Это могут быть статические данные или, например, список типов глобальных окон, которые можно вызвать глобально (через эмиттеры).

- **Interfaces**, **enums**. Папку для типов и перечислений.


## Работа с иконками

Для работы с иконками используется библиотека `https://github.com/unplugin/unplugin-icons`. Все коллекции иконки данной библиотек можно посмотреть [тут](https://iconify.design/).
Если нужен целый набор иконок, то необходимо подключить весь набор иконок, как пример `npm i -D @iconify-json/mdi`.
Но если необходима, какая-то одна конкретная иконка, то на сайте можно получить ее шаблон и лучше завести отдельным компонентом.

Какие коллекции подгружены:
- circle-flags

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Run Component Tests with [Cypress](https://www.cypress.io/)

Тестирование компонентов можно запустить командой ниже

```sh
npm run test:component:dev
```
**Важно помнить**. Для того, чтобы cypress корректно работал с Vite, ему необходима 4, 5 или 6-я версия Vite (а на 2025-08-24 актуальная 7-я).


### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## Модель данных ваучера (`src/api/types/voucher.ts`)

### Вспомогательные типы

| Тип | Значения |
|---|---|
| `FlightClass` | `'economy'` \| `'business'` \| `'comfort'` |
| `Currency` | `'RUB'` \| `'USD'` \| `'EUR'` \| `'TRY'` |
| `TransportCategory` | `'taxi'` \| `'bus'` \| `'transfer'` |

---

### `Tour` — корневая сущность ваучера

Объединяет все составляющие поездки.

| Поле | Тип | Описание |
|---|---|---|
| `title` | `string` | Название тура |
| `welcomeText` | `string` | Приветственный текст от менеджера |
| `startDate` | `string` | Дата начала (ISO) |
| `endDate` | `string` | Дата окончания (ISO) |
| `flights` | `Flight[]` | Перелёты |
| `totalFlightsCost` | `number` | Итог по перелётам |
| `flightsCurrency` | `Currency` | Валюта итога перелётов |
| `hotels` | `Hotel[]` | Отели |
| `totalHotelsCost` | `number` | Итог по отелям |
| `hotelsCurrency` | `Currency` | Валюта итога отелей |
| `carRentals` | `CarRental[]` | Аренда автомобилей |
| `cruises` | `Cruise[]` | Круизы |
| `excursions` | `Excursion[]` | Экскурсии |
| `transport` | `PublicTransport[]` | Общественный транспорт |

---

### `Flight` — перелёт

| Поле | Тип | Описание |
|---|---|---|
| `airline` | `string` | Авиакомпания |
| `departure` | `FlightEndpoint` | Точка вылета |
| `arrival` | `FlightEndpoint` | Точка прилёта |
| `managerComment` | `string?` | Комментарий менеджера |

#### `FlightEndpoint` — точка маршрута перелёта

| Поле | Тип | Описание |
|---|---|---|
| `city` | `string` | Город |
| `dateTime` | `string` | Дата и время (ISO) |
| `flight` | `string` | Номер рейса (напр. `U6 773`) |
| `airport` | `string` | Название аэропорта |
| `airportCode` | `string` | Код аэропорта (напр. `SVX`) |
| `hasLayovers` | `boolean` | Наличие пересадок |
| `flightClass` | `FlightClass` | Класс перелёта |
| `price` | `number` | Стоимость |
| `currency` | `Currency` | Валюта |

---

### `Hotel` — отель

| Поле | Тип | Описание |
|---|---|---|
| `name` | `string` | Название отеля |
| `stars` | `number` | Количество звёзд |
| `address` | `string` | Адрес |
| `description` | `string` | Описание |
| `roomType` | `string` | Тип номера |
| `occupancyType` | `string` | Тип заселения |
| `checkIn` | `string` | Дата заезда (ISO) |
| `checkOut` | `string` | Дата выезда (ISO) |
| `nights` | `number` | Количество ночей |
| `price` | `number` | Стоимость проживания |
| `currency` | `Currency` | Валюта |
| `serviceFee` | `number` | Сервисный сбор |
| `serviceFeeCurrency` | `Currency?` | Валюта сервисного сбора |
| `images` | `HotelImage[]` | Галерея |
| `managerComment` | `string?` | Комментарий менеджера |

#### `HotelImage`

| Поле | Тип | Описание |
|---|---|---|
| `url` | `string` | URL изображения |
| `alt` | `string?` | Alt-текст |

---

### `CarRental` — аренда автомобиля

| Поле | Тип | Описание |
|---|---|---|
| `name` | `string` | Название прокатной компании |
| `startLocation` | `string` | Место получения |
| `endLocation` | `string` | Место возврата |
| `vehicles` | `CarRentalVehicle[]` | Варианты автомобилей |
| `managerComment` | `string?` | Комментарий менеджера |

#### `CarRentalVehicle`

| Поле | Тип | Описание |
|---|---|---|
| `vehicle` | `string` | Идентификатор/тип автомобиля |
| `name` | `string` | Название модели |
| `price` | `number` | Стоимость |
| `currency` | `Currency` | Валюта |

---

### `Cruise` — круиз

| Поле | Тип | Описание |
|---|---|---|
| `name` | `string` | Название круиза |
| `gallery` | `string[]` | Галерея (массив URL) |
| `cabins` | `CruiseCabin[]` | Варианты кают |
| `managerComment` | `string?` | Комментарий менеджера |

#### `CruiseCabin`

| Поле | Тип | Описание |
|---|---|---|
| `description` | `string` | Описание каюты |
| `price` | `number` | Стоимость |
| `currency` | `Currency` | Валюта |

---

### `Excursion` — экскурсия

| Поле | Тип | Описание |
|---|---|---|
| `date` | `Date \| null \| undefined` | Дата (опционально) |
| `city` | `string \| null \| undefined` | Город (опционально) |
| `price` | `number` | Стоимость |
| `currency` | `Currency` | Валюта |
| `managerComment` | `string` | Комментарий менеджера |
| `gallery` | `HotelImage[]` | Галерея |

---

### `PublicTransport` — общественный транспорт

| Поле | Тип | Описание |
|---|---|---|
| `datetime` | `string` | Дата и время (ISO) |
| `category` | `TransportCategory` | Категория: такси / автобус / трансфер |
| `pickupLocation` | `string` | Место посадки |
| `dropoffLocation` | `string` | Место высадки |
| `duration` | `number` | Длительность в минутах |
| `price` | `number` | Стоимость |
| `currency` | `Currency` | Валюта |
| `managerComment` | `string?` | Комментарий менеджера |

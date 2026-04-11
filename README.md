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

Актуальное дерево `src` (без бинарных файлов):

```
src/
├── App.vue          # корневой компонент приложения
├── main.ts          # точка входа; здесь же подключаются Pinia, Vue Router и Vuetify
├── api/             # вызовы HTTP API и типы ответов/запросов
│   └── types/       # типы, связанные с API (например, пользователь, авторизация)
├── assets/          # глобальные стили (SCSS/CSS), шрифты, изображения, логотипы
├── blocks/          # составные блоки интерфейса (шапка, форма входа, подвал и т. п.)
├── components/      # переиспользуемые Vue-компоненты
│   └── icons/       # отдельные иконки как компоненты (соцсети и др.)
├── layouts/         # макеты страниц (общая оболочка для нескольких маршрутов)
├── router/          # конфигурация маршрутов
├── stores/          # хранилища Pinia
└── views/           # страницы (view-компоненты); при росте — подпапки по разделам (например, `views/Offers/`)
```

Назначение слоёв (как договорённость):

- **assets** — стили, шрифты, картинки; не бизнес-логика.
- **api** — функции запросов к бэкенду; типы для контрактов API — в `api/types`.
- **components** — автономные Vue-компоненты (шаблон, логика, стили); по возможности без привязки к конкретной странице. Подпапка **icons** — обёртки над отдельными иконками.
- **blocks** — фрагменты UI из нескольких компонентов; держать по возможности на пропсах и событиях, чтобы проще переиспользовать.
- **views** — страницы: здесь уместны обращения к `stores`, `router` и вызовы API.
- **layouts** — общие каркасы (например, область под контент роутера, app bar, drawer).
- **router** — описание маршрутов.
- **stores** — состояние и действия Pinia.

Папок **`ui/`**, **`plugins/`**, **`hooks/`**, **`helpers/`**, **`constants/`** и отдельных каталогов под **interfaces/enums** в репозитории сейчас нет; при появлении новых слоёв имеет смысл дополнить это описание. Инициализация сторонних библиотек (Vuetify и т. д.) выполняется в **`main.ts`**, а не в отдельной папке `plugins`.


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
**Важно помнить**. Совместимость Cypress с Vite зависит от версий обоих пакетов; в проекте зафиксированы версии в `package.json` (сейчас Vite 6.x).


### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

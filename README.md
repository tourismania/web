# web

This template should help get you started developing with Vue 3 in Vite.

## Структура проекта

В папке src:

- **Assets**: здесь организуем хранение файлов CSS, шрифтов и изображений.

- **Components**: это автономные компоненты Vue, которые одновременно инкапсулируют структуру шаблона, логику JavaScript и представление CSS.

- **Router**: хранит все настройки роутинга и маршруты.

- **Store**: содержит конфиг и данные хранилища (Vuex, Pinia).
- Components (ui). Здесь хранятся компоненты дизайн-системы. Это самые простые элементы интерфейса, которые часто переиспользуются. Обычно эти компоненты взаимодействуют с «внешним миром» через пропсы и события. Обращение из них к стору и роутингу будет лишним. Чаще всего они не отправляют запросов к серверу и не содержат сложной бизнес-логики. 

	Примеры таких компонентов: инпуты, кнопки, алерты и другие UI-элементы.
- **Blocks**. Это компоненты блоков. Блок — небольшой кусок интерфейса, который состоит из компонентов и уже имеет бизнес-логику. Примером блока может служить карточка продукта. Важно также хранить блоки простыми, не обращаться из них к стору, к роуту, не делать лишних запросов. Чаще всего таким компонентам достаточно информации из пропсов. Это позволит переиспользовать один блок для нескольких страниц.

- **Views/pages**. Страницы собираются из блоков и компонентов, но сами по себе являются более сложными компонентами, из которых мы обращаемся к стору, роутингу и т. д.

- **Layouts**. Хранит компоненты-макеты с данными, которые используются для нескольких страниц. На нем обычно присутствует Footer, Header, глобальный прелоадер и др. Например, может быть один макет для авторизованных пользователей, другой — для страницы авторизации.

- **Plugins**. В этой папке храним все сторонние библиотеки, там же их инициализируем и настраиваем.

- **Hooks**. Можно выделить отдельную папку для хранения кода, использующегося в Setup-компонентах (composition API).

- **Helpers**. Помощники будут содержать вспомогательные функции, которые вы хотели бы использовать в своем приложении. Например, функции форматирования, конвертирования данных или валидаторы.

- **API/services**. Папка содержит все функции вызова API.

- **Constants**. Всё, на что в приложении будут ссылаться глобально, но не хранится в .env, можно хранить здесь. Это могут быть статические данные или, например, список типов глобальных окон, которые можно вызвать глобально (через эмиттеры).

- **Interfaces**, **enums**. Если вы используете Typescript, то сразу можно выделить папку для типов и перечислений.


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

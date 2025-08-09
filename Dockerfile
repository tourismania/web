FROM node:23.4-alpine as builder

RUN apk add --no-cache git;

# Для тонкой настройки разрешений кода приложения в контейнере создадим подкаталог node_modules
# в каталоге /home/node вместе с каталогом app. Создание этих каталогов обеспечит наличие желаемых разрешений,
# что будет важно при создании локальных модулей узла в контейнере с помощью команды npm install.
# В дополнение к созданию этих каталогов мы зададим пользователя node как их владельца:
RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY . .

RUN npm install

RUN npm run build-only

FROM builder as local

CMD [ "npm", "run", "dev" ]

FROM nginx:1.21.6-alpine as production

COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/node/app/dist/ /srv

WORKDIR /srv

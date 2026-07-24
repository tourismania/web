// Общая константа пути логина — используется и в маршрутах (router/index.ts),
// и вне роутера (например, в axios-интерцепторе при 401), где импортировать
// сам router небезопасно из-за циклических зависимостей (router -> views -> stores -> api -> axios).
export const LOGIN_ROUTE_PATH = '/login'

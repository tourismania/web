import { defineStore } from 'pinia'
import type { ProgramDay } from '@/types/voucher'

/** Ключ — идентификатор программы из useVoucherProgramStore */
export type ProgramScheduleKey = string

interface VoucherScheduleState {
  /** Программа состоит из дней; каждый день — из активностей */
  daysByProgramId: Record<ProgramScheduleKey, ProgramDay[]>
}

const newYorkSchedule: ProgramDay[] = [
  {
    id: 'ny-day-1',
    date: '27.09.2025',
    restaurants: '-',
    activities: [
      {
        id: 'ny-day-1-a1',
        title: 'Заселение в отель',
        note: 'Заселение в отель поздно вечером. Отдых после перелета. ',
        route: 'Аэропорт - отель https://maps.app.goo.gl/SpEqSWmQrCCR1mYc9',
      },
    ],
  },
  {
    id: 'ny-day-2',
    date: '28.09.2025',
    restaurants:
      '1. Smith & Wollensky 2. Ralph\'s Coffee 3. Tartinery Café - Bar | Park Ave',
    activities: [
      {
        id: 'ny-day-2-a1',
        title: 'Отель - Таймс-сквер',
        note:
          'По дороге посетите Центральный вокзал, SUMMIT One Vanderbilt (посетите обзорную площадку по NewYork Pass), погуляйте по Брайант-парк. Дойдя до Таймс-сквер возьмите билеты на обзорные автобусы BigBusTours (по NewYork Pass) на два дня. ',
        route: 'Ссылка на маршрут  https://maps.app.goo.gl/aGa9tF8dqHsTuZf27',
      },
      {
        id: 'ny-day-2-a2',
        title: 'Обзорный автобус  ',
        note:
          'Возьмите маршрут Uptown Loop (синий маршрут). По маршруту вы посетите Rockefeller Center, The Metropolitan Museum of Art и тд .',
        route: 'https://www.bigbustours.com/en/new-york/blue-route-new-york',
      },
    ],
  },
  {
    id: 'ny-day-3',
    date: '29.09.2025',
    restaurants: `1. Sarabeth's Park Avenue South
2. The Wilson
3. Sadelle's New York 4. Jack's Wife Freda 5. Hudson Eats`,
    activities: [
      {
        id: 'ny-day-3-a1',
        title: 'Обзорный автобус ',
        note:
          'Возьмите маршрут Downtown Loop (красный маршрут). По маршруту вы посетите Empire State Building, SoHo, Brooklyn Bridge, Wall Street, World Trade Center, Chelsea / Pier 57. На остановках можно по NewYork Pass посетить смотровые площадки Empire State Building, One World Observatory, Edge. А также музей 9/11. ',
        route: 'https://www.bigbustours.com/en/new-york/red-route-new-york',
      },
      {
        id: 'ny-day-3-a2',
        title: 'Джаз-клуб',
        note: 'https://www.birdlandjazz.com/page/2/  или https://www.bluenotejazz.com/nyc/',
        route:
          'Отель - джаз-клуб №1 https://maps.app.goo.gl/TcJN3c6nx7nUmZf68 Отель - джаз-клуб №2 https://maps.app.goo.gl/btKjR6BzGuxhpthV9',
      },
    ],
  },
]

export const useVoucherActivityStore = defineStore('voucherActivity', {
  state: (): VoucherScheduleState => ({
    daysByProgramId: {
      'new-york': newYorkSchedule,
      orlando: newYorkSchedule,
    },
  }),
  getters: {
    daysForProgram:
      (state) =>
      (programId: string): ProgramDay[] =>
        state.daysByProgramId[programId] ?? [],
  },
})

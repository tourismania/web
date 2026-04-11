import { defineStore } from 'pinia'
import type { ProgramMeta } from '@/types/voucher'
import headerImg0 from '@/assets/images/examples/img.png'
import headerImg1 from '@/assets/images/examples/img_1.png'
import headerImg2 from '@/assets/images/examples/img_2.png'

export const useVoucherProgramStore = defineStore('voucherProgram', {
  state: () => ({
    programs: [
      {
        id: 'new-york',
        tabValue: 'two',
        title: 'Программа Нью-Йорк',
        weatherNote:
          'Погода в октябре прохладная, средняя температура: +12…+20°C, иногда дождь. Как одеваться: лёгкие свитера, джинсы, куртка, ветровка, удобная обувь для прогулок, зонтик.',
        headerImageSrcs: [headerImg0, headerImg1, headerImg2],
      },
      {
        id: 'orlando',
        tabValue: 'three',
        title: 'Программа Орландо',
        carouselSrcs: [
          'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
          'https://cdn.vuetifyjs.com/images/cards/hotel.jpg',
          'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        ],
      },
    ] as ProgramMeta[],
  }),
  getters: {
    programByTab:
      (state) =>
      (tabValue: string): ProgramMeta | undefined =>
        state.programs.find((p) => p.tabValue === tabValue),
  },
})

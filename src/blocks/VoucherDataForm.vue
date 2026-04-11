<script setup lang="ts">
import { ref } from 'vue'
import type { AccommodationStay, ProgramDay } from '@/types/voucher'
import { useVoucherFlightStore } from '@/stores/voucher-flight'
import { useVoucherAccommodationStore } from '@/stores/voucher-accommodation'
import { useVoucherPublicTransportStore } from '@/stores/voucher-public-transport'
import { useVoucherExcursionStore } from '@/stores/voucher-excursion'
import { useVoucherRouteSheetStore } from '@/stores/voucher-route-sheet'
import { useVoucherProgramStore } from '@/stores/voucher-program'
import { useVoucherActivityStore } from '@/stores/voucher-activity'

const flightStore = useVoucherFlightStore()
const accommodationStore = useVoucherAccommodationStore()
const publicTransportStore = useVoucherPublicTransportStore()
const excursionStore = useVoucherExcursionStore()
const routeSheetStore = useVoucherRouteSheetStore()
const programStore = useVoucherProgramStore()
const activityStore = useVoucherActivityStore()

const panelModel = ref<string[]>([
  'flights',
  'stay',
  'transport',
  'excursions',
  'summary',
  'programs',
  'activities',
])

function setNights(stay: AccommodationStay, value: string) {
  const n = parseInt(value, 10)
  stay.nights = Number.isFinite(n) ? n : 0
}

function carouselLines(programId: string): string {
  const p = programStore.programs.find((x) => x.id === programId)
  return (p?.carouselSrcs ?? []).join('\n')
}

function setCarouselLines(programId: string, text: string) {
  const p = programStore.programs.find((x) => x.id === programId)
  if (!p) return
  const lines = text.split('\n').map((s) => s.trim()).filter(Boolean)
  p.carouselSrcs = lines.length ? lines : undefined
}

function headerImageLines(programId: string): string {
  const p = programStore.programs.find((x) => x.id === programId)
  return (p?.headerImageSrcs ?? []).join('\n')
}

function setHeaderImageLines(programId: string, text: string) {
  const p = programStore.programs.find((x) => x.id === programId)
  if (!p) return
  const lines = text.split('\n').map((s) => s.trim()).filter(Boolean)
  p.headerImageSrcs = lines.length ? lines : undefined
}

function daysFor(programId: string): ProgramDay[] {
  return activityStore.daysForProgram(programId)
}
</script>

<template>
  <v-card
    class="voucher-data-form"
    theme="myCustomDarkTheme"
    variant="flat"
  >
    <v-card-title class="text-h6 text-wrap">
      Редактирование путёвки
    </v-card-title>
    <v-card-subtitle class="text-wrap pb-2">
      Изменения сразу отображаются слева (данные в Pinia).
    </v-card-subtitle>

    <v-card-text class="voucher-data-form__scroll">
      <v-expansion-panels v-model="panelModel" multiple variant="accordion">
        <!-- Перелёты -->
        <v-expansion-panel value="flights">
          <v-expansion-panel-title>Перелёты</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div
              v-for="(seg, idx) in flightStore.segments"
              :key="seg.id"
              class="mb-6"
            >
              <p class="text-subtitle-2 mb-2">Сегмент {{ idx + 1 }}</p>
              <v-text-field
                v-model="seg.routeTitle"
                class="mb-2"
                density="compact"
                label="Маршрут (заголовок)"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.airline.name"
                class="mb-2"
                density="compact"
                label="Авиакомпания"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.flightNumber"
                class="mb-2"
                density="compact"
                label="Рейс"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.aircraftModel"
                class="mb-2"
                density="compact"
                label="ВС"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.serviceClass"
                class="mb-2"
                density="compact"
                label="Класс"
                variant="outlined"
              />
              <v-switch
                v-model="seg.hasBaggage"
                class="mb-2"
                color="primary"
                density="compact"
                hide-details
                label="Багаж включён"
              />
              <v-text-field
                v-model="seg.duration"
                class="mb-2"
                density="compact"
                label="Длительность"
                variant="outlined"
              />
              <v-switch
                v-model="seg.isDirect"
                class="mb-2"
                color="primary"
                density="compact"
                hide-details
                label="Прямой рейс"
              />
              <v-text-field
                v-model="seg.stopsLabel"
                class="mb-2"
                density="compact"
                label="Пересадки (подпись)"
                variant="outlined"
              />
              <v-number-input
                v-model="seg.cost"
                class="mb-2"
                density="compact"
                label="Стоимость"
                variant="outlined"
              />
              <p class="text-caption mb-1">Вылет</p>
              <v-text-field
                v-model="seg.departure.date"
                class="mb-1"
                density="compact"
                label="Дата"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.departure.time"
                class="mb-1"
                density="compact"
                label="Время"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.departure.city"
                class="mb-1"
                density="compact"
                label="Город"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.departure.airportName"
                class="mb-1"
                density="compact"
                label="Аэропорт"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.departure.airportCode"
                class="mb-3"
                density="compact"
                label="Код"
                variant="outlined"
              />
              <p class="text-caption mb-1">Прилёт</p>
              <v-text-field
                v-model="seg.arrival.date"
                class="mb-1"
                density="compact"
                label="Дата"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.arrival.time"
                class="mb-1"
                density="compact"
                label="Время"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.arrival.city"
                class="mb-1"
                density="compact"
                label="Город"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.arrival.airportName"
                class="mb-1"
                density="compact"
                label="Аэропорт"
                variant="outlined"
              />
              <v-text-field
                v-model="seg.arrival.airportCode"
                density="compact"
                label="Код"
                variant="outlined"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Жильё -->
        <v-expansion-panel value="stay">
          <v-expansion-panel-title>Жильё</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              v-model="accommodationStore.sectionTotal"
              class="mb-3"
              density="compact"
              hide-details
              label="Итого"
              variant="outlined"
            />
            <div
              v-for="(stay, idx) in accommodationStore.stays"
              :key="stay.id"
              class="mb-4"
            >
              <p class="text-subtitle-2 mb-2">Размещение {{ idx + 1 }}</p>
              <v-text-field
                v-model="stay.date"
                class="mb-1"
                density="compact"
                label="Дата"
                variant="outlined"
              />
              <v-text-field
                v-model="stay.placement"
                class="mb-1"
                density="compact"
                label="Отель / тип"
                variant="outlined"
              />
              <v-text-field
                :model-value="String(stay.nights)"
                class="mb-1"
                density="compact"
                label="Ночей"
                type="number"
                variant="outlined"
                @update:model-value="setNights(stay, $event)"
              />
              <v-text-field
                v-model="stay.cityAndAddress"
                class="mb-1"
                density="compact"
                label="Адрес"
                variant="outlined"
              />
              <v-textarea
                v-model="stay.extraInfo"
                auto-grow
                class="mb-1"
                density="compact"
                label="Доп. инфо"
                rows="2"
                variant="outlined"
              />
              <v-text-field
                v-model="stay.cost"
                density="compact"
                label="Стоимость"
                variant="outlined"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Транспорт -->
        <v-expansion-panel value="transport">
          <v-expansion-panel-title>Общественный транспорт</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              v-model="publicTransportStore.sectionTotal"
              class="mb-3"
              density="compact"
              hide-details
              label="Итого"
              variant="outlined"
            />
            <div
              v-for="(leg, idx) in publicTransportStore.legs"
              :key="leg.id"
              class="mb-4"
            >
              <p class="text-subtitle-2 mb-2">Поездка {{ idx + 1 }}</p>
              <v-text-field
                v-model="leg.date"
                class="mb-1"
                density="compact"
                label="Дата"
                variant="outlined"
              />
              <v-text-field
                v-model="leg.category"
                class="mb-1"
                density="compact"
                label="Категория"
                variant="outlined"
              />
              <v-text-field
                v-model="leg.note"
                class="mb-1"
                density="compact"
                label="Примечание"
                variant="outlined"
              />
              <v-text-field
                v-model="leg.cost"
                density="compact"
                label="Стоимость"
                variant="outlined"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Экскурсии -->
        <v-expansion-panel value="excursions">
          <v-expansion-panel-title>Экскурсии и развлечения</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-text-field
              v-model="excursionStore.sectionTotal"
              class="mb-3"
              density="compact"
              hide-details
              label="Итого"
              variant="outlined"
            />
            <div
              v-for="(item, idx) in excursionStore.items"
              :key="item.id"
              class="mb-4"
            >
              <p class="text-subtitle-2 mb-2">Позиция {{ idx + 1 }}</p>
              <v-text-field
                v-model="item.date"
                class="mb-1"
                density="compact"
                label="Дата"
                variant="outlined"
              />
              <v-text-field
                v-model="item.category"
                class="mb-1"
                density="compact"
                label="Категория"
                variant="outlined"
              />
              <v-text-field
                v-model="item.note"
                class="mb-1"
                density="compact"
                label="Примечание / ссылка"
                variant="outlined"
              />
              <v-text-field
                v-model="item.cost"
                density="compact"
                label="Стоимость"
                variant="outlined"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Сводка маршрутного листа -->
        <v-expansion-panel value="summary">
          <v-expansion-panel-title>Итого (таблица внизу)</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div
              v-for="(row, idx) in routeSheetStore.summaryRows"
              :key="idx"
              class="d-flex gap-2 mb-2"
            >
              <v-text-field
                v-model="row.category"
                density="compact"
                hide-details
                label="Категория"
                variant="outlined"
              />
              <v-text-field
                v-model="row.cost"
                density="compact"
                hide-details
                label="Сумма"
                variant="outlined"
              />
            </div>
            <v-text-field
              v-model="routeSheetStore.summaryFooter.category"
              class="mb-2"
              density="compact"
              label="Подпись последней строки (категория)"
              variant="outlined"
            />
            <v-text-field
              v-model="routeSheetStore.summaryFooter.cost"
              density="compact"
              label="Итоговая строка"
              variant="outlined"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Программы -->
        <v-expansion-panel value="programs">
          <v-expansion-panel-title>Программы (вкладки)</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div
              v-for="p in programStore.programs"
              :key="p.id"
              class="mb-6"
            >
              <p class="text-subtitle-2 mb-2">{{ p.id }}</p>
              <v-text-field
                v-model="p.title"
                class="mb-2"
                density="compact"
                label="Заголовок вкладки"
                variant="outlined"
              />
              <v-textarea
                v-model="p.weatherNote"
                auto-grow
                class="mb-2"
                density="compact"
                label="Текст о погоде / советы"
                rows="3"
                variant="outlined"
              />
              <v-textarea
                :model-value="headerImageLines(p.id)"
                auto-grow
                class="mb-2"
                density="compact"
                hint="По одному URL на строку (галерея сверху)"
                label="Картинки шапки (URL)"
                persistent-hint
                rows="2"
                variant="outlined"
                @update:model-value="setHeaderImageLines(p.id, $event)"
              />
              <v-textarea
                :model-value="carouselLines(p.id)"
                auto-grow
                density="compact"
                hint="По одному URL на строку (карусель)"
                label="Карусель (URL)"
                persistent-hint
                rows="2"
                variant="outlined"
                @update:model-value="setCarouselLines(p.id, $event)"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Активности -->
        <v-expansion-panel value="activities">
          <v-expansion-panel-title>Расписание активностей</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div
              v-for="meta in programStore.programs"
              :key="meta.id + '-sched'"
              class="mb-6"
            >
              <p class="text-subtitle-2 mb-2">{{ meta.title }}</p>
              <div
                v-for="(day, dIdx) in daysFor(meta.id)"
                :key="day.id"
                class="mb-4 pl-2 voucher-data-form__day"
              >
                <p class="text-caption mb-2">День {{ dIdx + 1 }}</p>
                <v-text-field
                  v-model="day.date"
                  class="mb-2"
                  density="compact"
                  label="Дата"
                  variant="outlined"
                />
                <v-textarea
                  v-model="day.restaurants"
                  auto-grow
                  class="mb-2"
                  density="compact"
                  label="Рестораны"
                  rows="2"
                  variant="outlined"
                />
                <div
                  v-for="(act, aIdx) in day.activities"
                  :key="act.id"
                  class="mb-3 ml-2"
                >
                  <p class="text-caption">Активность {{ aIdx + 1 }}</p>
                  <v-text-field
                    v-model="act.title"
                    class="mb-1"
                    density="compact"
                    label="Название"
                    variant="outlined"
                  />
                  <v-textarea
                    v-model="act.note"
                    auto-grow
                    class="mb-1"
                    density="compact"
                    label="Примечание"
                    rows="2"
                    variant="outlined"
                  />
                  <v-textarea
                    v-model="act.route"
                    auto-grow
                    density="compact"
                    label="Маршрут / ссылки"
                    rows="2"
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.voucher-data-form {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.voucher-data-form__scroll {
  max-height: min(78vh, 900px);
  overflow-y: auto;
  padding-top: 0;
}

.gap-2 {
  gap: 8px;
}

.voucher-data-form__day {
  border-left: 2px solid rgba(255, 255, 255, 0.22);
}
</style>

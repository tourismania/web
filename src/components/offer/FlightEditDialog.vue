<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Flight, FlightSegment, Airport, FlightClass, Currency } from '@/api/types/offer'
import DateTimeField from '@/components/common/DateTimeField.vue'
import AirportSelect from '@/components/common/AirportSelect.vue'

const props = defineProps<{
  modelValue: boolean
  flight: Flight
  editingIndex: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [flight: Flight]
}>()

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCIES: Currency[] = ['RUB', 'USD', 'EUR', 'TRY']
const FLIGHT_CLASSES: FlightClass[] = ['economy', 'comfort', 'business']

// ─── Draft ────────────────────────────────────────────────────────────────────

const draft = ref<Flight>(cloneFlight(props.flight))

function cloneFlight(f: Flight): Flight {
  return JSON.parse(JSON.stringify(f))
}

// Sync draft when dialog opens with new flight data
watch(
  () => props.flight,
  (val) => {
    draft.value = cloneFlight(val)
  },
)

// ─── Airport helpers ──────────────────────────────────────────────────────────

function blankAirport(): Airport {
  return { city: '', name: '', code: '', timezone: '+03:00' }
}

function blankSegment(): FlightSegment {
  return {
    airline: '',
    flightNumber: '',
    flightClass: 'economy',
    from: blankAirport(),
    to: blankAirport(),
    departureDateTime: '',
    arrivalDateTime: '',
  }
}

// ─── Transfer management ──────────────────────────────────────────────────────

/**
 * Adds a transfer. Before: [..., last{from:A, to:B}]
 * After: [..., last{from:A, to:TRANSFER}, new{from:TRANSFER, to:B}]
 */
function addTransfer() {
  const segs = draft.value.segments
  const last = segs[segs.length - 1]
  const finalAirport: Airport = JSON.parse(JSON.stringify(last.to))
  const newSeg: FlightSegment = {
    airline: '',
    flightNumber: '',
    flightClass: last.flightClass,
    from: blankAirport(),
    to: finalAirport,
    departureDateTime: '',
    arrivalDateTime: last.arrivalDateTime,
  }
  segs.push(newSeg)
}

/**
 * Removes transfer at transferIdx (1..N-1).
 * Merges segments[transferIdx-1] and segments[transferIdx].
 */
function removeTransfer(transferIdx: number) {
  const segs = draft.value.segments
  if (transferIdx < 1 || transferIdx >= segs.length) return
  const prev = segs[transferIdx - 1]
  const next = segs[transferIdx]
  prev.to = JSON.parse(JSON.stringify(next.to))
  prev.arrivalDateTime = next.arrivalDateTime
  segs.splice(transferIdx, 1)
}

/**
 * Mirrors segments[k-1].to → segments[k].from for all transfer points.
 */
function syncTransferEndpoints() {
  const segs = draft.value.segments
  for (let k = 1; k < segs.length; k++) {
    segs[k].from = JSON.parse(JSON.stringify(segs[k - 1].to))
  }
}

// ─── Airport v-model helpers ──────────────────────────────────────────────────

function setFromAirport(segIdx: number, airport: Airport | null) {
  draft.value.segments[segIdx].from = airport ?? blankAirport()
}

function setToAirport(segIdx: number, airport: Airport | null) {
  draft.value.segments[segIdx].to = airport ?? blankAirport()
}

function getAirportOrNull(airport: Airport): Airport | null {
  return airport.code ? airport : null
}

// ─── Save / close ─────────────────────────────────────────────────────────────

function save() {
  syncTransferEndpoints()
  emit('save', JSON.parse(JSON.stringify(draft.value)))
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="700"
    scrollable
    @update:model-value="(v) => { if (!v) close() }"
  >
    <v-card>
      <v-card-title class="dialog-title">
        <v-icon class="mr-2">mdi-airplane</v-icon>
        {{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} перелёт
      </v-card-title>
      <v-divider />

      <v-card-text class="dialog-body">
        <!-- Общие параметры -->
        <v-row dense>
          <v-col cols="5">
            <v-text-field
              v-model.number="draft.price"
              label="Цена"
              type="number"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="draft.currency"
              :items="CURRENCIES"
              label="Валюта"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="draft.managerComment"
              label="Комментарий менеджера"
              density="compact"
              variant="outlined"
              rows="2"
              hide-details
              auto-grow
            />
          </v-col>
        </v-row>

        <!-- ── Точка отправления ──────────────────────────────────── -->
        <div class="endpoint-card endpoint-card--departure mt-3">
          <div class="endpoint-card__title">
            <v-icon size="16" class="mr-1">mdi-airplane-takeoff</v-icon>
            Точка отправления
          </div>

          <div class="leg-card__title">
            <v-icon size="14" class="mr-1">mdi-airplane</v-icon>
            Рейс
          </div>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="draft.segments[0].airline"
                label="Авиакомпания"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="draft.segments[0].flightNumber"
                label="Рейс"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="draft.segments[0].flightClass"
                :items="FLIGHT_CLASSES"
                label="Класс"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>

            <!-- Airport selector: откуда -->
            <v-col cols="12">
              <AirportSelect
                :model-value="getAirportOrNull(draft.segments[0].from)"
                label="Откуда"
                @update:model-value="(v) => setFromAirport(0, v)"
              />
            </v-col>

            <v-col cols="12">
              <DateTimeField
                v-model="draft.segments[0].departureDateTime"
                label="Вылет (местное)"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ── Пересадки ──────────────────────────────────────────── -->
        <template v-for="k in draft.segments.length - 1" :key="`transfer-${k}`">
          <div class="transfer-card mt-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="transfer-card__title">
                <v-icon size="14" class="mr-1">mdi-airplane-clock</v-icon>
                Пересадка {{ k }}
              </div>
              <v-btn icon size="x-small" variant="text" color="error" @click="removeTransfer(k)">
                <v-icon size="14">mdi-delete</v-icon>
              </v-btn>
            </div>

            <v-row dense>
              <!-- Аэропорт пересадки = segments[k-1].to -->
              <v-col cols="12">
                <AirportSelect
                  :model-value="getAirportOrNull(draft.segments[k - 1].to)"
                  label="Аэропорт пересадки"
                  @update:model-value="(v) => setToAirport(k - 1, v)"
                />
              </v-col>
              <v-col cols="12">
                <DateTimeField
                  v-model="draft.segments[k - 1].arrivalDateTime"
                  label="Прилёт (местное)"
                />
              </v-col>
            </v-row>

            <div class="leg-card__title mt-3">
              <v-icon size="14" class="mr-1">mdi-airplane</v-icon>
              Рейс после пересадки в {{ draft.segments[k - 1].to.city || '…' }}
            </div>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="draft.segments[k].airline"
                  label="Авиакомпания"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="draft.segments[k].flightNumber"
                  label="Рейс"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="draft.segments[k].flightClass"
                  :items="FLIGHT_CLASSES"
                  label="Класс"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <DateTimeField
                  v-model="draft.segments[k].departureDateTime"
                  label="Вылет с пересадки (местное)"
                />
              </v-col>
            </v-row>
          </div>
        </template>

        <!-- Добавить пересадку -->
        <div class="d-flex justify-center mt-3 mb-1">
          <v-btn variant="tonal" prepend-icon="mdi-plus" size="small" @click="addTransfer">
            Добавить пересадку
          </v-btn>
        </div>

        <!-- ── Точка прибытия ─────────────────────────────────────── -->
        <div class="endpoint-card endpoint-card--arrival mt-2">
          <div class="endpoint-card__title">
            <v-icon size="16" class="mr-1">mdi-airplane-landing</v-icon>
            Точка прибытия
          </div>
          <v-row dense>
            <v-col cols="12">
              <AirportSelect
                :model-value="getAirportOrNull(draft.segments[draft.segments.length - 1].to)"
                label="Куда"
                @update:model-value="(v) => setToAirport(draft.segments.length - 1, v)"
              />
            </v-col>
            <v-col cols="12">
              <DateTimeField
                v-model="draft.segments[draft.segments.length - 1].arrivalDateTime"
                label="Прилёт (местное)"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="close">Отмена</v-btn>
        <v-btn variant="tonal" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.dialog-title {
  font-size: 1rem !important;
  font-weight: 600;
  padding: 12px 16px !important;
  display: flex;
  align-items: center;
}

.dialog-body {
  padding: 16px !important;
}

.endpoint-card,
.leg-card,
.transfer-card {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);

  &__title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
}

.endpoint-card {
  border-color: rgba(54, 170, 184, 0.32);
  background: rgba(54, 170, 184, 0.06);

  &--departure &__title,
  &--arrival &__title {
    color: rgba(54, 170, 184, 0.95);
  }
}

.leg-card {
  background: rgba(255, 255, 255, 0.025);
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.18);

  &__title {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.65);
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
}

.transfer-card {
  border-color: rgba(239, 159, 59, 0.35);
  background: rgba(239, 159, 59, 0.05);

  &__title {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(239, 159, 59, 0.95);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    text-transform: uppercase;
  }
}
</style>

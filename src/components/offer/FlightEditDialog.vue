<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import type { Flight, FlightSegment, Currency } from '@/api/types/offer'
import DateTimeField from '@/components/common/DateTimeField.vue'
import AirportSelect from '@/components/common/AirportSelect.vue'
import AirlineSelect from '@/components/common/AirlineSelect.vue'
import { CABIN_CLASS_OPTIONS, blankSegment, priceRule } from '@/helpers/flight'
import { required, type FieldRule } from '@/helpers/rules'

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
const FLIGHT_NUMBER_MAX_LENGTH = 10
const REQUIRED_RULES: FieldRule[] = [required]
const PRICE_RULES: FieldRule[] = [required, priceRule]

// ─── Draft ────────────────────────────────────────────────────────────────────

const draft = ref<Flight>(cloneFlight(props.flight))
const form = ref<VForm | null>(null)

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

// ─── Transfer management ──────────────────────────────────────────────────────

/**
 * Adds a transfer. Before: [..., last{from:A, to:B}]
 * After: [..., last{from:A, to:TRANSFER}, new{from:TRANSFER, to:B}]
 * Класс нового сегмента — «Не указан», авиакомпания не выбрана.
 */
function addTransfer() {
  const segs = draft.value.segments
  const last = segs[segs.length - 1]
  const newSeg: FlightSegment = {
    ...blankSegment(),
    arrivalAirport: JSON.parse(JSON.stringify(last.arrivalAirport)),
    arrivalAt: last.arrivalAt,
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
  prev.arrivalAirport = JSON.parse(JSON.stringify(next.arrivalAirport))
  prev.arrivalAt = next.arrivalAt
  segs.splice(transferIdx, 1)
}

/**
 * Mirrors segments[k-1].arrivalAirport → segments[k].departureAirport for all transfer points.
 */
function syncTransferEndpoints() {
  const segs = draft.value.segments
  for (let k = 1; k < segs.length; k++) {
    segs[k].departureAirport = JSON.parse(JSON.stringify(segs[k - 1].arrivalAirport))
  }
}

// ─── Save / close ─────────────────────────────────────────────────────────────

async function save() {
  const result = await form.value?.validate()
  if (!result?.valid) return
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
        <v-form ref="form" @submit.prevent>
          <!-- Общие параметры -->
          <v-row dense>
            <v-col cols="5">
              <v-text-field
                v-model="draft.price"
                :rules="PRICE_RULES"
                label="Цена"
                inputmode="decimal"
                density="compact"
                variant="outlined"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="draft.currency"
                :items="CURRENCIES"
                :rules="REQUIRED_RULES"
                label="Валюта"
                density="compact"
                variant="outlined"
                hide-details="auto"
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
                <AirlineSelect
                  v-model="draft.segments[0].airline"
                  :rules="REQUIRED_RULES"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="draft.segments[0].flightNumber"
                  :maxlength="FLIGHT_NUMBER_MAX_LENGTH"
                  label="Рейс"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="draft.segments[0].cabinClass"
                  :items="CABIN_CLASS_OPTIONS"
                  label="Класс"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>

              <!-- Airport selector: откуда -->
              <v-col cols="12">
                <AirportSelect
                  v-model="draft.segments[0].departureAirport"
                  :rules="REQUIRED_RULES"
                  label="Откуда"
                />
              </v-col>

              <v-col cols="12">
                <DateTimeField
                  v-model="draft.segments[0].departureAt"
                  :rules="REQUIRED_RULES"
                  hide-details="auto"
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
                <!-- Аэропорт пересадки = segments[k-1].arrivalAirport -->
                <v-col cols="12">
                  <AirportSelect
                    v-model="draft.segments[k - 1].arrivalAirport"
                    :rules="REQUIRED_RULES"
                    label="Аэропорт пересадки"
                  />
                </v-col>
                <v-col cols="12">
                  <DateTimeField
                    v-model="draft.segments[k - 1].arrivalAt"
                    :rules="REQUIRED_RULES"
                    hide-details="auto"
                    label="Прилёт (местное)"
                  />
                </v-col>
              </v-row>

              <div class="leg-card__title mt-3">
                <v-icon size="14" class="mr-1">mdi-airplane</v-icon>
                Рейс после пересадки в {{ draft.segments[k - 1].arrivalAirport?.city.name || '…' }}
              </div>
              <v-row dense>
                <v-col cols="6">
                  <AirlineSelect
                    v-model="draft.segments[k].airline"
                    :rules="REQUIRED_RULES"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="draft.segments[k].flightNumber"
                    :maxlength="FLIGHT_NUMBER_MAX_LENGTH"
                    label="Рейс"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="draft.segments[k].cabinClass"
                    :items="CABIN_CLASS_OPTIONS"
                    label="Класс"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <DateTimeField
                    v-model="draft.segments[k].departureAt"
                    :rules="REQUIRED_RULES"
                    hide-details="auto"
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
                  v-model="draft.segments[draft.segments.length - 1].arrivalAirport"
                  :rules="REQUIRED_RULES"
                  label="Куда"
                />
              </v-col>
              <v-col cols="12">
                <DateTimeField
                  v-model="draft.segments[draft.segments.length - 1].arrivalAt"
                  :rules="REQUIRED_RULES"
                  hide-details="auto"
                  label="Прилёт (местное)"
                />
              </v-col>
            </v-row>
          </div>
        </v-form>
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

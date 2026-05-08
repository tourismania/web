<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | null | undefined
  label?: string
  min?: string | null
  max?: string | null
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean
  disabled?: boolean
}>(), {
  label: '',
  min: null,
  max: null,
  density: 'compact',
  hideDetails: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const menu = ref(false)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

interface ParsedDateTime {
  date: Date | null
  hour: number
  minute: number
}

function parseDateTime(value: string | null | undefined): ParsedDateTime {
  if (!value) return { date: null, hour: 12, minute: 0 }
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(value))
  if (!m) return { date: null, hour: 12, minute: 0 }
  const date = new Date(+m[1], +m[2] - 1, +m[3])
  if (isNaN(date.getTime())) return { date: null, hour: 12, minute: 0 }
  return {
    date,
    hour: m[4] ? +m[4] : 0,
    minute: m[5] ? +m[5] : 0,
  }
}

function toIsoDateTime(d: Date, h: number, mi: number): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:${pad(mi)}:00`
}

const local = ref<ParsedDateTime>(parseDateTime(props.modelValue))

watch(
  () => props.modelValue,
  (v) => {
    local.value = parseDateTime(v)
  },
)

watch(menu, (open) => {
  if (open) local.value = parseDateTime(props.modelValue)
})

const dateObj = computed<Date | null>({
  get: () => local.value.date,
  set: (val) => {
    local.value = {
      ...local.value,
      date: val instanceof Date && !isNaN(val.getTime()) ? val : null,
    }
  },
})

const display = computed(() => {
  const { date, hour, minute } = parseDateTime(props.modelValue)
  if (!date) return ''
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(hour)}:${pad(minute)}`
})

const minDate = computed(() => parseDateTime(props.min || '').date ?? undefined)
const maxDate = computed(() => parseDateTime(props.max || '').date ?? undefined)

const hourStr = computed({
  get: () => pad(local.value.hour),
  set: (v: string) => {
    const n = parseInt(String(v), 10)
    local.value = { ...local.value, hour: clamp(isNaN(n) ? 0 : n, 0, 23) }
  },
})
const minuteStr = computed({
  get: () => pad(local.value.minute),
  set: (v: string) => {
    const n = parseInt(String(v), 10)
    local.value = { ...local.value, minute: clamp(isNaN(n) ? 0 : n, 0, 59) }
  },
})

function clamp(value: number, mn: number, mx: number): number {
  return Math.min(mx, Math.max(mn, value))
}

function confirm() {
  if (local.value.date) {
    emit('update:modelValue', toIsoDateTime(local.value.date, local.value.hour, local.value.minute))
  }
  menu.value = false
}

function cancel() {
  menu.value = false
}
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom end"
    offset="4"
    :disabled="disabled"
  >
    <template #activator="{ props: actProps }">
      <v-text-field
        v-bind="actProps"
        :model-value="display"
        :label="label"
        placeholder="дд.мм.гггг чч:мм"
        :density="density"
        :hide-details="hideDetails"
        :disabled="disabled"
        readonly
        variant="outlined"
        append-inner-icon="mdi-calendar-clock"
        class="date-field"
      />
    </template>
    <div class="dtf-popup">
      <v-date-picker
        v-model="dateObj"
        :min="minDate"
        :max="maxDate"
        hide-header
        hide-actions
        show-adjacent-months
        color="primary"
      />
      <div class="dtf-time">
        <span class="dtf-time-label">Время</span>
        <v-text-field
          v-model="hourStr"
          type="number"
          min="0"
          max="23"
          density="compact"
          variant="outlined"
          hide-details
          class="dtf-time-input"
        />
        <span class="dtf-time-sep">:</span>
        <v-text-field
          v-model="minuteStr"
          type="number"
          min="0"
          max="59"
          density="compact"
          variant="outlined"
          hide-details
          class="dtf-time-input"
        />
        <v-spacer />
        <v-btn variant="text" size="small" @click="cancel">Отмена</v-btn>
        <v-btn variant="tonal" size="small" :disabled="!local.date" @click="confirm">OK</v-btn>
      </div>
    </div>
  </v-menu>
</template>

<style scoped lang="scss">
.date-field :deep(.v-field),
.date-field :deep(.v-field__input),
.date-field :deep(input) {
  cursor: pointer !important;
}
.dtf-popup {
  background: rgba(0, 22, 21, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
}
.dtf-time {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 18, 17, 0.95);
}
.dtf-time-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 4px;
}
.dtf-time-input {
  max-width: 76px;
}
.dtf-time-input :deep(input) {
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.dtf-time-sep {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}
</style>

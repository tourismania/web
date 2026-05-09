<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | null | undefined
  label?: string
  min?: string | null
  max?: string | null
  density?: 'default' | 'comfortable' | 'compact'
  placeholder?: string
  hideDetails?: boolean
  disabled?: boolean
  clearable?: boolean
}>(), {
  label: '',
  min: null,
  max: null,
  density: 'compact',
  placeholder: 'дд.мм.гггг',
  hideDetails: true,
  disabled: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const menu = ref(false)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
  if (!m) return null
  const d = new Date(+m[1], +m[2] - 1, +m[3])
  return isNaN(d.getTime()) ? null : d
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fmtDisplay(value: string | null | undefined): string {
  const d = parseDate(value)
  if (!d) return ''
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

const dateObj = computed<Date | null>({
  get: () => parseDate(props.modelValue),
  set: (val) => {
    if (val instanceof Date && !isNaN(val.getTime())) {
      emit('update:modelValue', toIsoDate(val))
      menu.value = false
    } else if (val === null) {
      emit('update:modelValue', '')
      menu.value = false
    }
  },
})

const minDate = computed(() => parseDate(props.min) ?? undefined)
const maxDate = computed(() => parseDate(props.max) ?? undefined)
const display = computed(() => fmtDisplay(props.modelValue))

function clear() {
  emit('update:modelValue', '')
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
        :placeholder="placeholder"
        :density="density"
        :hide-details="hideDetails"
        :disabled="disabled"
        readonly
        variant="outlined"
        append-inner-icon="mdi-calendar"
        class="date-field"
      >
        <template v-if="clearable && display" #prepend-inner>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            @click.stop="clear"
          />
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="dateObj"
      :min="minDate"
      :max="maxDate"
      hide-header
      hide-actions
      show-adjacent-months
      color="primary"
    />
  </v-menu>
</template>

<style scoped lang="scss">
.date-field :deep(.v-field),
.date-field :deep(.v-field__input),
.date-field :deep(input) {
  cursor: pointer !important;
}
</style>

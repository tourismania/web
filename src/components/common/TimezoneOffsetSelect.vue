<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | null | undefined
  label?: string
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean
}>(), {
  label: 'Часовой пояс',
  density: 'compact',
  hideDetails: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

interface OffsetItem {
  value: string  // canonical "+HH:MM" / "-HH:MM"
  title: string  // pretty label e.g. "UTC+3" or "UTC+5:30"
}

/** Strict ISO offset designator like "+03:00" or "-05:30". */
const OFFSET_RE = /^([+-])(\d{2}):(\d{2})$/

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function fmtTitle(value: string): string {
  const m = OFFSET_RE.exec(value)
  if (!m) return value
  const sign = m[1]
  const h = +m[2]
  const mi = +m[3]
  if (mi === 0) return `UTC${sign}${h}`
  return `UTC${sign}${h}:${pad(mi)}`
}

function buildItems(): OffsetItem[] {
  // Common offsets across the world, including half- and quarter-hour zones.
  const offsets: Array<[number, number]> = [
    // [hours, minutes]
    [-12, 0], [-11, 0], [-10, 0], [-9, 30], [-9, 0], [-8, 0], [-7, 0], [-6, 0],
    [-5, 0], [-4, 0], [-3, 30], [-3, 0], [-2, 0], [-1, 0],
    [0, 0],
    [1, 0], [2, 0], [3, 0], [3, 30], [4, 0], [4, 30], [5, 0], [5, 30], [5, 45],
    [6, 0], [6, 30], [7, 0], [8, 0], [8, 45], [9, 0], [9, 30], [10, 0], [10, 30],
    [11, 0], [12, 0], [12, 45], [13, 0], [14, 0],
  ]
  return offsets.map(([h, m]) => {
    const sign = h < 0 || (h === 0 && m < 0) ? '-' : '+'
    const value = `${sign}${pad(Math.abs(h))}:${pad(Math.abs(m))}`
    return { value, title: fmtTitle(value) }
  })
}

const ITEMS = buildItems()

/**
 * Backwards compatibility: if the value isn't an offset designator (e.g. legacy
 * IANA "Europe/Moscow"), resolve it to a canonical "+HH:MM" using Intl. We
 * resolve at "now" because we have no specific instant — close enough for a
 * select default.
 */
function normalize(value: string | null | undefined): string {
  const v = String(value ?? '').trim()
  if (!v) return '+00:00'
  if (OFFSET_RE.test(v)) return v
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: v,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date())
    const tzn = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    // tzn looks like "GMT+3" or "GMT-05:30" or "GMT"
    const m = /^GMT([+-]?)(\d{1,2})(?::?(\d{2}))?$/.exec(tzn.replace(/\s+/g, ''))
    if (m) {
      const sign = m[1] === '-' ? '-' : '+'
      const hh = pad(+(m[2] || '0'))
      const mm = pad(+(m[3] || '0'))
      return `${sign}${hh}:${mm}`
    }
  } catch {
    /* noop */
  }
  return '+00:00'
}

const internal = computed<string>({
  get: () => normalize(props.modelValue),
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <v-select
    v-model="internal"
    :items="ITEMS"
    item-title="title"
    item-value="value"
    :label="label"
    :density="density"
    :hide-details="hideDetails"
    variant="outlined"
  />
</template>

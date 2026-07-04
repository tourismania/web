<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Airport } from '@/api/types/offer'
import type { AirportResult } from '@/api/types/airport'
import { AirportApi } from '@/api/airport'

const props = defineProps<{
  modelValue: Airport | null
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Airport | null]
}>()

// ─── Internal state ───────────────────────────────────────────────────────────

const searchQuery = ref('')
const items = ref<AirportResult[]>([])
const loading = ref(false)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// ─── Display value for the selected airport ───────────────────────────────────

/**
 * Displayed in the input field after selection.
 * Format: "Москва (SVO) — Шереметьево"
 */
const displayValue = computed<AirportResult | null>(() => {
  if (!props.modelValue?.code) return null
  // Try to find the selected value in the current items list first,
  // otherwise synthesize a stub so v-autocomplete can display the label.
  return (
    items.value.find((i) => i.iata === props.modelValue!.code) ??
    ({
      iata: props.modelValue.code,
      icao: '',
      name: props.modelValue.name,
      city: {
        id: 0,
        name: props.modelValue.city,
        state: '',
        timezone: props.modelValue.timezone,
      },
      country: { iso2: '', name: '' },
      location: { elevation_ft: 0, latitude: 0, longitude: 0 },
    } satisfies AirportResult)
  )
})

// Keep a merged list so the current selection is always in the options
const mergedItems = computed<AirportResult[]>(() => {
  if (!displayValue.value) return items.value
  const exists = items.value.some((i) => i.iata === displayValue.value!.iata)
  return exists ? items.value : [displayValue.value, ...items.value]
})

// ─── Search ───────────────────────────────────────────────────────────────────

function onSearchInput(value: string) {
  searchQuery.value = value ?? ''
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  if (!value || value.trim().length < 2) {
    items.value = []
    return
  }
  debounceTimer.value = setTimeout(() => doSearch(value.trim()), 300)
}

async function doSearch(query: string) {
  loading.value = true
  try {
    const res = await AirportApi.search(query, 15)
    items.value = res.data
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

// ─── Selection ────────────────────────────────────────────────────────────────

function onSelect(result: AirportResult | null) {
  if (!result) {
    emit('update:modelValue', null)
    return
  }
  const airport: Airport = {
    city: result.city.name,
    name: result.name,
    code: result.iata,
    // API may return null for city.timezone — fall back to UTC
    timezone: result.city.timezone || '+00:00',
  }
  emit('update:modelValue', airport)
}

// ─── Label helper ─────────────────────────────────────────────────────────────

function itemTitle(item: AirportResult): string {
  return `${item.city.name} (${item.iata}) — ${item.name}`
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) searchQuery.value = ''
  },
)
</script>

<template>
  <v-autocomplete
    :model-value="displayValue"
    :items="mergedItems"
    :item-title="itemTitle"
    :item-value="(i: AirportResult) => i"
    :loading="loading"
    :label="label ?? 'Аэропорт'"
    :search="searchQuery"
    density="compact"
    variant="outlined"
    hide-details
    no-filter
    return-object
    clearable
    :placeholder="label ?? 'Введите город или аэропорт'"
    @update:search="onSearchInput"
    @update:model-value="onSelect"
  >
    <!-- Dropdown item -->
    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="undefined" class="airport-item px-3 py-2">
        <template #default>
          <div class="airport-item__main">
            <span class="airport-item__city">{{ item.raw.city.name }}</span>
            <v-chip
              v-if="item.raw.iata"
              size="x-small"
              variant="tonal"
              class="airport-item__iata ml-1"
            >
              {{ item.raw.iata }}
            </v-chip>
          </div>
          <div class="airport-item__sub">
            <v-icon size="12" class="mr-1" style="opacity: 0.5">mdi-airplane</v-icon>
            <span class="airport-item__name">{{ item.raw.name }}</span>
            <span class="airport-item__country ml-2">{{ item.raw.country.name }}</span>
          </div>
        </template>
      </v-list-item>
    </template>

    <!-- No data -->
    <template #no-data>
      <div class="px-4 py-2 text-caption text-medium-emphasis">
        <template v-if="loading">Поиск…</template>
        <template v-else-if="searchQuery.length < 2">Введите минимум 2 символа</template>
        <template v-else>Ничего не найдено</template>
      </div>
    </template>
  </v-autocomplete>
</template>

<style scoped lang="scss">
.airport-item {
  cursor: pointer;

  &__main {
    display: flex;
    align-items: center;
    line-height: 1.4;
  }

  &__city {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }

  &__iata {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  &__sub {
    display: flex;
    align-items: center;
    margin-top: 1px;
  }

  &__name {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.65);
  }

  &__country {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>

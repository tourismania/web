<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Airport } from '@/api/types/airport'
import { AirportApi } from '@/api/airport'
import type { FieldRule } from '@/helpers/rules'

const props = defineProps<{
  modelValue: Airport | null
  label?: string
  rules?: FieldRule[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Airport | null]
}>()

// ─── Internal state ───────────────────────────────────────────────────────────

const searchQuery = ref('')
const items = ref<Airport[]>([])
const loading = ref(false)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// ─── Display value for the selected airport ───────────────────────────────────

/**
 * Displayed in the input field after selection.
 * Format: "Москва (SVO) — Шереметьево"
 *
 * Аэропорты сопоставляются по ICAO. Данные выбранного значения и выдачи поиска
 * могут отличаться, поэтому при совпадении берётся объект из выдачи: поле
 * сравнивает значение с вариантами целиком. Иначе показывается само значение.
 */
const displayValue = computed<Airport | null>(() => {
  const selected = props.modelValue
  if (!selected) return null
  return items.value.find((i) => i.icao === selected.icao) ?? selected
})

// Keep a merged list so the current selection is always in the options
const mergedItems = computed<Airport[]>(() => {
  const selected = displayValue.value
  if (!selected) return items.value
  return items.value.includes(selected) ? items.value : [selected, ...items.value]
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

// Airports with an IATA code first; stable sort keeps API order within each group.
function sortByIata(list: Airport[]): Airport[] {
  return [...list].sort((a, b) => Number(!a.iata) - Number(!b.iata))
}

async function doSearch(query: string) {
  loading.value = true
  try {
    const res = await AirportApi.search(query, 15)
    items.value = sortByIata(res.data)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

// ─── Selection ────────────────────────────────────────────────────────────────

function onSelect(airport: Airport | null) {
  emit('update:modelValue', airport)
}

// ─── Label helper ─────────────────────────────────────────────────────────────

function itemTitle(item: Airport): string {
  return item.iata
    ? `${item.city.name} (${item.iata}) — ${item.name}`
    : `${item.city.name} — ${item.name}`
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
    :item-value="(i: Airport) => i"
    :loading="loading"
    :label="label ?? 'Аэропорт'"
    :search="searchQuery"
    :rules="rules"
    density="compact"
    variant="outlined"
    hide-details="auto"
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Airline } from '@/api/types/offer'
import type { AirlineSearchItem } from '@/api/types/airline'
import { AirlineApi } from '@/api/airline'
import type { FieldRule } from '@/helpers/rules'

const MIN_SEARCH_LENGTH = 3
const SEARCH_DEBOUNCE_MS = 300
const SEARCH_LIMIT = 15

const props = defineProps<{
  modelValue: Airline | null
  label?: string
  rules?: FieldRule[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Airline | null]
}>()

const searchQuery = ref('')
const items = ref<AirlineSearchItem[]>([])
const loading = ref(false)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)
// Номер последнего поиска: ответ устаревшего запроса не должен заменить выдачу.
let lastSearchId = 0

const isQueryTooShort = computed(() => searchQuery.value.trim().length < MIN_SEARCH_LENGTH)

/**
 * Значение поля. У авиакомпании сегмента нет страны, а поле сравнивает значение
 * с вариантами целиком, поэтому при совпадении id берётся объект из выдачи.
 * Иначе значение показывается как есть: так видна и авиакомпания, скрытая из поиска.
 */
const displayValue = computed<AirlineSearchItem | null>(() => {
  const selected = props.modelValue
  if (!selected) return null
  return items.value.find((i) => i.id === selected.id) ?? { ...selected, country: null }
})

// Текущее значение всегда есть среди вариантов
const mergedItems = computed<AirlineSearchItem[]>(() => {
  const selected = displayValue.value
  if (!selected || items.value.some((i) => i.id === selected.id)) return items.value
  return [selected, ...items.value]
})

function onSearchInput(value: string) {
  searchQuery.value = value ?? ''
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  lastSearchId++
  loading.value = false
  if (isQueryTooShort.value) {
    items.value = []
    return
  }
  const query = searchQuery.value.trim()
  debounceTimer.value = setTimeout(() => doSearch(query), SEARCH_DEBOUNCE_MS)
}

async function doSearch(query: string) {
  const searchId = ++lastSearchId
  loading.value = true
  try {
    const result = await AirlineApi.search(query, SEARCH_LIMIT)
    if (searchId === lastSearchId) items.value = result.data
  } catch (e) {
    console.error('[airline-select] failed to search airlines', e)
    if (searchId === lastSearchId) items.value = []
  } finally {
    if (searchId === lastSearchId) loading.value = false
  }
}

// В модель перелёта страна не входит
function onSelect(item: AirlineSearchItem | null) {
  if (!item) {
    emit('update:modelValue', null)
    return
  }
  emit('update:modelValue', {
    id: item.id,
    icao: item.icao,
    name: item.name,
    dissolvedOn: item.dissolvedOn,
  })
}

// YYYY-MM-DD → ДД.ММ.ГГГГ, без Date: дата справочника не зависит от часового пояса
function formatDissolvedOn(date: string): string {
  return date.split('-').reverse().join('.')
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
    item-title="name"
    :item-value="(i: AirlineSearchItem) => i"
    :loading="loading"
    :label="label ?? 'Авиакомпания'"
    :search="searchQuery"
    :rules="rules"
    density="compact"
    variant="outlined"
    hide-details="auto"
    no-filter
    return-object
    clearable
    @update:search="onSearchInput"
    @update:model-value="onSelect"
  >
    <!-- Подсказка, когда в списке только текущее значение и no-data не показывается -->
    <template #prepend-item>
      <div v-if="mergedItems.length > 0 && isQueryTooShort" class="px-4 py-2 text-caption text-medium-emphasis">
        Введите минимум {{ MIN_SEARCH_LENGTH }} символа
      </div>
    </template>

    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="undefined" class="airline-item px-3 py-2">
        <template #default>
          <div class="airline-item__main">
            <span class="airline-item__name">{{ item.raw.name }}</span>
            <v-chip v-if="item.raw.icao" size="x-small" variant="tonal" class="ml-1">
              {{ item.raw.icao }}
            </v-chip>
          </div>
          <div v-if="item.raw.country || item.raw.dissolvedOn" class="airline-item__sub">
            <span v-if="item.raw.country" class="mr-2">{{ item.raw.country.name }}</span>
            <span v-if="item.raw.dissolvedOn" class="airline-item__dissolved">
              прекратила деятельность {{ formatDissolvedOn(item.raw.dissolvedOn) }}
            </span>
          </div>
        </template>
      </v-list-item>
    </template>

    <template #no-data>
      <div class="px-4 py-2 text-caption text-medium-emphasis">
        <template v-if="loading">Поиск…</template>
        <template v-else-if="isQueryTooShort">Введите минимум {{ MIN_SEARCH_LENGTH }} символа</template>
        <template v-else>Ничего не найдено</template>
      </div>
    </template>
  </v-autocomplete>
</template>

<style scoped lang="scss">
.airline-item {
  cursor: pointer;

  &__main {
    display: flex;
    align-items: center;
    line-height: 1.4;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }

  &__sub {
    margin-top: 1px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
  }

  &__dissolved {
    color: rgba(239, 159, 59, 0.85);
  }
}
</style>

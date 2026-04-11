<script setup lang="ts">
import type { RouteSheetCategoryTotal, RouteSheetSummaryFooter } from '@/types/voucher'

defineProps<{
  rows: RouteSheetCategoryTotal[]
  footer: RouteSheetSummaryFooter
}>()
</script>

<template>
  <div>
    <h3>Итого</h3>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Категория</th>
          <th class="text-left">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i" class="text-left">
          <td>{{ row.category }}</td>
          <td>{{ row.cost }}</td>
        </tr>
        <tr class="text-left">
          <td>{{ footer.category }}</td>
          <td>{{ footer.cost }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

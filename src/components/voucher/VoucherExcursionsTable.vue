<script setup lang="ts">
import type { ExcursionItem } from '@/types/voucher'

defineProps<{
  items: ExcursionItem[]
  sectionTotal: string
}>()
</script>

<template>
  <div>
    <h3>Экскурсии и развлечения</h3>
    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Дата</th>
          <th class="text-left">Категория</th>
          <th class="text-left">Примечание</th>
          <th class="text-left">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in items" :key="row.id" class="text-left">
          <td>{{ row.date }}</td>
          <td>{{ row.category }}</td>
          <td>{{ row.note }}</td>
          <td>{{ row.cost }}</td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-left">{{ sectionTotal }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

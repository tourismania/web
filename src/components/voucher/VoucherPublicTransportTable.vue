<script setup lang="ts">
import type { PublicTransportLeg } from '@/types/voucher'

defineProps<{
  legs: PublicTransportLeg[]
  sectionTotal: string
}>()
</script>

<template>
  <div>
    <h3>Общественный транспорт</h3>
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
        <tr v-for="row in legs" :key="row.id" class="text-left">
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

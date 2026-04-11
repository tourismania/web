<script setup lang="ts">
import type { ProgramDay } from '@/types/voucher'

defineProps<{
  days: ProgramDay[]
}>()
</script>

<template>
  <v-table theme="dark">
    <thead>
      <tr>
        <th>Дата</th>
        <th>Активность</th>
        <th>Примечание</th>
        <th>Рестораны</th>
        <th>Маршрут</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="day in days" :key="day.id">
        <tr v-for="(act, idx) in day.activities" :key="act.id">
          <td v-if="idx === 0" :rowspan="day.activities.length">{{ day.date }}</td>
          <td>{{ act.title }}</td>
          <td>{{ act.note }}</td>
          <td v-if="idx === 0" :rowspan="day.activities.length">{{ day.restaurants }}</td>
          <td>{{ act.route }}</td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

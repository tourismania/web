<script setup lang="ts">
import type { AccommodationStay } from '@/types/voucher'

defineProps<{
  stays: AccommodationStay[]
  sectionTotal: string
}>()
</script>

<template>
  <div>
    <h3>Жилье</h3>
    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Дата</th>
          <th class="text-left">Размещение</th>
          <th class="text-left">Кол-во ночей</th>
          <th class="text-left">Город и адрес отеля</th>
          <th class="text-left">Доп.инфа о размещении</th>
          <th class="text-left">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in stays" :key="row.id" class="text-left">
          <td>{{ row.date }}</td>
          <td>{{ row.placement }}</td>
          <td>{{ row.nights }}</td>
          <td>{{ row.cityAndAddress }}</td>
          <td>{{ row.extraInfo }}</td>
          <td>{{ row.cost }}</td>
        </tr>
        <tr>
          <td colspan="5"></td>
          <td class="text-left">{{ sectionTotal }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

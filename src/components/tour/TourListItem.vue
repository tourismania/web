<script setup lang="ts">
import type { Tour } from '@/api/types/tour'

const props = defineProps<{
  tour: Tour
}>()

const emit = defineEmits<{
  click: [id: string]
  edit: [id: string]
}>()

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function handleClick() {
  if (props.tour.id) emit('click', props.tour.id)
}

function handleEdit(e: Event) {
  e.stopPropagation()
  if (props.tour.id) emit('edit', props.tour.id)
}
</script>

<template>
  <tr class="tour-list-item">
    <td class="tour-list-item__td tour-list-item__td--name" @click="handleClick">{{ props.tour.title }}</td>
    <td class="tour-list-item__td tour-list-item__td--clients">
      <v-chip
          prepend-icon="mdi-account"
          variant="outlined"
          size="small"
          v-for="client in props.tour.clients" >
        {{client.name}} {{client.surname}}
      </v-chip>
    </td>
    <td class="tour-list-item__td tour-list-item__td--date">
      {{ props.tour.createdAt ? fmtDate(props.tour.createdAt) : '—' }}
    </td>
    <td class="tour-list-item__td tour-list-item__td--actions">
      <v-btn
        icon="mdi-pencil-outline"
        size="small"
        variant="text"
        color="primary"
        title="Редактировать тур"
        @click="handleEdit"
      />
    </td>
  </tr>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.tour-list-item {
  transition: background-color 150ms ease, border-left-color 150ms ease;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(54, 170, 184, 0.06) !important;
    border-left-color: variables.$color-blue;
  }

  &:not(:last-child) td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  }

  &__td {
    padding: 16px 20px !important;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.75);
    vertical-align: middle;
    border-bottom: none !important;

    &--name {
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    &--clients {
      span {
        margin-bottom: 4px;
        margin-right: 4px;
      }
    }

    &--date {
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.45);
      font-size: 13px;
    }

    &--actions {
      width: 56px;
      text-align: center;
    }
  }

  &__id-chip {
    display: inline-block;
    font-family: monospace;
    font-size: 12px;
    color: variables.$color-blue;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.25);
    border-radius: 6px;
    padding: 3px 10px;
    transition: background-color 150ms ease, border-color 150ms ease;
    outline: none;
    user-select: none;
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTourStore } from '@/stores/tour'
import TourListItem from '@/components/tour/TourListItem.vue'

const router = useRouter()
const tourStore = useTourStore()

onMounted(() => {
  tourStore.loadTours()
})

function navigateToTour(id: string) {
  router.push({ name: 'tour', params: { id } })
}

function navigateToNew() {
  router.push({ name: 'tourNew' })
}

function navigateToEdit(id: string) {
  router.push({ name: 'tourEdit', params: { id } })
}
</script>

<template>
  <div class="tours-list">
    <div class="tours-list__container">
      <div class="tours-list__header">
        <div class="tours-list__header-icon">
          <v-icon icon="mdi-earth" size="28" />
        </div>
        <div class="flex-grow-1">
          <h1 class="tours-list__title">Туры</h1>
        </div>
        <v-btn
            elevation="2"
            @click="navigateToNew"
            size="default"
            prepend-icon="mdi-plus-circle"
        >
          Создать тур
        </v-btn>
      </div>

      <div v-if="tourStore.loading" class="tours-list__state">
        <v-progress-circular indeterminate color="primary" size="36" />
      </div>

      <div v-else-if="tourStore.error" class="tours-list__state">
        <v-icon icon="mdi-alert-circle-outline" size="40" color="error" class="mb-2" />
        <div>{{ tourStore.error }}</div>
      </div>

      <div v-else class="tours-list__table-wrap">
        <v-table class="tours-list__table" density="comfortable">
          <thead>
            <tr>
              <th class="tours-list__th">Название</th>
              <th class="tours-list__th">Клиент</th>
              <th class="tours-list__th">Дата создания</th>
              <th class="tours-list__th tours-list__th--actions"></th>
            </tr>
          </thead>
          <tbody v-if="tourStore.tours.length > 0">
            <TourListItem
              v-for="tour in tourStore.tours"
              :key="tour.id"
              :tour="tour"
              @click="navigateToTour"
              @edit="navigateToEdit"
            />
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="tours-list__empty">
                <v-icon icon="mdi-compass-off-outline" size="40" class="mb-3" />
                <div>Туры не найдены</div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.tours-list {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  padding: 48px 24px 80px;

  &__container {
    max-width: 980px;
    margin: 0 auto;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(54, 170, 184, 0.15);
  }

  &__header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-blue;
    flex-shrink: 0;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }

  &__subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.35);
    margin: 4px 0 0;
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 15px;
  }

  &__table-wrap {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(54, 170, 184, 0.18);
    background: rgba(0, 15, 14, 0.6);
    backdrop-filter: blur(8px);
  }

  &__table {
    background: transparent !important;

    :deep(table) {
      border-collapse: collapse;
    }

    :deep(.v-table__wrapper) {
      background: transparent;
    }
  }

  &__th--actions {
    width: 56px !important;
  }

  &__th {
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    color: rgba(255, 255, 255, 0.3) !important;
    background: rgba(0, 0, 0, 0.25) !important;
    padding: 14px 20px !important;
    border-bottom: 1px solid rgba(54, 170, 184, 0.15) !important;
    white-space: nowrap;
  }

  &__empty {
    text-align: center !important;
    padding: 60px 20px !important;
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>

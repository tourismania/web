<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOfferStore } from '@/stores/offer'
import OfferListItem from '@/components/offer/OfferListItem.vue'

const router = useRouter()
const offerStore = useOfferStore()

onMounted(() => {
  offerStore.loadOffers()
})

function navigateToOffer(id: string) {
  router.push({ name: 'offer', params: { id } })
}

function navigateToNew() {
  router.push({ name: 'offerNew' })
}

function navigateToEdit(id: string) {
  router.push({ name: 'offerEdit', params: { id } })
}
</script>

<template>
  <div class="offers-list">
    <div class="offers-list__container">
      <div class="offers-list__header">
        <div class="offers-list__header-icon">
          <v-icon icon="mdi-earth" size="28" />
        </div>
        <div class="flex-grow-1">
          <h1 class="offers-list__title">Предложения</h1>
        </div>
        <v-btn
            elevation="2"
            @click="navigateToNew"
            size="default"
            prepend-icon="mdi-plus-circle"
        >
          Создать предложение
        </v-btn>
      </div>

      <div v-if="offerStore.loading" class="offers-list__state">
        <v-progress-circular indeterminate color="primary" size="36" />
      </div>

      <div v-else-if="offerStore.error" class="offers-list__state">
        <v-icon icon="mdi-alert-circle-outline" size="40" color="error" class="mb-2" />
        <div>{{ offerStore.error }}</div>
      </div>

      <div v-else class="offers-list__table-wrap">
        <v-table class="offers-list__table" density="comfortable">
          <thead>
            <tr>
              <th class="offers-list__th">Название</th>
              <th class="offers-list__th">Клиент</th>
              <th class="offers-list__th">Дата создания</th>
              <th class="offers-list__th offers-list__th--actions text-center"><v-icon icon="mdi-cog-outline" /></th>
            </tr>
          </thead>
          <tbody v-if="offerStore.offers.length > 0">
            <OfferListItem
              v-for="offer in offerStore.offers"
              :key="offer.id"
              :offer="offer"
              @click="navigateToOffer"
              @edit="navigateToEdit"
            />
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="offers-list__empty">
                <v-icon icon="mdi-compass-off-outline" size="40" class="mb-3" />
                <div>Предложения не найдены</div>
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

.offers-list {
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

<script setup lang="ts">
import { ref } from 'vue'
import type { Cruise } from '@/api/types/voucher'

defineProps<{ cruise: Cruise; index: number }>()

const currentSlide = ref(0)

const currencySymbol: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  TRY: '₺',
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}
</script>

<template>
  <div class="cruise-card">
    <!-- Gallery -->
    <div v-if="cruise.gallery.length > 0" class="cruise-card__gallery">
      <v-carousel
        v-model="currentSlide"
        height="220"
        hide-delimiters
        :show-arrows="cruise.gallery.length > 1"
      >
        <v-carousel-item
          v-for="(img, i) in cruise.gallery"
          :key="i"
          :src="img"
          cover
        />
      </v-carousel>
    </div>

    <div class="cruise-card__info">
      <div class="cruise-card__header">
        <div class="cruise-card__index">#{{ index + 1 }}</div>
        <v-icon icon="mdi-ferry" class="mr-2" color="teal-lighten-1" />
        <h3 class="cruise-card__name">{{ cruise.name }}</h3>
      </div>

      <div v-if="cruise.cabins.length > 0" class="cruise-card__cabins">
        <div class="cruise-card__cabins-title">Каюты</div>
        <div
          v-for="(cabin, i) in cruise.cabins"
          :key="i"
          class="cruise-card__cabin"
        >
          <p class="cruise-card__cabin-desc">{{ cabin.description }}</p>
          <div class="cruise-card__cabin-price">{{ formatPrice(cabin.price, cabin.currency) }}</div>
        </div>
      </div>

      <div v-if="cruise.managerComment" class="cruise-card__comment">
        <v-icon icon="mdi-comment-text-outline" size="small" class="mr-1" />
        {{ cruise.managerComment }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.cruise-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.45);
  }

  &__info {
    padding: 20px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  &__cabins {
    background: rgba(0, 10, 10, 0.55);
    border: 1px solid rgba(54, 170, 184, 0.1);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
  }

  &__cabins-title {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  &__cabin {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__cabin-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    flex: 1;
    line-height: 1.4;
  }

  &__cabin-price {
    font-size: 16px;
    font-weight: 700;
    color: variables.$color-yellow;
    flex-shrink: 0;
  }

  &__comment {
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: flex-start;
  }
}
</style>

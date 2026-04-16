<script setup lang="ts">
import { ref } from 'vue'
import type { Hotel } from '@/api/types/voucher'

defineProps<{ hotel: Hotel; index: number }>()

const currentImage = ref(0)

const currencySymbol: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  TRY: '₺',
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('ru-RU')} ${currencySymbol[currency] ?? currency}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="hotel-card">
    <!-- Image Gallery -->
    <div class="hotel-card__gallery" v-if="hotel.images.length > 0">
      <div class="hotel-card__image-wrap">
        <img
          :src="hotel.images[currentImage]?.url"
          :alt="hotel.images[currentImage]?.alt ?? hotel.name"
          class="hotel-card__image"
        />
        <div class="hotel-card__stars">
          <v-icon
            v-for="i in hotel.stars"
            :key="i"
            icon="mdi-star"
            size="small"
            color="amber"
          />
        </div>
        <div class="hotel-card__dates-badge">
          {{ formatDate(hotel.checkIn) }} — {{ formatDate(hotel.checkOut) }}
          <span class="hotel-card__nights">{{ hotel.nights }} ночей</span>
        </div>
      </div>
      <div v-if="hotel.images.length > 1" class="hotel-card__thumbs">
        <div
          v-for="(img, i) in hotel.images"
          :key="i"
          class="hotel-card__thumb"
          :class="{ active: i === currentImage }"
          @click="currentImage = i"
        >
          <img :src="img.url" :alt="img.alt ?? `Фото ${i + 1}`" />
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="hotel-card__info">
      <div class="hotel-card__header">
        <div>
          <div class="hotel-card__index">#{{ index + 1 }}</div>
          <h3 class="hotel-card__name">{{ hotel.name }}</h3>
          <div class="hotel-card__address">
            <v-icon icon="mdi-map-marker-outline" size="small" class="mr-1" />
            {{ hotel.address }}
          </div>
        </div>
        <div class="hotel-card__price-block">
          <div class="hotel-card__price">{{ formatPrice(hotel.price, hotel.currency) }}</div>
          <div v-if="hotel.serviceFee > 0" class="hotel-card__service-fee">
            + сбор {{ formatPrice(hotel.serviceFee, hotel.serviceFeeCurrency ?? hotel.currency) }}
          </div>
        </div>
      </div>

      <p v-if="hotel.description" class="hotel-card__description">{{ hotel.description }}</p>

      <div class="hotel-card__chips">
        <v-chip size="small" variant="tonal" color="teal-lighten-1" prepend-icon="mdi-bed-outline">
          {{ hotel.roomType }}
        </v-chip>
        <v-chip size="small" variant="tonal" color="teal-lighten-1" prepend-icon="mdi-silverware-fork-knife" class="ml-2">
          {{ hotel.occupancyType }}
        </v-chip>
      </div>

      <div v-if="hotel.managerComment" class="hotel-card__comment">
        <v-icon icon="mdi-comment-text-outline" size="small" class="mr-1" />
        {{ hotel.managerComment }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.hotel-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.45);
  }

  &__gallery {
    position: relative;
  }

  &__image-wrap {
    position: relative;
    height: 240px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;

    .hotel-card:hover & {
      transform: scale(1.02);
    }
  }

  &__stars {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    padding: 4px 8px;
    display: flex;
    gap: 2px;
  }

  &__dates-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 12, 11, 0.9);
    border: 1px solid rgba(54, 170, 184, 0.4);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 13px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__nights {
    font-size: 11px;
    color: variables.$color-blue;
    font-weight: 600;
  }

  &__thumbs {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(0, 10, 10, 0.7);
  }

  &__thumb {
    width: 48px;
    height: 36px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    border: 1px solid transparent;

    &.active {
      opacity: 1;
      border-color: variables.$color-blue;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    padding: 20px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  &__address {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 4px;
    display: flex;
    align-items: center;
  }

  &__price-block {
    text-align: right;
    flex-shrink: 0;
  }

  &__price {
    font-size: 20px;
    font-weight: 700;
    color: variables.$color-yellow;
  }

  &__service-fee {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 2px;
  }

  &__description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin-bottom: 12px;
  }

  &__chips {
    margin-bottom: 12px;
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

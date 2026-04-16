<script setup lang="ts">
import { ref } from 'vue'
import type { Excursion } from '@/api/types/voucher'

defineProps<{ excursion: Excursion; index: number }>()

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

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="excursion-card">

    <!-- Gallery -->
    <div v-if="excursion.gallery.length > 0" class="excursion-card__gallery">
      <div class="excursion-card__image-wrap">
        <img
          :src="excursion.gallery[currentImage]?.url"
          :alt="excursion.gallery[currentImage]?.alt ?? `Экскурсия #${index + 1}`"
          class="excursion-card__image"
        />
        <!-- Date badge -->
        <div v-if="excursion.date" class="excursion-card__date-badge">
          <v-icon icon="mdi-calendar" size="14" class="mr-1" />
          {{ formatDate(excursion.date) }}
        </div>
        <!-- City badge -->
        <div v-if="excursion.city" class="excursion-card__city-badge">
          <v-icon icon="mdi-map-marker" size="14" class="mr-1" />
          {{ excursion.city }}
        </div>
      </div>
      <!-- Thumbnails -->
      <div v-if="excursion.gallery.length > 1" class="excursion-card__thumbs">
        <div
          v-for="(img, i) in excursion.gallery"
          :key="i"
          class="excursion-card__thumb"
          :class="{ active: i === currentImage }"
          @click="currentImage = i"
        >
          <img :src="img.url" :alt="img.alt ?? `Фото ${i + 1}`" />
        </div>
      </div>
    </div>

    <!-- Info block -->
    <div class="excursion-card__info">

      <!-- Header row: index + meta + price -->
      <div class="excursion-card__header">
        <div class="excursion-card__meta">
          <div class="excursion-card__index">#{{ index + 1 }}</div>
          <div class="excursion-card__title-row">
            <v-icon icon="mdi-binoculars" size="18" color="teal-lighten-1" class="mr-2" />
            <span class="excursion-card__label">Экскурсия</span>
          </div>
          <!-- City (text fallback when no gallery) -->
          <div v-if="excursion.city && excursion.gallery.length === 0" class="excursion-card__city-text">
            <v-icon icon="mdi-map-marker" size="14" class="mr-1" />
            {{ excursion.city }}
          </div>
          <!-- Date (text fallback when no gallery) -->
          <div v-if="excursion.date && excursion.gallery.length === 0" class="excursion-card__date-text">
            <v-icon icon="mdi-calendar" size="14" class="mr-1" />
            {{ formatDate(excursion.date) }}
          </div>
        </div>
        <div class="excursion-card__price-block">
          <div class="excursion-card__price">
            {{ formatPrice(excursion.price, excursion.currency) }}
          </div>
          <div class="excursion-card__price-label">стоимость</div>
        </div>
      </div>

      <!-- Chips row: city + date when gallery exists -->
      <div v-if="excursion.gallery.length > 0 && (excursion.city || excursion.date)" class="excursion-card__chips">
        <v-chip
          v-if="excursion.city"
          size="small"
          variant="tonal"
          color="teal-lighten-1"
          prepend-icon="mdi-map-marker"
        >
          {{ excursion.city }}
        </v-chip>
        <v-chip
          v-if="excursion.date"
          size="small"
          variant="tonal"
          color="teal-lighten-2"
          prepend-icon="mdi-calendar"
          class="ml-2"
        >
          {{ formatDate(excursion.date) }}
        </v-chip>
      </div>

      <!-- Manager comment -->
      <div class="excursion-card__comment">
        <v-icon icon="mdi-comment-text-outline" size="small" class="mr-2 excursion-card__comment-icon" />
        <span>{{ excursion.managerComment }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.excursion-card {
  background: rgba(0, 18, 17, 0.85);
  border: 1px solid rgba(54, 170, 184, 0.22);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    background: rgba(0, 22, 21, 0.92);
    border-color: rgba(54, 170, 184, 0.45);
  }

  // ── Gallery ─────────────────────────────────────────────────────────────────

  &__gallery {
    position: relative;
  }

  &__image-wrap {
    position: relative;
    height: 220px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;

    .excursion-card:hover & {
      transform: scale(1.02);
    }
  }

  &__date-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 12, 11, 0.9);
    border: 1px solid rgba(54, 170, 184, 0.4);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
  }

  &__city-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 12, 11, 0.9);
    border: 1px solid rgba(239, 159, 59, 0.35);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 12px;
    color: variables.$color-yellow;
    display: flex;
    align-items: center;
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

  // ── Info ────────────────────────────────────────────────────────────────────

  &__info {
    padding: 20px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__index {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__title-row {
    display: flex;
    align-items: center;
  }

  &__label {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
  }

  &__city-text,
  &__date-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    display: flex;
    align-items: center;
    margin-top: 2px;
  }

  &__price-block {
    text-align: right;
    flex-shrink: 0;
  }

  &__price {
    font-size: 22px;
    font-weight: 700;
    color: variables.$color-yellow;
    line-height: 1;
  }

  &__price-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 3px;
  }

  // ── Chips ───────────────────────────────────────────────────────────────────

  &__chips {
    margin-bottom: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  // ── Comment ─────────────────────────────────────────────────────────────────

  &__comment {
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    display: flex;
    align-items: flex-start;
    line-height: 1.6;
  }

  &__comment-icon {
    margin-top: 1px;
    flex-shrink: 0;
    color: variables.$color-blue !important;
    opacity: 0.7;
  }
}
</style>

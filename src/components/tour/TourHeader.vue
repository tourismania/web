<script setup lang="ts">
import type { Tour } from '@/api/types/tour'

const props = defineProps<{
  tour: Tour
}>()

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <section class="tour-hero">
    <div class="tour-hero__pattern" aria-hidden="true">
      <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <g fill="rgba(54,170,184,0.18)" stroke="none">
          <circle cx="120" cy="90" r="2.5" /><circle cx="140" cy="80" r="2" /><circle cx="160" cy="88" r="2.5" />
          <circle cx="130" cy="105" r="2" /><circle cx="150" cy="100" r="2.5" /><circle cx="170" cy="95" r="2" />
          <circle cx="360" cy="70" r="2" /><circle cx="375" cy="65" r="2.5" /><circle cx="390" cy="72" r="2" />
          <circle cx="520" cy="75" r="2.5" /><circle cx="545" cy="68" r="2" /><circle cx="565" cy="80" r="2.5" />
          <circle cx="200" cy="165" r="2.5" /><circle cx="215" cy="172" r="2" /><circle cx="208" cy="188" r="2.5" />
        </g>
        <path d="M 155 100 Q 370 40 400 72 Q 430 105 260 160" fill="none" stroke="rgba(54,170,184,0.25)" stroke-width="1" stroke-dasharray="4 3" />
        <text x="268" y="118" font-size="10" fill="rgba(54,170,184,0.5)" transform="rotate(-30 268 118)">✈</text>
      </svg>
    </div>

    <div class="tour-hero__content">
      <div class="tour-hero__label">Корпоративное туристическое предложение</div>
      <h1 class="tour-hero__title">{{ props.tour.title }}</h1>
      <div class="tour-hero__dates">
        <v-icon icon="mdi-calendar-range" size="18" class="mr-2" />
        {{ fmtDate(props.tour.startDate) }} — {{ fmtDate(props.tour.endDate) }}
      </div>
      <p v-if="props.tour.welcomeText" class="tour-hero__disclaimer">{{ props.tour.welcomeText }}</p>

      <div class="tour-hero__stats">
        <div class="tour-hero__stat">
          <span class="stat-num">{{ props.tour.flights.length }}</span>
          <span class="stat-label">перелётов</span>
        </div>
        <div class="tour-hero__stat-divider" />
        <div class="tour-hero__stat">
          <span class="stat-num">{{ props.tour.hotels.length }}</span>
          <span class="stat-label">отелей</span>
        </div>
        <div class="tour-hero__stat-divider" />
        <div class="tour-hero__stat">
          <span class="stat-num">{{ props.tour.cruises.length }}</span>
          <span class="stat-label">круизов</span>
        </div>
        <div class="tour-hero__stat-divider" />
        <div class="tour-hero__stat">
          <span class="stat-num">{{ props.tour.excursions.length }}</span>
          <span class="stat-label">экскурсий</span>
        </div>
        <div class="tour-hero__stat-divider" />
        <div class="tour-hero__stat">
          <span class="stat-num">{{ props.tour.additionalServices.length }}</span>
          <span class="stat-label">услуг</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.tour-hero {
  position: relative;
  padding: 72px 24px 56px;
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(54, 170, 184, 0.1) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 80% 60%, rgba(239, 159, 59, 0.06) 0%, transparent 60%),
    linear-gradient(160deg, #002724 0%, #001d1b 45%, #00201e 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      variables.$color-blue,
      variables.$color-yellow,
      variables.$color-blue,
      transparent
    );
  }

  &__pattern {
    position: absolute;
    inset: 0;
    pointer-events: none;
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
  }

  &__label {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: variables.$color-blue;
    border: 1px solid rgba(54, 170, 184, 0.35);
    border-radius: 20px;
    padding: 5px 18px;
    margin-bottom: 22px;
  }

  &__title {
    font-size: clamp(30px, 6vw, 52px);
    font-weight: 800;
    color: #fff;
    line-height: 1.08;
    margin-bottom: 14px;
    letter-spacing: -1px;
  }

  &__dates {
    font-size: 16px;
    color: variables.$color-yellow;
    font-weight: 600;
    margin-bottom: 20px;
    display: inline-flex;
    align-items: center;
    background: rgba(239, 159, 59, 0.08);
    border: 1px solid rgba(239, 159, 59, 0.2);
    border-radius: 24px;
    padding: 6px 18px;
  }

  &__disclaimer {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.38);
    max-width: 580px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  &__stats {
    display: inline-flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(54, 170, 184, 0.2);
    border-radius: 16px;
    padding: 16px 28px;
    gap: 24px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;

    .stat-num {
      font-size: 24px;
      font-weight: 800;
      color: variables.$color-blue;
      line-height: 1;
    }

    .stat-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &__stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
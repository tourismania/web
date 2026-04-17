<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  count?: string
  total?: string
}>()
</script>

<template>
  <div class="section-header">
    <div class="section-header__icon">
      <v-icon :icon="icon" />
    </div>
    <div>
      <h2 class="section-header__title">{{ title }}</h2>
      <div v-if="count" class="section-header__count">{{ count }}</div>
    </div>
    <div v-if="total" class="section-header__total">{{ total }}</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables';

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(54, 170, 184, 0.12);

  &__icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(54, 170, 184, 0.1);
    border: 1px solid rgba(54, 170, 184, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: variables.$color-blue;
    flex-shrink: 0;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  &__count {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 2px;
  }

  &__total {
    margin-left: auto;
    font-size: 18px;
    font-weight: 700;
    color: variables.$color-yellow;
  }
}
</style>
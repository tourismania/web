<script setup lang="ts">
import VoucherPreview from '@/blocks/VoucherPreview.vue'
import VoucherDataForm from '@/blocks/VoucherDataForm.vue'
</script>

<template>
  <main class="voucher-page">
    <h1 class="voucher-page__title">Информация о путевке</h1>

    <div class="voucher-page__grid">
      <div class="voucher-page__preview">
        <VoucherPreview />
      </div>
      <aside class="voucher-page__form" aria-label="Редактирование путёвки">
        <VoucherDataForm />
      </aside>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$breakpoint-two-col: 1200px;
$breakpoint-mobile-max: 599px;

.voucher-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 12px 8px 32px;
  text-align: center;
}

.voucher-page__title {
  margin: 0 0 16px;
}

.voucher-page__grid {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  width: 100%;
  margin: 0;
}

.voucher-page__preview,
.voucher-page__form {
  text-align: left;
  min-width: 0;
}

/* Телефоны: форма скрыта */
.voucher-page__form {
  display: none;
}

@media (min-width: ($breakpoint-mobile-max + 1px)) {
  .voucher-page__form {
    display: block;
  }
}

/* От 1200px — превью и форма в одной строке (~7 / 5) */
@media (min-width: $breakpoint-two-col) {
  .voucher-page__grid {
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
  }

  .voucher-page__preview {
    flex: 7 1 0;
  }

  .voucher-page__form {
    flex: 5 1 0;
    position: sticky;
    top: 12px;
    align-self: flex-start;
  }
}
</style>

<script setup lang="ts">
import {RouterView} from "vue-router";
</script>

<template>
  <main>
    <div class="main__layout">
      <RouterView />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/assets/variables';
@use '@/assets/fonts/amatic-sc';

.main__layout {
  font-family: variables.$font-family-amatic;
  height: 100vh;
  background-position: center;
  background-size: cover;
  color: white;
  background-image: url('../assets/images/background_main.png');
  overflow-y: scroll;

  & img {
    width: 250px;
    filter: drop-shadow(2px 4px 6px black);
  }
}
</style>

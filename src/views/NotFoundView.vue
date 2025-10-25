<template>
  <main>
    <div class="main__not-found">
      <div>
        <h1>Вы улетели не туда</h1>
      </div>
      <div>
        <RouterLink to="/"><p>Вернитесь домой</p></RouterLink>
      </div>
    </div>
    <SocialLinksFooter />
  </main>
</template>
<style lang="scss" scoped>
.main__not-found {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  height: 100vh;
}
</style>
<script setup lang="ts">
import SocialLinksFooter from "@/blocks/SocialLinksFooter.vue";
</script>

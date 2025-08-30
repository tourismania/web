<script setup lang="ts">
import SocialLinksFooter from "@/blocks/SocialLinksFooter.vue";
</script>


<template>
  <main>
    <div class="main__welcome">
      <div class="main__welcome__logo">
        <img src="@/assets/logos/logo_main_transparent.png" alt="">
      </div>
    </div>
    <SocialLinksFooter />
  </main>
</template>

<style lang="scss" scoped>
.main__welcome {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  align-content: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  color: white;
  background-image: url('../assets/images/background_main.png');

  & img {
    width: 250px;
    filter: drop-shadow(2px 4px 6px black);
  }
}
</style>

<script setup lang="ts">
import SocialLinksFooter from "@/blocks/SocialLinksFooter.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore()
</script>

<template>
  <main>
    <div class="main__home">
      <div class="main__logo">
        <img src="@/assets/logos/logo_main_transparent.png" alt="" />
      </div>
      <v-btn
        v-if="userStore.isAuthenticated"
        :to="{ name: 'offers' }"
        size="large"
        prepend-icon="mdi-briefcase-outline"
        elevation="2"
      >
        Мои предложения
      </v-btn>
    </div>
    <SocialLinksFooter />
  </main>
</template>

<style lang="scss" scoped>
.main__home {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  height: 100vh;

  .main__logo {
    & img {
      width: 250px;
      filter: drop-shadow(2px 4px 6px black);
    }
  }
}

</style>

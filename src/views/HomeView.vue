<script setup lang="ts">
import SocialLinksFooter from '@/blocks/SocialLinksFooter.vue'
import {useUserStore} from "@/stores/user.ts";
import {onMounted, ref} from "vue";

const userStore = useUserStore();

const isAuthenticated = ref<boolean>(false);

onMounted(() => {
  userStore.loadCurrentUser().finally(() => {
    isAuthenticated.value = userStore.isAuthenticated;
  });
})
</script>

<template>
  <main>
    <div class="main__home">
      <div class="main__logo">
        <img src="@/assets/logos/logo_main_transparent.png" alt="" />
      </div>
      <div class="main__routes">
<!--        <router-link to="/travel-voucher">Информация о путевке</router-link>-->
        <router-link v-if="!isAuthenticated" to="/login">Личный кабинет</router-link>
      </div>
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

  .main__routes {
    a {
      font-size: 31px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

</style>

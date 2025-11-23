<script setup lang="ts">
import {RouterView} from "vue-router";
import {useUserStore} from "@/stores/user.ts";
import {onMounted, ref} from "vue";
import SocialLinksFooter from "@/blocks/SocialLinksFooter.vue";
import router from "@/router";
import {useAuthStore} from "@/stores/auth.ts";

const userStore = useUserStore();
const authStore = useAuthStore();

const isAuthenticated = ref<boolean>(false);

onMounted(() => {
  fetchCurrentUser();
})

function fetchCurrentUser(): void {
  userStore.loadCurrentUser().finally(() => {
    isAuthenticated.value = userStore.isAuthenticated;
  });
}

function logout(): void {
  authStore.clearToken();
  location.assign('/');
}
</script>

<template>
    <v-app>
      <v-app-bar class="app__bar" :elevation="2">
        <template v-slot:prepend>
          <router-link to="/"><img src="../assets/logos/logo_symbol.png" alt=""></router-link>
        </template>
        <div class="app__bar__menu">
          <router-link to="/travel-voucher">Информация о путевке</router-link>
        </div>
        <template v-slot:append>
          <v-btn @click="logout" v-if="isAuthenticated" icon="mdi-logout"></v-btn>
          <router-link to="/login"><v-btn v-if="!isAuthenticated" icon="mdi-login"></v-btn></router-link>
        </template>
      </v-app-bar>

<!--      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>-->

      <v-main class="main__layout">
        <v-container>
            <RouterView />
        </v-container>
        <SocialLinksFooter />
      </v-main>
    </v-app>
</template>

<style lang="scss" scoped>
@use '@/assets/variables';
@use '@/assets/fonts/amatic-sc';

header.app__bar {
  font-family: variables.$font-family-amatic !important;
  background-color: variables.$color-blue-dark;
  font-weight: 800!important;

  & .app__bar__menu {
    & > a {
      font-size: 25px;
    }
  }

  & img {
    width: 60px;
  }
}

main.main__layout {
  font-family: variables.$font-family-amatic;
  font-weight: 800!important;
  height: 100vh;
  background-position: center;
  background-size: cover;
  color: white;
  background-image: url('../assets/images/background_main.png');
  overflow-y: scroll;

  & > main {
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    height: 100vh;
  }

  & img {
    width: 250px;
    filter: drop-shadow(2px 4px 6px black);
  }
}
</style>

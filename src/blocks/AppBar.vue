<script lang="ts">
import {defineComponent} from 'vue'
import {useAuthStore} from "@/stores/auth.ts";
import {mapStores} from "pinia";

export default defineComponent({
  name: "AppBar",
  computed: {
    ...mapStores(useAuthStore)
  },
  props: {
    isAuthenticated: Boolean,
    isSuperAdmin: Boolean
  },
  methods: {
    logout(): void {
      const authStore = useAuthStore();
      authStore.clearToken();
      location.assign('/');
    }
  }
})
</script>

<template>
  <v-app-bar class="app__bar" :elevation="2">
    <template v-slot:prepend>
      <router-link to="/"><img src="../assets/logos/logo_symbol.png" alt=""></router-link>
    </template>
    <div class="app__bar__menu">
      <router-link v-if="isSuperAdmin" to="/travel-voucher">Информация о путевке</router-link>
    </div>
    <template v-slot:append>
      <v-btn @click="logout" v-if="isAuthenticated" icon="mdi-logout"></v-btn>
      <router-link to="/login"><v-btn v-if="!isAuthenticated" icon="mdi-login"></v-btn></router-link>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
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
</style>

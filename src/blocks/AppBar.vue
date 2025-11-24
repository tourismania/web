<script lang="ts">
import {defineComponent} from 'vue'
import {useAuthStore} from "@/stores/auth.ts";
import {mapStores} from "pinia";

export default defineComponent({
  name: "AppBar",
  computed: {
    ...mapStores(useAuthStore),
    value: {
      get() {
        return this.modelValue
      },
      set(value: any) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  props: {
    isAuthenticated: Boolean,
    isSuperAdmin: Boolean,
    modelValue: Boolean
  },
  methods: {
    logout(): void {
      const authStore = useAuthStore();
      authStore.clearToken();
      location.assign('/');
    }
  },
  emits: ['update:modelValue'],
})
</script>

<template>
  <v-app-bar class="app__bar" :elevation="2">
    <template v-slot:prepend>
      <router-link v-if="!isSuperAdmin" to="/"><img src="../assets/logos/logo_symbol.png" alt=""></router-link>
      <v-app-bar-nav-icon v-if="isSuperAdmin" @click.stop="value = !value" variant="text"></v-app-bar-nav-icon>
    </template>
    <div class="app__bar__menu">
      <!--      <router-link v-if="isSuperAdmin" to="/travel-voucher">Информация о путевке</router-link>-->
    </div>
    <template v-slot:append>
      <v-btn @click="logout" v-if="isAuthenticated" icon="mdi-logout"></v-btn>
      <router-link v-else to="/login"><v-btn icon="mdi-login"></v-btn></router-link>
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

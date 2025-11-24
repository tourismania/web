<script setup lang="ts">
import {RouterView} from "vue-router";
import {useUserStore} from "@/stores/user.ts";
import {onMounted, ref} from "vue";
import SocialLinksFooter from "@/blocks/SocialLinksFooter.vue";
import AppBar from "@/blocks/AppBar.vue";

const userStore = useUserStore();
const isAuthenticated = ref<boolean>(false);
const isSuperAdmin = ref<boolean>(false);

onMounted(() => {
  fetchCurrentUser();
})

function fetchCurrentUser(): void {
  userStore.loadCurrentUser().finally(() => {
    isAuthenticated.value = userStore.isAuthenticated;
    isSuperAdmin.value = userStore.isSuperAdmin;
  });
}

</script>

<template>
    <v-app>
      <AppBar :is-authenticated="isAuthenticated" :is-super-admin="isSuperAdmin" />

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

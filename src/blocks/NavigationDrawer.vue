<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "NavigationDrawer",
  props: {
    modelValue: Boolean
  },
  emits: {
    'update:modelValue': (value: boolean) => true
  },
  computed: {
    value: {
      get(): boolean {
        return this.modelValue
      },
      set(value: boolean) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
</script>

<template>
  <v-navigation-drawer
      v-model="value"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
      width="300"
  >
    <v-list nav>
      <v-list-item prepend-icon="mdi-home" title="Главная" value="home" href="/" :link="true"></v-list-item>
      <v-list-item prepend-icon="mdi-wallet-travel" title="Путевка" value="travel-voucher" href="/travel-voucher" :link="true"></v-list-item>
      <v-list-item prepend-icon="mdi-clock-start" title="Управление предложениями" href="/offers" :link="true" value="offer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
</style>

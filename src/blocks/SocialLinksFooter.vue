<script lang="ts">
import {defineComponent} from 'vue'
import IconTelegram from "@/components/icons/IconTelegram.vue";
import IconInstagram from "@/components/icons/IconInstagram.vue";
import IconYandex from "@/components/icons/IconYandex.vue";

export default defineComponent({
  name: "SocialLinksFooter",
  components: {IconYandex, IconInstagram, IconTelegram},
  methods: {
    windowOpen: function (url: string): void {
      window.open(url, '_blank');
    }
  }
})
</script>

<template>
  <div class="block-social-links-footer">
    <div class="block-social-links-footer__title">Следите за новостями:</div>
    <div><span class="block-social-links-footer__link" @click="windowOpen('https://www.instagram.com/shadrinuliya?igsh=OWZneWxjZWw4MHJ4')"><IconInstagram :width="30" :height="30" /></span></div>
    <div><span class="block-social-links-footer__link" @click="windowOpen('https://dzen.ru/shadrinuliya')"><IconYandex :width="30" :height="30" /></span></div>
    <div><span class="block-social-links-footer__link" @click="windowOpen('https://t.me/tourismania')"><IconTelegram :width="30" :height="30" /></span></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables';

.block-social-links-footer {
  font-family: $font-family;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  text-align: center;

  & div {
    margin: 0 15px;
  }

  & &__title {
    font-size: 25px;
    font-weight: 700;
  }

  & &__link:hover {
    cursor: pointer;
    opacity: 0.7;
    transition: 0.2s;
  }
}
</style>

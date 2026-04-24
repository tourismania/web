<script setup lang="ts">
function goTo(url: string): void {
  window.open(url, '_blank')
}
</script>

<template>
  <div style="background-color: #001d1cd4; padding: 16px; font-family: Roboto, sans-serif">
    <v-text-field label="Label"></v-text-field>
    <v-date-picker></v-date-picker>
    <v-text-field label="Label"></v-text-field>
    <v-text-field label="Label"></v-text-field>
    <v-text-field label="Label"></v-text-field>
    <v-text-field label="Label"></v-text-field>
    <v-text-field label="Label"></v-text-field>
    <v-text-field label="Label"></v-text-field>
    <div class="header">
      <h1 class="text-center">Путешествие Индия + Мальдивы</h1>
      <h2 class="text-center">1 - 22 февраля</h2>
      <br/>
      <p>*Стоимость в рублях актуальна на день получения предложения и зависит от курса валюты
        Стоимость и наличие не гарантируются до момента бронирования. При изменении дат бронирования, стоимость может меняться.</p>
    </div>
    <v-divider  class="ma-5"></v-divider>
    <div class="flight">
      <h2><v-icon icon="mdi-airplane"></v-icon> Екатеринбург - Дубай - Тхируванантхапурам</h2>
      <h3>= 118 241 RUB</h3>
      <div class="flight-description">
        <img class="w-100" src="https://cp.unisender.com/en/v5/user-files?userId=7773646&resource=himg&disposition=inline&name=669ebqmmdob7dfqbuq3tyz5rtufnii95c8j31pjkgrnh6yiif831jzhg4jyqekerupggixwrgis89x7mssmscpyd9u8f7fjnur99ymxk1qwfdknnhsaasfsk6k75w8ukmc3pmwx7wfi17epws6kd7fksjqo"  alt=""/>
      </div>
    </div>
    <v-divider class="ma-5"></v-divider>
    <div class="hotels">
      <h2>🏨 Аюрведические отели в Тхируванантхапурам</h2>
      <p class="date">2-16 февраля</p>
      <div class="hotel-item">
        <h3>1. Dr.Franklin's Panchakarma & Ayurveda Centre 3*</h3>
        <h4>= 157 691 RUB</h4>
        <div class="hotel-decsription">
          <p>Аюрведический центр с медицинским подходом к оздоровлению. Уютная зелёная территория. Основное направление - лечение по аюрведическим программам, йога, медитации, вегетарианское питание.
            Минусы: нет собственного пляжа, старые корпуса и простой интерьер. Строгий режим и диета</p>
          <img class="w-100" src="https://cp.unisender.com/en/v5/user-files?userId=7773646&resource=himg&disposition=inline&name=6t9qmm3tmdbesjqbuq3tyz5rtufnii95c8j31pjkgrnh6yiif831jzhg4jyqekerutpux1g3ecucunoug7swka9cf3ufw11163c7unaxfxaczxzkiqjdwc5fzkp8x7cr4p1mg9uawqddncjsdjsrxgaaosc" />
          <p>
            Deluxe room с кондиционером
            FB (полный пансион) + AYURVEDA PACKAGE
          </p>
          <img class="w-100" src="https://cp.unisender.com/en/v5/user-files?userId=7773646&resource=himg&disposition=inline&name=6u5f6663cxqwx9qbuq3tyz5rtufnii95c8j31pjkgrnh6yiif831jzhg4jyqekerux416rahrotqg6z9r4a3hr4k659grs6x8ohqmoiaxkxi3sk5iwk59egnixaowfkq9p1mg9uawqddnptqduqjfjnfaqr">
        </div>
        <div class="text-center ma-5">
          <v-btn @click="goTo('https://r-express.ru/guide/india/hotel/dr/')" prepend-icon="mdi-eye" variant="outlined">
            Посмотреть
          </v-btn>
        </div>
      </div>
      <div class="hotel-item">
        <h3>2. Isola Di Coco 4*</h3>
        <h4>= 251 226 RUB</h4>
        <div class="hotel-decsription">
          <p>Курортный отель среди кокосовых пальм на берегу лагуны. На территории центр аюрведы с профессиональными врачами, программы детокса и панчакармы, ежедневные занятия йогой и медитацией.
            Минусы: не первая линия моря, местами устаревшие номера, возможны перебои в обслуживании и скромный выбор блюд.</p>
          <img class="w-100" src="https://cp.unisender.com/en/v5/user-files?userId=7773646&resource=himg&disposition=inline&name=6t9qmm3tmdbesjqbuq3tyz5rtufnii95c8j31pjkgrnh6yiif831jzhg4jyqekerutpux1g3ecucunoug7swka9cf3ufw11163c7unaxfxaczxzkiqjdwc5fzkp8x7cr4p1mg9uawqddncjsdjsrxgaaosc" />
          <p>
            Heritage room с кондиционером
            FB (полный пансион) + AYURVEDA PACKAGE
          </p>
          <img class="w-100" src="https://cp.unisender.com/en/v5/user-files?userId=7773646&resource=himg&disposition=inline&name=6u5f6663cxqwx9qbuq3tyz5rtufnii95c8j31pjkgrnh6yiif831jzhg4jyqekerux416rahrotqg6z9r4a3hr4k659grs6x8ohqmoiaxkxi3sk5iwk59egnixaowfkq9p1mg9uawqddnptqduqjfjnfaqr">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>

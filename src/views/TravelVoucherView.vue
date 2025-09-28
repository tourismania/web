<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'TravelVoucherView',
  setup: function () {

    const tab = ref(null);

    return { tab }
  }

})
</script>

<template>
  <main>
    <div class="main__travel-voucher">
      <div class="main__travel-voucher__header">
        <h1>Информация о путевке</h1>
      </div>
      <div class="main__travel-voucher__body">

        <v-card style="background: transparent">
          <v-tabs
              v-model="tab"
          >
            <v-tab value="one">Маршрутный лист с ценами</v-tab>
            <v-tab value="two">Программа Нью-Йорк</v-tab>
            <v-tab value="three">Программа Орландо</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one">
                <div class="main__travel-voucher__body__routes">
                  <h2>Маршрутный лист с ценами</h2>
                  <h3>Перелет</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Перевозчик</th>
                      <th class="text-left">Рейс №</th>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Вылет</th>
                      <th class="text-left">Время отправления</th>
                      <th class="text-left">Время в пути</th>
                      <th class="text-left">Время прибытия</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>Ural Airlines</td>
                      <td>U6 773</td>
                      <td>26.09.2025</td>
                      <td>Екатеринбург (Кольцово) - Стамбул (ISTANBUL AIRPORT)</td>
                      <td>07:20</td>
                      <td>5 ч 25 мин</td>
                      <td>10:45</td>
                      <td>129 692,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>Turkish Airlines</td>
                      <td>TK 11</td>
                      <td>27.09.2025</td>
                      <td>Стамбул (ISTANBUL AIRPORT) - Нью-Йорк (Джон Ф. Кеннеди)</td>
                      <td>18:45</td>
                      <td>10 ч 55 мин</td>
                      <td>22:40</td>
                      <td>272 691,00 ₽</td>
                    </tr>
                    <tr>
                      <td colspan="7"></td>
                      <td class="text-left">Итого: 272 691,00 ₽</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Жилье</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Размещение</th>
                      <th class="text-left">Кол-во ночей</th>
                      <th class="text-left">Город и адрес отеля</th>
                      <th class="text-left">Доп.инфа о размещении</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>26 - 27 сентября</td>
                      <td>The Haze Karaköy</td>
                      <td>1</td>
                      <td>TR, Istanbul, Necatibey Caddesi No:36-38, Karaköy</td>
                      <td>Включены завтраки для взрослых, завтрак для ребенка оплачивается на месте (20 евро) </td>
                      <td>17766,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>27 сентября - 2 октября</td>
                      <td>The Fifty Sonesta Hotel New York 4*</td>
                      <td>5</td>
                      <td>155 East 50th Street, New York, NY 10022</td>
                      <td>Без завтраков, номер с мини-кухней. На месте оплачивается сбор 224 USD</td>
                      <td>254709,00 ₽</td>
                    </tr>
                    <tr>
                      <td colspan="5"></td>
                      <td class="text-left">Итого: 272 691,00 ₽</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Общественный транспорт</h3>
                  <h3>Экскурсии и развлечения</h3>
                  <h3>Итого</h3>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item value="two">
                Two
              </v-tabs-window-item>

              <v-tabs-window-item value="three">
                Three
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>

      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main__travel-voucher {
  text-align: center;
  padding: 20px;
}
</style>
